"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export interface UserDoc {
  id: string;
  file_name: string;
  mime_type: string | null;
  status: "analyzing" | "done" | "error";
  doc_key: string | null;
  doc_label: string | null;
  doc_date: string | null;
  expires_at: string | null;
  is_valid: boolean | null;
}

export function useUserDocuments() {
  const { user } = useUser();
  const [docs, setDocs] = useState<UserDoc[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setLoaded(true);
      return;
    }
    const { data } = await supabase
      .from("user_documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocs((data as UserDoc[]) ?? []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files || !user) return;
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return;

      for (const file of Array.from(files)) {
        const safe = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${user.id}/${crypto.randomUUID()}-${safe}`;

        const { error: upErr } = await supabase.storage
          .from("documents")
          .upload(path, file, { contentType: file.type });
        if (upErr) {
          console.error(upErr);
          continue;
        }

        const { data: inserted } = await supabase
          .from("user_documents")
          .insert({
            user_id: user.id,
            storage_path: path,
            file_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
            status: "analyzing",
          })
          .select("*")
          .single();

        if (!inserted) continue;
        const row = inserted as UserDoc;
        setDocs((prev) => [row, ...prev]);

        fetch("/api/documents/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: row.id }),
        })
          .then((r) => r.json())
          .then((res) => {
            setDocs((prev) =>
              prev.map((d) =>
                d.id === row.id
                  ? res.document
                    ? { ...d, ...res.document }
                    : { ...d, status: "error" }
                  : d,
              ),
            );
          })
          .catch(() =>
            setDocs((prev) =>
              prev.map((d) => (d.id === row.id ? { ...d, status: "error" } : d)),
            ),
          );
      }
    },
    [user],
  );

  const remove = useCallback(async (doc: UserDoc) => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    await supabase.from("user_documents").delete().eq("id", doc.id);
  }, []);

  return { docs, loaded, uploadFiles, remove };
}

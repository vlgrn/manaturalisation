"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Trash2, UploadCloud, FileText, Check, TriangleAlert, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { cn } from "@/lib/utils";

interface UserDoc {
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

const ACCEPT = "application/pdf,image/png,image/jpeg,image/webp";

export function DocumentUpload() {
  const { user } = useUser();
  const [docs, setDocs] = useState<UserDoc[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
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

  const handleFiles = useCallback(
    async (files: FileList | null) => {
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

        if (inserted) {
          setDocs((prev) => [inserted as UserDoc, ...prev]);
          // Fire analysis; update the row in place when it returns.
          fetch("/api/documents/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: (inserted as UserDoc).id }),
          })
            .then((r) => r.json())
            .then((res) => {
              if (res.document) {
                setDocs((prev) =>
                  prev.map((d) => (d.id === res.document.id ? { ...d, ...res.document } : d)),
                );
              } else {
                setDocs((prev) =>
                  prev.map((d) =>
                    d.id === (inserted as UserDoc).id ? { ...d, status: "error" } : d,
                  ),
                );
              }
            })
            .catch(() =>
              setDocs((prev) =>
                prev.map((d) =>
                  d.id === (inserted as UserDoc).id ? { ...d, status: "error" } : d,
                ),
              ),
            );
        }
      }
    },
    [user],
  );

  async function remove(doc: UserDoc) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    await supabase.from("user_documents").delete().eq("id", doc.id);
  }

  return (
    <div>
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-ink-300/70 bg-slate-50 hover:border-brand-500",
        )}
      >
        <UploadCloud className="size-7 text-ink-400" />
        <p className="mt-3 font-medium text-ink-900">
          Glissez vos documents ici, ou cliquez pour les choisir
        </p>
        <p className="mt-1 text-sm text-ink-500">
          PDF ou image. L&apos;analyse identifie chaque pièce automatiquement.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 text-xs text-ink-500">
        Vos documents sont stockés chiffrés et privés. Cette analyse est une aide à
        l&apos;organisation, pas un conseil juridique.
      </p>

      {/* Uploaded documents */}
      {loaded && docs.length > 0 && (
        <ul className="mt-6 space-y-3">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-start gap-3 rounded-xl border border-ink-300/50 bg-white p-4"
            >
              <FileText className="mt-0.5 size-5 shrink-0 text-ink-400" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium text-ink-900">{doc.file_name}</span>
                  <DocBadge doc={doc} />
                </div>
                {doc.status === "done" && doc.doc_label && (
                  <p className="mt-1 text-sm text-ink-600">
                    {doc.doc_label}
                    {doc.doc_date && (
                      <span className="text-ink-500">
                        {" · établi le "}
                        {fmt(doc.doc_date)}
                      </span>
                    )}
                    {doc.expires_at && (
                      <span className={doc.is_valid ? "text-emerald-600" : "text-brand-600"}>
                        {doc.is_valid ? " · valable jusqu'au " : " · expiré le "}
                        {fmt(doc.expires_at)}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(doc)}
                aria-label="Supprimer"
                className="shrink-0 rounded p-1 text-ink-400 transition hover:text-brand-600"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DocBadge({ doc }: { doc: UserDoc }) {
  if (doc.status === "analyzing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
        <Loader2 className="size-3 animate-spin" />
        Analyse…
      </span>
    );
  }
  if (doc.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
        <X className="size-3" strokeWidth={2.5} />
        Échec de l&apos;analyse
      </span>
    );
  }
  // done
  if (!doc.doc_key) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
        Document non reconnu
      </span>
    );
  }
  if (doc.is_valid === false) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <TriangleAlert className="size-3" strokeWidth={2.5} />
        Périmé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      <Check className="size-3" strokeWidth={2.5} />
      Présent
    </span>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
}

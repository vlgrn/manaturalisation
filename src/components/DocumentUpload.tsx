"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, UploadCloud, FileText, Check, TriangleAlert, X } from "lucide-react";
import type { UserDoc } from "@/lib/useUserDocuments";
import { cn } from "@/lib/utils";

const ACCEPT = "application/pdf,image/png,image/jpeg,image/webp";

export function DocumentUpload({
  docs,
  loaded,
  onFiles,
  onRemove,
}: {
  docs: UserDoc[];
  loaded: boolean;
  onFiles: (files: FileList | File[] | null) => void;
  onRemove: (doc: UserDoc) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition",
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-ink-300/70 bg-slate-50 hover:border-brand-500",
        )}
      >
        <UploadCloud className="size-6 text-ink-400" />
        <p className="mt-2 text-sm font-medium text-ink-900">
          Glissez vos documents, ou cliquez
        </p>
        <p className="mt-1 text-xs text-ink-500">PDF ou image · identifiés automatiquement</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 text-xs text-ink-500">
        Stockés chiffrés et privés. Aide à l&apos;organisation, pas un conseil juridique.
      </p>

      {loaded && docs.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-start gap-2.5 rounded-xl border border-ink-300/50 bg-white p-3"
            >
              <FileText className="mt-0.5 size-4 shrink-0 text-ink-400" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-ink-900">
                    {doc.file_name}
                  </span>
                  <DocBadge doc={doc} />
                </div>
                {doc.status === "done" && doc.doc_label && (
                  <p className="mt-0.5 text-xs text-ink-600">
                    {doc.doc_label}
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
                onClick={() => onRemove(doc)}
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
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-600">
        <Loader2 className="size-3 animate-spin" />
        Analyse…
      </span>
    );
  }
  if (doc.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
        <X className="size-3" strokeWidth={2.5} />
        Échec
      </span>
    );
  }
  if (!doc.doc_key) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-600">
        Non reconnu
      </span>
    );
  }
  if (doc.is_valid === false) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        <TriangleAlert className="size-3" strokeWidth={2.5} />
        Périmé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <Check className="size-3" strokeWidth={2.5} />
      Présent
    </span>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
}

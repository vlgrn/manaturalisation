"use client";

import { useState } from "react";
import { MAILTO_TEMPLATES } from "@/content/documents";
import type { DocProgress, DocStatus, DocumentSpec } from "@/lib/types";
import { formatDate, parseDate } from "@/lib/sequencer";

const STATUS_OPTIONS: { value: DocStatus; label: string }[] = [
  { value: "not_started", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "obtained", label: "Obtenu" },
];

const SPEED_LABEL: Record<DocumentSpec["speed"], { label: string; cls: string }> = {
  instant: { label: "Immédiat", cls: "bg-slate-100 text-ink-700" },
  fast: { label: "Rapide", cls: "bg-emerald-50 text-emerald-700" },
  medium: { label: "Moyen", cls: "bg-sky-50 text-sky-700" },
  slow: { label: "Lent (semaines/mois)", cls: "bg-amber-50 text-amber-800" },
};

export function DocumentCard({
  doc,
  prog,
  onSetStatus,
  onSetDate,
  warning,
}: {
  doc: DocumentSpec;
  prog: DocProgress;
  onSetStatus: (key: string, status: DocStatus) => void;
  onSetDate: (key: string, field: "requestedDate" | "obtainedDate", iso: string) => void;
  warning?: string;
}) {
  const [open, setOpen] = useState(false);
  const speed = SPEED_LABEL[doc.speed];
  const expiry = prog.expiresDate ? parseDate(prog.expiresDate) : undefined;
  const expired = expiry ? expiry.getTime() < Date.now() : false;

  const mailto =
    doc.action.type === "mailto" ? MAILTO_TEMPLATES[doc.action.mailtoKey] : undefined;
  const mailtoHref = mailto
    ? `mailto:${mailto.to}?subject=${encodeURIComponent(mailto.subject)}&body=${encodeURIComponent(
        mailto.body()
      )}`
    : undefined;

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-ink-700">
            {doc.number}
          </span>
          <div>
            <h3 className="font-semibold leading-snug text-ink-900">{doc.name}</h3>
            <p className="mt-0.5 text-sm text-ink-500">{doc.summary}</p>
          </div>
        </div>
        <span className={`badge shrink-0 ${speed.cls}`}>{speed.label}</span>
      </div>

      {/* Validity + dates */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="badge bg-slate-100 text-ink-700">
          {doc.validityMonths == null
            ? "Ne périme pas"
            : `Valable ${doc.validityMonths} mois`}
        </span>
        {expiry && (
          <span
            className={`badge ${
              expired ? "bg-brand-100 text-brand-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {expired ? "Expiré le" : "Expire le"} {formatDate(expiry)}
          </span>
        )}
      </div>

      {warning && (
        <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-800">{warning}</p>
      )}

      {/* Status selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSetStatus(doc.key, opt.value)}
            className={
              prog.status === opt.value
                ? "btn-primary py-1.5 text-xs"
                : "btn-secondary py-1.5 text-xs"
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Date inputs when relevant */}
      {prog.status !== "not_started" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-ink-600">
            Demandé le
            <input
              type="date"
              value={prog.requestedDate ? prog.requestedDate.slice(0, 10) : ""}
              onChange={(e) =>
                onSetDate(
                  doc.key,
                  "requestedDate",
                  e.target.value ? new Date(e.target.value).toISOString() : ""
                )
              }
              className="mt-1 block w-full rounded-lg border border-ink-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </label>
          {prog.status === "obtained" && (
            <label className="text-xs text-ink-600">
              Obtenu le
              <input
                type="date"
                value={prog.obtainedDate ? prog.obtainedDate.slice(0, 10) : ""}
                onChange={(e) =>
                  onSetDate(
                    doc.key,
                    "obtainedDate",
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
                className="mt-1 block w-full rounded-lg border border-ink-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
              />
            </label>
          )}
        </div>
      )}

      {/* Action + detail */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {doc.action.type === "link" && (
          <a href={doc.action.href} target="_blank" rel="noreferrer" className="btn-secondary py-1.5 text-xs">
            {doc.action.label} ↗
          </a>
        )}
        {doc.action.type === "mailto" && mailtoHref && (
          <a href={mailtoHref} className="btn-secondary py-1.5 text-xs">
            ✉️ {doc.action.label}
          </a>
        )}
        {doc.action.type === "self" && (
          <span className="text-xs text-ink-500">{doc.action.label}</span>
        )}
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost py-1.5 text-xs">
          {open ? "Masquer le détail" : "Détail"}
        </button>
      </div>

      {open && (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-ink-700">
          {doc.detail}
        </p>
      )}
    </div>
  );
}

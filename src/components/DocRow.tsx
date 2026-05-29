"use client";

import { useState } from "react";
import { Check, ChevronDown, ExternalLink, Mail, TriangleAlert } from "lucide-react";
import { MAILTO_TEMPLATES } from "@/content/documents";
import type { DocProgress, DocStatus, DocumentSpec } from "@/lib/types";
import { formatDate, parseDate } from "@/lib/sequencer";
import { cn } from "@/lib/utils";

const STATUSES: { value: DocStatus; label: string }[] = [
  { value: "not_started", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "obtained", label: "Obtenu" },
];

export function DocRow({
  doc,
  prog,
  onSetStatus,
  onSetDate,
  muted = false,
  detected,
}: {
  doc: DocumentSpec;
  prog: DocProgress;
  onSetStatus: (key: string, status: DocStatus) => void;
  onSetDate: (key: string, field: "requestedDate" | "obtainedDate", iso: string) => void;
  muted?: boolean;
  detected?: { is_valid: boolean | null };
}) {
  const [open, setOpen] = useState(false);
  const status = prog.status ?? "not_started";
  const expiry = prog.expiresDate ? parseDate(prog.expiresDate) : undefined;
  const expired = expiry ? expiry.getTime() < Date.now() : false;

  const mailto =
    doc.action.type === "mailto" ? MAILTO_TEMPLATES[doc.action.mailtoKey] : undefined;
  const mailtoHref = mailto
    ? `mailto:${mailto.to}?subject=${encodeURIComponent(mailto.subject)}&body=${encodeURIComponent(mailto.body())}`
    : undefined;

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 transition",
        status === "obtained" ? "border-emerald-200" : "border-ink-300/50",
        muted && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <StatusDot status={status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium leading-snug text-ink-900">{doc.name}</h4>
              {detected &&
                (detected.is_valid === false ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <TriangleAlert className="size-3" strokeWidth={2.5} />
                    Détecté · périmé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Check className="size-3" strokeWidth={2.5} />
                    Détecté
                  </span>
                ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Masquer le détail" : "Voir le détail"}
              className="-mr-1 mt-0.5 shrink-0 rounded p-1 text-ink-400 transition hover:text-ink-700"
            >
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>
          </div>
          <p className="mt-0.5 text-sm text-ink-500">{doc.summary}</p>

          {expiry && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                expired ? "text-brand-600" : "text-emerald-600",
              )}
            >
              {expired ? "Expiré le " : "Valable jusqu'au "}
              {formatDate(expiry)}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="inline-flex rounded-lg border border-ink-300/70 p-0.5">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onSetStatus(doc.key, s.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition",
                    status === s.value
                      ? "bg-brand-500 text-white"
                      : "text-ink-500 hover:text-ink-900",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {doc.action.type === "link" && (
              <a
                href={doc.action.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
              >
                {doc.action.label}
                <ExternalLink className="size-3.5" />
              </a>
            )}
            {doc.action.type === "mailto" && mailtoHref && (
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
              >
                <Mail className="size-3.5" />
                {doc.action.label}
              </a>
            )}
            {doc.action.type === "self" && (
              <span className="text-xs text-ink-400">{doc.action.label}</span>
            )}
          </div>

          {open && (
            <div className="mt-3 space-y-3">
              <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-ink-600">
                {doc.detail}
              </p>
              {status !== "not_started" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-ink-600">
                    Demandé le
                    <input
                      type="date"
                      value={prog.requestedDate ? prog.requestedDate.slice(0, 10) : ""}
                      onChange={(e) =>
                        onSetDate(
                          doc.key,
                          "requestedDate",
                          e.target.value ? new Date(e.target.value).toISOString() : "",
                        )
                      }
                      className="mt-1 block w-full rounded-lg border border-ink-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </label>
                  {status === "obtained" && (
                    <label className="text-xs text-ink-600">
                      Obtenu le
                      <input
                        type="date"
                        value={prog.obtainedDate ? prog.obtainedDate.slice(0, 10) : ""}
                        onChange={(e) =>
                          onSetDate(
                            doc.key,
                            "obtainedDate",
                            e.target.value ? new Date(e.target.value).toISOString() : "",
                          )
                        }
                        className="mt-1 block w-full rounded-lg border border-ink-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: DocStatus }) {
  const cls =
    status === "obtained"
      ? "border-emerald-500 bg-emerald-500"
      : status === "in_progress"
        ? "border-amber-400 bg-amber-400"
        : "border-ink-300 bg-white";
  return (
    <span
      className={cn(
        "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
        cls,
      )}
    >
      {status === "obtained" && (
        <svg viewBox="0 0 24 24" className="size-2.5 text-white" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

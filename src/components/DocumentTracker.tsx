"use client";

import { ADULT_DOCUMENTS } from "@/content/documents";
import { computeSequence } from "@/lib/sequencer";
import type { DocStatus, UserProgress } from "@/lib/types";
import { DocumentCard } from "@/components/DocumentCard";

export function DocumentTracker({
  progress,
  onSetStatus,
  onSetDate,
}: {
  progress: UserProgress;
  onSetStatus: (key: string, status: DocStatus) => void;
  onSetDate: (key: string, field: "requestedDate" | "obtainedDate", iso: string) => void;
}) {
  const seq = computeSequence(progress);
  const warningByDoc = new Map(
    seq.warnings.filter((w) => w.level !== "info").map((w) => [w.docKey, w.message])
  );

  const obtained = ADULT_DOCUMENTS.filter(
    (d) => (progress.documents[d.key]?.status ?? "not_started") === "obtained"
  ).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-600">
          {obtained} / {ADULT_DOCUMENTS.length} documents obtenus
        </p>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(obtained / ADULT_DOCUMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ADULT_DOCUMENTS.map((doc) => (
          <DocumentCard
            key={doc.key}
            doc={doc}
            prog={progress.documents[doc.key] ?? { status: "not_started" }}
            onSetStatus={onSetStatus}
            onSetDate={onSetDate}
            warning={warningByDoc.get(doc.key)}
          />
        ))}
      </div>
    </div>
  );
}

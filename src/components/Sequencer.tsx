"use client";

import { computeSequence, formatDate } from "@/lib/sequencer";
import type { DocStatus, DocumentSpec, UserProgress } from "@/lib/types";

export function Sequencer({
  progress,
  onSetStatus,
}: {
  progress: UserProgress;
  onSetStatus: (key: string, status: DocStatus) => void;
}) {
  const seq = computeSequence(progress);

  const blockers = seq.warnings.filter((w) => w.level === "block");
  const warns = seq.warnings.filter((w) => w.level === "warn");
  const infos = seq.warnings.filter((w) => w.level === "info");

  return (
    <div className="space-y-8">
      {/* Explainer */}
      <div className="card bg-slate-50">
        <h2 className="font-semibold">Le bon ordre, pour ne rien laisser périmer</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          Commencez par les documents <strong>lents</strong> (acte d'état civil, certificat fide,
          test) — ils prennent des semaines voire des mois mais ne périment pas. Gardez pour la fin
          les attestations à <strong>courte validité</strong> (impôts, poursuites, Hospice général,
          valables 3 mois). Ainsi, quand votre dossier est prêt, rien n'a expiré.
        </p>
      </div>

      {/* Alerts */}
      {(blockers.length > 0 || warns.length > 0) && (
        <div className="space-y-2">
          {blockers.map((w, i) => (
            <div key={`b${i}`} className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">
              {w.message}
            </div>
          ))}
          {warns.map((w, i) => (
            <div key={`w${i}`} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Phase 1 — start now */}
      <PhaseBlock
        badge="Étape 1"
        title="À commencer maintenant (en parallèle)"
        tone="amber"
        docs={seq.startNow}
        progress={progress}
        onSetStatus={onSetStatus}
        hint="Délais longs, pas de péremption. Lancez ces démarches sans attendre."
      />

      {/* Phase 2 — short validity, gated */}
      <PhaseBlock
        badge="Étape 2"
        title="À demander en dernier (courte validité)"
        tone="brand"
        docs={seq.requestLast}
        progress={progress}
        onSetStatus={onSetStatus}
        locked={!seq.slowDocsReady}
        hint={
          seq.slowDocsReady
            ? "Vos documents lents sont prêts : vous pouvez demander ces attestations."
            : "⚠️ Attendez que les documents lents soient obtenus avant de les demander (validité 3 mois)."
        }
      />

      {/* Phase 3 — anytime */}
      <PhaseBlock
        badge="Quand vous voulez"
        title="Sans contrainte d'ordre"
        tone="slate"
        docs={seq.anytime}
        progress={progress}
        onSetStatus={onSetStatus}
        hint="Rapides à obtenir, aucune péremption."
      />

      {/* Safe mail date */}
      {seq.earliestSafeMailDate && (
        <div className="card border-brand-100 bg-brand-50">
          <div className="text-sm uppercase tracking-wide text-brand-600">
            Date d'envoi sûre la plus proche
          </div>
          <div className="mt-1 text-2xl font-extrabold text-ink-900">
            {formatDate(seq.earliestSafeMailDate)}
          </div>
          <p className="mt-1 text-sm text-ink-600">
            Estimation basée sur les délais des documents lents encore en attente, plus le temps
            d'obtention des attestations à courte validité. Mettez à jour les statuts pour l'affiner.
          </p>
        </div>
      )}

      {infos.length > 0 && (
        <details className="text-sm text-ink-600">
          <summary className="cursor-pointer">Conseils ({infos.length})</summary>
          <ul className="mt-2 space-y-1">
            {infos.map((w, i) => (
              <li key={i}>• {w.message}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

const TONES: Record<string, string> = {
  amber: "border-amber-200",
  brand: "border-brand-200",
  slate: "border-ink-300/60",
};
const BADGE_TONES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800",
  brand: "bg-brand-100 text-brand-700",
  slate: "bg-slate-100 text-ink-700",
};

function PhaseBlock({
  badge,
  title,
  tone,
  docs,
  progress,
  onSetStatus,
  hint,
  locked,
}: {
  badge: string;
  title: string;
  tone: string;
  docs: DocumentSpec[];
  progress: UserProgress;
  onSetStatus: (key: string, status: DocStatus) => void;
  hint: string;
  locked?: boolean;
}) {
  if (docs.length === 0) return null;
  return (
    <div className={`rounded-xl border ${TONES[tone]} p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${BADGE_TONES[tone]}`}>{badge}</span>
        <h3 className="font-semibold text-ink-900">{title}</h3>
        {locked && <span className="badge bg-slate-200 text-ink-700">🔒 en attente</span>}
      </div>
      <p className="mt-2 text-sm text-ink-600">{hint}</p>
      <div className="mt-4 space-y-2">
        {docs.map((doc) => {
          const status = progress.documents[doc.key]?.status ?? "not_started";
          return (
            <div
              key={doc.key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <StatusDot status={status} />
                <span className="text-sm font-medium text-ink-900">{doc.name}</span>
              </div>
              <div className="flex gap-1.5">
                {(["not_started", "in_progress", "obtained"] as DocStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => onSetStatus(doc.key, s)}
                    className={
                      status === s ? "btn-primary py-1 text-xs" : "btn-ghost py-1 text-xs"
                    }
                    title={STATUS_LABEL[s]}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<DocStatus, string> = {
  not_started: "À faire",
  in_progress: "En cours",
  obtained: "Obtenu",
};

function StatusDot({ status }: { status: DocStatus }) {
  const cls =
    status === "obtained"
      ? "bg-emerald-500"
      : status === "in_progress"
        ? "bg-amber-500"
        : "bg-ink-300";
  return <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />;
}

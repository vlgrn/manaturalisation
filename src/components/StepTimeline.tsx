"use client";

import { STEPS, getStep } from "@/content/steps";
import type { StepStatus, UserProgress } from "@/lib/types";

const NEXT_STATUS: Record<StepStatus, StepStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export function StepTimeline({
  progress,
  onSetStatus,
}: {
  progress: UserProgress;
  onSetStatus: (key: string, status: StepStatus) => void;
}) {
  // Current step = first non-done step.
  const currentIndex = STEPS.findIndex((s) => (progress.steps[s.key] ?? "todo") !== "done");

  return (
    <div>
      <p className="mb-6 text-sm text-ink-600">
        De la demande de dossier au passeport suisse. Cliquez sur la pastille pour faire avancer une
        étape (à faire → en cours → terminé).
      </p>
      <ol className="relative space-y-1">
        {STEPS.map((step, i) => {
          const status = progress.steps[step.key] ?? "todo";
          const isCurrent = i === currentIndex;
          const parallel = step.parallelWith
            ?.map((k) => getStep(k)?.title)
            .filter(Boolean) as string[] | undefined;
          return (
            <li key={step.key} className="relative flex gap-4 pb-6">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <span className="absolute left-[15px] top-8 h-full w-px bg-ink-300/60" aria-hidden />
              )}
              <button
                onClick={() => onSetStatus(step.key, NEXT_STATUS[status])}
                className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                  status === "done"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : status === "in_progress"
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-300 bg-white text-ink-500"
                }`}
                title="Changer le statut"
              >
                {status === "done" ? "✓" : step.number}
              </button>
              <div
                className={`flex-1 rounded-xl border p-4 ${
                  isCurrent ? "border-brand-200 bg-brand-50" : "border-ink-300/60 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink-900">{step.title}</h3>
                  {isCurrent && (
                    <span className="badge bg-brand-100 text-brand-700">Étape actuelle</span>
                  )}
                  <span
                    className={`badge ${
                      step.actor === "you"
                        ? "bg-sky-50 text-sky-700"
                        : "bg-slate-100 text-ink-600"
                    }`}
                  >
                    {step.actor === "you" ? "Vous" : "Administration"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-700">{step.description}</p>
                {parallel && parallel.length > 0 && (
                  <p className="mt-2 text-xs text-ink-500">
                    ↔ En parallèle de : {parallel.join(", ")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

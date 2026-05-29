"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/useProgress";
import { hasPaid, markPaid } from "@/lib/payment";
import { Paywall } from "@/components/Paywall";
import { DocumentTracker } from "@/components/DocumentTracker";
import { Sequencer } from "@/components/Sequencer";
import { StepTimeline } from "@/components/StepTimeline";
import { CostsPanel } from "@/components/CostsPanel";
import { computeSequence } from "@/lib/sequencer";

type Tab = "sequenceur" | "documents" | "etapes" | "couts";

const TABS: { key: Tab; label: string }[] = [
  { key: "sequenceur", label: "Séquenceur" },
  { key: "documents", label: "Documents" },
  { key: "etapes", label: "Étapes" },
  { key: "couts", label: "Coûts" },
];

export function Dashboard() {
  const { progress, setDocStatus, setDocDate, setStepStatus } = useProgress();
  const [tab, setTab] = useState<Tab>("sequenceur");
  const [paid, setPaid] = useState<boolean | null>(null);

  // On mount: honour ?paid=1 returned from Stripe Checkout, then read access.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      markPaid();
      // Clean the URL.
      window.history.replaceState({}, "", window.location.pathname);
    }
    setPaid(hasPaid());
  }, []);

  if (progress === null || paid === null) {
    return (
      <div className="container-page py-20 text-center text-ink-500">Chargement…</div>
    );
  }

  if (!paid) {
    return <Paywall progress={progress} />;
  }

  const seq = computeSequence(progress);
  const blockers = seq.warnings.filter((w) => w.level === "block").length;

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon dossier</h1>
          <p className="mt-1 text-ink-700">
            Avancez dans le bon ordre. Vos données sont enregistrées sur cet appareil.
          </p>
        </div>
        {seq.earliestSafeMailDate && (
          <SafeMailBadge
            date={seq.earliestSafeMailDate}
            ready={seq.slowDocsReady}
            blockers={blockers}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-ink-300/50">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key
                ? "text-brand-600"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {t.label}
            {t.key === "sequenceur" && blockers > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
                {blockers}
              </span>
            )}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "sequenceur" && (
          <Sequencer progress={progress} onSetStatus={setDocStatus} />
        )}
        {tab === "documents" && (
          <DocumentTracker
            progress={progress}
            onSetStatus={setDocStatus}
            onSetDate={setDocDate}
          />
        )}
        {tab === "etapes" && (
          <StepTimeline progress={progress} onSetStatus={setStepStatus} />
        )}
        {tab === "couts" && <CostsPanel />}
      </div>
    </div>
  );
}

function SafeMailBadge({
  date,
  ready,
  blockers,
}: {
  date: Date;
  ready: boolean;
  blockers: number;
}) {
  const formatted = date.toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div
      className={`rounded-xl border p-3 text-sm ${
        blockers > 0
          ? "border-brand-200 bg-brand-50"
          : ready
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-ink-500">
        Date d'envoi sûre estimée
      </div>
      <div className="mt-0.5 text-lg font-bold text-ink-900">{formatted}</div>
      <div className="text-xs text-ink-600">
        {blockers > 0
          ? "Un document a expiré, à corriger."
          : ready
            ? "Documents lents prêts : vous pouvez demander les attestations."
            : "En attente des documents lents."}
      </div>
    </div>
  );
}

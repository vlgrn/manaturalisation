"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { hasPaid, markPaid } from "@/lib/payment";
import { useUser, signOut } from "@/lib/useUser";
import { useUserDocuments, type UserDoc } from "@/lib/useUserDocuments";
import { supabaseConfigured } from "@/lib/env";
import { trackOnce } from "@/lib/analytics";
import { Paywall } from "@/components/Paywall";
import { AuthForm } from "@/components/AuthForm";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocRow } from "@/components/DocRow";
import { StepTimeline } from "@/components/StepTimeline";
import { CostsPanel } from "@/components/CostsPanel";
import { ADULT_DOCUMENTS } from "@/content/documents";
import { computeSequence, formatDate } from "@/lib/sequencer";
import type { DocumentSpec, UserProgress } from "@/lib/types";

const RUBRIQUES = [
  { key: "now", label: "À commencer maintenant" },
  { key: "last", label: "À demander en dernier" },
  { key: "info", label: "Procédure & coûts" },
];

function SignInGate() {
  return (
    <div className="container-page flex min-h-[70vh] max-w-md flex-col items-center justify-center py-12 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="MaNaturalisation" className="h-24 w-auto" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
        Accédez à votre dossier
      </h1>
      <p className="mt-2 text-ink-600">
        Connectez-vous ou créez un compte gratuit pour suivre vos documents.
      </p>
      <div className="mt-8 w-full">
        <AuthForm next="/tableau-de-bord" />
      </div>
      <p className="mt-4 text-xs text-ink-500">
        Aucune donnée n&apos;est partagée avec l&apos;administration.
      </p>
    </div>
  );
}

export function Dashboard() {
  const { progress, setDocStatus, setDocDate, setStepStatus } = useProgress();
  const { user, loading: authLoading } = useUser();
  const documents = useUserDocuments();
  const [paid, setPaid] = useState<boolean | null>(null);
  const [tab, setTab] = useState<string>("now");

  // Best detected upload per canonical document key (docs are sorted newest-first).
  const detectedByKey = useMemo(() => {
    const map = new Map<string, UserDoc>();
    for (const d of documents.docs) {
      if (d.status === "done" && d.doc_key) {
        const existing = map.get(d.doc_key);
        if (!existing || (existing.is_valid === false && d.is_valid !== false)) {
          map.set(d.doc_key, d);
        }
      }
    }
    return map;
  }, [documents.docs]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      markPaid();
      window.history.replaceState({}, "", window.location.pathname);
    }
    setPaid(hasPaid());
  }, []);

  // Ad conversion: an authenticated user reached the dashboard = a win.
  // Fires once per user (Google or email login, or a returning session).
  useEffect(() => {
    if (user?.id) {
      trackOnce("qualify_lead", `mn_conv_lead_${user.id}`, { method: "dashboard" });
    }
  }, [user?.id]);

  if (progress === null || paid === null || (supabaseConfigured && authLoading)) {
    return (
      <div className="container-page py-20 text-center text-ink-500">Chargement…</div>
    );
  }

  // Google sign-in gate (only when Supabase is configured).
  if (supabaseConfigured && !user) {
    return <SignInGate />;
  }

  if (!paid) {
    return <Paywall progress={progress} />;
  }

  const seq = computeSequence(progress);
  const isObtained = (d: DocumentSpec) =>
    (progress.documents[d.key]?.status ?? "not_started") === "obtained";

  const obtainedCount = ADULT_DOCUMENTS.filter(isObtained).length;
  const total = ADULT_DOCUMENTS.length;

  const startNow = [...seq.startNow, ...seq.anytime];
  const requestLast = seq.requestLast;
  const slowReady = seq.slowDocsReady;
  const allDone = obtainedCount === total;

  return (
    <div className="container-page max-w-6xl py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" aria-label="MaNaturalisation, accueil" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="MaNaturalisation" className="h-20 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="hidden text-sm text-ink-500 sm:inline">{user.email}</span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm font-medium text-ink-500 transition hover:text-ink-900"
              >
                Se déconnecter
              </button>
            </>
          )}
          <Link href="/" className="text-sm text-ink-500 transition hover:text-ink-900">
            Accueil
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Mon dossier</h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Suivez l&apos;ordre indiqué pour qu&apos;aucun document ne périme avant l&apos;envoi.
        Votre avancement est enregistré sur votre compte.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
        {/* Left: prochaine action + documents */}
        <div className="space-y-8">
          <StatusBanner
            expired={seq.expired}
            nextDoc={startNow.find((d) => !isObtained(d))}
            slowReady={slowReady}
            allDone={allDone}
            safeDate={seq.earliestSafeMailDate}
            obtainedCount={obtainedCount}
            total={total}
          />

          <div>
            <h2 className="text-lg font-semibold text-ink-900">Mes documents</h2>
            <p className="mt-1 text-sm text-ink-500">
              Déposez vos pièces : chacune est identifiée et reçoit un badge selon sa
              validité.
            </p>
            <div className="mt-4">
              <DocumentUpload
                docs={documents.docs}
                loaded={documents.loaded}
                onFiles={documents.uploadFiles}
                onRemove={documents.remove}
              />
            </div>
          </div>
        </div>

        {/* Right: rubriques (one open at a time, no long scroll) */}
        <div>
          <div className="flex gap-1 overflow-x-auto border-b border-ink-300/50">
            {RUBRIQUES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setTab(r.key)}
                className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
                  tab === r.key ? "text-brand-600" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {r.label}
                {tab === r.key && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-500" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "now" && (
              <Group
                index={1}
                title="À commencer maintenant"
                hint="Ces documents prennent le plus de temps mais ne périment pas. Lancez-les tout de suite, en parallèle."
              >
                {startNow.map((doc) => (
                  <DocRow
                    key={doc.key}
                    doc={doc}
                    prog={progress.documents[doc.key] ?? { status: "not_started" }}
                    onSetStatus={setDocStatus}
                    onSetDate={setDocDate}
                    detected={detectedByKey.get(doc.key)}
                  />
                ))}
              </Group>
            )}

            {tab === "last" && (
              <Group
                index={2}
                title="À demander en dernier"
                hint={
                  slowReady
                    ? "Vos documents longs sont prêts. Vous pouvez demander ces attestations : elles ne valent que 3 mois."
                    : "Attendez d'avoir obtenu les documents de l'étape 1. Ces attestations ne valent que 3 mois et périmeraient avant l'envoi."
                }
                locked={!slowReady}
              >
                {requestLast.map((doc) => (
                  <DocRow
                    key={doc.key}
                    doc={doc}
                    prog={progress.documents[doc.key] ?? { status: "not_started" }}
                    onSetStatus={setDocStatus}
                    onSetDate={setDocDate}
                    muted={!slowReady && (progress.documents[doc.key]?.status ?? "not_started") === "not_started"}
                    detected={detectedByKey.get(doc.key)}
                  />
                ))}
              </Group>
            )}

            {tab === "info" && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-lg font-semibold text-ink-900">
                    Les étapes de la procédure
                  </h2>
                  <div className="mt-4">
                    <StepTimeline progress={progress} onSetStatus={setStepStatus} />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink-900">Les coûts officiels</h2>
                  <div className="mt-4">
                    <CostsPanel />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBanner({
  expired,
  nextDoc,
  slowReady,
  allDone,
  safeDate,
  obtainedCount,
  total,
}: {
  expired: DocumentSpec[];
  nextDoc?: DocumentSpec;
  slowReady: boolean;
  allDone: boolean;
  safeDate?: Date;
  obtainedCount: number;
  total: number;
}) {
  let tone: "bad" | "go" | "done";
  let action: string;

  if (expired.length > 0) {
    tone = "bad";
    action = `« ${expired[0].name} » a expiré. Refaites-le avant d'envoyer le dossier.`;
  } else if (allDone) {
    tone = "done";
    action = "Tous vos documents sont rassemblés. Vous pouvez envoyer votre dossier.";
  } else if (nextDoc) {
    tone = "go";
    action = `Prochaine action : obtenir « ${nextDoc.name} ».`;
  } else if (!slowReady) {
    tone = "go";
    action = "Continuez à obtenir vos documents de l'étape 1.";
  } else {
    tone = "go";
    action = "Demandez maintenant les attestations de l'étape 2 (valables 3 mois).";
  }

  const styles = {
    bad: "border-brand-200 bg-brand-50",
    go: "border-ink-300/50 bg-slate-50",
    done: "border-emerald-200 bg-emerald-50",
  }[tone];

  return (
    <div className={`rounded-2xl border p-5 ${styles}`}>
      <p className="text-base font-medium text-ink-900">{action}</p>

      {!allDone && tone !== "bad" && safeDate && (
        <p className="mt-1.5 text-sm text-ink-600">
          En suivant cet ordre, vous pourrez envoyer votre dossier vers le{" "}
          <span className="font-semibold text-ink-900">{formatDate(safeDate)}</span>.
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${(obtainedCount / total) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-ink-600">
          {obtainedCount} / {total} obtenus
        </span>
      </div>
    </div>
  );
}

function Group({
  index,
  title,
  hint,
  locked,
  children,
}: {
  index: number;
  title: string;
  hint: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            locked ? "bg-ink-300/40 text-ink-500" : "bg-brand-500 text-white"
          }`}
        >
          {index}
        </span>
        <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
      </div>
      <p className="mt-2 pl-10 text-sm text-ink-500">{hint}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}


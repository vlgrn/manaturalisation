"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  ELIGIBILITY_QUESTIONS,
  evaluateEligibility,
  isQuestionVisible,
} from "@/content/eligibility";
import { EXEMPTION_NOTE } from "@/content/conditions";
import type {
  AnswerValue,
  EligibilityQuestion,
  EligibilityResult,
} from "@/lib/types";
import { loadProgress, saveProgress } from "@/lib/storage";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  residence: "Résidence",
  permit: "Titre de séjour",
  integration: "Intégration",
  finances: "Finances",
};

export function EligibilityChecker() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const visible = useMemo(
    () => ELIGIBILITY_QUESTIONS.filter((q) => isQuestionVisible(q.key, answers)),
    [answers],
  );
  const current = visible[Math.min(step, visible.length - 1)];

  function finish(state: Record<string, AnswerValue>) {
    const r = evaluateEligibility(state);
    setResult(r);
    const progress = loadProgress();
    progress.eligibilityAnswers = state;
    progress.eligibilityResult = r;
    saveProgress(progress);
  }

  function answer(value: AnswerValue) {
    const q = current;
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    const vis = ELIGIBILITY_QUESTIONS.filter((x) => isQuestionVisible(x.key, next));
    if (step >= vis.length - 1) finish(next);
    else setStep(step + 1);
  }

  function back() {
    if (result) {
      setResult(null);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setAnswers({});
    setStep(0);
    setResult(null);
  }

  if (result) {
    return <ResultPanel result={result} onRestart={reset} />;
  }

  const position = step + 1;
  const totalApprox = visible.length;
  const progress = Math.round((step / totalApprox) * 100);

  return (
    <div className="flex min-h-[26rem] flex-col">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-ink-500">
        <span className="font-medium text-ink-700">
          {SECTION_LABELS[current.section] ?? ""}
        </span>
        <span>
          {position} / {totalApprox}
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-300/40">
        <motion.div
          className="h-full rounded-full bg-brand-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 0.68, 0, 1] }}
          >
            <h2 className="text-2xl font-semibold leading-snug tracking-tight text-ink-900 md:text-3xl">
              {current.question}
            </h2>
            {current.help && (
              <p className="mt-3 max-w-lg text-ink-500">{current.help}</p>
            )}

            <div className="mt-8">
              <AnswerControls
                question={current}
                value={answers[current.key]}
                onAnswer={answer}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-ink-300/40 pt-5">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-ink-900 disabled:opacity-0"
        >
          <ArrowLeft className="size-4" />
          Retour
        </button>
        <span className="text-xs text-ink-500">
          Réponse immédiate, sans inscription.
        </span>
      </div>
    </div>
  );
}

function AnswerControls({
  question,
  value,
  onAnswer,
}: {
  question: EligibilityQuestion;
  value: AnswerValue | undefined;
  onAnswer: (v: AnswerValue) => void;
}) {
  const [draft, setDraft] = useState(value === undefined ? "" : String(value));

  if (question.type === "yesno") {
    return (
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        {[
          { v: true, label: "Oui" },
          { v: false, label: "Non" },
        ].map((opt) => (
          <OptionButton
            key={String(opt.v)}
            selected={value === opt.v}
            onClick={() => onAnswer(opt.v)}
          >
            {opt.label}
          </OptionButton>
        ))}
      </div>
    );
  }

  if (question.type === "choice") {
    return (
      <div className="flex flex-col gap-2.5 sm:max-w-md">
        {question.options?.map((opt) => (
          <OptionButton
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onAnswer(opt.value)}
            align="left"
          >
            {opt.label}
          </OptionButton>
        ))}
      </div>
    );
  }

  // number
  const submit = () => {
    if (draft === "") return;
    onAnswer(Number(draft));
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-xl border border-ink-300 bg-white px-1 focus-within:border-brand-500">
        <input
          type="number"
          min={0}
          autoFocus
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-24 bg-transparent px-3 py-3 text-lg outline-none"
        />
        {question.unit && (
          <span className="pr-3 text-sm text-ink-500">{question.unit}</span>
        )}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={draft === ""}
        className="btn-primary inline-flex items-center gap-2 px-6 py-3 disabled:opacity-40"
      >
        Continuer
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

function OptionButton({
  children,
  selected,
  onClick,
  align = "center",
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  align?: "center" | "left";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-5 py-3.5 text-base font-medium transition-all duration-150",
        align === "left" ? "text-left" : "text-center",
        selected
          ? "border-brand-500 bg-brand-500 text-white shadow-sm"
          : "border-ink-300 bg-white text-ink-900 hover:border-brand-500 hover:bg-brand-50",
      )}
    >
      {children}
    </button>
  );
}

const VERDICT = {
  eligible: {
    title: "Vous semblez éligible",
    blurb:
      "D'après vos réponses, vous remplissez les conditions principales. Lancez le suivi pour rassembler vos documents dans le bon ordre.",
    accent: "text-emerald-600",
    cta: "Lancer le suivi de mon dossier",
  },
  not_yet: {
    title: "Pas encore éligible",
    blurb:
      "Un ou plusieurs critères ne sont pas remplis aujourd'hui. Voici ce qui doit évoluer avant de pouvoir déposer.",
    accent: "text-brand-600",
    cta: "Voir le suivi (aperçu)",
  },
  edge_case: {
    title: "Un point à clarifier",
    blurb:
      "Votre situation comporte des éléments à vérifier avec le service des naturalisations avant de déposer.",
    accent: "text-amber-600",
    cta: "Voir le suivi (aperçu)",
  },
} as const;

function ResultPanel({
  result,
  onRestart,
}: {
  result: EligibilityResult;
  onRestart: () => void;
}) {
  const meta = VERDICT[result.verdict];
  const issues = result.reasons.filter((r) => r.kind !== "ok");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.68, 0, 1] }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-500">
        Résultat
      </p>
      <h2 className={cn("mt-2 text-3xl font-semibold tracking-tight", meta.accent)}>
        {meta.title}
      </h2>
      <p className="mt-3 max-w-xl text-ink-700">{meta.blurb}</p>

      {issues.length > 0 ? (
        <ul className="mt-7 space-y-3">
          {issues.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                  r.kind === "blocker"
                    ? "bg-brand-100 text-brand-600"
                    : "bg-amber-100 text-amber-600",
                )}
              >
                {r.kind === "blocker" ? (
                  <X className="size-3.5" strokeWidth={2.5} />
                ) : (
                  <TriangleAlert className="size-3" strokeWidth={2.5} />
                )}
              </span>
              <span className="text-ink-800">{r.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-7 flex items-center gap-2 text-sm font-medium text-emerald-600">
          <Check className="size-4" strokeWidth={2.5} />
          Aucun obstacle détecté sur les critères vérifiés.
        </p>
      )}

      {result.verdict === "edge_case" && (
        <p className="mt-6 rounded-xl border border-ink-300/50 bg-slate-50 p-4 text-sm leading-relaxed text-ink-600">
          {EXEMPTION_NOTE}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link href="/tableau-de-bord" className="btn-primary px-6 py-3">
          {meta.cta}
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-ink-900"
        >
          <RotateCcw className="size-4" />
          Recommencer
        </button>
      </div>
    </motion.div>
  );
}

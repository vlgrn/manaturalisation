"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ELIGIBILITY_QUESTIONS,
  evaluateEligibility,
} from "@/content/eligibility";
import { EXEMPTION_NOTE } from "@/content/conditions";
import type { AnswerValue, EligibilityResult } from "@/lib/types";
import { loadProgress, saveProgress } from "@/lib/storage";

const SECTION_LABELS: Record<string, string> = {
  residence: "Résidence",
  permit: "Titre de séjour",
  integration: "Intégration",
  finances: "Finances",
};

export function EligibilityChecker() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const total = ELIGIBILITY_QUESTIONS.length;
  const answered = useMemo(
    () => ELIGIBILITY_QUESTIONS.filter((q) => answers[q.key] !== undefined).length,
    [answers]
  );
  const allAnswered = answered === total;

  function setAnswer(key: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function onSubmit() {
    const r = evaluateEligibility(answers);
    setResult(r);
    // Persist so the dashboard can reuse it.
    const progress = loadProgress();
    progress.eligibilityAnswers = answers;
    progress.eligibilityResult = r;
    saveProgress(progress);
    // Scroll to result.
    requestAnimationFrame(() => {
      document.getElementById("resultat")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Group questions by section for display.
  const sections = useMemo(() => {
    const map = new Map<string, typeof ELIGIBILITY_QUESTIONS>();
    for (const q of ELIGIBILITY_QUESTIONS) {
      if (!map.has(q.section)) map.set(q.section, []);
      map.get(q.section)!.push(q);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div>
      {/* Progress */}
      <div className="sticky top-16 z-10 -mx-4 mb-6 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-sm text-ink-700">
          <span>
            {answered} / {total} questions
          </span>
          {allAnswered && <span className="text-brand-600 font-medium">Prêt à analyser</span>}
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {sections.map(([section, questions]) => (
          <fieldset key={section} className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              {SECTION_LABELS[section] ?? section}
            </legend>
            {questions.map((q) => (
              <div key={q.key} className="card">
                <label className="block font-medium text-ink-900">{q.question}</label>
                {q.help && <p className="mt-1 text-sm text-ink-500">{q.help}</p>}
                <div className="mt-3">
                  {q.type === "yesno" && (
                    <div className="flex gap-2">
                      {[
                        { v: true, label: "Oui" },
                        { v: false, label: "Non" },
                      ].map((opt) => (
                        <button
                          key={String(opt.v)}
                          type="button"
                          onClick={() => setAnswer(q.key, opt.v)}
                          className={
                            answers[q.key] === opt.v
                              ? "btn-primary"
                              : "btn-secondary"
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "choice" && (
                    <div className="flex flex-wrap gap-2">
                      {q.options?.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswer(q.key, opt.value)}
                          className={
                            answers[q.key] === opt.value ? "btn-primary" : "btn-secondary"
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "number" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={answers[q.key] === undefined ? "" : String(answers[q.key])}
                        onChange={(e) =>
                          setAnswer(q.key, e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-32 rounded-lg border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                      />
                      {q.unit && <span className="text-sm text-ink-500">{q.unit}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </fieldset>
        ))}
      </div>

      <div className="mt-8">
        <button onClick={onSubmit} disabled={!allAnswered} className="btn-primary px-6 py-3 text-base">
          Analyser mon éligibilité
        </button>
        {!allAnswered && (
          <p className="mt-2 text-sm text-ink-500">
            Répondez à toutes les questions pour obtenir votre résultat.
          </p>
        )}
      </div>

      {result && <ResultPanel result={result} />}
    </div>
  );
}

function ResultPanel({ result }: { result: EligibilityResult }) {
  const verdictMeta = {
    eligible: {
      title: "Vous semblez éligible 🎉",
      blurb:
        "D'après vos réponses, vous remplissez les conditions principales. Lancez le suivi de votre dossier pour rassembler vos documents dans le bon ordre.",
      cls: "border-emerald-200 bg-emerald-50",
      pill: "bg-emerald-100 text-emerald-700",
    },
    not_yet: {
      title: "Pas encore éligible",
      blurb:
        "Un ou plusieurs critères bloquants ne sont pas remplis aujourd'hui. Voyez ci-dessous ce qui doit évoluer avant de pouvoir déposer.",
      cls: "border-amber-200 bg-amber-50",
      pill: "bg-amber-100 text-amber-800",
    },
    edge_case: {
      title: "Cas particulier — à clarifier",
      blurb:
        "Votre situation comporte des points à vérifier directement avec le service des naturalisations avant de déposer.",
      cls: "border-sky-200 bg-sky-50",
      pill: "bg-sky-100 text-sky-800",
    },
  }[result.verdict];

  return (
    <div id="resultat" className={`card mt-10 ${verdictMeta.cls}`}>
      <span className={`badge ${verdictMeta.pill}`}>Résultat</span>
      <h2 className="mt-3 text-2xl font-bold">{verdictMeta.title}</h2>
      <p className="mt-2 text-ink-700">{verdictMeta.blurb}</p>

      <ul className="mt-5 space-y-2">
        {result.reasons.map((r, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span aria-hidden>
              {r.kind === "blocker" ? "⛔" : r.kind === "warning" ? "⚠️" : "✅"}
            </span>
            <span className="text-ink-800">{r.message}</span>
          </li>
        ))}
      </ul>

      {result.verdict === "edge_case" && (
        <p className="mt-5 rounded-lg bg-white/70 p-3 text-sm text-ink-700">{EXEMPTION_NOTE}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/tableau-de-bord" className="btn-primary">
          {result.verdict === "eligible" ? "Lancer le suivi de mon dossier" : "Voir le suivi (aperçu)"}
        </Link>
        <a
          href="https://www.ge.ch/naturalisation-suisse-personnes-etrangeres"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Page officielle ge.ch
        </a>
      </div>
    </div>
  );
}

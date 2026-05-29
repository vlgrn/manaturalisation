import type {
  AnswerValue,
  EligibilityQuestion,
  EligibilityResult,
} from "@/lib/types";

// Guided eligibility questions for Geneva ordinary naturalisation (adults).
// Source: ge.ch conditions. Last reviewed: 2026-02.
export const ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  {
    key: "adult",
    section: "residence",
    question: "Êtes-vous majeur·e (18 ans ou plus) ?",
    help: "Le parcours v1 couvre la naturalisation ordinaire des adultes.",
    type: "yesno",
  },
  {
    key: "permit",
    section: "permit",
    question: "Quel est votre titre de séjour actuel ?",
    type: "choice",
    options: [
      { value: "C", label: "Permis C (établissement)" },
      { value: "B", label: "Permis B (séjour)" },
      { value: "F", label: "Permis F (admission provisoire)" },
      { value: "Ci", label: "Permis Ci" },
      { value: "other", label: "Permis L / N / S / autre" },
    ],
    help: "La naturalisation ordinaire exige un permis C valable durant toute la procédure.",
  },
  {
    key: "yearsCH",
    section: "residence",
    question: "Depuis combien d'années résidez-vous en Suisse au bénéfice d'un titre de séjour valable ?",
    type: "number",
    unit: "ans",
  },
  {
    key: "years8to18",
    section: "residence",
    question: "Parmi ces années, combien avez-vous passées en Suisse entre 8 et 18 ans ?",
    help: "Ces années comptent double (le séjour effectif doit tout de même atteindre 6 ans).",
    type: "number",
    unit: "ans",
  },
  {
    key: "last5in3",
    section: "residence",
    question: "Avez-vous résidé en Suisse durant au moins 3 des 5 dernières années ?",
    type: "yesno",
  },
  {
    key: "yearsGE",
    section: "residence",
    question: "Depuis combien d'années êtes-vous domicilié·e dans le canton de Genève ?",
    type: "number",
    unit: "ans",
  },
  {
    key: "ge12months",
    section: "residence",
    question: "Avez-vous résidé à Genève pendant les 12 mois précédant immédiatement aujourd'hui ?",
    type: "yesno",
  },
  {
    key: "longAbsence",
    section: "residence",
    question: "Avez-vous eu une absence de Suisse de plus de 6 mois durant cette période ?",
    type: "yesno",
  },
  {
    key: "language",
    section: "integration",
    question: "Atteignez-vous le niveau de français B1 à l'oral et A2 à l'écrit (ou pouvez-vous le prouver) ?",
    type: "yesno",
  },
  {
    key: "criminal",
    section: "integration",
    question: "Avez-vous une inscription pertinente au casier judiciaire ?",
    type: "yesno",
  },
  {
    key: "socialAid",
    section: "finances",
    question: "Avez-vous perçu l'aide sociale (Hospice général) au cours des 3 dernières années (non remboursée) ?",
    type: "yesno",
  },
  {
    key: "taxDelay",
    section: "finances",
    question: "Avez-vous des retards de paiement d'impôts (quel que soit le montant) ?",
    type: "yesno",
  },
  {
    key: "debts",
    section: "finances",
    question: "Quel est le montant total de vos dettes / poursuites (CHF) ?",
    type: "number",
    unit: "CHF",
  },
  {
    key: "selfSufficient",
    section: "finances",
    question: "Êtes-vous économiquement actif·ve ou en formation, et capable de subvenir à vos besoins ?",
    type: "yesno",
  },
];

function num(v: AnswerValue | undefined): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function bool(v: AnswerValue | undefined): boolean {
  return v === true || v === "true" || v === "yes";
}

/**
 * Evaluate eligibility. Conservative by design: hard blockers => "not_yet",
 * special situations => "edge_case", everything clear => "eligible".
 */
export function evaluateEligibility(
  answers: Record<string, AnswerValue>
): EligibilityResult {
  const reasons: EligibilityResult["reasons"] = [];
  let blocked = false;
  let edge = false;

  // --- Adult ---
  if (answers.adult !== undefined && !bool(answers.adult)) {
    reasons.push({
      kind: "blocker",
      message:
        "Le parcours v1 couvre la naturalisation ordinaire des adultes. Les mineurs relèvent d'une autre procédure.",
    });
    edge = true;
  }

  // --- Permit ---
  const permit = String(answers.permit ?? "");
  if (permit === "C") {
    reasons.push({ kind: "ok", message: "Permis C : condition de titre de séjour remplie." });
  } else if (permit === "B" || permit === "Ci" || permit === "F") {
    reasons.push({
      kind: "blocker",
      message:
        "La naturalisation ordinaire exige un permis C. Vos années sous permis B/Ji comptent (le F pour moitié), mais vous devez obtenir le permis C avant de déposer.",
    });
    blocked = true;
  } else if (permit === "other") {
    reasons.push({
      kind: "blocker",
      message:
        "Les permis L, N et S ne comptent pas et ne permettent pas la naturalisation ordinaire. Un permis C est requis.",
    });
    blocked = true;
  }

  // --- Residence (with double-counting age 8–18) ---
  const yearsCH = num(answers.yearsCH);
  const years8to18 = Math.min(num(answers.years8to18), yearsCH);
  const countedYears = yearsCH + years8to18; // bonus year per 8–18 year
  if (yearsCH < 6 && years8to18 > 0) {
    reasons.push({
      kind: "blocker",
      message:
        "Le séjour effectif doit atteindre au moins 6 ans, même avec le double comptage des années entre 8 et 18 ans.",
    });
    blocked = true;
  }
  if (countedYears >= 10) {
    reasons.push({
      kind: "ok",
      message: `Durée de séjour comptabilisée ≈ ${countedYears} ans (≥ 10 requis).`,
    });
  } else {
    reasons.push({
      kind: "blocker",
      message: `Durée de séjour comptabilisée ≈ ${countedYears} ans — 10 ans sont requis (les années entre 8 et 18 ans comptent double).`,
    });
    blocked = true;
  }

  if (answers.last5in3 !== undefined && !bool(answers.last5in3)) {
    reasons.push({
      kind: "blocker",
      message: "Il faut avoir résidé en Suisse durant au moins 3 des 5 dernières années.",
    });
    blocked = true;
  }

  const yearsGE = num(answers.yearsGE);
  if (yearsGE >= 2) {
    reasons.push({ kind: "ok", message: "Au moins 2 ans de domicile à Genève." });
  } else {
    reasons.push({
      kind: "blocker",
      message: "Il faut au moins 2 ans de domicile dans le canton de Genève.",
    });
    blocked = true;
  }
  if (answers.ge12months !== undefined && !bool(answers.ge12months)) {
    reasons.push({
      kind: "blocker",
      message: "Vous devez avoir résidé à Genève durant les 12 mois précédant immédiatement la demande.",
    });
    blocked = true;
  }
  if (bool(answers.longAbsence)) {
    reasons.push({
      kind: "warning",
      message:
        "Une absence de plus de 6 mois peut annuler le temps de séjour comptabilisé. À vérifier avec le service.",
    });
    edge = true;
  }

  // --- Integration ---
  if (answers.language !== undefined && !bool(answers.language)) {
    reasons.push({
      kind: "warning",
      message:
        "Le niveau de français B1 oral / A2 écrit est requis. Vous pouvez l'obtenir via un examen fide avant le dépôt.",
    });
    edge = true;
  }
  if (bool(answers.criminal)) {
    reasons.push({
      kind: "warning",
      message:
        "Une inscription au casier judiciaire peut empêcher la naturalisation selon sa nature. À examiner avec le service.",
    });
    edge = true;
  }

  // --- Finances (hard blockers) ---
  if (bool(answers.socialAid)) {
    reasons.push({
      kind: "blocker",
      message:
        "Aucune aide sociale ne doit avoir été perçue (non remboursée) dans les 3 ans précédant la demande.",
    });
    blocked = true;
  }
  if (bool(answers.taxDelay)) {
    reasons.push({
      kind: "blocker",
      message:
        "Tout retard de paiement d'impôt (quel que soit le montant) peut entraîner une décision de non-entrée en matière.",
    });
    blocked = true;
  }
  const debts = num(answers.debts);
  if (debts > 1500) {
    reasons.push({
      kind: "blocker",
      message: `Vos dettes (CHF ${debts}) dépassent le plafond de CHF 1'500.`,
    });
    blocked = true;
  } else if (debts > 0) {
    reasons.push({ kind: "ok", message: "Dettes en dessous du plafond de CHF 1'500." });
  }
  if (answers.selfSufficient !== undefined && !bool(answers.selfSufficient)) {
    reasons.push({
      kind: "warning",
      message: "Vous devez être économiquement autonome (actif·ve ou en formation).",
    });
    edge = true;
  }

  const verdict: EligibilityResult["verdict"] = blocked
    ? "not_yet"
    : edge
      ? "edge_case"
      : "eligible";

  return { verdict, reasons };
}

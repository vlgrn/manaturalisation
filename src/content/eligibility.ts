import type {
  AnswerValue,
  EligibilityQuestion,
  EligibilityResult,
} from "@/lib/types";

// Guided eligibility questions for Geneva ORDINARY naturalisation (adults).
// Conditions encoded from official sources, last reviewed 2026-05:
//   - ge.ch/devenir-suisse/naturalisation-ordinaire-conditions-remplir
//   - LN (RS 141.0) art. 9, 11, 12 ; OLN (RS 141.01) art. 6
//   - LNat genevoise (RS-GE A 4 05)
// Federal: 10 ans de séjour, dont 3 sur les 5 dernières années ; années entre
// 8 et 18 ans comptées double mais séjour effectif >= 6 ans ; permis C exigé au
// dépôt (B/F comptent pour la durée, F pour moitié ; L/N/S ne comptent pas).
// Cantonal: 2 ans à Genève dont les 12 mois précédents. Langue: français B1
// oral / A2 écrit. Finances: aucune aide sociale non remboursée sur 3 ans, pas
// d'arriérés d'impôt, dettes <= CHF 1'500 (et pas de poursuites/ADB).
export const ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  {
    key: "adult",
    section: "permit",
    question: "Avez-vous 18 ans ou plus ?",
    help: "Cet outil couvre la naturalisation ordinaire des adultes.",
    type: "yesno",
  },
  {
    key: "permit",
    section: "permit",
    question: "Quel est votre titre de séjour aujourd'hui ?",
    type: "choice",
    options: [
      { value: "C", label: "Permis C (établissement)" },
      { value: "B", label: "Permis B (séjour)" },
      { value: "F", label: "Permis F (admission provisoire)" },
      { value: "Ci", label: "Permis Ci" },
      { value: "other", label: "Permis L, N, S ou autre" },
    ],
    help: "Le permis C est exigé au moment du dépôt de la demande.",
  },
  {
    key: "yearsCH",
    section: "residence",
    question: "Depuis combien d'années vivez-vous en Suisse ?",
    help: "Au bénéfice d'un titre de séjour valable.",
    type: "number",
    unit: "ans",
  },
  {
    key: "years8to18",
    section: "residence",
    question: "Combien de ces années avez-vous vécues en Suisse entre 8 et 18 ans ?",
    help: "Ces années comptent double, dans la limite d'un séjour effectif d'au moins 6 ans.",
    type: "number",
    unit: "ans",
  },
  {
    key: "last5in3",
    section: "residence",
    question: "Avez-vous vécu en Suisse au moins 3 des 5 dernières années ?",
    type: "yesno",
  },
  {
    key: "geneva2y",
    section: "residence",
    question:
      "Vivez-vous à Genève depuis au moins 2 ans, dont les 12 derniers mois sans interruption ?",
    type: "yesno",
  },
  {
    key: "longAbsence",
    section: "residence",
    question: "Avez-vous quitté la Suisse plus de 6 mois d'affilée sur cette période ?",
    type: "yesno",
  },
  {
    key: "language",
    section: "integration",
    question: "Avez-vous le français au niveau B1 à l'oral et A2 à l'écrit ?",
    help: "Si le français est votre langue maternelle, vous êtes dispensé·e du certificat. Sinon : certificat fide ou équivalent, ou scolarité suivie en français.",
    type: "yesno",
  },
  {
    key: "criminal",
    section: "integration",
    question: "Figurez-vous au casier judiciaire (extrait destiné aux autorités) ?",
    type: "yesno",
  },
  {
    key: "socialAid",
    section: "finances",
    question:
      "Avez-vous touché l'aide sociale (Hospice général) ces 3 dernières années sans l'avoir remboursée ?",
    type: "yesno",
  },
  {
    key: "taxDelay",
    section: "finances",
    question: "Avez-vous des arriérés ou des retards de paiement d'impôt ?",
    type: "yesno",
  },
  {
    key: "debts",
    section: "finances",
    question:
      "Avez-vous plus de CHF 1'500 de dettes, des poursuites ou des actes de défaut de biens ?",
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
 * Whether a question should be shown given the current answers.
 * The 8-18 double-counting question only matters when the effective stay is
 * between 6 and 10 years (below 6 the floor fails anyway; 10+ already suffices).
 */
export function isQuestionVisible(
  key: string,
  answers: Record<string, AnswerValue>
): boolean {
  if (key === "years8to18") {
    const y = num(answers.yearsCH);
    return y >= 6 && y < 10;
  }
  return true;
}

/**
 * Evaluate eligibility. Conservative by design: hard blockers => "not_yet",
 * acquirable/special situations => "edge_case", everything clear => "eligible".
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
        "Cet outil couvre la naturalisation ordinaire des adultes. Les mineurs relèvent d'une autre procédure.",
    });
    blocked = true;
  }

  // --- Permit ---
  const permit = String(answers.permit ?? "");
  if (permit === "C") {
    reasons.push({ kind: "ok", message: "Permis C : condition de titre de séjour remplie." });
  } else if (permit === "other") {
    reasons.push({
      kind: "blocker",
      message:
        "Les permis L, N et S ne permettent pas la naturalisation ordinaire. Un permis C est requis.",
    });
    blocked = true;
  } else if (permit) {
    reasons.push({
      kind: "blocker",
      message:
        "La naturalisation ordinaire exige un permis C au dépôt. Vos années sous permis B comptent (le F pour moitié), mais vous devez obtenir le permis C avant de déposer.",
    });
    blocked = true;
  }

  // --- Residence in Switzerland (double-counting ages 8-18, floor 6 years) ---
  const yearsCH = num(answers.yearsCH);
  const years8to18 = Math.min(num(answers.years8to18), yearsCH);
  const counted = yearsCH + years8to18;
  if (yearsCH > 0 && yearsCH < 6) {
    reasons.push({
      kind: "blocker",
      message:
        "Le séjour effectif doit atteindre au moins 6 ans, même avec le double comptage des années entre 8 et 18 ans.",
    });
    blocked = true;
  } else if (counted >= 10) {
    reasons.push({
      kind: "ok",
      message: `Durée de séjour comptabilisée d'environ ${counted} ans (10 requis).`,
    });
  } else {
    reasons.push({
      kind: "blocker",
      message: `Durée de séjour d'environ ${counted} ans. 10 ans sont requis (les années entre 8 et 18 ans comptent double).`,
    });
    blocked = true;
  }

  if (answers.last5in3 !== undefined && !bool(answers.last5in3)) {
    reasons.push({
      kind: "blocker",
      message: "Il faut avoir vécu en Suisse au moins 3 des 5 dernières années.",
    });
    blocked = true;
  }

  // --- Residence in Geneva (2 years, incl. last 12 months) ---
  if (answers.geneva2y !== undefined && !bool(answers.geneva2y)) {
    reasons.push({
      kind: "blocker",
      message:
        "Il faut au moins 2 ans de domicile à Genève, dont les 12 mois précédant immédiatement la demande.",
    });
    blocked = true;
  } else if (bool(answers.geneva2y)) {
    reasons.push({ kind: "ok", message: "Domicile à Genève suffisant." });
  }

  if (bool(answers.longAbsence)) {
    reasons.push({
      kind: "warning",
      message:
        "Une absence de plus de 6 mois peut annuler une partie du temps de séjour. À vérifier avec le service.",
    });
    edge = true;
  }

  // --- Integration (acquirable / to clarify) ---
  if (answers.language !== undefined && !bool(answers.language)) {
    reasons.push({
      kind: "warning",
      message:
        "Le français B1 à l'oral et A2 à l'écrit est requis. Vous pouvez l'obtenir via un examen fide avant le dépôt.",
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
        "Aucune aide sociale non remboursée ne doit avoir été perçue dans les 3 ans précédant la demande.",
    });
    blocked = true;
  }
  if (bool(answers.taxDelay)) {
    reasons.push({
      kind: "blocker",
      message:
        "Tout retard de paiement d'impôt peut entraîner une décision de non-entrée en matière.",
    });
    blocked = true;
  }
  if (bool(answers.debts)) {
    reasons.push({
      kind: "blocker",
      message:
        "Le total des dettes doit rester sous CHF 1'500, sans poursuite ni acte de défaut de biens.",
    });
    blocked = true;
  }

  const verdict: EligibilityResult["verdict"] = blocked
    ? "not_yet"
    : edge
      ? "edge_case"
      : "eligible";

  return { verdict, reasons };
}

import type { CostItem } from "@/lib/types";

// Costs to display to the user. Source: ge.ch. Last reviewed: 2026-02.

export const CANTONAL_FEES: CostItem[] = [
  { label: "Mineur (11–17 ans)", amountChf: 300 },
  { label: "Adulte de moins de 25 ans", amountChf: 850 },
  { label: "Adulte de 25 ans et plus", amountChf: 1250 },
  { label: "Couple, l'un de moins de 25 ans", amountChf: 1360 },
  { label: "Couple, 25 ans et plus", amountChf: 2000 },
  { label: "Par enfant", amountChf: 300 },
];

export const FEDERAL_FEES: CostItem[] = [
  { label: "Mineur", amountChf: 50 },
  { label: "Adulte", amountChf: 100 },
  { label: "Couple", amountChf: 150 },
];

export const OTHER_COSTS: CostItem[] = [
  { label: "Acte d'état civil suisse", amountChf: "variable", note: "Facturé par l'arrondissement de l'état civil." },
  { label: "Examen / certificat fide", amountChf: "variable", note: "Selon l'organisme et le niveau." },
  { label: "Test de connaissances", amountChf: "variable" },
];

export const FEES_NOTE =
  "L'émolument cantonal est dû au dépôt et n'est pas remboursé, quelle que soit l'issue de la procédure.";

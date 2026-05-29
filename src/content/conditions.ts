// Canonical eligibility conditions for Geneva ordinary naturalisation (adults).
// Source: ge.ch — conditions. THIS IS THE MOAT. Last reviewed: 2026-02.
// Displayed read-only on the marketing/overview pages.

export interface ConditionGroup {
  key: string;
  title: string;
  items: string[];
}

export const CONDITIONS: ConditionGroup[] = [
  {
    key: "residence",
    title: "Durée de résidence",
    items: [
      "10 ans de séjour en Suisse au bénéfice d'un titre de séjour valable, dont 3 sur les 5 dernières années.",
      "Les années passées en Suisse entre 8 et 18 ans (révolus) comptent double — mais le séjour effectif doit être d'au moins 6 ans.",
      "2 ans dans le canton de Genève, dont les 12 mois précédant immédiatement la demande.",
      "Rester effectivement domicilié·e à Genève pendant toute la procédure.",
      "Les absences à l'étranger de plus de 6 mois (parfois plus d'un an) peuvent annuler le temps comptabilisé.",
    ],
  },
  {
    key: "permit",
    title: "Titre de séjour",
    items: [
      "Être titulaire d'un permis C (établissement), valable durant toute la procédure.",
      "Décompte : les permis B et C comptent pleinement ; le permis F compte pour moitié ; le permis Ci compte.",
      "Les permis L, N et S ne comptent pas.",
    ],
  },
  {
    key: "integration",
    title: "Intégration (toutes les conditions sont cumulatives)",
    items: [
      "Aucune inscription pertinente au casier judiciaire ; pas de non-paiement volontaire d'obligations publiques ou privées importantes.",
      "Ne pas mettre en danger la sûreté intérieure ou extérieure de la Suisse.",
      "Français ≥ B1 à l'oral et A2 à l'écrit.",
      "Connaissances suffisantes de la géographie, de l'histoire, de la politique et de la société suisses et genevoises.",
      "Être économiquement actif·ve ou en formation ; subvenir à ses besoins.",
      "Liens véritables avec le canton ; respect des valeurs constitutionnelles suisses et genevoises ; encourager l'intégration des membres étrangers de la famille.",
    ],
  },
  {
    key: "finances",
    title: "Situation financière",
    items: [
      "Aucune aide sociale (Hospice général) perçue dans les 3 ans précédant la demande ni pendant la procédure, sauf remboursement intégral.",
      "Dettes ne dépassant pas CHF 1'500 au total.",
      "Aucun retard de paiement d'impôt (quel que soit le montant) — un retard peut entraîner une décision de non-entrée en matière.",
    ],
  },
];

export const EXEMPTION_NOTE =
  "Procédure dérogatoire : les personnes en situation personnelle particulière (handicap, maladie grave, troubles cognitifs liés à l'âge, illettrisme, travailleurs pauvres, lourdes charges familiales) peuvent bénéficier de conditions assouplies. Il faut contacter le service AVANT de déposer la demande.";

export const DISCLAIMER =
  "NaturaGE est un outil d'organisation personnel, pas un conseil juridique. Les informations proviennent des pages officielles de ge.ch et peuvent évoluer. Vérifiez toujours les conditions auprès du service cantonal des naturalisations avant de déposer votre dossier.";

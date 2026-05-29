import type { StepSpec } from "@/lib/types";

// The "now → Swiss passport" path for Geneva ordinary naturalisation.
// Source: ge.ch — dépôt + déroulement de la procédure. Last reviewed: 2026-02.
export const STEPS: StepSpec[] = [
  {
    key: "eligibility",
    number: 1,
    title: "Vérifier l'éligibilité",
    description:
      "Contrôler que vous remplissez les conditions (durée de séjour, permis C, intégration, finances). C'est la porte d'entrée.",
    actor: "you",
  },
  {
    key: "request_dossier",
    number: 2,
    title: "Demander le dossier de naturalisation",
    description:
      "Demander le formulaire / dossier au service des naturalisations (par courrier ou via le formulaire de contact ge.ch).",
    actor: "you",
  },
  {
    key: "test_language",
    number: 3,
    title: "Test de connaissances & certificat de langue",
    description:
      "S'inscrire au test de connaissances et le réussir ; obtenir le certificat de langue fide si vous ne l'avez pas encore. Ces démarches se mènent EN PARALLÈLE de la collecte des documents.",
    actor: "you",
    parallelWith: ["gather_documents"],
  },
  {
    key: "gather_documents",
    number: 4,
    title: "Rassembler les documents",
    description:
      "Collecter vos documents dans le bon ordre (séquenceur) — leur nombre varie selon votre situation — pour qu'aucune attestation à courte validité ne périme avant l'envoi.",
    actor: "you",
    parallelWith: ["test_language"],
  },
  {
    key: "mail_dossier",
    number: 5,
    title: "Envoyer le dossier complet",
    description: "Poster le dossier complet au service des naturalisations.",
    actor: "you",
  },
  {
    key: "instruction",
    number: 6,
    title: "Enregistrement & instruction préliminaire",
    description:
      "Le service des naturalisations enregistre votre dossier et procède à l'instruction préliminaire.",
    actor: "administration",
  },
  {
    key: "interview",
    number: 7,
    title: "Entretien",
    description: "Entretien avec le service des naturalisations.",
    actor: "you",
  },
  {
    key: "decision",
    number: 8,
    title: "Recommandation de la commission → arrêté du Conseil d'État",
    description:
      "La commission émet une recommandation, puis le Conseil d'État prend l'arrêté de naturalisation.",
    actor: "administration",
  },
  {
    key: "oath",
    number: 9,
    title: "Prestation de serment",
    description:
      "Cérémonie de prestation de serment — obligatoire. Y renoncer sans motif valable peut annuler l'arrêté.",
    actor: "you",
  },
  {
    key: "federal",
    number: 10,
    title: "Niveau fédéral (SEM)",
    description:
      "Le service cantonal agit pour la Confédération ; le SEM délivre l'autorisation fédérale de naturalisation.",
    actor: "administration",
  },
  {
    key: "id_documents",
    number: 11,
    title: "Commander les documents d'identité",
    description:
      "Environ 10 jours ouvrables plus tard, vous pouvez commander vos documents d'identité auprès du Centre cantonal de biométrie.",
    actor: "you",
  },
];

export function getStep(key: string): StepSpec | undefined {
  return STEPS.find((s) => s.key === key);
}

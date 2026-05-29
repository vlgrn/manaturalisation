import type { DocumentSpec } from "@/lib/types";

/**
 * The canonical document checklist for Geneva ordinary naturalisation (adults).
 * Source: ge.ch — conditions + dépôt de la demande.
 *
 * THIS CONTENT IS THE MOAT. Keep it correct and current. Re-check official pages
 * periodically (see README "Content maintenance"). Last reviewed: 2026-02.
 */
export const DOCUMENTS: DocumentSpec[] = [
  {
    key: "etat_civil",
    number: 1,
    name: "Acte tiré du registre de l'état civil suisse",
    summary: "Acte d'état civil suisse récent (moins de 6 mois).",
    detail:
      "Acte établi par votre arrondissement de l'état civil. C'est une procédure payante distincte qui peut prendre plusieurs semaines à plusieurs mois. À commander en tout premier : son délai d'obtention est long alors que sa validité (6 mois) est limitée.",
    validityMonths: 6,
    speed: "slow",
    estimatedWeeks: [6, 12],
    sequenceGroup: "slow_first",
    action: {
      type: "link",
      label: "Trouver votre arrondissement de l'état civil",
      href: "https://www.ge.ch/organisation/office-cantonal-population-migrations-ocpm",
    },
  },
  {
    key: "permis_c_copie",
    number: 2,
    name: "Photocopie du permis C",
    summary: "Une simple photocopie recto-verso de votre permis C valide.",
    detail:
      "Faites une photocopie lisible, recto-verso, de votre permis d'établissement (livret C). Le permis doit rester valide pendant toute la procédure.",
    validityMonths: null,
    speed: "instant",
    estimatedWeeks: [0, 0],
    sequenceGroup: "neutral",
    action: { type: "self", label: "À faire vous-même (photocopie)" },
  },
  {
    key: "photos",
    number: 3,
    name: "2 photos passeport",
    summary: "Deux photos d'identité récentes aux normes suisses.",
    detail:
      "Deux photos passeport récentes et identiques, format suisse (35 × 45 mm), réalisées en cabine photo ou chez un photographe.",
    validityMonths: null,
    speed: "fast",
    estimatedWeeks: [0, 1],
    sequenceGroup: "neutral",
    action: { type: "self", label: "Cabine photo / photographe" },
  },
  {
    key: "afc",
    number: 4,
    name: "Attestation de l'administration fiscale cantonale (AFC)",
    summary: "Attestation fiscale de moins de 3 mois.",
    detail:
      "Atteste l'absence de retard de paiement d'impôts. Valable 3 mois seulement : à demander EN DERNIER, une fois vos documents lents obtenus, pour qu'elle ne périme pas avant l'envoi du dossier. Tout retard de paiement d'impôt (quel que soit le montant) peut entraîner une décision de non-entrée en matière.",
    validityMonths: 3,
    speed: "medium",
    estimatedWeeks: [1, 3],
    sequenceGroup: "short_last",
    action: {
      type: "link",
      label: "Demander l'attestation à l'AFC",
      href: "https://www.ge.ch/demander-attestation-impot",
    },
  },
  {
    key: "poursuites",
    number: 5,
    name: "Attestation de l'office des poursuites",
    summary: "Extrait du registre des poursuites, moins de 3 mois.",
    detail:
      "Atteste l'absence (ou le niveau) de poursuites et de dettes. Vos dettes ne doivent pas dépasser CHF 1'500 au total. Valable 3 mois : à demander EN DERNIER avec les autres attestations à courte validité.",
    validityMonths: 3,
    speed: "medium",
    estimatedWeeks: [1, 2],
    sequenceGroup: "short_last",
    action: {
      type: "link",
      label: "Demander l'extrait à l'office des poursuites",
      href: "https://www.ge.ch/commander-extrait-registre-poursuites",
    },
  },
  {
    key: "hospice",
    number: 6,
    name: "Attestation de l'Hospice général",
    summary: "Attestation de non-assistance (aide sociale), moins de 3 mois.",
    detail:
      "Atteste que vous n'avez pas bénéficié de l'aide sociale (ou que celle-ci a été intégralement remboursée). Aucune aide sociale ne doit avoir été perçue dans les 3 ans précédant la demande ni pendant la procédure. Valable 3 mois : à demander EN DERNIER. Se demande facilement par e-mail (générateur d'e-mail disponible dans l'app).",
    validityMonths: 3,
    speed: "medium",
    estimatedWeeks: [1, 3],
    sequenceGroup: "short_last",
    action: { type: "mailto", label: "Générer l'e-mail de demande", mailtoKey: "hospice" },
  },
  {
    key: "fide",
    number: 7,
    name: "Certificat de langue fide (B1 oral / A2 écrit)",
    summary: "Preuve du niveau de français exigé.",
    detail:
      "Certificat fide ou passeport des langues fide attestant au minimum B1 à l'oral et A2 à l'écrit en français. À obtenir TÔT : l'examen fide ou la procédure de reconnaissance d'un diplôme équivalent peut prendre du temps. Une fois obtenu, il ne périme pas pour la procédure.",
    validityMonths: null,
    speed: "slow",
    estimatedWeeks: [6, 16],
    sequenceGroup: "slow_first",
    action: {
      type: "link",
      label: "S'inscrire à un examen fide / faire reconnaître un diplôme",
      href: "https://www.fide-info.ch/fr/fide/examen",
    },
  },
  {
    key: "test_connaissances",
    number: 8,
    name: "Attestation de réussite du test de connaissances",
    summary: "Preuve de réussite du test sur la Suisse et Genève.",
    detail:
      "Atteste vos connaissances sur la géographie, l'histoire, la politique et la société suisses et genevoises. L'inscription se fait via le service des naturalisations (téléphone / formulaire), puis vous passez le test. À engager TÔT : l'inscription et l'obtention d'une date prennent du temps.",
    validityMonths: null,
    speed: "slow",
    estimatedWeeks: [4, 12],
    sequenceGroup: "slow_first",
    action: {
      type: "link",
      label: "S'inscrire au test de connaissances",
      href: "https://www.ge.ch/naturalisation-suisse-personnes-etrangeres",
    },
  },
  {
    key: "consentement_mineurs",
    number: 9,
    name: "Consentement des représentants légaux + pièce d'identité (mineurs)",
    summary: "Uniquement pour les candidats mineurs.",
    detail:
      "Consentement écrit des représentants légaux et copie de leur pièce d'identité. Concerne uniquement les mineurs — hors champ du parcours adulte v1.",
    validityMonths: null,
    speed: "fast",
    estimatedWeeks: [0, 1],
    sequenceGroup: "neutral",
    action: { type: "self", label: "À faire vous-même" },
    minorsOnly: true,
  },
];

/** The adult v1 flow excludes minors-only documents. */
export const ADULT_DOCUMENTS = DOCUMENTS.filter((d) => !d.minorsOnly);

export function getDocument(key: string): DocumentSpec | undefined {
  return DOCUMENTS.find((d) => d.key === key);
}

/** mailto templates keyed by `mailtoKey` on a DocAction. */
export const MAILTO_TEMPLATES: Record<
  string,
  { to: string; subject: string; body: (name?: string) => string }
> = {
  hospice: {
    to: "info@hospicegeneral.ch",
    subject: "Demande d'attestation de non-assistance (naturalisation)",
    body: (name) =>
      `Madame, Monsieur,\n\nDans le cadre d'une demande de naturalisation ordinaire dans le canton de Genève, je sollicite une attestation indiquant que je n'ai pas bénéficié de l'aide sociale (ou, le cas échéant, que celle-ci a été intégralement remboursée).\n\nVoici mes coordonnées :\n- Nom et prénom : ${name ?? "[votre nom]"}\n- Date de naissance : [votre date de naissance]\n- Adresse : [votre adresse]\n- N° de dossier éventuel : [si connu]\n\nJe vous remercie de m'adresser cette attestation par courrier ou par e-mail.\n\nAvec mes salutations distinguées,\n${name ?? "[votre nom]"}`,
  },
};

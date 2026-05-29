import { EligibilityChecker } from "@/components/EligibilityChecker";

export const metadata = {
  title: "Test d'éligibilité — MaNaturalisation",
  description:
    "Vérifiez en quelques questions si vous remplissez les conditions de la naturalisation ordinaire à Genève.",
};

export default function EligibilitePage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold tracking-tight">Suis-je éligible ?</h1>
      <p className="mt-2 text-ink-700">
        Répondez à ces questions sur votre situation. Le résultat est immédiat et gratuit. Aucune
        donnée n'est envoyée tant que vous ne créez pas de compte.
      </p>
      <div className="mt-8">
        <EligibilityChecker />
      </div>
    </div>
  );
}

import Link from "next/link";
import { EligibilityChecker } from "@/components/EligibilityChecker";

export const metadata = {
  title: "Test d'éligibilité · MaNaturalisation",
  description:
    "Vérifiez en quelques questions si vous remplissez les conditions de la naturalisation ordinaire à Genève.",
};

export default function EligibilitePage() {
  return (
    <div className="container max-w-xl py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" aria-label="MaNaturalisation, accueil" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="MaNaturalisation" className="h-20 w-auto" />
        </Link>
        <Link href="/" className="text-sm text-ink-500 transition hover:text-ink-900">
          Accueil
        </Link>
      </div>

      <div className="rounded-3xl border border-ink-300/50 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.25)] md:p-10">
        <EligibilityChecker />
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-500">
        Conditions basées sur les pages officielles de ge.ch. Outil d&apos;organisation,
        pas un conseil juridique.
      </p>
    </div>
  );
}

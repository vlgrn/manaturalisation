import Link from "next/link";
import { DISCLAIMER } from "@/content/conditions";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-300/50 bg-slate-50">
      <div className="container-page py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <div className="font-bold text-ink-900">
              Ma<span className="text-brand-500">Naturalisation</span>
            </div>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Outil d'organisation pour la naturalisation ordinaire à Genève.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-ink-700">
            <Link href="/eligibilite" className="hover:text-brand-600">
              Test d'éligibilité
            </Link>
            <Link href="/tableau-de-bord" className="hover:text-brand-600">
              Suivi du dossier
            </Link>
            <Link href="/#faq" className="hover:text-brand-600">
              FAQ
            </Link>
            <Link href="/confidentialite" className="hover:text-brand-600">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-brand-600">
              Conditions d&apos;utilisation
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-ink-300/50 pt-6 text-xs leading-relaxed text-ink-500">
          {DISCLAIMER}
        </p>
        <p className="mt-2 text-xs text-ink-500">
          © {new Date().getFullYear()} MaNaturalisation. 
        </p>
      </div>
    </footer>
  );
}
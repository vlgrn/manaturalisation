import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-300/50 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-sm text-white">
            ✚
          </span>
          <span className="text-lg tracking-tight">
            Ma<span className="text-brand-500">Naturalisation</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/#fonctionnement" className="btn-ghost hidden sm:inline-flex">
            Comment ça marche
          </Link>
          <Link href="/#prix" className="btn-ghost hidden sm:inline-flex">
            Prix
          </Link>
          <Link href="/eligibilite" className="btn-secondary">
            Test d'éligibilité
          </Link>
          <Link href="/tableau-de-bord" className="btn-primary">
            Mon dossier
          </Link>
        </nav>
      </div>
    </header>
  );
}

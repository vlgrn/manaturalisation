"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

const HIDE_ON = ["/tableau-de-bord", "/connexion"];

export function TrialBanner() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => pathname?.startsWith(p))) return null;

  return (
    <Link
      href="/tableau-de-bord"
      className="group block bg-brand-500 text-white transition hover:bg-brand-600"
    >
      <div className="container flex items-center justify-center gap-2 py-2 text-center text-sm font-medium">
        <span>Essai gratuit 24&nbsp;h, sans carte bancaire</span>
        <span className="hidden text-white/80 sm:inline">· accédez à votre dossier</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

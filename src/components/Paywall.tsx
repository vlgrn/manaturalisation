"use client";

import { useState } from "react";
import { PRICE_CHF } from "@/lib/env";
import type { UserProgress } from "@/lib/types";
import { computeSequence } from "@/lib/sequencer";

export function Paywall({ progress }: { progress: UserProgress }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A redacted preview to convey value behind the gate.
  const seq = computeSequence(progress);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Le paiement n'est pas disponible pour le moment.");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="container-page max-w-3xl py-12">
      <span className="badge bg-brand-100 text-brand-700">Suivi complet</span>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Débloquez le suivi de votre dossier
      </h1>
      <p className="mt-2 text-ink-700">
        Le séquenceur, les alertes anti-péremption, la date d'envoi sûre, les générateurs d'e-mail
        et la frise des étapes. Un seul paiement de {PRICE_CHF} CHF, à vie.
      </p>

      {/* Blurred preview */}
      <div className="relative mt-8 overflow-hidden rounded-xl border border-ink-300/60">
        <div className="pointer-events-none select-none p-5 blur-[3px]">
          <div className="text-sm font-semibold text-brand-600">À commencer maintenant</div>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            {seq.startNow.map((d) => (
              <li key={d.key}>• {d.name}</li>
            ))}
          </ul>
          <div className="mt-4 text-sm font-semibold text-brand-600">À demander en dernier</div>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            {seq.requestLast.map((d) => (
              <li key={d.key}>• {d.name}</li>
            ))}
          </ul>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/40">
          <div className="rounded-full bg-ink-900/80 px-4 py-2 text-sm font-medium text-white">
            🔒 Aperçu verrouillé
          </div>
        </div>
      </div>

      <div className="card mt-8 border-brand-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Accès complet</div>
            <div className="text-sm text-ink-500">Paiement unique · pas d'abonnement</div>
          </div>
          <div className="text-3xl font-extrabold">
            {PRICE_CHF}
            <span className="text-base font-medium text-ink-500"> CHF</span>
          </div>
        </div>
        <button onClick={startCheckout} disabled={loading} className="btn-primary mt-5 w-full py-3 text-base">
          {loading ? "Redirection…" : `Débloquer pour ${PRICE_CHF} CHF`}
        </button>
        {error && <p className="mt-3 text-sm text-brand-600">{error}</p>}
        <p className="mt-3 text-center text-xs text-ink-500">
          Paiement sécurisé par Stripe. Vous gardez l'accès à votre suivi à vie.
        </p>
      </div>
    </div>
  );
}

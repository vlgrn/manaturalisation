"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function GoogleSignIn({
  next = "/tableau-de-bord",
  comingSoon = false,
}: {
  next?: string;
  comingSoon?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (comingSoon) {
    return (
      <button
        type="button"
        disabled
        title="Disponible prochainement"
        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-ink-300 bg-white px-5 py-3 font-medium text-ink-400"
      >
        <GoogleIcon />
        Continuer avec Google
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-500">
          bientôt
        </span>
      </button>
    );
  }

  async function handle() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    setError(false);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-ink-300 bg-white px-5 py-3 font-medium text-ink-900 transition hover:bg-slate-50 disabled:opacity-60"
      >
        <GoogleIcon />
        {loading ? "Redirection…" : "Continuer avec Google"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-brand-600">
          La connexion a échoué. Réessayez.
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.39 14.97.4 12 .4A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

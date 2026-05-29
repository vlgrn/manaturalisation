"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { GoogleSignIn } from "@/components/GoogleSignIn";

type Mode = "signin" | "signup";

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou mot de passe incorrect.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "Un compte existe déjà avec cet e-mail. Connectez-vous.";
  if (m.includes("password")) return "Mot de passe trop court (6 caractères minimum).";
  if (m.includes("email")) return "Adresse e-mail invalide.";
  return "Une erreur est survenue. Réessayez.";
}

export function AuthForm({ next = "/tableau-de-bord" }: { next?: string }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setLoading(false);
      if (error) return setError(translateError(error.message));
      if (data.user && !data.session) {
        return setInfo(
          "Compte créé. Vérifiez votre boîte e-mail pour confirmer votre adresse, puis connectez-vous.",
        );
      }
      window.location.assign(next);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(translateError(error.message));
      window.location.assign(next);
    }
  }

  return (
    <div className="w-full">
      <GoogleSignIn next={next} />

      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-ink-300/60" />
        ou
        <span className="h-px flex-1 bg-ink-300/60" />
      </div>

      <form onSubmit={submit} className="space-y-3 text-left">
        <label className="block text-sm font-medium text-ink-700">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1 block w-full rounded-xl border border-ink-300 px-3 py-2.5 outline-none focus:border-brand-500"
            placeholder="vous@exemple.ch"
          />
        </label>
        <label className="block text-sm font-medium text-ink-700">
          Mot de passe
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="mt-1 block w-full rounded-xl border border-ink-300 px-3 py-2.5 outline-none focus:border-brand-500"
            placeholder={mode === "signup" ? "6 caractères minimum" : "••••••••"}
          />
        </label>

        {error && <p className="text-sm text-brand-600">{error}</p>}
        {info && (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
        >
          {loading
            ? "Un instant…"
            : mode === "signup"
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500">
        {mode === "signup" ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "signin" : "signup");
            setError(null);
            setInfo(null);
          }}
          className="font-medium text-brand-600 hover:underline"
        >
          {mode === "signup" ? "Se connecter" : "Créer un compte"}
        </button>
      </p>
    </div>
  );
}

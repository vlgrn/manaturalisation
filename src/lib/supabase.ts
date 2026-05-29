// Supabase client factories.
//
// These return `null` when Supabase isn't configured, so the rest of the app
// can degrade gracefully (localStorage + bypassed paywall in dev).

import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfigured } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

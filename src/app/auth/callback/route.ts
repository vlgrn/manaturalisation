import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// OAuth / PKCE callback: Supabase redirects here with a `code` after Google
// sign-in. We exchange it for a session (cookies), then send the user on.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tableau-de-bord";

  if (code) {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/tableau-de-bord?auth_error=1`);
}

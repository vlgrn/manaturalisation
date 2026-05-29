// Centralised, safe access to environment configuration.
// Every integration is optional in v1: the app must run with an empty .env.

export const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const stripeConfigured = !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRICE_ID;

export const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const PRICE_CHF = 39;

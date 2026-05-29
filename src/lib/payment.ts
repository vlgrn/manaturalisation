"use client";

// Client-side access gate.
//
// v1 / demo: paid status is a localStorage flag, so the full dashboard is usable
// without a live Stripe + Supabase setup. When Stripe is configured, the Paywall
// redirects to Stripe Checkout; on return (?paid=1) we set the flag here. The
// authoritative source in production is the `profile.has_paid` column flipped by
// the Stripe webhook — read that instead of localStorage once auth is wired in.

import { stripeConfigured } from "@/lib/env";

const PAID_KEY = "naturage:paid:v1";

export function hasPaid(): boolean {
  if (typeof window === "undefined") return false;
  // When Stripe isn't configured (local dev), the dashboard is open so you can
  // build and demo it. Flip this to `false` to preview the paywall.
  if (!stripeConfigured) return true;
  return window.localStorage.getItem(PAID_KEY) === "1";
}

export function markPaid(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PAID_KEY, "1");
}

export function clearPaid(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PAID_KEY);
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Stripe webhook: on a completed one-time checkout, flip `profile.has_paid`.
//
// Setup:
//   1. Create the webhook endpoint in Stripe pointing to /api/stripe/webhook,
//      listening to `checkout.session.completed`.
//   2. Put the signing secret in STRIPE_WEBHOOK_SECRET.
//   3. Pass `client_reference_id` (the Supabase user id) when creating the
//      checkout session (see checkout/route.ts) so we know whose row to flip.
//
// Must read the raw body to verify the signature — hence the manual req.text().

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (userId && supabaseUrl && serviceKey) {
      // Service-role client bypasses RLS — server-only, never expose this key.
      const admin = createClient(supabaseUrl, serviceKey);
      const { error } = await admin
        .from("profile")
        .update({ has_paid: true })
        .eq("id", userId);
      if (error) {
        console.error("Failed to flip has_paid", error);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }
    } else {
      console.warn(
        "checkout.session.completed received but missing userId or Supabase config; cannot flip has_paid."
      );
    }
  }

  return NextResponse.json({ received: true });
}

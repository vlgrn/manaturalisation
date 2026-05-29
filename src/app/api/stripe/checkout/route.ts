import { NextResponse } from "next/server";
import Stripe from "stripe";
import { siteUrl, stripeConfigured } from "@/lib/env";

// Creates a one-time Stripe Checkout session and returns its URL.
// If Stripe isn't configured, returns a clear error so the UI can explain.
export async function POST() {
  if (!stripeConfigured) {
    return NextResponse.json(
      {
        error:
          "Le paiement n'est pas encore configuré (variables Stripe manquantes). En développement, l'accès est ouvert.",
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${siteUrl}/tableau-de-bord?paid=1`,
      cancel_url: `${siteUrl}/tableau-de-bord`,
      // When auth is wired in, pass the Supabase user id so the webhook can flip
      // the right profile row:
      // client_reference_id: userId,
      // customer_email: userEmail,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 }
    );
  }
}

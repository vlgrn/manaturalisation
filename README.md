# NaturaGE

> Naturalisation ordinaire à Genève : test d'éligibilité + suivi intelligent des documents.

A web app that tells a Geneva resident whether they can apply for Swiss citizenship,
then guides them through gathering the right documents **in the right order** — so
nothing expires and nothing is missing when they mail their dossier.

The differentiator is the **sequencer**: three attestations are valid only 3 months,
while two key documents take *months* to obtain. Request them in the wrong order and
they expire before you can file. NaturaGE computes the safe order and a projected
"earliest safe mail date".

## Tech stack

- **Next.js 14 (App Router) + TypeScript**, deployed on Vercel.
- **Tailwind CSS** for styling.
- **Supabase** (Postgres + Auth: email & Google) with Row-Level Security — *optional in dev*.
- **Stripe Checkout** one-time payment; webhook flips `profile.has_paid` — *optional in dev*.

No separate backend: Next.js API routes cover server logic.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

**It runs with zero configuration.** Without env vars:

- Progress (document statuses, dates, eligibility answers) persists to **localStorage**.
- The paywall is **bypassed** so you can build and demo the full dashboard.

Build & lint:

```bash
npm run build
```

## Project layout

```
src/
  app/
    page.tsx                     Landing / marketing (FR)
    eligibilite/page.tsx         Free eligibility checker
    tableau-de-bord/page.tsx     Paid dashboard (tracker + sequencer + timeline + costs)
    api/stripe/checkout/route.ts Create one-time Checkout session
    api/stripe/webhook/route.ts  Flip has_paid on payment
  content/                       ── THE MOAT: canonical ge.ch content ──
    conditions.ts                Eligibility conditions + disclaimer
    documents.ts                 The 9 documents + mailto templates
    eligibility.ts               Guided questions + scoring logic
    steps.ts                     The 11-step procedure timeline
    costs.ts                     Cantonal / federal / other fees
  lib/
    sequencer.ts                 Ordering rules, expiry & safe-mail-date logic
    storage.ts                   localStorage store (swap for Supabase here)
    useProgress.ts               React hook over the store
    payment.ts                   Client access gate
    supabase.ts / env.ts         Config + clients (null when unconfigured)
  components/                    UI (Dashboard, Sequencer, DocumentCard, …)
supabase/schema.sql              Tables + RLS policies + auth trigger
```

## Wiring up the backend (when ready)

### Supabase

1. Create a Supabase project. In **Authentication > Providers**, enable Email and Google.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor (tables, RLS, the
   `handle_new_user` trigger that auto-creates a `profile` row).
3. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` (server-only) in `.env.local`.
4. Replace the localStorage bodies in [`src/lib/storage.ts`](src/lib/storage.ts) with
   Supabase queries — every component already talks only to that module, so the swap is
   isolated. Then read `profile.has_paid` in [`src/lib/payment.ts`](src/lib/payment.ts)
   instead of the localStorage flag.

### Stripe

1. Create a one-time product (~39 CHF) and copy its **price ID**.
2. Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`.
3. Add a webhook endpoint pointing to `/api/stripe/webhook` listening to
   `checkout.session.completed`.
4. When auth is live, pass `client_reference_id: userId` when creating the checkout
   session (see the comment in `checkout/route.ts`) so the webhook flips the right row.

Local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Content maintenance (important)

The value of this product is the content in `src/content/` being **correct and current**.
Geneva rules change (last reviewed: **2026-02**). Periodically re-check the official pages
on ge.ch (conditions + dépôt de la demande) and update the config. Each content file carries
a "Last reviewed" note. Wrong info causes real harm to users.

## Scope (v1)

- **In:** Geneva canton, ordinary naturalisation, adult applicants.
- **Out:** facilitated naturalisation, minors-only flows, other cantons, live dossier
  status (no government API exists), document upload/storage.

## Legal

NaturaGE is an **organisational tool, not legal advice**. The disclaimer is shown in the
footer and on the eligibility result. Always direct users to the cantonal naturalisation
service for their specific situation.

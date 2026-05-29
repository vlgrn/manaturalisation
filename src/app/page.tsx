import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PremiumHero } from "@/components/ui/hero";
import { Features } from "@/components/ui/features-8";
import { Pricing6 } from "@/components/ui/pricing-6";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Faq } from "@/components/ui/faq";
import { CONDITIONS } from "@/content/conditions";

const FAQ = [
  {
    q: "Tout est déjà gratuit sur ge.ch, non ?",
    a: "Oui. L'information officielle est gratuite, mais dispersée, statique et sans aucun suivi. Le jour où une attestation périme ou qu'une pièce manque, ge.ch ne vous prévient pas : vous le découvrez en recevant un courrier de refus. MaNaturalisation n'invente rien, il ordonne vos démarches, calcule la bonne séquence, génère vos e-mails et suit votre progression. Vous payez de ne pas perdre des mois, pas l'information.",
  },
  {
    q: "Concrètement, qu'est-ce que je risque sans outil ?",
    a: "Le scénario classique : vous demandez vos attestations trop tôt, votre acte d'état civil met 2 mois à revenir, et entre-temps vos attestations (valables 3 mois) ont expiré. Vous les recommandez, vous les repayez, vous reperdez des semaines. Pire, un retard d'impôt ou une pièce oubliée peut entraîner une décision de non-entrée en matière, et l'émolument (jusqu'à 1'250 CHF) n'est jamais remboursé.",
  },
  {
    q: "Est-ce un conseil juridique ?",
    a: "Non. MaNaturalisation est un outil d'organisation. Pour toute question juridique ou situation particulière, adressez-vous au service cantonal des naturalisations.",
  },
  {
    q: "Le paiement est-il unique ?",
    a: "Oui. Un seul paiement de 39 CHF débloque le suivi complet, sans abonnement. Vous ne ferez cette démarche qu'une fois dans votre vie, on ne va pas vous facturer tous les mois pour ça.",
  },
  {
    q: "Mes données sont-elles privées ?",
    a: "Vos documents sont stockés chiffrés dans votre espace personnel et ne sont jamais partagés avec l'administration. Vous gardez la main : vous pouvez les supprimer à tout moment. Cela nous permet de vous aider à vérifier qu'une pièce est complète, mais MaNaturalisation reste un outil d'organisation, pas un conseil juridique.",
  },
];

export default function HomePage() {
  return (
    <>
      <PremiumHero />

      {/* The expiry trap — the painful core insight */}
      <section className="border-b bg-background">
        <HeroHighlight containerClassName="py-16 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold leading-relaxed tracking-tight lg:text-5xl lg:leading-snug">
              Une pièce qui périme, et{" "}
              <Highlight>vous repartez de zéro.</Highlight>
            </h2>
            <p className="mt-6 text-muted-foreground lg:text-lg">
              Certaines attestations ne valent que 3 mois, d&apos;autres documents mettent
              des mois à arriver. Demandées dans le mauvais ordre, vos pièces expirent avant
              même que le dossier soit complet, et l&apos;émolument n&apos;est jamais
              remboursé.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl items-center gap-4 md:grid-cols-3">
            <TrapCard
              tone="bad"
              title="Sans MaNaturalisation"
              lines={[
                "Vous demandez tout en même temps",
                "L'acte d'état civil met 2 mois",
                "Vos attestations (3 mois) expirent",
                "Vous repayez et reperdez des semaines",
              ]}
            />
            <div className="flex items-center justify-center">
              <span className="inline-block rotate-90 text-3xl text-muted-foreground md:rotate-0">
                →
              </span>
            </div>
            <TrapCard
              tone="good"
              title="Avec MaNaturalisation"
              lines={[
                "Les documents lents partent en premier",
                "Les attestations sont bloquées au bon moment",
                "Une date d'envoi sûre est calculée",
                "Vous postez une fois, sans rien refaire",
              ]}
            />
          </div>
        </div>
        </HeroHighlight>
      </section>

      <Features />

      {/* Conditions + the free eligibility test (the lead magnet) */}
      <section className="border-t py-16 md:py-28">
        <div className="container grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          {/* The pitch: take the free test */}
          <div className="lg:sticky lg:top-16">
            <h2 className="text-4xl font-semibold tracking-tight lg:text-6xl">
              Êtes-vous éligible&nbsp;?
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Le test gratuit applique ces conditions à votre situation et vous donne une
              réponse claire en deux minutes.
            </p>
            <Link
              href="/eligibilite"
              className="btn-primary group mt-7 inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 text-base sm:w-auto"
            >
              Tester mon éligibilité
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-sm text-ink-500">
              Sans inscription. Aucune donnée transmise à l&apos;administration.
            </p>
          </div>

          {/* The conditions, compact preview */}
          <div>
            <p className="text-sm text-ink-500">
              Naturalisation ordinaire à Genève. Les procédures facilitées (conjoint·e de
              Suisse, 3e génération) ne sont pas couvertes.
            </p>
            <div className="mt-5 divide-y divide-ink-300/40 overflow-hidden rounded-2xl border border-ink-300/40 bg-card">
              {CONDITIONS.map((group) => (
                <div key={group.key} className="p-5">
                  <h3 className="font-semibold text-ink-900">{group.title}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-500">
                    {group.items.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Pricing6 />

      <Faq items={FAQ} />
    </>
  );
}

function TrapCard({
  tone,
  title,
  lines,
}: {
  tone: "bad" | "good";
  title: string;
  lines: string[];
}) {
  const good = tone === "good";
  return (
    <div
      className={`rounded-xl border p-5 ${
        good ? "border-primary/30 bg-primary/[0.03]" : "bg-card"
      }`}
    >
      <h3
        className={`text-sm font-semibold uppercase tracking-wide ${
          good ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-2">
            <span className={good ? "text-primary" : "text-muted-foreground"}>
              {good ? "✓" : "✕"}
            </span>
            <span className={good ? "text-foreground" : "text-muted-foreground"}>{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

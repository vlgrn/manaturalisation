import Link from "next/link";
import { PRICE_CHF } from "@/lib/env";
import { CONDITIONS } from "@/content/conditions";

const FAQ = [
  {
    q: "Tout est déjà gratuit sur ge.ch, non ?",
    a: "Oui — l'information officielle est gratuite, mais dispersée et statique. NaturaGE n'invente rien : il ordonne vos démarches, calcule la bonne séquence pour qu'aucune attestation ne périme, génère vos e-mails de demande et suit votre progression personnelle. Vous payez le gain de temps et la tranquillité, pas l'information.",
  },
  {
    q: "Est-ce un conseil juridique ?",
    a: "Non. NaturaGE est un outil d'organisation. Pour toute question juridique ou situation particulière, adressez-vous au service cantonal des naturalisations.",
  },
  {
    q: "Combien coûte la naturalisation elle-même ?",
    a: "L'émolument cantonal est d'environ CHF 1'250 pour un adulte de 25 ans et plus (non remboursable), plus la taxe fédérale et les frais d'acte d'état civil, d'examen fide et de test. NaturaGE affiche le détail de ces coûts.",
  },
  {
    q: "Le paiement est-il unique ?",
    a: `Oui. Un seul paiement de ${PRICE_CHF} CHF débloque le suivi complet de votre dossier, sans abonnement. Vous ne ferez cette démarche qu'une fois dans votre vie.`,
  },
  {
    q: "Mes données sont-elles privées ?",
    a: "Votre suivi vous appartient. Aucune donnée n'est partagée avec l'administration et NaturaGE ne stocke pas vos documents — uniquement l'état d'avancement que vous saisissez.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="badge w-fit bg-brand-100 text-brand-700">
              Genève · naturalisation ordinaire
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Devenez suisse à Genève, <span className="text-brand-500">sans mauvaise surprise.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-700">
              Vérifiez votre éligibilité en 2 minutes, puis rassemblez vos documents
              <strong> dans le bon ordre</strong> — pour qu'aucune attestation ne périme avant
              l'envoi de votre dossier.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/eligibilite" className="btn-primary px-6 py-3 text-base">
                Tester mon éligibilité — gratuit
              </Link>
              <Link href="/#fonctionnement" className="btn-secondary px-6 py-3 text-base">
                Comment ça marche
              </Link>
            </div>
            <p className="mt-3 text-sm text-ink-500">
              Sans carte bancaire. Le suivi complet se débloque ensuite pour {PRICE_CHF} CHF, une
              seule fois.
            </p>
          </div>

          {/* The expiry-trap visual */}
          <div className="flex items-center">
            <div className="card w-full border-brand-100 bg-white">
              <div className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Le piège de la péremption
              </div>
              <p className="mt-2 text-sm text-ink-700">
                Trois attestations ne sont valables que <strong>3 mois</strong>. Deux documents clés
                prennent <strong>des mois</strong> à obtenir. Dans le mauvais ordre, vos attestations
                périment avant l'envoi — et vous repayez.
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <TrapRow color="bg-amber-500" label="Acte d'état civil" detail="≈ 6–12 sem. · valable 6 mois" tag="Commencer EN PREMIER" tagColor="text-amber-700 bg-amber-50" />
                <TrapRow color="bg-amber-500" label="Certificat fide + test" detail="≈ 4–16 sem. · ne périme pas" tag="Commencer EN PREMIER" tagColor="text-amber-700 bg-amber-50" />
                <TrapRow color="bg-brand-500" label="Impôts · poursuites · Hospice" detail="≈ 1–3 sem. · valable 3 mois" tag="Demander EN DERNIER" tagColor="text-brand-700 bg-brand-50" />
              </div>
              <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-ink-700">
                NaturaGE calcule votre <strong>date d'envoi sûre la plus proche</strong> et vous
                alerte avant chaque demande à risque.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="fonctionnement" className="container-page py-16">
        <h2 className="text-3xl font-bold tracking-tight">Comment ça marche</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <FeatureCard
            n="1"
            title="Test d'éligibilité gratuit"
            body="Quelques questions guidées sur votre séjour, votre permis et vos finances. Verdict immédiat : éligible, pas encore, ou cas particulier à clarifier."
          />
          <FeatureCard
            n="2"
            title="Suivi intelligent des documents"
            body="Les 8 documents à réunir, chacun avec son statut, sa validité, le lien officiel et un générateur d'e-mail (Hospice général). Le séquenceur vous dit quoi demander, et quand."
          />
          <FeatureCard
            n="3"
            title="Frise des étapes"
            body="De la demande de dossier à la prestation de serment : votre position dans la procédure, ce qui vient ensuite, et ce qui peut avancer en parallèle."
          />
        </div>
      </section>

      {/* Conditions overview (free, read-only) */}
      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-tight">Les conditions, en clair</h2>
          <p className="mt-2 max-w-2xl text-ink-700">
            Un aperçu des conditions de la naturalisation ordinaire à Genève. Le test d'éligibilité
            les applique à votre situation.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {CONDITIONS.map((group) => (
              <div key={group.key} className="card">
                <h3 className="font-semibold text-ink-900">{group.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  {group.items.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 text-brand-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/eligibilite" className="btn-primary px-6 py-3 text-base">
              Voir si je suis éligible
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="prix" className="container-page py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold tracking-tight">Un prix simple</h2>
          <p className="mt-2 text-ink-700">
            Le test d'éligibilité est gratuit. Le suivi complet de votre dossier se débloque une
            seule fois.
          </p>
          <div className="card mt-8 border-brand-100 text-left">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold">Suivi complet du dossier</span>
              <span className="text-3xl font-extrabold">
                {PRICE_CHF}<span className="text-base font-medium text-ink-500"> CHF</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-500">Paiement unique · pas d'abonnement</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-700">
              {[
                "Suivi des 8 documents avec statuts et dates de péremption",
                "Séquenceur : le bon ordre + alertes anti-péremption",
                "Date d'envoi sûre la plus proche, calculée en continu",
                "Générateur d'e-mail (Hospice général) et liens officiels",
                "Frise interactive des 11 étapes de la procédure",
                "Détail des coûts cantonaux et fédéraux",
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/eligibilite" className="btn-primary mt-6 w-full px-6 py-3 text-base">
              Commencer par le test gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 py-16">
        <div className="container-page max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight">Questions fréquentes</h2>
          <div className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="card group">
                <summary className="cursor-pointer list-none font-semibold text-ink-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-brand-500 transition group-open:rotate-45">＋</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TrapRow({
  color,
  label,
  detail,
  tag,
  tagColor,
}: {
  color: string;
  label: string;
  detail: string;
  tag: string;
  tagColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
      <div className="flex-1">
        <div className="font-medium text-ink-900">{label}</div>
        <div className="text-xs text-ink-500">{detail}</div>
      </div>
      <span className={`badge ${tagColor}`}>{tag}</span>
    </div>
  );
}

function FeatureCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-bold text-white">
        {n}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{body}</p>
    </div>
  );
}

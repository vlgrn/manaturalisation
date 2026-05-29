import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — MaNaturalisation",
  description:
    "Comment MaNaturalisation collecte, utilise et protège vos données personnelles et vos documents.",
};

export default function ConfidentialitePage() {
  return (
    <article className="container max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : mai 2026
      </p>

      <div className="legal mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          La présente politique de confidentialité décrit comment MaNaturalisation
          collecte, utilise et protège vos informations lorsque vous utilisez notre
          service, ainsi que vos droits en matière de protection des données. Elle est
          conçue conformément à la Loi fédérale suisse sur la protection des données
          (nLPD) et, lorsqu&apos;il s&apos;applique, au Règlement général sur la
          protection des données (RGPD).
        </p>
        <p>
          En utilisant le service, vous acceptez la collecte et l&apos;utilisation de vos
          informations conformément à la présente politique.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Définitions</h2>
          <ul className="space-y-2">
            <li>
              <strong className="text-foreground">Société / « nous »</strong> désigne
              MaNaturalisation, Genève, Suisse.
            </li>
            <li>
              <strong className="text-foreground">Service</strong> désigne le site web
              MaNaturalisation (test d&apos;éligibilité et suivi de dossier de
              naturalisation).
            </li>
            <li>
              <strong className="text-foreground">Données personnelles</strong> désigne
              toute information se rapportant à une personne physique identifiée ou
              identifiable.
            </li>
            <li>
              <strong className="text-foreground">Documents</strong> désigne les pièces
              justificatives que vous téléversez dans votre espace personnel pour le suivi
              de votre dossier.
            </li>
            <li>
              <strong className="text-foreground">Données d&apos;usage</strong> désigne les
              données collectées automatiquement lors de l&apos;utilisation du service.
            </li>
            <li>
              <strong className="text-foreground">Prestataire</strong> désigne tout tiers
              qui traite des données pour notre compte (hébergement, paiement…).
            </li>
            <li>
              <strong className="text-foreground">« Vous »</strong> désigne la personne qui
              accède au service ou l&apos;utilise.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Données que nous collectons
          </h2>
          <h3 className="font-semibold text-foreground">Données personnelles</h3>
          <p>
            Lors de l&apos;utilisation du service, nous pouvons vous demander de fournir
            certaines informations permettant de vous identifier ou de vous contacter,
            notamment :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Adresse e-mail</li>
            <li>Nom et prénom</li>
            <li>
              L&apos;état d&apos;avancement de votre dossier que vous saisissez (statuts,
              dates)
            </li>
            <li>
              Les documents que vous choisissez de téléverser dans votre espace personnel
            </li>
          </ul>

          <h3 className="font-semibold text-foreground">Données d&apos;usage</h3>
          <p>
            Les données d&apos;usage sont collectées automatiquement. Elles peuvent inclure
            l&apos;adresse IP de votre appareil, le type et la version du navigateur, les
            pages du service que vous consultez, la date et l&apos;heure de votre visite,
            le temps passé sur ces pages et d&apos;autres données de diagnostic.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Vos documents et le stockage chiffré
          </h2>
          <p>
            Vous pouvez téléverser vos documents dans votre espace personnel pour faciliter
            le suivi de votre dossier. Voici comment nous les traitons :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">Chiffrement :</strong> vos documents sont
              stockés chiffrés et associés à votre compte, dans votre espace personnel.
            </li>
            <li>
              <strong className="text-foreground">Aucun partage avec
              l&apos;administration :</strong> vos documents et votre suivi ne sont jamais
              transmis au service cantonal des naturalisations ni à aucune autre autorité.
              C&apos;est vous qui déposez votre dossier.
            </li>
            <li>
              <strong className="text-foreground">Analyse pour vous aider :</strong> nous
              pouvons analyser le contenu de vos documents dans le seul but de vous aider à
              vérifier qu&apos;une pièce est complète ou correctement remplie. Cette
              fonction est une aide à l&apos;organisation et{" "}
              <strong className="text-foreground">ne constitue pas un conseil juridique</strong>.
              Vous restez seul·e responsable de la vérification de votre dossier auprès du
              service cantonal.
            </li>
            <li>
              <strong className="text-foreground">Suppression :</strong> vous pouvez
              supprimer vos documents à tout moment depuis votre espace, ou nous demander de
              les supprimer.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p>
            Nous utilisons des cookies et technologies similaires pour faire fonctionner le
            service et analyser son utilisation. Nous utilisons :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">Cookies nécessaires</strong> (cookies de
              session) : indispensables au fonctionnement du service, ils permettent
              notamment de vous authentifier et de sécuriser votre compte.
            </li>
            <li>
              <strong className="text-foreground">Cookies de préférences</strong> (cookies
              persistants) : ils mémorisent vos choix, comme votre langue ou vos
              identifiants de connexion.
            </li>
            <li>
              <strong className="text-foreground">Cookies de mesure d&apos;audience</strong> :
              ils nous aident à comprendre comment le service est utilisé afin de
              l&apos;améliorer.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Utilisation de vos données
          </h2>
          <p>Nous pouvons utiliser vos données personnelles pour :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Fournir et maintenir le service, et en surveiller l&apos;utilisation.</li>
            <li>Gérer votre compte et votre accès au service.</li>
            <li>Exécuter le contrat lié à l&apos;achat du suivi de dossier.</li>
            <li>
              Vous contacter par e-mail pour des informations liées au service (mises à
              jour, sécurité, support).
            </li>
            <li>Gérer vos demandes.</li>
            <li>
              Analyser l&apos;usage et améliorer le service, sous une forme agrégée lorsque
              c&apos;est possible.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Partage de vos données
          </h2>
          <p>Nous pouvons partager vos données dans les situations suivantes :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">Avec nos prestataires :</strong> pour
              l&apos;hébergement, le stockage chiffré et le traitement des paiements (par
              ex. Stripe), strictement dans la mesure nécessaire à la fourniture du service.
            </li>
            <li>
              <strong className="text-foreground">Pour des opérations sur la société :</strong>{" "}
              en cas de fusion, vente d&apos;actifs ou acquisition, vos données pourraient
              être transférées, après vous en avoir informé.
            </li>
            <li>
              <strong className="text-foreground">Avec votre consentement :</strong> pour
              toute autre finalité que vous auriez acceptée.
            </li>
          </ul>
          <p>
            Nous ne vendons pas vos données et ne les partageons jamais avec
            l&apos;administration.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Conservation</h2>
          <p>
            Nous conservons vos données personnelles uniquement aussi longtemps que
            nécessaire aux finalités décrites ici, pour respecter nos obligations légales,
            résoudre d&apos;éventuels litiges et faire appliquer nos accords. Les données
            d&apos;usage sont en général conservées sur une durée plus courte.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Transfert de vos données
          </h2>
          <p>
            Vos données peuvent être traitées sur des serveurs situés en dehors de votre
            pays de résidence, où les lois de protection des données peuvent différer. Nous
            prenons les mesures raisonnablement nécessaires pour que vos données soient
            traitées de manière sécurisée et conformément à la présente politique.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Vos droits</h2>
          <p>
            Vous pouvez à tout moment demander l&apos;accès, la rectification, la
            suppression, la limitation du traitement ou la portabilité de vos données
            personnelles. Vous pouvez gérer une partie de ces informations directement
            depuis votre compte, ou nous contacter pour exercer vos droits.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Sécurité</h2>
          <p>
            La sécurité de vos données nous tient à cœur et vos documents sont stockés
            chiffrés. Toutefois, aucune méthode de transmission sur Internet ni de stockage
            électronique n&apos;est sûre à 100 %. Nous nous efforçons de protéger vos
            données par des moyens commercialement acceptables, sans pouvoir en garantir la
            sécurité absolue.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Confidentialité des mineurs
          </h2>
          <p>
            Le service ne s&apos;adresse pas aux personnes de moins de 16 ans et nous ne
            collectons pas sciemment leurs données. Si vous êtes parent ou tuteur et pensez
            que votre enfant nous a fourni des données, veuillez nous contacter.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Nous contacter</h2>
          <p>
            Pour toute question relative à cette politique de confidentialité, vous pouvez
            nous écrire à :{" "}
            <a className="text-primary underline" href="mailto:contact@manaturalisation.ch">
              contact@manaturalisation.ch
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}

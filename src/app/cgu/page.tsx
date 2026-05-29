import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — MaNaturalisation",
  description:
    "Les conditions générales d'utilisation du service MaNaturalisation, outil d'organisation pour la naturalisation ordinaire à Genève.",
};

export default function CguPage() {
  return (
    <article className="container max-w-3xl py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
        Conditions générales d&apos;utilisation
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : mai 2026
      </p>

      <div className="legal mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">1. Préambule</h2>
          <p>
            MaNaturalisation (« nous », « notre service ») est un outil en ligne
            d&apos;organisation destiné aux personnes qui entament une démarche de
            naturalisation ordinaire dans le canton de Genève. Le service vous aide à
            vérifier votre éligibilité, à rassembler vos documents dans le bon ordre, à
            suivre l&apos;avancement de votre dossier et à éviter qu&apos;une pièce ne
            périme avant l&apos;envoi.
          </p>
          <p>
            MaNaturalisation est un outil d&apos;organisation personnel. Il{" "}
            <strong className="text-foreground">ne fournit pas de conseil juridique</strong>,
            n&apos;est pas affilié au service cantonal des naturalisations ni à aucune
            autorité, et ne dépose ni ne traite votre demande à votre place.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            2. Acceptation des conditions
          </h2>
          <p>
            En utilisant le service, vous acceptez les présentes conditions générales
            d&apos;utilisation (CGU) dans leur intégralité. Lors d&apos;un achat,
            l&apos;acceptation des CGU peut s&apos;effectuer par une case à cocher ou un
            clic de confirmation au moment du paiement. Les CGU peuvent être mises à jour ;
            la version applicable est celle en vigueur au moment de votre utilisation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">3. Description du service</h2>
          <p>MaNaturalisation propose :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Un test d&apos;éligibilité à la naturalisation ordinaire genevoise (gratuit).</li>
            <li>
              Un suivi de dossier qui se débloque par un paiement unique : séquenceur
              anti-péremption, statuts et dates de validité de vos documents, date d&apos;envoi
              calculée, frise des étapes et générateurs d&apos;e-mails.
            </li>
            <li>
              Un espace personnel où vous pouvez téléverser vos documents, stockés chiffrés,
              ainsi qu&apos;une aide à la vérification de ces documents.
            </li>
          </ul>
          <p>
            Le service couvre la naturalisation{" "}
            <strong className="text-foreground">ordinaire</strong> des personnes adultes à
            Genève. Il ne couvre pas les procédures de naturalisation facilitée (par ex.
            conjoint·e de ressortissant·e suisse, troisième génération) ni les autres
            cantons. Le nombre de documents à fournir varie selon votre situation
            personnelle.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            4. Accès et restrictions d&apos;usage
          </h2>
          <p>
            Nous vous accordons un droit d&apos;accès et d&apos;utilisation limité, personnel,
            non transférable et non exclusif. Rien dans les présentes CGU ne transfère de
            droits de propriété intellectuelle.
          </p>
          <p>Il est interdit de :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Utiliser le service à des fins illégales, frauduleuses ou nuisibles.</li>
            <li>
              Revendre, redistribuer ou exploiter commercialement le service sans accord
              écrit.
            </li>
            <li>
              Utiliser des outils automatisés pour extraire, copier ou surveiller le contenu
              du service.
            </li>
            <li>
              Tenter d&apos;accéder sans autorisation aux comptes, données ou à
              l&apos;infrastructure d&apos;autres utilisateurs.
            </li>
            <li>Contourner les limites techniques ou restrictions d&apos;usage.</li>
          </ul>
          <p>
            Nous nous réservons le droit de suspendre ou de résilier un compte en cas de
            violation, sans préavis ni remboursement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            5. Outil d&apos;organisation — absence de conseil juridique
          </h2>
          <p className="font-semibold text-foreground">
            CETTE SECTION EST IMPORTANTE. MERCI DE LA LIRE ATTENTIVEMENT.
          </p>
          <p>
            MaNaturalisation est un outil d&apos;organisation. Il ne fournit{" "}
            <strong className="text-foreground">aucun conseil juridique, fiscal ou
            administratif</strong> et ne remplace ni le service cantonal des naturalisations,
            ni un·e avocat·e ou un·e mandataire.
          </p>
          <p>Vous reconnaissez et acceptez que :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Les informations affichées (conditions, délais, listes de documents, coûts)
              proviennent des pages officielles de ge.ch et peuvent évoluer ou comporter des
              imprécisions. Vous devez toujours vérifier votre situation auprès du service
              cantonal des naturalisations.
            </li>
            <li>
              Le résultat du test d&apos;éligibilité, les séquences proposées et les dates
              calculées sont des estimations à but indicatif et ne garantissent ni la
              recevabilité ni l&apos;issue de votre demande.
            </li>
            <li>
              L&apos;aide à la vérification de vos documents est une assistance à
              l&apos;organisation et{" "}
              <strong className="text-foreground">ne constitue pas une validation
              juridique</strong>. Vous restez seul·e responsable de l&apos;exactitude, de la
              complétude et de l&apos;envoi de votre dossier.
            </li>
            <li>
              MaNaturalisation ne dépose aucune demande en votre nom et n&apos;échange
              aucune donnée avec l&apos;administration.
            </li>
          </ul>
          <p>
            La décision finale appartient exclusivement aux autorités compétentes.
            MaNaturalisation ne saurait être tenu responsable d&apos;un refus, d&apos;une
            décision de non-entrée en matière, d&apos;un retard ou d&apos;un émolument non
            remboursé.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            6. Vos documents et vos données
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Les documents que vous téléversez sont stockés chiffrés dans votre espace
              personnel et ne sont jamais partagés avec l&apos;administration.
            </li>
            <li>
              Vous pouvez supprimer vos documents et vos données à tout moment depuis votre
              espace, ou nous en faire la demande.
            </li>
            <li>
              Nous vous recommandons de conserver vos propres copies des documents que vous
              souhaitez garder.
            </li>
            <li>
              Le traitement de vos données personnelles est décrit dans notre{" "}
              <a className="text-primary underline" href="/confidentialite">
                politique de confidentialité
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            7. Prix, paiement et remboursement
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Le test d&apos;éligibilité est gratuit.</li>
            <li>
              Le suivi complet du dossier se débloque par un paiement unique (sans
              abonnement), au prix indiqué sur le site au moment de l&apos;achat.
            </li>
            <li>
              Les paiements sont traités par Stripe. Toute question de facturation peut être
              adressée à{" "}
              <a className="text-primary underline" href="mailto:contact@manaturalisation.ch">
                contact@manaturalisation.ch
              </a>
              .
            </li>
            <li>
              Pour les clients en Suisse, les prix incluent la TVA suisse le cas échéant.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            8. Disponibilité du service
          </h2>
          <p>
            Nous visons une disponibilité élevée mais ne garantissons pas un accès
            ininterrompu : le service dépend d&apos;infrastructures et de prestataires
            tiers. Nous pouvons suspendre un compte sans préavis en cas de non-paiement, de
            violation des présentes CGU, d&apos;usage abusif ou d&apos;obligation légale.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            9. Propriété intellectuelle
          </h2>
          <p>
            La plateforme, la marque et la technologie de MaNaturalisation restent sa
            propriété exclusive. Vos documents et vos données vous appartiennent ; vous ne
            nous accordez aucun droit au-delà de ce qui est nécessaire pour fournir le
            service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            10. Limitation de responsabilité
          </h2>
          <p>
            DANS TOUTE LA MESURE PERMISE PAR LE DROIT APPLICABLE, MaNaturalisation NE SAURAIT
            ÊTRE TENU RESPONSABLE :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              D&apos;un refus, d&apos;un retard ou de toute conséquence liée à votre demande
              de naturalisation.
            </li>
            <li>
              De l&apos;exactitude ou de l&apos;exhaustivité des informations affichées,
              issues de sources officielles susceptibles d&apos;évoluer.
            </li>
            <li>
              De toute décision prise sur la base des estimations, séquences ou dates
              fournies par le service.
            </li>
            <li>Des interruptions techniques ou pannes d&apos;infrastructure.</li>
            <li>De la perte de données ou de documents.</li>
            <li>
              De dommages indirects, accessoires, spéciaux ou consécutifs, ni des cas de
              force majeure.
            </li>
          </ul>
          <p>
            EN TOUT ÉTAT DE CAUSE, NOTRE RESPONSABILITÉ TOTALE N&apos;EXCÈDERA PAS LE MONTANT
            QUE VOUS NOUS AVEZ VERSÉ AU COURS DES DOUZE (12) MOIS PRÉCÉDANT LE FAIT GÉNÉRATEUR.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            11. Modifications des conditions
          </h2>
          <p>
            Nous nous réservons le droit de modifier les présentes CGU à tout moment. Toute
            modification importante vous sera communiquée par e-mail ou par une notification
            sur le site. La poursuite de l&apos;utilisation du service après la date
            d&apos;entrée en vigueur vaut acceptation des conditions mises à jour.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            12. Droit applicable et for
          </h2>
          <p>
            Les présentes CGU sont régies par le droit suisse. Tout litige relatif à leur
            interprétation ou à leur exécution sera soumis à la compétence exclusive des
            tribunaux de Genève, sous réserve d&apos;un for impératif prévu par la loi.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">13. Contact</h2>
          <p>
            MaNaturalisation — Genève, Suisse (adresse complète disponible sur demande).
            <br />
            E-mail :{" "}
            <a className="text-primary underline" href="mailto:contact@manaturalisation.ch">
              contact@manaturalisation.ch
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}

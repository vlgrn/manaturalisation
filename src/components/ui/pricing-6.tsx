import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Pricing6Props {
  heading?: string;
  description?: string;
  price?: string | number;
  currency?: string;
  priceSuffix?: string;
  features?: string[][];
  buttonText?: string;
  href?: string;
}

const defaultFeatures = [
  ["Séquenceur anti-péremption", "Date d'envoi sûre calculée", "Alertes avant chaque demande à risque"],
  ["Suivi de tous vos documents", "Statuts & dates de péremption", "Générateurs d'e-mails (Hospice général)"],
  ["Frise des 11 étapes", "Détail des coûts officiels", "Accès à vie, sans abonnement"],
];

export const Pricing6 = ({
  heading = "Un prix simple",
  description = "Essai gratuit de 24 h, sans carte bancaire. Ensuite, un seul paiement débloque le suivi de votre dossier à vie.",
  price = 39,
  currency = "CHF",
  priceSuffix = "paiement unique",
  features = defaultFeatures,
  buttonText = "Démarrer l'essai gratuit",
  href = "/tableau-de-bord",
}: Pricing6Props) => {
  return (
    <section id="prix" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-4xl font-semibold lg:text-6xl">{heading}</h2>
          <p className="max-w-md text-muted-foreground lg:text-xl">{description}</p>
          <div className="mx-auto flex w-full flex-col rounded-lg border p-6 text-left sm:w-fit sm:min-w-80">
            <div className="flex items-end justify-center gap-1">
              <span className="text-6xl font-semibold leading-none">{price}</span>
              <div className="flex flex-col items-start pb-1">
                <span className="text-lg font-semibold">{currency}</span>
                <span className="text-sm text-muted-foreground">{priceSuffix}</span>
              </div>
            </div>
            <div className="my-6">
              {features.map((featureGroup, idx) => (
                <div key={idx}>
                  <ul className="flex flex-col gap-3">
                    {featureGroup.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-4 text-sm font-medium"
                      >
                        {feature}{" "}
                        <Check className="inline size-4 shrink-0 text-primary" />
                      </li>
                    ))}
                  </ul>
                  {idx < features.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
            <Button asChild size="lg">
              <Link href={href}>{buttonText}</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              24 h d&apos;essai · sans carte bancaire
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

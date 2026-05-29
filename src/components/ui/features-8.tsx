import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, Lock, Mail, ListChecks } from "lucide-react";

// Bento-style feature grid (adapted from the features-8 pattern) with copy
// focused on what actually de-risks the dossier for a Geneva applicant.
export function Features() {
  return (
    <section id="fonctionnement" className="bg-muted/40 py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight lg:text-5xl">
            Le risque n&apos;est pas la condition. C&apos;est l&apos;organisation.
          </h2>
          <p className="mt-4 text-muted-foreground lg:text-lg">
            La plupart des refus et des retards ne viennent pas des conditions, mais de
            l&apos;organisation : un délai mal anticipé, une attestation périmée, une pièce
            oubliée. Voici ce que MaNaturalisation gère à votre place.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-6 gap-3">
          {/* Big stat — the sequencer */}
          <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
            <CardContent className="relative m-auto size-fit pt-6">
              <div className="relative flex h-24 w-56 items-center justify-center">
                <span className="block text-7xl font-semibold text-primary">0</span>
              </div>
              <h3 className="mt-2 text-center text-2xl font-semibold">document périmé</h3>
              <p className="mt-2 max-w-[14rem] text-center text-sm text-muted-foreground">
                Le séquenceur lance les documents lents d&apos;abord et bloque les
                attestations à 3 mois jusqu&apos;au bon moment.
              </p>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-6">
              <div className="relative mx-auto flex aspect-square size-32 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border">
                <Lock className="size-10 text-primary" strokeWidth={1.25} />
              </div>
              <div className="relative z-10 mt-6 space-y-2 text-center">
                <h3 className="text-lg font-medium">Vos documents, chiffrés</h3>
                <p className="text-muted-foreground">
                  Vos pièces sont stockées chiffrées dans votre espace, jamais transmises
                  à l&apos;administration. On vous aide à vérifier qu&apos;elles sont
                  complètes. Ce n&apos;est pas un conseil juridique.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Safe mail date */}
          <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center pt-2 lg:px-6">
                <div className="flex w-full items-end gap-2">
                  {[40, 58, 35, 72, 50, 88].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${i === 5 ? "bg-primary" : "bg-primary/20"}`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-8 space-y-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CalendarClock className="size-5 text-primary" />
                  <h3 className="text-lg font-medium">Date d&apos;envoi sûre</h3>
                </div>
                <p className="text-muted-foreground">
                  Recalculée à chaque mise à jour, pour savoir quand poster sans qu&apos;une
                  pièce ne soit déjà expirée.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mailto generators + official links */}
          <Card className="relative col-span-full overflow-hidden lg:col-span-3">
            <CardContent className="grid pt-6 sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                <div className="relative flex aspect-square size-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border">
                  <Mail className="m-auto size-5 text-primary" strokeWidth={1.25} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">E-mails prêts à envoyer</h3>
                  <p className="text-muted-foreground">
                    La demande à l&apos;Hospice général et les liens officiels, pré-remplis.
                    Plus de page ge.ch à chercher.
                  </p>
                </div>
              </div>
              <div className="relative mt-6 rounded-tl-lg border-l border-t p-6 sm:ml-6">
                <div className="absolute left-3 top-2 flex gap-1">
                  <span className="block size-2 rounded-full border" />
                  <span className="block size-2 rounded-full border" />
                  <span className="block size-2 rounded-full border" />
                </div>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">À : info@hospicegeneral.ch</div>
                  <div className="h-px bg-border" />
                  <p>Madame, Monsieur,</p>
                  <p>
                    Dans le cadre d&apos;une demande de naturalisation ordinaire, je
                    sollicite une attestation de non-assistance…
                  </p>
                  <span className="inline-flex rounded bg-primary px-2 py-1 text-primary-foreground">
                    Envoyer
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps + eligibility */}
          <Card className="relative col-span-full overflow-hidden lg:col-span-3">
            <CardContent className="grid pt-6 sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                <div className="relative flex aspect-square size-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border">
                  <ListChecks className="m-auto size-5 text-primary" strokeWidth={1.25} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">De l&apos;éligibilité au serment</h3>
                  <p className="text-muted-foreground">
                    Les 11 étapes de la procédure, votre position, ce qui vient ensuite et
                    ce qui avance en parallèle.
                  </p>
                </div>
              </div>
              <div className="relative mt-6 space-y-3 sm:ml-6">
                {[
                  { n: "1", t: "Éligibilité vérifiée", done: true },
                  { n: "2", t: "Dossier demandé", done: true },
                  { n: "3", t: "Documents en cours", done: false },
                  { n: "4", t: "Envoi du dossier", done: false },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <span
                      className={`flex size-7 items-center justify-center rounded-full border text-xs font-bold ${
                        s.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.done ? "✓" : s.n}
                    </span>
                    <span
                      className={`text-sm ${s.done ? "font-medium" : "text-muted-foreground"}`}
                    >
                      {s.t}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

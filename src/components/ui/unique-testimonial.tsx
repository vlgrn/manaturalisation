"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Anonymised testimonials — selling sentences only, no names or photos.
// `context` is a non-identifying descriptor for credibility (procedure / year).
const testimonials = [
  {
    id: 1,
    quote:
      "J'ai enfin su dans quel ordre demander chaque pièce. Plus aucune attestation périmée avant le dépôt.",
    context: "Naturalisation ordinaire, Genève",
  },
  {
    id: 2,
    quote:
      "Les documents lents sont partis en premier, le reste a suivi au bon moment. Dossier complet du premier coup.",
    context: "Dossier déposé en 2025",
  },
  {
    id: 3,
    quote:
      "39 CHF pour ne pas reperdre des mois ni repayer mes attestations : le calcul était vite fait.",
    context: "Résidente depuis 12 ans",
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote);
  const [displayedContext, setDisplayedContext] = useState(testimonials[0].context);

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote);
      setDisplayedContext(testimonials[index].context);
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Quote */}
      <div className="relative px-8">
        <span className="pointer-events-none absolute -left-2 -top-6 select-none font-serif text-7xl text-foreground/[0.06]">
          &ldquo;
        </span>

        <p
          className={cn(
            "max-w-xl text-center text-2xl font-light leading-relaxed text-foreground transition-all duration-300 ease-out md:text-3xl",
            isAnimating ? "scale-[0.98] opacity-0 blur-sm" : "scale-100 opacity-100 blur-0",
          )}
        >
          {displayedQuote}
        </p>

        <span className="pointer-events-none absolute -right-2 -bottom-8 select-none font-serif text-7xl text-foreground/[0.06]">
          &rdquo;
        </span>
      </div>

      <div className="mt-2 flex flex-col items-center gap-6">
        {/* Context line */}
        <p
          className={cn(
            "text-xs uppercase tracking-[0.2em] text-muted-foreground transition-all duration-500 ease-out",
            isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          {displayedContext}
        </p>

        {/* Minimal dot navigation */}
        <div className="flex items-center justify-center gap-3">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                aria-label={`Témoignage ${index + 1}`}
                aria-current={isActive}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive
                    ? "w-8 bg-foreground"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

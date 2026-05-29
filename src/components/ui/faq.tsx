"use client";

import { useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [active, setActive] = useState<number | null>(0);

  const setGlow = (event: MouseEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  return (
    <section id="faq" className="border-t bg-slate-50 py-20 md:py-28">
      <div className="container max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-500">
          FAQ
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 lg:text-5xl">
          Questions fréquentes
        </h2>

        <ul className="mt-10 space-y-3">
          {items.map((item, index) => {
            const open = active === index;
            return (
              <motion.li
                key={item.q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 0.68, 0, 1],
                }}
                onMouseMove={setGlow}
                className="group relative overflow-hidden rounded-2xl border border-ink-300/50 bg-white transition-all duration-300 hover:border-ink-300 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(240px circle at var(--x, 50%) var(--y, 50%), rgba(218,41,28,0.07), transparent 70%)",
                  }}
                />

                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(open ? null : index)}
                  className="relative flex w-full items-center gap-4 px-5 py-5 text-left md:px-6"
                >
                  <span
                    className={cn(
                      "relative flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                      open
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-ink-300/70 text-ink-700 group-hover:border-ink-300",
                    )}
                  >
                    <svg
                      className={cn(
                        "size-4 transition-transform duration-500",
                        open && "rotate-45",
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 5v14"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="flex-1 text-base font-medium text-ink-900 md:text-lg">
                    {item.q}
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 pl-[3.25rem] text-sm leading-relaxed text-ink-500 md:px-6 md:pl-[3.5rem]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

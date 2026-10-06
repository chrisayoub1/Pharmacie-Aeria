"use client";

import Image from "next/image";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, label: "Conseils professionnels" },
  { icon: Clock, label: "9h30 – 21h · 7j/7" },
  { icon: Sparkles, label: "Parapharmacie & bien-être" },
];

export function WelcomeBanner() {
  return (
    <section className="relative -mt-8 z-20 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-foreground/10">
        <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
          {/* Mascot GIF — left on desktop, centered on mobile */}
          <div className="mx-auto mt-6 md:my-6 md:ms-8 flex justify-center">
            <div className="relative h-36 w-36 sm:h-44 sm:w-44 md:h-48 md:w-48 drop-shadow-xl">
              <Image
                src="/mascot-new.gif"
                alt="Mascotte Pharmacie Aeria vous souhaitant la bienvenue"
                fill
                sizes="(max-width: 768px) 176px, 192px"
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Greeting + features */}
          <div className="px-6 pb-6 md:px-8 md:py-8 md:pe-10 text-center md:text-start">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-tight">
              Bienvenue à la Pharmacie Aeria
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Votre santé, notre priorité — au cœur d'Aeria Mall, Casablanca.
            </p>

            {/* Feature chips */}
            <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2.5">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-3.5 py-1.5 text-xs sm:text-[13px] font-medium text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {f.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-teal-400 to-primary" />
      </div>
    </section>
  );
}

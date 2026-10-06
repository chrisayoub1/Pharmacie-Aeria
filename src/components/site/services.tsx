"use client";

import {
  HeartPulse,
  Pill,
  Sparkles,
  Droplets,
  Leaf,
} from "lucide-react";
import { Reveal } from "./reveal";

const SERVICES = [
  {
    icon: HeartPulse,
    title: "Conseil pharmaceutique",
    text: "Un échange avec l'équipe de la pharmacie pour vous orienter dans vos choix de santé au quotidien.",
  },
  {
    icon: Pill,
    title: "Produits de santé",
    text: "Une gamme de produits de santé, disponibles en pharmacie pour répondre à vos besoins courants.",
  },
  {
    icon: Sparkles,
    title: "Parapharmacie",
    text: "Une sélection de produits de parapharmacie soigneusement choisis pour le soin et le bien-être.",
  },
  {
    icon: Droplets,
    title: "Hygiène & soins",
    text: "Des produits d'hygiène et de soins pour toute la famille, dans un cadre conseil et accueillant.",
  },
  {
    icon: Leaf,
    title: "Bien-être",
    text: "Des solutions orientées bien-être et nature, pour vous accompagner au quotidien.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 md:py-32 bg-secondary/60"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Nos services
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1] sm:leading-[1.08]">
              Un accompagnement à chaque visite
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              La pharmacie vous accueille pour des conseils de santé, des
              produits de parapharmacie et des solutions du quotidien, dans un
              cadre professionnel et chaleureux.
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            const wide = i === 0;
            return (
              <Reveal
                key={service.title}
                delay={i * 0.06}
                className={wide ? "lg:col-span-1" : ""}
              >
                <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-foreground/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-medium text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {service.text}
                  </p>
                  <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                </article>
              </Reveal>
            );
          })}

          {/* CTA card */}
          <Reveal delay={SERVICES.length * 0.06}>
            <a
              href="#contact"
              className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-primary p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
            >
              <div>
                <h3 className="font-display text-2xl font-medium leading-tight">
                  Une question&nbsp;?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Contactez l'équipe de la pharmacie pour toute information sur
                  les produits et services.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                Nous contacter
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

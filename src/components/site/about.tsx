"use client";

import Image from "next/image";
import { MapPin, Phone, Clock, HeartPulse } from "lucide-react";
import { Reveal } from "./reveal";

const HIGHLIGHTS = [
  {
    title: "Pharmacie de proximité",
    text: "Une pharmacie locale située à Aeria Mall, facilement accessible au cœur de Casablanca.",
  },
  {
    title: "Accompagnement professionnel",
    text: "Une équipe à l'écoute pour vous orienter parmi les produits de santé et de parapharmacie.",
  },
  {
    title: "Conseil personnalisé",
    text: "Un accompagnement adapté à vos besoins, dans un cadre discret et accueillant.",
  },
  {
    title: "Sélection de produits",
    text: "Un choix de produits de santé, d'hygiène et de bien-être soigneusement sélectionnés.",
  },
];

export function About() {
  return (
    <section id="pharmacie" className="relative py-16 sm:py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-3xl shadow-xl shadow-foreground/5 ring-1 ring-border">
                <Image
                  src="/pharmacy-interior.jpg"
                  alt="Intérieur de la Pharmacie Aeria avec comptoir de conseil et rayonnages"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 to-transparent" />
              </div>
              {/* Floating location card */}
              <div className="absolute -bottom-5 right-4 sm:right-6 w-[240px] sm:w-[270px] rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-2xl shadow-foreground/10">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Nous trouver
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground leading-snug">
                  Pharmacie Aeria
                  <br />
                  Aeria Mall, Casablanca 20000
                </p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Pharmacie+Aeria+Aeria+Mall+Casablanca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"
                >
                  Itinéraire
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground">
                <HeartPulse className="h-3.5 w-3.5" />
                La Pharmacie
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1] sm:leading-[1.08]">
                Une pharmacie locale,
                <br className="hidden sm:block" /> pensée pour vous.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Pharmacie Aeria est une pharmacie de proximité installée à
                Aeria Mall, à Casablanca. Dans un espace lumineux et moderne,
                nous accueillons chaque visiteur avec une écoute attentive et
                un accompagnement professionnel.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Notre rôle va au-delà de la dispensation de produits. Nous
                prenons le temps d'échanger, de comprendre vos besoins et de
                vous orienter vers les solutions les plus adaptées en matière de
                santé, d'hygiène et de bien-être.
              </p>
            </Reveal>

            {/* Highlights grid */}
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {HIGHLIGHTS.map((item, i) => (
                <Reveal key={item.title} delay={0.2 + i * 0.07}>
                  <div className="group h-full rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-foreground/5">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Contact mini-row */}
            <Reveal delay={0.5}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-7">
                <a
                  href="tel:0529122323"
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  05 29 12 23 23
                </a>
                <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Aeria Mall, Casablanca
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

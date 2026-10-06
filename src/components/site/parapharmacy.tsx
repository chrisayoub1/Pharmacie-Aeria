"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

const CATEGORIES = [
  { name: "Soins du visage", desc: "Soins adaptés aux différents types de peau." },
  { name: "Hygiène", desc: "Produits d'hygiène pour toute la famille." },
  { name: "Soins du corps", desc: "Soin et confort au quotidien." },
  { name: "Bien-être", desc: "Une sélection nature et bien-être." },
  { name: "Maternité & bébé", desc: "Produits pensés pour les jeunes familles." },
  { name: "Produits du quotidien", desc: "L'essentiel pour chaque jour." },
];

export function Parapharmacy() {
  return (
    <section id="parapharmacie" className="relative py-16 sm:py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <Reveal className="lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/5] overflow-hidden rounded-3xl shadow-xl shadow-foreground/5 ring-1 ring-border">
                <Image
                  src="/parapharmacy-products.jpg"
                  alt="Sélection de produits de parapharmacie et bien-être à la Pharmacie Aeria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Tag */}
              <div className="absolute left-5 top-5 rounded-full bg-white/90 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary shadow-md ring-1 ring-border">
                Sélection Bien-être &amp; Nature
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Parapharmacie
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1] sm:leading-[1.08]">
                Des produits pour prendre soin de vous
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                La parapharmacie regroupe des produits de soin, d'hygiène et de
                bien-être. À la Pharmacie Aeria, nous vous proposons différentes
                catégories pour vous accompagner dans votre quotidien.
              </p>
            </Reveal>

            {/* Category grid */}
            <div className="mt-9 grid sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat, i) => (
                <Reveal key={cat.name} delay={0.15 + i * 0.05}>
                  <div className="group rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:bg-accent/40">
                    <h3 className="text-sm font-semibold text-foreground">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {cat.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.5}>
              <div className="mt-9">
                <Button asChild size="lg" className="rounded-full px-7 text-base">
                  <a href="#contact">
                    Nous contacter pour plus d'informations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

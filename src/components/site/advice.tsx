"use client";

import Image from "next/image";
import { MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";
import { Slideshow } from "./slideshow";

export function Advice() {
  return (
    <section
      id="conseils"
      className="relative py-16 sm:py-20 md:py-28 bg-secondary/60 overflow-hidden"
    >
      {/* soft decorative tint */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-accent blur-3xl opacity-60" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top — text + consultation image */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-border">
                <MessageCircleHeart className="h-3.5 w-3.5" />
                Conseils &amp; accompagnement
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1] sm:leading-[1.08]">
                Un conseil adapté à vos besoins
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Chaque visite à la pharmacie est l'occasion d'échanger avec une
                équipe à l'écoute. Nous prenons le temps de comprendre vos
                besoins et de vous orienter vers les produits les plus adaptés.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Que ce soit pour une question de santé, d'hygiène ou de
                bien-être, vous pouvez vous adresser à l'équipe de la pharmacie
                pour un conseil personnalisé, dans un cadre confidentiel et
                respectueux.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-white p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Les conseils dispensés en pharmacie sont généraux et ne
                  remplacent pas une consultation médicale. Pour tout problème
                  de santé, consultez un professionnel de santé.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Image */}
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-foreground/5 ring-1 ring-border">
                <Image
                  src="/pharmacy-consultation.jpg"
                  alt="Pharmacienne de la Pharmacie Aeria conseillant une cliente au comptoir"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
              </div>
              {/* Quote chip */}
              <div className="absolute -bottom-5 -left-3 sm:left-6 max-w-[260px] rounded-2xl border border-border bg-white p-4 shadow-2xl shadow-foreground/10">
                <p className="font-display text-base text-foreground leading-snug">
                  « Une écoute attentive, à chaque visite. »
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom — Nos conseils bien-être + compact slideshow */}
        <div className="mt-20 md:mt-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Heading column */}
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-border">
                  <Sparkles className="h-3.5 w-3.5" />
                  Conseils santé
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="mt-5 font-display text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-[1.1]">
                  Nos conseils bien-être
                </h3>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Découvrez nos fiches conseils sur la santé au quotidien. Des
                  informations pratiques, partagées par l'équipe de la
                  Pharmacie Aeria.
                </p>
              </Reveal>
            </div>

            {/* Compact slideshow column */}
            <Reveal delay={0.15} className="lg:col-span-7">
              <div className="mx-auto max-w-md lg:max-w-none lg:ml-auto">
                <Slideshow />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

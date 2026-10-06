"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Background — high-quality MP4 video on ALL devices */}
      <div className="absolute inset-0 -z-10">
        {/* High-quality MP4 video — visible on all devices */}
        <video
          src="/hero-video.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        {/* Overlay — darker on left (text readability), lighter on right (video visible) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06120f]/90 via-[#06120f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06120f]/60 via-transparent to-[#06120f]/10" />
        {/* Mobile: slight extra darkening so text stays readable on small screens */}
        <div className="absolute inset-0 bg-[#06120f]/20 md:bg-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 pt-24 pb-28 sm:pb-32 md:pt-28 md:pb-40">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 rounded-full bg-[#06120f] px-3.5 sm:px-4 py-1.5 ring-1 ring-white/15 shadow-lg shadow-black/20 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Stethoscope className="h-3.5 w-3.5 text-teal-300" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-white">
              Pharmacie &amp; Parapharmacie · Casablanca
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-5 sm:mt-6 font-display text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl sm:leading-[1.02] font-medium tracking-tight text-white animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            Pharmacie Aeria
          </h1>

          {/* Subheadline */}
          <p
            className="mt-3 sm:mt-4 font-display text-xl sm:text-3xl text-teal-50/95 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            Votre santé, notre priorité.
          </p>

          {/* Supporting text */}
          <p
            className="mt-5 sm:mt-6 max-w-xl text-[15px] sm:text-lg leading-relaxed text-white/80 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            Une pharmacie de proximité à Aeria Mall, Casablanca, avec un
            accompagnement professionnel et une sélection de produits de santé
            et de parapharmacie.
          </p>

          {/* CTAs */}
          <div
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: "480ms" }}
          >
            <Button asChild size="lg" className="rounded-full px-6 sm:px-7 text-base shadow-lg shadow-primary/20 w-full sm:w-auto">
              <Link href="#contact">
                Nous contacter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-6 sm:px-7 text-base border-white/20 bg-[#06120f]/80 text-white backdrop-blur-md hover:bg-[#06120f] hover:text-white w-full sm:w-auto"
            >
              <Link href="#pharmacie">Voir la pharmacie</Link>
            </Button>
          </div>

          {/* Location + Phone chips */}
          <div
            className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up"
            style={{ animationDelay: "600ms" }}
          >
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Pharmacie+Aeria+Aeria+Mall+Casablanca"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-sm text-white transition-colors hover:text-teal-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06120f] ring-1 ring-white/15">
                <MapPin className="h-4 w-4 text-teal-300" />
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-teal-200/80">
                  Adresse
                </span>
                <span className="font-semibold">Aeria Mall, Casablanca</span>
              </span>
            </a>
            <a
              href="tel:0529122323"
              className="group flex items-center gap-2.5 text-sm text-white transition-colors hover:text-teal-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06120f] ring-1 ring-white/15">
                <Phone className="h-4 w-4 text-teal-300" />
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-teal-200/80">
                  Téléphone
                </span>
                <span className="font-semibold">05 29 12 23 23</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}

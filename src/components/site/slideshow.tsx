"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    src: "/conseil-vitamine-d.jpg",
    title: "Vitamine D & soleil",
    alt: "Infographie Pharmacie Aeria — Vitamine D et exposition au soleil au Maroc",
  },
  {
    src: "/conseil-microbiote.jpg",
    title: "Microbiote & chaleur",
    alt: "Infographie Pharmacie Aeria — Microbiote intestinal et chaleur estivale",
  },
  {
    src: "/conseil-magnesium.jpg",
    title: "Magnésium & sommeil",
    alt: "Infographie Pharmacie Aeria — Magnésium et qualité du sommeil",
  },
  {
    src: "/conseil-hydratation.jpg",
    title: "Hydratation & électrolytes",
    alt: "Infographie Pharmacie Aeria — Hydratation, électrolytes et déshydratation",
  },
  {
    src: "/conseil-sport.jpg",
    title: "Sport & chaleur",
    alt: "Infographie Pharmacie Aeria — Sport et chaleur, conseils de récupération",
  },
  {
    src: "/conseil-yeux.jpg",
    title: "Yeux & soleil",
    alt: "Infographie Pharmacie Aeria — Protection des yeux et soleil",
  },
  {
    src: "/conseil-electrolytes.jpg",
    title: "Les électrolytes en été",
    alt: "Infographie Pharmacie Aeria — Les électrolytes, alliés de l'été",
  },
  {
    src: "/conseil-complements.jpg",
    title: "Compléments essentiels",
    alt: "Infographie Pharmacie Aeria — Compléments essentiels pour l'été",
  },
  {
    src: "/conseil-solaire.jpg",
    title: "Protection solaire",
    alt: "Infographie Pharmacie Aeria — Comment bien choisir sa protection solaire",
  },
  {
    src: "/conseil-peau-ete.jpg",
    title: "Peau en été",
    alt: "Infographie Pharmacie Aeria — Routine quotidienne pour la peau en été",
  },
  {
    src: "/conseil-enfants-chaleur.jpg",
    title: "Enfants & chaleur",
    alt: "Infographie Pharmacie Aeria — Aider les enfants face à la chaleur",
  },
  {
    src: "/conseil-moustiques.jpg",
    title: "Moustiques : prévenir & guérir",
    alt: "Infographie Pharmacie Aeria — Prévention et traitement des piqûres de moustiques",
  },
  {
    src: "/conseil-trousse-voyage.jpg",
    title: "Trousse de voyage",
    alt: "Infographie Pharmacie Aeria — Les essentiels de la trousse de voyage",
  },
  {
    src: "/conseil-sommeil-ete.jpg",
    title: "Sommeil en été",
    alt: "Infographie Pharmacie Aeria — Mieux dormir malgré la chaleur",
  },
];

const INTERVAL_MS = 4000;

export function Slideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setActive((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, paused, next]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-foreground/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — compact 1:1 frame */}
      <div className="relative aspect-square sm:aspect-[4/3]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-contain bg-white"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Caption + controls bar — slim */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-3 py-2.5">
        <p className="truncate text-xs sm:text-sm font-medium text-foreground">
          {SLIDES[active].title}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {active + 1}/{SLIDES.length}
          </span>
          {/* Arrows */}
          <button
            type="button"
            aria-label="Précédent"
            onClick={prev}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={next}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar (desktop) */}
      <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${((active + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Mobile progress bar (top) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10 sm:hidden">
        <div
          className="h-full bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${((active + 1) / SLIDES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

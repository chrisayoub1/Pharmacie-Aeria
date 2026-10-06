"use client";

import { MapPin, Phone, Navigation, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function Location() {
  return (
    <section id="localisation" className="relative py-16 sm:py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Info card */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-foreground p-8 md:p-10 text-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
                  Nous trouver
                </span>
                <h2 className="mt-4 font-display text-3xl md:text-4xl font-medium tracking-tight leading-[1.1]">
                  Pharmacie Aeria
                </h2>
                <p className="mt-3 text-white/70 leading-relaxed">
                  Une pharmacie située à Aeria Mall, au cœur de Casablanca,
                  facilement accessible.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                      <Building2 className="h-4 w-4 text-teal-300" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-white/50">
                        Adresse
                      </p>
                      <p className="mt-0.5 font-medium leading-snug">
                        Aeria Mall, Casablanca 20000, Maroc
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                      <Phone className="h-4 w-4 text-teal-300" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-white/50">
                        Téléphone
                      </p>
                      <a
                        href="tel:0529122323"
                        className="mt-0.5 block font-medium leading-snug transition-colors hover:text-teal-200"
                      >
                        05 29 12 23 23
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                      <MapPin className="h-4 w-4 text-teal-300" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-white/50">
                        Quartier
                      </p>
                      <p className="mt-0.5 font-medium leading-snug">
                        Aeria Mall · Casablanca
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-7 text-base bg-white text-foreground hover:bg-white/90"
                >
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Pharmacie+Aeria+Aeria+Mall+Casablanca"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Itinéraire
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 text-base border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="tel:0529122323">
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="relative h-full min-h-[360px] overflow-hidden rounded-3xl border border-border shadow-xl shadow-foreground/5">
              <iframe
                title="Carte — Pharmacie Aeria, Aeria Mall, Casablanca"
                src="https://maps.google.com/maps?q=Pharmacie%20Aeria%20Aeria%20Mall%20Casablanca&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

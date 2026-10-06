"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, HeartPulse } from "lucide-react";

const NAV_LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#pharmacie", label: "La Pharmacie" },
  { href: "#services", label: "Services" },
  { href: "#parapharmacie", label: "Parapharmacie" },
  { href: "#conseils", label: "Conseils" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 sm:py-16 md:py-20 pb-28 lg:pb-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/20">
                <Image
                  src="/logo.jpg"
                  alt="Logo Pharmacie Aeria"
                  fill
                  sizes="48px"
                  className="object-contain p-2"
                />
              </span>
              <div>
                <p className="font-display text-xl font-medium">
                  Pharmacie Aeria
                </p>
                <p className="text-sm text-white/55">Aeria Mall · Casablanca</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Une pharmacie de proximité à Aeria Mall, Casablanca. Votre santé,
              notre priorité.
            </p>
            <div className="mt-6 space-y-2.5">
              <a
                href="tel:0529122323"
                className="flex items-center gap-2.5 text-sm text-white/85 transition-colors hover:text-teal-300"
              >
                <Phone className="h-4 w-4 text-teal-300" />
                05 29 12 23 23
              </a>
              <p className="flex items-center gap-2.5 text-sm text-white/85">
                <MapPin className="h-4 w-4 text-teal-300" />
                Aeria Mall, Casablanca 20000, Maroc
              </p>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Navigation
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services list */}
          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Nos univers
            </p>
            <ul className="mt-5 space-y-3">
              <li className="text-sm text-white/75">Conseil pharmaceutique</li>
              <li className="text-sm text-white/75">Produits de santé</li>
              <li className="text-sm text-white/75">Parapharmacie</li>
              <li className="text-sm text-white/75">Hygiène &amp; soins</li>
              <li className="text-sm text-white/75">Bien-être</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <HeartPulse className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-300" />
          <p className="text-xs leading-relaxed text-white/60">
            Les informations présentées sur ce site sont générales et ne
            remplacent pas l'avis d'un professionnel de santé. Pour tout
            problème de santé, consultez un professionnel de santé qualifié.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-xs text-white/50">
            © 2026 Pharmacie Aeria. Tous droits réservés.
          </p>
          <p className="text-xs text-white/40">
            Aeria Mall, Casablanca 20000, Maroc
          </p>
        </div>
      </div>
    </footer>
  );
}

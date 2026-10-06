"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#pharmacie", label: "La Pharmacie" },
  { href: "#services", label: "Services" },
  { href: "#parapharmacie", label: "Parapharmacie" },
  { href: "#conseils", label: "Conseils" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-border/80 shadow-[0_1px_24px_-12px_rgba(24,34,31,0.18)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link
          href="#accueil"
          className="group flex items-center gap-3"
          aria-label="Pharmacie Aeria — accueil"
        >
          <span className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border shadow-sm">
            <Image
              src="/logo.jpg"
              alt="Logo Pharmacie Aeria"
              fill
              sizes="44px"
              className="object-contain p-1.5"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg md:text-xl font-medium tracking-tight text-foreground">
              Pharmacie Aeria
            </span>
            <span className="text-[11px] md:text-xs text-muted-foreground tracking-wide">
              Aeria Mall · Casablanca
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:0529122323"
            className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 text-primary" />
            05 29 12 23 23
          </a>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="#contact">Nous contacter</Link>
          </Button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/70 text-foreground backdrop-blur transition-colors hover:bg-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden overflow-hidden transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <span className="font-display text-lg font-medium">Menu</span>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col px-3 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto space-y-3 border-t border-border px-5 py-5">
            <a
              href="tel:0529122323"
              className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-primary" />
              05 29 12 23 23
            </a>
            <Button asChild className="w-full rounded-full">
              <Link href="#contact" onClick={() => setOpen(false)}>
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

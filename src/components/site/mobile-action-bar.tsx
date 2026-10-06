"use client";

import { useEffect, useState } from "react";
import { Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full"
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-3 mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-white/95 p-2 shadow-2xl shadow-foreground/20 backdrop-blur-lg">
        <a
          href="tel:0529122323"
          className="flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-primary"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </a>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Pharmacie+Aeria+Aeria+Mall+Casablanca"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          <Navigation className="h-4 w-4" />
          Itinéraire
        </a>
      </div>
    </div>
  );
}

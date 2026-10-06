"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for window load, then minimum display time for smooth branding
    const minDisplay = 1100;
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDisplay - elapsed);
      setTimeout(() => setLoading(false), remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      // Safety fallback
      const safety = setTimeout(finish, 3500);
      return () => {
        window.removeEventListener("load", finish);
        clearTimeout(safety);
      };
    }
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center">
            {/* Animated mascot GIF with pulsing rings */}
            <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center">
              {/* Outer pulsing rings */}
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.4,
                }}
              />
              {/* Mascot GIF */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-24 w-24 sm:h-28 sm:w-28"
              >
                <Image
                  src="/mascot-new.gif"
                  alt="Mascotte Pharmacie Aeria"
                  fill
                  sizes="112px"
                  className="object-contain"
                  priority
                  unoptimized
                />
              </motion.div>
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-7 text-center"
            >
              <p className="font-display text-2xl font-medium tracking-tight text-foreground">
                Pharmacie Aeria
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Votre santé, notre priorité.
              </p>
            </motion.div>

            {/* Loading dots */}
            <div className="mt-6 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <motion.div
              className="mt-6 h-0.5 w-40 overflow-hidden rounded-full bg-border"
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

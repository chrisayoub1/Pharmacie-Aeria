"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check at mount whether the device has a fine pointer (mouse).
    // Runs identically on the client only — keeps SSR output stable.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) {
      return () => {
        document.body.classList.remove("has-custom-cursor");
      };
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, input, textarea, select, label, [role='button'], [data-cursor='hover']"
      );
      setHovering(!!interactive);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      {/* Center dot — instant follow */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-primary transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Outer ring — spring follow, grows on hover, shrinks on click */}
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[9998] h-9 w-9 rounded-full border-2 border-primary transition-[width,height,background-color,opacity] duration-200 ease-out",
          hovering && "h-11 w-11 bg-primary/10",
          clicking && "opacity-50"
        )}
        style={{ opacity: visible ? 0.6 : 0 }}
      />
    </>
  );
}

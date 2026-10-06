"use client";

import { useEffect } from "react";

// Cookie-free analytics for the admin dashboard: pageviews + time on site.
export function Tracker() {
  useEffect(() => {
    const isNew = !sessionStorage.getItem("seen");
    let start = Number(sessionStorage.getItem("visitStart")) || Date.now();
    sessionStorage.setItem("visitStart", String(start));
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newVisitor: isNew }),
    }).catch(() => {});
    sessionStorage.setItem("seen", "1");

    // Send visit duration when the visitor leaves the site.
    const send = () => {
      const secs = Math.min(Math.max(Math.round((Date.now() - start) / 1000), 0), 3600);
      if (secs >= 1) {
        navigator.sendBeacon("/api/track", new Blob([JSON.stringify({ duration: secs })], { type: "application/json" }));
      }
    };
    window.addEventListener("pagehide", send);
    return () => window.removeEventListener("pagehide", send);
  }, []);
  return null;
}

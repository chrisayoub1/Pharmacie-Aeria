"use client";

import { useEffect } from "react";

// Cookie-free pageview tracking for the admin dashboard.
export function Tracker() {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newVisitor: !sessionStorage.getItem("seen") }),
    }).catch(() => {});
    sessionStorage.setItem("seen", "1");
  }, []);
  return null;
}

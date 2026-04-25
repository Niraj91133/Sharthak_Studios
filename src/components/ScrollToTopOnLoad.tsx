"use client";

import { useLayoutEffect } from "react";

export default function ScrollToTopOnLoad() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // If a URL hash is present, allow the browser to scroll to the anchor.
    if (window.location.hash && window.location.hash.length > 1) return;

    // Ensure reloads don't restore old scroll positions.
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      // ignore
    }

    // Always start at the true top for a stable landing experience.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}

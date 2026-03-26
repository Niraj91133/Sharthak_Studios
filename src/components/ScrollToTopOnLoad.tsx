"use client";

import { useLayoutEffect } from "react";

function getNavigationType(): string {
  try {
    const navEntry = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
    if (navEntry?.type) return navEntry.type;
  } catch {
    // ignore
  }

  // Deprecated fallback (Safari older versions)
  try {
    const t = (performance as unknown as { navigation?: { type?: number } })?.navigation?.type;
    if (t === 1) return "reload";
  } catch {
    // ignore
  }

  return "navigate";
}

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

    const navType = getNavigationType();
    if (navType === "reload" || navType === "back_forward") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      // For a normal first load, still guarantee the top section.
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return null;
}

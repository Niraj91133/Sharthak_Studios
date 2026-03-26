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

function isElementScrollableTarget(el: HTMLElement): boolean {
  try {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
  } catch {
    // ignore
  }
  const rect = el.getBoundingClientRect();
  return rect.height > 0;
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

    // Reset first, then (for home) jump to the desired section.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const isHome = window.location.pathname === "/" || window.location.pathname === "";
    const targetId = isHome ? "infinite-strips-section" : null;
    if (!targetId) return;

    const navType = getNavigationType();
    const shouldApply = navType === "reload" || navType === "back_forward" || navType === "navigate";
    if (!shouldApply) return;

    let raf = 0;
    let tries = 0;
    const maxTries = 180; // ~3s

    const attempt = () => {
      tries += 1;
      const el = document.getElementById(targetId) as HTMLElement | null;
      if (el && isElementScrollableTarget(el)) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      if (tries >= maxTries) return;
      raf = window.requestAnimationFrame(attempt);
    };

    raf = window.requestAnimationFrame(attempt);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaContext } from "@/context/MediaContext";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";

type GalleryTab = { label: string };
type GalleryItem = { seed: string; col: string; row: string; category: string };
type GallerySectionProps = { tabs: GalleryTab[]; items: GalleryItem[] };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type LayoutItem = { idx: number; w: number };
type LayoutRow = { h: number; items: LayoutItem[] };

export default function GallerySection({ tabs, items }: GallerySectionProps) {
  const { getSlot } = useMediaContext();

  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const activeMobileBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeDesktopBtnRef = useRef<HTMLButtonElement | null>(null);

  const [revealed, setRevealed] = useState(() => {
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gridSize, setGridSize] = useState({ w: 0, h: 0 });
  const [ratiosBySrc, setRatiosBySrc] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!("matchMedia" in window)) return;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();

    if (typeof media.addEventListener === "function") media.addEventListener("change", update);
    else if (typeof media.addListener === "function") media.addListener(update);

    return () => {
      if (typeof media.removeEventListener === "function") media.removeEventListener("change", update);
      else if (typeof media.removeListener === "function") media.removeListener(update);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setRevealed(true);
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const scrollToActive = (btn: HTMLButtonElement | null) => {
      if (!btn) return;
      requestAnimationFrame(() => {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    };
    scrollToActive(activeMobileBtnRef.current);
    scrollToActive(activeDesktopBtnRef.current);
  }, [activeTab]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((curr) => (curr === null ? curr : Math.min(9, curr + 1)));
      if (event.key === "ArrowLeft") setLightboxIndex((curr) => (curr === null ? curr : Math.max(0, curr - 1)));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [lightboxIndex]);

  const resolveSrc = useMemo(() => {
    return (seed: string, isLightbox: boolean) => {
      if (!seed || seed.startsWith("placeholder-")) return "";
      const fallback = isLightbox
        ? `https://picsum.photos/seed/${seed}/2400/1600`
        : `https://picsum.photos/seed/${seed}/1600/1200`;
      const slot = getSlot(seed);
      if (slot?.uploadedFile && slot.useOnSite) return normalizeMediaUrl(slot.uploadedFile.url);
      return fallback;
    };
  }, [getSlot]);

  const filtered = useMemo(() => items.filter((it) => it.category === activeTab), [activeTab, items]);

  const displayTiles = useMemo(() => {
    const ten = filtered.slice(0, 10);
    if (ten.length >= 10) return ten;
    const padded = [...ten];
    for (let i = ten.length; i < 10; i++) {
      padded.push({ seed: `placeholder-${activeTab}-${i}`, col: "span 2", row: "span 2", category: activeTab });
    }
    return padded;
  }, [activeTab, filtered]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w && h) setGridSize({ w, h });
    };
    update();

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => update());
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const srcs = displayTiles.map((t) => resolveSrc(t.seed, false)).filter(Boolean);
    const unique = Array.from(new Set(srcs));
    if (unique.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) setRatiosBySrc({});
      });
      return;
    }

    const next: Record<string, number> = {};
    const loadOne = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || 1;
          const h = img.naturalHeight || 1;
          next[src] = clamp(w / h, 0.35, 3.2);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });

    Promise.allSettled(unique.map(loadOne)).then(() => {
      if (!cancelled) setRatiosBySrc(next);
    });

    return () => {
      cancelled = true;
    };
  }, [displayTiles, resolveSrc]);

  const layoutRows: LayoutRow[] = useMemo(() => {
    const W = gridSize.w;
    const H = gridSize.h;
    if (!W || !H) return [];

    const ratios = displayTiles.map((t) => {
      const src = resolveSrc(t.seed, false);
      return ratiosBySrc[src] || 1;
    });

    const minBaseH = 56;
    const maxBaseH = 260;

    const build = (baseH: number): LayoutRow[] => {
      const rows: LayoutRow[] = [];
      let row: LayoutItem[] = [];
      let sum = 0;

      for (let i = 0; i < ratios.length; i++) {
        const w = ratios[i] * baseH;
        row.push({ idx: i, w });
        sum += w;

        const isLast = i === ratios.length - 1;
        if (sum >= W || isLast) {
          const scale = sum > 0 ? W / sum : 1;
          rows.push({ h: baseH * scale, items: row.map((it) => ({ idx: it.idx, w: it.w * scale })) });
          row = [];
          sum = 0;
        }
      }

      return rows;
    };

    // Binary search for baseH so total row heights match container height.
    let lo = minBaseH;
    let hi = maxBaseH;
    let best = (lo + hi) / 2;
    for (let iter = 0; iter < 18; iter++) {
      const mid = (lo + hi) / 2;
      const rows = build(mid);
      const total = rows.reduce((acc, r) => acc + r.h, 0);
      best = mid;
      if (total > H) hi = mid;
      else lo = mid;
    }

    const rows = build(best);
    const total = rows.reduce((acc, r) => acc + r.h, 0) || 1;
    const k = H / total;

    // Scale heights to match exactly, then normalize widths per row to full width.
    return rows.map((r) => {
      const newH = r.h * k;
      const sum = r.items.reduce((acc, it) => acc + it.w, 0) || 1;
      const wScale = W / sum;
      return { h: newH, items: r.items.map((it) => ({ idx: it.idx, w: it.w * wScale })) };
    });
  }, [displayTiles, gridSize.h, gridSize.w, ratiosBySrc, resolveSrc]);

  const revealClass = revealed ? "is-revealed" : "";

  return (
    <section
      ref={sectionRef}
      className={`gallery-section w-full bg-black px-0 pt-6 pb-0 ${revealClass} flex flex-col overflow-hidden h-[694px] max-h-[694px] sm:h-[900px] sm:max-h-[900px]`}
    >
      <div className="w-full px-0 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Tabs */}
        <div className="gallery-stagger mb-4 px-6 flex-shrink-0 sm:hidden w-full">
          <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex w-max min-w-full items-center justify-center gap-3 px-1">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === tab.label;
                return (
                  <button
                    key={`tab-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.label);
                      setLightboxIndex(null);
                    }}
                    ref={isActive ? activeMobileBtnRef : undefined}
                    className={[
                      "flex-shrink-0 h-11 px-6 border border-white/35 text-[10px] font-black tracking-[0.22em] uppercase transition-all duration-300",
                      isActive ? "bg-white text-black" : "bg-black text-white/70 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="gallery-stagger mb-4 hidden sm:block px-10 flex-shrink-0">
          <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex w-max min-w-full items-center justify-center gap-4 px-2">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === tab.label;
                return (
                  <button
                    key={`tab-desktop-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.label);
                      setLightboxIndex(null);
                    }}
                    ref={isActive ? activeDesktopBtnRef : undefined}
                    className={[
                      "flex-shrink-0 h-12 px-10 border border-white/30 text-[11px] font-black tracking-[0.35em] uppercase transition-all duration-300",
                      isActive ? "bg-white text-black" : "bg-black text-white/70 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Perfect-fit 10-image grid */}
        <div ref={gridRef} className="gallery-stagger w-full flex-1 min-h-0 overflow-hidden">
          {layoutRows.length === 0 ? (
            <div className="h-full w-full bg-white/5" />
          ) : (
            <div className="h-full w-full">
              {layoutRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex w-full" style={{ height: `${row.h}px` }}>
                  {row.items.map((it) => {
                    const tile = displayTiles[it.idx];
                    const src = resolveSrc(tile.seed, false);
                    const isPlaceholder = tile.seed.startsWith("placeholder-") || !src;
                    return (
                      <button
                        key={tile.seed}
                        type="button"
                        disabled={isPlaceholder}
                        className="relative overflow-hidden bg-black"
                        style={{
                          width: `${it.w}px`,
                          height: "100%",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                        }}
                        onClick={() => {
                          if (!isPlaceholder) setLightboxIndex(it.idx);
                        }}
                      >
                        {isPlaceholder ? (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-[0.3em] text-white/30">
                            UPLOAD 10 IMAGES
                          </div>
                        ) : (
                          <>
                            <img
                              src={src}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              className="absolute inset-0 h-full w-full object-contain bg-black"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-black/6 opacity-90" />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 sm:p-20"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-10 right-10 z-[110] text-white/60 hover:text-white transition-all p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((curr) => (curr === null ? curr : Math.max(0, curr - 1)));
              }}
              className="absolute left-4 md:left-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={lightboxIndex === 0}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>

            <div className="max-w-7xl w-full h-full flex items-center justify-center py-10">
              <img
                src={resolveSrc(displayTiles[lightboxIndex]?.seed || "", true)}
                className="max-w-full max-h-full object-contain shadow-2xl bg-black"
                alt=""
                draggable={false}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((curr) => (curr === null ? curr : Math.min(9, curr + 1)));
              }}
              className="absolute right-4 md:right-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={lightboxIndex === 9}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

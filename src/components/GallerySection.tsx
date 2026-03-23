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

export default function GallerySection({ tabs, items }: GallerySectionProps) {
  const { getSlot } = useMediaContext();

  const DESKTOP_DISPLAY_COUNT = 50;
  const MOBILE_GRID_COUNT = 15;

  const sectionRef = useRef<HTMLElement | null>(null);
  const activeMobileBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeDesktopBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const displayCount = isMobile ? MOBILE_GRID_COUNT : DESKTOP_DISPLAY_COUNT;

  const [revealed, setRevealed] = useState(() => {
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
    const base = filtered.slice(0, displayCount);
    if (base.length >= displayCount) return base;
    const padded = [...base];
    for (let i = base.length; i < displayCount; i++) {
      padded.push({ seed: `placeholder-${activeTab}-${i}`, col: "span 2", row: "span 2", category: activeTab });
    }
    return padded;
  }, [activeTab, displayCount, filtered]);

  const realTiles = useMemo(() => {
    return displayTiles
      .map((t) => ({ seed: t.seed, src: resolveSrc(t.seed, false) }))
      .filter((t) => Boolean(t.src));
  }, [displayTiles, resolveSrc]);

  const clampedLightboxIndex = lightboxIndex === null
    ? null
    : clamp(lightboxIndex, 0, Math.max(0, realTiles.length - 1));

  useEffect(() => {
    if (clampedLightboxIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((curr) => (curr === null ? curr : curr + 1));
      if (event.key === "ArrowLeft") setLightboxIndex((curr) => (curr === null ? curr : curr - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [clampedLightboxIndex]);

  // Keep index in range as data changes.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const max = Math.max(0, realTiles.length - 1);
    if (lightboxIndex < 0 || lightboxIndex > max) {
      const next = clamp(lightboxIndex, 0, max);
      queueMicrotask(() => setLightboxIndex(next));
    }
  }, [lightboxIndex, realTiles.length]);

  const revealClass = revealed ? "is-revealed" : "";
  const gap = isMobile ? 8 : 10;

  // Modern "tricky" grid definition for 15 items in 6 cols x 12 rows
  const mobileAreas = useMemo(() => {
    const layout = [
      "a a a b b b",
      "a a a b b b",
      "a a a b b b",
      "a a a c c c",
      "d d d c c c",
      "d d d c c c",
      "e e f f g g",
      "e e f f g g",
      "h h h i i i",
      "j j j k k k",
      "j j j l l l",
      "m m n n o o"
    ];
    return `"${layout.join('" "')}"`;
  }, []);

  const mobileAreaNames = "abcdefghijklmno".split("");

  return (
    <section
      ref={sectionRef}
      className={`gallery-section w-full bg-black px-0 pt-6 pb-0 ${revealClass} flex flex-col overflow-hidden h-fit sm:h-[900px] sm:max-h-[900px]`}
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

        {/* Mobile: Premium Masonry Grid (No Cropping) */}
        <div className="gallery-stagger w-full flex-shrink-0 sm:hidden px-4 pb-12 overflow-y-auto no-scrollbar">
          <div
            className="columns-2 w-full"
            style={{ columnGap: 8 }}
          >
            {displayTiles.map((tile, index) => {
              const src = resolveSrc(tile.seed, false);
              const isPlaceholder = !src;

              // Skip placeholders if we have actual images and this is a placeholder
              if (isPlaceholder && filtered.length > 0) return null;

              return (
                <button
                  key={tile.seed}
                  type="button"
                  disabled={isPlaceholder}
                  className={[
                    "group relative w-full mb-2 break-inside-avoid overflow-hidden border border-white/10 bg-black/40 rounded-lg",
                    isPlaceholder ? "opacity-40" : "active:scale-[0.98] transition-all",
                  ].join(" ")}
                  onClick={() => {
                    if (isPlaceholder) return;
                    const realIndex = realTiles.findIndex((t) => t.seed === tile.seed);
                    if (realIndex >= 0) setLightboxIndex(realIndex);
                  }}
                >
                  {isPlaceholder ? (
                    <div className="w-full aspect-[3/4] flex items-center justify-center text-[7px] font-black tracking-[0.2em] text-white/20 bg-white/[0.02] uppercase text-center p-2">
                      Upload {index + 1}
                    </div>
                  ) : (
                    <div className="relative w-full h-auto">
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="w-full h-auto block"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-[10px] font-black tracking-widest text-white/20 uppercase">
              No images in this category
            </div>
          )}
        </div>

        {/* Desktop/tablet: masonry grid (vertical scroll inside section) */}
        <div className="gallery-stagger hidden w-full flex-1 min-h-0 overflow-y-auto no-scrollbar px-8 pb-6 sm:block">
          <div
            className="columns-3 md:columns-4 lg:columns-5 xl:columns-6 w-full"
            style={{ columnGap: gap }}
          >
            {displayTiles.map((tile) => {
              const src = resolveSrc(tile.seed, false);
              const isPlaceholder = !src;
              return (
                <button
                  key={tile.seed}
                  type="button"
                  disabled={isPlaceholder}
                  className={[
                    "group w-full text-left",
                    "break-inside-avoid",
                    "rounded-[10px] border border-white/20 bg-black/40 overflow-hidden",
                    isPlaceholder ? "opacity-60" : "hover:border-white/35",
                  ].join(" ")}
                  style={{ marginBottom: gap }}
                  onClick={() => {
                    if (isPlaceholder) return;
                    const realIndex = realTiles.findIndex((t) => t.seed === tile.seed);
                    if (realIndex >= 0) setLightboxIndex(realIndex);
                  }}
                >
                  {isPlaceholder ? (
                    <div className="w-full aspect-[4/5] flex items-center justify-center text-[10px] font-black tracking-[0.3em] text-white/30 bg-white/5">
                      UPLOAD {DESKTOP_DISPLAY_COUNT} IMAGES
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="w-full h-auto block transition duration-500 group-hover:brightness-110"
                      />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/10" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {clampedLightboxIndex !== null && (
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
                setLightboxIndex((curr) => (curr === null ? curr : curr - 1));
              }}
              className="absolute left-4 md:left-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={clampedLightboxIndex === 0}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18L9 12L15 6" />
              </svg>
            </button>

            <div className="max-w-7xl w-full h-full flex items-center justify-center py-10">
              <img
                src={resolveSrc(realTiles[clampedLightboxIndex]?.seed || "", true)}
                className="max-w-full max-h-full object-contain shadow-2xl bg-black"
                alt=""
                draggable={false}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((curr) => (curr === null ? curr : curr + 1));
              }}
              className="absolute right-4 md:right-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={clampedLightboxIndex >= realTiles.length - 1}
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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaAsset } from "@/hooks/useMediaAsset";

type GalleryTab = {
  label: string;
};

type GalleryItem = {
  seed: string;
  col: string;
  row: string;
  category: string;
};

type GallerySectionProps = {
  tabs: GalleryTab[];
  items: GalleryItem[];
};

function GalleryImage({ seed, className, isLightbox = false }: { seed: string; className?: string, isLightbox?: boolean }) {
  const fallback = isLightbox
    ? `https://picsum.photos/seed/${seed}/2400/1600`
    : `https://picsum.photos/seed/${seed}/1600/1200`;
  const { src, isUploaded } = useMediaAsset(seed, fallback);
  const fitClass = isUploaded ? "object-contain bg-black" : "object-cover";
  const safeClass = className?.replace(/\bobject-cover\b/g, "").replace(/\bobject-contain\b/g, "") || "";
  const noZoom = isUploaded ? safeClass.replace(/\bgroup-hover:scale-\[[^\]]+\]\b/g, "") : safeClass;
  return (
    <img
      className={`${noZoom} ${fitClass}`}
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
    />
  );
}

export default function GallerySection({ tabs, items }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(() => {
    // Older iOS Safari doesn't support IntersectionObserver; reveal immediately.
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "WEDDING");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!("matchMedia" in window)) return;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();

    // Safari/iOS < 14 uses addListener/removeListener
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

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setRevealed(true);
      },
      { threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filteredTiles = useMemo(() => {
    return items.filter(item => item.category === activeTab);
  }, [items, activeTab]);

  const mobileTiles = useMemo(() => filteredTiles.slice(0, 12), [filteredTiles]);
  const desktopTiles = useMemo(() => filteredTiles.slice(0, 36), [filteredTiles]);
  const activeTiles = isMobile ? mobileTiles : filteredTiles;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex(curr => curr !== null ? Math.min(activeTiles.length - 1, curr + 1) : curr);
      if (event.key === "ArrowLeft") setLightboxIndex(curr => curr !== null ? Math.max(0, curr - 1) : curr);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeTiles.length, lightboxIndex]);

  const revealClass = revealed ? "is-revealed" : "";

  return (
    <section
      ref={sectionRef}
      className={`gallery-section w-full bg-black px-0 pt-6 pb-0 ${revealClass} flex flex-col overflow-hidden h-[694px] max-h-[694px] sm:h-[900px] sm:max-h-[900px]`}
    >
      <div className="w-full px-0 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Category Header - Robust Rectangular Buttons */}
        <div className="gallery-stagger mb-4 px-6 flex-shrink-0 sm:hidden">
          <div
            className="overflow-x-auto no-scrollbar scroll-smooth"
            dir="rtl"
          >
            <div className="inline-flex items-center gap-3" dir="ltr">
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
                    className={`
                      flex-shrink-0 h-11 px-6 border border-white/35 text-[10px] font-black tracking-[0.22em] uppercase transition-all duration-300
                      ${isActive ? "bg-white text-black" : "bg-black text-white/70 hover:bg-white/5 hover:text-white"}
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Category Header (Centered, scrolls when overflow) */}
        <div className="gallery-stagger mb-4 hidden sm:block px-10 flex-shrink-0">
          <div className="overflow-x-auto no-scrollbar scroll-smooth">
            <div className="mx-auto inline-flex w-max items-center justify-center gap-4 px-2">
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
                    className={`
                      flex-shrink-0 h-12 px-10 border border-white/30 text-[11px] font-black tracking-[0.35em] uppercase transition-all duration-300
                      ${isActive ? "bg-white text-black" : "bg-black text-white/70 hover:bg-white/5 hover:text-white"}
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Grid (Portrait-first, no internal scrolling) */}
        <div className="gallery-stagger grid flex-1 min-h-0 grid-cols-3 auto-rows-[34px] grid-flow-dense gap-0 px-0 pb-0 overflow-hidden sm:hidden">
          {mobileTiles.map((item, idx) => {
            const isLandscape = idx === 0 || idx === 9;
            const isWide = !isLandscape && idx % 7 === 0;
            const spanClass = isLandscape
              ? "col-span-3 row-span-6"
              : isWide
                ? "col-span-2 row-span-5"
                : "col-span-1 row-span-5";

            return (
              <button
                key={item.seed}
                type="button"
                className={[
                  "gallery-tile--reveal group relative overflow-hidden bg-white/5 border border-white/10",
                  spanClass,
                ].join(" ")}
                style={{ transitionDelay: `${Math.min(12, idx) * 30}ms` }}
                onClick={() => setLightboxIndex(idx)}
              >
                <GalleryImage
                  seed={item.seed}
                  className="gallery-img absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/10 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              </button>
            );
          })}
        </div>

        {/* Desktop Dense Grid (fits within 900px, no internal scrolling) */}
        <div
          className="gallery-stagger hidden w-full flex-1 min-h-0 overflow-hidden gap-0 sm:grid"
          style={{
            gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
            gridAutoRows: "78px",
            gridAutoFlow: "dense",
          }}
        >
          {desktopTiles.map((item, idx) => {
            const isHeroLandscape = idx % 9 === 0;
            const isLandscape = !isHeroLandscape && idx % 5 === 0;
            const spanClass = isHeroLandscape
              ? "col-span-4 row-span-3"
              : isLandscape
                ? "col-span-3 row-span-3"
                : "col-span-2 row-span-4";

            return (
              <button
                key={item.seed}
                type="button"
                className={[
                  "gallery-tile--reveal relative group overflow-hidden bg-white/5 border border-white/10",
                  spanClass,
                ].join(" ")}
                style={{ transitionDelay: `${Math.min(20, idx) * 20}ms` }}
                onClick={() => setLightboxIndex(idx)}
              >
                <GalleryImage
                  seed={item.seed}
                  className="gallery-img absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/10 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Implementation */}
      {lightboxIndex !== null && (
        <div className="lightbox fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 sm:p-20" onClick={() => setLightboxIndex(null)}>
          <button
            className="absolute top-10 right-10 z-[110] text-white/60 hover:text-white transition-all p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(curr => Math.max(0, curr! - 1)); }}
              className="absolute left-4 md:left-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={lightboxIndex === 0}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18L9 12L15 6" /></svg>
            </button>

            <div className="max-w-7xl w-full h-full flex items-center justify-center py-10">
              <GalleryImage
                seed={activeTiles[lightboxIndex].seed}
                className="max-w-full max-h-full object-contain shadow-2xl"
                isLightbox={true}
              />
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(curr => Math.min(activeTiles.length - 1, curr! + 1)); }}
              className="absolute right-4 md:right-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={lightboxIndex === activeTiles.length - 1}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-black tracking-[0.5em] uppercase">
            {lightboxIndex + 1} / {activeTiles.length}
          </div>
        </div>
      )}
    </section>
  );
}

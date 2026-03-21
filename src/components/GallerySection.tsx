"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";

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
  const src = useMedia(seed, fallback);
  return <img className={className} src={src} alt="" loading="lazy" draggable={!isLightbox} />;
}

export default function GallerySection({ tabs, items }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "WEDDING");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

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

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex(curr => curr !== null ? Math.min(filteredTiles.length - 1, curr + 1) : curr);
      if (event.key === "ArrowLeft") setLightboxIndex(curr => curr !== null ? Math.max(0, curr - 1) : curr);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [filteredTiles.length, lightboxIndex]);

  const revealClass = revealed ? "is-revealed" : "";

  return (
    <section
      ref={sectionRef}
      className={`gallery-section w-full bg-white px-0 pt-12 pb-0 ${revealClass} overflow-hidden flex flex-col`}
      style={{ maxHeight: "1050px" }}
    >
      <div className="w-full px-0 flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Category Header - Robust Rectangular Buttons */}
        <div className="gallery-stagger flex items-center mb-8 overflow-x-auto no-scrollbar scroll-smooth px-6 gap-4 sm:justify-center sm:flex-wrap flex-shrink-0">
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
                  flex-shrink-0 h-12 px-8 sm:h-14 sm:px-12 border-2 border-black text-[10px] sm:text-[11px] font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase transition-all duration-300
                  ${isActive ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"}
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dense Masonry Grid - High density, smaller images */}
        <div
          className="gallery-stagger grid w-full gap-0 overflow-y-auto no-scrollbar pb-20 flex-1"
          style={{
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(8, minmax(0, 1fr))",
            gridAutoRows: isMobile ? "90px" : "140px",
            gridAutoFlow: "dense",
          }}
        >
          {filteredTiles.map((item, idx) => {
            const mobileGridStyle = {
              gridColumn: item.col.includes("4") ? "span 3" : "span 1",
              gridRow: item.row === "span 3" ? "span 2" : "span 1",
            };
            const desktopGridStyle = {
              gridColumn: item.col,
              gridRow: item.row,
            };

            return (
              <div
                key={item.seed}
                className="gallery-tile gallery-tile--reveal relative group cursor-pointer"
                style={{
                  ...(isMobile ? mobileGridStyle : desktopGridStyle),
                  transitionDelay: `${Math.min(15, idx) * 30}ms`,
                }}
                onClick={() => setLightboxIndex(idx)}
              >
                <div className="gallery-tile__inner h-full w-full bg-black border-[3px] md:border-[6px] border-black overflow-hidden relative">
                  <GalleryImage
                    seed={item.seed}
                    className="gallery-img h-full w-full object-cover opacity-100 transition-all duration-1000 grayscale-0 group-hover:grayscale group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              </div>
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
                seed={filteredTiles[lightboxIndex].seed}
                className="max-w-full max-h-full object-contain shadow-2xl"
                isLightbox={true}
              />
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(curr => Math.min(filteredTiles.length - 1, curr! + 1)); }}
              className="absolute right-4 md:right-10 z-[110] p-4 text-white/40 hover:text-white transition-all disabled:opacity-0"
              disabled={lightboxIndex === filteredTiles.length - 1}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-black tracking-[0.5em] uppercase">
            {lightboxIndex + 1} / {filteredTiles.length}
          </div>
        </div>
      )}
    </section>
  );
}

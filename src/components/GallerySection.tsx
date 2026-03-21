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
  const dragStartXRef = useRef<number | null>(null);
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
      className={`gallery-section w-full bg-white px-0 py-24 sm:py-32 ${revealClass} overflow-hidden`}
    >
      <div className="mx-auto w-full max-w-none">
        {/* Elegant Category Header */}
        <div className="gallery-stagger flex flex-col items-center gap-12 mb-20 px-6">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black tracking-[0.5em] text-black/30 uppercase">THE COLLECTION</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-none text-black uppercase italic italic">VISUAL JOURNEYS</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-4 sm:pb-0 w-full justify-start sm:justify-center">
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
                        h-12 px-8 whitespace-nowrap text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500
                        ${isActive ? "bg-black text-white shadow-2xl scale-105" : "bg-transparent text-black/30 hover:text-black hover:bg-black/5"}
                        `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dense Professional Grid (Sharp Corners) */}
        <div
          className="gallery-stagger grid w-full gap-1"
          style={{
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, minmax(0, 1fr))",
            gridAutoRows: isMobile ? "220px" : "180px",
          }}
        >
          {filteredTiles.map((item, idx) => {
            const mobileGridStyle = {
              gridColumn: idx % 3 === 0 ? "span 1" : (idx % 3 === 1 ? "span 1" : "span 2"),
              gridRow: idx % 4 === 0 ? "span 2" : "span 1",
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
                <div className="gallery-tile__inner h-full w-full bg-black">
                  <GalleryImage
                    seed={item.seed}
                    className="gallery-img h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 grayscale hover:grayscale-0 contrast-125"
                  />
                  {/* Minimal Hover Info */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">SHARTHAK STUDIO</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Implementation (Premium Blur) */}
      {lightboxIndex !== null && (
        <div className="lightbox fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-10 right-10 z-[110] text-white/40 hover:text-white transition-all">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className="max-w-6xl w-full aspect-video relative" onClick={e => e.stopPropagation()}>
            <GalleryImage
              seed={filteredTiles[lightboxIndex].seed}
              className="w-full h-full object-contain"
              isLightbox={true}
            />
          </div>
          {/* Quick Nav */}
          <div className="absolute bottom-12 flex gap-12">
            <button onClick={() => setLightboxIndex(curr => Math.max(0, curr! - 1))} className="text-white font-black tracking-widest text-xs uppercase opacity-40 hover:opacity-100">PREV</button>
            <button onClick={() => setLightboxIndex(curr => Math.min(filteredTiles.length - 1, curr! + 1))} className="text-white font-black tracking-widest text-xs uppercase opacity-40 hover:opacity-100">NEXT</button>
          </div>
        </div>
      )}
    </section>
  );
}

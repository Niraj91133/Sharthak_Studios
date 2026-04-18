"use client";

import Image from "next/image";
import { type ComponentProps, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useMediaAsset } from "@/hooks/useMediaAsset";
import { motion, AnimatePresence } from "framer-motion";

function clampIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function ExpertiseCard({
  overlaySide,
  dimmed,
  imageUrl,
  fit,
  onClick,
  title,
  index
}: {
  overlaySide: "left" | "right" | null;
  dimmed: boolean;
  imageUrl: string;
  fit?: "cover" | "contain";
  onClick: () => void;
  title: string;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden bg-black text-left outline-none transition-all duration-700 ${dimmed ? 'opacity-30 blur-sm scale-90' : 'opacity-100 blur-0 scale-100 shadow-2x-large'}`}
      style={{
        width: "min(720px, 85vw)",
        height: "480px",
        borderRadius: 0,
        pointerEvents: dimmed ? "none" : "auto",
      }}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="720px"
        className={[
          fit === "contain" ? "object-contain" : "object-cover",
          "object-center grayscale group-hover:grayscale-0 transition-all duration-1000",
          fit === "contain" ? "" : "group-hover:scale-105",
        ].join(" ")}
        priority={!dimmed}
      />

      {/* Cinematic Text Overlay (Only for active card) */}
      {!dimmed && (
        <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-start gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-[9px] font-black tracking-[0.5em] text-white/50 uppercase">0{index + 1} — EXPERIENCE</span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tightest leading-none text-white uppercase italic">{title}</h3>
          <div className="h-0.5 w-12 bg-[#B6FF00] group-hover:w-full transition-all duration-1000" />
        </div>
      )}
    </button>
  );
}

function DynamicExpertiseImage({
  slotId,
  fallback,
  ...props
}: { slotId: string; fallback: string } & Omit<ComponentProps<typeof ExpertiseCard>, "imageUrl">) {
  const { src, isUploaded } = useMediaAsset(slotId, fallback);
  return <ExpertiseCard {...props} imageUrl={src} fit={isUploaded ? "contain" : "cover"} />;
}

import { useMediaContext } from "@/context/MediaContext";

const fallbackSlides = [
  { id: "expertise-01", title: "WEDDING FILMS", fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600" },
  { id: "expertise-02", title: "PRE-WEDDING STORIES", fallback: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1600" },
  { id: "expertise-03", title: "CANDID SESSIONS", fallback: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600" },
  { id: "expertise-04", title: "FASHION EDITORIALS", fallback: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1600" },
];

export default function ExpertiseSection() {
  const { slots } = useMediaContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const dynamicSlides = useMemo(() => {
    const sectionSlots = slots.filter(s => s.section === "04. CHOOSE YOUR EXPERTISE");
    if (sectionSlots.length === 0) return fallbackSlides;

    return sectionSlots.map(s => ({
      id: s.id,
      title: s.categoryLabel || fallbackSlides.find(f => f.id === s.id)?.title || s.frame.toUpperCase(),
      fallback: s.fallbackSrc,
      slot: s
    }));
  }, [slots]);

  useEffect(() => {
    if (!("matchMedia" in window)) return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();

    if (typeof media.addEventListener === "function") media.addEventListener("change", update);
    else if (typeof media.addListener === "function") media.addListener(update);

    return () => {
      if (typeof media.removeEventListener === "function") media.removeEventListener("change", update);
      else if (typeof media.removeListener === "function") media.removeListener(update);
    };
  }, []);

  const handleNext = useCallback(() => setActiveIndex((v) => (v + 1) % dynamicSlides.length), [dynamicSlides.length]);
  const handlePrev = useCallback(() => setActiveIndex((v) => (v - 1 + dynamicSlides.length) % dynamicSlides.length), [dynamicSlides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [handleNext]);

  const activeSlide = dynamicSlides[activeIndex];
  const { src, isUploaded } = useMediaAsset(activeSlide.id, activeSlide.fallback);

  return (
    <section className="relative w-full bg-black text-white px-0 flex flex-col items-center overflow-hidden h-[694px] max-h-[694px] md:h-[900px] md:max-h-[900px]">
      {/* Search for a similar look: Prata or Bodoni Moda */}
      <link href="https://fonts.googleapis.com/css2?family=Prata&display=swap" rel="stylesheet" />

      {/* Header Container */}
      <div className="text-center z-10 mb-8 md:mb-16 px-6 pt-10 md:pt-0">
        <h2 className="text-[26px] md:text-7xl font-normal tracking-wider text-white uppercase mb-2" style={{ fontFamily: "'Prata', serif" }}>
          CHOOSE YOUR EXPERTISE
        </h2>
        <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-white/40 uppercase">
          YOUR DAY WITH OUR EXPERTS
        </p>
      </div>

      {/* Main Carousel Viewport */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-visible">
        <div className="relative w-full max-w-[1400px] h-[340px] sm:h-[420px] md:h-[500px] flex items-center justify-center">

          <AnimatePresence mode="popLayout">
            {/* Navigational Cards Container */}
            <div className="relative w-full h-full flex items-center justify-center">

              {/* Previous Side Image */}
              <motion.div
                key={`prev-${activeIndex}`}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.3, x: isMobile ? -150 : -450, scale: 0.8 }}
                exit={{ opacity: 0 }}
                className="absolute z-0 w-[260px] h-[190px] sm:w-[360px] sm:h-[260px] md:w-[500px] md:h-[350px] overflow-hidden grayscale pointer-events-none"
              >
                <img src={dynamicSlides[(activeIndex - 1 + dynamicSlides.length) % dynamicSlides.length].fallback} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
              </motion.div>

              {/* Main Center Image */}
              <motion.div
                key={`main-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-20 w-[min(850px,94vw)] h-[280px] sm:h-[380px] md:h-[550px] bg-neutral-900 shadow-2xl overflow-hidden border border-white/5 active:scale-95 transition-transform cursor-pointer"
                onClick={handleNext}
              >
                <img
                  src={src}
                  className={`w-full h-full ${isUploaded ? "object-contain bg-black" : "object-cover"}`}
                  alt={activeSlide.title}
                />

                {/* Subtle Title Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg sm:text-2xl md:text-4xl font-normal tracking-widest text-white uppercase italic" style={{ fontFamily: "'Prata', serif" }}>
                    {activeSlide.title}
                  </h3>
                </div>
              </motion.div>

              {/* Next Side Image */}
              <motion.div
                key={`next-${activeIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 0.3, x: isMobile ? 150 : 450, scale: 0.8 }}
                exit={{ opacity: 0 }}
                className="absolute z-0 w-[260px] h-[190px] sm:w-[360px] sm:h-[260px] md:w-[500px] md:h-[350px] overflow-hidden grayscale pointer-events-none"
              >
                <img src={dynamicSlides[(activeIndex + 1) % dynamicSlides.length].fallback} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent" />
              </motion.div>

            </div>
          </AnimatePresence>

          {/* Hidden Navigation Overlays */}
          <button onClick={handlePrev} className="absolute left-0 top-0 bottom-0 w-24 z-30 cursor-pointer outline-none" aria-label="Previous" />
          <button onClick={handleNext} className="absolute right-0 top-0 bottom-0 w-24 z-30 cursor-pointer outline-none" aria-label="Next" />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="z-20 pb-12 mt-4">
        <a
          href="https://wa.me/917091876067"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-9 py-3 md:px-12 md:py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
        >
          <span className="text-[11px] font-black tracking-[0.3em] uppercase">BOOK US NOW ON WHATSAPP</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";
import { motion, AnimatePresence } from "framer-motion";

function clampIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function ExpertiseCard({
  overlaySide,
  dimmed,
  imageUrl,
  onClick,
  title,
  index
}: {
  overlaySide: "left" | "right" | null;
  dimmed: boolean;
  imageUrl: string;
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
        className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
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

function DynamicExpertiseImage({ slotId, fallback, ...props }: any) {
  const src = useMedia(slotId, fallback);
  return <ExpertiseCard {...props} imageUrl={src} />;
}

export default function ExpertiseSection() {
  const slideConfigs = useMemo(
    () => [
      { id: "expertise-01", title: "WEDDING CINEMA", fallback: "https://picsum.photos/seed/expertise-01/1600/1000" },
      { id: "expertise-02", title: "PRE-WEDDING STORIES", fallback: "https://picsum.photos/seed/expertise-02/1600/1000" },
      { id: "expertise-03", title: "CANDID MOMENTS", fallback: "https://picsum.photos/seed/expertise-03/1600/1000" },
      { id: "expertise-04", title: "MODEL PORTFOLIO", fallback: "https://picsum.photos/seed/expertise-04/1600/1000" },
      { id: "expertise-05", title: "MATERNITY SHOOTS", fallback: "https://picsum.photos/seed/expertise-05/1600/1000" },
      { id: "expertise-06", title: "BABY JOURNEYS", fallback: "https://picsum.photos/seed/expertise-06/1600/1000" },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shiftProgress, setShiftProgress] = useState<0 | 1>(0);
  const [stepPx, setStepPx] = useState(380);

  useEffect(() => {
    const t = window.setInterval(() => {
      if (isAnimating) return;
      setIsAnimating(true);
      setShiftProgress(1);
      window.setTimeout(() => {
        setActiveIndex((v) => (v + 1) % slideConfigs.length);
        setShiftProgress(0);
        setIsAnimating(false);
      }, 700);
    }, 5500);
    return () => window.clearInterval(t);
  }, [isAnimating, slideConfigs.length]);

  useEffect(() => {
    const update = () => setStepPx(Math.max(280, Math.min(480, Math.round(window.innerWidth * 0.4))));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const prevIndex = clampIndex(activeIndex - 1, slideConfigs.length);
  const nextIndex = clampIndex(activeIndex + 1, slideConfigs.length);

  return (
    <section className="w-full bg-[#050505] py-32 md:py-48 px-0 text-white overflow-hidden border-y border-white/[0.02]">
      <div className="mx-auto w-full max-w-none space-y-24">
        {/* Cinematic Header */}
        <div className="text-center space-y-6 px-6">
          <span className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase block mb-2 transition-all">CHOOSE YOUR EXPERTISE</span>
          <div className="flex flex-col items-center">
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest leading-none text-white uppercase italic lg:-translate-x-12">THE CRAFT</h2>
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest leading-none text-white uppercase italic lg:translate-x-12 opacity-40">DEFINED</h2>
          </div>
          <p className="max-w-xl mx-auto text-xs md:text-sm font-medium tracking-wide text-white/30 leading-relaxed uppercase pt-8">
            From cinematic wedding films to artistic model portfolios, we craft every frame with editorial precision and emotional depth.
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: 620 }}>
          {[
            { slot: -1, idx: prevIndex },
            { slot: 0, idx: activeIndex },
            { slot: 1, idx: nextIndex },
          ].map(({ slot, idx }) => {
            const visualSlot = slot - shiftProgress;
            const x = visualSlot * stepPx;
            const isCenter = Math.abs(visualSlot) < 0.3;
            const dimmed = !isCenter;

            return (
              <div
                key={`${slot}-${idx}`}
                className="absolute left-1/2 top-0 will-change-transform"
                style={{
                  zIndex: isCenter ? 30 : 10,
                  transition: isAnimating ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms" : "none",
                  transform: `translateX(calc(-50% + ${x}px)) scale(${isCenter ? 1.1 : 0.8})`,
                }}
              >
                <DynamicExpertiseImage
                  slotId={slideConfigs[idx].id}
                  fallback={slideConfigs[idx].fallback}
                  title={slideConfigs[idx].title}
                  index={idx}
                  overlaySide={visualSlot < -0.3 ? "left" : "right"}
                  dimmed={dimmed}
                  onClick={() => { }}
                />
              </div>
            );
          })}
        </div>

        {/* Global CTA */}
        <div className="flex justify-center px-6">
          <button
            onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-12 py-5 bg-white text-black text-[11px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full bg-black/10 transition-transform duration-500 group-hover:translate-x-0" />
            <span className="relative z-10">BOOK AN APPOINTMENT →</span>
          </button>
        </div>
      </div>
    </section>
  );
}

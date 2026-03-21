"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";

type SlideConfig = {
  id: string;
  fallback: string;
  title?: string;
  subtitle?: string;
};

function DynamicLatestSlide({ config, isActive }: { config: SlideConfig; isActive: boolean }) {
  const src = useMedia(config.id, config.fallback);
  return (
    <div className="latest-work__slide group">
      <div className={`relative h-full w-full transition-all duration-700 overflow-hidden ${isActive ? 'scale-100 opacity-100 shadow-2x-large' : 'scale-90 opacity-40 grayscale blur-[2px]'}`}>
        <Image
          src={src}
          alt=""
          fill
          sizes="440px"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          priority={isActive}
        />

        {isActive && config.title && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-[8px] font-black tracking-[0.4em] text-white/50 uppercase block mb-2">PROJECT ARCHIVE</span>
            <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
              {config.title}
            </h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
              {config.subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LatestWorkSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slides: SlideConfig[] = useMemo(
    () => [
      { id: "latest-work-01", title: "THE ETERNAL VOW", subtitle: "S&N WEDDING FILM", fallback: "https://picsum.photos/seed/latest-work-01/1600/1200" },
      { id: "latest-work-02", title: "DUSK & DAWN", subtitle: "EDITORIAL SERIES", fallback: "https://picsum.photos/seed/latest-work-02/1600/1200" },
      { id: "latest-work-03", title: "CINEMATIC LOVE", subtitle: "PRE-WEDDING SHORT", fallback: "https://picsum.photos/seed/latest-work-03/1600/1200" },
      { id: "latest-work-04", title: "URBAN RHYTHM", subtitle: "MUSIC PORTFOLIO", fallback: "https://picsum.photos/seed/latest-work-04/1600/1200" },
      { id: "latest-work-05", title: "THE CEREMONY", subtitle: "TRADITIONAL LUXE", fallback: "https://picsum.photos/seed/latest-work-05/1600/1200" },
      { id: "latest-work-06", title: "ROYAL HERITAGE", subtitle: "BRIDAL CINEMA", fallback: "https://picsum.photos/seed/latest-work-06/1600/1200" },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const canPrev = index > 0;
  const canNext = index < slides.length - 1;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let locked = false;
    let unlockTimer: number | null = null;

    const onWheel = (event: WheelEvent) => {
      if (!el.contains(event.target as Node)) return;
      if (Math.abs(event.deltaY) < 10) return;
      event.preventDefault();
      if (locked) return;
      locked = true;
      const direction = Math.sign(event.deltaY);
      setIndex((current) => Math.min(slides.length - 1, Math.max(0, current + direction)));
      unlockTimer = window.setTimeout(() => { locked = false; }, 400);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (unlockTimer) window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel);
    };
  }, [slides.length]);

  return (
    <section className="latest-work w-full bg-[#f2f2f2] px-0 py-32 md:py-48 text-[#111111] overflow-hidden border-y border-black/[0.03]">
      <div className="mx-auto w-full max-w-none space-y-24">
        {/* Cinematic Split Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 max-w-6xl mx-auto items-end">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.5em] text-black/20 uppercase block mb-2">CURATED BEST WORK</span>
            <h2 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tightest uppercase italic">
              FEED ON OUR<br />LATEST WORK
            </h2>
            <div className="h-0.5 w-24 bg-black" />
          </div>

          <div className="space-y-8 md:pl-20">
            <p className="text-xs md:text-sm font-semibold tracking-widest text-black/40 uppercase leading-relaxed">
              Experience the stopping power of our cinematic visuals. We curate only the finest stories from our recent archive.
            </p>
            <button
              type="button"
              onClick={() => window.open("/blog", "_blank")}
              className="px-12 py-4 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              EXPLORE COLLECTION →
            </button>
          </div>
        </div>

        {/* Film Strip Stage */}
        <div className="pt-20">
          <div className="latest-work__film w-screen max-w-none bg-black py-4">
            <div className="latest-work__perfs opacity-30 h-10" aria-hidden="true" />

            <div
              className="latest-work__window h-[420px] md:h-[580px] bg-[#050505] cursor-pointer"
              ref={stageRef}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (x > rect.width * 0.55) setIndex(v => Math.min(slides.length - 1, v + 1));
                else if (x < rect.width * 0.45) setIndex(v => Math.max(0, v - 1));
              }}
            >
              <div
                className="latest-work__track h-full"
                style={{
                  transform: `translate3d(calc(50% - 220px - ${index * 460}px), 0, 0)`,
                  transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  padding: 0,
                  gap: 20
                }}
              >
                {slides.map((config, i) => (
                  <DynamicLatestSlide
                    key={config.id}
                    config={config}
                    isActive={i === index}
                  />
                ))}
              </div>
            </div>

            <div className="latest-work__perfs opacity-30 h-10" aria-hidden="true" />
          </div>
        </div>

        {/* Cinematic Counters */}
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center opacity-40">
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-black/20 tracking-widest uppercase">SECTION</span>
              <span className="text-lg font-black font-mono">04 / 12</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-black/20 tracking-widest uppercase">LATEST PROJECT</span>
              <span className="text-lg font-black font-mono">0{index + 1}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setIndex(v => Math.max(0, v - 1))} className="w-12 h-12 border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">←</button>
            <button onClick={() => setIndex(v => Math.min(slides.length - 1, v + 1))} className="w-12 h-12 border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

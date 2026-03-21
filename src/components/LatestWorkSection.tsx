"use client";

import { useEffect, useState, useCallback } from "react";
import { useMedia } from "@/hooks/useMedia";

const works = [
  { id: "latest-01", title: "Retreat & Rally", client: "for Padel United", fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
  { id: "latest-02", title: "Urban Escape", client: "for H&M", fallback: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800" },
  { id: "latest-03", title: "Desert Moods", client: "for Zara", fallback: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { id: "latest-04", title: "Midnight Sun", client: "for Volvo", fallback: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800" },
];

function LatestWorkSlide({ work, isActive }: any) {
  const src = useMedia(work.id, work.fallback);
  return (
    <div className={`relative flex-shrink-0 w-[min(380px,75vw)] aspect-[9/16] transition-all duration-1000 ease-[0.22, 1, 0.36, 1] ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 grayscale blur-[1px]'}`}>
      <div className="w-full h-full bg-neutral-900 overflow-hidden relative border border-white/5">
        <img src={src} className="w-full h-full object-cover" alt={work.title} />

        {/* View Badge - Only for active */}
        {isActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-20">
            <span className="text-[10px] font-black tracking-widest text-black uppercase leading-none">VIEW</span>
          </div>
        )}

        {/* Info Overlay (Bottom Left) */}
        <div className="absolute bottom-8 left-8 text-white z-10 drop-shadow-lg text-left">
          <h4 className="text-xl md:text-2xl font-black tracking-tight mb-1 uppercase italic leading-none">{work.title}</h4>
          <p className="text-[9px] md:text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">{work.client}</p>
        </div>
      </div>
    </div>
  );
}

export default function LatestWorkSection() {
  const [index, setIndex] = useState(0);
  const [winWidth, setWinWidth] = useState(0);

  useEffect(() => {
    setWinWidth(window.innerWidth);
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => setIndex(prev => (prev + 1) % works.length), []);
  const handlePrev = useCallback(() => setIndex(prev => (prev - 1 + works.length) % works.length), []);

  useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  // Center calculation logic
  const sliceWidth = winWidth ? Math.min(380, winWidth * 0.75) : 380;
  const gap = winWidth < 768 ? 20 : 40;
  const translateX = winWidth ? (winWidth / 2) - (sliceWidth / 2) - (index * (sliceWidth + gap)) : 0;

  return (
    <section className="relative w-full bg-white text-black pt-0 pb-20 flex flex-col items-center overflow-hidden" style={{ minHeight: "950px", maxHeight: "1150px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Prata&display=swap" rel="stylesheet" />

      {/* Header Area */}
      <div className="w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-start md:items-center mb-16 mt-20 gap-8">
        <div className="space-y-4 text-left">
          <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.85] uppercase">
            FEED ON OUR<br />LATEST WORK
          </h2>
          <p className="text-[10px] md:text-xs font-black opacity-30 tracking-[0.4em] uppercase">(see how we stop the scroll)</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 md:pl-20">
          <div className="h-24 w-px bg-black hidden md:block opacity-10" />
          <p className="text-[10px] md:text-xs font-normal tracking-[0.3em] uppercase max-w-xs opacity-60 text-left" style={{ fontFamily: "'Prata', serif" }}>
            CURATE THE BEST WORK AND SERVICES
          </p>
          <button className="px-10 py-4 rounded-full border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl active:scale-95 leading-none">
            Our work
          </button>
        </div>
      </div>

      {/* Cinematic Carousel Container */}
      <div className="w-full bg-black py-20 flex-1 flex flex-col justify-center overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none opacity-50" />

        <div
          className="flex items-center will-change-transform"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${translateX}px)`,
            transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)"
          }}
        >
          {works.map((work, i) => (
            <LatestWorkSlide key={work.id} work={work} isActive={i === index} />
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="w-full max-w-7xl px-8 mt-12 flex justify-start">
        <div className="flex bg-black shadow-2xl">
          <button
            onClick={handlePrev}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-white/40 hover:text-white transition-colors border-r border-white/5 active:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={handleNext}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-white/40 hover:text-white transition-colors active:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

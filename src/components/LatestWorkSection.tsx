"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMedia } from "@/hooks/useMedia";
import { motion, AnimatePresence } from "framer-motion";

const works = [
  { id: "latest-01", title: "Retreat & Rally", client: "for Padel United", fallback: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200" },
  { id: "latest-02", title: "Urban Escape", client: "for H&M", fallback: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200" },
  { id: "latest-03", title: "Desert Moods", client: "for Zara", fallback: "https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=1200" },
  { id: "latest-04", title: "Midnight Sun", client: "for Volvo", fallback: "https://images.unsplash.com/photo-1503376780353-7e66a876a11a?auto=format&fit=crop&q=80&w=1200" },
];

function LatestWorkSlide({ work, isActive, index }: any) {
  const src = useMedia(work.id, work.fallback);
  return (
    <div className={`relative flex-shrink-0 w-[min(600px,85vw)] aspect-[16/10] sm:aspect-[16/9] transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-40 grayscale blur-[1px]'}`}>
      <img src={src} className="w-full h-full object-cover" alt={work.title} />

      {/* View Badge - Only for active */}
      {isActive && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
          <span className="text-[10px] font-black tracking-widest text-black/80 uppercase">VIEW</span>
        </div>
      )}

      {/* Info Overlay */}
      <div className="absolute bottom-10 left-10 text-white z-10">
        <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-1">{work.title}</h4>
        <p className="text-[9px] md:text-[11px] font-bold text-white/50 uppercase tracking-widest">{work.client}</p>
      </div>
    </div>
  );
}

export default function LatestWorkSection() {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => setIndex(prev => (prev + 1) % works.length), []);
  const handlePrev = useCallback(() => setIndex(prev => (prev - 1 + works.length) % works.length), []);

  useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="relative w-full bg-white text-black pt-0 pb-24 flex flex-col items-center overflow-hidden" style={{ minHeight: "900px", maxHeight: "1000px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda&display=swap" rel="stylesheet" />

      {/* Header Area */}
      <div className="w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="space-y-1">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Feed on our latest work</h2>
          <p className="text-xs md:text-sm font-bold opacity-40 tracking-wide">(see how we stop the scroll)</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
          <div className="h-24 w-px bg-black hidden md:block opacity-10" />
          <p className="text-[10px] md:text-xs font-normal tracking-[0.3em] uppercase max-w-xs opacity-60" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            CURATE THE BEST WORK AND SERVICES
          </p>
          <button className="px-8 py-3 rounded-full border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Our work
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="w-full bg-neutral-900 py-20 flex-1 flex flex-col justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-neutral-900 z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex items-center gap-8 md:gap-16 px-10 transition-transform duration-1000 ease-[0.22, 1, 0.36, 1]"
          style={{ transform: `translateX(calc(50% - (min(600px,85vw)/2) - ${index * (Math.min(600, window?.innerWidth * 0.85 || 600) + (window?.innerWidth < 768 ? 32 : 64))}px))` }}
        >
          {works.map((work, i) => (
            <LatestWorkSlide key={work.id} work={work} isActive={i === index} index={i} />
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="w-full max-w-7xl px-8 mt-12 flex justify-start">
        <div className="flex bg-black">
          <button
            onClick={handlePrev}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white/40 hover:text-white transition-colors border-r border-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

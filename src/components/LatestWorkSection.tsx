"use client";

import { useEffect, useState, useCallback } from "react";
import { useMedia } from "@/hooks/useMedia";

const reels = [
  { id: "reel-01", title: "Eternal Vows", category: "Wedding", time: "0:45", fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
  { id: "reel-02", title: "Urban Beats", category: "Editorial", time: "0:30", fallback: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800" },
  { id: "reel-03", title: "Golden Hour", category: "Candid", time: "0:55", fallback: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
  { id: "reel-04", title: "Midnight Sun", category: "Cinema", time: "0:15", fallback: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800" },
];

function ReelCard({ reel, isActive }: any) {
  const src = useMedia(reel.id, reel.fallback);
  return (
    <div className={`relative flex-shrink-0 w-[300px] md:w-[350px] aspect-[10/16] transition-all duration-1000 ease-[0.22, 1, 0.36, 1] ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 grayscale'}`}>
      <div className="w-full h-full bg-[#1A1A1A] rounded-[32px] overflow-hidden relative shadow-2xl border border-white/5 flex flex-col">

        {/* Top: Video Thumbnail Area */}
        <div className="relative flex-1 bg-black overflow-hidden group/thumb">
          <img src={src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={reel.title} />

          {/* Time Badge */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-black text-white">{reel.time}</span>
          </div>

          {/* Player controls (Center Overlay) */}
          <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18V6l11 6-11 6z" /></svg>
            </button>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl hover:scale-110 active:scale-95 transition-all">
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18v-12h2v12h-2zm10-12v12h2v-12h-2z" /></svg>
            </button>
          </div>
        </div>

        {/* Bottom: Info Bar */}
        <div className="h-44 bg-[#1A1A1A] p-6 flex flex-col justify-between">
          {/* Progress line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-[#A855F7] w-1/3 rounded-full shadow-[0_0_10px_#A855F7]" />
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-[#A855F7]" />
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-left">
                <div className="w-2 h-2 rounded-full bg-[#A855F7]" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{reel.category}</span>
              </div>
              <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none text-left">{reel.title}</h4>
              <div className="flex gap-4 pt-2 opacity-40">
                <span className="text-[10px] font-black">❤ 12</span>
                <span className="text-[10px] font-black">💬 3</span>
              </div>
            </div>

            <button className="px-6 py-2.5 bg-[#A855F7] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_10px_20px_-5px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all leading-none">
              WATCH
            </button>
          </div>
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

  const handleNext = useCallback(() => setIndex(prev => (prev + 1) % reels.length), []);
  const handlePrev = useCallback(() => setIndex(prev => (prev - 1 + reels.length) % reels.length), []);

  useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  // Center calculation logic
  const cardWidth = 350;
  const gap = winWidth < 768 ? 20 : 40;
  const translateX = winWidth ? (winWidth / 2) - (cardWidth / 2) - (index * (cardWidth + gap)) : 0;

  return (
    <section className="relative w-full bg-black text-white pt-24 pb-32 flex flex-col items-center overflow-hidden border-t border-white/5" style={{ minHeight: "900px", maxHeight: "900px" }}>

      {/* Feed Header */}
      <div className="w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center mb-16 gap-8 z-10 text-center md:text-left">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-black tracking-tightest uppercase italic leading-none">
            INSTAGRAM FEED
          </h2>
          <p className="text-[10px] md:text-xs font-black opacity-30 tracking-[0.4em] uppercase">(CONNECTING TO SHARTHAK_STUDIO)</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800" />)}
          </div>
          <button className="px-8 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl leading-none">
            FOLLOW US
          </button>
        </div>
      </div>

      {/* Social Carousel Container */}
      <div className="w-full flex-1 flex flex-col justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none opacity-80" />

        <div
          className="flex items-center will-change-transform"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${translateX}px)`,
            transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)"
          }}
        >
          {reels.map((reel, i) => (
            <ReelCard key={reel.id} reel={reel} isActive={i === index} />
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="w-full max-w-7xl px-8 mt-16 flex justify-center">
        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="text-white/20 hover:text-white transition-colors text-xl font-black">← PREV</button>
          <div className="flex gap-2">
            {reels.map((_, i) => (
              <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-[#A855F7]' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
          <button onClick={handleNext} className="text-white/20 hover:text-white transition-colors text-xl font-black">NEXT →</button>
        </div>
      </div>
    </section>
  );
}

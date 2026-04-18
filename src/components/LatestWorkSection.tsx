"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { useMediaAsset } from "@/hooks/useMediaAsset";
import { useMediaContext } from "@/context/MediaContext";

type Reel = {
  id: string;
  title: string;
  time: string;
  likes: string;
  views: string;
  fallback: string;
  type?: string;
};

const fallbackReels: Reel[] = [
  {
    id: "reel-01",
    title: "Eternal Vows",
    time: "0:45",
    likes: "12.4K",
    views: "210K",
    fallback:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "reel-02",
    title: "City Lights",
    time: "0:30",
    likes: "8.1K",
    views: "142K",
    fallback:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "reel-03",
    title: "Golden Hour",
    time: "0:55",
    likes: "18.9K",
    views: "310K",
    fallback:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "reel-04",
    title: "Midnight Sun",
    time: "0:15",
    likes: "6.7K",
    views: "98K",
    fallback:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200",
  },
];

function ReelMedia({ reel, className }: { reel: Reel; className?: string }) {
  const { src, isUploaded } = useMediaAsset(reel.id, reel.fallback);
  const safeClass =
    className?.replace(/\bobject-cover\b/g, "").replace(/\bobject-contain\b/g, "") || "";

  if (!src) return <div className={[safeClass, "bg-white/5"].join(" ")} />;

  // Robust check for video content
  const srcLower = src.toLowerCase();
  const isVideo = srcLower.match(/\.(mp4|mov|webm|ogg|m4v)$/) || srcLower.includes("video/upload");

  if (isVideo) {
    return (
      <video
        key={src}
        src={src}
        className={[safeClass, "object-contain bg-black"].join(" ")}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={[safeClass, "object-contain bg-black"].join(" ")}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

function ReelStats({ reel }: { reel: Reel }) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="text-[11px] font-black tracking-[0.3em] text-white/70 uppercase">
            {reel.title}
          </div>
          <div className="flex items-center gap-4 text-[12px] font-black text-white/85">
            <span className="inline-flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {reel.likes}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {reel.views}
            </span>
          </div>
        </div>

        <div className="shrink-0 rounded-full bg-black/40 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-white/80 backdrop-blur">
          {reel.time}
        </div>
      </div>
    </div>
  );
}

function PhoneMockup({ reel }: { reel: Reel }) {
  return (
    <div className="relative w-[min(210px,58vw)] sm:w-[min(320px,74vw)] md:w-[390px]">
      {/* iPhone 17-style mockup (thin bezel + dynamic island) */}
      <div className="relative aspect-[9/18] w-full rounded-[50px] bg-[#0a0a0a] shadow-[0_50px_140px_-50px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
        {/* Metallic edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[50px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_38%,rgba(255,255,255,0.06)_70%,rgba(255,255,255,0)_100%)]" />

        {/* Side buttons */}
        <div className="pointer-events-none absolute -left-[2px] top-[20%] h-10 w-[4px] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-[2px] top-[29%] h-14 w-[4px] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-[2px] top-[26%] h-20 w-[4px] rounded-full bg-white/10" />

        {/* Screen */}
        <div className="absolute inset-[9px] overflow-hidden rounded-[42px] bg-black">
          {/* Reel viewport: exact Instagram Reel ratio (9:16) inside phone */}
          <div className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2 aspect-[9/16] bg-black">
            <ReelMedia reel={reel} className="absolute inset-0 h-full w-full object-contain" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            <ReelStats reel={reel} />
          </div>

          {/* Subtle screen vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_55%)] opacity-60" />
        </div>

        {/* Dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-[16px] -translate-x-1/2 h-[26px] w-[118px] rounded-full bg-black/90 ring-1 ring-white/10" />
        <div className="pointer-events-none absolute left-1/2 top-[24px] -translate-x-1/2 h-[4px] w-[44px] rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function SideReel({ reel, side }: { reel: Reel; side: "left" | "right" }) {
  return (
    <div
      className={[
        "pointer-events-none hidden sm:block",
        "relative w-[240px] md:w-[280px] aspect-[9/16]",
        "opacity-25 grayscale blur-[1px]",
        side === "left" ? "-mr-16 md:-mr-24" : "-ml-16 md:-ml-24",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-white/5 ring-1 ring-white/10">
        <ReelMedia reel={reel} className="absolute inset-0 h-full w-full object-contain" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between text-[10px] font-black tracking-[0.25em] text-white/70 uppercase">
            <span>{reel.likes}</span>
            <span>{reel.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LatestWorkSection() {
  const { slots } = useMediaContext();
  const [index, setIndex] = useState(0);

  const reels = useMemo(() => {
    const sectionSlots = slots.filter(s => s.section === "05. INSTAGRAM FEED (LATEST WORK)");
    if (sectionSlots.length === 0) return fallbackReels;

    return sectionSlots.map(s => ({
      id: s.id,
      title: s.categoryLabel || s.frame.toUpperCase(),
      time: "0:30",
      likes: "10K",
      views: "100K",
      fallback: s.fallbackSrc,
      type: s.type,
    }));
  }, [slots]);

  const handleNext = useCallback(() => setIndex((v) => (v + 1) % reels.length), [reels.length]);
  const handlePrev = useCallback(() => setIndex((v) => (v - 1 + reels.length) % reels.length), [reels.length]);

  const active = reels[index] || fallbackReels[0];
  const prev = useMemo(() => reels[(index - 1 + reels.length) % reels.length], [index, reels]);
  const next = useMemo(() => reels[(index + 1) % reels.length], [index, reels]);

  return (
    <section className="relative w-full bg-black text-white flex flex-col items-center overflow-hidden border-t border-white/5 h-[654px] max-h-[654px] sm:h-[900px] sm:max-h-[900px] pt-8 pb-8 sm:pt-16 sm:pb-16">
      <div className="w-full max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center mb-5 sm:mb-10 gap-6 sm:gap-8 z-10 text-center md:text-left flex-shrink-0">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tightest uppercase italic leading-none">
            INSTAGRAM FEED
          </h2>
        </div>

        <a
          href="https://instagram.com/sharthak_studio"
          target="_blank"
          rel="noopener noreferrer"
          className="px-7 py-3 sm:px-8 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl leading-none flex items-center justify-center h-10"
        >
          FOLLOW US
        </a>
      </div>

      <div className="w-full flex-1 min-h-0 flex flex-col justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none opacity-80" />

        <div className="relative z-0 flex w-full items-center justify-center">
          <SideReel reel={prev} side="left" />

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20"
            >
              <PhoneMockup reel={active} />
            </motion.div>
          </AnimatePresence>

          <SideReel reel={next} side="right" />
        </div>
      </div>

      <div className="w-full max-w-7xl px-6 sm:px-8 mt-6 sm:mt-10 flex justify-center flex-shrink-0">
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={handlePrev}
            className="text-white/20 hover:text-white transition-colors text-base sm:text-xl font-black"
          >
            ← PREV
          </button>

          <div className="flex gap-2">
            {reels.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? "w-8 bg-[#A855F7]" : "w-2 bg-white/20"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="text-white/20 hover:text-white transition-colors text-base sm:text-xl font-black"
          >
            NEXT →
          </button>
        </div>
      </div>
    </section>
  );
}

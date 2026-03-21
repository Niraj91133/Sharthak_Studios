"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function CoupleShootGame() {
  const [shots, setShots] = useState<number>(0);
  const [isShooting, setIsShooting] = useState(false);
  const [lastShotTime, setLastShotTime] = useState(0);
  const shutterRef = useRef<HTMLAudioElement | null>(null);

  const images = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600"
  ];

  const handleShoot = () => {
    setIsShooting(true);
    setShots(s => s + 1);
    setLastShotTime(Date.now());
    setTimeout(() => setIsShooting(false), 120);
  };

  return (
    <section className="bg-white py-32 md:py-48 px-6 text-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.6em] text-black/30 uppercase block">INTERACTIVE VISUALS</span>
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest leading-none text-black uppercase italic italic">SHOOT THE</h2>
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest leading-none text-black uppercase italic opacity-20 -translate-y-4 md:-translate-y-8">COUPLE</h2>
          </div>

          <div className="max-w-xs space-y-8">
            <p className="text-xs font-black tracking-widest text-black/40 leading-relaxed uppercase">
              Experience the shutter of our 8K cinema camera. Every click captures a memory that lasts a lifetime.
            </p>
            <div className="h-px w-20 bg-black/10" />
          </div>
        </div>

        {/* Pro Camera Viewfinder Simulation */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.img
              key={shots % images.length}
              src={images[shots % images.length]}
              alt="Cinema Scene"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full h-full object-cover opacity-80"
            />
          </AnimatePresence>

          {/* Viewfinder UI */}
          <div className="absolute inset-0 pointer-events-none p-4 md:p-12 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-6 border-b border-r border-[#B6FF00] opacity-60" />
                <span className="text-[10px] font-black text-[#B6FF00] drop-shadow-md font-mono tracking-widest">● REC  00:04:22:12</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-white/40 tracking-widest">ISO</span>
                  <span className="text-xs font-black text-white px-2 py-0.5 bg-white/10">800</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-white/40 tracking-widest">FPS</span>
                  <span className="text-xs font-black text-white px-2 py-0.5 bg-white/10">24p</span>
                </div>
              </div>
            </div>

            {/* Focus Box */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 border border-white/20 flex items-center justify-center">
              <div className="w-4 h-4 border-t border-l border-white/60 absolute top-0 left-0" />
              <div className="w-4 h-4 border-t border-r border-white/60 absolute top-0 right-0" />
              <div className="w-4 h-4 border-b border-l border-white/60 absolute bottom-0 left-0" />
              <div className="w-4 h-4 border-b border-r border-white/60 absolute bottom-0 right-0" />
              <div className="w-2 h-2 rounded-full bg-[#B6FF00] opacity-40 animate-pulse" />
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">BATTERY</span>
                <div className="w-12 h-4 border border-white/20 p-0.5">
                  <div className="h-full w-3/4 bg-[#B6FF00]/60" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">SHUTTER COUNT</span>
                <span className="text-4xl font-black text-[#B6FF00] font-mono tracking-tighter drop-shadow-lg">{shots.toString().padStart(4, "0")}</span>
              </div>
            </div>
          </div>

          {/* Shutter Animation Overlay */}
          <AnimatePresence>
            {isShooting && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 bg-white z-[60]"
              />
            )}
          </AnimatePresence>

          {/* Shoot Controls */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
            <button
              onClick={handleShoot}
              className="w-24 h-24 md:w-40 md:h-40 rounded-full border-2 border-white/40 flex items-center justify-center group/btn active:scale-95 transition-all"
            >
              <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-white flex flex-col items-center justify-center gap-2 transform group-hover/btn:scale-105 transition-all">
                <span className="text-[10px] font-black tracking-widest uppercase">SHUTTER</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-center flex-col items-center gap-6">
          <span className="text-[9px] font-black tracking-[0.4em] text-black/10 uppercase">SIMULATING 8K RED CINEMA RAW</span>
          <div className="h-0.5 w-12 bg-black/5" />
        </div>
      </div>
    </section>
  );
}

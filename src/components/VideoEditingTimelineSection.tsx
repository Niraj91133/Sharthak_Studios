"use client";

import { motion } from "framer-motion";

export default function VideoEditingTimelineSection() {
  const tracks = [
    { label: "V1", color: "bg-blue-500/40", width: "w-3/4", offset: "ml-0", text: "8K RAW MASTER" },
    { label: "V2", color: "bg-purple-500/40", width: "w-1/2", offset: "ml-20", text: "PREMIUM COLOR GRADE" },
    { label: "V3", color: "bg-[#B6FF00]/40", width: "w-1/4", offset: "ml-48", text: "VFX & OVERLAYS" },
    { label: "A1", color: "bg-cyan-500/40", width: "w-full", offset: "ml-0", text: "CINEMATIC SCORES" },
    { label: "A2", color: "bg-pink-500/40", width: "w-2/3", offset: "ml-12", text: "AMBIENT SOUND DESIGN" },
  ];

  return (
    <section className="bg-black py-40 md:py-56 px-6 overflow-hidden relative">
      {/* Cinematic Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-900/10 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.6em] text-white/20 uppercase block">POST-PRODUCTION WORKFLOW</span>
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest leading-none text-white uppercase italic">TIMELINE</h2>
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest leading-none text-[#B6FF00] uppercase italic opacity-20 -translate-y-6 md:-translate-y-12">PRECISION</h2>
          </div>

          <div className="max-w-md space-y-8">
            <p className="text-xs md:text-sm font-medium tracking-wide text-white/40 leading-relaxed uppercase">
              Every frame is sculpted in our premium post-production suite. We craft the rhythm, the grade, and the soundscape to bring your story to life.
            </p>
            <div className="flex gap-4">
              <div className="h-0.5 w-12 bg-[#B6FF00]" />
              <span className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">8K RAW WORKFLOW</span>
            </div>
          </div>
        </div>

        {/* Editing UI Mockup */}
        <div className="w-full bg-[#0a0a0a] border border-white/5 shadow-2x-large rounded-0 p-8 space-y-8 relative overflow-hidden backdrop-blur-xl">
          {/* Header Dots */}
          <div className="flex gap-2 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>

          <div className="space-y-4">
            {tracks.map((track, i) => (
              <div key={i} className="flex gap-6 items-center">
                <span className="text-[10px] font-black text-white/20 w-8">{track.label}</span>
                <div className="flex-1 h-14 bg-white/[0.02] relative group">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute inset-y-0 h-full ${track.color} border-l-2 border-white/20 flex items-center px-6 overflow-hidden ${track.width} ${track.offset}`}
                  >
                    <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase whitespace-nowrap">{track.text}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Playhead */}
          <motion.div
            animate={{ left: ["10%", "90%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-px bg-white/40 z-20"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/60 rotate-45 -translate-y-2" />
          </motion.div>

          {/* Counter */}
          <div className="absolute top-8 right-12 flex flex-col items-end">
            <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">MASTER TIMECODE</span>
            <span className="text-3xl font-black font-mono text-white/60 tracking-tighter transition-all hover:text-white">00:04:22:12</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
          {[
            { label: "RESOLUTION", value: "8K RAW" },
            { label: "COLOR SPACE", value: "LOG-C" },
            { label: "FPS", value: "24 / 60 / 120" },
            { label: "BIT DEPTH", value: "16-BIT" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-[9px] font-black text-white/20 tracking-[0.4em] uppercase">{stat.label}</p>
              <p className="text-sm font-black text-white italic">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

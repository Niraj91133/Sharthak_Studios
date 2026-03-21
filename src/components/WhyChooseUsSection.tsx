"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { useMediaContext } from "@/context/MediaContext";
import { MediaSlot } from "@/lib/mediaSlots";

function Digit({ digit }: { digit: string }) {
  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden">
      <motion.div
        key={digit}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 text-center"
      >
        {digit}
      </motion.div>
    </div>
  );
}

function FlipNumber({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      // Small delay for cinematic effect
      const timer = setTimeout(() => setDisplayValue(value), 200);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue("0"); // Reset when out of view to re-animate next time
    }
  }, [isInView, value]);

  const digits = displayValue.split("");

  return (
    <div ref={ref} className="flex items-baseline font-black tracking-tighter">
      {digits.map((char, i) => (
        <AnimatePresence mode="popLayout" key={i}>
          {/[0-9]/.test(char) ? (
            <Digit digit={char} />
          ) : (
            <span className="ml-1 opacity-50">{char}</span>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

export default function WhyChooseUsSection() {
  const { slots } = useMediaContext();
  const metricsFromSlots = (slots as MediaSlot[]).filter(
    (s) => s.section === "08. STUDIO METRICS" || s.section === "10. STUDIO METRICS",
  );
  const metrics =
    metricsFromSlots.length > 0
      ? metricsFromSlots
      : [
          { id: "metric-1", textValue: "12+", textContent: "YEARS OF LEGACY" },
          { id: "metric-2", textValue: "750+", textContent: "STORIES CAPTURED" },
          { id: "metric-3", textValue: "3200+", textContent: "REELS PRODUCED" },
          { id: "metric-4", textValue: "99%", textContent: "CLIENT TRUST" },
        ];

  return (
    <section className="relative w-full overflow-hidden bg-black text-white flex flex-col justify-center items-center px-6 md:px-24 border-y border-white/5" style={{ height: "900px" }}>

      {/* Background Grid Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/[0.03]" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-24">

        {/* Header Area */}
        <div className="text-center space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] md:text-xs font-black tracking-[0.6em] text-white/20 uppercase"
          >
            PRECISION IN EVERY FRAME
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tightest uppercase italic leading-none"
          >
            STUDIO METRICS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            className="text-[10px] md:text-xs font-medium max-w-lg mx-auto leading-relaxed"
          >
            Quantifiable excellence across a decade of cinematic storytelling and visual innovation.
          </motion.p>
        </div>

        {/* The Flip Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0">
          {metrics.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1, duration: 1 }}
              className={`flex flex-col items-center justify-center p-8 group ${i < metrics.length - 1 ? 'md:border-r border-white/5' : ''}`}
            >
              <div className="text-5xl md:text-8xl transition-all duration-700 group-hover:text-[#B6FF00]">
                <FlipNumber value={item.textValue || "0"} />
              </div>
              <div className="mt-6 text-[9px] md:text-[11px] font-black tracking-[0.4em] text-white/20 uppercase whitespace-nowrap group-hover:text-white/60 transition-colors">
                {item.textContent || "DATA"}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Concept */}
        <div className="flex flex-col items-center gap-10 opacity-20">
          <div className="w-[1px] h-16 bg-gradient-to-full from-white to-transparent" />
          <p className="text-[10px] font-black tracking-[0.7em] uppercase">BEYOND THE LENS</p>
        </div>

      </div>
    </section>
  );
}

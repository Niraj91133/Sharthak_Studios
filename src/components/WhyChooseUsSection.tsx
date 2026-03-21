"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";
import { useMediaContext } from "@/context/MediaContext";

function CountUp({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract numeric part from string like "12+" or "99%"
  const numericValue = parseInt(value, 10) || 0;
  const cleanSuffix = value.replace(/[0-9]/g, '');

  const springValue = useSpring(0, {
    damping: 40,
    stiffness: 80,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(numericValue);
    }
  }, [isInView, springValue, numericValue]);

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  return (
    <span ref={ref} className="inline-flex items-center">
      <motion.span>{displayValue}</motion.span>
      {cleanSuffix && <span className="ml-1">{cleanSuffix}</span>}
    </span>
  );
}

export default function WhyChooseUsSection() {
  const { slots } = useMediaContext();
  const metrics = slots.filter(s => s.section === "10. STUDIO METRICS");

  return (
    <section className="relative w-full overflow-hidden bg-black text-white flex flex-col justify-center items-center px-6 md:px-24" style={{ height: "900px" }}>

      {/* Background Subtle Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-20">

        {/* New Header */}
        <div className="text-center space-y-4">
          <p className="text-[10px] md:text-xs font-black tracking-[0.6em] text-white/30 uppercase">ARCHIVING MOMENTS SINCE 2012</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tightest uppercase italic">
            THE STUDIO METRICS
          </h2>
          <p className="text-[10px] md:text-xs font-medium text-white/40 max-w-md mx-auto leading-relaxed">
            Quantitative proof of our commitment to cinematic excellence and timeless storytelling across every frame we capture.
          </p>
        </div>

        {/* Refined Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {metrics.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1 }}
              className={`flex flex-col items-center justify-center p-8 ${i < metrics.length - 1 ? 'md:border-r border-white/5' : ''}`}
            >
              <div className="text-4xl md:text-6xl font-black tracking-tighter mb-3 text-white">
                <CountUp value={item.textValue || "0"} />
              </div>
              <div className="text-[9px] md:text-[11px] font-black tracking-[0.4em] text-white/20 uppercase whitespace-nowrap">
                {item.textContent || "LABEL"}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer Concept */}
        <div className="flex flex-col items-center gap-8 opacity-40">
          <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent" />
          <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/80">AUTHENTICITY IN EVERY PIXEL</p>
        </div>

      </div>
    </section>
  );
}

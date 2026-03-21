"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { useMedia } from "@/hooks/useMedia";
import { useMediaContext } from "@/context/MediaContext";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useSectionScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = sectionEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = clamp01(-rect.top / total);
      setProgress(scrolled);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return progress;
}

type HeroScrollProps = {
  tickerText?: string;
};

// Helper component for each slide image
function SlideImage({ index, slideT, priority = false }: { index: number; slideT: number; priority?: boolean }) {
  const slotId = `hero-slide-${String(index + 1).padStart(2, "0")}`;
  const fallback = `https://picsum.photos/seed/sharthak-${String(index + 1).padStart(2, "0")}/2400/1600`;
  const src = useMedia(slotId, fallback);

  const local = index === 0 ? 1 : clamp01(slideT - (index - 1));
  const translateX = index === 0 ? 0 : (1 - local) * 100;

  return (
    <div
      className="absolute inset-0 will-change-transform"
      style={{
        transform: index === 0 ? "none" : `translate3d(${translateX}%, 0, 0)`,
        zIndex: index + 1,
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover contrast-125 grayscale hover:grayscale-0 transition-all duration-1000"
      />
    </div>
  );
}

export default function HeroScroll({
  tickerText = "SHARTHAK STUDIO • PREMIUM CINEMATOGRAPHY • GAYA • BIHAR • CAPTURING YOUR TIMELESS STORIES WITH CINEMATIC PRECISION",
}: HeroScrollProps) {
  const { slots } = useMediaContext();
  const heroSlots = slots.filter(s => s.section && (s.section.includes("HERO") || s.section.includes("08.")));
  const slideCount = heroSlots.length || 4;

  const sectionRef = useRef<HTMLElement | null>(null);
  const rawProgress = useSectionScrollProgress(sectionRef);
  const progress = rawProgress;

  const totalSegments = slideCount;
  const tSeg = progress * totalSegments;
  const intro = clamp01(tSeg);
  const slideT = Math.max(0, tSeg - 1);

  const activeSlideIndex = Math.min(
    slideCount - 1,
    Math.max(0, Math.floor(slideT + 1e-6)),
  );

  const titleSlideIndex = Math.min(
    slideCount - 1,
    Math.max(0, intro < 1 ? 0 : 1 + Math.floor(slideT + 1e-6)),
  );

  const currentCategory = heroSlots[activeSlideIndex]?.categoryLabel || "";
  const heroTitle = intro < 1 ? "STUDIO" : (heroSlots[titleSlideIndex]?.categoryLabel || "SHARTHAK");

  const imageHeight = lerp(52, 100, intro);
  const splitTop = 100 - imageHeight;
  const titleTranslateY = lerp(0, 44, intro);
  const titleScale = lerp(1, 0.78, intro);
  const tickerOpacity = lerp(1, 0, clamp01(intro * 1.4));
  const categoryOpacity = lerp(0.75, 1, clamp01(intro * 1.2));
  const categoryTranslateY = lerp(10, 0, clamp01(intro * 1.2));

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{ height: `${(totalSegments + 1) * 100}svh` }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Cinematic Backdrop Image Stack */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ height: `${imageHeight}svh` }}
        >
          <div className="relative h-full w-full">
            {Array.from({ length: slideCount }).map((_, index) => (
              <SlideImage
                key={index}
                index={index}
                slideT={slideT}
                priority={index === 0}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Dynamic Category Tag */}
          <div className="pointer-events-none absolute inset-x-0 bottom-20 flex flex-col items-center gap-4">
            <div className="h-0.5 w-12 bg-[#B6FF00] opacity-40" />
            {!!currentCategory && (
              <div
                className="text-center text-[10px] font-black tracking-[0.5em] text-white/95 uppercase drop-shadow-2xl"
                style={{
                  opacity: categoryOpacity,
                  transform: `translate3d(0, ${categoryTranslateY}px, 0)`,
                }}
              >
                {currentCategory}
              </div>
            )}
          </div>
        </div>

        {/* Cinematic Text Core Overlay */}
        <div className="relative z-10 h-full">
          <div
            className="absolute inset-x-0 top-[22svh] px-6 text-center"
            style={{
              transform: `translate3d(0, ${titleTranslateY}svh, 0) scale(${titleScale})`,
              transformOrigin: "center top",
            }}
          >
            <div className="mx-auto max-w-6xl select-none">
              <div className="text-[14vw] md:text-[200px] font-black tracking-tightest leading-none text-white italic transition-all hover:tracking-tighter">
                {heroTitle.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Scrolling Film Ticker */}
          <div
            className="absolute inset-x-0"
            style={{
              top: `${splitTop}svh`,
              opacity: tickerOpacity,
            }}
          >
            <div className="w-full bg-black border-y border-white/10 shadow-2xl">
              <div className="py-2 opacity-30 bg-white/20 h-4" />
              <div className="h-16 md:h-24 flex items-center overflow-hidden bg-black border-y-2 border-white">
                <div className="flex animate-marquee whitespace-nowrap will-change-transform gap-12 items-center">
                  <span className="text-3xl md:text-5xl font-black tracking-tightest uppercase italic text-white">{tickerText}</span>
                  <span className="text-3xl md:text-5xl font-black tracking-tightest uppercase italic text-white">{tickerText}</span>
                </div>
              </div>
              <div className="py-2 opacity-30 bg-white/20 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

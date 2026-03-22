"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { useMediaAsset } from "@/hooks/useMediaAsset";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";
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
  const { src, isUploaded } = useMediaAsset(slotId, fallback);

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
        className={[
          isUploaded ? "object-contain" : "object-contain md:object-cover",
          "contrast-125 grayscale hover:grayscale-0 transition-all duration-1000",
        ].join(" ")}
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imageHeight = isMobile ? lerp(28, 48, intro) : lerp(52, 100, intro);
  const splitTop = 100 - imageHeight;
  const titleTranslateY = lerp(0, 44, intro);
  const titleScale = isMobile ? lerp(0.9, 0.75, intro) : lerp(1, 0.78, intro);
  const tickerOpacity = lerp(1, 0, clamp01(intro * 1.4));
  const categoryOpacity = lerp(0.75, 1, clamp01(intro * 1.2));
  const categoryTranslateY = lerp(10, 0, clamp01(intro * 1.2));

  if (isMobile) {
    const displayImages: Array<{ src: string; isUploaded: boolean }> = heroSlots.length > 0
      ? heroSlots.map((s) => ({
        src: s.uploadedFile?.url ? normalizeMediaUrl(s.uploadedFile.url) : s.currentSrc,
        isUploaded: Boolean(s.uploadedFile && s.useOnSite),
      }))
      : Array.from({ length: 6 }).map((_, i) => ({
        src: `https://picsum.photos/seed/sharthak-${i}/400/300`,
        isUploaded: false,
      }));

    return (
      <section className="relative bg-black w-full overflow-hidden" style={{ height: "694px" }}>
        <div className="flex flex-col h-full w-full py-[48px] px-[24px]">
          {/* Top Scrolling Strip */}
          <div className="w-full h-[116px] overflow-hidden shrink-0">
            <div className="flex gap-[12px] animate-marquee whitespace-nowrap">
              {displayImages.concat(displayImages).map((item, i) => (
                <div key={i} className="relative w-[174px] h-[116px] flex-shrink-0">
                  <Image
                    src={item.src}
                    alt=""
                    width={174}
                    height={116}
                    className={[
                      "rounded-[8px] contrast-125",
                      item.isUploaded ? "object-contain bg-black" : "object-cover",
                    ].join(" ")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center Content Section */}
          <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingTop: "99px", paddingBottom: "99px" }}>
            <h1 className="text-[28px] font-bold tracking-[4px] text-white text-center leading-none uppercase">
              SHARTHAK STUDIO
            </h1>
            <p className="mt-[12px] text-[14px] font-normal tracking-[3px] leading-[1.6] text-[#A1A1A1] text-center max-w-[280px] uppercase">
              CAPTURING TIMELESS MOMENTS & CINEMATIC STORIES
            </p>
            <button className="mt-[32px] w-[320px] h-[46px] border border-white rounded-[4px] text-white text-[14px] font-medium tracking-[2px] bg-transparent active:bg-white/10 transition-colors uppercase cursor-pointer">
              CONTACT US
            </button>
          </div>

          {/* Bottom Scrolling Strip */}
          <div className="w-full h-[116px] overflow-hidden shrink-0">
            <div className="flex gap-[12px] animate-marquee whitespace-nowrap" style={{ animationDirection: "reverse" }}>
              {displayImages.concat(displayImages).map((item, i) => (
                <div key={i} className="relative w-[174px] h-[116px] flex-shrink-0">
                  <Image
                    src={item.src}
                    alt=""
                    width={174}
                    height={116}
                    className={[
                      "rounded-[8px] contrast-125",
                      item.isUploaded ? "object-contain bg-black" : "object-cover",
                    ].join(" ")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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

          <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${isMobile ? 'h-32' : 'h-96'} bg-gradient-to-t from-black via-black/40 to-transparent`} />

          {/* Dynamic Category Tag */}
          <div className={`pointer-events-none absolute inset-x-0 ${isMobile ? 'bottom-8' : 'bottom-20'} flex flex-col items-center gap-4`}>
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

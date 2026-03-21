"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/hooks/useMedia";

type SlideConfig = {
  id: string;
  fallback: string;
  title?: string;
  subtitle?: string;
};

function DynamicLatestSlide({ config, isActive }: { config: SlideConfig; isActive: boolean }) {
  const src = useMedia(config.id, config.fallback);
  return (
    <div className="latest-work__slide">
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt=""
          fill
          sizes="440px"
          className="object-cover"
          priority={isActive}
        />

        {config.title && (
          <>
            <div className="latest-work__view">VIEW</div>
            <div className="absolute bottom-7 left-6">
              <div className="text-lg font-extrabold text-white">
                {config.title}
              </div>
              <div className="text-sm text-white/80">
                {config.subtitle}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function LatestWorkSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slides: SlideConfig[] = useMemo(
    () => [
      {
        id: "latest-work-01",
        title: "Retreat & Rally",
        subtitle: "for Padel United",
        fallback: "https://picsum.photos/seed/latest-work-01/1600/1200",
      },
      {
        id: "latest-work-02",
        fallback: "https://picsum.photos/seed/latest-work-02/1600/1200",
      },
      {
        id: "latest-work-03",
        fallback: "https://picsum.photos/seed/latest-work-03/1600/1200",
      },
      {
        id: "latest-work-04",
        fallback: "https://picsum.photos/seed/latest-work-04/1600/1200",
      },
      {
        id: "latest-work-05",
        fallback: "https://picsum.photos/seed/latest-work-05/1600/1200",
      },
      {
        id: "latest-work-06",
        fallback: "https://picsum.photos/seed/latest-work-06/1600/1200",
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const canPrev = index > 0;
  const canNext = index < slides.length - 1;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let locked = false;
    let unlockTimer: number | null = null;

    const unlockSoon = () => {
      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        locked = false;
        unlockTimer = null;
      }, 360);
    };

    const onWheel = (event: WheelEvent) => {
      if (!el.contains(event.target as Node)) return;
      if (event.deltaY === 0) return;
      event.preventDefault();
      if (locked) return;
      locked = true;
      const direction = Math.sign(event.deltaY);
      setIndex((current) =>
        Math.min(slides.length - 1, Math.max(0, current + direction)),
      );
      unlockSoon();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (unlockTimer) window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel);
    };
  }, [slides.length]);

  return (
    <section className="latest-work w-full bg-[#f8f5f1] px-6 py-20 text-[#111111] sm:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1fr_2px_1fr] md:items-start group">
          <div className="md:pl-12 transform transition-transform duration-700 hover:translate-x-2">
            <h2 className="text-balance text-5xl font-black leading-[0.88] tracking-tightest sm:text-8xl">
              FEED ON OUR LATEST WORK
            </h2>
            <div className="mt-8 text-xl font-medium tracking-wide italic opacity-80">
              (How we stop the scroll)
            </div>
          </div>

          <div className="hidden h-32 w-[1.5px] bg-[#111111]/10 md:block translate-y-2" />

          <div className="md:pr-12 md:text-right">
            <div className="font-[var(--font-geist-sans)] text-[11px] font-black tracking-[0.4em] text-[#111111]/40 uppercase mb-8">
              PREMIUM WORK & SERVICES
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <button
                type="button"
                className="group relative inline-flex items-center justify-center overflow-hidden border-2 border-[#111111] px-12 py-5 text-xs font-black uppercase tracking-widest transition-all hover:bg-[#111111] hover:text-white"
              >
                <span className="relative z-10">EXPLORE PORTFOLIO</span>
                <div className="absolute inset-x-0 bottom-0 h-0 bg-black transition-all group-hover:h-full -z-0" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid items-end gap-8 md:grid-cols-[140px_1fr]">
          <div className="flex gap-4 md:pl-8">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => setIndex((v) => Math.max(0, v - 1))}
              className="latest-work__arrow"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => setIndex((v) => Math.min(slides.length - 1, v + 1))}
              className="latest-work__arrow"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="latest-work__film md:justify-self-end">
            <div className="latest-work__perfs" aria-hidden="true" />

            <div
              className="latest-work__window"
              ref={stageRef}
              onClick={(event) => {
                const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (x > rect.width * 0.55) {
                  setIndex((v) => Math.min(slides.length - 1, v + 1));
                } else if (x < rect.width * 0.45) {
                  setIndex((v) => Math.max(0, v - 1));
                }
              }}
            >
              <div
                className="latest-work__track"
                style={{
                  transform: `translate3d(${-index * 440}px, 0, 0)`,
                }}
              >
                {slides.map((config, i) => (
                  <DynamicLatestSlide
                    key={config.id}
                    config={config}
                    isActive={i === index}
                  />
                ))}
              </div>
            </div>

            <div className="latest-work__perfs" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

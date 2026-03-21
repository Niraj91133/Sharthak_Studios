"use client";

import { type CSSProperties, useMemo } from "react";
import { useMedia } from "@/hooks/useMedia";

function StripImage({
  slotId,
  fallback,
  priority,
}: {
  slotId: string;
  fallback: string;
  priority?: boolean;
}) {
  const src = useMedia(slotId, fallback);

  return (
    <div className="imgmarquee__tile bg-white/5">
      <img
        src={src}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="pointer-events-none h-full w-full select-none object-cover"
      />
    </div>
  );
}

function AutoStrip({
  items,
  reverse,
}: {
  items: Array<{ id: string; fallback: string }>;
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  const marqueeVars = useMemo(
    () =>
      ({
        ["--tile-h"]: "116px",
        ["--tile-w"]: "240px",
      }) as CSSProperties,
    [],
  );

  return (
    <div
      aria-hidden="true"
      className={[
        "imgmarquee pointer-events-none select-none",
        reverse ? "imgmarquee--reverse" : "",
      ].join(" ")}
      style={marqueeVars}
    >
      <div className="imgmarquee__track">
        {loop.map((it, idx) => (
          <StripImage
            key={`${it.id}-${idx}`}
            slotId={it.id}
            fallback={it.fallback}
            priority={idx < 2}
          />
        ))}
      </div>
    </div>
  );
}

export default function MobileHeroSection() {
  const topItems = useMemo(
    () => [
      { id: "strip-top-01", fallback: "https://picsum.photos/seed/strip-0/600/600" },
      { id: "strip-top-02", fallback: "https://picsum.photos/seed/strip-1/600/600" },
      { id: "strip-top-03", fallback: "https://picsum.photos/seed/strip-2/600/600" },
      { id: "strip-top-04", fallback: "https://picsum.photos/seed/strip-3/600/600" },
      { id: "strip-top-05", fallback: "https://picsum.photos/seed/strip-4/600/600" },
      { id: "strip-top-06", fallback: "https://picsum.photos/seed/strip-5/600/600" },
    ],
    [],
  );

  const bottomItems = useMemo(
    () => [
      { id: "strip-bot-01", fallback: "https://picsum.photos/seed/strip-6/600/600" },
      { id: "strip-bot-02", fallback: "https://picsum.photos/seed/strip-7/600/600" },
      { id: "strip-bot-03", fallback: "https://picsum.photos/seed/strip-8/600/600" },
      { id: "strip-bot-04", fallback: "https://picsum.photos/seed/strip-9/600/600" },
      { id: "strip-bot-05", fallback: "https://picsum.photos/seed/strip-10/600/600" },
      { id: "strip-bot-06", fallback: "https://picsum.photos/seed/strip-11/600/600" },
    ],
    [],
  );

  return (
    <section className="w-full bg-black text-white md:hidden">
      <div className="mx-auto h-[694px] w-full">
        <div className="flex h-full w-full flex-col">
          <AutoStrip items={topItems} />

          <div className="h-[99px]" />

          <div className="flex w-full flex-col items-center px-6 text-center">
            <h1 className="text-[28px] font-bold tracking-[4px] text-white">
              SHARTHAK STUDIO
            </h1>

            <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-[1.6] tracking-[3px] text-[#A1A1A1]">
              CAPTURING TIMELESS MOMENTS &amp; CINEMATIC STORIES
            </p>

            <a
              href="#contact"
              className="mt-8 inline-flex h-[46px] w-[320px] items-center justify-center rounded-[4px] border border-white bg-transparent text-[14px] font-medium tracking-[2px] text-white transition-colors duration-200 active:bg-white active:text-black"
            >
              CONTACT US
            </a>
          </div>

          <div className="h-[99px]" />

          <AutoStrip items={bottomItems} reverse />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { useMediaAsset } from "@/hooks/useMediaAsset";
import { useMediaContext } from "@/context/MediaContext";

function DynamicStripTile({ slotId, fallback, idx }: { slotId: string; fallback: string; idx: number }) {
  const { src } = useMediaAsset(slotId, fallback);
  return (
    <div className="imgmarquee__tile bg-black" style={{ flex: "0 0 auto" }}>
      <img
        src={src}
        alt=""
        loading={idx < 3 ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-auto object-contain bg-black block"
        draggable={false}
      />
    </div>
  );
}

export default function InfiniteStripsCTASection() {
  const { slots } = useMediaContext();
  type StripConfig = { id: string; fallback: string };

  const fallbackTop = [
    { id: "strip-top-01", fallback: "https://picsum.photos/seed/strip-0/600/600" },
    { id: "strip-top-02", fallback: "https://picsum.photos/seed/strip-1/600/600" },
    { id: "strip-top-03", fallback: "https://picsum.photos/seed/strip-2/600/600" },
    { id: "strip-top-04", fallback: "https://picsum.photos/seed/strip-3/600/600" },
    { id: "strip-top-05", fallback: "https://picsum.photos/seed/strip-4/600/600" },
    { id: "strip-top-06", fallback: "https://picsum.photos/seed/strip-5/600/600" },
  ];

  const fallbackBot = [
    { id: "strip-bot-01", fallback: "https://picsum.photos/seed/strip-6/600/600" },
    { id: "strip-bot-02", fallback: "https://picsum.photos/seed/strip-7/600/600" },
    { id: "strip-bot-03", fallback: "https://picsum.photos/seed/strip-8/600/600" },
    { id: "strip-bot-04", fallback: "https://picsum.photos/seed/strip-9/600/600" },
    { id: "strip-bot-05", fallback: "https://picsum.photos/seed/strip-10/600/600" },
    { id: "strip-bot-06", fallback: "https://picsum.photos/seed/strip-11/600/600" },
  ];

  const { topConfigs, botConfigs } = useMemo(() => {
    const sectionSlots = slots.filter(s => s.section === "02. INFINITE STRIPS (DESKTOP)");
    if (sectionSlots.length === 0) return { topConfigs: fallbackTop, botConfigs: fallbackBot };

    const top: StripConfig[] = [];
    const bot: StripConfig[] = [];

    sectionSlots.forEach((s, idx) => {
      const config = { id: s.id, fallback: s.fallbackSrc };
      if (s.id.includes("-top-")) top.push(config);
      else if (s.id.includes("-bot-")) bot.push(config);
      else {
        // Distribute extras
        if (idx % 2 === 0) top.push(config);
        else bot.push(config);
      }
    });

    return { topConfigs: top, botConfigs: bot };
  }, [slots]);

  const topLoop = [...topConfigs, ...topConfigs];
  const bottomLoop = [...botConfigs, ...botConfigs];

  return (
    <section className="w-full bg-black text-white">
      <div className="w-full overflow-hidden">
        <div className="imgmarquee">
          <div className="imgmarquee__track">
            {topLoop.map((config, idx) => (
              <DynamicStripTile
                key={`${config.id}-${idx}`}
                slotId={config.id}
                fallback={config.fallback}
                idx={idx}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-[380px] w-full items-center justify-center px-6 py-20">
          <div className="text-center">
            <div className="text-[clamp(28px,4.2vw,56px)] font-black tracking-[0.15em] text-white/95 leading-tight">
              SHARTHAK STUDIO<br />
              <span className="text-sm font-medium tracking-[0.4em] text-white/40 block mt-4 uppercase">Capturing Timeless Moments & Cinematic Stories</span>
            </div>
            <a
              href="https://wa.me/917091876067"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-14 w-[320px] items-center justify-center border border-white/65 text-[14px] font-medium tracking-[0.16em] text-white/80 transition-colors duration-200 hover:bg-white hover:text-black"
            >
              HIRE SHARTHAK STUDIO
            </a>
          </div>
        </div>

        <div className="imgmarquee imgmarquee--reverse">
          <div className="imgmarquee__track">
            {bottomLoop.map((config, idx) => (
              <DynamicStripTile
                key={`${config.id}-${idx}`}
                slotId={config.id}
                fallback={config.fallback}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useMediaContext } from "@/context/MediaContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";

function resolveAsset(
  slots: ReturnType<typeof useMediaContext>["slots"],
  slotId: string,
  fallback: string,
) {
  const slot = slots.find((s) => s.id === slotId);
  const isUploaded = Boolean(slot?.uploadedFile && slot.useOnSite);
  const src = isUploaded ? normalizeMediaUrl(slot!.uploadedFile!.url) : fallback;
  return { src, isUploaded };
}

function usePreloadedImages(srcs: string[], timeoutMs = 1200) {
  const key = useMemo(() => srcs.join("|"), [srcs]);
  const [readyKey, setReadyKey] = useState<string>("");
  const isReady = readyKey === key;

  useEffect(() => {
    let cancelled = false;

    const unique = Array.from(new Set(srcs)).filter(Boolean);
    if (unique.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) setReadyKey(key);
      });
      return;
    }

    const loadOne = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));

    Promise.race([Promise.allSettled(unique.map(loadOne)).then(() => undefined), timeout]).then(() => {
      if (!cancelled) setReadyKey(key);
    });

    return () => {
      cancelled = true;
    };
  }, [key, srcs, timeoutMs]);

  return isReady;
}

function useImageRatios(srcs: string[], timeoutMs = 1200) {
  const key = useMemo(() => srcs.join("|"), [srcs]);
  const [readyKey, setReadyKey] = useState<string>("");
  const [ratiosBySrc, setRatiosBySrc] = useState<Record<string, number>>({});
  const ready = readyKey === key;

  useEffect(() => {
    let cancelled = false;
    const unique = Array.from(new Set(srcs)).filter(Boolean);
    if (unique.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) {
          setRatiosBySrc({});
          setReadyKey(key);
        }
      });
      return () => {
        cancelled = true;
      };
    }

    const next: Record<string, number> = {};
    const loadOne = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || 1;
          const h = img.naturalHeight || 1;
          next[src] = Math.max(0.2, Math.min(5, w / h));
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });

    const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
    Promise.race([Promise.allSettled(unique.map(loadOne)).then(() => undefined), timeout]).then(() => {
      if (cancelled) return;
      setRatiosBySrc(next);
      setReadyKey(key);
    });

    return () => {
      cancelled = true;
    };
  }, [key, srcs, timeoutMs]);

  return { ready, ratiosBySrc };
}

function AutoStrip({
  items,
  reverse,
}: {
  items: Array<{ id: string; fallback: string }>;
  reverse?: boolean;
}) {
  const { slots } = useMediaContext();
  const loop = [...items, ...items];
  const tileH = 116;
  const marqueeVars = useMemo(
    () =>
      ({
        ["--tile-h"]: "116px",
        ["--tile-w"]: "240px",
      }) as CSSProperties,
    [],
  );

  const loopAssets = useMemo(
    () => loop.map((it) => resolveAsset(slots, it.id, it.fallback)),
    [loop, slots],
  );
  const srcList = useMemo(() => loopAssets.map((a) => a.src), [loopAssets]);
  const { ready, ratiosBySrc } = useImageRatios(srcList);

  const widthFor = (src: string) => {
    const ratio = ratiosBySrc[src];
    if (!ratio) return 240;
    const w = Math.round(tileH * ratio);
    // Allow wide landscape tiles without cropping.
    return Math.max(72, Math.min(520, w));
  };

  const altFor = (slotId: string) =>
    `Wedding photography showcase frame from Sharthak Studio portfolio (${slotId.replace(/-/g, " ")})`;

  return (
    <div
      aria-hidden="true"
      className={[
        "imgmarquee pointer-events-none select-none",
        reverse ? "imgmarquee--reverse" : "",
      ].join(" ")}
      style={marqueeVars}
    >
      <div
        className="imgmarquee__track"
        style={{ animationPlayState: ready ? "running" : "paused" }}
      >
        {loop.map((it, idx) => {
          const asset = loopAssets[idx] || { src: it.fallback, isUploaded: false };
          const src = asset.src || it.fallback || null;
          const priority = idx < 2;
          return (
            <div
              key={`${it.id}-${idx}`}
              className="imgmarquee__tile bg-black"
              style={ready ? { flex: `0 0 ${widthFor(src || "")}px` } : undefined}
            >
              {ready && src ? (
                <img
                  src={src}
                  alt={altFor(it.id)}
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  className="pointer-events-none h-full w-full select-none object-contain bg-black"
                />
              ) : (
                <div className="h-full w-full bg-white/5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MobileHeroSection() {
  const { slots } = useMediaContext();
  const { settings } = useSiteSettings();
  type HeroItem = { id: string; fallback: string };
  const fallbackTop = [
    { id: "mobile-hero-top-01", fallback: "https://picsum.photos/seed/m-hero-top-0/600/400" },
    { id: "mobile-hero-top-02", fallback: "https://picsum.photos/seed/m-hero-top-1/600/400" },
    { id: "mobile-hero-top-03", fallback: "https://picsum.photos/seed/m-hero-top-2/600/400" },
  ];

  const fallbackBot = [
    { id: "mobile-hero-bot-01", fallback: "https://picsum.photos/seed/m-hero-bot-0/600/400" },
    { id: "mobile-hero-bot-02", fallback: "https://picsum.photos/seed/m-hero-bot-1/600/400" },
    { id: "mobile-hero-bot-03", fallback: "https://picsum.photos/seed/m-hero-bot-2/600/400" },
  ];

  const { topItems, bottomItems } = useMemo(() => {
    const sectionSlots = slots.filter(s => s.section === "01. MOBILE HERO SECTION");
    if (sectionSlots.length === 0) return { topItems: fallbackTop, bottomItems: fallbackBot };

    const top: HeroItem[] = [];
    const bot: HeroItem[] = [];

    sectionSlots.forEach((s, idx) => {
      const item = { id: s.id, fallback: s.fallbackSrc };
      if (s.id.includes("top")) top.push(item);
      else if (s.id.includes("bot")) bot.push(item);
      else {
        if (idx % 2 === 0) top.push(item);
        else bot.push(item);
      }
    });

    return { topItems: top, bottomItems: bot };
  }, [slots]);

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
              WEDDING PHOTOGRAPHER &amp; CINEMATOGRAPHER IN GAYA, BIHAR
            </p>

            <a
              href={settings.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-[46px] w-[320px] items-center justify-center rounded-[4px] border border-white bg-transparent text-[14px] font-medium tracking-[2px] text-white transition-colors duration-200 active:bg-white active:text-black hover:bg-white hover:text-black"
            >
              CHECK AVAILABILITY ON WHATSAPP
            </a>
          </div>

          <div className="h-[99px]" />

          <AutoStrip items={bottomItems} reverse />
        </div>
      </div>
    </section>
  );
}

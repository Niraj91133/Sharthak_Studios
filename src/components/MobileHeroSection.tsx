"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useMediaContext } from "@/context/MediaContext";
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
          const src = asset.src || it.fallback;
          const priority = idx < 2;
          return (
            <div
              key={`${it.id}-${idx}`}
              className="imgmarquee__tile bg-black"
              style={ready ? { flex: `0 0 ${widthFor(src)}px` } : undefined}
            >
              {ready ? (
                <img
                  src={src}
                  alt=""
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
              href="https://wa.me/917091876067"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-[46px] w-[320px] items-center justify-center rounded-[4px] border border-white bg-transparent text-[14px] font-medium tracking-[2px] text-white transition-colors duration-200 active:bg-white active:text-black hover:bg-white hover:text-black"
            >
              CONTACT US ON WHATSAPP
            </a>
          </div>

          <div className="h-[99px]" />

          <AutoStrip items={bottomItems} reverse />
        </div>
      </div>
    </section>
  );
}

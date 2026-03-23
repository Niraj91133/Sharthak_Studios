"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaAsset } from "@/hooks/useMediaAsset";

function InlinePhoto({
  src,
  widthEm = 2.8,
}: {
  src: string;
  widthEm?: number;
}) {
  return (
    <span
      className="relative inline-block overflow-hidden align-[0.06em]"
      style={{
        height: "0.66em",
        width: `${widthEm}em`,
        borderRadius: 6,
      }}
    >
      <Image src={src} alt="" fill className="object-cover" sizes="220px" />
    </span>
  );
}

type AlbumPageData = {
  pageNo: number;
  title: ReactNode;
  body: string;
  heroSlotId: string;
  heroFallback: string;
  tileConfigs: { id: string; fallback: string }[];
};

function Page({
  data,
  rounded,
}: {
  data: AlbumPageData;
  rounded: "left" | "right" | "none";
}) {
  const { src: heroSrc, isUploaded: heroUploaded } = useMediaAsset(data.heroSlotId, data.heroFallback);

  return (
    <div
      className="relative h-full w-full bg-[#fafafa]"
      style={{
        padding: "42px 38px",
        borderTopLeftRadius: rounded === "left" ? 14 : 0,
        borderBottomLeftRadius: rounded === "left" ? 14 : 0,
        borderTopRightRadius: rounded === "right" ? 14 : 0,
        borderBottomRightRadius: rounded === "right" ? 14 : 0,
        boxShadow: "inset 0 0 50px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black tracking-[0.3em] text-black/30 uppercase">
          SHARTHAK STUDIO • ALBUM
        </div>
        <div className="text-[10px] font-bold tracking-[0.22em] text-black/45">
          PG. {String(data.pageNo).padStart(2, '0')}
        </div>
      </div>

      <div className="mt-8 text-[clamp(24px,3vw,38px)] font-black leading-[1.05] tracking-tighter text-black uppercase italic">
        {data.title}
      </div>

      <div className="mt-5 text-[15px] font-medium leading-[1.6] text-black/60 max-w-[90%]">
        {data.body}
      </div>

      <div className="mt-10 overflow-hidden rounded-[8px]">
        <div className="relative h-[240px] w-full overflow-hidden rounded-[8px] shadow-sm">
          <Image
            src={heroSrc}
            alt=""
            fill
            className={heroUploaded ? "object-contain bg-black/5" : "object-cover"}
            sizes="520px"
            priority={data.pageNo <= 2}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {data.tileConfigs.map((config, idx) => (
          <Tile key={idx} slotId={config.id} fallback={config.fallback} />
        ))}
      </div>
    </div>
  );
}

function Tile({ slotId, fallback }: { slotId: string; fallback: string }) {
  const { src, isUploaded } = useMediaAsset(slotId, fallback);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
      <Image
        src={src}
        alt=""
        fill
        className={isUploaded ? "object-contain" : "object-cover"}
        sizes="180px"
      />
    </div>
  );
}

export default function WhyChooseUsBookFlipSection() {
  const pages: AlbumPageData[] = useMemo(
    () => [
      {
        pageNo: 1,
        title: (
          <>
            BECAUSE EVERY MOMENT{" "}
            <InlinePhoto src="https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=1200&q=80" widthEm={3} />{" "}
            MATTERS.
          </>
        ),
        body: "From weddings to family celebrations, we capture real emotions and moments — not poses.",
        heroSlotId: "why-choose-us-p1-hero",
        heroFallback: "https://picsum.photos/seed/why-0/1200/1600",
        tileConfigs: [
          { id: "why-choose-us-p1-tile-1", fallback: "https://picsum.photos/seed/why-1/1200/1600" },
          { id: "why-choose-us-p1-tile-2", fallback: "https://picsum.photos/seed/why-2/1200/1600" },
          { id: "why-choose-us-p1-tile-3", fallback: "https://picsum.photos/seed/why-3/1200/1600" },
        ],
      },
      {
        pageNo: 2,
        title: (
          <>
            WE CREATE{" "}
            <InlinePhoto src="https://images.unsplash.com/photo-1520975958225-78317a29958d?auto=format&fit=crop&w=1200&q=80" widthEm={3.2} />{" "}
            STORIES.
          </>
        ),
        body: "Premium editing, creative shots, perfect lighting, and luxury visuals — delivered in HD with detail‑focused storytelling.",
        heroSlotId: "why-choose-us-p2-hero",
        heroFallback: "https://picsum.photos/seed/why-4/1200/1600",
        tileConfigs: [
          { id: "why-choose-us-p2-tile-1", fallback: "https://picsum.photos/seed/why-5/1200/1600" },
          { id: "why-choose-us-p2-tile-2", fallback: "https://picsum.photos/seed/why-6/1200/1600" },
          { id: "why-choose-us-p2-tile-3", fallback: "https://picsum.photos/seed/why-7/1200/1600" },
        ],
      },
      {
        pageNo: 3,
        title: <>CAPTURE REAL EMOTIONS.</>,
        body: "We focus on real smiles, candid moments, and the energy of your day — so it feels alive forever.",
        heroSlotId: "why-choose-us-p3-hero",
        heroFallback: "https://picsum.photos/seed/why-8/1200/1600",
        tileConfigs: [
          { id: "why-choose-us-p3-tile-1", fallback: "https://picsum.photos/seed/why-9/1200/1600" },
          { id: "why-choose-us-p3-tile-2", fallback: "https://picsum.photos/seed/why-10/1200/1600" },
          { id: "why-choose-us-p3-tile-3", fallback: "https://picsum.photos/seed/why-11/1200/1600" },
        ],
      },
      {
        pageNo: 4,
        title: <>CINEMATIC VISUALS.</>,
        body: "Smooth reels, color‑perfect frames, and a film‑like look — crafted to match your style.",
        heroSlotId: "why-choose-us-p4-hero",
        heroFallback: "https://picsum.photos/seed/why-12/1200/1600",
        tileConfigs: [
          { id: "why-choose-us-p4-tile-1", fallback: "https://picsum.photos/seed/why-13/1200/1600" },
          { id: "why-choose-us-p4-tile-2", fallback: "https://picsum.photos/seed/why-14/1200/1600" },
          { id: "why-choose-us-p4-tile-3", fallback: "https://picsum.photos/seed/why-15/1200/1600" },
        ],
      },
      {
        pageNo: 5,
        title: <>TIMELESS MEMORIES.</>,
        body: "On‑time delivery, friendly team, and a comfortable shoot experience — so you can enjoy your day fully.",
        heroSlotId: "why-choose-us-p5-hero",
        heroFallback: "https://picsum.photos/seed/why-16/1200/1600",
        tileConfigs: [
          { id: "why-choose-us-p5-tile-1", fallback: "https://picsum.photos/seed/why-17/1200/1600" },
          { id: "why-choose-us-p5-tile-2", fallback: "https://picsum.photos/seed/why-18/1200/1600" },
          { id: "why-choose-us-p5-tile-3", fallback: "https://picsum.photos/seed/why-19/1200/1600" },
        ],
      },
    ],
    [],
  );

  const [leftIndex, setLeftIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const rightIndex = (leftIndex + 1) % pages.length;

  const flipVariants = {
    enter: (dir: 1 | -1) => ({
      rotateY: dir > 0 ? 15 : -15,
      x: dir > 0 ? "20%" : "-20%",
      opacity: 0,
      filter: "blur(4px)",
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
    },
    exit: (dir: 1 | -1) => ({
      rotateY: dir > 0 ? -15 : 15,
      x: dir > 0 ? "-20%" : "20%",
      opacity: 0,
      filter: "blur(4px)",
      scale: 0.95,
    }),
  };

  const goNext = (step: 1 | 2) => {
    setDirection(1);
    setLeftIndex((i) => (i + step) % pages.length);
  };

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-20 text-black sm:px-6">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-center text-[clamp(26px,4vw,46px)] font-light tracking-[0.08em] text-black/85">
          WHY CHOOSE US?
        </h2>

        <div className="mx-auto mt-12 w-full max-w-none">
          <div
            className="relative mx-auto w-full"
            style={{ perspective: "1800px" }}
          >
            {/* Stacked pages behind (album thickness) */}
            <div className="absolute inset-0 hidden md:block" aria-hidden="true">
              {/* Outer Cover Backing */}
              <div
                className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] bg-[#111]"
                style={{
                  borderRadius: 20,
                  transform: "translateZ(-30px)",
                  boxShadow: "0 50px 100px -20px rgba(0,0,0,0.5)",
                }}
              />

              {/* Paper Stack Edge */}
              <div
                className="absolute left-0 top-0 h-full w-full bg-[#eee]"
                style={{
                  transform: "translate(8px, 8px)",
                  borderRadius: 16,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
              <div
                className="absolute left-0 top-0 h-full w-full bg-[#e5e5e5]"
                style={{
                  transform: "translate(4px, 4px)",
                  borderRadius: 16,
                }}
              />
            </div>

            <div
              className="relative mx-auto w-full overflow-hidden bg-[#fafafa]"
              style={{
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              }}
            >
              {/* Mobile: slide page */}
              <div className="relative min-h-[640px] md:hidden overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.button
                    key={`m-${leftIndex}`}
                    type="button"
                    onClick={() => goNext(1)}
                    aria-label="Next page"
                    className="absolute inset-0 text-left"
                    custom={direction}
                    variants={flipVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Page data={pages[leftIndex]} rounded="none" />
                  </motion.button>
                </AnimatePresence>
              </div>

              {/* Desktop: slide spread (two pages) */}
              <div className="relative hidden min-h-[640px] md:block overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.button
                    key={`d-${leftIndex}`}
                    type="button"
                    onClick={() => goNext(2)}
                    aria-label="Next spread"
                    className="absolute inset-0 text-left"
                    custom={direction}
                    variants={flipVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="grid min-h-[640px] grid-cols-2">
                      <div className="relative">
                        <Page data={pages[leftIndex]} rounded="left" />

                        {/* Realistic Spine Shadow (Left Side) */}
                        <div
                          className="pointer-events-none absolute right-0 top-0 h-full w-[24px]"
                          style={{
                            background:
                              "linear-gradient(270deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0) 100%)",
                            zIndex: 10,
                          }}
                        />
                      </div>
                      <div className="relative">
                        <Page data={pages[rightIndex]} rounded="right" />

                        {/* Central Binding Detail */}
                        <div
                          className="pointer-events-none absolute left-0 top-0 hidden h-full w-[2px] md:block"
                          style={{
                            background: "linear-gradient(90deg, rgba(0,0,0,0.15), rgba(255,255,255,0.05))",
                            boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                            zIndex: 20
                          }}
                        />

                        {/* Realistic Spine Shadow (Right Side) */}
                        <div
                          className="pointer-events-none absolute left-0 top-0 hidden h-full w-[24px] md:block"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 60%, rgba(0,0,0,0) 100%)",
                            zIndex: 10,
                          }}
                        />
                      </div>
                    </div>
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 transition-all duration-700 rounded-full"
                  style={{
                    width: i === leftIndex ? "24px" : "6px",
                    background:
                      i === leftIndex ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>

            <div className="mt-2 text-center text-[13px] font-semibold tracking-[0.04em] text-black/45">
              Tap / click to slide →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

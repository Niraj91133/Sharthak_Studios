"use client";

import { useMemo, useEffect, useRef } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";

// Components
import HeroScroll from "@/components/HeroScroll";
import CameraCTASection from "@/components/CameraCTASection";

// Lazy-loaded sections for performance and stability
const GallerySection = dynamic(() => import("@/components/GallerySection"), { ssr: false });
const LatestWorkSection = dynamic(() => import("@/components/LatestWorkSection"), { ssr: false });
const ExpertiseSection = dynamic(() => import("@/components/ExpertiseSection"), { ssr: false });
const VideoEditingTimelineSection = dynamic(() => import("@/components/VideoEditingTimelineSection"), { ssr: false });
const WhyChooseUsBookFlipSection = dynamic(() => import("@/components/WhyChooseUsBookFlipSection"), { ssr: false });
const InfiniteStripsCTASection = dynamic(() => import("@/components/InfiniteStripsCTASection"), { ssr: false });
const CoupleShootGame = dynamic(() => import("@/components/CoupleShootGame"), { ssr: false });

export default function AppContent() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            smoothWheel: true,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    const categories = useMemo(() => ["PHOTOGRAPHY", "PHOTO EDITING", "VIDEO EDITING"], []);

    const featureLines = useMemo(() => [
        "Cinematic Quality", "Premium Editing", "Creative Shots", "Luxury Visuals",
        "HD Delivery", "Color Perfection", "Emotional Moments", "Natural Captures",
        "Professional Team", "Fast Delivery", "Trusted Service", "Detail Focused",
        "Storytelling Style", "Perfect Lighting", "Memorable Frames", "Smooth Reels",
    ], []);

    const galleryTabs = useMemo(() => {
        const tabs = Array.from({ length: 6 }, () => ({
            label: "PHOTOGRAPHY",
            active: false,
        }));
        tabs[0].active = true;
        return tabs;
    }, []);

    const galleryItems = useMemo(() => [
        { seed: "gal-01", col: "1 / span 1", row: "1 / span 2" },
        { seed: "gal-02", col: "1 / span 1", row: "3 / span 2" },
        { seed: "gal-03", col: "2 / span 2", row: "1 / span 1" },
        { seed: "gal-04", col: "2 / span 2", row: "2 / span 2" },
        { seed: "gal-05", col: "2 / span 2", row: "4 / span 1" },
        { seed: "gal-06", col: "4 / span 1", row: "1 / span 2" },
        { seed: "gal-07", col: "4 / span 1", row: "3 / span 1" },
        { seed: "gal-08", col: "4 / span 1", row: "4 / span 1" },
        { seed: "gal-09", col: "5 / span 1", row: "1 / span 2" },
        { seed: "gal-10", col: "6 / span 1", row: "1 / span 2" },
        { seed: "gal-11", col: "5 / span 2", row: "3 / span 1" },
        { seed: "gal-12", col: "5 / span 2", row: "4 / span 1" },
        { seed: "gal-13", col: "1 / span 1", row: "5 / span 2" },
        { seed: "gal-14", col: "2 / span 2", row: "5 / span 1" },
        { seed: "gal-15", col: "2 / span 2", row: "6 / span 1" },
        { seed: "gal-16", col: "4 / span 1", row: "5 / span 2" },
        { seed: "gal-17", col: "5 / span 1", row: "5 / span 2" },
        { seed: "gal-18", col: "6 / span 1", row: "5 / span 2" },
    ], []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <HeroScroll
                title="SHARTHAK STUDIO"
                eyebrow="SHARTHAK STUDIO"
                slides={Array.from({ length: 10 }, (_, i) => ({
                    imageUrl: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
                    category: categories[i % categories.length],
                }))}
            />

            <CameraCTASection />

            {/* Intro Stats Section */}
            <section className="relative min-h-[50vh] bg-black px-6 py-24 flex items-center justify-center overflow-hidden">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <h2 className="text-7xl md:text-9xl font-black leading-none tracking-tighter">
                            SHARTHAK<br />STUDIO
                        </h2>
                        <p className="text-xl text-white/60 max-w-md leading-relaxed">
                            We don&apos;t just take photos. We capture the soul of the moment,
                            refined through cinematic lenses and expert hands.
                        </p>
                        <div className="flex gap-6">
                            <button className="px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:invert transition-all">
                                View Portfolio
                            </button>
                            <button className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all">
                                The Team
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { label: "YEARS", val: "10+" },
                            { label: "WEDDINGS", val: "500+" },
                            { label: "REELS", val: "2k+" },
                            { label: "HAPPY LIVES", val: "∞" }
                        ].map((stat) => (
                            <div key={stat.label} className="p-10 border border-white/10 bg-white/[0.02] backdrop-blur-xl group hover:bg-white hover:text-black transition-all duration-700 cursor-default">
                                <div className="text-5xl font-black transition-colors">{stat.val}</div>
                                <div className="text-[10px] uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-colors mt-3">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Slider */}
            <section className="py-24 bg-white text-black overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap will-change-transform">
                    {[...featureLines, ...featureLines].map((line, i) => (
                        <span key={i} className="text-9xl font-black px-12 tracking-tighter opacity-10 hover:opacity-100 transition-opacity cursor-default">
                            {line.toUpperCase()}
                        </span>
                    ))}
                </div>
            </section>

            <GallerySection tabs={galleryTabs} items={galleryItems} />

            <LatestWorkSection />

            <CoupleShootGame />

            <ExpertiseSection />

            <VideoEditingTimelineSection />

            <WhyChooseUsBookFlipSection />

            <InfiniteStripsCTASection />

            {/* Footer */}
            <footer className="bg-black py-32 px-6 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto space-y-16">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-none">LET&apos;S CRAFT YOUR STORY</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                        <div className="space-y-3">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Email Us</div>
                            <div className="text-2xl font-bold">hello@sharthak.studio</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Call Us</div>
                            <div className="text-2xl font-bold">+91 98765 43210</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Instagram</div>
                            <div className="text-2xl font-bold">@sharthak_studio</div>
                        </div>
                    </div>
                    <div className="pt-24 text-[10px] tracking-[0.6em] text-white/20 uppercase font-medium">
                        © 2026 SHARTHAK STUDIO. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
}

"use client";

import { useMemo, useEffect, useRef } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMediaContext } from "@/context/MediaContext";
import { MediaSlot } from "@/lib/mediaSlots";
import Link from "next/link";

// Components
import HeroScroll from "@/components/HeroScroll";
import CameraCTASection from "@/components/CameraCTASection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

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
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08, // Smoother scroll
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 1,
            gestureOrientation: "vertical",
            touchMultiplier: 2,
            infinite: false,
        });

        (window as any).lenis = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            (window as any).lenis = null;
        };
    }, []);

    const { slots, blogs } = useMediaContext();

    const featureLines = useMemo(() => [
        "Cinematic Quality", "Premium Color Grade", "Creative Storytelling", "Luxury Visuals",
        "8K RAW Workflow", "Masterful Editing", "Hyper-Realistic Captures", "Bespoke Lighting",
        "High-Speed Cinema", "Timeless Frames", "Editorial Precision", "The Golden Hour",
    ], []);

    const galleryTabs = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section && s.section.includes("GALLERY"));
        const set = new Set(gallerySlots.map((s: MediaSlot) => s.categoryLabel).filter(Boolean));
        if (set.size === 0) {
            ["WEDDING", "PRE-WEDDING", "CANDID", "MODEL SHOOT", "BABY SHOOT"].forEach(c => set.add(c));
        }
        return Array.from(set).map(cat => ({ label: cat as string }));
    }, [slots]);

    const galleryItems = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section && s.section.includes("GALLERY"));
        return gallerySlots.map((s: MediaSlot, i: number) => ({
            id: s.id,
            seed: s.id,
            col: (i % 3 === 0) ? "1 / span 1" : (i % 3 === 1) ? "2 / span 2" : "4 / span 1",
            row: (Math.floor(i / 3) * 2 + 1) + " / span 2",
            category: s.categoryLabel || "WEDDING"
        }));
    }, [slots]);

    const latestBlogs = useMemo(() => blogs.slice(0, 3), [blogs]);

    const handleAdminLogin = () => {
        const id = window.prompt("Enter Admin ID:");
        if (id === "Sonu Sharthak") {
            const pass = window.prompt("Enter Password:");
            if (pass === "0000") {
                router.push("/admin");
            } else {
                alert("Incorrect Password!");
            }
        } else if (id !== null) {
            alert("Incorrect ID!");
        }
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-white selection:text-black font-sans scroll-smooth">
            {/* 1. INITIAL TOP STRIPS */}
            <InfiniteStripsCTASection />

            {/* 2. PREMIUM FEATURE MARQUEE */}
            <section className="bg-white text-black overflow-hidden relative border-y border-black/5 py-4">
                <div className="flex animate-marquee whitespace-nowrap will-change-transform gap-24">
                    {[...featureLines, ...featureLines].map((line, i) => (
                        <div key={i} className="flex items-center gap-8">
                            <span className="text-8xl md:text-[10rem] font-black tracking-tightest opacity-15">
                                {line.toUpperCase()}
                            </span>
                            <div className="w-12 h-1 bg-black/5 rounded-full" />
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. GALLERY SECTION */}
            <div className="bg-white">
                <GallerySection tabs={galleryTabs} items={galleryItems} />
            </div>

            {/* 4. EXPERTISE SECTION (Titled Dark) */}
            <ExpertiseSection />

            {/* 5. LATEST WORK */}
            <LatestWorkSection />

            {/* 6. STUDIO BLOGS (Cinematic White Section) */}
            <section className="bg-white py-32 md:py-48 px-6 border-t border-black/5">
                <div className="max-w-6xl mx-auto space-y-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="space-y-6">
                            <span className="text-[10px] font-black tracking-[0.6em] text-black/30 uppercase block">PERSPECTIVES & JOURNALS</span>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tightest leading-none text-black uppercase italic">STUDIO BLOGS</h2>
                        </div>
                        <Link href="/blog" className="px-12 py-5 bg-black text-white text-[11px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl">
                            EXPLORE STORIES →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-6">
                        {latestBlogs.length > 0 ? latestBlogs.map(blog => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group block space-y-8 bg-[#f9f9f9] border border-black/[0.03]">
                                <div className="aspect-[4/5] bg-black/5 overflow-hidden">
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                                <div className="p-8 space-y-4">
                                    <span className="text-[9px] font-bold tracking-[0.4em] text-black/20 uppercase">{blog.category}</span>
                                    <h3 className="text-2xl font-black leading-tight uppercase line-clamp-2 text-black tracking-tighter">{blog.title}</h3>
                                    <div className="h-px w-8 bg-black/10 group-hover:w-full transition-all duration-700" />
                                    <p className="text-xs text-black/40 line-clamp-2 font-medium leading-relaxed">{blog.excerpt}</p>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full py-40 text-center border-2 border-dashed border-black/5">
                                <p className="text-black/10 font-black tracking-[0.6em] uppercase">NO RECENT STORIES PUBLISHED</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 7. VIDEO TIMELINE (Sharp Dark Section) */}
            <div className="bg-black border-y border-white/5">
                <VideoEditingTimelineSection />
            </div>

            {/* 8. BOOK FLIP SECTION */}
            <div className="bg-[#f2f2f2]">
                <WhyChooseUsBookFlipSection />
            </div>

            {/* 9. MINI GAME (Interaction) */}
            <CoupleShootGame />

            {/* 10. CALL TO ACTION (Premium Wallpaper) */}
            <CameraCTASection />

            {/* 11. STATS SECTION (Clean Dark) */}
            <div className="bg-[#050505] border-t border-white/5">
                <WhyChooseUsSection />
            </div>

            {/* 12. EPIC HERO SCROLL (Final Impact) */}
            <HeroScroll tickerText="SHARTHAK STUDIO • BEST CINEMATOGRAPHY IN BIHAR • PREMIUM WEDDING FILMS • GAYA • PATNA • MUZAFFARPUR • CREATING TIMELESS CINEMATIC MEMORIES • UNMATCHED PRODUCTION QUALITY" />

            {/* 13. CRAFTED FOOTER */}
            <footer className="bg-black py-48 px-6 border-t border-white/[0.02] text-center overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-24 relative">
                    {/* Background faint logo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.01] pointer-events-none select-none tracking-tighter">STUDIO</div>

                    <div className="flex justify-center relative z-10">
                        <img src="/logo-white.png" alt="Sharthak Studio Logo" className="w-20 h-20 object-contain opacity-20 hover:opacity-100 transition-all duration-700" />
                    </div>

                    <h2 className="text-6xl md:text-[10rem] font-black tracking-tightest leading-none text-white uppercase italic relative z-10 transition-all hover:tracking-tighter cursor-default">
                        LET&apos;S CRAFT YOUR STORY
                    </h2>

                    <div className="flex flex-wrap justify-center gap-16 md:gap-32 relative z-10">
                        <div className="space-y-4">
                            <div className="text-[10px] tracking-[0.6em] text-white/10 uppercase font-black">Electronic Mail</div>
                            <div className="text-xl font-bold tracking-tight text-white/50 hover:text-white transition-colors">hello@sharthak.studio</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] tracking-[0.6em] text-white/10 uppercase font-black">Direct Line</div>
                            <div className="text-xl font-bold tracking-tight text-white/50 hover:text-white transition-colors">+91 98765 43210</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] tracking-[0.6em] text-white/10 uppercase font-black">Social Handle</div>
                            <div className="text-xl font-bold tracking-tight text-white/50 hover:text-white transition-colors">@sharthak_studio</div>
                        </div>
                    </div>

                    <div className="pt-40 space-y-10 relative z-10">
                        <button
                            onClick={handleAdminLogin}
                            className="px-8 py-3 border border-white/5 text-[9px] tracking-[0.8em] text-white/15 uppercase font-black hover:bg-white/5 hover:text-white transition-all rounded-full"
                        >
                            ADMIN LOGIN
                        </button>
                        <div className="space-y-4">
                            <div className="text-[8px] tracking-[1em] text-white/5 uppercase font-black">
                                © 2026 SHARTHAK STUDIO • EST. BIHAR • ALL RIGHTS RESERVED
                            </div>
                            <div className="text-[7px] tracking-[0.5em] text-white/5 uppercase font-medium">MADE WITH PASSION BY ANTIGRAVITY</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

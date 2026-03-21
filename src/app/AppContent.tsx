"use client";

import { useMemo, useEffect, useRef } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMediaContext } from "@/context/MediaContext";
import { MediaSlot } from "@/lib/mediaSlots";

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
            lerp: 0.1,
            duration: 1,
            smoothWheel: true,
            wheelMultiplier: 1.1,
            gestureOrientation: "vertical",
            touchMultiplier: 2,
            infinite: false,
        });

        // Expose lenis globally for components like HeroScroll to use
        (window as any).lenis = lenis;

        // Sync GSAP with Lenis RAF
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

    const featureLines = useMemo(() => [
        "Cinematic Quality", "Premium Editing", "Creative Shots", "Luxury Visuals",
        "HD Delivery", "Color Perfection", "Emotional Moments", "Natural Captures",
        "Professional Team", "Fast Delivery", "Trusted Service", "Detail Focused",
        "Storytelling Style", "Perfect Lighting", "Memorable Frames", "Smooth Reels",
    ], []);

    const { slots } = useMediaContext();

    const galleryTabs = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section.includes("GALLERY"));
        const set = new Set(gallerySlots.map((s: MediaSlot) => s.categoryLabel).filter(Boolean));
        // Fallback to defaults if no custom ones added
        if (set.size === 0) {
            ["WEDDING", "PRE-WEDDING", "CANDID", "MODEL SHOOT", "MATERNITY", "BABY SHOOT"].forEach(c => set.add(c));
        }
        return Array.from(set).map(cat => ({ label: cat as string }));
    }, [slots]);

    const galleryItems = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section.includes("GALLERY")).slice(0, 10);
        return gallerySlots.map((s: MediaSlot, i: number) => {
            const mod = i % 10;
            let col = "span 1";
            let row = "span 3";

            // 8-column desktop strategy for 10 items
            if (mod >= 8) {
                col = "span 4";
                row = "span 2";
            }

            return {
                id: s.id,
                seed: s.id,
                col,
                row,
                category: s.categoryLabel || "WEDDING"
            };
        });
    }, [slots]);

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
        <div className="min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
            <InfiniteStripsCTASection />

            <div className="h-6" /> {/* 24px Gap */}

            <GallerySection tabs={galleryTabs} items={galleryItems} />

            <div className="h-6" /> {/* 24px Gap */}

            <ExpertiseSection />

            <LatestWorkSection />

            <VideoEditingTimelineSection />

            <WhyChooseUsBookFlipSection />

            <CoupleShootGame />

            <CameraCTASection />

            <WhyChooseUsSection />

            {/* Footer */}
            <footer className="bg-black py-32 px-6 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="flex justify-center">
                        <img src="/logo-white.png" alt="Sharthak Studio Logo" className="w-24 h-24 object-contain" />
                    </div>
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
                    {/* Local SEO Cities */}
                    <div className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-black uppercase max-w-lg mx-auto leading-relaxed">
                        Serving Premium Cinematography in:<br />
                        GAYA • PATNA • MUZAFFARPUR • DEOGHAR • BIHAR
                    </div>
                    <div className="pt-24 space-y-6">
                        <button
                            onClick={handleAdminLogin}
                            className="text-[10px] tracking-[0.6em] text-white/20 uppercase font-medium hover:text-white/60 transition-colors"
                        >
                            ADMIN LOGIN
                        </button>
                        <div className="text-[10px] tracking-[0.6em] text-white/10 uppercase font-medium">
                            © 2026 SHARTHAK STUDIO. ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

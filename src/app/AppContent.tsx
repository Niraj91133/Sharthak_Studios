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
            lerp: 0.1,
            duration: 1,
            smoothWheel: true,
            wheelMultiplier: 1.1,
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
    console.log(`[AppContent] Render: ${slots.length} slots, ${blogs.length} blogs loaded.`);

    const featureLines = useMemo(() => [
        "Cinematic Quality", "Premium Editing", "Creative Shots", "Luxury Visuals",
        "HD Delivery", "Color Perfection", "Emotional Moments", "Natural Captures",
        "Professional Team", "Fast Delivery", "Trusted Service", "Detail Focused",
    ], []);

    const galleryTabs = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section && s.section.includes("GALLERY"));
        const set = new Set(gallerySlots.map((s: MediaSlot) => s.categoryLabel).filter(Boolean));
        if (set.size === 0) {
            ["WEDDING", "PRE-WEDDING", "CANDID", "MODEL SHOOT", "MATERNITY", "BABY SHOOT"].forEach(c => set.add(c));
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
        <div className="min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-white selection:text-black font-sans">
            <InfiniteStripsCTASection />

            {/* Feature Slider */}
            <section className="bg-white text-black overflow-hidden relative border-t border-white/10">
                <div className="flex animate-marquee whitespace-nowrap will-change-transform">
                    {[...featureLines, ...featureLines].map((line, i) => (
                        <span key={i} className="text-9xl font-black px-12 tracking-tighter opacity-10 hover:opacity-100 transition-opacity cursor-default">
                            {line.toUpperCase()}
                        </span>
                    ))}
                </div>
            </section>

            <GallerySection tabs={galleryTabs} items={galleryItems} />

            <ExpertiseSection />

            <LatestWorkSection />

            {/* Blog Highlight Section - NEW */}
            <section className="bg-white py-32 px-6">
                <div className="max-w-6xl mx-auto space-y-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black tracking-[0.4em] text-black/30 uppercase italic">STUDIO PERSPECTIVES</span>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-none text-black">STUDIO BLOGS</h2>
                        </div>
                        <Link href="/blog" className="px-12 py-5 bg-black text-white text-[11px] font-black tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">
                            VIEW ALL STORIES →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {latestBlogs.length > 0 ? latestBlogs.map(blog => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group block space-y-8">
                                <div className="aspect-[4/5] bg-black/5 overflow-hidden shadow-xl group-hover:shadow-2x-large transition-all">
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[9px] font-black tracking-[0.4em] text-black/30 uppercase">{blog.category}</span>
                                    <h3 className="text-2xl font-black leading-tight uppercase line-clamp-2 text-black">{blog.title}</h3>
                                    <p className="text-sm text-black/50 line-clamp-2 font-medium">{blog.excerpt}</p>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5">
                                <p className="text-black/20 font-black tracking-widest uppercase">STORY IN PROGRESS...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <VideoEditingTimelineSection />

            <WhyChooseUsBookFlipSection />

            <CoupleShootGame />

            <CameraCTASection />

            <WhyChooseUsSection />

            <HeroScroll title="STUDIO" eyebrow="SHARTHAK" />

            {/* Footer */}
            <footer className="bg-black py-40 px-6 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="flex justify-center">
                        <img src="/logo-white.png" alt="Sharthak Studio Logo" className="w-20 h-20 object-contain opacity-40 hover:opacity-100 transition-opacity" />
                    </div>
                    <h2 className="text-5xl md:text-9xl font-black tracking-tightest leading-none italic uppercase">CRAFTING CINEMA</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-32">
                        <div className="space-y-4">
                            <div className="text-[9px] tracking-[0.5em] text-white/20 uppercase font-black">Email</div>
                            <div className="text-xl font-bold tracking-tight">hello@sharthak.studio</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[9px] tracking-[0.5em] text-white/20 uppercase font-black">Call</div>
                            <div className="text-xl font-bold tracking-tight">+91 98765 43210</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[9px] tracking-[0.5em] text-white/20 uppercase font-black">Social</div>
                            <div className="text-xl font-bold tracking-tight">@sharthak_studio</div>
                        </div>
                    </div>

                    <div className="pt-32 space-y-8">
                        <button
                            onClick={handleAdminLogin}
                            className="text-[9px] tracking-[0.8em] text-white/10 uppercase font-black hover:text-white/40 transition-colors"
                        >
                            ADMIN ACCESS
                        </button>
                        <div className="text-[8px] tracking-[0.8em] text-white/5 uppercase font-black">
                            © 2026 SHARTHAK STUDIO • STUDIO BLOGS • BIHAR
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

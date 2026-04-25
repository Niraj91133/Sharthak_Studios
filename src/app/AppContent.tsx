"use client";

import { useMemo, useEffect, useState } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { useMediaContext } from "@/context/MediaContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { MediaSlot } from "@/lib/mediaSlots";
import Link from "next/link";
import HomeSeoSection from "@/components/seo/HomeSeoSection";

import MobileHeroSection from "@/components/MobileHeroSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import LeadCapturePopup from "@/components/LeadCapturePopup";
import ServiceCardsSection from "@/components/ServiceCardsSection";

// Lazy-loaded sections for performance and stability
const GallerySection = dynamic(() => import("@/components/GallerySection"));
const LatestWorkSection = dynamic(() => import("@/components/LatestWorkSection"));
const ExpertiseSection = dynamic(() => import("@/components/ExpertiseSection"));
const WhyChooseUsBookFlipSection = dynamic(() => import("@/components/WhyChooseUsBookFlipSection"));
const InfiniteStripsCTASection = dynamic(() => import("@/components/InfiniteStripsCTASection"));
const AboutMeSection = dynamic(() => import("@/components/AboutMeSection"));

export default function AppContent() {
    const [galleryTab, setGalleryTab] = useState("ALL");
    const { settings } = useSiteSettings();

    const handleServiceClick = (category: string) => {
        setGalleryTab(category.toUpperCase());
        const gallery = document.getElementById("gallery-section");
        if (gallery) {
            gallery.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        // Stop the browser from restoring the previous scroll position automatically
        if (typeof window !== "undefined" && window.history.scrollRestoration) {
            window.history.scrollRestoration = 'manual';
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            duration: 1.1,
            smoothWheel: true,
            wheelMultiplier: 1.1,
            gestureOrientation: "vertical",
            touchMultiplier: 2,
            infinite: false,
        });

        // Use a short delay to ensure dynamic layouts have settled before forcing scroll top
        const tid = setTimeout(() => {
            lenis.scrollTo(0, { immediate: true });
            window.scrollTo(0, 0);
        }, 300);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            clearTimeout(tid);
            lenis.destroy();
        };
    }, []);

    const { slots } = useMediaContext();

    const galleryTabs = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section.includes("GALLERY"));
        const categories = gallerySlots
            .map((s: MediaSlot) => s.categoryLabel)
            .filter(Boolean);

        const set = new Set(categories);
        const uniqueCats = Array.from(set).map((cat) => ({ label: (cat as string).toUpperCase() }));

        return [{ label: "ALL" }, ...uniqueCats];
    }, [slots]);

    const galleryItems = useMemo(() => {
        const gallerySlots = slots.filter((s: MediaSlot) => s.section.includes("GALLERY"));
        const sorted = gallerySlots
            .filter((s: MediaSlot) => Boolean(s.uploadedFile && s.useOnSite))
            .sort((a, b) => {
                const aTime = a.uploadedFile?.uploadedAt ? Date.parse(a.uploadedFile.uploadedAt) : 0;
                const bTime = b.uploadedFile?.uploadedAt ? Date.parse(b.uploadedFile.uploadedAt) : 0;
                return bTime - aTime;
            });

        const items: Array<{ seed: string; col: string; row: string; category: string }> = [];
        // Add items for their specific categories
        sorted.forEach((s: MediaSlot) => {
            const item = {
                seed: s.id,
                col: "span 2", // Placeholder, masonry ignores this
                row: "span 2",
                category: (s.categoryLabel || "WEDDING").toUpperCase()
            };
            items.push(item);

            // Also add a duplicate item for the "ALL" category
            items.push({ ...item, category: "ALL" });
        });

        return items;
    }, [slots]);

    return (
        <main id="main-content" className="min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
            <LeadCapturePopup />
            <MobileHeroSection />
            <section id="infinite-strips-section" className="hidden md:block">
                <InfiniteStripsCTASection />
            </section>

            <div className="h-6" />

            <ServiceCardsSection slots={slots} onCardClick={handleServiceClick} />

            <div className="h-6" />

            <GallerySection
                tabs={galleryTabs}
                items={galleryItems}
                activeTabOverride={galleryTab}
                onTabChange={setGalleryTab}
            />

            <div className="h-6" />

            <ExpertiseSection />

            <div className="h-6" />

            <LatestWorkSection />

            <div className="h-6" />

            <AboutMeSection />

            <div className="h-6" />

            <WhyChooseUsBookFlipSection />

            <div className="h-6" />

            <WhyChooseUsSection />

            <div className="h-6" />

            <HomeSeoSection />

            {/* Footer */}
            <footer className="bg-black py-32 px-6 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="flex justify-center">
                        <img src="/logo-white.png" alt="Sharthak Studio Logo" className="w-24 h-24 object-contain" />
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tightest leading-none">LET&apos;S CRAFT YOUR STORY</h2>

                    <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                        <div className="space-y-3 text-center">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Email Us</div>
                            <a href={settings.emailHref} className="text-2xl font-bold hover:text-white/60 transition-colors block">
                                {settings.email}
                            </a>
                        </div>
                        <div className="space-y-3 text-center">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Call or WhatsApp</div>
                            <a href={settings.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold hover:text-white/60 transition-colors block italic">
                                {settings.phoneDisplay}
                            </a>
                        </div>
                        <div className="space-y-3 text-center">
                            <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Instagram</div>
                            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold hover:text-white/60 transition-colors block italic">
                                {settings.instagramHandle}
                            </a>
                        </div>
                        {settings.googleBusinessProfileUrl ? (
                            <div className="space-y-3 text-center">
                                <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Google Business</div>
                                <a href={settings.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold hover:text-white/60 transition-colors block italic">
                                    View Profile
                                </a>
                            </div>
                        ) : null}
                    </div>

                    <div className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-black max-w-2xl mx-auto leading-relaxed space-y-4">
                        <div className="px-6 py-4 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p>{settings.name}, {settings.addressLine1}, {settings.city}, {settings.state} - {settings.postalCode}</p>
                            <p className="mt-2 text-white/40">{settings.founder} • {settings.phoneDisplay}</p>
                        </div>
                        <div>
                            Serving Premium Cinematography in:<br />
                            {settings.serviceAreas.join(" • ").toUpperCase()}
                        </div>
                    </div>

                    <div className="pt-24 space-y-6">
                        <div className="flex justify-center">
                            <Link
                                href="/admin"
                                className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-bold hover:text-white/50 transition-colors"
                            >
                                Admin Login
                            </Link>
                        </div>
                        <div className="text-[10px] tracking-[0.6em] text-white/10 uppercase font-medium">
                            © 2026 SHARTHAK STUDIO. ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </footer>

        </main>
    );
}

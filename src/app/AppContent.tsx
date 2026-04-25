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
        <div className="min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
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

            {/* Floating Contact Icons */}
            <div className="fixed bottom-10 right-6 z-[100] flex flex-col gap-4">
                <a
                    href={settings.phoneHref}
                    className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-2 border-white/20"
                    title="Call Us Now"
                    aria-label="Call Sharthak Studio"
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69a1 1 0 011 1V19a1 1 0 01-1 1A16 16 0 014 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.27 1.11l-2.2 2.2z" />
                    </svg>
                </a>
                <a
                    href={settings.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-2 border-white/20"
                    title="WhatsApp Us"
                    aria-label="Contact Sharthak Studio on WhatsApp"
                >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.768-5.764-5.768zm3.392 8.221c-.142.399-.715.763-1.141.817-.425.054-.863.074-2.127-.423-1.62-.64-2.618-2.285-2.697-2.392-.08-.107-.638-.85-.638-1.622 0-.773.401-1.15.543-1.311.142-.162.311-.202.414-.202.103 0 .207 0 .298.005.093.005.215-.035.337.26.123.295.421 1.026.458 1.101.037.074.062.161.013.259-.05.098-.074.162-.148.24-.074.08-.155.18-.222.24-.074.066-.151.139-.065.289.087.15.385.636.824 1.029.566.505 1.043.663 1.196.741.153.077.241.066.331-.036.09-.101.385-.453.488-.606.103-.153.207-.128.348-.077.142.05.901.425 1.056.503.155.077.259.116.298.181.04.066.04.381-.102.779zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.657 1.439 5.17L2 22l5.006-1.312C8.428 21.517 10.144 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.724 0-3.32-.485-4.664-1.317l-3.344.876.883-3.23C4.05 15.016 3.5 13.565 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" />
                    </svg>
                </a>
                <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-2 border-white/20"
                    title="Follow on Instagram"
                    aria-label="Visit Sharthak Studio Instagram"
                >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.079-1.338 1.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.337 1.35 20.667.935 19.877.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

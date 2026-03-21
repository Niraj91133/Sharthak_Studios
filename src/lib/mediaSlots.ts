export type MediaSlot = {
    id: string;
    section: string;
    frame: string;
    type: "image" | "video";
    currentSrc: string;
    uploadedFile?: {
        name: string;
        url: string;
        size: number;
        uploadedAt: string;
    };
    fallbackSrc: string;
    useOnSite: boolean;
    categoryLabel?: string;
};

export const mediaSlots: MediaSlot[] = [
    // 1. INFINITE STRIPS (Top of Landing Page)
    ...Array.from({ length: 12 }, (_, i) => {
        const isTop = i < 6;
        const side = isTop ? "top" : "bot";
        const slotNum = (i % 6) + 1;
        return {
            id: `strip-${side}-${String(slotNum).padStart(2, "0")}`,
            section: "01. INFINITE STRIPS",
            frame: `${isTop ? "Top" : "Bottom"} Strip - Slot ${slotNum}`,
            type: "image" as const,
            currentSrc: `https://picsum.photos/seed/strip-${i}/600/600`,
            fallbackSrc: `https://picsum.photos/seed/strip-${i}/600/600`,
            useOnSite: false,
        };
    }),

    // 2. WHY CHOOSE US
    ...Array.from({ length: 20 }, (_, i) => {
        const pageNum = Math.floor(i / 4) + 1;
        const itemNum = (i % 4) + 1;
        const isHero = itemNum === 1;
        return {
            id: `why-choose-us-p${pageNum}-${isHero ? "hero" : `tile-${itemNum - 1}`}`,
            section: "02. WHY CHOOSE US (BOOK FLIP)",
            frame: `Page ${pageNum} - ${isHero ? "Hero Image" : `Small Tile ${itemNum - 1}`}`,
            type: "image" as const,
            currentSrc: `https://picsum.photos/seed/why-${i}/1200/1600`,
            fallbackSrc: `https://picsum.photos/seed/why-${i}/1200/1600`,
            useOnSite: false,
        };
    }),

    // 3. GALLERY SECTION
    ...Array.from({ length: 18 }, (_, i) => ({
        id: `gal-${String(i + 1).padStart(2, "0")}`,
        section: "03. THE COLLECTION (GALLERY)",
        frame: `Gallery Item ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/gal-${String(i + 1).padStart(2, "0")}/1200/1200`,
        fallbackSrc: `https://picsum.photos/seed/gal-${String(i + 1).padStart(2, "0")}/1200/1200`,
        useOnSite: false,
    })),

    // 4. LATEST WORK
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `latest-work-${String(i + 1).padStart(2, "0")}`,
        section: "04. LATEST WORK",
        frame: `Portfolio Slot ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/latest-${i + 1}/800/1000`,
        fallbackSrc: `https://picsum.photos/seed/latest-${i + 1}/800/1000`,
        useOnSite: false,
    })),

    // 5. EXPERTISE SECTION
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `expertise-${String(i + 1).padStart(2, "0")}`,
        section: "05. CHOOSE YOUR EXPERTISE",
        frame: `Expertise Card ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/expertise-${i + 1}/800/1000`,
        fallbackSrc: `https://picsum.photos/seed/expertise-${i + 1}/800/1000`,
        useOnSite: false,
    })),

    // 6. VIDEO TIMELINE
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `C221${i}`,
        section: "06. VIDEO EDITING TIMELINE",
        frame: `Cinematic Clip ${i + 1}`,
        type: "video" as const,
        currentSrc: "https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-a-camera-34644-large.mp4",
        fallbackSrc: "https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-a-camera-34644-large.mp4",
        useOnSite: false,
    })),

    // 7. CAMERA CTA
    {
        id: "camera-cta-bg",
        section: "07. CAMERA CALL TO ACTION",
        frame: "Background Wallpaper",
        type: "image",
        currentSrc: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000",
        fallbackSrc: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000",
        useOnSite: false,
    },

    // 8. HERO SCROLL (Bottom)
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `hero-slide-${String(i + 1).padStart(2, "0")}`,
        section: "08. MAIN HERO SCROLL (BOTTOM)",
        frame: `Hero Slide ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
        fallbackSrc: `https://picsum.photos/seed/sharthak-${String(i + 1).padStart(2, "0")}/2400/1600`,
        useOnSite: false,
        categoryLabel: ["PHOTOGRAPHY", "PHOTO EDITING", "VIDEO EDITING", "CINEMATOGRAPHY"][i % 4],
    })),

    // 9. ABOUT ME
    {
        id: "about-me-photo",
        section: "09. ABOUT ME SECTION",
        frame: "Founder Profile Photo",
        type: "image",
        currentSrc: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000",
        fallbackSrc: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000",
        useOnSite: false,
    },
];

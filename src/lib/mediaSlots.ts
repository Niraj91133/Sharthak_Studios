export type MediaSlot = {
    id: string;
    section: string;
    frame: string;
    type: "image" | "video" | "text";
    currentSrc: string;
    uploadedFile?: {
        name: string;
        url: string;
        size: number;
        uploadedAt: string;
    };
    fallbackSrc: string;
    useOnSite: boolean;
    orderIndex?: number;
    categoryLabel?: string;
    textValue?: string; // e.g. "12+"
    textContent?: string; // e.g. "YEARS OF LEGACY"
};

export const mediaSlots: MediaSlot[] = [
    // 00. SERVICE CATEGORIES (Horizontal Cards)
    ...Array.from({ length: 8 }, (_, i) => ({
        id: `service-card-${String(i + 1).padStart(2, "0")}`,
        section: "00. SERVICE CATEGORIES",
        frame: `Service Card ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/service-${i}/800/1000`,
        fallbackSrc: `https://picsum.photos/seed/service-${i}/800/1000`,
        useOnSite: true,
        orderIndex: i,
        categoryLabel: ["WEDDING", "PRE-WEDDING", "BIRTHDAY", "PRODUCT", "BABY", "VIDEOGRAPHY", "REELS", "WEDDING FILMS"][i] || "NEW CATEGORY",
    })),

    // 01. MOBILE HERO SECTION
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `mobile-hero-top-${String(i + 1).padStart(2, "0")}`,
        section: "01. MOBILE HERO SECTION",
        frame: `Top Strip - Image ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/m-hero-top-${i}/600/400`,
        fallbackSrc: `https://picsum.photos/seed/m-hero-top-${i}/600/400`,
        useOnSite: true,
        orderIndex: i,
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `mobile-hero-bot-${String(i + 1).padStart(2, "0")}`,
        section: "01. MOBILE HERO SECTION",
        frame: `Bottom Strip - Image ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/m-hero-bot-${i}/600/400`,
        fallbackSrc: `https://picsum.photos/seed/m-hero-bot-${i}/600/400`,
        useOnSite: true,
        orderIndex: i + 6,
    })),

    // 02. INFINITE STRIPS (DESKTOP)
    ...Array.from({ length: 12 }, (_, i) => {
        const isTop = i < 6;
        const side = isTop ? "top" : "bot";
        const slotNum = (i % 6) + 1;
        return {
            id: `strip-${side}-${String(slotNum).padStart(2, "0")}`,
            section: "02. INFINITE STRIPS (DESKTOP)",
            frame: `${isTop ? "Top" : "Bottom"} Strip - Slot ${slotNum}`,
            type: "image" as const,
            currentSrc: `https://picsum.photos/seed/strip-${i}/600/600`,
            fallbackSrc: `https://picsum.photos/seed/strip-${i}/600/600`,
            useOnSite: true,
            orderIndex: i,
        };
    }),

    // 03. THE COLLECTION (GALLERY)
    ...Array.from({ length: 18 }, (_, i) => ({
        id: `gal-${String(i + 1).padStart(2, "0")}`,
        section: "03. THE COLLECTION (GALLERY)",
        frame: `Gallery Item ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/gal-${String(i + 1).padStart(2, "0")}/1200/1200`,
        fallbackSrc: `https://picsum.photos/seed/gal-${String(i + 1).padStart(2, "0")}/1200/1200`,
        useOnSite: true,
        orderIndex: i,
    })),

    // 04. CHOOSE YOUR EXPERTISE
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `expertise-${String(i + 1).padStart(2, "0")}`,
        section: "04. CHOOSE YOUR EXPERTISE",
        frame: `Expertise Slide ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/exp-${i}/1600/1200`,
        fallbackSrc: `https://picsum.photos/seed/exp-${i}/1600/1200`,
        useOnSite: true,
        orderIndex: i,
    })),

    // 05. INSTAGRAM FEED (LATEST WORK)
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `reel-${String(i + 1).padStart(2, "0")}`,
        section: "05. INSTAGRAM FEED (LATEST WORK)",
        frame: `Instagram Reel ${i + 1}`,
        type: "image" as const,
        currentSrc: `https://picsum.photos/seed/reel-${i}/800/1000`,
        fallbackSrc: `https://picsum.photos/seed/reel-${i}/800/1000`,
        useOnSite: true,
        orderIndex: i,
    })),

    // 06. ABOUT ME SECTION
    {
        id: "about-me-photo",
        section: "06. ABOUT ME SECTION",
        frame: "Founder Portrait Photo",
        type: "image",
        currentSrc: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000",
        fallbackSrc: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000",
        useOnSite: true,
        orderIndex: 0,
    },

    // 07. WHY CHOOSE US (BOOK FLIP)
    ...Array.from({ length: 20 }, (_, i) => {
        const pageNum = Math.floor(i / 4) + 1;
        const itemNum = (i % 4) + 1;
        const isHero = itemNum === 1;
        return {
            id: `why-choose-us-p${pageNum}-${isHero ? "hero" : `tile-${itemNum - 1}`}`,
            section: "07. WHY CHOOSE US (BOOK FLIP)",
            frame: `Page ${pageNum} - ${isHero ? "Hero Image" : `Small Tile ${itemNum - 1}`}`,
            type: "image" as const,
            currentSrc: `https://picsum.photos/seed/why-${i}/1200/1600`,
            fallbackSrc: `https://picsum.photos/seed/why-${i}/1200/1600`,
            useOnSite: true,
            orderIndex: i,
        };
    }),

    // 08. STUDIO METRICS
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `metric-${i + 1}`,
        section: "08. STUDIO METRICS",
        frame: `Metric Card ${i + 1}`,
        type: "text" as const,
        currentSrc: "",
        fallbackSrc: "",
        useOnSite: true,
        orderIndex: i,
        textValue: ["12+", "750+", "3200+", "99%"][i],
        textContent: ["YEARS OF LEGACY", "STORIES CAPTURED", "REELS PRODUCED", "CLIENT TRUST"][i],
    })),
];

"use client";

import { motion } from "framer-motion";
import { MediaSlot } from "@/lib/mediaSlots";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";

interface ServiceCardsSectionProps {
    slots: MediaSlot[];
    onCardClick: (category: string) => void;
}

export default function ServiceCardsSection({ slots, onCardClick }: ServiceCardsSectionProps) {
    // 1. Get all unique categories from Gallery that have images
    const gallerySlots = slots.filter(s => s.section.includes("GALLERY") && s.uploadedFile && s.useOnSite);
    const uniqueCategories = Array.from(new Set(gallerySlots.map(s => (s.categoryLabel || "WEDDING").toUpperCase())));

    // 2. Get specific Service Card slots
    const serviceCardSlots = slots.filter(s => s.section === "00. SERVICE CATEGORIES");

    // 3. Map each unique category to a card data object
    const cards = uniqueCategories.map(category => {
        // Find if there's a specific card for this category
        const specificSlot = serviceCardSlots.find(s => s.categoryLabel?.toUpperCase() === category && s.uploadedFile && s.useOnSite);

        // Inherit first image from gallery if no specific card slot is found
        const fallbackGallerySlot = gallerySlots.find(s => (s.categoryLabel || "WEDDING").toUpperCase() === category);

        const previewSlot = specificSlot || fallbackGallerySlot;
        const imgSrc = previewSlot?.uploadedFile ? normalizeMediaUrl(previewSlot.uploadedFile.url) : (previewSlot?.fallbackSrc || "");

        return {
            category,
            imgSrc,
            id: previewSlot?.id || `dynamic-${category}`
        };
    }).filter(c => c.imgSrc); // Only show categories that have at least one image

    return (
        <section className="bg-black py-32">
            <div className="max-w-[1400px] mx-auto px-6 mb-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase text-left w-full">
                        PHOTOGRAPHY / <span className="text-white/30">SERVICES</span>
                    </h2>
                    <div className="hidden md:flex gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 cursor-default">←</div>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 cursor-default">→</div>
                    </div>
                </div>
            </div>

            <div className="relative w-full">
                <div className="flex gap-6 overflow-x-auto no-scrollbar px-6 md:px-[calc((100vw-1400px)/2+24px)] snap-x pb-24">
                    {cards.map((card) => (
                        <motion.button
                            key={card.id}
                            whileHover={{ y: -15, scale: 1.02 }}
                            onClick={() => onCardClick(card.category)}
                            className="flex-shrink-0 w-[260px] md:w-[320px] aspect-[10/14] rounded-[32px] overflow-hidden group relative bg-neutral-900 border border-white/5 snap-start shadow-2xl"
                        >
                            <img
                                src={card.imgSrc}
                                alt={card.category}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-left">
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-3 block">EXPLORE</span>
                                <h3 className="text-xl md:text-2xl font-black tracking-tightest uppercase text-white leading-tight">
                                    {card.category}
                                </h3>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
}

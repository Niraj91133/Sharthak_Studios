"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { MediaSlot } from "@/lib/mediaSlots";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";

interface ServiceCardsSectionProps {
    slots: MediaSlot[];
    onCardClick: (category: string) => void;
}

export default function ServiceCardsSection({ slots, onCardClick }: ServiceCardsSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Get all unique categories from Gallery that have images
    const gallerySlots = slots.filter(s => s.section.includes("GALLERY") && s.uploadedFile && s.useOnSite);
    const uniqueCategories = Array.from(new Set(gallerySlots.map(s => (s.categoryLabel || "WEDDING").toUpperCase())));

    // 2. Get specific Service Card slots
    const serviceCardSlots = slots.filter(s => s.section === "00. SERVICE CATEGORIES");

    // 3. Map each unique category to a card data object
    const cards = uniqueCategories.map(category => {
        const specificSlot = serviceCardSlots.find(s => s.categoryLabel?.toUpperCase() === category && s.uploadedFile && s.useOnSite);
        const fallbackGallerySlot = gallerySlots.find(s => (s.categoryLabel || "WEDDING").toUpperCase() === category);
        const previewSlot = specificSlot || fallbackGallerySlot;
        const imgSrc = previewSlot?.uploadedFile ? normalizeMediaUrl(previewSlot.uploadedFile.url) : (previewSlot?.fallbackSrc || "");

        return {
            category,
            imgSrc,
            id: previewSlot?.id || `dynamic-${category}`
        };
    }).filter(c => c.imgSrc);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === 'left' ? -400 : 400;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <section className="bg-black py-10 md:py-24 pb-0 relative">
            <div className="relative w-full group/section">
                {/* Floating Navigation Buttons (Centered Vertically) */}
                <div className="absolute inset-y-0 left-0 z-10 hidden md:flex items-center pl-4 pointer-events-none">
                    <button
                        onClick={() => scroll('left')}
                        className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-all pointer-events-auto shadow-2xl"
                    >
                        ←
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 z-10 hidden md:flex items-center pr-4 pointer-events-none">
                    <button
                        onClick={() => scroll('right')}
                        className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-all pointer-events-auto shadow-2xl"
                    >
                        →
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-10 md:px-16 snap-x pb-24"
                >
                    {cards.map((card) => (
                        <motion.button
                            key={card.id}
                            whileHover={{ y: -10 }}
                            onClick={() => onCardClick(card.category)}
                            className="flex-shrink-0 w-[65vw] sm:w-[300px] md:w-[350px] aspect-[10/14] rounded-[24px] md:rounded-[32px] overflow-hidden group relative bg-neutral-900 border border-white/5 snap-center shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={card.imgSrc}
                                alt={card.category}
                                className="absolute inset-0 w-full h-full object-cover grayscale-0 transition-all duration-1000 group-hover:grayscale pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-left">
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-3 block">EXPLORE</span>
                                <h3 className="text-xl md:text-3xl font-black tracking-tightest uppercase text-white leading-tight">
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

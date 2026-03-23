"use client";

import { motion } from "framer-motion";
import { MediaSlot } from "@/lib/mediaSlots";
import { normalizeMediaUrl } from "@/lib/normalizeMediaUrl";

interface ServiceCardsSectionProps {
    slots: MediaSlot[];
    onCardClick: (category: string) => void;
}

export default function ServiceCardsSection({ slots, onCardClick }: ServiceCardsSectionProps) {
    const cardSlots = slots.filter(s => s.section === "00. SERVICE CATEGORIES" && s.useOnSite);

    return (
        <section className="bg-black py-20 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 mb-12 flex items-center justify-between">
                <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase">
                    PHOTOGRAPHY / <span className="text-white/30">SERVICES</span>
                </h2>
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 cursor-pointer hover:bg-white hover:text-black transition-all">←</div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 cursor-pointer hover:bg-white hover:text-black transition-all">→</div>
                </div>
            </div>

            <div className="relative w-full">
                <div className="flex gap-6 overflow-x-auto no-scrollbar px-6 md:px-[calc((100vw-1400px)/2+24px)] snap-x pb-10">
                    {cardSlots.map((slot) => {
                        const imgSrc = slot.uploadedFile ? normalizeMediaUrl(slot.uploadedFile.url) : slot.fallbackSrc;

                        return (
                            <motion.button
                                key={slot.id}
                                whileHover={{ y: -10 }}
                                onClick={() => onCardClick(slot.categoryLabel || "")}
                                className="flex-shrink-0 w-[240px] md:w-[280px] aspect-[3/4] rounded-[24px] overflow-hidden group relative bg-neutral-900 border border-white/5 snap-center"
                            >
                                <img
                                    src={imgSrc}
                                    alt={slot.categoryLabel}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-left">
                                    <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase mb-2 block">EXPLORE</span>
                                    <h3 className="text-lg md:text-xl font-black tracking-tightest uppercase text-white leading-tight">
                                        {slot.categoryLabel}
                                    </h3>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

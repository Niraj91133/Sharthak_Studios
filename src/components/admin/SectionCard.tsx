"use client";

import React, { useState } from "react";
import { MediaSlot } from "@/lib/mediaSlots";
import MediaSlotCard from "@/components/admin/MediaSlotCard";
import MediaStrip from "@/components/admin/MediaStrip";

import { useMediaContext } from "@/context/MediaContext";
import { generateSlotId } from "@/lib/generateSlotId";

interface SectionCardProps {
    title: string;
    slots: MediaSlot[];
    accentColor: string;
}

export default function SectionCard({ title, slots, accentColor }: SectionCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { addSlot } = useMediaContext();
    const uploadedCount = slots.filter(s => s.uploadedFile).length;

    const dynamicSections = [
        "01. MOBILE HERO SECTION",
        "02. INFINITE STRIPS (DESKTOP)",
        "04. CHOOSE YOUR EXPERTISE",
        "05. INSTAGRAM FEED (LATEST WORK)",
    ];

    const isDynamic = dynamicSections.includes(title);

    const handleAddSlot = async () => {
        const id = generateSlotId("extra-dyn-");
        try {
            await addSlot({
                id,
                section: title,
                frame: `Extra ${title.split(' ')[1] || 'Item'}`,
                type: "image",
                currentSrc: "",
                fallbackSrc: "",
                useOnSite: true,
                orderIndex: slots.length,
            });
        } catch {
            alert("Failed to add slot");
        }
    };

    return (
        <div className={`bg-[#0f0f0f] border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? "ring-1 ring-white/10" : "hover:border-white/10"}`}>
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full px-6 py-5 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
                    <div>
                        <h3 className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                            {title}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/20 mt-0.5">
                            {slots.length} Total slots • {uploadedCount} Active
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {uploadedCount > 0 && (
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-white/40">
                            {Math.round((uploadedCount / slots.length) * 100)}% COMPLETE
                        </span>
                    )}
                    <svg
                        className={`w-5 h-5 text-white/20 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Content */}
            <div
                className={[
                    "grid transition-all duration-500 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100 pointer-events-auto" : "grid-rows-[0fr] opacity-0 pointer-events-none",
                ].join(" ")}
            >
                <div className="overflow-hidden">
                    <div className="px-6 pb-8 pt-2 space-y-6">
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${title === "Gallery Section" ? "lg:grid-cols-3" : ""}`}>
                            {slots.map((slot) => (
                                <MediaSlotCard key={slot.id} slot={slot} />
                            ))}

                            {isDynamic && (
                                <button
                                    onClick={handleAddSlot}
                                    className="aspect-[4/3] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-white/30 hover:bg-white/5 transition-all text-white/30 hover:text-white/60"
                                >
                                    <span className="text-xl">+</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest">Add extra item</span>
                                </button>
                            )}
                        </div>

                        <MediaStrip section={title} />
                    </div>
                </div>
            </div>
        </div>
    );
}

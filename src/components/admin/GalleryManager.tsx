"use client";

import React, { useState, useMemo, useRef } from "react";
import { useMediaContext } from "@/context/MediaContext";
import MediaSlotCard from "@/components/admin/MediaSlotCard";

export default function GalleryManager() {
    const { slots, addSlot, deleteSlot, uploadFile } = useMediaContext();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isBatchUploading, setIsBatchUploading] = useState(false);
    const batchInputRef = useRef<HTMLInputElement>(null);

    const gallerySlots = useMemo(() =>
        slots.filter(s => s.section && s.section.includes("GALLERY")),
        [slots]);

    const categories = useMemo(() => {
        const set = new Set(gallerySlots.map(s => s.categoryLabel).filter(Boolean));
        if (set.size === 0) {
            ["WEDDING", "PRE-WEDDING", "CANDID", "MODEL SHOOT", "MATERNITY", "BABY SHOOT"].forEach(c => set.add(c));
        }
        return Array.from(set) as string[];
    }, [gallerySlots]);

    const activeCat = activeCategory || categories[0] || "WEDDING";

    const activeSlots = useMemo(() =>
        gallerySlots.filter(s => s.categoryLabel === activeCat),
        [gallerySlots, activeCat]);

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const cat = newCategoryName.trim().toUpperCase();
        setActiveCategory(cat);
        setNewCategoryName("");
        setIsAddingCategory(false);

        const id = `gal-dyn-${Date.now()}`;
        addSlot({
            id,
            section: "03. THE COLLECTION (GALLERY)",
            frame: "First Item",
            type: "image",
            currentSrc: "",
            fallbackSrc: "",
            useOnSite: true,
            categoryLabel: cat
        });
    };

    const handleAddImage = (category: string) => {
        const id = `gal-dyn-${Date.now()}`;
        addSlot({
            id,
            section: "03. THE COLLECTION (GALLERY)",
            frame: "Gallery Item",
            type: "image",
            currentSrc: "",
            fallbackSrc: "",
            useOnSite: true,
            categoryLabel: category
        });
    };

    const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsBatchUploading(true);
        const fileArray = Array.from(files);

        try {
            for (const file of fileArray) {
                const id = `gal-dyn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

                // 1. Create the slot first
                await addSlot({
                    id,
                    section: "03. THE COLLECTION (GALLERY)",
                    frame: "Gallery Item",
                    type: "image",
                    currentSrc: "",
                    fallbackSrc: "",
                    useOnSite: true,
                    categoryLabel: activeCat
                });

                // 2. Upload the file
                await uploadFile(id, file);
            }
        } catch (error) {
            console.error("Batch upload failed:", error);
            alert("Some files failed to upload.");
        } finally {
            setIsBatchUploading(false);
            if (batchInputRef.current) batchInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${activeCat === cat
                                ? "bg-white text-black"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    {isAddingCategory ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] text-white outline-none"
                                placeholder="CATEGORY NAME..."
                                autoFocus
                            />
                            <button onClick={handleAddCategory} className="text-green-500 font-bold text-xs p-2">✓</button>
                            <button onClick={() => setIsAddingCategory(false)} className="text-red-500 font-bold text-xs p-2">✕</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingCategory(true)}
                            className="px-4 py-2 rounded-full border border-dashed border-white/20 text-white/40 text-[10px] font-bold hover:border-white/40 hover:text-white"
                        >
                            + ADD CATEGORY
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={batchInputRef}
                        onChange={handleBatchUpload}
                    />
                    <button
                        onClick={() => batchInputRef.current?.click()}
                        disabled={isBatchUploading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${isBatchUploading
                            ? "bg-white/20 text-white/40 cursor-wait"
                            : "bg-white text-black hover:scale-105 active:scale-95"
                            }`}
                    >
                        {isBatchUploading ? (
                            <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        {isBatchUploading ? "UPLOADING ALL..." : `Upload Multiple to ${activeCat}`}
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeSlots.map((slot) => (
                        <div key={slot.id} className="relative group">
                            <MediaSlotCard slot={slot} allCategories={categories} />
                            <button
                                onClick={() => {
                                    if (confirm("Delete this image from gallery?")) deleteSlot(slot.id);
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[14px] opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl border-2 border-white/20"
                                title="Delete Image"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {!isBatchUploading && (
                        <button
                            onClick={() => handleAddImage(activeCat)}
                            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-white/30 hover:bg-white/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl text-white/20">+</span>
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-white/20 uppercase text-center px-4">Add Single Slot</p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

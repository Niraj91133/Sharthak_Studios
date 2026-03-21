"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useMediaContext } from "@/context/MediaContext";
import SectionCard from "@/components/admin/SectionCard";
import GlobalMediaPanel from "@/components/admin/GlobalMediaPanel";
import GalleryManager from "@/components/admin/GalleryManager";
import BlogManager from "@/components/admin/BlogManager";

export default function AdminDashboard() {
    const { slots } = useMediaContext();
    const [showGlobalMedia, setShowGlobalMedia] = useState(false);

    const sections = useMemo(() => {
        const grouped = slots.reduce((acc, slot) => {
            if (!acc[slot.section]) acc[slot.section] = [];
            acc[slot.section].push(slot);
            return acc;
        }, {} as Record<string, typeof slots>);

        const colors = [
            "#FF3D00",
            "#FFEA00",
            "#00E676",
            "#00B0FF",
            "#D500F9",
            "#FF5252",
            "#7C4DFF",
            "#00E5FF",
        ];

        return Object.keys(grouped).map((title, i) => ({
            title,
            slots: grouped[title],
            accentColor: colors[i % colors.length],
        }));
    }, [slots]);

    return (
        <div className="min-h-screen text-white font-sans pb-24 md:pb-12 bg-[#050505]">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-black tracking-[0.3em] text-white">
                            SHARTHAK STUDIO CMS
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowGlobalMedia(true)}
                            className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all hidden md:flex items-center gap-2"
                        >
                            Library
                        </button>

                        <Link
                            href="/blog"
                            target="_blank"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            View Blogs →
                        </Link>

                        <Link
                            href="/"
                            className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            View Site →
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
                    {/* Sidebar - Desktop Only */}
                    <aside className="hidden md:block space-y-8 sticky top-32 h-fit">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase ml-2">
                                Sections
                            </p>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.title}
                                        onClick={() => {
                                            document.getElementById(section.title)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-bold text-white/40 hover:text-white transition-all flex items-center gap-3"
                                    >
                                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: section.accentColor }} />
                                        {section.title}
                                    </button>
                                ))}
                                <button
                                    onClick={() => document.getElementById('BLOG-EDITOR')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-bold text-white/40 hover:text-white transition-all flex items-center gap-3"
                                >
                                    <div className="w-1 h-1 rounded-full bg-white" />
                                    09. STUDIO BLOGS
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Section List */}
                    <div className="space-y-16">
                        <div className="space-y-4">
                            {sections.map((section) => (
                                section.title.includes("GALLERY") ? (
                                    <div key={section.title} className="space-y-6" id={section.title}>
                                        <div className="flex items-center gap-2 px-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: section.accentColor }} />
                                            <h3 className="text-[11px] font-black tracking-[0.4em] uppercase text-white/40">{section.title}</h3>
                                        </div>
                                        <GalleryManager />
                                    </div>
                                ) : (
                                    <div key={section.title} id={section.title}>
                                        <SectionCard
                                            title={section.title}
                                            slots={section.slots}
                                            accentColor={section.accentColor}
                                        />
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Blog Management Section */}
                        <div className="pt-24 border-t border-white/10 space-y-8" id="BLOG-EDITOR">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tightest uppercase">09. STUDIO BLOGS</h3>
                                    <p className="text-xs text-white/40 mt-2">Manage your cinematic articles and updates.</p>
                                </div>
                            </div>
                            <BlogManager />
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Media Library Modal */}
            {showGlobalMedia && (
                <GlobalMediaPanel onClose={() => setShowGlobalMedia(false)} />
            )}
        </div>
    );
}

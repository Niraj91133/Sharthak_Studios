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
            "#FF3D00", // Hero Scroll
            "#FFEA00", // Camera CTA
            "#00E676", // Gallery Section
            "#00B0FF", // Latest Work
            "#D500F9", // Expertise Section
            "#FF5252", // Video Editing Timeline
            "#7C4DFF", // Why Choose Us
            "#00E5FF", // Infinite Strips CTA
        ];

        return Object.keys(grouped).map((title, i) => ({
            title,
            slots: grouped[title],
            accentColor: colors[i % colors.length],
        }));
    }, [slots]);

    return (
        <div className="min-h-screen text-white font-sans pb-24 md:pb-12">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-black tracking-[0.3em] text-white">
                            SHARTHAK STUDIO CMS
                        </h1>
                        <span className="hidden md:block px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-white/30 uppercase tracking-widest">
                            v2.0 Stable
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowGlobalMedia(true)}
                            className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all hidden md:flex items-center gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                            Library
                        </button>

                        <Link
                            href="/blog"
                            target="_blank"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Journal →
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
                                    onClick={() => document.getElementById('THE-JOURNAL')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-bold text-white/40 hover:text-white transition-all flex items-center gap-3"
                                >
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    09. THE JOURNAL
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Section List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tightest">DASHBOARD</h2>
                                <p className="text-xs text-white/40 mt-1">Manage every pixel of your brand narrative.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sections.map((section) => (
                                section.title.includes("GALLERY") ? (
                                    <div key={section.title} className="space-y-4 pt-10" id={section.title}>
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
                        <div className="pt-24 border-t border-white/5 space-y-8" id="THE-JOURNAL">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tightest uppercase">09. THE JOURNAL / BLOG</h3>
                                    <p className="text-xs text-white/40 mt-1">Your cinematic storytelling hub.</p>
                                </div>
                                <Link
                                    href="/blog"
                                    target="_blank"
                                    className="px-6 py-2 border border-white/20 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all"
                                >
                                    View Live Blog →
                                </Link>
                            </div>
                            <BlogManager />
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
                <button
                    onClick={() => setShowGlobalMedia(true)}
                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                </button>
            </div>

            {/* Global Media Library Modal */}
            {showGlobalMedia && (
                <GlobalMediaPanel onClose={() => setShowGlobalMedia(false)} />
            )}
        </div>
    );
}

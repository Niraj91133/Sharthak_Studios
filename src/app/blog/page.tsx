"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MediaProvider, useMediaContext } from "@/context/MediaContext";

function BlogListingContent() {
    const { blogs, isLoading } = useMediaContext();
    const [activeCategory, setActiveCategory] = useState("ALL");

    const categories = ["ALL", "TECHNIQUE", "LOCATIONS", "TRENDS", "TIPS"];

    const filteredBlogs = useMemo(() => {
        if (activeCategory === "ALL") return blogs;
        return blogs.filter(b => b.category === activeCategory);
    }, [blogs, activeCategory]);

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-black/10 tracking-widest font-black uppercase italic text-xs">Studio Blogs Loading...</div>;

    return (
        <div className="min-h-screen bg-white text-[#111] selection:bg-black selection:text-white font-sans">
            {/* Centered Logo Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 h-16 flex items-center shadow-sm px-6">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
                        ← <span className="hidden md:inline">HOME</span>
                    </Link>

                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 active:scale-95 transition-all">
                        <div className="bg-black text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-black rounded-full" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">SHARTHAK STUDIO</span>
                        </div>
                    </Link>

                    <div className="hidden md:block w-32" />
                </div>
            </nav>

            {/* Main Hero - Panoramic & Sharp */}
            <header className="pt-24 px-6 md:px-10">
                <div className="max-w-7xl mx-auto">
                    {filteredBlogs.length > 0 ? (
                        <Link href={`/blog/${filteredBlogs[0].id}`} className="group relative block w-full h-[350px] md:h-[550px] bg-black overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-none">
                            <img
                                src={filteredBlogs[0].image}
                                alt={filteredBlogs[0].title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 md:p-20">
                                <div className="max-w-4xl space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">FEATURED POST</span>
                                        <div className="h-px w-10 bg-white/20" />
                                    </div>
                                    <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-[0.9] text-white uppercase italic">
                                        {filteredBlogs[0].title}
                                    </h1>
                                    <p className="text-xs md:text-sm text-white/50 max-w-xl font-medium tracking-tight leading-relaxed line-clamp-2">
                                        {filteredBlogs[0].excerpt}
                                    </p>
                                    <div className="pt-6">
                                        <div className="inline-flex h-12 px-10 items-center justify-center border border-white/20 bg-white text-black text-[10px] font-black uppercase tracking-widest group-hover:bg-transparent group-hover:text-white transition-all rounded-none">
                                            READ STORY
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="w-full h-[300px] bg-[#f9f9f9] flex items-center justify-center text-black/10 font-black tracking-[0.4em] uppercase italic text-xs">NO STORIES PUBLISHED.</div>
                    )}
                </div>
            </header>

            {/* Filter Tabs - Sticky or Fixed-style */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 mt-24 mb-16">
                <div className="border-b border-black/5 pb-10">
                    <div className="flex items-center gap-12 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap text-[11px] font-black tracking-[0.4em] uppercase transition-all relative py-2 ${activeCategory === cat
                                    ? "text-black after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-black"
                                    : "text-black/30 hover:text-black/60"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Grid - Sharp Edges & Minimalist Typography */}
            <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
                {filteredBlogs.length === 0 ? (
                    <div className="py-24 text-center border border-black/5 rounded-none">
                        <p className="text-black/10 font-black tracking-widest uppercase text-[10px]">No stories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                        {filteredBlogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group block space-y-8">
                                <div className="aspect-[4/5] bg-black/5 relative overflow-hidden transition-all duration-700 rounded-none">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 text-[8px] font-black tracking-[0.4em] uppercase">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] text-black/20 font-bold uppercase tracking-[0.4em]">
                                            {new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <div className="w-1 h-1 bg-black/10 rounded-full" />
                                        <span className="text-[9px] text-black/20 font-bold uppercase tracking-[0.4em]">5 MIN READ</span>
                                    </div>
                                    <h2 className="text-2xl font-black leading-tight group-hover:text-black/50 transition-colors uppercase tracking-tight line-clamp-2 italic">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-black/40 leading-relaxed font-medium line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                    <div className="pt-2 inline-flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase text-black group-hover:gap-6 transition-all underline underline-offset-8 decoration-black/10">
                                        VIEW POST
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Simple Studio Footer */}
            <footer className="mt-40 border-t border-black/5 py-32 bg-white text-black text-center px-6">
                <div className="max-w-2xl mx-auto space-y-10">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tightest uppercase italic leading-none opacity-10">SHARTHAK STUDIO • JOURNAL</h2>
                    <div className="h-px w-20 bg-black/5 mx-auto" />
                    <Link href="/#contact" className="inline-block h-14 px-12 border border-black bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-transparent hover:text-black transition-all shadow-xl rounded-none">
                        START YOUR STORY
                    </Link>
                    <p className="text-[9px] tracking-[0.6em] text-black/10 uppercase font-black pt-12">
                        GAYA • BIHAR • EST 2024
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default function BlogListing() {
    return (
        <MediaProvider>
            <BlogListingContent />
        </MediaProvider>
    );
}

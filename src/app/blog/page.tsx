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

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20 tracking-widest font-black uppercase">Loading Journal...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans">
            {/* Blog Header */}
            <header className="py-12 px-6 border-b border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="text-[10px] tracking-[0.5em] text-white/40 uppercase font-black mb-4">Sharthak Studio Journal</div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tightest leading-none">THE JOURNAL</h1>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-3 px-6 py-3 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                        ← BACK TO PORTFOLIO
                    </Link>
                </div>
            </header>

            {/* Categories */}
            <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[10px] font-black tracking-[0.3em] uppercase transition-colors whitespace-nowrap ${activeCategory === cat ? "text-white" : "text-white/30 hover:text-white/60"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Blog Grid */}
            <main className="max-w-6xl mx-auto px-6 py-20">
                {filteredBlogs.length === 0 ? (
                    <div className="py-32 text-center text-white/20 font-black tracking-widest uppercase">No stories found in this category.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredBlogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group space-y-6 block">
                                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 border border-white/5 relative shadow-2xl">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest text-white border border-white/10 uppercase">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                        {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h2 className="text-2xl font-bold leading-tight group-hover:text-white/70 transition-colors uppercase tracking-tight">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                                        {blog.excerpt}
                                    </p>
                                    <div className="pt-2 text-[10px] font-black tracking-[0.3em] uppercase text-white inline-block border-b border-white/20 pb-1 group-hover:border-white transition-all">
                                        READ STORY →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="py-24 border-t border-white/5 text-center px-6">
                <h2 className="text-xl md:text-3xl font-black tracking-tightest mb-8">CRAFTING STORIES WITH LOVE</h2>
                <div className="text-[10px] tracking-[0.5em] text-white/20 uppercase">SHARTHAK STUDIO • BIHAR</div>
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

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

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-black/20 tracking-widest font-black uppercase italic">Journal Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F8F8F8] text-[#111] selection:bg-black selection:text-white font-sans">
            {/* Centered Logo Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 h-20 flex items-center shadow-sm px-6">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
                        ← <span className="hidden md:inline">PORTFOLIO</span>
                    </Link>

                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 active:scale-95 transition-all">
                        <div className="bg-black text-white px-5 py-2 rounded-full flex items-center gap-3 shadow-xl">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-black rounded-full" />
                            </div>
                            <span className="text-[11px] font-black tracking-[0.2em] uppercase">SHARTHAK STUDIO</span>
                        </div>
                    </Link>

                    <div className="hidden md:block w-32" />
                </div>
            </nav>

            {/* Main Hero - Reference Inspired Pill Design */}
            <header className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {filteredBlogs.length > 0 && (
                        <Link href={`/blog/${filteredBlogs[0].id}`} className="group relative block w-full aspect-[21/9] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl transform active:scale-[0.98] transition-all">
                            <img
                                src={filteredBlogs[0].image}
                                alt={filteredBlogs[0].title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 md:p-16">
                                <div className="max-w-3xl space-y-4">
                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-lg rounded-full text-[9px] font-black tracking-widest text-white uppercase border border-white/20 inline-block">FEATURED STORY</span>
                                    <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-none text-white uppercase drop-shadow-2xl">
                                        {filteredBlogs[0].title}
                                    </h1>
                                    <p className="text-sm md:text-base text-white/70 max-w-xl font-medium line-clamp-2">
                                        {filteredBlogs[0].excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="max-w-6xl mx-auto px-6 mb-16">
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all shadow-sm ${activeCategory === cat ? "bg-black text-white" : "bg-white text-black/30 hover:bg-black/5 border border-black/5"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Systematic Story List - Based on reference image structure */}
            <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
                {filteredBlogs.length === 0 ? (
                    <div className="py-24 text-center border-2 border-dashed border-black/5 rounded-[3rem]">
                        <p className="text-black/20 font-black tracking-widest uppercase">No stories found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredBlogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group block space-y-8 h-full bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                                <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#f0f0f0] relative">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest text-black border border-white/10 uppercase">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="space-y-4 px-2">
                                    <span className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{new Date(blog.date).toLocaleDateString()}</span>
                                    <h2 className="text-2xl font-black leading-tight group-hover:text-black/60 transition-colors uppercase tracking-tight line-clamp-2 leading-none h-[3rem]">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-black/50 leading-relaxed font-medium line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 text-[10px] font-black tracking-[0.4em] uppercase text-black">
                                        Read Story →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer CTA */}
            <footer className="mt-32 py-24 bg-black text-white text-center px-6 rounded-t-[4rem]">
                <div className="max-w-2xl mx-auto space-y-12">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tightest uppercase leading-none">CRAFTING STORIES WITH LOVE</h2>
                    <Link href="/#contact" className="inline-block px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl">
                        BOOK YOUR SHOOT NOW
                    </Link>
                    <div className="pt-12 text-[10px] tracking-[0.6em] text-white/20 uppercase font-bold">
                        SHARTHAK STUDIO JOURNALS • EST 2024 • BIHAR
                    </div>
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

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

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-black/10 tracking-widest font-black uppercase italic">Studio Blogs Loading...</div>;

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

            {/* Main Hero - Full Width Screen, Sharp Corners, Small Titles */}
            <header className="pt-16">
                <div className="w-full">
                    {filteredBlogs.length > 0 ? (
                        <Link href={`/blog/${filteredBlogs[0].id}`} className="group relative block w-full aspect-[21/9] bg-black overflow-hidden shadow-2xl transition-all">
                            <img
                                src={filteredBlogs[0].image}
                                alt={filteredBlogs[0].title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                                <div className="max-w-3xl space-y-4">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[7px] font-black tracking-[0.4em] text-white/40 uppercase border border-white/10 inline-block">FEATURED BLOG</span>
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tightest leading-none text-white uppercase">
                                        {filteredBlogs[0].title}
                                    </h1>
                                    <p className="text-[10px] md:text-xs text-white/30 max-w-xl font-medium line-clamp-1 uppercase tracking-widest">
                                        {filteredBlogs[0].excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="w-full aspect-[21/9] bg-[#f9f9f9] flex items-center justify-center text-black/10 font-black tracking-[0.4em] uppercase italic text-xs">NO STORIES PUBLISHED.</div>
                    )}
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="max-w-6xl mx-auto px-6 mt-16 mb-20">
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-[8.5px] font-black tracking-[0.3em] uppercase transition-all shadow-sm ${activeCategory === cat ? "bg-black text-white" : "bg-white text-black/30 hover:bg-black/5 border border-black/5"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blog Grid - Sharp Corners & Small Aesthetic Items */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {filteredBlogs.length === 0 ? (
                    <div className="py-24 text-center border-2 border-dashed border-black/5 rounded-0">
                        <p className="text-black/10 font-black tracking-widest uppercase text-[10px]">No stories found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
                        {filteredBlogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group block space-y-6">
                                <div className="aspect-[4/3] bg-black/5 relative overflow-hidden transition-all duration-700 shadow-md group-hover:shadow-2xl">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-black text-white text-[7px] font-black tracking-[0.4em] uppercase">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[8px] text-black/20 font-bold uppercase tracking-[0.3em]">{new Date(blog.date).toLocaleDateString()}</span>
                                    <h2 className="text-lg font-black leading-tight group-hover:text-black/50 transition-colors uppercase tracking-tight h-[2.5rem] overflow-hidden">
                                        {blog.title}
                                    </h2>
                                    <p className="text-xs text-black/40 leading-relaxed font-medium line-clamp-2 h-[2rem]">
                                        {blog.excerpt}
                                    </p>
                                    <div className="pt-4 text-[8px] font-black tracking-[0.4em] uppercase text-black border-b-2 border-black/5 pb-1 w-fit group-hover:border-black transition-all">
                                        READ →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Simple Studio Footer */}
            <footer className="mt-40 py-24 bg-black text-white text-center px-6">
                <div className="max-w-xl mx-auto space-y-8">
                    <h2 className="text-xl md:text-2xl font-black tracking-tightest uppercase italic">SHARTHAK STUDIO • BLOGS</h2>
                    <div className="h-px w-12 bg-white/10 mx-auto" />
                    <p className="text-[7.5px] tracking-[0.6em] text-white/20 uppercase font-black">
                        BIHAR • CINEMATIC STORYTELLING • EST 2024
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

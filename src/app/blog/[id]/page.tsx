"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MediaProvider, useMediaContext, Blog } from "@/context/MediaContext";

function BlogPostContent() {
    const { blogs, isLoading } = useMediaContext();
    const params = useParams();
    const blogId = params.id as string;
    const scrollRef = useRef<HTMLDivElement>(null);

    const blog = useMemo(() => {
        return blogs.find(b => b.id === blogId);
    }, [blogs, blogId]);

    const otherBlogs = useMemo(() => {
        return blogs.filter(b => b.id !== blogId).slice(0, 4);
    }, [blogs, blogId]);

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-black/10 tracking-widest font-black uppercase italic">Blog Loading...</div>;

    if (!blog) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black space-y-8">
            <h1 className="text-3xl font-black tracking-tightest">POST NOT FOUND</h1>
            <Link href="/blog" className="px-6 py-3 border border-black/20 rounded-full text-[10px] font-black tracking-widest uppercase">Back to Blog</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-[#111] selection:bg-black selection:text-white font-sans pb-24">
            {/* Centered Logo Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 h-16 flex items-center shadow-sm px-6">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <Link href="/blog" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">
                        ← BLOGS
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

            {/* Featured Photo - Narrow Panorama (Height Reduced) */}
            <header className="pt-16">
                <div className="w-full h-[300px] md:h-[450px] bg-black overflow-hidden relative">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>

            {/* Meta, Title & Subtitle - Aligned Below the Photo */}
            <section className="max-w-4xl mx-auto px-6 pt-12 pb-6">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-[10px] font-black tracking-widest text-black/30 uppercase">
                        {blog.category}
                    </span>
                    <span className="w-1 h-1 bg-black/10 rounded-full" />
                    <span className="text-[10px] font-black tracking-widest text-black/30 uppercase">
                        {new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] uppercase text-black mb-6">
                    {blog.title}
                </h1>

                <p className="text-base md:text-lg text-black/40 font-medium tracking-wide max-w-2xl leading-relaxed">
                    {blog.excerpt}
                </p>

                <div className="h-px w-full bg-black/5 mt-10" />
            </section>

            {/* HTML Content Render */}
            <main className="max-w-4xl mx-auto px-6 py-4">
                <div
                    className="systematic-rich-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </main>

            {/* Horizontal Scroll Recent Blogs */}
            <section className="mt-24 border-t border-black/5 pt-16 mb-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-black/30 uppercase">LATEST BLOGS</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                            >←</button>
                            <button
                                onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                            >→</button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto no-scrollbar pb-12 snap-x"
                    >
                        {otherBlogs.length > 0 ? otherBlogs.map(b => (
                            <Link key={b.id} href={`/blog/${b.id}`} className="flex-shrink-0 w-[240px] md:w-[320px] group space-y-4 snap-start">
                                <div className="aspect-video bg-black/5 overflow-hidden">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-black leading-tight uppercase tracking-tight group-hover:text-black/50 transition-colors line-clamp-2">
                                        {b.title}
                                    </h4>
                                </div>
                            </Link>
                        )) : null}
                    </div>
                </div>
            </section>

            {/* Simple Studio Footer */}
            <footer className="py-20 bg-black text-white text-center px-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h2 className="text-xl md:text-2xl font-black tracking-tightest uppercase">STUDIO BLOGS • BIHAR</h2>
                    <Link href="/#contact" className="inline-block px-10 py-4 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl">
                        BOOK YOUR JOURNEY
                    </Link>
                    <p className="text-[8px] tracking-[0.4em] text-white/20 uppercase font-bold pt-8">
                        © {new Date().getFullYear()} ALL RIGHTS RESERVED
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default function BlogPost() {
    return (
        <MediaProvider>
            <BlogPostContent />
        </MediaProvider>
    );
}

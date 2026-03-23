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

            {/* Sharp Panoramic Banner (No Radius) */}
            <header className="pt-16 max-w-[1400px] mx-auto px-6">
                <div className="relative group w-full h-[350px] md:h-[500px] bg-black overflow-hidden">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-90 transition-transform duration-[2000ms] group-hover:scale-105"
                    />

                    {/* Overlay 'Go back' */}
                    <Link
                        href="/blog"
                        className="absolute top-8 left-8 flex items-center gap-3 text-white/80 hover:text-white transition-all bg-black/20 backdrop-blur-md px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10"
                    >
                        ← GO BACK
                    </Link>

                    {/* Navigation Links inside Banner (Desktop) */}
                    <div className="absolute top-8 right-8 hidden md:flex items-center gap-8">
                        {['JOURNAL', 'GALLERY', 'FILMS', 'STUDIO'].map(item => (
                            <Link key={item} href={`/#${item.toLowerCase()}`} className="text-[10px] font-black tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Meta & Title Section - High Contrast Minimalist */}
            <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
                <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black tracking-[0.4em] text-black uppercase">
                            {blog.category}
                        </span>
                        <div className="h-px flex-1 bg-black/5" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-black/30 uppercase">
                            SHARTHAK STUDIO • {new Date(blog.date).getFullYear()}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-[0.95] uppercase text-black italic">
                        {blog.title}
                    </h1>
                </div>

                <p className="text-lg md:text-2xl text-black/60 font-medium tracking-tight leading-relaxed max-w-3xl">
                    {blog.excerpt}
                </p>

                <div className="mt-12 group flex items-center gap-4 text-[10px] font-black tracking-[0.4em] text-black/20 uppercase cursor-default">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[18px] text-black font-serif italic pr-0.5">
                        i
                    </div>
                    Updated {new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            </section>

            {/* HTML Content Render - Sharp Typography */}
            <main className="max-w-[840px] mx-auto px-6 md:px-12 py-20">
                <style jsx global>{`
                    .systematic-rich-text {
                        font-size: 1.1rem;
                        line-height: 1.8;
                        color: #222;
                        font-family: inherit;
                        text-align: left;
                    }
                    .systematic-rich-text p {
                        margin-bottom: 2.25rem;
                        letter-spacing: -0.01em;
                    }
                    .systematic-rich-text h2, 
                    .systematic-rich-text h3 {
                        color: black;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: -0.04em;
                        margin-top: 4.5rem;
                        margin-bottom: 1.5rem;
                        padding-bottom: 1rem;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                        position: relative;
                    }
                    .systematic-rich-text h2::after {
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        width: 40px;
                        height: 1px;
                        background: black;
                    }
                    .systematic-rich-text h2 { font-size: 2rem; italic: true; }
                    .systematic-rich-text h3 { font-size: 1.5rem; }
                    .systematic-rich-text img {
                        width: 100%;
                        height: auto;
                        border-radius: 0 !important;
                        margin: 4rem 0;
                        transition: opacity 0.5s;
                    }
                    .systematic-rich-text blockquote {
                        border-left: 2px solid black;
                        padding: 0 0 0 2rem;
                        font-style: italic;
                        font-size: 1.5rem;
                        color: #111;
                        margin: 4rem 0;
                    }
                    .systematic-rich-text ul, 
                    .systematic-rich-text ol {
                        margin-bottom: 2.5rem;
                        padding-left: 1.5rem;
                    }
                    .systematic-rich-text li {
                        margin-bottom: 0.75rem;
                        list-style-type: none;
                        position: relative;
                        padding-left: 1.5rem;
                    }
                    .systematic-rich-text li::before {
                        content: '→';
                        position: absolute;
                        left: 0;
                        color: black;
                        font-weight: 900;
                    }
                `}</style>
                <div
                    className="systematic-rich-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </main>

            {/* Horizontal Scroll Recent Blogs */}
            <section className="mt-24 border-t border-black/5 pt-16 mb-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-black/30 uppercase italic">CONTINUE READING</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                                className="w-12 h-12 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                            >←</button>
                            <button
                                onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                                className="w-12 h-12 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                            >→</button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto no-scrollbar pb-12 snap-x"
                    >
                        {otherBlogs.length > 0 ? otherBlogs.map(b => (
                            <Link key={b.id} href={`/blog/${b.id}`} className="flex-shrink-0 w-[280px] md:w-[380px] group space-y-6 snap-start">
                                <div className="aspect-[4/5] bg-black/5 overflow-hidden">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl md:text-2xl font-black leading-tight uppercase tracking-tight group-hover:text-black/50 transition-colors line-clamp-2 italic">
                                        {b.title}
                                    </h4>
                                    <div className="h-0.5 w-10 bg-black/5" />
                                </div>
                            </Link>
                        )) : (
                            <div className="text-[10px] font-black tracking-[0.4em] text-black/10 uppercase py-20">NO MORE STORIES YET.</div>
                        )}
                    </div>
                </div>
            </section>

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

export default function BlogPost() {
    return (
        <MediaProvider>
            <BlogPostContent />
        </MediaProvider>
    );
}

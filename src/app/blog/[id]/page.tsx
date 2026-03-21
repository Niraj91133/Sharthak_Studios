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
        return blogs.filter(b => b.id !== blogId);
    }, [blogs, blogId]);

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center text-black/20 tracking-widest font-black uppercase italic">Journal Loading...</div>;

    if (!blog) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black space-y-8">
            <h1 className="text-4xl font-black tracking-tightest">STORY NOT FOUND</h1>
            <Link href="/blog" className="px-6 py-3 border border-black/20 rounded-full text-[10px] font-black tracking-widest uppercase">Back to Journal</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#111] selection:bg-black selection:text-white font-sans pb-24">
            {/* Centered Logo Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 h-20 flex items-center shadow-sm px-6">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <Link href="/blog" className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
                        ← <span className="hidden md:inline">JOURNAL</span>
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

            {/* Featured Photo - Large Pill Design (Pure Image, No Text) */}
            <header className="pt-32 pb-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="relative w-full aspect-[21/9] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-black/5">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            {/* Title & Metadata - Below the Photo as requested */}
            <section className="max-w-4xl mx-auto px-6 py-12 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                    <span className="px-5 py-1.5 bg-black/5 rounded-full text-[10px] font-black tracking-widest text-black/40 uppercase border border-black/5">
                        {blog.category}
                    </span>
                    <span className="px-5 py-1.5 bg-black/5 rounded-full text-[10px] font-black tracking-widest text-black/40 uppercase border border-black/5">
                        {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-[1.05] uppercase text-black mb-6">
                    {blog.title}
                </h1>

                <p className="text-lg md:text-2xl text-black/40 font-medium tracking-wide max-w-2xl">
                    {blog.excerpt}
                </p>

                <div className="h-px w-full bg-black/5 mt-16" />
            </section>

            {/* HTML Content Render - Using Systematic dangerouslySetInnerHTML */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div
                    className="systematic-rich-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </main>

            {/* Horizontal Scroll Recent Blogs */}
            <section className="mt-32 border-t border-black/5 pt-32 mb-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h3 className="text-[14px] font-black tracking-[0.6em] text-black/30 uppercase">RECENT STORIES</h3>
                            <div className="h-1 w-20 bg-black/10 mt-2" />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                            >←</button>
                            <button
                                onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                            >→</button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-10 overflow-x-auto no-scrollbar pb-16 snap-x"
                    >
                        {otherBlogs.length > 0 ? otherBlogs.map(b => (
                            <Link key={b.id} href={`/blog/${b.id}`} className="flex-shrink-0 w-[300px] md:w-[480px] group space-y-8 snap-start bg-white p-8 rounded-[3rem] border border-black/5 shadow-xl hover:shadow-2x-large transition-all hover:-translate-y-2">
                                <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-black/5 relative">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[9px] font-black tracking-widest text-black/30 uppercase px-1">{b.category}</span>
                                    <h4 className="text-2xl font-black leading-tight group-hover:text-black/60 transition-colors uppercase tracking-tight line-clamp-2 h-[4rem]">
                                        {b.title}
                                    </h4>
                                    <div className="pt-4 text-[9px] font-black tracking-[0.4em] uppercase text-black border-b border-black/10 pb-1 w-fit group-hover:border-black transition-all">
                                        OPEN JOURNAL →
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="w-full py-20 text-center border-2 border-dashed border-black/5 rounded-[4rem]">
                                <p className="text-black/10 font-black tracking-widest uppercase">NOTHING ELSE TO READ</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Styled Footer */}
            <footer className="py-24 bg-black text-white text-center px-6 rounded-t-[5rem]">
                <div className="max-w-2xl mx-auto space-y-12">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tightest uppercase">EXPERIENCE THE CINEMA</h2>
                    <Link href="/#contact" className="inline-block px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl">
                        BOOK YOUR JOURNEY
                    </Link>
                    <div className="pt-12 text-[10px] tracking-[0.5em] text-white/20 uppercase font-black">
                        SHARTHAK STUDIO JOURNAL • ALL RIGHTS RESERVED
                    </div>
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

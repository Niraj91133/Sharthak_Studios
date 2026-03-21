"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { blogs } from "@/lib/blogData";

export default function BlogDetailPage() {
    const params = useParams();
    const blog = useMemo(() => blogs.find((b) => b.slug === params.slug), [params.slug]);

    if (!blog) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-10">
                <h1 className="text-[12px] font-black tracking-[0.8em] text-white/40">STORY NOT FOUND</h1>
                <Link href="/blog" className="px-10 py-4 bg-white text-black rounded-full font-black text-[10px] tracking-widest">RETURN TO BLOGS</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
            {/* Nav Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-colors group-hover:border-black">
                            <svg className="w-4 h-4 translate-x-[-1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
                            </svg>
                        </div>
                        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-black/40 group-hover:text-black transition-colors">Portofilio Studio</span>
                    </Link>
                    <Link href="/blog" className="text-[10px] font-black tracking-[0.5em] uppercase text-black/30 hover:text-black transition-colors">STORY ARCHIVE</Link>
                </div>
            </header>

            <main>
                {/* Hero Header */}
                <div className="relative w-full h-[85svh] overflow-hidden bg-black">
                    <img
                        src={blog.coverPhoto}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-24">
                        <div className="max-w-4xl mx-auto px-6 space-y-8 text-center sm:text-left">
                            <span className="inline-block px-5 py-2 bg-white text-black text-[9px] font-black tracking-widest uppercase rounded-full">{blog.category}</span>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tightest">{blog.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-[0.4em] font-black text-white/60 uppercase">
                                <span>{blog.date}</span>
                                <span className="w-1 h-1 rounded-full bg-white/40" />
                                <span>Published by {blog.author}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <article className="max-w-3xl mx-auto px-6 py-32">
                    <div className="prose prose-xl prose-stone max-w-none">
                        {/* Splitting content by double newlines to render as paragraphs/headings */}
                        {blog.content.split('\n\n').map((block, idx) => {
                            if (block.startsWith('# ')) {
                                return <h2 key={idx} className="text-4xl font-extrabold tracking-tight mb-10 mt-20">{block.replace('# ', '')}</h2>;
                            }
                            if (block.startsWith('## ')) {
                                return <h3 key={idx} className="text-2xl font-bold tracking-tight mb-8 mt-16">{block.replace('## ', '')}</h3>;
                            }
                            return <p key={idx} className="text-xl text-black/70 leading-relaxed font-serif mb-10">{block}</p>;
                        })}
                    </div>

                    <div className="mt-32 pt-20 border-t border-black/5 flex flex-col items-center gap-10">
                        <div className="w-12 h-px bg-black/20" />
                        <h4 className="text-[10px] font-black tracking-[0.6em] text-black/30 uppercase">SHARE STORY</h4>
                        <div className="flex gap-8">
                            {['IG', 'FB', 'WA'].map(social => (
                                <button key={social} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-[9px] font-black transition-all hover:bg-black hover:text-white hover:scale-110">{social}</button>
                            ))}
                        </div>
                        <Link
                            href="/blog"
                            className="mt-10 px-14 py-5 bg-black text-white rounded-full text-[10px] font-black tracking-[0.5em] uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            Explore More Stories
                        </Link>
                    </div>
                </article>
            </main>

            {/* Simple Footer */}
            <footer className="bg-[#f9f9f9] py-20 px-6 border-t border-black/5 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <p className="text-[10px] font-black tracking-[0.4em] text-black/20 uppercase">© 2026 SHARTHAK STUDIO • Bihar • Premium Cinematography</p>
                    <Link href="/" className="text-[10px] font-black tracking-[0.4em] text-black/40 hover:text-black transition-colors">RETURN TO HOME</Link>
                </div>
            </footer>
        </div>
    );
}

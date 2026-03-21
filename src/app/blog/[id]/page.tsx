"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MediaProvider, useMediaContext, Blog } from "@/context/MediaContext";

function BlogPostContent() {
    const { blogs, isLoading } = useMediaContext();
    const params = useParams();
    const blogId = params.id as string;

    const blog = useMemo(() => {
        return blogs.find(b => b.id === blogId);
    }, [blogs, blogId]);

    const otherBlogs = useMemo(() => {
        return blogs.filter(b => b.id !== blogId).slice(0, 2);
    }, [blogs, blogId]);

    if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/20 tracking-widest font-black uppercase">Opening Entry...</div>;

    if (!blog) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-8">
            <h1 className="text-4xl font-black tracking-tightest">STORY NOT FOUND</h1>
            <Link href="/blog" className="px-6 py-3 border border-white/20 rounded-full text-[10px] font-black tracking-widest uppercase">Back to Journal</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black font-sans pb-24">
            {/* Back Nav */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/60 backdrop-blur-xl border-b border-white/5 py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/blog" className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
                        ← BACK TO JOURNAL
                    </Link>
                    <Link href="/" className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
                        HOME
                    </Link>
                </div>
            </nav>

            {/* Hero Header */}
            <header className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-8 text-center md:text-left">
                    <div className="space-y-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black tracking-widest text-white/50 uppercase border border-white/10 inline-block">
                            {blog.category}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tightest leading-[1.1] uppercase">
                            {blog.title}
                        </h1>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 pt-4 border-t border-white/5">
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                            BY SHARTHAK STUDIO • {new Date(blog.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="aspect-[16/8] rounded-[2rem] overflow-hidden border border-white/5 shadow-2x-large">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Systematic Content */}
            <article className="max-w-3xl mx-auto px-6 space-y-12">
                {blog.content?.map((item, idx) => {
                    if (item.type === "p") {
                        return <p key={idx} className="text-lg md:text-xl text-white/80 leading-relaxed font-medium font-serif">{item.text}</p>;
                    }
                    if (item.type === "h2") {
                        return <h2 key={idx} className="text-3xl md:text-5xl font-black tracking-tightest leading-none pt-4 uppercase">{item.text}</h2>;
                    }
                    if (item.type === "img") {
                        return (
                            <figure key={idx} className="space-y-4 py-8">
                                <img src={item.src} alt={item.text} className="w-full rounded-2xl border border-white/5" />
                                <figcaption className="text-center text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">{item.caption}</figcaption>
                            </figure>
                        );
                    }
                    if (item.type === "quote") {
                        return (
                            <blockquote key={idx} className="p-12 border-l-4 border-white bg-white/5 rounded-r-3xl">
                                <p className="text-2xl md:text-4xl font-black italic tracking-tightest leading-tight">
                                    “{item.text}”
                                </p>
                            </blockquote>
                        );
                    }
                    return null;
                })}
            </article>

            {/* Other Blogs Section */}
            {otherBlogs.length > 0 && (
                <section className="max-w-4xl mx-auto px-6 mt-32 pt-20 border-t border-white/10">
                    <h3 className="text-sm font-black tracking-[0.5em] text-white/40 uppercase mb-12">CONTINUE READING</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {otherBlogs.map(b => (
                            <Link key={b.id} href={`/blog/${b.id}`} className="group space-y-6">
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <h4 className="text-xl font-black leading-tight group-hover:text-white/70 transition-colors uppercase tracking-tight">
                                    {b.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
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

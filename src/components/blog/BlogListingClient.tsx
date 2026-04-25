"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/context/MediaContext";

type BlogListingClientProps = {
  blogs: Blog[];
};

export default function BlogListingClient({ blogs }: BlogListingClientProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = useMemo(() => {
    const dbCategories = Array.from(
      new Set(
        blogs
          .map((blog) => blog.category?.trim())
          .filter(Boolean)
          .map((category) => category!.toUpperCase()),
      ),
    );

    return ["ALL", ...dbCategories];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const sorted = [...blogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (activeCategory === "ALL") return sorted;
    return sorted.filter((blog) => blog.category?.toUpperCase() === activeCategory);
  }, [activeCategory, blogs]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-black selection:bg-black selection:text-white font-sans overflow-x-hidden">
      {/* Floating Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6">
        <div className="flex items-center gap-8 px-8 py-4 rounded-full bg-white/40 backdrop-blur-3xl border border-black/[0.03] shadow-2xl">
          <Link href="/" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">Home</Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center transition-transform group-hover:rotate-180">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">SHARTHAK STUDIO</span>
          </Link>
          <Link href="/services" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">Services</Link>
        </div>
      </nav>

      {/* Editorial Header */}
      <header className="pt-48 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-black/5 pb-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-[1px] bg-black/20" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">Studio Journal</p>
              </div>
              <h1 className="text-6xl md:text-9xl font-black uppercase italic leading-[0.85] tracking-tightest">
                The Stories We Collect
              </h1>
            </div>
            <div className="flex flex-col items-end gap-6 text-right">
              <p className="text-lg md:text-xl font-medium tracking-tight text-black/40 max-w-xs uppercase italic">
                Chronicles of light, life, and cinematic timing across Bihar.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Entry */}
      <section className="px-6 md:px-10 mb-32">
        <div className="max-w-7xl mx-auto">
          {filteredBlogs.length > 0 ? (
            <Link href={`/blog/${filteredBlogs[0].id}`} className="group relative block w-full aspect-[21/9] bg-black overflow-hidden shadow-2xl">
              <Image
                src={filteredBlogs[0].image}
                alt={filteredBlogs[0].title}
                fill
                priority
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 md:p-20">
                <div className="max-w-4xl space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black tracking-[0.5em] text-white/50 uppercase">Featured Post • 01</span>
                    <div className="h-px w-20 bg-white/20" />
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black tracking-tightest leading-[0.9] text-white uppercase italic">
                    {filteredBlogs[0].title}
                  </h2>
                  <p className="text-sm md:text-base text-white/50 max-w-xl font-medium tracking-tight leading-relaxed line-clamp-2">
                    {filteredBlogs[0].excerpt}
                  </p>
                  <div className="pt-8 flex items-center gap-6">
                    <div className="inline-flex h-14 px-12 items-center justify-center bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-black hover:text-white">
                      Read Story
                    </div>
                    <span className="text-[9px] font-black italic tracking-widest text-white/30 uppercase">— {new Date(filteredBlogs[0].date).toLocaleDateString("en-GB", { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      {/* Category Pills - Floating Filter */}
      <div className="sticky top-0 z-40 bg-[#faf8f5]/80 backdrop-blur-md border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
          <div className="flex items-center gap-12 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-[10px] font-black tracking-[0.4em] uppercase transition-all relative py-2 ${activeCategory === cat
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

      {/* Stories Grid */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-32">
        {filteredBlogs.length === 0 ? (
          <div className="py-48 text-center border border-black/5 rounded-none">
            <p className="text-black/20 font-black tracking-widest uppercase italic text-xs">No entries found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredBlogs.slice(1).map((blog, idx) => (
              <Link key={blog.id} href={`/blog/${blog.id}`} className="group block space-y-10">
                <div className="aspect-[4/5] bg-black relative overflow-hidden transition-all duration-700 shadow-xl">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-90"
                  />
                  <div className="absolute top-0 right-0 bg-black text-white px-4 py-1.5 text-[8px] font-black tracking-[0.4em] uppercase">
                    0{idx + 2}
                  </div>
                  <div className="absolute bottom-6 left-6 text-[9px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">
                    {blog.category || 'Story'}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] text-black/30 font-black uppercase tracking-[0.4em]">
                      {new Date(blog.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}
                    </span>
                    <div className="flex-1 h-[1px] bg-black/5" />
                    <span className="text-[9px] text-black/30 font-black uppercase tracking-[0.4em]">5 MIN READ</span>
                  </div>
                  <h2 className="text-3xl font-black leading-[0.95] group-hover:text-black/50 transition-colors uppercase tracking-tighter line-clamp-2 italic">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-black/50 leading-relaxed font-medium line-clamp-3 tracking-tight">
                    {blog.excerpt}
                  </p>
                  <div className="pt-2 inline-flex items-center gap-6 group">
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase text-black border-b border-black/10 pb-2 group-hover:border-black transition-all">View Full Entry</span>
                    <span className="text-lg translate-y-[-4px] group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Branding Footer */}
      <footer className="mt-40 border-t border-black/5 py-48 bg-white text-black text-center px-6">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-2 border-black/5 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-full" />
            </div>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tightest uppercase italic leading-none opacity-5">SHARTHAK STUDIO • JOURNAL</h2>
          <div className="h-[1px] w-48 bg-black/5 mx-auto" />
          <Link href="/" className="group relative inline-flex h-16 px-16 items-center justify-center bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105">
            <span className="relative z-10">Start Your Story</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
          <p className="text-[9px] tracking-[0.8em] text-black/10 uppercase font-black pt-12">
            GAYA • BIHAR • BEYOND
          </p>
        </div>
      </footer>
    </div>
  );
}

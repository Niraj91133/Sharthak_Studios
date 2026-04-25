"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/context/MediaContext";
import SocialShare from "@/components/SocialShare";

type BlogPostClientProps = {
  blog: Blog;
  otherBlogs: Blog[];
  html: string;
};

export default function BlogPostClient({ blog, otherBlogs, html }: BlogPostClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-black selection:bg-black selection:text-white font-sans pb-32 overflow-x-hidden">
      {/* Floating Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6">
        <div className="flex items-center gap-8 px-8 py-4 rounded-full bg-white/40 backdrop-blur-3xl border border-black/[0.03] shadow-2xl">
          <Link href="/blog" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">← Back</Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center transition-transform group-hover:rotate-180">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">SHARTHAK STUDIO</span>
          </Link>
          <Link href="/services" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">Services</Link>
        </div>
      </nav>

      {/* Hero Header - Immersive */}
      <header className="relative w-full h-[70vh] md:h-[85vh] bg-black">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        <div className="absolute inset-x-0 bottom-0 py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-5xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/30" />
                <span className="text-[10px] font-black tracking-[0.5em] text-white/50 uppercase">
                  {blog.category || 'Journal Entry'}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.88] tracking-tightest text-white">
                {blog.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Meta Info & Excerpt */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-8">
            <p className="text-xl md:text-3xl font-medium tracking-tight leading-relaxed text-black/80 italic">
              {blog.excerpt}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-[1px] w-12 bg-black/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
                Published {new Date(blog.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:items-end">
            <SocialShare
              title={blog.title}
              text={blog.excerpt}
              className="text-black"
            />
            <div className="flex items-center gap-3 text-[9px] font-black tracking-[0.4em] text-black/20 uppercase">
              <span className="w-2 h-2 bg-black/10 rounded-full" />
              Studio Journal • Volume {new Date(blog.date).getFullYear()}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Render */}
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <style jsx global>{`
          .editorial-rich-text {
            font-size: 1.15rem;
            line-height: 1.9;
            color: #1a1a1a;
            font-family: inherit;
          }
          .editorial-rich-text p {
            margin-bottom: 2.5rem;
            letter-spacing: -0.01em;
          }
          .editorial-rich-text h2,
          .editorial-rich-text h3 {
            color: black;
            font-weight: 900;
            text-transform: uppercase;
            font-style: italic;
            letter-spacing: -0.04em;
            margin-top: 5rem;
            margin-bottom: 2rem;
            line-height: 1.1;
          }
          .editorial-rich-text h2 { font-size: 2.5rem; }
          .editorial-rich-text h3 { font-size: 1.8rem; }
          .editorial-rich-text img {
            width: 100%;
            height: auto;
            margin: 5rem 0;
            box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1);
          }
          .editorial-rich-text blockquote {
            border-left: 3px solid black;
            padding: 1rem 0 1rem 3rem;
            font-style: italic;
            font-weight: 500;
            font-size: 1.8rem;
            color: #111;
            margin: 5rem 0;
            line-height: 1.4;
            letter-spacing: -0.03em;
          }
          .editorial-rich-text ul {
            margin-bottom: 3rem;
          }
          .editorial-rich-text li {
            margin-bottom: 1rem;
            list-style-type: none;
            position: relative;
            padding-left: 2rem;
            font-weight: 500;
          }
          .editorial-rich-text li::before {
            content: "—";
            position: absolute;
            left: 0;
            color: rgba(0,0,0,0.2);
          }
        `}</style>
        <div
          className="editorial-rich-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      {/* Recents / Continue Reading */}
      <section className="mt-40 border-t border-black/[0.05] pt-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between mb-20">
            <div className="max-w-md">
              <div className="text-[9px] font-black tracking-[0.5em] text-black/30 uppercase mb-4">Up Next</div>
              <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Extend The Narrative</h3>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
                className="w-16 h-16 border border-black/5 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
              >←</button>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
                className="w-16 h-16 border border-black/5 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
              >→</button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar pb-20 snap-x"
          >
            {otherBlogs.length > 0 ? otherBlogs.map((otherBlog, idx) => (
              <Link key={otherBlog.id} href={`/blog/${otherBlog.id}`} className="flex-shrink-0 w-[300px] md:w-[450px] group space-y-8 snap-start">
                <div className="aspect-[16/10] bg-black relative overflow-hidden transition-all duration-700 shadow-2xl">
                  <Image
                    src={otherBlog.image}
                    alt={otherBlog.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                  />
                  <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[8px] font-black tracking-[0.4em] uppercase">
                    Ref 0{idx + 1}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl md:text-3xl font-black leading-[0.95] uppercase tracking-tighter group-hover:text-black/50 transition-colors line-clamp-2 italic">
                    {otherBlog.title}
                  </h4>
                  <div className="h-[1px] w-12 bg-black/10 group-hover:w-24 transition-all duration-500" />
                </div>
              </Link>
            )) : (
              <div className="text-[10px] font-black tracking-[0.4em] text-black/10 uppercase py-20 italic">The journal ends here for now.</div>
            )}
          </div>
        </div>
      </section>

      {/* Global Branding Footer */}
      <footer className="mt-40 border-t border-black/5 py-48 bg-white text-black text-center px-6">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-2 border-black/5 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 bg-black rounded-full" />
            </div>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tightest uppercase italic leading-none opacity-5">SHARTHAK STUDIO • JOURNAL</h2>
          <div className="h-[1px] w-48 bg-black/5 mx-auto" />
          <Link href="/" className="group relative inline-flex h-16 px-16 items-center justify-center bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
            <span className="relative z-10">Connect With Sonu Sharthak</span>
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

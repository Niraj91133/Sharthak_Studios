"use client";

import React, { useState } from "react";
import { useMediaContext, Blog } from "@/context/MediaContext";

export default function BlogManager() {
    const { blogs, addBlog, deleteBlog } = useMediaContext();
    const [isCreating, setIsCreating] = useState(false);
    const [newBlog, setNewBlog] = useState<Partial<Blog>>({
        title: "",
        excerpt: "",
        category: "TECHNIQUE",
        image: "",
        content: [{ type: "p", text: "" }]
    });

    const categories = ["TECHNIQUE", "LOCATIONS", "TRENDS", "TIPS"];

    const handleAddBlock = (type: string) => {
        const block = type === "img" ? { type, src: "", caption: "" } : { type, text: "" };
        setNewBlog(prev => ({
            ...prev,
            content: [...(prev.content || []), block]
        }));
    };

    const updateBlock = (index: number, updates: any) => {
        const blocks = [...(newBlog.content || [])];
        blocks[index] = { ...blocks[index], ...updates };
        setNewBlog(prev => ({ ...prev, content: blocks }));
    };

    const handleSave = async () => {
        if (!newBlog.title || !newBlog.image) {
            alert("Title and Featured Image are required.");
            return;
        }
        const id = newBlog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
        await addBlog({
            ...newBlog as Blog,
            id,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });
        setIsCreating(false);
        setNewBlog({ title: "", excerpt: "", category: "TECHNIQUE", image: "", content: [{ type: "p", text: "" }] });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tightest uppercase opacity-40">Blog management</h2>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        + Create New Post
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className="bg-[#111] rounded-3xl border border-white/10 p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest">Post Title</label>
                            <input
                                value={newBlog.title}
                                onChange={e => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none"
                                placeholder="THE ART OF LIGHT..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest">Category</label>
                            <select
                                value={newBlog.category}
                                onChange={e => setNewBlog(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest">Excerpt (Brief Summary)</label>
                        <textarea
                            value={newBlog.excerpt}
                            onChange={e => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none h-20"
                            placeholder="A short intro..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest">Featured Image URL</label>
                        <input
                            value={newBlog.image}
                            onChange={e => setNewBlog(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>

                    {/* Dynamic Content Blocks */}
                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-white">Systematic Content</label>

                        {newBlog.content?.map((block, idx) => (
                            <div key={idx} className="bg-black/40 p-6 rounded-2xl border border-white/5 relative group">
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white/10 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">
                                    {block.type}
                                </div>

                                {block.type === 'p' || block.type === 'h2' || block.type === 'quote' ? (
                                    <textarea
                                        value={block.text}
                                        onChange={e => updateBlock(idx, { text: e.target.value })}
                                        className="w-full bg-transparent border-none text-white/80 focus:ring-0 text-sm h-24 italic"
                                        placeholder={`Content for ${block.type}...`}
                                    />
                                ) : block.type === 'img' ? (
                                    <div className="space-y-4">
                                        <input
                                            value={block.src}
                                            onChange={e => updateBlock(idx, { src: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-[10px]"
                                            placeholder="IMAGE URL..."
                                        />
                                        <input
                                            value={block.caption}
                                            onChange={e => updateBlock(idx, { caption: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-[10px]"
                                            placeholder="CAPTION..."
                                        />
                                    </div>
                                ) : null}

                                <button
                                    onClick={() => setNewBlog(prev => ({ ...prev, content: (prev.content || []).filter((_, i) => i !== idx) }))}
                                    className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >✕</button>
                            </div>
                        ))}

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => handleAddBlock('p')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10">+ Paragraph</button>
                            <button onClick={() => handleAddBlock('h2')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10">+ Subheading</button>
                            <button onClick={() => handleAddBlock('img')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10">+ Image</button>
                            <button onClick={() => handleAddBlock('quote')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10">+ Quote</button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-12">
                        <button onClick={handleSave} className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:scale-105 transition-all">Publish Journal Entry</button>
                        <button onClick={() => setIsCreating(false)} className="px-10 py-4 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-white/5 transition-all">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden group">
                            <div className="aspect-video relative">
                                <img src={blog.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-4 left-4 px-2 py-0.5 bg-black/50 backdrop-blur rounded text-[8px] font-black text-white/80">{blog.category}</div>
                            </div>
                            <div className="p-6 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-tight line-clamp-1">{blog.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-white/30 font-bold uppercase">{blog.date}</span>
                                    <button
                                        onClick={() => deleteBlog(blog.id)}
                                        className="text-[9px] text-red-500 font-bold uppercase tracking-widest hover:underline"
                                    >Delete Post</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

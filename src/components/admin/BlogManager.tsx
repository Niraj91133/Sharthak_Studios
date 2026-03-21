"use client";

import React, { useState } from "react";
import { useMediaContext, Blog } from "@/context/MediaContext";
import UploadZone from "./UploadZone";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function BlogManager() {
    const { blogs, addBlog, deleteBlog } = useMediaContext();
    const [isCreating, setIsCreating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newBlog, setNewBlog] = useState<Partial<Blog>>({
        title: "",
        excerpt: "",
        category: "TECHNIQUE",
        image: "",
        content: ""
    });

    const categories = ["TECHNIQUE", "LOCATIONS", "TRENDS", "TIPS"];

    const handleFeatureUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setNewBlog(prev => ({ ...prev, image: url }));
        } catch (e) {
            alert("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!newBlog.title || !newBlog.image || !newBlog.content) {
            alert("Title, Content (HTML), and Featured Image are required.");
            return;
        }
        const id = newBlog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
        await addBlog({
            ...(newBlog as Blog),
            id,
            date: new Date().toISOString()
        });
        setIsCreating(false);
        setNewBlog({ title: "", excerpt: "", category: "TECHNIQUE", image: "", content: "" });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tightest uppercase opacity-40">Journals</h2>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-8 py-3 bg-white text-black rounded-full text-[12px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        + Write New Story
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className="bg-[#111] rounded-[3rem] border border-white/10 p-12 space-y-12 shadow-2x-large">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest px-2">Story Title</label>
                                <input
                                    value={newBlog.title}
                                    onChange={e => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-5 text-base font-medium focus:border-white/30 outline-none transition-all placeholder:opacity-20"
                                    placeholder="Enter a cinematic title..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest px-2">Summary / Excerpt</label>
                                <textarea
                                    value={newBlog.excerpt}
                                    onChange={e => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-5 text-sm font-medium focus:border-white/30 outline-none transition-all h-24 placeholder:opacity-20 resize-none font-sans"
                                    placeholder="Briefly describe what this story is about..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest px-2">Category</label>
                                <select
                                    value={newBlog.category}
                                    onChange={e => setNewBlog(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-5 text-sm focus:border-white/30 outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] uppercase font-black text-white/40 tracking-widest px-2">Featured Cover Image</label>
                            {newBlog.image ? (
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden group shadow-2xl border border-white/5">
                                    <img src={newBlog.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => setNewBlog(prev => ({ ...prev, image: "" }))}
                                            className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                        >Change Image</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[300px]">
                                    <UploadZone
                                        onUpload={handleFeatureUpload}
                                        isProcessing={isUploading}
                                        accept="image/*"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Massive HTML Content Field */}
                    <div className="space-y-4 pt-12 border-t border-white/5">
                        <div className="flex items-center justify-between px-2">
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/60">Story Content (HTML Allowed)</label>
                            <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Supports &lt;p&gt;, &lt;h2&gt;, &lt;img&gt; tags, etc.</p>
                        </div>
                        <textarea
                            value={newBlog.content}
                            onChange={e => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full bg-[#050505] border border-white/10 rounded-[2.5rem] px-10 py-10 text-base font-mono leading-relaxed focus:border-white/30 outline-none transition-all h-[500px] placeholder:opacity-20 resize-none ring-offset-black"
                            placeholder="Write your story using HTML here... e.g. <p>Hello World</p><img src='...' />"
                        />
                    </div>

                    <div className="flex gap-6 pt-12 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={isUploading}
                            className={`px-16 py-5 bg-white text-black font-black uppercase text-[12px] tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isUploading ? 'UPLOADING...' : 'SAVE JOURNAL ENTRY'}
                        </button>
                        <button onClick={() => setIsCreating(false)} className="px-12 py-5 border border-white/10 text-white font-black uppercase text-[12px] tracking-widest rounded-full hover:bg-white/5 transition-all">Discard</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.length > 0 ? blogs.map(blog => (
                        <div key={blog.id} className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden group shadow-xl">
                            <div className="aspect-[16/10] relative">
                                <img src={blog.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                                <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-white/90 uppercase tracking-widest border border-white/10">{blog.category}</div>
                            </div>
                            <div className="p-8 space-y-6">
                                <h3 className="font-black text-lg uppercase tracking-tight line-clamp-2 leading-tight">{blog.title}</h3>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{new Date(blog.date).toLocaleDateString()}</span>
                                    <button
                                        onClick={() => deleteBlog(blog.id)}
                                        className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:text-red-400 transition-colors"
                                    >Delete</button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <p className="text-white/20 font-black tracking-widest uppercase">No Journal entries yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

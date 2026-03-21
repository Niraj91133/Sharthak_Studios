"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mediaSlots as initialMediaSlots, MediaSlot } from "@/lib/mediaSlots";
import { supabase } from "@/lib/supabase";

export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string; // Systematic HTML string
    date: string;
    image: string;
    category: string;
}

interface MediaContextType {
    slots: MediaSlot[];
    blogs: Blog[];
    updateSlot: (id: string, updates: Partial<MediaSlot>) => void;
    resetSlot: (id: string) => Promise<void>;
    getSlot: (id: string) => MediaSlot | undefined;
    uploadFile: (id: string, file: File) => Promise<void>;
    deleteFile: (id: string) => Promise<void>;
    addSlot: (slot: MediaSlot) => Promise<void>;
    deleteSlot: (id: string) => Promise<void>;
    addBlog: (blog: Blog) => Promise<void>;
    deleteBlog: (id: string) => Promise<void>;
    allMedia: { id: string; url: string; name: string; section: string; type: string }[];
    isLoading: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [slots, setSlots] = useState<MediaSlot[]>(initialMediaSlots);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Slots
                const { data: slotData } = await supabase.from('media_slots').select('*');
                if (slotData && slotData.length > 0) {
                    const dbSlotMap = new Map();
                    slotData.forEach(d => dbSlotMap.set(d.id, d));
                    const mergedSlots = initialMediaSlots.map(initial => {
                        const dbSlot = dbSlotMap.get(initial.id);
                        if (dbSlot) {
                            dbSlotMap.delete(initial.id);
                            return { ...initial, useOnSite: dbSlot.use_on_site, categoryLabel: dbSlot.category_label || initial.categoryLabel, uploadedFile: dbSlot.uploaded_file_url ? { name: dbSlot.uploaded_file_name, url: dbSlot.uploaded_file_url, size: dbSlot.uploaded_file_size, uploadedAt: dbSlot.uploaded_at } : undefined };
                        }
                        return initial;
                    });
                    dbSlotMap.forEach((dbSlot, id) => {
                        mergedSlots.push({ id, section: dbSlot.section, frame: dbSlot.frame || 'Dynamic', type: dbSlot.type || 'image', currentSrc: dbSlot.uploaded_file_url || '', fallbackSrc: '', useOnSite: dbSlot.use_on_site, categoryLabel: dbSlot.category_label, uploadedFile: dbSlot.uploaded_file_url ? { name: dbSlot.uploaded_file_name, url: dbSlot.uploaded_file_url, size: dbSlot.uploaded_file_size, uploadedAt: dbSlot.uploaded_at } : undefined });
                    });
                    setSlots(mergedSlots);
                }

                // Fetch Blogs
                const { data: blogData, error: blogError } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
                if (blogError) {
                    console.error("❌ SUPABASE FETCH BLOGS ERROR:", blogError);
                }
                if (blogData && blogData.length > 0) {
                    console.log(`✅ Loaded ${blogData.length} blogs from Supabase.`);
                    setBlogs(blogData.map(b => ({
                        id: b.id,
                        title: b.title,
                        excerpt: b.excerpt,
                        date: b.created_at,
                        image: b.image_url,
                        category: b.category,
                        content: b.content_blocks || ""
                    })));
                } else {
                    console.log("ℹ️ No blogs found or fetch empty. Using dummy.");
                    // Seed dummy blogs for demo/initial
                    setBlogs([
                        { id: "wedding-light-guide", title: "The Art of Natural Light", excerpt: "Cinemtic guide to lights.", date: "2026-03-15", image: "https://images.unsplash.com/photo-1519741497674-611481863552", category: "TECHNIQUE", content: "<p>Cinematic light guide...</p>" }
                    ]);
                }
            } catch (err) { console.error("Error fetching data:", err); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, []);

    const addBlog = async (blog: Blog) => {
        setBlogs(prev => [blog, ...prev]);
        console.log("Saving blog to Supabase...", blog);
        const { error } = await supabase.from('blogs').upsert({
            id: blog.id,
            title: blog.title,
            excerpt: blog.excerpt,
            category: blog.category,
            image_url: blog.image,
            content_blocks: blog.content,
            created_at: new Date().toISOString()
        });
        if (error) {
            console.error("❌ SUPABASE BLOG ERROR:", error.message, error);
            alert("Error saving blog: " + error.message);
        } else {
            console.log("✅ Blog saved successfully!");
        }
    };

    const deleteBlog = async (id: string) => {
        setBlogs(prev => prev.filter(b => b.id !== id));
        await supabase.from('blogs').delete().eq('id', id);
    };

    const updateSlot = useCallback(async (id: string, updates: Partial<MediaSlot>) => {
        // Update local state
        setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

        // Update Supabase
        const dbUpdates: any = {};
        if (updates.useOnSite !== undefined) dbUpdates.use_on_site = updates.useOnSite;
        if (updates.categoryLabel !== undefined) dbUpdates.category_label = updates.categoryLabel;

        if (Object.keys(dbUpdates).length > 0) {
            const { error } = await supabase
                .from('media_slots')
                .upsert({ id, ...dbUpdates });

            if (error) console.error("Error updating slot in Supabase:", error);
        }
    }, []);

    const resetSlot = useCallback(async (id: string) => {
        const initial = initialMediaSlots.find(s => s.id === id);
        if (!initial) return;

        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, uploadedFile: undefined, useOnSite: false, currentSrc: s.fallbackSrc }
                    : s
            )
        );

        // Reset in Database (Suppresing Cloudinary deletion for reset for now to keep it simple, 
        // as Cloudinary delete requires public_id which we aren't explicitly tracking yet in a dedicated field,
        // but it's in the URL)
        await supabase.from('media_slots').upsert({
            id,
            use_on_site: false,
            uploaded_file_name: null,
            uploaded_file_url: null,
            uploaded_file_size: null,
            uploaded_at: null
        });
    }, []);

    const getSlot = useCallback((id: string) => {
        return slots.find((s) => s.id === id);
    }, [slots]);

    const uploadFile = async (id: string, file: File) => {
        // 1. Upload to Cloudinary via our API route
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Upload failed");
        }

        const cloudinaryData = await response.json();
        const publicUrl = cloudinaryData.secure_url;

        const uploadedFile = {
            name: file.name,
            url: publicUrl,
            size: file.size,
            uploadedAt: new Date().toISOString(),
        };

        // 2. Update Supabase Database with Cloudinary URL
        const currentSlot = slots.find(s => s.id === id);
        const { error: dbError } = await supabase
            .from('media_slots')
            .upsert({
                id,
                section: currentSlot?.section || 'Unknown',
                frame: currentSlot?.frame || 'Unknown',
                type: currentSlot?.type || 'image',
                category_label: currentSlot?.categoryLabel,
                uploaded_file_name: uploadedFile.name,
                uploaded_file_url: uploadedFile.url,
                uploaded_file_size: uploadedFile.size,
                uploaded_at: uploadedFile.uploadedAt,
                use_on_site: true // Auto-enable on upload
            });

        if (dbError) {
            console.error("❌ SUPABASE DB ERROR:", dbError.message, dbError);
            if (dbError.code === '42P01') {
                alert("Database Table 'media_slots' missing! Please run the SQL script in setup-supabase.sql in your Supabase Dashboard.");
            }
        }

        // 4. Update Local State
        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        uploadedFile,
                        useOnSite: true,
                    }
                    : s
            )
        );
    };

    const deleteFile = async (id: string) => {
        // We focus on clearing the DB record. Cloudinary deletion is manual or via API if needed,
        // but keeping it simple for now to avoid complexity with public_ids.
        await supabase.from('media_slots').upsert({
            id,
            uploaded_file_name: null,
            uploaded_file_url: null,
            uploaded_file_size: null,
            uploaded_at: null,
            use_on_site: false
        });

        setSlots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        uploadedFile: undefined,
                        useOnSite: false,
                    }
                    : s
            )
        );
    };

    const addSlot = async (slot: MediaSlot) => {
        setSlots(prev => [...prev, slot]);
        const { error } = await supabase.from('media_slots').upsert({
            id: slot.id,
            section: slot.section,
            frame: slot.frame,
            type: slot.type,
            use_on_site: slot.useOnSite,
            category_label: slot.categoryLabel,
            uploaded_file_url: slot.uploadedFile?.url,
            uploaded_file_name: slot.uploadedFile?.name,
            uploaded_file_size: slot.uploadedFile?.size,
            uploaded_at: slot.uploadedFile?.uploadedAt
        });
        if (error) console.error("Error adding slot to database:", error);
    };

    const deleteSlot = async (id: string) => {
        setSlots(prev => prev.filter(s => s.id !== id));
        const { error } = await supabase.from('media_slots').delete().eq('id', id);
        if (error) console.error("Error deleting slot from database:", error);
    };

    const allMedia = slots
        .filter((s) => s.uploadedFile)
        .map((s) => ({
            id: s.id,
            url: s.uploadedFile!.url,
            name: s.uploadedFile!.name,
            section: s.section,
            type: s.type,
        }));

    return (
        <MediaContext.Provider
            value={{ slots, blogs, updateSlot, resetSlot, getSlot, uploadFile, deleteFile, addSlot, deleteSlot, addBlog, deleteBlog, allMedia, isLoading }}
        >
            {children}
        </MediaContext.Provider>
    );
};

export const useMediaContext = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMediaContext must be used within a MediaProvider");
    }
    return context;
};

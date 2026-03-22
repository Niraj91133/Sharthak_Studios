"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mediaSlots as initialMediaSlots, MediaSlot } from "@/lib/mediaSlots";
import { supabase } from "@/lib/supabase";
import { compressImageFile } from "@/lib/compressImage";

const LOCAL_SLOTS_KEY = "sharthak_media_slots_v1";

function inferSectionForSlot(id: string, section?: string | null): string {
    if (section && section !== "Unknown") return section;
    if (id.startsWith("gal-dyn-")) return "03. THE COLLECTION (GALLERY)";
    return section || "Unknown";
}

function loadLocalSlots(): MediaSlot[] | null {
    try {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem(LOCAL_SLOTS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return null;
        return parsed as MediaSlot[];
    } catch {
        return null;
    }
}

function saveLocalSlots(slots: MediaSlot[]) {
    try {
        if (typeof window === "undefined") return;
        localStorage.setItem(LOCAL_SLOTS_KEY, JSON.stringify(slots));
    } catch {
        // ignore storage quota / privacy errors
    }
}

function describeSupabaseError(error: unknown): string {
    if (!error) return "Unknown Supabase error";
    if (error instanceof Error && error.message) return error.message;
    const maybe = typeof error === "object" && error !== null ? (error as Record<string, unknown>) : null;
    const message = maybe && typeof maybe["message"] === "string" ? (maybe["message"] as string) : "";
    const details = maybe && typeof maybe["details"] === "string" ? (maybe["details"] as string) : "";
    const hint = maybe && typeof maybe["hint"] === "string" ? (maybe["hint"] as string) : "";
    const code = maybe && typeof maybe["code"] === "string" ? (maybe["code"] as string) : "";
    const errorDescription =
        maybe && typeof maybe["error_description"] === "string" ? (maybe["error_description"] as string) : "";

    if (message || details || hint || code || errorDescription) {
        return [message, errorDescription, details, hint, code].filter(Boolean).join(" • ");
    }

    try {
        if (typeof error === "object" && error !== null) {
            const names = Object.getOwnPropertyNames(error);
            const parts = names
                .slice(0, 12)
                .map((n) => `${n}=${String((error as Record<string, unknown>)[n])}`);
            const joined = parts.filter(Boolean).join(" • ");
            if (joined) return joined;
        }
        const json = JSON.stringify(error);
        return json && json !== "{}" ? json : String(error);
    } catch {
        return String(error);
    }
}

export type Blog = {
    id: string;
    title: string;
    content: string; // HTML or Markdown
    image: string;
    date: string;
    category: string;
    excerpt: string;
};

interface MediaContextType {
    slots: MediaSlot[];
    updateSlot: (id: string, updates: Partial<MediaSlot>) => Promise<void>;
    resetSlot: (id: string) => Promise<void>;
    getSlot: (id: string) => MediaSlot | undefined;
    uploadFile: (id: string, file: File) => Promise<void>;
    deleteFile: (id: string) => Promise<void>;
    addSlot: (slot: MediaSlot) => Promise<void>;
    deleteSlot: (id: string) => Promise<void>;
    addBlog: (blog: Blog) => Promise<void>;
    deleteBlog: (id: string) => Promise<void>;
    allMedia: { id: string; url: string; name: string; section: string; type: string }[];
    blogs: Blog[];
    isLoading: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [slots, setSlots] = useState<MediaSlot[]>(initialMediaSlots);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dbSupportsCategoryLabel, setDbSupportsCategoryLabel] = useState(true);
    const [schemaChecked, setSchemaChecked] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const cached = loadLocalSlots();
        if (cached && cached.length > 0) {
            setSlots(cached);
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Slots
                const { data: slotData, error: slotError } = await supabase.from('media_slots').select('*');
                if (slotError) {
                    console.warn("Supabase table 'media_slots' error:", describeSupabaseError(slotError));
                } else if (slotData) {
                    const dbSlotMap = new Map(slotData.map(d => [d.id, d]));
                    const mergedSlots = initialMediaSlots.map(base => {
                        const dbSlot = dbSlotMap.get(base.id);
                        if (dbSlot) {
                            dbSlotMap.delete(base.id);
                            return {
                                ...base,
                                useOnSite: dbSlot.use_on_site,
                                categoryLabel: dbSlot.category_label || base.categoryLabel,
                                uploadedFile: dbSlot.uploaded_file_url ? {
                                    name: dbSlot.uploaded_file_name,
                                    url: dbSlot.uploaded_file_url,
                                    size: dbSlot.uploaded_file_size,
                                    uploadedAt: dbSlot.uploaded_at
                                } : undefined
                            };
                        }
                        return base;
                    });

                    // Add purely dynamic slots
                    dbSlotMap.forEach((dbSlot, id) => {
                        mergedSlots.push({
                            id,
                            section: inferSectionForSlot(id, dbSlot.section),
                            frame: dbSlot.frame || 'Dynamic',
                            type: dbSlot.type || 'image',
                            currentSrc: dbSlot.uploaded_file_url || '',
                            fallbackSrc: '',
                            useOnSite: dbSlot.use_on_site,
                            categoryLabel: dbSlot.category_label,
                            uploadedFile: dbSlot.uploaded_file_url ? {
                                name: dbSlot.uploaded_file_name,
                                url: dbSlot.uploaded_file_url,
                                size: dbSlot.uploaded_file_size,
                                uploadedAt: dbSlot.uploaded_at
                            } : undefined
                        });
                    });
                    setSlots(mergedSlots);
                }

                // 2. Fetch Blogs
                const { data: blogData, error: blogError } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('date', { ascending: false });

                if (blogError) {
                    console.warn("Supabase table 'blogs' error:", describeSupabaseError(blogError));
                } else if (blogData) {
                    setBlogs(blogData);
                }
            } catch (err) {
                console.error("Data fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Local Sync
    useEffect(() => {
        saveLocalSlots(slots);
    }, [slots]);

    // Schema Check
    useEffect(() => {
        const checkSchema = async () => {
            try {
                const { error } = await supabase.from("media_slots").select("category_label").limit(1);
                if (error && error.code === '42703') { // Column not found
                    setDbSupportsCategoryLabel(false);
                }
            } catch {
                // Ignore
            } finally {
                setSchemaChecked(true);
            }
        };
        checkSchema();
    }, []);

    const updateSlot = useCallback(async (id: string, updates: Partial<MediaSlot>) => {
        setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

        const current = slots.find((s) => s.id === id);
        if (current) {
            const dbUpdates: any = {
                id,
                section: current.section,
                frame: current.frame,
                type: current.type,
                use_on_site: updates.useOnSite ?? current.useOnSite,
                order_index: current.orderIndex ?? 0
            };
            if (updates.categoryLabel !== undefined && dbSupportsCategoryLabel) {
                dbUpdates.category_label = updates.categoryLabel;
            }
            if (updates.uploadedFile !== undefined) {
                dbUpdates.uploaded_file_url = updates.uploadedFile?.url;
                dbUpdates.uploaded_file_name = updates.uploadedFile?.name;
                dbUpdates.uploaded_file_size = updates.uploadedFile?.size;
                dbUpdates.uploaded_at = updates.uploadedFile?.uploadedAt;
            }

            const { error } = await supabase.from('media_slots').upsert(dbUpdates);
            if (error) console.error("Update sync error:", describeSupabaseError(error));
        }
    }, [dbSupportsCategoryLabel, slots]);

    const resetSlot = useCallback(async (id: string) => {
        setSlots((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, uploadedFile: undefined, useOnSite: false } : s
            )
        );
        await supabase.from('media_slots').upsert({
            id,
            uploaded_file_url: null,
            uploaded_file_name: null,
            uploaded_file_size: null,
            uploaded_at: null,
            use_on_site: false
        });
    }, []);

    const getSlot = useCallback((id: string) => slots.find((s) => s.id === id), [slots]);

    const uploadFile = async (id: string, file: File) => {
        let fileToSend = file;

        // Compression
        if (file.type.startsWith("image/")) {
            try {
                fileToSend = await compressImageFile(file, {
                    maxBytes: 9500000,
                    targetRatio: 0.65,
                    maxDimension: 2600,
                });
            } catch (e) {
                console.warn("Compression failed, uploading original.");
            }
        }

        // Upload
        const formData = new FormData();
        formData.append("file", fileToSend);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Upload failed.");

        const data = await response.json();
        const uploadedFile = {
            name: fileToSend.name,
            url: data.secure_url,
            size: fileToSend.size,
            uploadedAt: new Date().toISOString(),
        };

        // Sync to DB
        await updateSlot(id, { uploadedFile, useOnSite: true });
    };

    const deleteFile = async (id: string) => {
        await resetSlot(id);
    };

    const addSlot = async (slot: MediaSlot) => {
        setSlots(prev => [...prev, slot]);
        await supabase.from('media_slots').upsert({
            id: slot.id,
            section: slot.section,
            frame: slot.frame,
            type: slot.type,
            use_on_site: slot.useOnSite,
            category_label: slot.categoryLabel,
            order_index: slots.length
        });
    };

    const deleteSlot = async (id: string) => {
        setSlots(prev => prev.filter(s => s.id !== id));
        await supabase.from('media_slots').delete().eq('id', id);
    };

    const addBlog = async (blog: Blog) => {
        setBlogs(prev => [blog, ...prev]);
        const { error } = await supabase.from('blogs').insert([blog]);
        if (error) console.error("Error adding blog:", describeSupabaseError(error));
    };

    const deleteBlog = async (id: string) => {
        setBlogs(prev => prev.filter(b => b.id !== id));
        await supabase.from('blogs').delete().eq('id', id);
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
            value={{ slots, updateSlot, resetSlot, getSlot, uploadFile, deleteFile, addSlot, deleteSlot, addBlog, deleteBlog, allMedia, blogs, isLoading }}
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

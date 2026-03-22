"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mediaSlots as initialMediaSlots, MediaSlot } from "@/lib/mediaSlots";
import { supabase } from "@/lib/supabase";
import { compressImageFile } from "@/lib/compressImage";

const LOCAL_SLOTS_KEY = "sharthak_media_slots_v1";

function loadLocalSlots(): MediaSlot[] | null {
    try {
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

function isSchemaMismatchMessage(message: string) {
    return /category_label|column|schema|relation|42P01|42703|PGRST/i.test(message);
}

function shouldShowSupabaseSetupHelp(message: string) {
    return isSchemaMismatchMessage(message) || message === "Unknown Supabase error" || message === "[object Object]";
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
    blogs: Blog[];
    isLoading: boolean;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [slots, setSlots] = useState<MediaSlot[]>(initialMediaSlots);
    const [isLoading, setIsLoading] = useState(false);
    const [dbSupportsCategoryLabel, setDbSupportsCategoryLabel] = useState(true);
    const [schemaChecked, setSchemaChecked] = useState(false);
    const [schemaWarned, setSchemaWarned] = useState(false);

    // Local persistence fallback: if Supabase is misconfigured, don't lose admin changes on refresh.
    useEffect(() => {
        const cached = loadLocalSlots();
        if (cached && cached.length > 0) {
            setSlots(cached);
        }
    }, []);

    useEffect(() => {
        saveLocalSlots(slots);
    }, [slots]);

    // Fetch slots from Supabase on mount
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const { data, error } = await supabase
                    .from('media_slots')
                    .select('*');

                if (error) {
                    console.warn("Supabase table 'media_slots' not found. Using local initial data.", error);
                    setIsLoading(false);
                    // Keep whatever we currently have (could be localStorage-backed).
                    return;
                }

                if (data && data.length > 0) {
                    const cached = loadLocalSlots();
                    const baseSlots = cached && cached.length > 0 ? cached : initialMediaSlots;

                    // Start with initial slots and merge DB data
                    // Also include any slots that are ONLY in the DB
                    const dbSlotMap = new Map();
                    data.forEach(d => dbSlotMap.set(d.id, d));

                    const mergedSlots = baseSlots.map(base => {
                        const dbSlot = dbSlotMap.get(base.id);
                        if (dbSlot) {
                            dbSlotMap.delete(base.id); // Remove so we know what's left
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

                    // Add purely dynamic slots from the DB
                    dbSlotMap.forEach((dbSlot, id) => {
                        mergedSlots.push({
                            id,
                            section: dbSlot.section,
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
            } catch (err) {
                console.error("Error fetching media slots:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlots();
    }, []);

    // Detect DB schema capabilities (PostgREST schema cache sometimes lacks new columns until migrated).
    useEffect(() => {
        let cancelled = false;
        const checkSchema = async () => {
            try {
                const { error } = await supabase.from("media_slots").select("category_label").limit(1);
                if (cancelled) return;
                if (error) {
                    const msg = describeSupabaseError(error);
                    if (/PGRST204/i.test(msg) && /category_label/i.test(msg)) {
                        setDbSupportsCategoryLabel(false);
                    }
                }
            } catch {
                // Ignore; keep defaults
            } finally {
                if (!cancelled) setSchemaChecked(true);
            }
        };
        checkSchema();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!schemaChecked) return;
        if (dbSupportsCategoryLabel) return;
        if (schemaWarned) return;
        setSchemaWarned(true);
        alert("Supabase DB needs migration: run `setup-supabase.sql` (adds `category_label`). Upload will work, but categories won't persist until you migrate.");
    }, [dbSupportsCategoryLabel, schemaChecked, schemaWarned]);

    const updateSlot = useCallback(async (id: string, updates: Partial<MediaSlot>) => {
        // Update local state
        const snapshot = slots;
        setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

        // Update Supabase
        const dbUpdates: Record<string, unknown> = {};
        if (updates.useOnSite !== undefined) dbUpdates.use_on_site = updates.useOnSite;
        if (updates.categoryLabel !== undefined && dbSupportsCategoryLabel) dbUpdates.category_label = updates.categoryLabel;

        if (Object.keys(dbUpdates).length > 0) {
            const current = slots.find((s) => s.id === id);
            const { error } = await supabase
                .from('media_slots')
                .upsert({
                    id,
                    section: current?.section || "Unknown",
                    frame: current?.frame || "Unknown",
                    type: current?.type || "image",
                    ...dbUpdates
                });

            if (error) {
                const message = describeSupabaseError(error);
                console.error("Error updating slot in Supabase:", message, error);
                // Roll back optimistic update if DB write failed
                setSlots(snapshot);
                if (shouldShowSupabaseSetupHelp(message)) {
                    alert("Supabase DB schema mismatch. Run `setup-supabase.sql` in Supabase SQL editor (adds `category_label` + disables RLS).");
                }
            }
        }
    }, [dbSupportsCategoryLabel, slots]);

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
        const maxClientFileBytes = 30_485_760; // ~30.5MB
        if (file.size > maxClientFileBytes) {
            throw new Error(`File too large. Please upload up to 30MB.`);
        }

        const upstreamMaxBytes = 9_500_000;
        let uploadFileToSend = file;
        // Compress images before uploading to reduce payload while keeping high visual quality.
        if (file.type.startsWith("image/")) {
            try {
                uploadFileToSend = await compressImageFile(file, {
                    // Keep under ~9.5MB to avoid common upstream limits.
                    maxBytes: upstreamMaxBytes,
                    // Try to land near 50–70% of original size.
                    targetRatio: 0.65,
                    // Preserve detail while preventing huge dimensions from bloating file size.
                    maxDimension: 2600,
                });
            } catch (e) {
                console.warn("Image compression failed.", e);
                throw e instanceof Error ? e : new Error("Image compression failed.");
            }
        } else if (file.size > upstreamMaxBytes) {
            // We can't reliably compress videos in-browser without heavy transcoding.
            throw new Error("Video/file too large. Please upload an image or keep the file under 10MB.");
        }

        // 1. Upload to Cloudinary via our API route
        const formData = new FormData();
        formData.append("file", uploadFileToSend);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            let message = `Upload failed (HTTP ${response.status})`;
            try {
                const errorData = await response.json();
                message = errorData?.error || message;
            } catch {
                try {
                    const text = await response.text();
                    if (text) message = text;
                } catch {
                    // ignore
                }
            }
            throw new Error(message);
        }

        const cloudinaryData = await response.json();
        const publicUrl = cloudinaryData.secure_url;

        const uploadedFile = {
            name: uploadFileToSend.name,
            url: publicUrl,
            size: uploadFileToSend.size,
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
                ...(dbSupportsCategoryLabel ? { category_label: currentSlot?.categoryLabel } : {}),
                uploaded_file_name: uploadedFile.name,
                uploaded_file_url: uploadedFile.url,
                uploaded_file_size: uploadedFile.size,
                uploaded_at: uploadedFile.uploadedAt,
                use_on_site: true // Auto-enable on upload
            });

        if (dbError) {
            const message = describeSupabaseError(dbError);
            console.error("❌ SUPABASE DB ERROR:", message, dbError);
            if (shouldShowSupabaseSetupHelp(message)) {
                alert("Supabase DB schema mismatch. Run `setup-supabase.sql` in Supabase SQL editor (adds `category_label` + disables RLS).");
            }
            throw new Error(message);
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
            ...(dbSupportsCategoryLabel ? { category_label: slot.categoryLabel } : {}),
            uploaded_file_url: slot.uploadedFile?.url,
            uploaded_file_name: slot.uploadedFile?.name,
            uploaded_file_size: slot.uploadedFile?.size,
            uploaded_at: slot.uploadedFile?.uploadedAt
        });
        if (error) {
            const message = describeSupabaseError(error);
            console.error("Error adding slot to database:", message, error);
            // Roll back optimistic add if DB write failed
            setSlots(prev => prev.filter(s => s.id !== slot.id));
            if (shouldShowSupabaseSetupHelp(message)) {
                alert("Supabase DB schema mismatch. Run `setup-supabase.sql` in Supabase SQL editor (adds `category_label` + disables RLS).");
            }
            throw new Error(message);
        }
    };

    const deleteSlot = async (id: string) => {
        setSlots(prev => prev.filter(s => s.id !== id));
        const { error } = await supabase.from('media_slots').delete().eq('id', id);
        if (error) console.error("Error deleting slot from database:", error);
    };

    const [blogs, setBlogs] = useState<Blog[]>([
        {
            id: '1',
            title: 'THE ART OF CAPTURING ETERNAL MOMENTS',
            category: 'TECHNIQUE',
            date: '2026-03-20',
            excerpt: 'Exploring the philosophy behind cinematic wedding filmmaking and why every frame matters.',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600',
            content: 'In the heart of every wedding lies a story waiting to be told. Unlike traditional photography, cinematography captures the movement, the sound, and the raw emotion of the day...\n\n# THE CINEMATIC APPROACH\n\nWe believe in a documentary-style approach that allows the day to unfold naturally. No forced poses, no staged smiles—just pure, unadulterated emotion.'
        },
        {
            id: '2',
            title: 'TOP 5 LOCATIONS FOR PRE-WEDDING SHOOTS IN BIHAR',
            category: 'LOCATIONS',
            date: '2026-03-18',
            excerpt: 'Discover hidden gems in Gaya, Patna, and beyond for your dream pre-wedding story.',
            image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1600',
            content: 'Bihar is home to rich history and breathtaking landscapes. From the serene banks of the Ganges to the ancient ruins of Nalanda, there are endless possibilities for a cinematic pre-wedding shoot.'
        }
    ]);

    const allMedia = slots
        .filter((s) => s.uploadedFile)
        .map((s) => ({
            id: s.id,
            url: s.uploadedFile!.url,
            name: s.uploadedFile!.name,
            section: s.section,
            type: s.type,
        }));

    const addBlog = async (blog: Blog) => {
        setBlogs(prev => [...prev, blog]);
        // Future: Supabase sync for blogs
    };

    const deleteBlog = async (id: string) => {
        setBlogs(prev => prev.filter(b => b.id !== id));
        // Future: Supabase sync for blogs
    };

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

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
    // Default to false so older schemas don't spam errors on first write.
    const [dbSupportsOrderIndex, setDbSupportsOrderIndex] = useState(false);
    const [schemaChecked, setSchemaChecked] = useState(false);

    const upsertMediaSlot = useCallback(async (payload: Record<string, unknown>) => {
        if (!supabase) return;
        const { error } = await supabase.from('media_slots').upsert(payload);
        if (!error) return;

        const code = (error as unknown as { code?: string }).code || "";
        const message = describeSupabaseError(error);

        // Postgres: 42703 (undefined column). PostgREST schema cache: PGRST204.
        if (code === "42703" || code === "PGRST204") {
            // Column not found (e.g. category_label or order_index missing)
            let shouldRetry = false;
            const retryPayload = { ...payload };

            if (message.includes("order_index")) {
                setDbSupportsOrderIndex(false);
                delete retryPayload.order_index;
                shouldRetry = true;
            }

            if (message.includes("category_label")) {
                setDbSupportsCategoryLabel(false);
                delete retryPayload.category_label;
                shouldRetry = true;
            }

            if (shouldRetry) {
                const { error: retryError } = await supabase.from('media_slots').upsert(retryPayload);
                if (!retryError) return;
                console.warn("Update sync error (retry):", describeSupabaseError(retryError));
                return;
            }
        }

        console.warn("Update sync error:", message);
    }, []);

    // Initial Data Fetch
    useEffect(() => {
        const cached = loadLocalSlots();
        if (cached && cached.length > 0) setSlots(cached);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (!supabase) return;
                // 1. Fetch Slots
                const { data: slotData, error: slotError } = await supabase.from('media_slots').select('*');
                if (slotError) {
                    console.warn("Supabase table 'media_slots' error:", describeSupabaseError(slotError));
                } else if (slotData) {
                    const localSlots = (cached && cached.length > 0) ? cached : [];
                    const localSlotMap = new Map(localSlots.map((s) => [s.id, s]));
                    const dbSlotMap = new Map(slotData.map(d => [d.id, d]));

                    // Start from initial slots, prefer DB, fallback to local cache when DB is missing.
                    const mergedSlots = initialMediaSlots.map((base) => {
                        const dbSlot = dbSlotMap.get(base.id);
                        if (dbSlot) {
                            dbSlotMap.delete(base.id);
                            localSlotMap.delete(base.id);
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

                        const local = localSlotMap.get(base.id);
                        if (local) {
                            localSlotMap.delete(base.id);
                            // Ensure type from code (initialMediaSlots) takes precedence over local cache
                            return { ...local, type: base.type };
                        }

                        return base;
                    });

                    const seenIds = new Set<string>(mergedSlots.map((s) => s.id));

                    // Add purely dynamic slots from DB
                    dbSlotMap.forEach((dbSlot, id) => {
                        // Merge DB + local cache for the same id.
                        // Important when the DB schema doesn't have optional columns (e.g. category_label),
                        // but local cache still holds those values.
                        const local = localSlotMap.get(id);
                        localSlotMap.delete(id);
                        if (seenIds.has(id)) return;
                        seenIds.add(id);
                        mergedSlots.push({
                            id,
                            section: inferSectionForSlot(id, (dbSlot.section ?? local?.section) ?? null),
                            frame: dbSlot.frame || local?.frame || 'Dynamic',
                            type: dbSlot.type || local?.type || 'image',
                            currentSrc: dbSlot.uploaded_file_url || local?.currentSrc || '',
                            fallbackSrc: local?.fallbackSrc || '',
                            useOnSite: (dbSlot.use_on_site ?? local?.useOnSite) ?? true,
                            categoryLabel: dbSlot.category_label ?? local?.categoryLabel,
                            uploadedFile: dbSlot.uploaded_file_url
                                ? {
                                    name: dbSlot.uploaded_file_name,
                                    url: dbSlot.uploaded_file_url,
                                    size: dbSlot.uploaded_file_size,
                                    uploadedAt: dbSlot.uploaded_at
                                }
                                : local?.uploadedFile
                        });
                    });

                    // Keep any locally-cached dynamic slots that DB doesn't have yet
                    localSlotMap.forEach((local) => {
                        if (seenIds.has(local.id)) return;
                        seenIds.add(local.id);
                        mergedSlots.push(local);
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
            if (!supabase) {
                setSchemaChecked(true);
                return;
            }
            try {
                const { error } = await supabase.from("media_slots").select("category_label").limit(1);
                if (error && (error.code === '42703' || error.code === "PGRST204")) {
                    setDbSupportsCategoryLabel(false);
                } else if (!error) {
                    setDbSupportsCategoryLabel(true);
                }
            } catch {
                // Ignore
            }
            try {
                const { error } = await supabase.from("media_slots").select("order_index").limit(1);
                if (error && (error.code === '42703' || error.code === "PGRST204")) {
                    setDbSupportsOrderIndex(false);
                } else if (!error) {
                    setDbSupportsOrderIndex(true);
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
        let slotForDb: MediaSlot | undefined;
        setSlots((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                const merged = { ...s, ...updates };
                slotForDb = merged;
                return merged;
            })
        );

        const current = slotForDb || slots.find((s) => s.id === id);
        if (current) {
            const dbUpdates: Record<string, unknown> = {
                id,
                section: current.section,
                frame: current.frame,
                type: current.type,
                use_on_site: current.useOnSite,
                ...(schemaChecked && dbSupportsOrderIndex ? { order_index: current.orderIndex ?? 0 } : {})
            };
            if (dbSupportsCategoryLabel && current.categoryLabel !== undefined) {
                dbUpdates.category_label = current.categoryLabel;
            }
            if (current.uploadedFile !== undefined) {
                dbUpdates.uploaded_file_url = current.uploadedFile?.url;
                dbUpdates.uploaded_file_name = current.uploadedFile?.name;
                dbUpdates.uploaded_file_size = current.uploadedFile?.size;
                dbUpdates.uploaded_at = current.uploadedFile?.uploadedAt;
            }

            await upsertMediaSlot(dbUpdates);
        }
    }, [dbSupportsCategoryLabel, dbSupportsOrderIndex, schemaChecked, slots, upsertMediaSlot]);

    const resetSlot = useCallback(async (id: string) => {
        setSlots((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, uploadedFile: undefined, useOnSite: false } : s
            )
        );
        if (!supabase) return;
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
            } catch {
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
        const uploadedName =
            data && typeof data === "object" && data !== null && typeof (data as { original_filename?: unknown }).original_filename === "string"
                ? `${(data as { original_filename: string }).original_filename}.${typeof (data as { format?: unknown }).format === "string" ? (data as { format: string }).format : (fileToSend.name.split(".").pop() || "")}`.replace(/\.$/, "")
                : fileToSend.name;
        const uploadedFile = {
            name: uploadedName,
            url: data.secure_url,
            size: typeof data?.bytes === "number" ? data.bytes : fileToSend.size,
            uploadedAt: new Date().toISOString(),
        };

        // Sync to DB
        await updateSlot(id, { uploadedFile, useOnSite: true });
    };

    const deleteFile = async (id: string) => {
        await resetSlot(id);
    };

    const addSlot = async (slot: MediaSlot) => {
        setSlots(prev => (prev.some((s) => s.id === slot.id) ? prev : [...prev, slot]));
        const payload: Record<string, unknown> = {
            id: slot.id,
            section: slot.section,
            frame: slot.frame,
            type: slot.type,
            use_on_site: slot.useOnSite,
            ...(schemaChecked && dbSupportsOrderIndex ? { order_index: slots.length } : {})
        };
        if (dbSupportsCategoryLabel) payload.category_label = slot.categoryLabel;
        await upsertMediaSlot(payload);
    };

    const deleteSlot = async (id: string) => {
        setSlots(prev => prev.filter(s => s.id !== id));
        if (!supabase) return;
        await supabase.from('media_slots').delete().eq('id', id);
    };

    const addBlog = async (blog: Blog) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const { error } = await supabase.from('blogs').insert([blog]);
        if (error) {
            const msg = describeSupabaseError(error);
            console.error("Error adding blog:", msg);
            throw new Error(msg);
        }
        setBlogs(prev => [blog, ...prev]);
    };

    const deleteBlog = async (id: string) => {
        setBlogs(prev => prev.filter(b => b.id !== id));
        if (!supabase) return;
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

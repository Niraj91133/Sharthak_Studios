"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMediaContext } from "@/context/MediaContext";
import SectionCard from "@/components/admin/SectionCard";
import CollapsibleAdminCard from "@/components/admin/CollapsibleAdminCard";
import GlobalMediaPanel from "@/components/admin/GlobalMediaPanel";
import GalleryManager from "@/components/admin/GalleryManager";
import BlogManager from "@/components/admin/BlogManager";
import PackageCalculator from "@/components/admin/PackageCalculator";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator } from "lucide-react";

export default function AdminDashboard() {
    const { slots, blogs } = useMediaContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginForm, setLoginForm] = useState({ id: "", pass: "" });
    const [loginError, setLoginError] = useState("");
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [showGlobalMedia, setShowGlobalMedia] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const [storage, setStorage] = useState<{
        usedBytes: number | null;
        limitBytes: number | null;
        usedPct: number | null;
        error?: string;
        loading: boolean;
    }>({ usedBytes: null, limitBytes: null, usedPct: null, loading: true });

    useEffect(() => {
        const auth = localStorage.getItem("sharthak_admin_auth");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (auth === "true") {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginForm.id === "Sonu Sharthak" && loginForm.pass === "0000") {
            setIsAuthenticated(true);
            localStorage.setItem("sharthak_admin_auth", "true");
            setLoginError("");
        } else {
            setLoginError("Invalid Admin ID or Password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("sharthak_admin_auth");
    };

    const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === "object" && v !== null && !Array.isArray(v);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            try {
                const res = await fetch("/api/cloudinary/usage");
                const json: unknown = await res.json();
                if (cancelled) return;
                const data = isRecord(json) ? json : {};
                const ok = res.ok && data.ok === true;
                if (!ok) {
                    setStorage({
                        usedBytes: null,
                        limitBytes: null,
                        usedPct: null,
                        error: typeof data.error === "string" ? data.error : "Failed to load storage status",
                        loading: false,
                    });
                    return;
                }

                const storageObj = isRecord(data.storage) ? data.storage : {};
                const usedBytes = typeof storageObj.usedBytes === "number" ? storageObj.usedBytes : null;
                const limitBytes = typeof storageObj.limitBytes === "number" ? storageObj.limitBytes : null;
                const usedPct = typeof storageObj.usedPct === "number" ? storageObj.usedPct : null;
                setStorage({
                    usedBytes,
                    limitBytes,
                    usedPct,
                    loading: false,
                });
            } catch (e) {
                if (cancelled) return;
                setStorage({
                    usedBytes: null,
                    limitBytes: null,
                    usedPct: null,
                    error: e instanceof Error ? e.message : "Failed to load storage status",
                    loading: false,
                });
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, []);

    const formatBytes = (bytes: number | null) => {
        if (bytes === null) return "--";
        const gb = 1024 ** 3;
        const mb = 1024 ** 2;
        if (bytes >= gb) return `${(bytes / gb).toFixed(2)} GB`;
        if (bytes >= mb) return `${(bytes / mb).toFixed(1)} MB`;
        return `${Math.round(bytes / 1024)} KB`;
    };

    const remainingBytes =
        storage.usedBytes !== null && storage.limitBytes !== null
            ? Math.max(0, storage.limitBytes - storage.usedBytes)
            : null;

    const sections = useMemo(() => {
        const grouped = slots.reduce((acc, slot) => {
            if (!acc[slot.section]) acc[slot.section] = [];
            acc[slot.section].push(slot);
            return acc;
        }, {} as Record<string, typeof slots>);

        const colors = [
            "#FF3D00", // Hero Scroll
            "#FFEA00", // Camera CTA
            "#00E676", // Gallery Section
            "#00B0FF", // Latest Work
            "#D500F9", // Expertise Section
            "#FF5252", // Video Editing Timeline
            "#7C4DFF", // Why Choose Us
            "#00E5FF", // Infinite Strips CTA
        ];

        const VALID_SECTIONS = [
            "01. MOBILE HERO SECTION",
            "02. INFINITE STRIPS (DESKTOP)",
            "03. THE COLLECTION (GALLERY)",
            "04. CHOOSE YOUR EXPERTISE",
            "05. INSTAGRAM FEED (LATEST WORK)",
            "06. ABOUT ME SECTION",
            "07. WHY CHOOSE US (BOOK FLIP)",
            "08. STUDIO METRICS"
        ];

        const filteredGrouping = Object.keys(grouped)
            .filter(title => VALID_SECTIONS.includes(title))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        return filteredGrouping.map((title, i) => ({
            title,
            slots: grouped[title],
            accentColor: colors[i % colors.length],
        }));
    }, [slots]);

    if (isCheckingAuth) return <div className="min-h-screen bg-black" />;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center space-y-4">
                        <img src="/logo-white.png" alt="Sharthak Studio" className="w-16 h-16 mx-auto object-contain" />
                        <h1 className="text-2xl font-black tracking-widest uppercase">ADMIN ACCESS</h1>
                        <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-white/40 uppercase ml-1">Admin ID</label>
                            <input
                                type="text"
                                value={loginForm.id}
                                onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/30 transition-all"
                                placeholder="Enter ID"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-white/40 uppercase ml-1">Password</label>
                            <input
                                type="password"
                                value={loginForm.pass}
                                onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-white/30 transition-all"
                                placeholder="••••"
                                required
                            />
                        </div>

                        {loginError && (
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center mt-2">{loginError}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-white text-black rounded-2xl py-5 text-xs font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="pt-8 text-center">
                        <Link href="/" className="text-[9px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-[0.4em]">
                            ← Back to Website
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans pb-24 md:pb-12 bg-black">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-black tracking-[0.3em] text-white">
                            SHARTHAK STUDIO CMS
                        </h1>
                        <span className="hidden md:block px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-white/30 uppercase tracking-widest">
                            v2.0 Stable
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowTools(!showTools)}
                                className={`px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${showTools ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                            >
                                Tools <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showTools ? 'rotate-180' : 'opacity-40'}`} />
                            </button>

                            <AnimatePresence>
                                {showTools && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setShowTools(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
                                        >
                                            <button
                                                onClick={() => {
                                                    setShowCalculator(true);
                                                    setShowTools(false);
                                                }}
                                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors"
                                            >
                                                <Calculator className="w-3 h-3 text-white/40" />
                                                Package Calculator
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setShowGlobalMedia(true)}
                            className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all hidden md:flex items-center gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                            Library
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 border border-red-500/30 text-red-500/60 hover:bg-red-500 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Logout
                        </button>

                        <Link
                            href="/"
                            className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            View Site →
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
                    {/* Sidebar - Desktop Only */}
                    <aside className="hidden md:block space-y-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase ml-2">
                                Sections
                            </p>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.title}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-bold text-white/40 hover:text-white transition-all flex items-center gap-3"
                                    >
                                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: section.accentColor }} />
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <p className="text-[10px] font-bold text-white/60 mb-2 uppercase tracking-widest">Storage Status</p>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-[width] duration-700"
                                    style={{
                                        width: storage.usedPct === null ? "20%" : `${Math.round(storage.usedPct * 100)}%`,
                                        opacity: storage.loading ? 0.35 : 1,
                                    }}
                                />
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-4">
                                <p className="text-[9px] text-white/30">
                                    {storage.loading
                                        ? "Loading Cloudinary usage..."
                                        : storage.error
                                            ? "Cloudinary usage unavailable"
                                            : `Used ${formatBytes(storage.usedBytes)} / ${storage.limitBytes ? formatBytes(storage.limitBytes) : "∞"} • Left ${storage.limitBytes ? formatBytes(remainingBytes) : "∞"}`}
                                </p>
                                {!storage.loading && !storage.error && storage.usedPct !== null && (
                                    <p className="text-[9px] text-white/20 tabular-nums">
                                        {Math.round(storage.usedPct * 100)}%
                                    </p>
                                )}
                            </div>
                            {storage.error && (
                                <p className="text-[9px] text-white/20 mt-1 truncate" title={storage.error}>
                                    {storage.error}
                                </p>
                            )}
                        </div>
                    </aside>

                    {/* Section List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tightest">DASHBOARD</h2>
                                <p className="text-xs text-white/40 mt-1">Manage every pixel of your brand narrative.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sections.map((section) => (
                                section.title.includes("(GALLERY)") ? (
                                    <CollapsibleAdminCard
                                        key={section.title}
                                        title={section.title}
                                        accentColor={section.accentColor}
                                        itemCount={section.slots.length}
                                        activeCount={section.slots.filter((s) => s.uploadedFile).length}
                                    >
                                        <GalleryManager />
                                    </CollapsibleAdminCard>
                                ) : (
                                    <SectionCard
                                        key={section.title}
                                        title={section.title}
                                        slots={section.slots}
                                        accentColor={section.accentColor}
                                    />
                                )
                            ))}

                            <CollapsibleAdminCard
                                title="JOURNALS"
                                accentColor="#ffffff"
                                itemCount={blogs.length}
                                activeCount={blogs.length}
                            >
                                <BlogManager />
                            </CollapsibleAdminCard>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
                <button
                    onClick={() => setShowGlobalMedia(true)}
                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                </button>
            </div>

            {/* Global Media Library Modal */}
            {showGlobalMedia && (
                <GlobalMediaPanel onClose={() => setShowGlobalMedia(false)} />
            )}

            {/* Package Calculator Modal */}
            <AnimatePresence>
                {showCalculator && (
                    <PackageCalculator onClose={() => setShowCalculator(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

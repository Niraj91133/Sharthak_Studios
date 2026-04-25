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
import SiteSettingsPanel from "@/components/admin/SiteSettingsPanel";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, LogOut, Settings2 } from "lucide-react";

export default function AdminDashboardClient({ initialUsername }: { initialUsername: string }) {
  const { slots, blogs } = useMediaContext();
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

    const colors = ["#FF3D00", "#FFEA00", "#00E676", "#00B0FF", "#D500F9", "#FF5252", "#7C4DFF", "#00E5FF"];
    const validSections = [
      "01. MOBILE HERO SECTION",
      "02. INFINITE STRIPS (DESKTOP)",
      "03. THE COLLECTION (GALLERY)",
      "04. CHOOSE YOUR EXPERTISE",
      "05. INSTAGRAM FEED (LATEST WORK)",
      "06. ABOUT ME SECTION",
      "07. WHY CHOOSE US (BOOK FLIP)",
      "08. STUDIO METRICS",
    ];

    return Object.keys(grouped)
      .filter((title) => validSections.includes(title))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((title, index) => ({
        title,
        slots: grouped[title],
        accentColor: colors[index % colors.length],
      }));
  }, [slots]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen text-white font-sans pb-24 md:pb-12 bg-black">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-black tracking-[0.3em] text-white">SHARTHAK STUDIO CMS</h1>
            <span className="hidden md:block px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-white/30 uppercase tracking-widest">
              {initialUsername}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowTools(!showTools)}
                className={`px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${showTools ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"}`}
              >
                Tools <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showTools ? "rotate-180" : "opacity-40"}`} />
              </button>

              <AnimatePresence>
                {showTools && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowTools(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
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
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-3 h-3 text-white/40" />
                        Logout
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

            <Link href="/" className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              View Site →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
          <aside className="hidden md:block space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase ml-2">Sections</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button key={section.title} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[11px] font-bold text-white/40 hover:text-white transition-all flex items-center gap-3">
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
                  <p className="text-[9px] text-white/20 tabular-nums">{Math.round(storage.usedPct * 100)}%</p>
                )}
              </div>
              {storage.error ? <p className="text-[9px] text-white/20 mt-1 truncate">{storage.error}</p> : null}
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">SEO Ops Checklist</p>
              <ul className="space-y-3 text-[11px] leading-5 text-white/50">
                <li>Publish 2 fresh journal posts every month for local and service keywords.</li>
                <li>Verify Search Console and resubmit sitemap after major content updates.</li>
                <li>Add Google Business Profile URL in site settings after profile verification.</li>
                <li>Review homepage and service-page media so only real portfolio work is shown.</li>
                <li>Run Lighthouse or PageSpeed Insights monthly for performance audits.</li>
              </ul>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tightest">DASHBOARD</h2>
                <p className="text-xs text-white/40 mt-1">Manage every pixel of your brand narrative.</p>
              </div>
            </div>

            <CollapsibleAdminCard title="GLOBAL BRAND SETTINGS" accentColor="#ffffff" defaultOpen>
              <div className="flex items-center gap-3 mb-5">
                <Settings2 className="w-4 h-4 text-white/50" />
                <p className="text-xs text-white/40">Admin credentials, phone, WhatsApp, Gmail, Instagram, address and service areas.</p>
              </div>
              <SiteSettingsPanel initialUsername={initialUsername} />
            </CollapsibleAdminCard>

            <div className="space-y-4">
              {sections.map((section) =>
                section.title.includes("(GALLERY)") ? (
                  <CollapsibleAdminCard
                    key={section.title}
                    title={section.title}
                    accentColor={section.accentColor}
                    itemCount={section.slots.length}
                    activeCount={section.slots.filter((slot) => slot.uploadedFile).length}
                  >
                    <GalleryManager />
                  </CollapsibleAdminCard>
                ) : (
                  <SectionCard key={section.title} title={section.title} slots={section.slots} accentColor={section.accentColor} />
                ),
              )}

              <CollapsibleAdminCard title="JOURNALS" accentColor="#ffffff" itemCount={blogs.length} activeCount={blogs.length}>
                <BlogManager />
              </CollapsibleAdminCard>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 md:hidden z-50 flex flex-col gap-4">
        <button onClick={() => setShowCalculator(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-all">
          <Calculator className="w-6 h-6" />
        </button>
        <button onClick={() => setShowGlobalMedia(true)} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-all">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </button>
      </div>

      {showGlobalMedia ? <GlobalMediaPanel onClose={() => setShowGlobalMedia(false)} /> : null}

      <AnimatePresence>{showCalculator ? <PackageCalculator onClose={() => setShowCalculator(false)} /> : null}</AnimatePresence>
    </div>
  );
}

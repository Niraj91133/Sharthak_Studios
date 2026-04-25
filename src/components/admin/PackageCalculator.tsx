"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Mail, Calculator, Download, Instagram, Globe } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface Service {
    id: string;
    label: string;
    price: number;
}

const AVAILABLE_SERVICES: Service[] = [
    { id: "candid", label: "Candid Photography", price: 15000 },
    { id: "cinematic", label: "Cinematic Video", price: 15000 },
    { id: "trad_photo", label: "Traditional Photo", price: 6000 },
    { id: "trad_video", label: "Traditional Video", price: 6000 },
    { id: "drone", label: "Drone / Aerial", price: 8000 },
    { id: "led_wall", label: "LED Wall", price: 15000 },
    { id: "crane", label: "Crane / Jib", price: 10000 },
];

interface Deliverables {
    cinematicMixing: boolean;
    rawPhotos: boolean;
    highlight: number;
    teaser: number;
    instaReel: number;
    weddingInvitation: number;
    albumSheet: number;
    editedPhotos: number;
}

const DEFAULT_DELIVERABLES: Deliverables = {
    cinematicMixing: false,
    rawPhotos: false,
    highlight: 1,
    teaser: 1,
    instaReel: 1,
    weddingInvitation: 0,
    albumSheet: 50,
    editedPhotos: 200
};

interface DaySelection {
    id: number;
    date?: string;
    services: string[];
    deliverables?: Deliverables;
}

interface PackageCalculatorProps {
    onClose: () => void;
}

export default function PackageCalculator({ onClose }: PackageCalculatorProps) {
    const { settings } = useSiteSettings();
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [customAdjustment, setCustomAdjustment] = useState<number>(0);
    const [days, setDays] = useState<DaySelection[]>([{ id: 1, date: "", services: [], deliverables: { ...DEFAULT_DELIVERABLES } }]);

    // Delivery Config UI State
    const [configDayId, setConfigDayId] = useState<number | null>(null);
    const [tempDeliverables, setTempDeliverables] = useState<Deliverables>(DEFAULT_DELIVERABLES);
    const [applyToAllDays, setApplyToAllDays] = useState(false);
    const [globalDeliverables, setGlobalDeliverables] = useState<Deliverables | null>(null);

    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const pdfExportRef = useRef<HTMLDivElement>(null);

    const addDay = () => {
        const nextId = days.length + 1;
        setDays([...days, {
            id: nextId,
            date: "",
            services: [],
            deliverables: globalDeliverables ? { ...globalDeliverables } : { ...DEFAULT_DELIVERABLES }
        }]);
    };

    const openConfig = (dayId: number) => {
        const day = days.find(d => d.id === dayId);
        if (day) {
            setTempDeliverables(day.deliverables || DEFAULT_DELIVERABLES);
            setConfigDayId(dayId);
            setApplyToAllDays(false);
        }
    };

    const saveConfig = () => {
        if (configDayId === null) return;

        if (applyToAllDays) {
            setGlobalDeliverables({ ...tempDeliverables });
            setDays(prev => prev.map(d => ({ ...d, deliverables: { ...tempDeliverables } })));
        } else {
            setDays(prev => prev.map(d => d.id === configDayId ? { ...d, deliverables: { ...tempDeliverables } } : d));
        }
        setConfigDayId(null);
    };

    const removeDay = (id: number) => {
        if (days.length === 1) return;
        setDays(days.filter(d => d.id !== id).map((d, i) => ({ ...d, id: i + 1 })));
    };

    const toggleService = (dayId: number, serviceId: string) => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            const has = d.services.includes(serviceId);
            return {
                ...d,
                services: has ? d.services.filter(s => s !== serviceId) : [...d.services, serviceId]
            };
        }));
    };

    const totals = useMemo(() => {
        let total = 0;
        const dayBreakdown = days.map(d => {
            let dayTotal = 0;
            const items = d.services.map(sid => {
                const s = AVAILABLE_SERVICES.find(as => as.id === sid);
                const p = s?.price || 0;
                dayTotal += p;
                return { label: s?.label || sid, price: p };
            });
            total += dayTotal;
            return { dayId: d.id, items, dayTotal };
        });

        // Calculate consolidated deliverables for the entire package
        const consolidatedDeliverables = days.reduce((acc, curr) => {
            const d = curr.deliverables || DEFAULT_DELIVERABLES;
            return {
                cinematicMixing: acc.cinematicMixing || d.cinematicMixing,
                rawPhotos: acc.rawPhotos || d.rawPhotos,
                highlight: Math.max(acc.highlight, d.highlight),
                teaser: Math.max(acc.teaser, d.teaser),
                instaReel: Math.max(acc.instaReel, d.instaReel),
                weddingInvitation: Math.max(acc.weddingInvitation, d.weddingInvitation),
                albumSheet: Math.max(acc.albumSheet, d.albumSheet),
                editedPhotos: Math.max(acc.editedPhotos, d.editedPhotos),
            };
        }, { ...DEFAULT_DELIVERABLES, cinematicMixing: false, rawPhotos: false, highlight: 0, teaser: 0, instaReel: 0, weddingInvitation: 0, albumSheet: 0, editedPhotos: 0 });

        return {
            total: total + (customAdjustment || 0),
            dayBreakdown,
            deliverables: consolidatedDeliverables
        };
    }, [days, customAdjustment]);


    const generatePDF = async (shouldDownload: boolean = false) => {
        if (!pdfExportRef.current) return null;
        const element = pdfExportRef.current;

        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
            allowTaint: true,
            windowWidth: 800,
            windowHeight: element.scrollHeight
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        pdf.link(15, imgHeight - 25, 40, 15, { url: settings.phoneHref });
        pdf.link(55, imgHeight - 25, 45, 15, { url: settings.emailHref });
        pdf.link(100, imgHeight - 25, 50, 20, { url: 'https://www.sharthakstudio.com/' });
        pdf.link(155, imgHeight - 25, 50, 20, { url: settings.instagramUrl });

        const filename = `Quote_${clientName.replace(/\s+/g, '_')}.pdf`;

        if (shouldDownload) {
            pdf.save(filename);
        }

        return pdf.output("datauristring").split(",")[1];
    };

    const handleSendAction = async () => {
        if (!clientName) {
            alert("Please enter client name");
            return;
        }
        setIsSending(true);
        setStatus(null);

        try {
            // 1. Generate & Download PDF Locally
            const pdfBase64 = await generatePDF(true);
            if (!pdfBase64) throw new Error("PDF generation failed");

            // 2. Wait a brief moment for the download to trigger on mobile
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 3. Prepare WhatsApp Message (Cleaned)
            const deliveryItems: string[] = [];
            const dConfig = totals.deliverables;
            if (dConfig.cinematicMixing) deliveryItems.push("Full Cinematic Mixing");
            if (dConfig.rawPhotos) deliveryItems.push("All Raw Photos");
            if (dConfig.highlight > 0) deliveryItems.push(`${dConfig.highlight} Highlight Film`);
            if (dConfig.teaser > 0) deliveryItems.push(`${dConfig.teaser} Teaser`);
            if (dConfig.instaReel > 0) deliveryItems.push(`${dConfig.instaReel} Insta Reels`);
            if (dConfig.weddingInvitation > 0) deliveryItems.push(`${dConfig.weddingInvitation} Wedding Invitations`);
            if (dConfig.albumSheet > 0) deliveryItems.push(`${dConfig.albumSheet} Album Sheets`);
            if (dConfig.editedPhotos > 0) deliveryItems.push(`${dConfig.editedPhotos} Edited Photos`);

            const rawMessage = `*✨ QUOTE: SHARTHAK STUDIO ✨*\n\n` +
                `*Client:* ${clientName}\n\n` +
                totals.dayBreakdown.map((d) => {
                    if (d.items.length === 0) return "";
                    const originalDay = days.find(day => day.id === d.dayId);
                    const dateStr = originalDay?.date ? new Date(originalDay.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "";
                    return `*Day ${d.dayId}${dateStr ? ` (${dateStr})` : ""} Overview*\n` +
                        d.items.map(i => `• ${i.label}`).join("\n") +
                        `\n\n`;
                }).join("") +
                `*📦 DELIVERABLES:*\n` +
                (deliveryItems.length > 0 ? deliveryItems.map(i => `• ${i}`).join("\n") : "No deliverables specified") +
                `\n\n` +
                `*TOTAL ESTIMATE: ₹${totals.total.toLocaleString()}*\n\n` +
                `*Thank you for choosing Sharthak Studio!*\n` +
                `*Visit:* www.sharthakstudio.com\n` +
                `*Instagram:* ${settings.instagramHandle}`;

            // 4. Send Email (Automatic)
            const emailRes = await fetch("/api/admin/send-quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName,
                    breakdown: totals.dayBreakdown,
                    total: totals.total,
                    pdfBase64,
                }),
            });

            // 5. Redirect to WhatsApp (Direct App)
            let targetNumber = clientPhone ? clientPhone.replace(/\D/g, '') : "";
            if (targetNumber.length === 10) targetNumber = "91" + targetNumber;

            if (targetNumber) {
                const waAppUrl = `whatsapp://send?phone=${targetNumber}&text=${encodeURIComponent(rawMessage)}`;
                window.location.href = waAppUrl;
            }

            if (emailRes.ok) {
                setStatus({ type: "success", msg: "PDF Downloaded & Email Sent!" });
            } else {
                const data = await emailRes.json();
                setStatus({ type: "error", msg: `Email Failed: ${data.error || "Server error"}` });
            }

        } catch (e: unknown) {
            const error = e as Error;
            console.error("Action Error:", error);
            setStatus({ type: "error", msg: `Error: ${error.message || "Connection error"}` });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        >
            {/* HIDDEN PDF TEMPLATE - COMPACT MODERN REDESIGN */}
            <div className="absolute opacity-0 pointer-events-none -left-[5000px]">
                <div ref={pdfExportRef} style={{ width: '800px', backgroundColor: '#ffffff', color: '#000000', padding: '50px 60px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

                    {/* 1. Header: Compact Branding */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #000', paddingBottom: '20px' }}>
                        <div>
                            <img src="/final-logo.png" crossOrigin="anonymous" alt="Sharthak Studio" style={{ height: '70px', objectFit: 'contain' }} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '3px', color: '#888888', textTransform: 'uppercase' }}>Wedding Quotation For</div>
                            <div style={{ fontSize: '28px', fontWeight: '900', margin: '5px 0 0', textTransform: 'uppercase', letterSpacing: '-1px' }}>{clientName || "Valued Client"}</div>
                        </div>
                    </div>

                    {/* 2. Project Itinerary - 2 Column Grid */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '900', color: '#000', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '8px 15px', display: 'inline-block' }}>
                            The Wedding Itinerary
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
                            {totals.dayBreakdown.map((day) => (
                                day.items.length > 0 && (
                                    <div key={day.dayId} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '900', color: '#bbbbbb', marginBottom: '5px' }}>
                                            DAY {day.dayId.toString().padStart(2, '0')}
                                            {days.find(d => d.id === day.dayId)?.date && ` • ${new Date(days.find(d => d.id === day.dayId)!.date!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-0.2px', color: '#1a1a1a' }}>
                                            {day.items.map(i => i.label).join(" + ")}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* 3. Consolidated Deliverables - Compact 3 Column Grid */}
                    <div style={{ marginBottom: '40px', backgroundColor: '#fbfbfb', padding: '30px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '900', color: '#888888', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px' }}>
                            Project Deliverables
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {Object.entries(totals.deliverables).map(([key, value]) => {
                                if (value === 0) return null;
                                const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
                                const displayValue = typeof value === 'boolean' ? (value ? 'Included' : null) : value;
                                if (displayValue === null) return null;

                                return (
                                    <div key={key}>
                                        <div style={{ fontSize: '9px', fontWeight: '900', color: '#aaaaaa', letterSpacing: '1px', marginBottom: '2px' }}>{label}</div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#000' }}>{displayValue}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4. Total Investment - Compact */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px', backgroundColor: '#000', borderRadius: '12px', color: '#fff' }}>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.6 }}>Total Investment</div>
                            <div style={{ fontSize: '10px', opacity: 0.4 }}>All inclusive wedding package</div>
                        </div>
                        <div style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-1.5px' }}>
                            ₹{totals.total.toLocaleString()}
                        </div>
                    </div>

                    {/* 5. Minimal Footer */}
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px' }}>
                        <div style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', color: '#888888', letterSpacing: '1px', lineHeight: '1.8' }}>
                            Gaya, Bihar, India<br />
                            {settings.phoneDisplay} | {settings.email}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', justifyContent: 'flex-end' }}>
                                <div style={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.5px' }}>
                                    🌐 SHARTHAKSTUDIO.COM
                                </div>
                                <div style={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.5px' }}>
                                    📸 {settings.instagramHandle.toUpperCase()}
                                </div>
                            </div>
                            <div style={{ fontSize: '7px', color: '#dddddd', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Prepared on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl max-h-[96vh] md:max-h-[90vh] rounded-[24px] md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="px-6 py-6 md:px-10 md:py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-white text-black rounded-[12px] md:rounded-[20px] shadow-xl flex items-center justify-center">
                            <Calculator className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-black tracking-tight uppercase italic">Quote Builder</h2>
                            <p className="text-[8px] md:text-[10px] tracking-[0.3em] text-white/30 uppercase mt-0.5 font-bold">Premium Studio Engine</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-12">
                    {/* Main Calculator UI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3 md:space-y-4">
                            <label className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/30 uppercase ml-1">Client Name</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-6 text-base md:text-xl font-bold focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                                placeholder="e.g. Rahul & Priya"
                            />
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            <label className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/30 uppercase ml-1">WhatsApp No. (Optional)</label>
                            <input
                                type="text"
                                inputMode="tel"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-6 text-base md:text-xl font-bold focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                                placeholder="91XXXXXXXXXX"
                            />
                        </div>
                    </div>


                    <div className="space-y-6 md:space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Itinerary Setup</h3>
                            <button
                                onClick={addDay}
                                className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-white text-black hover:bg-white/90 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                <Plus className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden md:inline">Add New</span> Day
                            </button>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            {days.map((day) => (
                                <div key={day.id} className="p-5 md:p-8 bg-white/[0.02] border border-white/5 rounded-[24px] md:rounded-[32px] space-y-6 md:space-y-8 relative group hover:border-white/10 transition-colors shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                                            <span className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white/10 flex items-center justify-center text-[9px] md:text-[10px] font-black italic text-white/80">DAY {day.id}</span>
                                            <input
                                                type="date"
                                                value={day.date}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setDays(days.map(d => d.id === day.id ? { ...d, date: val } : d));
                                                }}
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white focus:outline-none focus:border-white/40 transition-all"
                                            />
                                            <button
                                                onClick={() => openConfig(day.id)}
                                                className="px-3 py-1 md:px-4 md:py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95"
                                            >
                                                Configure
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {days.length > 1 && (
                                                <button
                                                    onClick={() => removeDay(day.id)}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-red-500/20 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all md:opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                                        {AVAILABLE_SERVICES.map((service) => {
                                            const active = day.services.includes(service.id);
                                            return (
                                                <button
                                                    key={service.id}
                                                    onClick={() => toggleService(day.id, service.id)}
                                                    className={`px-3 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${active
                                                        ? "bg-white text-black border-white shadow-xl scale-[1.02]"
                                                        : "bg-white/5 text-white/40 border-white/5 hover:border-white/30 hover:bg-white/[0.08]"
                                                        }`}
                                                >
                                                    {service.label} <span className="block opacity-50 text-[7px] mt-0.5">₹{(service.price / 1000).toFixed(0)}k</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 md:p-10 bg-white text-black rounded-[24px] md:rounded-[40px] space-y-6 md:space-y-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />

                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase opacity-30 italic">Grand Summary</h3>
                            <div className="text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase opacity-30">PREMIUM PACKAGE</div>
                        </div>

                        <div className="space-y-4 md:space-y-5 relative z-10">
                            {totals.dayBreakdown.map((d) => (
                                d.items.length > 0 && (
                                    <div key={d.dayId} className="flex justify-between items-center py-4 md:py-6 border-b border-black/[0.08]">
                                        <div className="max-w-[65%]">
                                            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Day {d.dayId}</div>
                                            <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/80 truncate">
                                                {d.items.map(i => i.label).join(", ")}
                                            </div>
                                        </div>
                                        <div className="text-xl md:text-2xl font-black tabular-nums italic">₹{d.dayTotal.toLocaleString()}</div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div className="pt-6 md:pt-8 flex justify-between items-center text-2xl md:text-4xl font-black italic relative z-10">
                            <div className="flex flex-col">
                                <span className="uppercase tracking-tightest opacity-20 text-xs md:text-xl">Total Investment</span>
                                <span className="text-[7px] md:text-[8px] uppercase tracking-widest opacity-30 mt-1 font-black not-italic">Directly Editable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-40">₹</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={totals.total}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const baseTotal = totals.total - (customAdjustment || 0);
                                        setCustomAdjustment(val - baseTotal);
                                    }}
                                    className="bg-transparent border-none outline-none w-32 md:w-56 text-right font-black tabular-nums focus:text-blue-600 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                            >
                                {status.msg}
                            </motion.div>
                        )}
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            disabled={isSending || totals.total === 0}
                            onClick={handleSendAction}
                            className="flex-1 md:flex-none flex items-center justify-center gap-4 px-12 py-5 bg-white text-black rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-20 shadow-2xl"
                        >
                            {isSending ? (
                                "GENERATING & SENDING..."
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" /> Finalize & Send Quote
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* DELIVERABLES CONFIG MODAL */}
            <AnimatePresence>
                {configDayId !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black uppercase italic italic">Configure Day {configDayId} Deliveries</h3>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Select items to be delivered for this day</p>
                                </div>
                                <button onClick={() => setConfigDayId(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-10 space-y-10 overflow-y-auto max-h-[60vh]">
                                {/* Choosable Items */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setTempDeliverables(prev => ({ ...prev, cinematicMixing: !prev.cinematicMixing }))}
                                        className={`p-6 rounded-3xl border transition-all text-left ${tempDeliverables.cinematicMixing ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Video Edit</div>
                                        <div className="text-sm font-black uppercase italic">Cinematic Mixing</div>
                                    </button>
                                    <button
                                        onClick={() => setTempDeliverables(prev => ({ ...prev, rawPhotos: !prev.rawPhotos }))}
                                        className={`p-6 rounded-3xl border transition-all text-left ${tempDeliverables.rawPhotos ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Photography</div>
                                        <div className="text-sm font-black uppercase italic">All Raw Photos</div>
                                    </button>
                                </div>

                                {/* Increasable/Decreasable Counters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    {[
                                        { label: "Highlite / Cinematic", key: "highlight" },
                                        { label: "Teaser", key: "teaser" },
                                        { label: "Insta Reel", key: "instaReel" },
                                        { label: "Wedding Invitation", key: "weddingInvitation" },
                                        { label: "Album Sheet", key: "albumSheet" },
                                        { label: "Edited Photos", key: "editedPhotos" },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between group">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                                            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                                                <button
                                                    onClick={() => setTempDeliverables(p => ({ ...p, [item.key]: Math.max(0, (p[item.key as keyof Deliverables] as number) - 1) }))}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-black italic text-blue-400">{(tempDeliverables[item.key as keyof Deliverables] as number)}</span>
                                                <button
                                                    onClick={() => setTempDeliverables(p => ({ ...p, [item.key]: (p[item.key as keyof Deliverables] as number) + 1 }))}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-white/5 border-t border-white/5 flex items-center justify-between">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div
                                        onClick={() => setApplyToAllDays(!applyToAllDays)}
                                        className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${applyToAllDays ? 'bg-blue-500 border-blue-400' : 'border-white/10 bg-white/5 group-hover:border-white/30'}`}
                                    >
                                        {applyToAllDays && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Apply to all days</span>
                                </label>

                                <button
                                    onClick={saveConfig}
                                    className="px-8 py-4 bg-white text-black rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div >
    );
}

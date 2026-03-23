"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LeadCapturePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        eventName: "",
        eventDate: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Show after 3 seconds on first visit
        const hasSeen = localStorage.getItem("sharthak_lead_popup_v1");
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("sharthak_lead_popup_v1", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('leads').insert([{
                name: formData.name,
                phone: formData.phone,
                event_name: formData.eventName,
                event_date: formData.eventDate || null
            }]);

            if (error) throw error;

            // 2. Trigger Email Notification (Non-blocking)
            fetch('/api/send-lead-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    event_name: formData.eventName,
                    event_date: formData.eventDate
                })
            }).catch(e => console.error("Email notification failed:", e));

            setIsSubmitted(true);
            localStorage.setItem("sharthak_lead_popup_v1", "true");
            setTimeout(() => setIsOpen(false), 2000);
        } catch (err) {
            console.error("Lead submission failed:", err);
            alert("Submission failed. Please try again or WhatsApp us directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl p-8 sm:p-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {isSubmitted ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black tracking-tight uppercase">Thank You!</h3>
                                <p className="text-sm text-white/40 font-medium">We&apos;ll get back to you shortly.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Book Your Story</h3>
                                    <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-bold">Inquiry Form</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <input
                                                required
                                                type="text"
                                                placeholder="YOUR NAME"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all uppercase"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <input
                                                required
                                                type="tel"
                                                placeholder="MOBILE NUMBER"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all uppercase"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="EVENT NAME"
                                                className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all uppercase"
                                                value={formData.eventName}
                                                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold tracking-widest text-white/60 outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all uppercase appearance-none"
                                                value={formData.eventDate}
                                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full h-14 bg-white text-black text-[10px] font-black tracking-[0.4em] uppercase rounded-2xl flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            "Submit Inquiry"
                                        )}
                                    </button>
                                </form>

                                <p className="text-[9px] text-center text-white/20 font-bold tracking-widest uppercase italic">
                                    Trusted by 750+ Families
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

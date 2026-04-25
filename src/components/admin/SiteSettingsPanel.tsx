"use client";

import { useMemo, useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function SiteSettingsPanel({ initialUsername }: { initialUsername: string }) {
  const { settings, setSettings } = useSiteSettings();
  const [adminUsername, setAdminUsername] = useState(initialUsername);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: settings.name,
    legalName: settings.legalName,
    founder: settings.founder,
    phoneDisplay: settings.phoneDisplay,
    phoneDigits: settings.phoneDigits,
    whatsappNumber: settings.whatsappNumber,
    email: settings.email,
    instagramUrl: settings.instagramUrl,
    instagramHandle: settings.instagramHandle,
    googleBusinessProfileUrl: settings.googleBusinessProfileUrl,
    addressLine1: settings.addressLine1,
    city: settings.city,
    state: settings.state,
    postalCode: settings.postalCode,
    country: settings.country,
    serviceAreas: settings.serviceAreas.join(", "),
  });

  const hasAuthChanges = useMemo(
    () => adminUsername.trim() !== initialUsername.trim() || newPassword.trim().length > 0,
    [adminUsername, initialUsername, newPassword],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public: {
            ...form,
            serviceAreas: form.serviceAreas
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
          admin: {
            username: adminUsername,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to save settings.");
        return;
      }

      setSettings(data.public);
      setAdminUsername(data.admin?.username || adminUsername);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Settings saved. Website now uses the updated contact details.");
    } catch {
      setError("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Studio Name" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.legalName} onChange={(e) => updateField("legalName", e.target.value)} placeholder="Legal Name" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.founder} onChange={(e) => updateField("founder", e.target.value)} placeholder="Founder Name" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.phoneDisplay} onChange={(e) => updateField("phoneDisplay", e.target.value)} placeholder="Display Phone" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.phoneDigits} onChange={(e) => updateField("phoneDigits", e.target.value)} placeholder="Phone Digits" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)} placeholder="WhatsApp Number" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.instagramHandle} onChange={(e) => updateField("instagramHandle", e.target.value)} placeholder="Instagram Handle" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.instagramUrl} onChange={(e) => updateField("instagramUrl", e.target.value)} placeholder="Instagram URL" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30 md:col-span-2" />
        <input value={form.googleBusinessProfileUrl} onChange={(e) => updateField("googleBusinessProfileUrl", e.target.value)} placeholder="Google Business Profile URL" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30 md:col-span-2" />
        <input value={form.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="Address" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30 md:col-span-2" />
        <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.state} onChange={(e) => updateField("state", e.target.value)} placeholder="State" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="Postal Code" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="Country Code" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        <input value={form.serviceAreas} onChange={(e) => updateField("serviceAreas", e.target.value)} placeholder="Service Areas, comma separated" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30 md:col-span-2" />
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white/90">Admin Credentials</h4>
          <p className="text-xs text-white/40 mt-1">Username/password change ke liye current password required hai.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} placeholder="Admin Username" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-white/30" />
        </div>
        {hasAuthChanges && !currentPassword ? (
          <p className="text-xs text-yellow-300">Username ya password update karne ke liye current password bharna padega.</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-green-400">{message}</p> : null}

      <button
        type="submit"
        disabled={isSaving || (hasAuthChanges && !currentPassword)}
        className="h-12 px-6 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Global Settings"}
      </button>
    </form>
  );
}

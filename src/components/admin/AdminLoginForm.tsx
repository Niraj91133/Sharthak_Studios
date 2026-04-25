"use client";

import { useState } from "react";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed.");
        return;
      }

      window.location.reload();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-white/10 bg-white/[0.03] rounded-[32px] p-8 md:p-10">
        <div className="space-y-3 text-center mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold">Secure Access</p>
          <h1 className="text-3xl font-black tracking-tight">Admin Login</h1>
          <p className="text-sm text-white/40">Use your admin username and password to open the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-bold tracking-widest outline-none focus:border-white/30"
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-bold tracking-widest outline-none focus:border-white/30"
            autoComplete="current-password"
            required
          />

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-white text-black text-[10px] font-black tracking-[0.35em] uppercase disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Open Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

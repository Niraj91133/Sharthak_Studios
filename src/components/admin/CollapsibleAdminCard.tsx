"use client";

import React, { useState } from "react";

type CollapsibleAdminCardProps = {
  title: string;
  accentColor: string;
  itemCount?: number;
  activeCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function CollapsibleAdminCard({
  title,
  accentColor,
  itemCount,
  activeCount,
  defaultOpen = false,
  children,
}: CollapsibleAdminCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const safeItemCount = typeof itemCount === "number" ? itemCount : null;
  const safeActiveCount = typeof activeCount === "number" ? activeCount : null;
  const showProgressBadge =
    safeItemCount !== null && safeItemCount > 0 && safeActiveCount !== null && safeActiveCount > 0;
  const percentComplete =
    showProgressBadge ? Math.round((safeActiveCount! / safeItemCount!) * 100) : null;

  return (
    <div
      className={[
        "bg-[#0f0f0f] border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-500",
        isOpen ? "ring-1 ring-white/10" : "hover:border-white/10",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full px-6 py-5 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
              {title}
            </h3>
            {safeItemCount !== null && safeActiveCount !== null && (
              <p className="text-[10px] uppercase tracking-widest text-white/20 mt-0.5">
                {safeItemCount} Total • {safeActiveCount} Active
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {percentComplete !== null && (
            <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-white/40">
              {percentComplete}% COMPLETE
            </span>
          )}
          <svg
            className={[
              "w-5 h-5 text-white/20 transition-transform duration-500",
              isOpen ? "rotate-180" : "",
            ].join(" ")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        className={[
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-8 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}


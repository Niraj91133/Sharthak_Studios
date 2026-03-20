"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Strictly Client-Side rendering for the entire app content
// This is the safest pattern for Next.js to prevent hydration errors and dev server crashes
const AppContent = dynamic(() => import("./AppContent"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "20px",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <img src="/logo-white.png" alt="Loading Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.95); }
          }
        `}</style>
        <p style={{ letterSpacing: "0.2em", fontSize: "11px", opacity: 0.5, fontWeight: "bold" }}>LOADING SHARTHAK STUDIO</p>
      </div>
    </div>
  )
});

export default function HomeClient() {
  return <AppContent />;
}

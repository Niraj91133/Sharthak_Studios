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
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTop: "3px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ letterSpacing: "0.2em", fontSize: "11px", opacity: 0.5, fontWeight: "bold" }}>LOADING SHARTHAK STUDIO</p>
      </div>
    </div>
  )
});

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}
      >
        <p style={{ letterSpacing: "0.3em", fontSize: "10px", opacity: 0.4 }}>READY</p>
      </div>
    );
  }

  return <AppContent />;
}

import React from "react";

export default function SplashScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#080808", gap: 16,
      fontFamily: "'Barlow Condensed', sans-serif",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 22,
        background: "linear-gradient(135deg, #16a34a, #0a5c1e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40, boxShadow: "0 8px 32px rgba(74,222,128,0.2)",
      }}>⚡</div>
      <div style={{ fontSize: 13, letterSpacing: 5, color: "#4ade80", fontWeight: 700 }}>
        LEAN PLATE
      </div>
      <div style={{
        width: 40, height: 3, background: "#1e1e1e",
        borderRadius: 2, overflow: "hidden", marginTop: 8,
      }}>
        <div style={{
          height: "100%", background: "#4ade80", borderRadius: 2,
          animation: "loading 1.2s ease-in-out infinite",
        }} />
      </div>
      <style>{`
        @keyframes loading {
          0%   { width: 0%; }
          50%  { width: 100%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

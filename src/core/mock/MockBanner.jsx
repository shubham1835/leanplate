// src/core/mock/MockBanner.jsx
// Shows a non-intrusive banner at the top when VITE_USE_MOCK=true
// Renders nothing in production or when mock is off
import React from "react";
import { USE_MOCK } from "./serviceFactory";

export default function MockBanner() {
  if (!USE_MOCK) return null;

  return (
    <div style={{
      background: "#052e16",
      borderBottom: "1px solid rgba(74,222,128,0.3)",
      padding: "5px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      flexShrink: 0,
      zIndex: 999,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          background: "#4ade80", color: "#000",
          borderRadius: 4, padding: "1px 7px",
          fontSize: 9, fontWeight: 900, letterSpacing: 1,
        }}>
          MOCK
        </span>
        <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>
          Mock mode active — no backend needed
        </span>
      </div>
      <span style={{ fontSize: 10, color: "rgba(74,222,128,0.5)" }}>
        OTP: 123456
      </span>
    </div>
  );
}

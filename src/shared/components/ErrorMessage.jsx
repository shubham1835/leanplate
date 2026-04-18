import React from "react";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div style={{
      background: "rgba(248,113,113,0.08)",
      border: "1px solid rgba(248,113,113,0.25)",
      borderRadius: 12, padding: "12px 16px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 12,
    }}>
      <span style={{ fontSize: 13, color: "#f87171", fontWeight: 600 }}>
        ⚠ {message}
      </span>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: "none", border: "1px solid rgba(248,113,113,0.4)",
          borderRadius: 7, padding: "5px 12px",
          color: "#f87171", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
        }}>Retry</button>
      )}
    </div>
  );
}

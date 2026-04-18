import React from "react";
import { TAG_STYLES } from "@shared/constants/menuConstants";

export default function Tag({ label }) {
  const s = TAG_STYLES[label] || TAG_STYLES.default;
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 5, padding: "2px 7px",
      fontSize: 10, fontWeight: 700,
      letterSpacing: 0.4, textTransform: "uppercase",
      fontFamily: "inherit", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

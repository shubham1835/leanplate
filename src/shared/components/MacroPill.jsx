import React from "react";
import styles from "./MacroPill.module.css";

const COLOR_MAP = {
  protein: "#60a5fa",
  carbs:   "#facc15",
  fat:     "#f87171",
  cal:     "#4ade80",
};

/**
 * MacroPill — shows a single macro value with label
 * @param {"protein"|"carbs"|"fat"|"cal"} type
 * @param {"sm"|"lg"} size
 */
export default function MacroPill({ label, value, type, size = "sm" }) {
  const color = COLOR_MAP[type] || "#94a3b8";
  const unit  = type === "cal" ? "" : "g";
  return (
    <div className={`${styles.pill} ${styles[size]}`}>
      <span className={styles.value} style={{ color }}>{value}{unit}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

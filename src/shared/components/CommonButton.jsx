import React from "react";
import styles from "./CommonButton.module.css";

/**
 * CommonButton
 * @param {string}   variant   - "primary" | "outline" | "ghost" | "flat"
 * @param {string}   color     - CSS colour override (default: theme green)
 * @param {string}   size      - "sm" | "md" | "lg"
 * @param {boolean}  full      - full width
 * @param {boolean}  disabled
 * @param {boolean}  loading
 */
export default function CommonButton({
  children, onClick, variant = "primary", color,
  size = "md", full = false, disabled = false,
  loading = false, type = "button", style: sx = {},
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    full     ? styles.full     : "",
    disabled ? styles.disabled : "",
    loading  ? styles.loading  : "",
  ].join(" ");

  const inlineStyle = color
    ? variant === "primary"
      ? { background: color, borderColor: color }
      : { color, borderColor: color }
    : {};

  return (
    <button
      type={type}
      className={cls}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      style={{ ...inlineStyle, ...sx }}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

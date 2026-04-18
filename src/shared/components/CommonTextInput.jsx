import React from "react";
import styles from "./CommonTextInput.module.css";

/**
 * CommonTextInput — wraps <input> with label, error, prefix/suffix
 */
export default function CommonTextInput({
  label, name, value, onChange, onBlur, onKeyDown,
  placeholder, type = "text", error, touched,
  prefix, suffix, disabled = false, autoFocus = false,
  inputMode, maxLength, style: sx = {},
}) {
  const showError = touched && error;

  return (
    <div className={styles.wrapper} style={sx}>
      {label && <label className={styles.label} htmlFor={name}>{label}</label>}
      <div className={`${styles.inputRow} ${showError ? styles.inputRowError : ""}`}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          inputMode={inputMode}
          maxLength={maxLength}
          className={styles.input}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {showError && <span className={styles.error}>{error}</span>}
    </div>
  );
}

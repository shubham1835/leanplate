import React from "react";
import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

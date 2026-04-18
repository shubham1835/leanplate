import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderBar.module.css";

export default function HeaderBar({ title, showBack = false, right }) {
  const navigate = useNavigate();
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.back} onClick={() => navigate(-1)}>←</button>
        )}
        {title && <span className={styles.title}>{title}</span>}
      </div>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
}

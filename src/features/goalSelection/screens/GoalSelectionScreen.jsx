import React, { useState } from "react";
import useGoalSelection from "../hooks/useGoalSelection";
import styles from "../styles/styles.module.css";

export default function GoalSelectionScreen() {
  const { goals, user, handleSelect } = useGoalSelection();
  const [selected, setSelected]       = useState(null);

  const onSelect = (id) => {
    setSelected(id);
    setTimeout(() => handleSelect(id), 400);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.welcome}>⚡ WELCOME, {(user?.name || "there").toUpperCase()}</div>
        <h1 className={styles.title}>
          WHAT'S YOUR<br />
          <span className={styles.titleAccent}>GOAL TODAY?</span>
        </h1>
        <p className={styles.subtitle}>Your meal plan is personalised based on your fitness goal.</p>
      </div>

      <div className={styles.goalList}>
        {goals.map((g) => {
          const isSelected = selected === g.id;
          return (
            <button
              key={g.id}
              className={`${styles.goalCard} ${isSelected ? styles.goalCardActive : ""}`}
              style={isSelected ? {
                background: g.bg,
                border: `2px solid ${g.color}`,
                boxShadow: `0 0 24px ${g.color}22`,
              } : {}}
              onClick={() => onSelect(g.id)}
            >
              <div className={styles.goalIcon}
                style={{ background: g.bg, border: `1.5px solid ${g.color}33` }}>
                {g.icon}
              </div>
              <div className={styles.goalText}>
                <div className={styles.goalLabel}
                  style={{ color: isSelected ? g.color : "#16a34a" }}>
                  {g.label}
                </div>
                <div className={styles.goalDesc}>{g.desc}</div>
              </div>
              <div className={styles.goalCheck}
                style={{
                  background: isSelected ? g.color : "transparent",
                  border: `2px solid ${isSelected ? g.color : "#1e1e1e"}`,
                  color: "#000",
                }}>
                {isSelected ? "✓" : ""}
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>📍 Lean Plate Diet Café · Sweat Arena Gym, Keshav Nagar, Pune</div>
    </div>
  );
}

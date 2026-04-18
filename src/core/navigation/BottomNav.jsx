import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "@core/store/reducers/cartSlice";
import { SCREEN_NAMES } from "./routes";
import styles from "./BottomNav.module.css";

const TAB_CONFIG = [
  { path: SCREEN_NAMES.HOME,     icon: "⚡", label: "Home" },
  { path: SCREEN_NAMES.MENU,     icon: "🥗", label: "Menu" },
  { path: SCREEN_NAMES.ORDERS,   icon: "📋", label: "Orders" },
  { path: SCREEN_NAMES.PROGRESS, icon: "📈", label: "Progress" },
  { path: SCREEN_NAMES.PROFILE,  icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const location   = useLocation();
  const cartCount  = useSelector(selectCartCount);
  const hideOnPaths = [SCREEN_NAMES.CHECKOUT];
  if (hideOnPaths.includes(location.pathname)) return null;

  return (
    <nav className={styles.nav}>
      {TAB_CONFIG.map((tab) => {
        const isActive = location.pathname === tab.path;
        const badge    = tab.path === SCREEN_NAMES.ORDERS && cartCount > 0;
        return (
          <NavLink key={tab.path} to={tab.path} className={styles.tab}>
            <div className={styles.iconWrap}>
              <span className={`${styles.icon} ${isActive ? styles.iconActive : ""}`}>
                {tab.icon}
              </span>
              {badge && <span className={styles.badge}>{cartCount}</span>}
            </div>
            <span className={`${styles.label} ${isActive ? styles.labelActive : ""}`}>
              {tab.label}
            </span>
            {isActive && <div className={styles.indicator} />}
          </NavLink>
        );
      })}
    </nav>
  );
}

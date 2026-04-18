import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "@core/store/reducers/cartSlice";
import { selectUser } from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "./routes";
import styles from "./SideNav.module.css";

const NAV_ITEMS = [
  { path: SCREEN_NAMES.HOME,     icon: "⚡", label: "Home" },
  { path: SCREEN_NAMES.MENU,     icon: "🥗", label: "Menu" },
  { path: SCREEN_NAMES.ORDERS,   icon: "📋", label: "Orders" },
  { path: SCREEN_NAMES.PROGRESS, icon: "📈", label: "Progress" },
  { path: SCREEN_NAMES.PLANS,    icon: "🎯", label: "Plans" },
  { path: SCREEN_NAMES.PROFILE,  icon: "👤", label: "Profile" },
];

export default function SideNav() {
  const location  = useLocation();
  const cartCount = useSelector(selectCartCount);
  const user      = useSelector(selectUser);
  const navigate  = useNavigate();

  return (
    <aside className={styles.aside}>
      {/* Brand */}
      <div className={styles.brand} onClick={() => navigate(SCREEN_NAMES.HOME)}>
        <div className={styles.brandIcon}>⚡</div>
        <div>
          <div className={styles.brandName}>Lean Plate</div>
          <div className={styles.brandTagline}>Healthy Meal Plans</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const hasBadge = item.path === SCREEN_NAMES.ORDERS && cartCount > 0;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
              {hasBadge && <span className={styles.badge}>{cartCount}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className={styles.spacer} />

      {/* User info at bottom */}
      {user && (
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user.name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <div className={styles.userName}>{user.name?.split(" ")[0]}</div>
            <div className={styles.userEmail}>{user.phone}</div>
          </div>
        </div>
      )}
    </aside>
  );
}

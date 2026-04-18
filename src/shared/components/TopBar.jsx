import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "@core/store/reducers/cartSlice";
import { selectIsAdmin } from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";
import styles from "./TopBar.module.css";

// These are "root" tabs — no back arrow shown here
const ROOT_PATHS = new Set([
  SCREEN_NAMES.HOME,
  SCREEN_NAMES.MENU,
  SCREEN_NAMES.ORDERS,
  SCREEN_NAMES.PROGRESS,
  SCREEN_NAMES.PROFILE,
  SCREEN_NAMES.PLANS,
]);

export default function TopBar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const cartCount  = useSelector(selectCartCount);
  const isAdmin    = useSelector(selectIsAdmin);

  const isRoot     = ROOT_PATHS.has(location.pathname);
  const isCheckout = location.pathname === SCREEN_NAMES.CHECKOUT;
  const isAdminPage = location.pathname === SCREEN_NAMES.ADMIN;
  const showCart   = cartCount > 0 && !isCheckout;

  return (
    <div className={styles.bar}>
      {/* Left: back arrow or spacer */}
      <div className={styles.left}>
        {!isRoot ? (
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      {/* Centre: brand */}
      <div className={styles.centre}>
        <button
          className={styles.brand}
          onClick={() => navigate(SCREEN_NAMES.HOME)}
          aria-label="LeanPlate home"
        >
          ⚡ Leanplate
        </button>
      </div>

      {/* Right: cart icon + optional admin */}
      <div className={styles.right}>
        {showCart && (
          <button
            className={styles.cartBtn}
            onClick={() => navigate(SCREEN_NAMES.CHECKOUT)}
            aria-label={`View cart – ${cartCount} item${cartCount > 1 ? "s" : ""}`}
          >
            🛒
            <span className={styles.cartBadge}>{cartCount}</span>
          </button>
        )}

        {isAdmin && (
          <button
            className={styles.adminBtn}
            onClick={() => navigate(isAdminPage ? SCREEN_NAMES.HOME : SCREEN_NAMES.ADMIN)}
            aria-label={isAdminPage ? "Exit admin" : "Admin panel"}
          >
            {isAdminPage ? "✕" : "⚙"}
          </button>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectCartCount, selectCartTotal } from "@core/store/reducers/cartSlice";
import { selectIsAuthenticated } from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";
import styles from "./CartFAB.module.css";

const HIDE_ON = [SCREEN_NAMES.CHECKOUT];

export default function CartFAB() {
  const count           = useSelector(selectCartCount);
  const total           = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate        = useNavigate();
  const location        = useLocation();

  if (!count || HIDE_ON.includes(location.pathname)) return null;

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login, remembering they wanted to checkout
      navigate(SCREEN_NAMES.LOGIN, { state: { from: SCREEN_NAMES.CHECKOUT } });
    } else {
      navigate(SCREEN_NAMES.CHECKOUT);
    }
  };

  return (
    <button className={styles.fab} onClick={handleClick}>
      <div className={styles.left}>
        <span className={styles.badge}>{count}</span>
        <span className={styles.text}>
          {count} item{count > 1 ? "s" : ""}
          {!isAuthenticated ? " · Login to Order" : " · View Order"}
        </span>
      </div>
      <span className={styles.price}>₹{total.toLocaleString("en-IN")} →</span>
    </button>
  );
}

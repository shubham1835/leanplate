import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SCREEN_NAMES } from "./routes";
import SideNav   from "./SideNav";
import BottomNav from "./BottomNav";
import TopBar    from "@shared/components/TopBar";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsAdmin } from "@core/store/reducers/userSlice";
import styles    from "./MainNavigator.module.css";

import HomeScreen     from "@features/home/screens/HomeScreen";
import MenuScreen     from "@features/menu/screens/MenuScreen";
import CheckoutScreen from "@features/checkout/screens/CheckoutScreen";
import OrdersScreen   from "@features/orders/screens/OrdersScreen";
import ProgressScreen from "@features/progress/screens/ProgressScreen";
import PlansScreen    from "@features/plans/screens/PlansScreen";
import ProfileScreen  from "@features/profile/screens/ProfileScreen";
import AdminScreen    from "@features/admin/screens/AdminScreen";

const TABS = [
  SCREEN_NAMES.HOME,
  SCREEN_NAMES.MENU,
  SCREEN_NAMES.ORDERS,
  SCREEN_NAMES.PROGRESS,
  SCREEN_NAMES.PROFILE,
];

export default function MainNavigator() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to={SCREEN_NAMES.LOGIN} replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to={SCREEN_NAMES.LOGIN} replace />;
    if (!isAdmin) return <Navigate to={SCREEN_NAMES.HOME} replace />;
    return children;
  };

  return (
    <div className={styles.shell}>
      {/* Desktop sidebar */}
      <div className={styles.sidebar}>
        <SideNav />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <TopBar />
        <Routes>
          <Route path="/"         element={<HomeScreen />} />
          <Route path="/menu"     element={<MenuScreen />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen /></ProtectedRoute>} />
          <Route path="/orders"   element={<ProtectedRoute><OrdersScreen /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
          <Route path="/plans"    element={<ProtectedRoute><PlansScreen /></ProtectedRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/admin"    element={<AdminRoute><AdminScreen /></AdminRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Mobile bottom nav */}
      <div className={styles.bottomNavWrap}>
        <BottomNav tabs={TABS} />
      </div>
    </div>
  );
}

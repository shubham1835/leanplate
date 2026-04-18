// src/core/navigation/AppNavigator.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsAdmin } from "@core/store/reducers/userSlice";
import { selectGoal } from "@core/store/reducers/goalSlice";
import { SCREEN_NAMES } from "./routes";

import AuthNavigator       from "./AuthNavigator";
import MainNavigator       from "./MainNavigator";
import GoalSelectionScreen from "@features/goalSelection/screens/GoalSelectionScreen";

export default function AppNavigator() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);
  const goal            = useSelector(selectGoal);

  return (
    <Routes>
      {/* Always public: auth flow */}
      <Route path="/auth/*" element={<AuthNavigator />} />

      {/* Goal selection — open to guests too */}
      <Route path={SCREEN_NAMES.GOAL_SELECTION} element={<GoalSelectionScreen />} />

  // Removed exact protected routes from here. Protected routes are now handled dynamically
  // within MainNavigator to prevent React-Router v6 descendant matching issues.

      {/* Home + Menu — fully public (guests land here by default) */}
      <Route
        path="/*"
        element={
          isAuthenticated && !goal && !isAdmin
            ? <Navigate to={SCREEN_NAMES.GOAL_SELECTION} replace />
            : <MainNavigator />
        }
      />
    </Routes>
  );
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SCREEN_NAMES } from "./routes";

import OtpGenerationScreen  from "@features/otpGeneration/screens/OtpGenerationScreen";
import OtpVerificationScreen from "@features/otpVerification/screens/OtpVerificationScreen";

// Unauthenticated routes only
export default function AuthNavigator() {
  return (
    <Routes>
      <Route path="login"  element={<OtpGenerationScreen />} />
      <Route path="verify" element={<OtpVerificationScreen />} />
      <Route path="*"      element={<Navigate to="login" replace />} />
    </Routes>
  );
}

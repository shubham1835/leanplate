import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppNavigator from "@core/navigation/AppNavigator";
import ErrorBoundary from "@screens/ErrorBoundary";
import MockBanner from "@core/mock/MockBanner";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div style={{
          display: "flex", flexDirection: "column",
          minHeight: "100dvh", background: "#f8fafc",
        }}>
          <MockBanner />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <AppNavigator />
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

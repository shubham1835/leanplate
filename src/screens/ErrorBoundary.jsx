import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, send to Sentry / logging service
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#080808", color: "#f1f5f9",
        padding: 32, gap: 20, fontFamily: "'Barlow Condensed', sans-serif",
      }}>
        <div style={{ fontSize: 56 }}>⚠️</div>
        <div style={{ fontSize: 24, fontWeight: 900 }}>Something went wrong</div>
        <div style={{ fontSize: 13, color: "#475569", textAlign: "center", maxWidth: 280 }}>
          The app encountered an unexpected error. Please refresh to continue.
        </div>
        {import.meta.env.DEV && (
          <pre style={{
            background: "#141414", border: "1px solid #1e1e1e",
            borderRadius: 10, padding: 14,
            fontSize: 11, color: "#f87171",
            maxWidth: "100%", overflowX: "auto",
          }}>
            {this.state.error?.toString()}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#4ade80", color: "#000",
            border: "none", borderRadius: 11, padding: "13px 28px",
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Refresh App
        </button>
      </div>
    );
  }
}

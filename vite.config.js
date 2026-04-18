import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo192.png"],
      manifest: {
        name: "Lean Plate Diet Café",
        short_name: "LeanPlate",
        description: "Fuel your goals. One meal at a time.",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "logo192.png", sizes: "192x192", type: "image/png" },
          { src: "logo512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@core":    path.resolve(__dirname, "src/core"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared":  path.resolve(__dirname, "src/shared"),
      "@config":  path.resolve(__dirname, "src/config"),
      "@hooks":   path.resolve(__dirname, "src/hooks"),
      "@types":   path.resolve(__dirname, "src/types"),
      "@i18n":    path.resolve(__dirname, "src/i18n"),
      "@assets":  path.resolve(__dirname, "src/assets"),
      "@screens": path.resolve(__dirname, "src/screens"),
    },
  },
  server: { port: 3000 },
});

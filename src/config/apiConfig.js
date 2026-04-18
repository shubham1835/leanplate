// Environment-aware API configuration
// In Vite: import.meta.env.DEV replaces __DEV__
// Set VITE_API_URL in .env.local for local dev, .env.production for prod

const CONFIG = {
  development: {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    TIMEOUT: 15000,
  },
  production: {
    BASE_URL: import.meta.env.VITE_API_URL || "https://fit-fuel-1-0-0.onrender.com/api/v1",
    TIMEOUT: 10000,
  },
};

const env = import.meta.env.DEV ? "development" : "production";

export default CONFIG[env];

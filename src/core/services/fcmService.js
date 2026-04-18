// src/core/services/fcmService.js
// ─────────────────────────────────────────────────────────────────
// Firebase Cloud Messaging integration.
// Subscribes the device to the LEAN_PLATE_USER topic after login.
// ─────────────────────────────────────────────────────────────────
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import apiClient from "@core/api/apiClient";

const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Lazy singleton — initialise only once
let messagingInstance = null;

async function getMessagingInstance() {
  if (messagingInstance) return messagingInstance;

  // FCM requires browser support for service workers
  const supported = await isSupported();
  if (!supported) {
    console.warn("[FCM] Not supported in this browser");
    return null;
  }

  // Prevent duplicate app initialisation during hot-reload
  const app = getApps().length === 0
    ? initializeApp(FIREBASE_CONFIG)
    : getApps()[0];

  messagingInstance = getMessaging(app);
  return messagingInstance;
}

// ── Request notification permission + get FCM token ──────────────
export async function requestNotificationPermission() {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.info("[FCM] Notification permission denied");
      return null;
    }

    // Register the service worker that Firebase needs
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );

    const token = await getToken(messaging, {
      vapidKey:            VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.info("[FCM] Token obtained:", token.slice(0, 20) + "...");
      return token;
    }

    return null;
  } catch (err) {
    console.error("[FCM] Error getting token:", err);
    return null;
  }
}

// ── Foreground message listener ───────────────────────────────────
// Called when app is in foreground and a push arrives.
// Returns unsubscribe function.
export async function onForegroundMessage(callback) {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.info("[FCM] Foreground message:", payload);
    callback(payload);
  });
}

// ── Full setup: permission → token → save to backend ─────────────
// Call this after successful login.
export async function setupFCM() {
  try {
    const token = await requestNotificationPermission();
    if (token) {
      // Save token to backend so server can send targeted pushes
      await apiClient.post("/notifications/token", {
        fcmToken:   token,
        deviceType: "WEB",
      });
      console.info("[FCM] Token saved to backend");
      localStorage.setItem("fcm_token", token);
    }
    return token;
  } catch (err) {
    console.error("[FCM] Setup failed:", err);
    return null;
  }
}

// ── Remove token on logout ────────────────────────────────────────
export async function teardownFCM() {
  const token = localStorage.getItem("fcm_token");
  if (!token) return;
  try {
    await apiClient.delete("/notifications/token", {
      data: { fcmToken: token },
    });
    localStorage.removeItem("fcm_token");
    console.info("[FCM] Token removed on logout");
  } catch (err) {
    console.error("[FCM] Teardown failed:", err);
  }
}

// ── Notification content map ──────────────────────────────────────
// Maps order status → human-readable title + body for push notification.
export const ORDER_STATUS_NOTIFICATIONS = {
  PENDING:    { title: "⚡ Order Received!",       body: "We got your order #{orderNumber}. Preparing soon!" },
  PREPARING:  { title: "👨‍🍳 Preparing Your Order",  body: "Order #{orderNumber} is being prepared. ~12 mins." },
  READY:      { title: "✅ Order Ready!",           body: "Order #{orderNumber} is ready for pickup! Come collect it." },
  COLLECTED:  { title: "🎉 Enjoy Your Meal!",      body: "Order #{orderNumber} collected. Bon appétit!" },
  REJECTED:   { title: "❌ Order Rejected",         body: "Order #{orderNumber} couldn't be fulfilled. Contact us." },
  CANCELLED:  { title: "Order Cancelled",           body: "Order #{orderNumber} has been cancelled." },
};

export const OTP_NOTIFICATION = {
  title: "🔑 Your Fit Fuel OTP",
  body:  "Your OTP is {otp}. Valid for 10 minutes. Do not share.",
};

// ── Show a local notification (foreground fallback) ───────────────
// Used when the app is open and a push arrives (service worker won't
// show it automatically in foreground).
export function showLocalNotification(title, body, data = {}) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  // Use service worker registration to show the notification
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body,
      icon:  "/logo192.png",
      badge: "/logo192.png",
      data,
      requireInteraction: false,
      silent: false,
    });
  }).catch(() => {
    // Fallback: plain Notification API
    new Notification(title, { body, icon: "/logo192.png" });
  });
}

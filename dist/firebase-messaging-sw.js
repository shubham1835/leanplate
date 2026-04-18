// public/firebase-messaging-sw.js
// This file MUST be at the root of public/ so it is served from /
// Firebase uses it to receive background push notifications.

importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js");

// These values are injected at build time via a Vite plugin or
// you can hardcode them here since this file is not bundled.
// Replace with your actual Firebase config values.
firebase.initializeApp({
  apiKey:            self.VITE_FIREBASE_API_KEY      || "your_api_key",
  authDomain:        self.VITE_FIREBASE_AUTH_DOMAIN  || "your_project.firebaseapp.com",
  projectId:         self.VITE_FIREBASE_PROJECT_ID   || "your_project_id",
  messagingSenderId: self.VITE_FIREBASE_MESSAGING_SENDER_ID || "your_sender_id",
  appId:             self.VITE_FIREBASE_APP_ID       || "your_app_id",
});

const messaging = firebase.messaging();

// Handle background messages (app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  const { title, body, icon } = payload.notification || {};
  const notifTitle = title || "Fit Fuel Diet Café";
  const notifBody  = body  || "You have a new notification";

  self.registration.showNotification(notifTitle, {
    body:  notifBody,
    icon:  icon || "/logo192.png",
    badge: "/logo192.png",
    data:  payload.data || {},
    actions: [
      { action: "open", title: "Open App" },
    ],
  });
});

// Handle notification click — open or focus the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

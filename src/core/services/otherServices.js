import apiClient from "@core/api/apiClient";

// ─── Rewards ──────────────────────────────────────────────────────
export const rewardsService = {
  getSummary: ()    => apiClient.get("/rewards").then((r) => r.data.data),
  redeem:     (id)  => apiClient.post("/rewards/redeem", { milestoneId: id }).then((r) => r.data.data),
};

// ─── Trainer ──────────────────────────────────────────────────────
export const trainerService = {
  getProfile: ()    => apiClient.get("/trainers/me").then((r) => r.data.data),
  getClients: ()    => apiClient.get("/trainers/me/clients").then((r) => r.data.data),
};

// ─── Notifications ───────────────────────────────────────────────
export const notificationService = {
  // Subscribe device token to a topic (called after login)
  subscribe: (fcmToken, topic) =>
    apiClient.post("/notifications/subscribe", { fcmToken, topic }).then((r) => r.data),

  // Unsubscribe on logout
  unsubscribe: (fcmToken, topic) =>
    apiClient.post("/notifications/unsubscribe", { fcmToken, topic }).then((r) => r.data),

  // Send a notification to a topic (admin)
  sendToTopic: (topic, title, body, data) =>
    apiClient.post("/notifications/send", { topic, title, body, data }).then((r) => r.data),

  // Send order status push to a specific user's FCM token (called by admin/kitchen)
  // Backend triggers this when order status changes.
  sendOrderStatusNotification: (orderId) =>
    apiClient.post(`/notifications/order/${orderId}/status`).then((r) => r.data),

  // Send OTP as a push notification (called by backend automatically on OTP generation)
  // This endpoint is for admin testing — OTP push is triggered server-side on sendOtp.
  sendOtpNotification: (phone) =>
    apiClient.post("/notifications/otp/resend", { phone }).then((r) => r.data),
};

// ─── Admin ────────────────────────────────────────────────────────
export const adminService = {
  getDailyAnalytics: (date)   => apiClient.get(`/admin/analytics/daily${date ? `?date=${date}` : ""}`).then((r) => r.data.data),
  getWeeklyRevenue:  ()       => apiClient.get("/admin/analytics/revenue").then((r) => r.data.data),
  getActiveOrders:   ()       => apiClient.get("/admin/orders").then((r) => r.data.data),
  updateOrderStatus: (id, s)  => apiClient.patch(`/admin/orders/${id}/status`, { status: s }).then((r) => r.data.data),
  getUsers:          (p, sz)  => apiClient.get(`/admin/users?page=${p}&size=${sz}`).then((r) => r.data.data),
  getMenuItems:      ()       => apiClient.get("/menu").then((r) => r.data.data),
  createMenuItem:    (data)   => apiClient.post("/admin/menu", data).then((r) => r.data.data),
  updateMenuItem:    (id, d)  => apiClient.patch(`/admin/menu/${id}`, d).then((r) => r.data.data),
  deleteMenuItem:    (id)     => apiClient.delete(`/admin/menu/${id}`).then((r) => r.data),
  toggleAvailability:(id)     => apiClient.patch(`/admin/menu/${id}/toggle`).then((r) => r.data),

  // OTP viewer — returns today's OTPs for all users (admin only)
  getTodayOtps:      ()       => apiClient.get("/admin/otps/today").then((r) => r.data.data),
};

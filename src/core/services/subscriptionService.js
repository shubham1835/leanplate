import apiClient from "@core/api/apiClient";

// ─── Subscription ─────────────────────────────────────────────────
const subscriptionService = {
  getPlans:    ()      => apiClient.get("/plans").then((r) => r.data.data),
  getActiveSub:()      => apiClient.get("/subscriptions/me").then((r) => r.data.data),
  getHistory:  ()      => apiClient.get("/subscriptions/history").then((r) => r.data.data),
  create:      (data)  => apiClient.post("/subscriptions", data).then((r) => r.data.data),
  pause:       (id)    => apiClient.patch(`/subscriptions/${id}/pause`).then((r) => r.data.data),
  resume:      (id)    => apiClient.patch(`/subscriptions/${id}/resume`).then((r) => r.data.data),
};

export default subscriptionService;

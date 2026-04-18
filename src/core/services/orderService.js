import apiClient from "@core/api/apiClient";

const orderService = {
  initiateOrder:      (data)              => apiClient.post("/orders/initiate", data).then((r) => r.data.data),
  confirmPayment:     (orderId, data)     => apiClient.post(`/orders/${orderId}/confirm-payment`, data).then((r) => r.data.data),
  placeOrderWithPlan: (data)              => apiClient.post("/orders/plan", data).then((r) => r.data.data),
  getMyOrders:        (page=0, size=10)   => apiClient.get(`/orders?page=${page}&size=${size}`).then((r) => r.data.data),
  getActiveOrder:     ()                  => apiClient.get("/orders/active").then((r) => r.data.data),
  getById:            (id)                => apiClient.get(`/orders/${id}`).then((r) => r.data.data),
  cancelOrder:        (id)                => apiClient.post(`/orders/${id}/cancel`).then((r) => r.data),
};

export default orderService;

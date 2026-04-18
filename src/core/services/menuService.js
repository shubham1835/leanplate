import apiClient from "@core/api/apiClient";

const menuService = {
  getFullMenu: ()       => apiClient.get("/menu").then((r) => r.data.data),
  getByGoal:  (goal)    => apiClient.get(`/menu/goal/${goal}`).then((r) => r.data.data),
  getPopular: (limit=10)=> apiClient.get(`/menu/popular?limit=${limit}`).then((r) => r.data.data),
  getById:    (id)      => apiClient.get(`/menu/${id}`).then((r) => r.data.data),
};

export default menuService;

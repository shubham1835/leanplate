import apiClient from "@core/api/apiClient";

const progressService = {
  getSummary:     ()     => apiClient.get("/progress").then((r) => r.data.data),
  getWeightHistory:()    => apiClient.get("/progress/weight").then((r) => r.data.data),
  logWeight:      (data) => apiClient.post("/progress/weight", data).then((r) => r.data.data),
  getMacros:      ()     => apiClient.get("/progress/macros").then((r) => r.data.data),
};

export default progressService;

import apiClient from "@core/api/apiClient";

const authService = {
  sendOtp:  (phone)              => apiClient.post("/auth/otp/send",   { phone }).then((r) => r.data.data),
  verifyOtp: (phone, otp)        => apiClient.post("/auth/otp/verify", { phone, otp }).then((r) => r.data.data),
  refresh:  (refreshToken)       => apiClient.post("/auth/refresh",    { refreshToken }).then((r) => r.data.data),
  logout:   ()                   => apiClient.delete("/auth/logout").then((r) => r.data),
  updateProfile: (data)          => apiClient.patch("/users/me", data).then((r) => r.data.data),
  userProfile: ()                => apiClient.post("/auth/users/me").then((r) => r.data.data),
};

export default authService;

import axios from "axios";

// 😈 SYSTEM DESIGN: Centralized Axios instance with credential support
const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enables browser to automatically send HTTP-only refresh cookies
});

// Request interceptor to attach Access Token from memory/localStorage if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic 401 token refresh retries
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request returns 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt silent token refresh via HTTP-only refresh cookie
        const refreshResponse = await axios.post(
          "/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.success) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          // Update header and retry original failed request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed or expired -> clear tokens and trigger re-login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

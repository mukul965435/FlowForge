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

export default apiClient;

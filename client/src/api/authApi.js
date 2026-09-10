import apiClient from "./client";

export const authApi = {
  // Register a new user
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  // Login existing user
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  // Logout user and clear session cookies
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  // Fetch current authenticated user profile
  getCurrentUser: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  // Refresh access token using HTTP-only refresh cookie
  refreshToken: async () => {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  },
};

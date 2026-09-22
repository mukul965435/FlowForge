import apiClient from "./client";

export const projectApi = {
  // Create project in organization
  createProject: async (orgId, projectData) => {
    const response = await apiClient.post(`/organizations/${orgId}/projects`, projectData);
    return response.data;
  },

  // Get projects in organization with optional filtering & pagination
  getOrgProjects: async (orgId, params = {}) => {
    const response = await apiClient.get(`/organizations/${orgId}/projects`, { params });
    return response.data;
  },

  // Get organization project statistics aggregation summary
  getProjectStats: async (orgId) => {
    const response = await apiClient.get(`/organizations/${orgId}/projects/stats`);
    return response.data;
  },

  // Get project details by ID
  getProjectById: async (orgId, projectId) => {
    const response = await apiClient.get(`/organizations/${orgId}/projects/${projectId}`);
    return response.data;
  },

  // Update project
  updateProject: async (orgId, projectId, updateData) => {
    const response = await apiClient.patch(
      `/organizations/${orgId}/projects/${projectId}`,
      updateData
    );
    return response.data;
  },

  // Archive project
  archiveProject: async (orgId, projectId) => {
    const response = await apiClient.delete(`/organizations/${orgId}/projects/${projectId}`);
    return response.data;
  },
};

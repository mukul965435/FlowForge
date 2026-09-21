import apiClient from "./client";

export const orgApi = {
  // Create organization
  createOrg: async (orgData) => {
    const response = await apiClient.post("/organizations", orgData);
    return response.data;
  },

  // Get organizations user belongs to
  getUserOrgs: async () => {
    const response = await apiClient.get("/organizations");
    return response.data;
  },

  // Get organization details by ID
  getOrgById: async (orgId) => {
    const response = await apiClient.get(`/organizations/${orgId}`);
    return response.data;
  },

  // Invite member by email
  inviteMember: async (orgId, invitationData) => {
    const response = await apiClient.post(`/organizations/${orgId}/invitations`, invitationData);
    return response.data;
  },

  // Get members of organization
  getOrgMembers: async (orgId) => {
    const response = await apiClient.get(`/organizations/${orgId}/members`);
    return response.data;
  },

  // Archive organization (OWNER only)
  archiveOrg: async (orgId) => {
    const response = await apiClient.delete(`/organizations/${orgId}`);
    return response.data;
  },
};

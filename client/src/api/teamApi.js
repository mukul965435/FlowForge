import apiClient from "./client";

export const teamApi = {
  // Create team in organization
  createTeam: async (orgId, teamData) => {
    const response = await apiClient.post(`/organizations/${orgId}/teams`, teamData);
    return response.data;
  },

  // Get teams in organization
  getOrgTeams: async (orgId) => {
    const response = await apiClient.get(`/organizations/${orgId}/teams`);
    return response.data;
  },

  // Get team details
  getTeamById: async (orgId, teamId) => {
    const response = await apiClient.get(`/organizations/${orgId}/teams/${teamId}`);
    return response.data;
  },

  // Add member to team
  addTeamMember: async (orgId, teamId, memberData) => {
    const response = await apiClient.post(
      `/organizations/${orgId}/teams/${teamId}/members`,
      memberData
    );
    return response.data;
  },

  // Get team members
  getTeamMembers: async (orgId, teamId) => {
    const response = await apiClient.get(`/organizations/${orgId}/teams/${teamId}/members`);
    return response.data;
  },
};

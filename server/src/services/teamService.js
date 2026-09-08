import Team from "../models/Team.js";
import TeamMembership from "../models/TeamMembership.js";
import Membership from "../models/Membership.js";
import AppError from "../utils/AppError.js";

export const createTeam = async ({ organizationId, name, description, createdBy }) => {
  // Check if a team with the same name already exists in this organization
  const existingTeam = await Team.findOne({
    organizationId,
    name: { $regex: new RegExp(`^${name}$`, "i") },
    archivedAt: null,
  });

  if (existingTeam) {
    throw new AppError("A team with this name already exists in the organization", 409, "TEAM_EXISTS");
  }

  // Create team
  const team = await Team.create({
    organizationId,
    name,
    description: description || "",
    createdBy,
  });

  // Automatically assign creator as LEAD in TeamMembership
  const membership = await TeamMembership.create({
    teamId: team._id,
    userId: createdBy,
    role: "LEAD",
    joinedAt: new Date(),
  });

  return { team, membership };
};

export const getOrganizationTeams = async (organizationId) => {
  const teams = await Team.find({ organizationId, archivedAt: null }).sort({ createdAt: -1 }).lean();

  // Attach member counts to each team
  const teamsWithCounts = await Promise.all(
    teams.map(async (team) => {
      const memberCount = await TeamMembership.countDocuments({ teamId: team._id });
      return {
        ...team,
        memberCount,
      };
    })
  );

  return teamsWithCounts;
};

export const getTeamById = async (teamId, organizationId) => {
  const team = await Team.findOne({ _id: teamId, organizationId, archivedAt: null }).lean();

  if (!team) {
    throw new AppError("Team not found in this organization", 404, "TEAM_NOT_FOUND");
  }

  const memberCount = await TeamMembership.countDocuments({ teamId: team._id });

  return {
    ...team,
    memberCount,
  };
};

export const updateTeam = async (teamId, organizationId, updateData) => {
  const team = await Team.findOneAndUpdate(
    { _id: teamId, organizationId, archivedAt: null },
    updateData,
    { new: true, runValidators: true }
  );

  if (!team) {
    throw new AppError("Team not found", 404, "TEAM_NOT_FOUND");
  }

  return team;
};

export const archiveTeam = async (teamId, organizationId) => {
  const team = await Team.findOneAndUpdate(
    { _id: teamId, organizationId, archivedAt: null },
    { archivedAt: new Date() },
    { new: true }
  );

  if (!team) {
    throw new AppError("Team not found", 404, "TEAM_NOT_FOUND");
  }

  return team;
};

export const addTeamMember = async ({ teamId, organizationId, userId, role }) => {
  const team = await Team.findOne({ _id: teamId, organizationId, archivedAt: null });
  if (!team) {
    throw new AppError("Team not found in this organization", 404, "TEAM_NOT_FOUND");
  }

  const orgMembership = await Membership.findOne({
    organizationId,
    userId,
    status: "ACTIVE",
  });

  if (!orgMembership) {
    throw new AppError(
      "User is not an active member of this organization",
      400,
      "USER_NOT_IN_ORGANIZATION"
    );
  }

  const existingTeamMembership = await TeamMembership.findOne({ teamId, userId });
  if (existingTeamMembership) {
    throw new AppError("User is already a member of this team", 409, "TEAM_MEMBER_EXISTS");
  }

  const teamMembership = await TeamMembership.create({
    teamId,
    userId,
    role: role || "MEMBER",
    joinedAt: new Date(),
  });

  return teamMembership;
};

export const getTeamMembers = async (teamId, organizationId) => {
  const team = await Team.findOne({ _id: teamId, organizationId, archivedAt: null });
  if (!team) {
    throw new AppError("Team not found in this organization", 404, "TEAM_NOT_FOUND");
  }

  const members = await TeamMembership.find({ teamId })
    .populate("userId", "name email avatar")
    .lean();

  return members.map((m) => ({
    membershipId: m._id,
    user: m.userId,
    role: m.role,
    joinedAt: m.joinedAt,
  }));
};

export const updateTeamMemberRole = async (teamId, organizationId, targetUserId, newRole) => {
  const team = await Team.findOne({ _id: teamId, organizationId, archivedAt: null });
  if (!team) {
    throw new AppError("Team not found in this organization", 404, "TEAM_NOT_FOUND");
  }

  const teamMembership = await TeamMembership.findOne({ teamId, userId: targetUserId });
  if (!teamMembership) {
    throw new AppError("User is not a member of this team", 404, "TEAM_MEMBER_NOT_FOUND");
  }

  teamMembership.role = newRole;
  await teamMembership.save();

  return teamMembership;
};

export const removeTeamMember = async (teamId, organizationId, targetUserId) => {
  const team = await Team.findOne({ _id: teamId, organizationId, archivedAt: null });
  if (!team) {
    throw new AppError("Team not found in this organization", 404, "TEAM_NOT_FOUND");
  }

  const teamMembership = await TeamMembership.findOne({ teamId, userId: targetUserId });
  if (!teamMembership) {
    throw new AppError("User is not a member of this team", 404, "TEAM_MEMBER_NOT_FOUND");
  }

  await TeamMembership.findByIdAndDelete(teamMembership._id);
  return { success: true };
};


import mongoose from "mongoose";
import Project from "../models/Project.js";
import Team from "../models/Team.js";
import AppError from "../utils/AppError.js";

const generateProjectKey = (name) => {
  const words = name.trim().split(/\s+/);
  let key = "";

  if (words.length > 1) {
    key = words.map((w) => w[0]).join("").toUpperCase().slice(0, 4);
  } else {
    key = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  }

  if (key.length < 2) {
    key = (key + "PRJ").slice(0, 4);
  }

  return key;
};

export const createProject = async ({ organizationId, name, key, description, teamId, createdBy }) => {
  if (teamId) {
    const team = await Team.findOne({ _id: teamId, organizationId, archivedAt: null });
    if (!team) {
      throw new AppError("Team not found in this organization", 400, "INVALID_TEAM_ID");
    }
  }

  let finalKey = key ? key.toUpperCase().trim() : generateProjectKey(name);

  // Handle key collision within the same organization
  let existingProject = await Project.findOne({ organizationId, key: finalKey });
  if (existingProject) {
    if (key) {
      throw new AppError("Project key is already in use within this organization", 409, "PROJECT_KEY_EXISTS");
    }
    // Append random number if key was auto-generated
    finalKey = `${finalKey}${Math.floor(1 + Math.random() * 9)}`;
  }

  const project = await Project.create({
    organizationId,
    name,
    key: finalKey,
    description: description || "",
    teamId: teamId || null,
    createdBy,
  });

  return project;
};

export const getOrganizationProjects = async (organizationId, queryParams = {}) => {
  const { status, teamId, page = 1, limit = 20 } = queryParams;

  const filter = { organizationId };

  if (status) {
    filter.status = status;
  } else {
    filter.archivedAt = null;
  }

  if (teamId) {
    filter.teamId = teamId;
  }

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("teamId", "name")
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async (projectId, organizationId) => {
  const project = await Project.findOne({ _id: projectId, organizationId })
    .populate("teamId", "name description")
    .populate("createdBy", "name email avatar")
    .lean();

  if (!project || project.archivedAt) {
    throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
  }

  return project;
};

export const updateProject = async (projectId, organizationId, updateData) => {
  if (updateData.teamId) {
    const team = await Team.findOne({ _id: updateData.teamId, organizationId, archivedAt: null });
    if (!team) {
      throw new AppError("Team not found in this organization", 400, "INVALID_TEAM_ID");
    }
  }

  const project = await Project.findOneAndUpdate(
    { _id: projectId, organizationId, archivedAt: null },
    updateData,
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
  }

  return project;
};

export const archiveProject = async (projectId, organizationId) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, organizationId, archivedAt: null },
    { archivedAt: new Date(), status: "ARCHIVED" },
    { new: true }
  );

  if (!project) {
    throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
  }

  return project;
};

export const getOrganizationProjectStats = async (organizationId) => {
  const orgObjectId = new mongoose.Types.ObjectId(organizationId);

  const stats = await Project.aggregate([
    { $match: { organizationId: orgObjectId } },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        activeProjects: {
          $sum: { $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0] },
        },
        completedProjects: {
          $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
        },
        archivedProjects: {
          $sum: { $cond: [{ $eq: ["$status", "ARCHIVED"] }, 1, 0] },
        },
      },
    },
  ]);

  if (!stats || stats.length === 0) {
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      archivedProjects: 0,
    };
  }

  const { totalProjects, activeProjects, completedProjects, archivedProjects } = stats[0];
  return { totalProjects, activeProjects, completedProjects, archivedProjects };
};


import Project from "../models/Project.js";
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

import * as projectService from "../services/projectService.js";

export const createProject = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { name, key, description, teamId } = req.body;
    const createdBy = req.user.id;

    const project = await projectService.createProject({
      organizationId: orgId,
      name,
      key,
      description,
      teamId,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationProjects = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const result = await projectService.getOrganizationProjects(orgId, req.query);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    const project = await projectService.getProjectById(projectId, orgId);

    return res.status(200).json({
      success: true,
      message: "Project details fetched successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    const project = await projectService.updateProject(projectId, orgId, req.body);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const archiveProject = async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    await projectService.archiveProject(projectId, orgId);

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationProjectStats = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const stats = await projectService.getOrganizationProjectStats(orgId);

    return res.status(200).json({
      success: true,
      message: "Project statistics fetched successfully",
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};


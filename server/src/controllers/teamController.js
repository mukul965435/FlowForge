import * as teamService from "../services/teamService.js";

export const createTeam = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { name, description } = req.body;
    const createdBy = req.user.id;

    const result = await teamService.createTeam({
      organizationId: orgId,
      name,
      description,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationTeams = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const teams = await teamService.getOrganizationTeams(orgId);

    return res.status(200).json({
      success: true,
      message: "Teams fetched successfully",
      data: { teams },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const { orgId, teamId } = req.params;
    const team = await teamService.getTeamById(teamId, orgId);

    return res.status(200).json({
      success: true,
      message: "Team details fetched successfully",
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const { orgId, teamId } = req.params;
    const team = await teamService.updateTeam(teamId, orgId, req.body);

    return res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

export const archiveTeam = async (req, res, next) => {
  try {
    const { orgId, teamId } = req.params;
    await teamService.archiveTeam(teamId, orgId);

    return res.status(200).json({
      success: true,
      message: "Team archived successfully",
    });
  } catch (error) {
    next(error);
  }
};

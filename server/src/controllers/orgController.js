import * as orgService from "../services/orgService.js";

export const createOrganization = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const ownerId = req.user.id;

    const result = await orgService.createOrganization({
      name,
      slug,
      description,
      ownerId,
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrganizations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const organizations = await orgService.getUserOrganizations(userId);

    return res.status(200).json({
      success: true,
      message: "Organizations fetched successfully",
      data: { organizations },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organization = await orgService.getOrganizationById(id);

    return res.status(200).json({
      success: true,
      message: "Organization details fetched successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organization = await orgService.updateOrganization(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const members = await orgService.getOrganizationMembers(id);

    return res.status(200).json({
      success: true,
      message: "Organization members fetched successfully",
      data: { members },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;
    const requesterUserId = req.user.id;

    const membership = await orgService.updateMemberRole(id, userId, role, requesterUserId);

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: { membership },
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const requesterUserId = req.user.id;

    await orgService.removeMember(id, userId, requesterUserId);

    return res.status(200).json({
      success: true,
      message: "Member removed from organization successfully",
    });
  } catch (error) {
    next(error);
  }
};

import Organization from "../models/Organization.js";
import Membership from "../models/Membership.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createOrganization = async ({ name, slug, description, ownerId }) => {
  let finalSlug = slug ? slug.toLowerCase().trim() : generateSlug(name);

  // Handle slug collisions
  let existingSlug = await Organization.findOne({ slug: finalSlug });
  if (existingSlug) {
    if (slug) {
      throw new AppError("Organization slug is already in use", 409, "SLUG_EXISTS");
    }
    finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Create Organization
  const organization = await Organization.create({
    name,
    slug: finalSlug,
    description: description || "",
    ownerId,
  });

  // Automatically assign creator as OWNER in Membership schema
  const membership = await Membership.create({
    organizationId: organization._id,
    userId: ownerId,
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: new Date(),
  });

  return { organization, membership };
};

export const getUserOrganizations = async (userId) => {
  const memberships = await Membership.find({ userId, status: "ACTIVE" })
    .populate({
      path: "organizationId",
      select: "name slug description logo archivedAt createdAt",
    })
    .lean();

  return memberships
    .filter((m) => m.organizationId && !m.organizationId.archivedAt)
    .map((m) => ({
      ...m.organizationId,
      userRole: m.role,
      joinedAt: m.joinedAt,
    }));
};

export const getOrganizationById = async (orgId) => {
  const organization = await Organization.findById(orgId).lean();
  if (!organization || organization.archivedAt) {
    throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
  }

  const memberCount = await Membership.countDocuments({
    organizationId: orgId,
    status: "ACTIVE",
  });

  return {
    ...organization,
    memberCount,
  };
};

export const updateOrganization = async (orgId, updateData) => {
  const organization = await Organization.findByIdAndUpdate(orgId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!organization) {
    throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
  }

  return organization;
};

export const getOrganizationMembers = async (orgId) => {
  const memberships = await Membership.find({ organizationId: orgId, status: "ACTIVE" })
    .populate("userId", "name email avatar")
    .select("role status joinedAt userId")
    .lean();

  return memberships.map((m) => ({
    membershipId: m._id,
    user: m.userId,
    role: m.role,
    status: m.status,
    joinedAt: m.joinedAt,
  }));
};

export const updateMemberRole = async (orgId, targetUserId, newRole, requesterUserId) => {
  const targetMembership = await Membership.findOne({
    organizationId: orgId,
    userId: targetUserId,
    status: "ACTIVE",
  });

  if (!targetMembership) {
    throw new AppError("Member not found in organization", 404, "MEMBER_NOT_FOUND");
  }

  // Prevent demoting owner
  if (targetMembership.role === "OWNER" && newRole !== "OWNER") {
    throw new AppError("Organization Owner role cannot be altered directly", 400, "CANNOT_DEMOTE_OWNER");
  }

  targetMembership.role = newRole;
  await targetMembership.save();

  return targetMembership;
};

export const removeMember = async (orgId, targetUserId, requesterUserId) => {
  const targetMembership = await Membership.findOne({
    organizationId: orgId,
    userId: targetUserId,
  });

  if (!targetMembership) {
    throw new AppError("Member not found in organization", 404, "MEMBER_NOT_FOUND");
  }

  if (targetMembership.role === "OWNER") {
    throw new AppError("The organization Owner cannot be removed", 400, "CANNOT_REMOVE_OWNER");
  }

  await Membership.findByIdAndDelete(targetMembership._id);
  return { success: true };
};

export const inviteMember = async ({ orgId, email, role, requesterUserId }) => {
  const userToInvite = await User.findOne({ email: email.toLowerCase().trim() });
  if (!userToInvite) {
    throw new AppError("No user registered with this email address", 4404 || 404, "USER_NOT_FOUND");
  }

  const existingMembership = await Membership.findOne({
    organizationId: orgId,
    userId: userToInvite._id,
  });

  if (existingMembership) {
    if (existingMembership.status === "ACTIVE") {
      throw new AppError("User is already an active member of this organization", 409, "MEMBER_ALREADY_EXISTS");
    }
    // Re-activate member if suspended/invited
    existingMembership.status = "ACTIVE";
    existingMembership.role = role || existingMembership.role;
    existingMembership.invitedBy = requesterUserId;
    await existingMembership.save();
    return existingMembership;
  }

  const newMembership = await Membership.create({
    organizationId: orgId,
    userId: userToInvite._id,
    role: role || "MEMBER",
    status: "ACTIVE",
    invitedBy: requesterUserId,
    joinedAt: new Date(),
  });

  return newMembership;
};

export const archiveOrganization = async (orgId) => {
  const organization = await Organization.findByIdAndUpdate(
    orgId,
    { archivedAt: new Date() },
    { new: true }
  );

  if (!organization) {
    throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
  }

  return organization;
};


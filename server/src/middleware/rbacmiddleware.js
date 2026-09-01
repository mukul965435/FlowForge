import Membership from "../models/Membership.js";
import AppError from "../utils/AppError.js";

/**
 * 😈 SYSTEM DESIGN — TENANT ISOLATION & RBAC MIDDLEWARE
 * Verifies that the authenticated user is an active member of the specified organization
 * and possesses one of the authorized roles.
 */
export const authorizeOrgRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const orgId = req.params.id || req.params.orgId || req.headers["x-organization-id"] || req.body.organizationId;

      if (!orgId) {
        return next(new AppError("Organization ID is required", 400, "MISSING_ORG_ID"));
      }

      const membership = await Membership.findOne({
        organizationId: orgId,
        userId: req.user.id,
        status: "ACTIVE",
      });

      if (!membership) {
        return next(
          new AppError("Access denied: You are not an active member of this organization", 403, "TENANT_ACCESS_DENIED")
        );
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
        return next(
          new AppError(
            `Access denied: Action requires one of the following roles: [${allowedRoles.join(", ")}]`,
            403,
            "INSUFFICIENT_ROLE_PERMISSIONS"
          )
        );
      }

      // Attach tenant membership details to request context
      req.membership = membership;
      req.organizationId = orgId;
      next();
    } catch (error) {
      next(error);
    }
  };
};

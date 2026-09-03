import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { authorizeOrgRole } from "../middleware/rbacmiddleware.js";
import { validate } from "../middleware/validatemiddleware.js";
import {
  createOrgSchema,
  updateOrgSchema,
  updateMemberRoleSchema,
  inviteMemberSchema,
} from "../validators/orgValidator.js";
import * as orgController from "../controllers/orgController.js";

const router = express.Router();

// Apply authentication to all organization routes
router.use(authenticate);

router
  .route("/")
  .post(validate(createOrgSchema), orgController.createOrganization)
  .get(orgController.getUserOrganizations);

router
  .route("/:id")
  .get(authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"), orgController.getOrganizationById)
  .patch(validate(updateOrgSchema), authorizeOrgRole("OWNER", "ADMIN"), orgController.updateOrganization)
  .delete(authorizeOrgRole("OWNER"), orgController.archiveOrganization);

router
  .route("/:id/invitations")
  .post(validate(inviteMemberSchema), authorizeOrgRole("OWNER", "ADMIN"), orgController.inviteMember);

router
  .route("/:id/members")
  .get(authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"), orgController.getOrganizationMembers);

router
  .route("/:id/members/:userId")
  .patch(validate(updateMemberRoleSchema), authorizeOrgRole("OWNER", "ADMIN"), orgController.updateMemberRole)
  .delete(authorizeOrgRole("OWNER", "ADMIN"), orgController.removeMember);

export default router;


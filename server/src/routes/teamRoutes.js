import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { authorizeOrgRole } from "../middleware/rbacmiddleware.js";
import { validate } from "../middleware/validatemiddleware.js";
import {
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema,
  updateTeamMemberRoleSchema,
} from "../validators/teamValidator.js";
import * as teamController from "../controllers/teamController.js";

// mergeParams: true preserves :orgId parameter from parent router
const router = express.Router({ mergeParams: true });

// Protect all team routes with authentication
router.use(authenticate);

router
  .route("/")
  .post(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    validate(createTeamSchema),
    teamController.createTeam
  )
  .get(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"),
    teamController.getOrganizationTeams
  );

router
  .route("/:teamId")
  .get(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"),
    teamController.getTeamById
  )
  .patch(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    validate(updateTeamSchema),
    teamController.updateTeam
  )
  .delete(
    authorizeOrgRole("OWNER", "ADMIN"),
    teamController.archiveTeam
  );

router
  .route("/:teamId/members")
  .post(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    validate(addTeamMemberSchema),
    teamController.addTeamMember
  )
  .get(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"),
    teamController.getTeamMembers
  );

router
  .route("/:teamId/members/:userId")
  .patch(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    validate(updateTeamMemberRoleSchema),
    teamController.updateTeamMemberRole
  )
  .delete(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    teamController.removeTeamMember
  );

export default router;


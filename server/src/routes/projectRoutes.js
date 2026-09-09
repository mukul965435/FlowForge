import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { authorizeOrgRole } from "../middleware/rbacmiddleware.js";
import { validate } from "../middleware/validatemiddleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectsQuerySchema,
} from "../validators/projectValidator.js";
import * as projectController from "../controllers/projectController.js";

// mergeParams: true preserves :orgId parameter from parent router
const router = express.Router({ mergeParams: true });

// Protect all project routes with authentication
router.use(authenticate);

router
  .route("/")
  .post(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    validate(createProjectSchema),
    projectController.createProject
  )
  .get(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"),
    validate(getProjectsQuerySchema),
    projectController.getOrganizationProjects
  );

router
  .route("/:projectId")
  .get(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER", "MEMBER"),
    projectController.getProjectById
  )
  .patch(
    authorizeOrgRole("OWNER", "ADMIN", "MANAGER"),
    validate(updateProjectSchema),
    projectController.updateProject
  )
  .delete(
    authorizeOrgRole("OWNER", "ADMIN"),
    projectController.archiveProject
  );

export default router;

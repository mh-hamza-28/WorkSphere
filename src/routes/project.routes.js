import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  addMemberToProjectSchema,
  createProjectSchema,
  projectIdSchema,
  projectMemberSchema,
  updateMemberRoleSchema,
} from "../validators/validator.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { inviteLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(validate(createProjectSchema), createProject);

router
  .route("/:projectId")
  .get(validate(projectIdSchema), validateProjectPermission(AvailableUserRole), getProjectById)
  .put(
    validate(projectIdSchema),
    validateProjectPermission([UserRolesEnum.ADMIN]),
    validate(createProjectSchema),
    updateProject,
  )
  .delete(validate(projectIdSchema), validateProjectPermission([UserRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(validate(projectIdSchema), validateProjectPermission(AvailableUserRole), getProjectMembers)
  .post(
    inviteLimiter,
    validate(addMemberToProjectSchema),
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(
    validate(updateMemberRoleSchema),
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateMemberRole,
  )
  .delete(
    validate(projectMemberSchema),
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteMember,
  );

export default router;

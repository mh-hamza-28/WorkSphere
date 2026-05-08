import { Router } from "express";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  changeTaskStatus,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  markSubtaskComplete
} from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  assignTaskSchema,
  createSubtaskSchema,
  createTaskSchema,
  projectTasksSchema,
  subtaskIdSchema,
  subtaskStatusSchema,
  taskIdSchema,
  taskStatusSchema,
  updateSubtaskSchema,
  updateTaskSchema,
} from "../validators/validator.js";

const router = Router();
router.use(verifyJWT);

// Tasks under a project
router.route("/project/:projectId")
  .get(validate(projectTasksSchema), getTasksByProject)
  .post(validate(createTaskSchema), createTask);

// Task operations
router.route("/:taskId")
  .put(validate(updateTaskSchema), updateTask)
  .delete(validate(taskIdSchema), deleteTask);

router.route("/:taskId/assign").patch(validate(assignTaskSchema), assignTask);
router.route("/:taskId/status").patch(validate(taskStatusSchema), changeTaskStatus);

// Subtask operations
router.route("/:taskId/subtasks").post(validate(createSubtaskSchema), createSubtask);
router.route("/subtasks/:subtaskId")
  .put(validate(updateSubtaskSchema), updateSubtask)
  .delete(validate(subtaskIdSchema), deleteSubtask);
router.route("/subtasks/:subtaskId/status").patch(validate(subtaskStatusSchema), markSubtaskComplete);

export default router;

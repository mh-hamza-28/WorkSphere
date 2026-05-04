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

const router = Router();
router.use(verifyJWT);

// Tasks under a project
router.route("/project/:projectId")
  .get(getTasksByProject)
  .post(createTask);

// Task operations
router.route("/:taskId")
  .put(updateTask)
  .delete(deleteTask);

router.route("/:taskId/assign").patch(assignTask);
router.route("/:taskId/status").patch(changeTaskStatus);

// Subtask operations
router.route("/:taskId/subtasks").post(createSubtask);
router.route("/subtasks/:subtaskId")
  .put(updateSubtask)
  .delete(deleteSubtask);
router.route("/subtasks/:subtaskId/status").patch(markSubtaskComplete);

export default router;

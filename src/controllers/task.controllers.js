import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const checkProjectAccess = async (projectId, userId) => {
  const member = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId)
  });
  return !!member;
};

// Task Controllers
export const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const hasAccess = await checkProjectAccess(projectId, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const tasks = await Task.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [{ $project: { fullName: 1, avatar: 1, email: 1 } }]
      }
    },
    { $unwind: { path: "$assignedTo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks"
      }
    }
  ]);

  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, status } = req.body;
  
  const hasAccess = await checkProjectAccess(projectId, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  let assignedToId = assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null;

  const task = await Task.create({
    title,
    description,
    status: status || "TODO",
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedToId,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;

  const task = await Task.findByIdAndUpdate(taskId, { title, description }, { new: true });
  if (!task) throw new ApiError(404, "Task not found");

  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new ApiError(404, "Task not found");
  
  // also delete related subtasks
  await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

  res.status(200).json(new ApiResponse(200, task, "Task deleted successfully"));
});

export const assignTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assignedTo } = req.body; // userId

  let assignedToId = assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null;

  const task = await Task.findByIdAndUpdate(taskId, { assignedTo: assignedToId }, { new: true });
  if (!task) throw new ApiError(404, "Task not found");

  res.status(200).json(new ApiResponse(200, task, "Task assigned successfully"));
});

export const changeTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
  if (!validStatuses.includes(status)) throw new ApiError(400, "Invalid status");

  const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
  if (!task) throw new ApiError(404, "Task not found");

  res.status(200).json(new ApiResponse(200, task, "Task status updated successfully"));
});

// Subtask Controllers
export const createSubtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: req.user._id
  });

  res.status(201).json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

export const updateSubtask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { title } = req.body;

  const subtask = await Subtask.findByIdAndUpdate(subtaskId, { title }, { new: true });
  if (!subtask) throw new ApiError(404, "Subtask not found");

  res.status(200).json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

export const deleteSubtask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const subtask = await Subtask.findByIdAndDelete(subtaskId);
  if (!subtask) throw new ApiError(404, "Subtask not found");

  res.status(200).json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

export const markSubtaskComplete = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { isCompleted } = req.body;

  const subtask = await Subtask.findByIdAndUpdate(subtaskId, { isCompleted: !!isCompleted }, { new: true });
  if (!subtask) throw new ApiError(404, "Subtask not found");

  res.status(200).json(new ApiResponse(200, subtask, "Subtask completion status updated successfully"));
});

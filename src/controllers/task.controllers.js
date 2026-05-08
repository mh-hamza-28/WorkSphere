import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { createNotification } from "../services/notification.service.js";
import { NotificationTypeEnum } from "../models/notification.model.js";
import { UserRolesEnum } from "../utils/constants.js";

const checkProjectAccess = async (projectId, userId) => {
  const member = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId)
  });
  return !!member;
};

const formatDeadline = (deadline) => {
  if (!deadline) return null;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(deadline));
};

const getProjectAdminIds = async (projectId) => {
  const admins = await ProjectMember.find({
    project: new mongoose.Types.ObjectId(projectId),
    role: UserRolesEnum.ADMIN,
  }).select("user");
  return admins.map((admin) => admin.user);
};

const notifyTaskAssigned = async ({ task, project, actor, assignedTo }) => {
  if (!assignedTo) return;

  const deadlineText = formatDeadline(task.deadline);
  await createNotification({
    recipient: assignedTo,
    actor: actor._id,
    targetUser: assignedTo,
    project: task.project,
    task: task._id,
    type: NotificationTypeEnum.TASK_ASSIGNED,
    title: "Task assigned",
    message: `${actor.fullname || actor.username} assigned "${task.title}" to you in ${project?.name || "a project"}${deadlineText ? ` with deadline ${deadlineText}` : ""}.`,
  });
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
        pipeline: [{ $project: { fullname: 1, fullName: 1, avatar: 1, email: 1, username: 1 } }]
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
  const { title, description, assignedTo, status, deadline } = req.body;
  
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
    deadline: deadline ? new Date(deadline) : null,
  });

  if (assignedToId) {
    const project = await Project.findById(projectId);
    await notifyTaskAssigned({ task, project, actor: req.user, assignedTo: assignedToId });
  }

  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status, deadline } = req.body;

  const existingTask = await Task.findById(taskId);
  if (!existingTask) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingTask.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");
  if (status !== undefined && !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const hasAssignedTo = Object.prototype.hasOwnProperty.call(req.body, "assignedTo");
  const hasDeadline = Object.prototype.hasOwnProperty.call(req.body, "deadline");
  const assignedToId = hasAssignedTo
    ? assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : null
    : existingTask.assignedTo;
  const nextDeadline = hasDeadline
    ? deadline
      ? new Date(deadline)
      : null
    : existingTask.deadline;
  const assignmentChanged =
    (existingTask.assignedTo?.toString() || "") !== (assignedToId?.toString() || "");
  const deadlineChanged =
    (existingTask.deadline?.toISOString() || "") !== (nextDeadline?.toISOString() || "");

  const updateFields = {
    deadlineReminderSentAt: deadlineChanged ? null : existingTask.deadlineReminderSentAt,
  };
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (hasAssignedTo) updateFields.assignedTo = assignedToId;
  if (status !== undefined) updateFields.status = status;
  if (hasDeadline) updateFields.deadline = nextDeadline;

  const task = await Task.findByIdAndUpdate(
    taskId,
    updateFields,
    { new: true },
  );
  if (!task) throw new ApiError(404, "Task not found");

  if (assignedToId && (assignmentChanged || deadlineChanged)) {
    const project = await Project.findById(task.project);
    await notifyTaskAssigned({ task, project, actor: req.user, assignedTo: assignedToId });
  }

  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const existingTask = await Task.findById(taskId);
  if (!existingTask) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingTask.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new ApiError(404, "Task not found");
  
  // also delete related subtasks
  await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

  res.status(200).json(new ApiResponse(200, task, "Task deleted successfully"));
});

export const assignTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assignedTo, deadline } = req.body; // userId

  let assignedToId = assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null;
  const existingTask = await Task.findById(taskId);
  if (!existingTask) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingTask.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const update = { assignedTo: assignedToId };
  if (deadline !== undefined) {
    update.deadline = deadline ? new Date(deadline) : null;
    update.deadlineReminderSentAt = null;
  }

  const task = await Task.findByIdAndUpdate(taskId, update, { new: true });
  if (!task) throw new ApiError(404, "Task not found");

  if (assignedToId) {
    const project = await Project.findById(task.project);
    await notifyTaskAssigned({ task, project, actor: req.user, assignedTo: assignedToId });
  }

  res.status(200).json(new ApiResponse(200, task, "Task assigned successfully"));
});

export const sendTaskDeadlineReminders = async () => {
  const now = new Date();
  const inOneDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await Task.find({
    assignedTo: { $ne: null },
    deadline: { $gt: now, $lte: inOneDay },
    deadlineReminderSentAt: null,
    status: { $ne: "DONE" },
  }).populate("project", "name");

  for (const task of tasks) {
    const recipients = new Set([task.assignedTo.toString()]);
    const adminIds = await getProjectAdminIds(task.project._id);
    adminIds.forEach((adminId) => recipients.add(adminId.toString()));

    const deadlineText = formatDeadline(task.deadline);
    for (const recipient of recipients) {
      await createNotification({
        recipient,
        actor: task.createdBy,
        targetUser: task.assignedTo,
        project: task.project._id,
        task: task._id,
        type: NotificationTypeEnum.TASK_DEADLINE_REMINDER,
        title: "Task deadline tomorrow",
        message: `"${task.title}" is due on ${deadlineText}.`,
      });
    }

    task.deadlineReminderSentAt = new Date();
    await task.save({ validateBeforeSave: false });
  }
};

export const changeTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
  if (!validStatuses.includes(status)) throw new ApiError(400, "Invalid status");

  const existingTask = await Task.findById(taskId);
  if (!existingTask) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingTask.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
  if (!task) throw new ApiError(404, "Task not found");

  res.status(200).json(new ApiResponse(200, task, "Task status updated successfully"));
});

// Subtask Controllers
export const createSubtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(task.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

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

  const existingSubtask = await Subtask.findById(subtaskId).populate("task", "project");
  if (!existingSubtask) throw new ApiError(404, "Subtask not found");
  if (!existingSubtask.task) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingSubtask.task.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const subtask = await Subtask.findByIdAndUpdate(subtaskId, { title }, { new: true });
  if (!subtask) throw new ApiError(404, "Subtask not found");

  res.status(200).json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

export const deleteSubtask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const existingSubtask = await Subtask.findById(subtaskId).populate("task", "project");
  if (!existingSubtask) throw new ApiError(404, "Subtask not found");
  if (!existingSubtask.task) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingSubtask.task.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const subtask = await Subtask.findByIdAndDelete(subtaskId);
  if (!subtask) throw new ApiError(404, "Subtask not found");

  res.status(200).json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

export const markSubtaskComplete = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { isCompleted } = req.body;

  const existingSubtask = await Subtask.findById(subtaskId).populate("task", "project");
  if (!existingSubtask) throw new ApiError(404, "Subtask not found");
  if (!existingSubtask.task) throw new ApiError(404, "Task not found");
  const hasAccess = await checkProjectAccess(existingSubtask.task.project, req.user._id);
  if (!hasAccess) throw new ApiError(403, "Access denied to this project");

  const subtask = await Subtask.findByIdAndUpdate(subtaskId, { isCompleted: !!isCompleted }, { new: true });
  if (!subtask) throw new ApiError(404, "Subtask not found");

  res.status(200).json(new ApiResponse(200, subtask, "Subtask completion status updated successfully"));
});

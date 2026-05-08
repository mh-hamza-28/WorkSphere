import { z } from "zod";
import { AvailableUserRole } from "../utils/constants.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const optionalText = z.string().trim().max(2000).optional().or(z.literal(""));
const taskStatus = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

const schema = (shape) =>
  z.object({
    body: z.object(shape.body || {}).strict().optional().default({}),
    params: z.object(shape.params || {}).strict().optional().default({}),
    query: z.object(shape.query || {}).strict().optional().default({}),
  });

export const registerSchema = schema({
  body: {
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
    fullname: z.string().trim().min(1, "Full name is required").max(80),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(5, "Password must be at least 5 characters").max(72),
  },
});

export const loginSchema = schema({
  body: {
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  },
});

export const resendEmailVerificationSchema = schema({
  body: {
    email: z.string().trim().toLowerCase().email("Invalid email").optional(),
  },
});

export const forgotPasswordSchema = schema({
  body: {
    email: z.string().trim().toLowerCase().email("Email is invalid"),
  },
});

export const resetPasswordSchema = schema({
  params: {
    resetToken: z.string().min(1, "Reset token is required"),
  },
  body: {
    newPassword: z.string().min(5, "Password must be at least 5 characters").max(72),
  },
});

export const changePasswordSchema = schema({
  body: {
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(5, "Password must be at least 5 characters").max(72),
  },
});

export const verifyEmailSchema = schema({
  params: {
    verificationToken: z.string().min(1, "Verification token is required"),
  },
});

export const createProjectSchema = schema({
  body: {
    name: z.string().trim().min(1, "Name is required").max(120),
    description: optionalText,
  },
});

export const projectIdSchema = schema({
  params: {
    projectId: objectId,
  },
});

export const addMemberToProjectSchema = schema({
  params: {
    projectId: objectId,
  },
  body: {
    email: z.string().trim().toLowerCase().email("Invalid email"),
    role: z.enum(AvailableUserRole, "Role is invalid"),
  },
});

export const projectMemberSchema = schema({
  params: {
    projectId: objectId,
    userId: objectId,
  },
});

export const updateMemberRoleSchema = schema({
  params: {
    projectId: objectId,
    userId: objectId,
  },
  body: {
    newRole: z.enum(AvailableUserRole, "Role is invalid"),
  },
});

export const projectTasksSchema = schema({
  params: {
    projectId: objectId,
  },
});

export const createTaskSchema = schema({
  params: {
    projectId: objectId,
  },
  body: {
    title: z.string().trim().min(1, "Task title is required").max(160),
    description: optionalText,
    assignedTo: objectId.optional().or(z.literal("")),
    status: taskStatus.optional(),
    deadline: z.coerce.date().optional().nullable().or(z.literal("")),
  },
});

export const taskIdSchema = schema({
  params: {
    taskId: objectId,
  },
});

export const updateTaskSchema = schema({
  params: {
    taskId: objectId,
  },
  body: {
    title: z.string().trim().min(1, "Task title is required").max(160).optional(),
    description: optionalText,
    assignedTo: objectId.optional().nullable().or(z.literal("")),
    status: taskStatus.optional(),
    deadline: z.coerce.date().optional().nullable().or(z.literal("")),
  },
});

export const assignTaskSchema = schema({
  params: {
    taskId: objectId,
  },
  body: {
    assignedTo: objectId.optional().nullable().or(z.literal("")),
    deadline: z.coerce.date().optional().nullable().or(z.literal("")),
  },
});

export const taskStatusSchema = schema({
  params: {
    taskId: objectId,
  },
  body: {
    status: taskStatus,
  },
});

export const createSubtaskSchema = schema({
  params: {
    taskId: objectId,
  },
  body: {
    title: z.string().trim().min(1, "Subtask title is required").max(160),
  },
});

export const subtaskIdSchema = schema({
  params: {
    subtaskId: objectId,
  },
});

export const updateSubtaskSchema = schema({
  params: {
    subtaskId: objectId,
  },
  body: {
    title: z.string().trim().min(1, "Subtask title is required").max(160),
  },
});

export const subtaskStatusSchema = schema({
  params: {
    subtaskId: objectId,
  },
  body: {
    isCompleted: z.coerce.boolean(),
  },
});

export const notificationIdSchema = schema({
  params: {
    notificationId: objectId,
  },
});

export const respondToInviteSchema = schema({
  params: {
    notificationId: objectId,
  },
  body: {
    action: z.enum(["accept", "reject"]),
  },
});

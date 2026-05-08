import mongoose, { Schema } from "mongoose";

export const NotificationTypeEnum = {
  PROJECT_CREATED: "project_created",
  PROJECT_INVITE: "project_invite",
  PROJECT_INVITE_ACCEPTED: "project_invite_accepted",
  PROJECT_INVITE_REJECTED: "project_invite_rejected",
  ROLE_ASSIGNED: "role_assigned",
  TASK_ASSIGNED: "task_assigned",
  TASK_DEADLINE_REMINDER: "task_deadline_reminder",
};

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    type: {
      type: String,
      enum: Object.values(NotificationTypeEnum),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    invitationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", null],
      default: null,
    },
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

notificationSchema.index(
  { recipient: 1, project: 1, targetUser: 1, type: 1, invitationStatus: 1 },
  { partialFilterExpression: { type: NotificationTypeEnum.PROJECT_INVITE } },
);

export const Notification = mongoose.model("Notification", notificationSchema);

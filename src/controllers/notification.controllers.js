import mongoose from "mongoose";
import { Notification, NotificationTypeEnum } from "../models/notification.model.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { createNotification } from "../services/notification.service.js";
import { UserRolesEnum } from "../utils/constants.js";

const notificationPopulate = [
  { path: "actor", select: "username fullname email avatar" },
  { path: "targetUser", select: "username fullname email avatar" },
  { path: "project", select: "name createdAt" },
  { path: "task", select: "title status deadline" },
];

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate(notificationPopulate)
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, recipient: req.user._id },
    { read: true },
    { new: true },
  ).populate(notificationPopulate);

  if (!notification) throw new ApiError(404, "Notification not found");

  res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { $set: { read: true } },
  );

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Notifications marked as read"));
});

export const respondToProjectInvite = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const { action } = req.body;

  if (!["accept", "reject"].includes(action)) {
    throw new ApiError(400, "Action must be accept or reject");
  }

  const invite = await Notification.findOne({
    _id: notificationId,
    recipient: req.user._id,
    type: NotificationTypeEnum.PROJECT_INVITE,
    invitationStatus: "pending",
  }).populate("project actor targetUser");

  if (!invite) throw new ApiError(404, "Pending invitation not found");

  const project = await Project.findById(invite.project?._id);
  if (!project) throw new ApiError(404, "Project not found");

  invite.invitationStatus = action === "accept" ? "accepted" : "rejected";
  invite.read = true;
  invite.respondedAt = new Date();
  await invite.save();

  if (action === "accept") {
    await ProjectMember.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(invite.project._id),
      },
      {
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(invite.project._id),
        role: invite.role || UserRolesEnum.MEMBER,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await createNotification({
      recipient: invite.actor._id,
      actor: req.user._id,
      targetUser: req.user._id,
      project: invite.project._id,
      type: NotificationTypeEnum.PROJECT_INVITE_ACCEPTED,
      title: "User added to project",
      message: `${req.user.fullname || req.user.username} accepted ${project.name}.`,
    });
  } else {
    await createNotification({
      recipient: invite.actor._id,
      actor: req.user._id,
      targetUser: req.user._id,
      project: invite.project._id,
      type: NotificationTypeEnum.PROJECT_INVITE_REJECTED,
      title: "Project request rejected",
      message: `${req.user.fullname || req.user.username} rejected ${project.name}.`,
    });
  }

  const updatedInvite = await Notification.findById(invite._id)
    .populate(notificationPopulate)
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, updatedInvite, `Invitation ${action}ed`));
});

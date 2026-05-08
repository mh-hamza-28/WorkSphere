import { Notification } from "../models/notification.model.js";
import { emitToUser } from "../utils/socket.js";

const populateNotification = (query) =>
  query
    .populate("actor", "username fullname email avatar")
    .populate("targetUser", "username fullname email avatar")
    .populate("project", "name createdAt")
    .populate("task", "title status deadline")
    .lean();

export const createNotification = async (payload) => {
  const notification = await Notification.create(payload);
  const populated = await populateNotification(
    Notification.findById(notification._id),
  );
  emitToUser(populated.recipient, "notification:new", populated);
  return populated;
};

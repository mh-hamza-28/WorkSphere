import { Router } from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  respondToProjectInvite,
} from "../controllers/notification.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/read-all").patch(markAllNotificationsRead);
router.route("/:notificationId/read").patch(markNotificationRead);
router.route("/:notificationId/respond").post(respondToProjectInvite);

export default router;

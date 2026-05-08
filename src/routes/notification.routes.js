import { Router } from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  respondToProjectInvite,
} from "../controllers/notification.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  notificationIdSchema,
  respondToInviteSchema,
} from "../validators/validator.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/read-all").patch(markAllNotificationsRead);
router.route("/:notificationId/read").patch(validate(notificationIdSchema), markNotificationRead);
router.route("/:notificationId/respond").post(validate(respondToInviteSchema), respondToProjectInvite);

export default router;

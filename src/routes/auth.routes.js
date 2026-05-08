import express from "express";
import {registerUser,Login,LogoutUser, refreshAccessToken,forgotPasswordRequest, getCurrentUser,resetForgottenPassword, verifyEmail, changeCurrentPassword, resendEmailVerification} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendEmailVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();


// unsecure routes //
// <---------------------------------------------------->//

//testing route
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

// register route
router.route("/register").post(authLimiter, validate(registerSchema), registerUser);

// login route
router.route("/login").post(authLimiter, validate(loginSchema), Login);

// verify email route
router.route("/verify-email/:verificationToken")
.get(validate(verifyEmailSchema), verifyEmail);

// refresh token route
router.route("/refresh-token").post(refreshAccessToken);

// forgot-password route
router.route("/forgot-password").post(authLimiter, validate(forgotPasswordSchema), forgotPasswordRequest);

// reset-password route
router.route("/reset-password/:resetToken").post(validate(resetPasswordSchema), resetForgottenPassword);

// resend-email-verification route
router.route("/resend-email-verification").post(authLimiter, validate(resendEmailVerificationSchema), resendEmailVerification);


// <--------------------------------------------------------> //



// secure routes //
// <----------------------------------------------------------> //

// logout route - secured route, user must be authenticated to logout
router.route("/logout").post(verifyJWT, LogoutUser);

// current-user route
router.route("/current-user").post(verifyJWT, getCurrentUser);

// change-password route
router.route("/change-password").post(verifyJWT, validate(changePasswordSchema), changeCurrentPassword);

// <---------------------------------------------------------------> //



export default router;

import express from "express";
import {registerUser,Login,LogoutUser, refreshAccessToken,forgotPasswordRequest, getCurrentUser,resetForgottenPassword, verifyEmail, changeCurrentPassword, resendEmailVerification} from "../controllers/auth.controllers.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { useRegisterValidator, userLoginValidator, asyncHandler,userChangePasswordValidator,userForgotPasswordValidator,userResetPasswordValidator } from "../validators/validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


// unsecure routes //
// <---------------------------------------------------->//

//testing route
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

// register route
router.route("/register").post(useRegisterValidator(), validateRequest, registerUser);

// login route
router.route("/login").post(userLoginValidator(), validateRequest, Login);

// verify email route
router.route("/verify-email/:verificationToken")
.get(verifyEmail);

// refresh token route
router.route("/refresh-token").post(refreshAccessToken);

// forgot-password route
router.route("/forgot-password").post( userForgotPasswordValidator(), validateRequest,forgotPasswordRequest);

// reset-password route
router.route("/reset-password/:resetToken").post( userResetPasswordValidator(), validateRequest,resetForgottenPassword);


// <--------------------------------------------------------> //



// secure routes //
// <----------------------------------------------------------> //

// logout route - secured route, user must be authenticated to logout
router.route("/logout").post(verifyJWT, LogoutUser);

// current-user route
router.route("/current-user").post(verifyJWT, getCurrentUser);

// change-password route
router.route("/change-password").post(verifyJWT, userChangePasswordValidator(),validateRequest,changeCurrentPassword);

// resend-email-verification route
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);

// <---------------------------------------------------------------> //



export default router;
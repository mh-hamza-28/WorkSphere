import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body;
  
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    email,  
    username,
    password,
    fullname,
    isEmailVerified: false,
  });

  const { unHashedtoken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailverificationToken = hashedToken;
  user.emailverificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user?.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedtoken}`,
      ),
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw new ApiError(500, "Verification email could not be sent. Please check SMTP settings.");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailverificationToken -emailverificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
      ),
    );
});

const Login = asyncHandler (async(req,res)=>
{
const {email,password,username} = req.body;

if (!email)
{
    throw new ApiError(400,"Email is required");
}
const user = await User.findOne({email});

if (!user)
{
    throw new ApiError(400,"User not found");
}

const isPasswordValid = await user.isPasswordCorrect(password);

if (!isPasswordValid)
{
    throw new ApiError(400,"Invalid password");
}

if (!user.isEmailVerified)
{
    throw new ApiError(403,"Please verify your email before logging in");
}

const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailverificationToken -emailverificationExpiry",
  );

const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to true in production
}
return res
.status(200)
.cookie("refreshToken", refreshToken, cookieOptions)
.cookie("accessToken", accessToken, cookieOptions)
.json(new ApiResponse
(200, 
   
    {
    success: true,
    user: loggedInUser,
    accessToken, refreshToken 
    }, 
    
    "User logged in successfully"
)
)
});

const LogoutUser = asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(req.user._id, 
{
    $set:{
        //delete
       refreshToken: "" ,
    }
}, 
 
{
  returnDocument: 'after'
},
);  
const options = 
{
    httpOnly: true,
    secure: false, // Set to true in production
}
return res
.status(200)
.clearCookie("refreshToken", options)
.clearCookie("accessToken", options)
.json(
  new ApiResponse(200, {},"User logged out successfully")); 
});

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "Current user retrieved successfully"));
});

const verifyEmail = asyncHandler(async(req,res)=>{ 
  const verificationtoken = req.params.verificationToken;

  if (!verificationtoken)
  {
    throw new ApiError(400, "Verification token is missing");
  }

  let hashedToken= crypto
  .createHash("sha256")
  .update(verificationtoken).
  digest("hex");
  
 const user = await User.findOne({
    emailverificationToken: hashedToken,
    emailverificationExpiry: { $gt: Date.now()
    },
    });

    if (!user)
    {
    throw new ApiError(400, "Invalid or expired verification token");
    }

    user.emailverificationToken = undefined;
    user.emailverificationExpiry = undefined;

    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?verified=true`);
});

const resendEmailVerification = asyncHandler(async(req,res)=>{
  if (!req.user?._id && !req.body.email) {
    throw new ApiError(400, "Email is required");
  }

  const user = req.user?._id
    ? await User.findById(req.user._id)
    : await User.findOne({ email: req.body.email.toLowerCase() });

if(!user)
{
  throw new ApiError(404, "User not found");
}

if (user.isEmailVerified)
{
  throw new ApiError(409, "Email is already verified");
}
const { unHashedtoken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailverificationToken = hashedToken;
  user.emailverificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedtoken}`,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: user.email },
        "Verification email resent successfully",
      ),
    );
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
  {
    throw new ApiError(401, "Refresh token is missing");
  }

  try
  {
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

   const user = await User.findById(decodedToken?._id);
   if (!user)   {
    throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken)
    {
      throw new ApiError(401, "Refresh token expired, please login again");
    }

const options = {
  httpOnly: true,
secure: false, // Set to true in production
}
const { accessToken, refreshToken:newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

user.refreshToken = newRefreshToken;
await user.save();

return res
.status(200)
.cookie("refreshToken", newRefreshToken, options)
.cookie("accessToken", accessToken, options)
.json(
  new ApiResponse(200,
    {
      accessToken,
      refreshToken: newRefreshToken,
    },
    "Access token refreshed successfully"
  ));
  }

  catch (error)
  {
    throw new ApiError(401, "invalid refresh token");
  }
});

const forgotPasswordRequest = asyncHandler(async(req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({ email });

  if (!user)
  {
    throw new ApiError(404, "User with this email does not exist");
  }

const { unHashedtoken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

user.forgotPasswordToken = hashedToken;
user.forgotPasswordTokenExpiry = tokenExpiry;

await user.save({ validateBeforeSave: false });

await sendEmail({
  email: user?.email,
  subject: "Password Reset Request",
  mailgenContent: forgotPasswordMailgenContent(
    user.username,
    `${process.env.FORGOT_PASSWORD_URL || `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password`}/${unHashedtoken}`,
  ),
});
return res
.status(200)
.json(
  new ApiResponse(200, {}, "Password reset instructions have been sent to your email")
);
});

const resetForgottenPassword = asyncHandler(async(req,res)=>{
  const {newPassword} = req.body;
  const {resetToken} = req.params;

  let hashedToken = crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

const user = await User.findOne({
  forgotPasswordToken: hashedToken,
  forgotPasswordTokenExpiry: { $gt: Date.now() }
  })

  if (!user)
{
  throw new ApiError(400, "Invalid or expired password reset token");
}
user.forgotPasswordTokenExpiry = undefined;
user.forgotPasswordToken = undefined;

user.password = newPassword;
await user.save();

return res
.status(200)
.json(
  new ApiResponse(200, {}, "Password has been reset successfully")
);
});

const changeCurrentPassword = asyncHandler(async(req,res)=>{
   const {oldPassword, newPassword} = req.body;
   const user = await User.findById(req.user?._id);

   const isPasswordValid =await user.isPasswordCorrect(oldPassword);

   if (!isPasswordValid)
    {
      throw new ApiError(400, "Old password is incorrect");
    }
    user.password = newPassword;
    user.refreshToken = "";
    await user.save();
    return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password has been changed successfully")
    );
  });


export { registerUser, generateAccessAndRefreshTokens, Login, LogoutUser, getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken,forgotPasswordRequest, resetForgottenPassword, changeCurrentPassword };

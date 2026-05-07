import rateLimit from "express-rate-limit";

export const inviteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many invites",
});
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { User } from "../models/user.model.js";

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded?._id).select("_id");
      if (!user) return next(new Error("Unauthorized"));

      socket.userId = user._id.toString();
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    socket.join(userId);
    onlineUsers.set(userId, (onlineUsers.get(userId) || 0) + 1);

    socket.on("disconnect", () => {
      const count = (onlineUsers.get(userId) || 1) - 1;
      if (count <= 0) onlineUsers.delete(userId);
      else onlineUsers.set(userId, count);
    });
  });

  return io;
};

export const emitToUser = (userId, event, payload) => {
  if (!io || !userId) return;
  io.to(userId.toString()).emit(event, payload);
};

export const isUserOnline = (userId) => onlineUsers.has(userId?.toString());

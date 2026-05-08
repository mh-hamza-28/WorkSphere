import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { logger, morganStream } from "./utils/logger.js";
import { sanitizeRequest } from "./middlewares/sanitize.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

//basic configuration for express app
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);
app.use(compression());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(hpp());
app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
        stream: morganStream,
        skip: (req) => req.path === "/api/v1/healthcheck",
    }),
);

//CORS configuration 
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use("/api", apiLimiter);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notifications", notificationRouter);

app.get("/", (req, res) => {
    res.send("Welcome to my project!");
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        errors: [],
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const log = statusCode >= 500 ? logger.error.bind(logger) : logger.warn.bind(logger);
    log(message, {
        statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
        errors: err.errors || [],
    });
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

export default app;

import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/database.js";
import http from "http";
import { initSocket } from "./src/utils/socket.js";
import { sendTaskDeadlineReminders } from "./src/controllers/task.controllers.js";
import { logger } from "./src/utils/logger.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);
initSocket(server);
let reminderInterval;

connectDB()
.then( () => {
    sendTaskDeadlineReminders().catch((error) => {
        logger.error("Failed to send deadline reminders", { stack: error.stack });
    });
    reminderInterval = setInterval(() => {
        sendTaskDeadlineReminders().catch((error) => {
            logger.error("Failed to send deadline reminders", { stack: error.stack });
        });
    }, 60 * 60 * 1000);

    server.listen(port, async () => {
        logger.info(`Server is running on port ${port}`);

    });
})
.catch((err) => {
    logger.error("Failed to connect to the database", { stack: err.stack });
    process.exit(1);
});

const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down`);
    if (reminderInterval) clearInterval(reminderInterval);
    server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason });
    shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", { stack: error.stack });
    process.exit(1);
});



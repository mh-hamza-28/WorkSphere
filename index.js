import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/database.js";
import http from "http";
import { initSocket } from "./src/utils/socket.js";
import { sendTaskDeadlineReminders } from "./src/controllers/task.controllers.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);
initSocket(server);

connectDB()
.then( () => {
    sendTaskDeadlineReminders().catch((error) => {
        console.error("Failed to send deadline reminders:", error);
    });
    setInterval(() => {
        sendTaskDeadlineReminders().catch((error) => {
            console.error("Failed to send deadline reminders:", error);
        });
    }, 60 * 60 * 1000);

    server.listen(port, async () => {
        console.log(`Server is running on port ${port}`);

    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});



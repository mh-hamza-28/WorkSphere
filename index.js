import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/database.js";
import { verifyTransporter } from "./src/utils/mail.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
.then( () => {
    app.listen(port, async () => {
        console.log(`Server is running on port ${port}`);
        await verifyTransporter();
    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});



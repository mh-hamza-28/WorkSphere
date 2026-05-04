import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/database.js";


dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
.then( () => {
    
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});



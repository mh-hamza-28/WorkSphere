import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", { stack: error.stack });
    process.exit(1);
  }
};

export default connectDB;

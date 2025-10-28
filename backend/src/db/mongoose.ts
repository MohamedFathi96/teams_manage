import mongoose from "mongoose";
import { config } from "../config/index.js";
import { logger } from "../lib/logger.js";

export async function connectToDatabase(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error", { error });
    process.exit(1);
  }
}

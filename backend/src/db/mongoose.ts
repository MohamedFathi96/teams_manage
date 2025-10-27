import mongoose from "mongoose";
import { config } from "../config/index.ts";
import { logger } from "../lib/logger.ts";

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

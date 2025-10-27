import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default((60 * 60 * 24 * 7).toString()),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables. Fix the following:\n${issues}`);
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  isDev: parsed.data.NODE_ENV === "development",
  port: Number(parsed.data.PORT),
  mongoUri: parsed.data.MONGODB_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: Number(parsed.data.JWT_EXPIRES_IN),
} as const;

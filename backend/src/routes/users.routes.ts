import { Router } from "express";
import { getUsers, getUserProfile } from "../controllers/users.controller.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const router = Router();

// Query validation schema for get users
const getUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  search: z.string().optional(),
});

// Params validation schema for get user profile
const getUserProfileParamsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

// Routes
router.get("/", validate(getUsersQuerySchema, "query"), getUsers);
router.get("/:userId", validate(getUserProfileParamsSchema, "params"), getUserProfile);

export default router;

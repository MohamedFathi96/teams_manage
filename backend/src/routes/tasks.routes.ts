import { Router } from "express";
import {
  createTaskHandler,
  getTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getUserTasksHandler,
  getMyTasksHandler,
  getTaskStatsHandler,
  getAllTaskStatsHandler,
} from "../controllers/tasks.controller.ts";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  assignedTo: z.string().min(1, "Assigned user ID is required"),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  assignedTo: z.string().min(1).optional(),
});

const getTasksQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  search: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const taskParamsSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
});

const userParamsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

const getUserTasksQuerySchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  search: z.string().optional(),
});

const getMyTasksQuerySchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  search: z.string().optional(),
});

const getTaskStatsQuerySchema = z.object({
  userId: z.string().optional(),
});

// Routes

// Task CRUD operations
router.post("/", validate(createTaskSchema, "body"), createTaskHandler);
router.get("/", validate(getTasksQuerySchema, "query"), getTasksHandler);
router.get("/:taskId", validate(taskParamsSchema, "params"), getTaskHandler);
router.put("/:taskId", validate(taskParamsSchema, "params"), validate(updateTaskSchema, "body"), updateTaskHandler);
router.delete("/:taskId", validate(taskParamsSchema, "params"), deleteTaskHandler);

// User-specific task routes
router.get(
  "/user/:userId",
  validate(userParamsSchema, "params"),
  validate(getUserTasksQuerySchema, "query"),
  getUserTasksHandler
);

// My tasks route
router.get("/my/tasks", validate(getMyTasksQuerySchema, "query"), getMyTasksHandler);

// Statistics routes
router.get("/stats/all", getAllTaskStatsHandler);
router.get("/stats/user", validate(getTaskStatsQuerySchema, "query"), getTaskStatsHandler);

export default router;

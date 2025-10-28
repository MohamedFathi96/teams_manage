import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TasksPage } from "@/features/tasks/page";

const tasksSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().min(1).optional(),
  create: z.string().optional(),
  edit: z.string().optional(),
});

export const Route = createFileRoute("/_autherized/tasks")({
  validateSearch: tasksSearchSchema,
  component: TasksPage,
});

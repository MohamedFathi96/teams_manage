import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import usersRoutes from "./users.routes.ts";
import tasksRoutes from "./tasks.routes.ts";
import { authMiddleware } from "@/lib/jwt.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, usersRoutes);
router.use("/tasks", authMiddleware, tasksRoutes);

export default router;

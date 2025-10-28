import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes";
import { authMiddleware } from "@/lib/jwt";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, usersRoutes);
router.use("/tasks", authMiddleware, tasksRoutes);

export default router;

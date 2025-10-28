import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import tasksRoutes from "./tasks.routes.js";
import { authMiddleware } from "@/lib/jwt.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, usersRoutes);
router.use("/tasks", authMiddleware, tasksRoutes);

export default router;

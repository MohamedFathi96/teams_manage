import { Router } from "express";
import { register, login } from "../controllers/auth.controller.ts";
import { z } from "zod";
import { validate } from "../middleware/validate.ts";

const router = Router();

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;

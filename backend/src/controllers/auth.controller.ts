import type { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "../services/auth.service.ts";
import { catchAsync } from "../utils/catchAsync.ts";
import { ApiResponseHelper } from "../utils/responceHelper.ts";

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await registerUser(req.body);
  res.status(201).json(ApiResponseHelper.success(result, "User registered successfully", 201));
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await loginUser(req.body);
  res.status(200).json(ApiResponseHelper.success(result));
});

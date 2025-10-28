import type { Request, Response, NextFunction } from "express";
import { loginUser, registerUser, refreshTokens, logoutUser } from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponseHelper } from "../utils/responceHelper.js";

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await registerUser(req.body);
  res.status(201).json(ApiResponseHelper.success(result, "User registered successfully", 201));
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await loginUser(req.body);
  res.status(200).json(ApiResponseHelper.success(result));
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  const result = await refreshTokens(refreshToken);
  res.status(200).json(ApiResponseHelper.success(result, "Tokens refreshed successfully"));
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  const result = await logoutUser(refreshToken);
  res.status(200).json(ApiResponseHelper.success(result));
});

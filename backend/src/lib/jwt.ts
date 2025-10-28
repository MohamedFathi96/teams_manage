import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/index";
import { UnauthorizedError } from "../errors/AppError";
import crypto from "crypto";

export type JwtPayload = {
  sub: string; // user id
  email: string;
};

export function signToken(payload: JwtPayload, expiresInSeconds = config.jwtExpiresIn): string {
  // Using numeric expiresIn to satisfy jsonwebtoken@9 types
  return jwt.sign(payload, config.jwtSecret, { expiresIn: expiresInSeconds });
}

export function signRefreshToken(payload: JwtPayload, expiresInSeconds = config.jwtRefreshExpiresIn): string {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: expiresInSeconds });
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!token) return next(new UnauthorizedError("Missing bearer token"));
  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
}

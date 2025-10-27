import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.ts";
import { AppError } from "../errors/AppError.ts";
import { ApiResponseHelper } from "../utils/responceHelper.ts";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError("Route not found", 404));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { stack: err.stack });
    } else {
      logger.warn(err.message);
    }
    const errorResponse = ApiResponseHelper.error(
      err.message,
      err.statusCode,
      err.name,
      err.statusCode >= 500 ? undefined : err.stack
    );
    return res.status(err.statusCode).json(errorResponse);
  }

  // Unknown error
  const error = err as Error;
  logger.error("Unexpected error", { message: error?.message, stack: error?.stack });
  const errorResponse = ApiResponseHelper.error("Internal server error", 500, "INTERNAL_SERVER_ERROR", error?.message);
  return res.status(500).json(errorResponse);
}

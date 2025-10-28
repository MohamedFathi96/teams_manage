import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { BadRequestError } from "../errors/AppError.js";

export function validate<T>(schema: ZodSchema<T>, property: "body" | "params" | "query" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req[property]);
      Object.assign(req[property], result);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.issues?.[0];
        const message = first ? `${first.path.join(".")}: ${first.message}` : "Validation error";
        return next(new BadRequestError(message));
      }
      return next(err);
    }
  };
}

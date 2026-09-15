import { type NextFunction, type Request, type Response } from "express";
import type ErrorHandler from "../utils/utility-class.js";
import type { ControllerType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.message ||= "Internal server error";
  err.statusCode ||= 500;

  return res.status(400).json({
    success: false,
    message: err.message,
  });
};

export const tryCatch = (func: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
};

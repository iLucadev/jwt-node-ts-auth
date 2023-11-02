// error.middleware.ts

import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import logger from "../utils/logger";

const errorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Internal Server Error"; // Use a generic message for non-operational errors

  const response = {
    status: error.status,
    message: error.isOperational ? message : "An error occurred", // Show generic message for non-operational errors
  };

  if (error.isOperational) {
    res.status(status).json(response);
  } else {
    // Register error using logger
    logger.error(`[${error.status}] ${message}`, { stack: error.stack });

    // Do not reveal sensitive details to the user for non-operational errors
    res.status(status).json({
      status: "error",
      message: "An error occurred",
    });
  }
};

export default errorMiddleware;

import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let details = err.details;

  // Mongoose / Mongo specific errors
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  } else if (err.name === "ValidationError") {
    status = 400;
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = "Validation failed";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON body";
  }

  if (status >= 500) console.error("💥", err);

  res.status(status).json({
    success: false,
    message: status >= 500 && env.isProd ? "Internal server error" : message,
    ...(details && { details }),
    ...(!env.isProd && status >= 500 && { stack: err.stack }),
  });
}

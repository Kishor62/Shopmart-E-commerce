export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route nahi mila: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  // Galat ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Duplicate key (jaise email)
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue).join(", ")} pehle se exist karta hai`;
  }
  // Multer upload errors
  if (err.name === "MulterError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

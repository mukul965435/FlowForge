import AppError from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.errorCode = err.errorCode || "SERVER_ERROR";

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new AppError(message, 409, "DUPLICATE_KEY_ERROR");
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new AppError(message, 400, "VALIDATION_ERROR");
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400, "INVALID_ID");
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    error: {
      code: error.errorCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

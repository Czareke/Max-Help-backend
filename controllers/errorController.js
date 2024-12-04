const AppError = require("../utils/appError");
require('dotenv').config();

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  // Handle duplicate key errors for any field dynamically
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: '${value}'. Please use another value for '${field}'.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errorMessages = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errorMessages.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTErrorDB = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleExpiredToken = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: Send generic message
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went really wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV_DEV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    // Handle specific error types
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTErrorDB();
    if (err.name === "TokenExpiredError") error = handleExpiredToken();

    sendErrorProd(error, res);
  }
};

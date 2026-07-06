import { ErrorRequestHandler } from 'express';
import config from '../config';

// Converts Mongoose/JWT errors into consistent HTTP responses; hides internals in prod
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  // Mongoose: invalid ObjectId or cast failure
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  }
  // Mongoose: schema validation failure
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e: any) => e.message);
    message = messages.join(', ');
  }
  // Mongoose: unique constraint violation (duplicate key)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for "${field}". It already exists.`;
  }
  // JWT issues (safety net — the auth middleware already converts these)
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  const isDevelopment = config.node_env === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    // Stack and raw error stay local; never leak internals to clients
    ...(isDevelopment ? { errorDetails: err, stack: err.stack } : {}),
  });
};

export default globalErrorHandler;

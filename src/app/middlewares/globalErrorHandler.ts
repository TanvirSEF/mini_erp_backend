import { ErrorRequestHandler } from 'express';
import config from '../config';

// map mongoose and jwt errors to clean http responses
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  // invalid objectid
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  }
  // schema validation
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e: any) => e.message);
    message = messages.join(', ');
  }
  // duplicate key
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for "${field}". It already exists.`;
  }
  // jwt errors auth middleware usually catches these first
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
    // only in dev
    ...(isDevelopment ? { errorDetails: err, stack: err.stack } : {}),
  });
};

export default globalErrorHandler;

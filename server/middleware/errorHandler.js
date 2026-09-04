import { ApiResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

/**
 * Async handler wrapper to eliminate repetitive try/catch blocks across controllers
 * @param {Function} fn - Async controller function (req, res, next)
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  return ApiResponse.error(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    404,
    'NOT_FOUND'
  );
};

/**
 * Centralized Application Error Handling Middleware
 */
export const errorHandler = (err, req, res, _next) => {
  logger.error(`Unhandled Request Error [${req.method} ${req.originalUrl}]`, err);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const errorCode = err.errorCode || 'SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred';

  return ApiResponse.error(res, message, statusCode, errorCode, err.details || null);
};

export default {
  asyncHandler,
  notFoundHandler,
  errorHandler
};

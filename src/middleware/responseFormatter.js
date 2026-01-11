import crypto from 'crypto';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ResponseFormatter');

/**
 * Generate unique request ID
 */
const generateRequestId = () => {
  return 'req_' + crypto.randomBytes(12).toString('base64url');
};

/**
 * Request ID Middleware
 * Attaches a unique request ID to each request for tracking
 */
export const requestIdMiddleware = (req, res, next) => {
  // Use existing request ID from header or generate new one
  req.requestId = req.headers['x-request-id'] || generateRequestId();
  res.set('X-Request-ID', req.requestId);
  next();
};

/**
 * Success Response Helper
 * Standardizes successful API responses
 */
export const sendSuccess = (res, data, options = {}) => {
  const { 
    statusCode = 200, 
    pagination = null, 
    meta = {} 
  } = options;
  
  const response = {
    success: true,
    data,
    meta: {
      requestId: res.req?.requestId,
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
  
  if (pagination) {
    response.meta.pagination = pagination;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Error Response Helper
 * Standardizes error API responses
 */
export const sendError = (res, error, options = {}) => {
  const { 
    statusCode = 500 
  } = options;
  
  const response = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      ...(error.details && { details: error.details }),
      ...(error.retryAfter && { retryAfter: error.retryAfter })
    },
    meta: {
      requestId: res.req?.requestId,
      timestamp: new Date().toISOString()
    }
  };
  
  res.status(statusCode).json(response);
};

/**
 * Response Formatter Middleware
 * Adds helper methods to response object for consistent formatting
 */
export const responseFormatter = (req, res, next) => {
  // Add success helper
  res.success = (data, options = {}) => {
    sendSuccess(res, data, options);
  };
  
  // Add error helper
  res.error = (error, statusCode = 500) => {
    sendError(res, error, { statusCode });
  };
  
  // Add pagination helper
  res.paginate = (data, page, limit, total) => {
    sendSuccess(res, data, {
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  };
  
  next();
};

/**
 * Error Handler Middleware
 * Catches unhandled errors and formats them consistently
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error', {
    requestId: req.requestId,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  } else if (err.code === 'EBADCSRFTOKEN') {
    statusCode = 403;
  }
  
  // Build error response
  const errorResponse = {
    code: err.code || errorCodeFromStatus(statusCode),
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'An unexpected error occurred' 
      : err.message
  };
  
  // Add validation details if present
  if (err.details || err.errors) {
    errorResponse.details = err.details || err.errors;
  }
  
  sendError(res, errorResponse, { statusCode });
};

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (req, res) => {
  sendError(res, {
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  }, { statusCode: 404 });
};

/**
 * Helper to get error code from status
 */
function errorCodeFromStatus(status) {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'INTERNAL_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE'
  };
  return codes[status] || 'UNKNOWN_ERROR';
}

/**
 * API Error Classes for throwing structured errors
 */
export class ApiError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded', retryAfter = null) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export default {
  requestIdMiddleware,
  responseFormatter,
  errorHandler,
  notFoundHandler,
  sendSuccess,
  sendError,
  ApiError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError
};


import { Elysia, ValidationError } from 'elysia';
import { env } from '../env';
import { logger } from '../config/logger';
import { customErrors, ApiError } from '../utils/errors';

export const errorHandlerMiddleware = new Elysia({ name: 'error-handler' })
  // Register custom errors for type-safe error handling
  .error(customErrors)
  .onError({ as: 'global' }, ({ code, error: err, status, ...ctx }) => {
    const rid = (ctx as { requestId?: string }).requestId;
    const e = err as Error;

    // Handle custom ApiError classes (they have toResponse method)
    if (err instanceof ApiError) {
      logger.error('Request error', {
        requestId: rid,
        code: err.code,
        status: err.status,
        error: err.message,
        stack: env.isProd ? undefined : err.stack,
      });
      return err.toResponse();
    }

    let statusCode: number;
    let message: string;
    let errorCode: string;

    switch (code) {
      case 'VALIDATION': {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
        // Use built-in toResponse() for detailed validation info
        const validationError = err as ValidationError;
        message = validationError.message || 'Validation failed';

        // In non-production, return detailed validation info
        if (!env.isProd) {
          logger.error('Validation error', {
            requestId: rid,
            code: errorCode,
            status: statusCode,
            error: message,
          });
          return validationError.toResponse();
        }
        break;
      }
      case 'NOT_FOUND':
        statusCode = 404;
        message = 'Resource not found';
        errorCode = 'NOT_FOUND';
        break;
      case 'PARSE':
        statusCode = 400;
        message = 'Invalid request body';
        errorCode = 'PARSE_ERROR';
        break;
      default:
        statusCode = 500;
        message = env.isProd ? 'Internal server error' : e?.message || 'Unknown error';
        errorCode = 'INTERNAL_ERROR';
    }

    logger.error('Request error', {
      requestId: rid,
      code: errorCode,
      status: statusCode,
      error: env.isProd ? message : e?.message,
      stack: env.isProd ? undefined : e?.stack,
    });

    // Use status() helper from context for proper response
    return status(statusCode as 400 | 404 | 500, {
      success: false as const,
      error: {
        message,
        code: errorCode,
        ...(rid && { requestId: rid }),
      },
    });
  });

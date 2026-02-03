export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Create a success response
 */
export function success<T>(data: T, meta?: SuccessResponse['meta']): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

/**
 * Create a paginated success response
 */
export function paginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): SuccessResponse<T[]> {
  return {
    success: true,
    data,
    meta: { page, limit, total },
  };
}

/**
 * Create an error response
 */
export function error(message: string, code: string, details?: unknown): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
    },
  };
  if (details !== undefined) {
    response.error.details = details;
  }
  return response;
}

// Common error helpers
export const errors = {
  badRequest: (message = 'Bad request', details?: unknown) =>
    error(message, 'BAD_REQUEST', details),

  unauthorized: (message = 'Unauthorized') => error(message, 'UNAUTHORIZED'),

  forbidden: (message = 'Forbidden') => error(message, 'FORBIDDEN'),

  notFound: (message = 'Resource not found') => error(message, 'NOT_FOUND'),

  conflict: (message = 'Resource already exists') => error(message, 'CONFLICT'),

  validation: (message = 'Validation failed', details?: unknown) =>
    error(message, 'VALIDATION_ERROR', details),

  internal: (message = 'Internal server error') => error(message, 'INTERNAL_ERROR'),
};

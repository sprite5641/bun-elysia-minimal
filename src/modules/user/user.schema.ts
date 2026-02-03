import { t } from 'elysia';

// Request schemas
export const createUserSchema = t.Object({
  email: t.String({
    format: 'email',
    error: 'Invalid email format',
  }),
  password: t.String({
    minLength: 8,
    error: 'Password must be at least 8 characters',
  }),
});

export const updateUserSchema = t.Object({
  email: t.Optional(
    t.String({
      format: 'email',
      error: 'Invalid email format',
    }),
  ),
  password: t.Optional(
    t.String({
      minLength: 8,
      error: 'Password must be at least 8 characters',
    }),
  ),
});

export const userIdParamSchema = t.Object({
  id: t.String({
    format: 'uuid',
    error: 'Invalid user ID format (must be UUID)',
  }),
});

export const listUsersQuerySchema = t.Object({
  page: t.Optional(
    t.Numeric({
      minimum: 1,
      default: 1,
      error: 'Page must be a positive number',
    }),
  ),
  limit: t.Optional(
    t.Numeric({
      minimum: 1,
      maximum: 100,
      default: 20,
      error: 'Limit must be between 1 and 100',
    }),
  ),
});

// Response schemas
export const userResponseSchema = t.Object({
  id: t.String(),
  email: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const usersListResponseSchema = t.Object({
  success: t.Literal(true),
  data: t.Array(userResponseSchema),
  meta: t.Object({
    page: t.Number(),
    limit: t.Number(),
    total: t.Number(),
  }),
});

export const userSuccessResponseSchema = t.Object({
  success: t.Literal(true),
  data: userResponseSchema,
});

export const userDeleteResponseSchema = t.Object({
  success: t.Literal(true),
  data: t.Object({
    deleted: t.Literal(true),
  }),
});

export const errorResponseSchema = t.Object({
  success: t.Literal(false),
  error: t.String(),
});

// Types
export type CreateUserInput = typeof createUserSchema.static;
export type UpdateUserInput = typeof updateUserSchema.static;
export type UserResponse = typeof userResponseSchema.static;

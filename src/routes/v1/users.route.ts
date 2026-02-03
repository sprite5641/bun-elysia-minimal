import { Elysia } from 'elysia';
import { userService } from '../../modules/user/user.service';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from '../../modules/user/user.schema';
import { success, paginated } from '../../utils/response';
import { NotFoundError, ConflictError } from '../../utils/errors';

export const usersRoute = new Elysia({ name: 'Routes.Users', prefix: '/users' })
  // List all users
  .get(
    '/',
    async ({ query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const { users, total } = await userService.listUsers(page, limit);
      return paginated(users, page, limit, total);
    },
    {
      query: listUsersQuerySchema,
      detail: {
        summary: 'List users',
        description: 'Get a paginated list of all users',
        tags: ['Users'],
      },
    },
  )
  // Get user by ID
  .get(
    '/:id',
    async ({ params }) => {
      const user = await userService.getUserById(params.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return success(user);
    },
    {
      params: userIdParamSchema,
      detail: {
        summary: 'Get user by ID',
        description: 'Get a specific user by their ID',
        tags: ['Users'],
      },
    },
  )
  // Create new user
  .post(
    '/',
    async ({ body, status }) => {
      try {
        const user = await userService.createUser(body);
        return status(201, success(user));
      } catch (err) {
        if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
          throw new ConflictError('Email already exists');
        }
        throw err;
      }
    },
    {
      body: createUserSchema,
      detail: {
        summary: 'Create user',
        description: 'Create a new user account',
        tags: ['Users'],
      },
    },
  )
  // Update user
  .patch(
    '/:id',
    async ({ params, body }) => {
      try {
        const user = await userService.updateUser(params.id, body);
        if (!user) {
          throw new NotFoundError('User not found');
        }
        return success(user);
      } catch (err) {
        if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
          throw new ConflictError('Email already exists');
        }
        throw err;
      }
    },
    {
      params: userIdParamSchema,
      body: updateUserSchema,
      detail: {
        summary: 'Update user',
        description: 'Update an existing user',
        tags: ['Users'],
      },
    },
  )
  // Delete user
  .delete(
    '/:id',
    async ({ params }) => {
      const deleted = await userService.deleteUser(params.id);
      if (!deleted) {
        throw new NotFoundError('User not found');
      }
      return success({ deleted: true });
    },
    {
      params: userIdParamSchema,
      detail: {
        summary: 'Delete user',
        description: 'Delete a user by ID',
        tags: ['Users'],
      },
    },
  );

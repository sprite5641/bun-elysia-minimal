import { Elysia } from "elysia";
import { userService } from "../../modules/user/user.service";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from "../../modules/user/user.schema";
import { success, paginated, errors } from "../../utils/response";

export const usersRoute = new Elysia({ name: "Routes.Users", prefix: "/users" })
  // List all users
  .get(
    "/",
    async ({ query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const { users, total } = await userService.listUsers(page, limit);
      return paginated(users, page, limit, total);
    },
    {
      query: listUsersQuerySchema,
      detail: {
        summary: "List users",
        description: "Get a paginated list of all users",
        tags: ["Users"],
      },
    }
  )
  // Get user by ID
  .get(
    "/:id",
    async ({ params, set }) => {
      const user = await userService.getUserById(params.id);
      if (!user) {
        set.status = 404;
        return errors.notFound("User not found");
      }
      return success(user);
    },
    {
      params: userIdParamSchema,
      detail: {
        summary: "Get user by ID",
        description: "Get a specific user by their ID",
        tags: ["Users"],
      },
    }
  )
  // Create new user
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const user = await userService.createUser(body);
        set.status = 201;
        return success(user);
      } catch (err) {
        if (err instanceof Error && err.message === "EMAIL_EXISTS") {
          set.status = 409;
          return errors.conflict("Email already exists");
        }
        throw err;
      }
    },
    {
      body: createUserSchema,
      detail: {
        summary: "Create user",
        description: "Create a new user account",
        tags: ["Users"],
      },
    }
  )
  // Update user
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const user = await userService.updateUser(params.id, body);
        if (!user) {
          set.status = 404;
          return errors.notFound("User not found");
        }
        return success(user);
      } catch (err) {
        if (err instanceof Error && err.message === "EMAIL_EXISTS") {
          set.status = 409;
          return errors.conflict("Email already exists");
        }
        throw err;
      }
    },
    {
      params: userIdParamSchema,
      body: updateUserSchema,
      detail: {
        summary: "Update user",
        description: "Update an existing user",
        tags: ["Users"],
      },
    }
  )
  // Delete user
  .delete(
    "/:id",
    async ({ params, set }) => {
      const deleted = await userService.deleteUser(params.id);
      if (!deleted) {
        set.status = 404;
        return errors.notFound("User not found");
      }
      return success({ deleted: true });
    },
    {
      params: userIdParamSchema,
      detail: {
        summary: "Delete user",
        description: "Delete a user by ID",
        tags: ["Users"],
      },
    }
  );

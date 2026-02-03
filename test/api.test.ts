import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../src/app";

// Create type-safe client directly from Elysia instance (no network request)
const api = treaty(app);

describe("Health Check", () => {
  it("should return health status", async () => {
    const { data, error, status } = await api.healthz.get();

    expect(error).toBeNull();
    expect(status).toBe(200);
    expect(data).toBeDefined();
    expect(data?.success).toBe(true);
    expect(data?.data.ok).toBe(true);
    expect(data?.data.ts).toBeNumber();
  });
});

describe("API Root", () => {
  it("should return welcome message", async () => {
    const { data, error, status } = await api.get();

    expect(error).toBeNull();
    expect(status).toBe(200);
    expect(data?.success).toBe(true);
    expect(data?.data.message).toBe("Hello from Elysia API");
  });
});

describe("Users API", () => {
  describe("POST /v1/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        email: `test-${Date.now()}@example.com`,
        password: "securePassword123",
      };

      const { data, error, status } = await api.v1.users.post(newUser);

      expect(error).toBeNull();
      expect(status).toBe(201);

      if (data && "success" in data && data.success === true) {
        expect(data.data).toBeDefined();
        expect(data.data.id).toBeDefined();
        expect(data.data.email).toBe(newUser.email);
      }
    });

    it("should return 409 for duplicate email", async () => {
      const duplicateUser = {
        email: `duplicate-${Date.now()}@example.com`,
        password: "password123",
      };

      // Create first user
      await api.v1.users.post(duplicateUser);

      // Try to create duplicate
      const { error, status } = await api.v1.users.post(duplicateUser);

      expect(status).toBe(409);
      expect(error).toBeDefined();
    });
  });

  describe("GET /v1/users", () => {
    it("should list users with pagination", async () => {
      const { data, error, status } = await api.v1.users.get({
        query: { page: 1, limit: 10 },
      });

      expect(error).toBeNull();
      expect(status).toBe(200);

      if (data && "success" in data && data.success === true) {
        expect(data.data).toBeArray();
        expect(data.meta).toBeDefined();
        expect(data.meta?.page).toBe(1);
        expect(data.meta?.limit).toBe(10);
      }
    });

    it("should use default pagination when not specified", async () => {
      const { data, error, status } = await api.v1.users.get();

      expect(error).toBeNull();
      expect(status).toBe(200);

      if (data && "success" in data && data.success === true) {
        expect(data.meta?.page).toBe(1);
        expect(data.meta?.limit).toBe(20);
      }
    });
  });

  describe("GET /v1/users/:id", () => {
    it("should get user by ID", async () => {
      // First create a user
      const newUser = {
        email: `getbyid-${Date.now()}@example.com`,
        password: "password123",
      };
      const createResult = await api.v1.users.post(newUser);

      if (
        createResult.data &&
        "success" in createResult.data &&
        createResult.data.success === true
      ) {
        const userId = createResult.data.data.id;

        const { data, error, status } = await api.v1
          .users({ id: userId })
          .get();

        expect(error).toBeNull();
        expect(status).toBe(200);

        if (data && "success" in data && data.success === true) {
          expect(data.data).toBeDefined();
          expect(data.data.id).toBe(userId);
        }
      }
    });

    it("should return 404 for non-existent user", async () => {
      const { error, status } = await api.v1
        .users({ id: "00000000-0000-0000-0000-000000000000" })
        .get();

      expect(status).toBe(404);
      expect(error).toBeDefined();
    });
  });

  describe("PATCH /v1/users/:id", () => {
    it("should update user email", async () => {
      // First create a user
      const newUser = {
        email: `update-${Date.now()}@example.com`,
        password: "password123",
      };
      const createResult = await api.v1.users.post(newUser);

      if (
        createResult.data &&
        "success" in createResult.data &&
        createResult.data.success === true
      ) {
        const userId = createResult.data.data.id;
        const newEmail = `updated-${Date.now()}@example.com`;

        const { data, error, status } = await api.v1
          .users({ id: userId })
          .patch({ email: newEmail });

        expect(error).toBeNull();
        expect(status).toBe(200);

        if (data && "success" in data && data.success === true) {
          expect(data.data.email).toBe(newEmail);
        }
      }
    });
  });

  describe("DELETE /v1/users/:id", () => {
    it("should delete user", async () => {
      // First create a user
      const newUser = {
        email: `delete-${Date.now()}@example.com`,
        password: "password123",
      };
      const createResult = await api.v1.users.post(newUser);

      if (
        createResult.data &&
        "success" in createResult.data &&
        createResult.data.success === true
      ) {
        const userId = createResult.data.data.id;

        const { error, status } = await api.v1.users({ id: userId }).delete();

        expect(error).toBeNull();
        expect(status).toBe(200);
      }
    });

    it("should return 404 when deleting non-existent user", async () => {
      const { error, status } = await api.v1
        .users({ id: "00000000-0000-0000-0000-000000000000" })
        .delete();

      expect(status).toBe(404);
      expect(error).toBeDefined();
    });
  });
});

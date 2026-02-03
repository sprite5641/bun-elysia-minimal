import { userRepo } from "./user.repo";
import { CreateUserInput, UpdateUserInput, UserResponse } from "./user.schema";
import { User } from "../../db/schema/users";

// Hash password (using Bun's built-in Argon2)
async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, { algorithm: "argon2id" });
}

// Transform user to response (exclude password hash)
function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const userService = {
  async listUsers(page: number, limit: number) {
    const { users, total } = await userRepo.findAll(page, limit);
    return {
      users: users.map(toUserResponse),
      total,
    };
  },

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await userRepo.findById(id);
    return user ? toUserResponse(user) : null;
  },

  async createUser(input: CreateUserInput): Promise<UserResponse> {
    // Check if email already exists
    const existing = await userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepo.create({
      email: input.email,
      passwordHash,
    });

    return toUserResponse(user);
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<UserResponse | null> {
    // Check if user exists
    const existing = await userRepo.findById(id);
    if (!existing) {
      return null;
    }

    // If updating email, check for conflicts
    if (input.email && input.email !== existing.email) {
      const emailConflict = await userRepo.findByEmail(input.email);
      if (emailConflict) {
        throw new Error("EMAIL_EXISTS");
      }
    }

    const updateData: { email?: string; passwordHash?: string } = {};
    if (input.email) updateData.email = input.email;
    if (input.password) updateData.passwordHash = await hashPassword(input.password);

    const updated = await userRepo.update(id, updateData);
    return updated ? toUserResponse(updated) : null;
  },

  async deleteUser(id: string): Promise<boolean> {
    return userRepo.delete(id);
  },
};

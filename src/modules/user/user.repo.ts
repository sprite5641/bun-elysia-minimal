import { eq, sql } from "drizzle-orm";
import { getDb } from "../../config/db";
import { users, User, NewUser } from "../../db/schema/users";

export const userRepo = {
  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const db = getDb();
    const offset = (page - 1) * limit;

    const [userList, countResult] = await Promise.all([
      db.select().from(users).limit(limit).offset(offset).orderBy(users.createdAt),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
    ]);

    return {
      users: userList,
      total: countResult[0]?.count ?? 0,
    };
  },

  async findById(id: string): Promise<User | null> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] ?? null;
  },

  async create(data: NewUser): Promise<User> {
    const db = getDb();
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<Omit<NewUser, "id">>): Promise<User | null> {
    const db = getDb();
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return result.length > 0;
  },
};

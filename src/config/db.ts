import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";
import { env } from "../env";
import { logger } from "./logger";

let pool: Pool | null = null;
let db: NodePgDatabase | null = null;

function getPoolConfig(): PoolConfig {
  const baseConfig: PoolConfig = {
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  // Option 1: Cloud SQL unix socket (when CLOUDSQL_INSTANCE is set)
  if (env.CLOUDSQL_INSTANCE) {
    logger.info("Database: connecting via Cloud SQL unix socket", {
      instance: env.CLOUDSQL_INSTANCE,
    });
    return {
      ...baseConfig,
      host: `/cloudsql/${env.CLOUDSQL_INSTANCE}`,
    };
  }

  // Option 2: TCP connection (local proxy or direct)
  logger.info("Database: connecting via TCP", {
    host: env.DB_HOST,
    port: env.DB_PORT,
  });
  return {
    ...baseConfig,
    host: env.DB_HOST,
    port: env.DB_PORT,
  };
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool(getPoolConfig());
  }
  return pool;
}

export function getDb(): NodePgDatabase {
  if (!db) {
    db = drizzle(getPool());
  }
  return db;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}

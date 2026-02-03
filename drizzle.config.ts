import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: env.CLOUDSQL_INSTANCE
    ? {
        // Cloud SQL unix socket
        host: `/cloudsql/${env.CLOUDSQL_INSTANCE}`,
        user: env.DB_USER,
        password: env.DB_PASS,
        database: env.DB_NAME,
      }
    : {
        // Local TCP connection
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASS,
        database: env.DB_NAME,
      },
});

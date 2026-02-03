import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { env } from "../env";

export const swaggerPlugin = new Elysia({ name: "swagger-plugin" }).use(
  env.ENABLE_SWAGGER
    ? swagger({
        path: "/docs",
        documentation: {
          info: {
            title: "Bun Elysia API",
            version: "1.0.0",
            description: "API server built with Bun, Elysia, and Drizzle ORM",
          },
          tags: [
            { name: "Health", description: "Health check endpoints" },
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Users", description: "User management endpoints" },
          ],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
        },
        swaggerOptions: {
          persistAuthorization: true,
        },
      })
    : new Elysia()
);

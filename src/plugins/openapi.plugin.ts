import { Elysia } from 'elysia';
import { openapi, fromTypes } from '@elysiajs/openapi';
import { env } from '../env';

export const openapiPlugin = new Elysia({ name: 'openapi-plugin' }).use(
  env.ENABLE_SWAGGER
    ? openapi({
        path: '/openapi',
        references: fromTypes(
          process.env.NODE_ENV === 'production' ? 'dist/index.d.ts' : 'src/index.ts',
        ),
        documentation: {
          info: {
            title: 'Bun Elysia API',
            version: '1.0.0',
            description: 'API server built with Bun, Elysia, and Drizzle ORM',
          },
          tags: [
            { name: 'Health', description: 'Health check endpoints' },
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management endpoints' },
          ],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
        },
      })
    : new Elysia(),
);

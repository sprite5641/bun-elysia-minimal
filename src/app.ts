import { Elysia } from 'elysia';
import { securityPlugin } from './plugins/security.plugin';
import { corsPlugin } from './plugins/cors.plugin';
import { observabilityPlugin } from './plugins/observability.plugin';
import { rateLimitPlugin } from './plugins/rate-limit.plugin';
import { openapiPlugin } from './plugins/openapi.plugin';
import { jwtPlugin } from './plugins/jwt.plugin';
import { bearerPlugin } from './plugins/bearer.plugin';
import { serverTimingPlugin } from './plugins/server-timing.plugin';
import { compressionPlugin } from './plugins/compression.plugin';
import { errorHandlerMiddleware } from './middleware/error-handler';
import { router } from './routes/_router';

export const app = new Elysia()
  // Core plugins
  .use(securityPlugin)
  .use(corsPlugin)
  .use(compressionPlugin)
  // Observability
  .use(serverTimingPlugin)
  .use(observabilityPlugin)
  // Rate limiting
  .use(rateLimitPlugin)
  // Auth plugins
  .use(jwtPlugin)
  .use(bearerPlugin)
  // Documentation
  .use(openapiPlugin)
  // Error handling & routes
  .use(errorHandlerMiddleware)
  .use(router);

// Export App type for Eden Treaty (end-to-end type safety)
export type App = typeof app;

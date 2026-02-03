import { Elysia } from "elysia";
import { securityPlugin } from "./plugins/security.plugin";
import { corsPlugin } from "./plugins/cors.plugin";
import { observabilityPlugin } from "./plugins/observability.plugin";
import { rateLimitPlugin } from "./plugins/rate-limit.plugin";
import { swaggerPlugin } from "./plugins/swagger.plugin";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { router } from "./routes/_router";

export const app = new Elysia()
  .use(securityPlugin)
  .use(corsPlugin)
  .use(observabilityPlugin)
  .use(rateLimitPlugin)
  .use(swaggerPlugin)
  .use(errorHandlerMiddleware)
  .use(router);

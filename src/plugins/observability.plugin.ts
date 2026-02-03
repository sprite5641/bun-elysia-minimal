import { Elysia } from "elysia";
import { requestIdMiddleware } from "../middleware/request-id";
import { timingMiddleware } from "../middleware/timing";
import { logger } from "../config/logger";

export const observabilityPlugin = new Elysia({ name: "observability" })
  .use(requestIdMiddleware)
  .use(timingMiddleware)
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    logger.debug("Request started", {
      method: request.method,
      path: url.pathname,
    });
  })
  .onAfterHandle({ as: "global" }, ({ request, set, ...ctx }) => {
    const { requestId, startTime } = ctx as {
      requestId: string;
      startTime: number;
    };
    const url = new URL(request.url);
    const duration = (performance.now() - startTime).toFixed(2);
    logger.info("Request completed", {
      requestId,
      method: request.method,
      path: url.pathname,
      status: set.status ?? 200,
      duration: `${duration}ms`,
    });
  });

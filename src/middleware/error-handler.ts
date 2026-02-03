import { Elysia } from "elysia";
import { env } from "../env";
import { logger } from "../config/logger";
import { error, ErrorResponse } from "../utils/response";

export const errorHandlerMiddleware = new Elysia({ name: "error-handler" })
  .onError({ as: "global" }, ({ code, error: err, set, ...ctx }) => {
    const rid = (ctx as { requestId?: string }).requestId;
    const e = err as Error;

    let status: number;
    let message: string;
    let errorCode: string;

    switch (code) {
      case "VALIDATION":
        status = 400;
        message = e?.message || "Validation failed";
        errorCode = "VALIDATION_ERROR";
        break;
      case "NOT_FOUND":
        status = 404;
        message = "Resource not found";
        errorCode = "NOT_FOUND";
        break;
      case "PARSE":
        status = 400;
        message = "Invalid request body";
        errorCode = "PARSE_ERROR";
        break;
      default:
        status = 500;
        message = env.isProd ? "Internal server error" : (e?.message || "Unknown error");
        errorCode = "INTERNAL_ERROR";
    }

    logger.error("Request error", {
      requestId: rid,
      code: errorCode,
      status,
      error: env.isProd ? message : e?.message,
      stack: env.isProd ? undefined : e?.stack,
    });

    set.status = status;

    const response: ErrorResponse & { error: { requestId?: string } } = {
      ...error(message, errorCode),
      error: {
        ...error(message, errorCode).error,
        ...(rid && { requestId: rid }),
      },
    };

    return response;
  });

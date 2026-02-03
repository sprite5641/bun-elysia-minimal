import { Elysia } from "elysia";
import { env } from "../env";

export const securityPlugin = new Elysia({ name: "security" })
  .onRequest(({ request, set }) => {
    // Check body size limit
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > env.BODY_LIMIT_BYTES) {
      set.status = 413;
      return {
        error: {
          message: "Request body too large",
          code: "PAYLOAD_TOO_LARGE",
        },
      };
    }
  })
  .onAfterHandle({ as: "global" }, ({ set }) => {
    set.headers["x-content-type-options"] = "nosniff";
    set.headers["x-frame-options"] = "DENY";
    set.headers["referrer-policy"] = "no-referrer";
    set.headers["x-xss-protection"] = "0";
    set.headers["permissions-policy"] =
      "camera=(), microphone=(), geolocation=()";
  });

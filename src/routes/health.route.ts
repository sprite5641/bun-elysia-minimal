import { Elysia, t } from "elysia";
import { success } from "../utils/response";

export const healthRoute = new Elysia().get(
  "/healthz",
  () => success({ ok: true, ts: Date.now() }),
  {
    detail: {
      tags: ["Health"],
      summary: "Health check",
      description: "Returns server health status and timestamp",
      responses: {
        200: {
          description: "Server is healthy",
        },
      },
    },
    response: t.Object({
      success: t.Literal(true),
      data: t.Object({
        ok: t.Boolean(),
        ts: t.Number(),
      }),
    }),
  }
);

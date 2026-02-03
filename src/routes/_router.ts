import { Elysia, t } from "elysia";
import { healthRoute } from "./health.route";
import { usersRoute } from "./v1/users.route";
import { authRoute } from "./v1/auth.route";
import { success } from "../utils/response";

export const router = new Elysia()
  .get(
    "/",
    () => success({ message: "Hello from Elysia API" }),
    {
      detail: {
        summary: "API Index",
        description: "Returns a welcome message",
      },
      response: t.Object({
        success: t.Literal(true),
        data: t.Object({
          message: t.String(),
        }),
      }),
    }
  )
  .use(healthRoute)
  .group("/v1", (app) => app.use(usersRoute).use(authRoute));

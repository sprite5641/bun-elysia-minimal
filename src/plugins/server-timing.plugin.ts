import { Elysia } from "elysia";
import { serverTiming } from "@elysiajs/server-timing";
import { env } from "../env";

export const serverTimingPlugin = new Elysia({ name: "server-timing-plugin" }).use(
  serverTiming({
    // Only enable detailed timing in development
    enabled: env.isDev,
  })
);

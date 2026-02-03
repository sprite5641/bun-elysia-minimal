import { Elysia } from "elysia";
import { compression } from "elysia-compression";

export const compressionPlugin = new Elysia({ name: "compression-plugin" }).use(
  compression({
    type: "gzip",
    options: {
      level: 6, // Balance between compression and speed
    },
  })
);

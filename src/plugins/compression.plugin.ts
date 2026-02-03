import { Elysia } from 'elysia';
// TODO: elysia-compression is not compatible with Elysia 1.4.x
// import { compression } from "elysia-compression";

// export const compressionPlugin = new Elysia({ name: "compression-plugin" });
// Temporarily disabled due to compatibility issues with Elysia 1.4.x
// .use(
//   compression({
//     type: "gzip",
//     options: {
//       level: 6, // Balance between compression and speed
//     },
//   })
// );

export const compressionPlugin = new Elysia({ name: 'compression-plugin' }).mapResponse(
  ({ request, response, set }) => {
    const isJson = typeof response === 'object';
    const compressionRequested = request.headers.get('Accept-Encoding')?.includes('gzip');

    const text = isJson ? JSON.stringify(response) : (response?.toString() ?? '');

    // Only compress if content is larger than 2KB and compression is requested
    if (!compressionRequested || text.length < 2048) {
      return response as Response;
    }

    set.headers['Content-Encoding'] = 'gzip';

    return new Response(Bun.gzipSync(new TextEncoder().encode(text)), {
      headers: {
        'Content-Type': `${isJson ? 'application/json' : 'text/plain'}; charset=utf-8`,
      },
    });
  },
);

import { Elysia } from 'elysia';

export const timingMiddleware = new Elysia({ name: 'timing' })
  .derive({ as: 'global' }, () => {
    return { startTime: performance.now() };
  })
  .onAfterHandle({ as: 'global' }, ({ startTime, set }) => {
    const duration = (performance.now() - startTime).toFixed(2);
    set.headers['x-response-time'] = `${duration}ms`;
  });

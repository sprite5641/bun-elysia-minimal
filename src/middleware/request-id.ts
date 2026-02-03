import { Elysia } from 'elysia';

export const requestIdMiddleware = new Elysia({ name: 'request-id' })
  .derive({ as: 'global' }, ({ request }) => {
    const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
    return { requestId };
  })
  .onAfterHandle({ as: 'global' }, ({ requestId, set }) => {
    set.headers['x-request-id'] = requestId;
  });

import { Elysia } from 'elysia';
import { env } from '../env';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 60000);

export const rateLimitPlugin = new Elysia({ name: 'rate-limit' }).onRequest(({ request, set }) => {
  const ip = getClientIp(request);
  const url = new URL(request.url);
  const key = `${ip}:${url.pathname}`;
  const now = Date.now();

  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS,
    };
    store.set(key, entry);
  } else {
    entry.count++;
  }

  const remaining = Math.max(0, env.RATE_LIMIT_MAX - entry.count);
  set.headers['x-ratelimit-limit'] = String(env.RATE_LIMIT_MAX);
  set.headers['x-ratelimit-remaining'] = String(remaining);
  set.headers['x-ratelimit-reset'] = String(Math.ceil(entry.resetAt / 1000));

  if (entry.count > env.RATE_LIMIT_MAX) {
    set.status = 429;
    return {
      error: {
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
      },
    };
  }
});

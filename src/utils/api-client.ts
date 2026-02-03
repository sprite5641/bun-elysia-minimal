import { treaty } from '@elysiajs/eden';
import type { App } from '../app';

/**
 * Create a type-safe API client using Eden Treaty
 *
 * For unit testing (no network request):
 * @example
 * import { app } from "../app";
 * const api = createApiClient(app);
 *
 * For production client (network request):
 * @example
 * const api = createApiClient("http://localhost:3000");
 */
export function createApiClient(urlOrInstance: string | App) {
  return treaty<App>(urlOrInstance as string);
}

/**
 * Type-safe API client type for external usage
 */
export type ApiClient = ReturnType<typeof createApiClient>;

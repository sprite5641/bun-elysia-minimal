import { Elysia } from 'elysia';
import { bearer } from '@elysiajs/bearer';

export const bearerPlugin = new Elysia({ name: 'bearer-plugin' }).use(bearer());

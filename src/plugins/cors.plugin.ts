import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { env } from '../env';

export const corsPlugin = new Elysia({ name: 'cors-plugin' }).use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['content-type', 'authorization', 'x-request-id'],
    credentials: false,
  }),
);

import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '../env';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number;
  exp?: number;
}

export const jwtPlugin = new Elysia({ name: 'jwt-plugin' }).use(
  jwt({
    name: 'jwt',
    secret: env.JWT_SECRET,
    exp: env.JWT_EXPIRES_IN,
  }),
);

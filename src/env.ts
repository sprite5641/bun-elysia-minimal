function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function optionalInt(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid integer for ${key}: ${value}`);
  }
  return parsed;
}

function optionalBool(key: string, defaultValue: boolean): boolean {
  const value = process.env[key]?.toLowerCase();
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

const NODE_ENV = optionalEnv('NODE_ENV', 'production');
const isDev = NODE_ENV === 'development';

export const env = {
  // Server
  PORT: optionalInt('PORT', 8080),
  NODE_ENV,
  isDev,
  isProd: NODE_ENV === 'production',

  // Logging
  LOG_LEVEL: optionalEnv('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',

  // CORS
  CORS_ORIGIN: optionalEnv('CORS_ORIGIN', isDev ? '*' : ''),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: optionalInt('RATE_LIMIT_WINDOW_MS', 60000),
  RATE_LIMIT_MAX: optionalInt('RATE_LIMIT_MAX', 120),

  // Security
  BODY_LIMIT_BYTES: optionalInt('BODY_LIMIT_BYTES', 1048576),

  // Swagger
  ENABLE_SWAGGER: optionalBool('ENABLE_SWAGGER', false),

  // Database
  // Option 1: Cloud SQL unix socket (Cloud Run)
  CLOUDSQL_INSTANCE: process.env.CLOUDSQL_INSTANCE || undefined,
  // Option 2: TCP connection (local proxy or direct)
  DB_HOST: optionalEnv('DB_HOST', 'localhost'),
  DB_PORT: optionalInt('DB_PORT', 5432),
  // Common
  DB_USER: requireEnv('DB_USER'),
  DB_PASS: requireEnv('DB_PASS'),
  DB_NAME: requireEnv('DB_NAME'),
  DB_POOL_MAX: optionalInt('DB_POOL_MAX', 5),

  // Redis
  REDIS_HOST: requireEnv('REDIS_HOST'),
  REDIS_PORT: optionalInt('REDIS_PORT', 6379),
  REDIS_PASS: process.env.REDIS_PASS || undefined,

  // JWT
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),
} as const;

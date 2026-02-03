# Bun Elysia Drizzle

A production-ready API starter template built with **Bun**, **Elysia**, and **Drizzle ORM**, designed for deployment on Google Cloud Run.

## Overview

- **Bun + Elysia** — Fast, type-safe API framework with end-to-end TypeScript support
- **Drizzle ORM** — TypeScript-first SQL ORM with type-safe queries
- **Designed for Google Cloud Run** — Stateless, containerized, auto-scaling
- **Cloud SQL (Postgres)** — Connected via Unix socket for secure, low-latency database access
- **Redis** — Session/cache layer for stateless scaling
- **End-to-end Type Safety** — Eden Treaty client for typed API consumption

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| [Bun](https://bun.sh) | JavaScript/TypeScript runtime & package manager |
| [Elysia](https://elysiajs.com) | Type-safe web framework for Bun |
| [Drizzle ORM](https://orm.drizzle.team) | TypeScript-first SQL ORM |
| [PostgreSQL](https://www.postgresql.org) | Primary database |
| [Redis](https://redis.io) | Caching & session storage |

## Plugins

This project uses official and community Elysia plugins:

| Plugin | Description |
| ------ | ----------- |
| `@elysiajs/cors` | Cross-Origin Resource Sharing |
| `@elysiajs/openapi` | OpenAPI/Swagger documentation at `/openapi` |
| `@elysiajs/jwt` | JWT authentication (sign/verify tokens) |
| `@elysiajs/bearer` | Bearer token extraction from headers |
| `@elysiajs/server-timing` | Performance monitoring via Server-Timing API |
| `@elysiajs/eden` | End-to-end type-safe API client |
| `elysia-compression` | Gzip response compression |

### Custom Plugins

| Plugin | Description |
| ------ | ----------- |
| `security.plugin` | Security headers (X-Content-Type-Options, X-Frame-Options, etc.) |
| `rate-limit.plugin` | In-memory rate limiting per IP/path |
| `observability.plugin` | Request logging, timing, and request ID tracking |

## Architecture

```
Cloud Run (Bun + Elysia + Drizzle)
   ├─ Cloud SQL (Postgres) via Unix socket
   └─ Redis via VPC Connector
```

## Prerequisites

Before getting started, ensure you have:

- **Bun** >= 1.1 ([install guide](https://bun.sh/docs/installation))
- **Docker** for local development and building images
- **Google Cloud CLI** (`gcloud`) authenticated and configured
- **Cloud SQL Postgres instance** with a database created
- **VM with Redis** running in Docker (private IP)
- **Serverless VPC Access Connector** for Cloud Run to reach Redis

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/bun-elysia-cloudrun-starter.git
cd bun-elysia-cloudrun-starter
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment

```bash
cp .env.example .env
```

### 4. Configure environment variables

Edit `.env` with your Cloud SQL and Redis connection details (see table below).

### 5. Run database migrations

```bash
bun run db:migrate
```

### 6. Start the development server

```bash
bun run dev
```

The API is now running:

- **API Base URL:** [http://localhost:8080](http://localhost:8080)
- **Health Check:** [http://localhost:8080/healthz](http://localhost:8080/healthz)
- **OpenAPI Docs:** [http://localhost:8080/openapi](http://localhost:8080/openapi) (when `ENABLE_SWAGGER=true`)

## Environment Variables

| Name                | Description                        | Required | Example                            |
| ------------------- | ---------------------------------- | -------- | ---------------------------------- |
| `PORT`              | Server port (Cloud Run uses 8080)  | No       | `8080`                             |
| `NODE_ENV`          | Environment mode                   | No       | `development` / `production`       |
| `LOG_LEVEL`         | Logging level                      | No       | `debug` / `info` / `warn` / `error`|
| `CORS_ORIGIN`       | Allowed CORS origins               | No       | `*` or `https://example.com`       |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms         | No       | `60000`                            |
| `RATE_LIMIT_MAX`    | Max requests per window            | No       | `120`                              |
| `BODY_LIMIT_BYTES`  | Max request body size              | No       | `1048576`                          |
| `ENABLE_SWAGGER`    | Enable OpenAPI/Swagger UI          | No       | `true` / `false`                   |
| `CLOUDSQL_INSTANCE` | Cloud SQL connection name          | No       | `myproj:asia-southeast1:pg-main`   |
| `DB_HOST`           | Database host (for TCP connection) | No       | `localhost`                        |
| `DB_PORT`           | Database port                      | No       | `5432`                             |
| `DB_USER`           | Postgres username                  | **Yes**  | `api_user`                         |
| `DB_PASS`           | Postgres password                  | **Yes**  | `******`                           |
| `DB_NAME`           | Database name                      | **Yes**  | `app_db`                           |
| `DB_POOL_MAX`       | Max connections per instance       | No       | `5`                                |
| `REDIS_HOST`        | Redis host                         | **Yes**  | `localhost` or `10.10.0.5`         |
| `REDIS_PORT`        | Redis port                         | No       | `6379`                             |
| `REDIS_PASS`        | Redis password                     | No       | `******`                           |
| `JWT_SECRET`        | Secret key for JWT signing         | **Yes**  | `your-super-secret-key`            |
| `JWT_EXPIRES_IN`    | JWT token expiration               | No       | `7d`                               |

## Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `bun run start`      | Start the production server              |
| `bun run dev`        | Start dev server with hot reload         |
| `bun test`           | Run tests with Bun's built-in runner     |
| `bun test --watch`   | Run tests in watch mode                  |
| `bun run db:generate`| Generate Drizzle migrations              |
| `bun run db:migrate` | Apply database migrations                |
| `bun run db:push`    | Push schema directly (dev only)          |
| `bun run openapi:gen`| Generate OpenAPI spec from routes        |
| `bun run lint`       | Run ESLint                               |
| `bun run lint:fix`   | Run ESLint with auto-fix                 |
| `bun run format`     | Format code with Prettier                |
| `bun run format:check`| Check code formatting                   |

## Deploy to Cloud Run

### Build and push the Docker image

```bash
# Build the image
docker build -t gcr.io/PROJECT_ID/bun-elysia-api .

# Push to Google Container Registry
docker push gcr.io/PROJECT_ID/bun-elysia-api
```

### Deploy to Cloud Run

```bash
gcloud run deploy bun-elysia-api \
  --image gcr.io/PROJECT_ID/bun-elysia-api \
  --region asia-southeast1 \
  --platform managed \
  --add-cloudsql-instances=PROJECT_ID:asia-southeast1:INSTANCE_NAME \
  --vpc-connector=your-vpc-connector \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --set-secrets="DB_PASS=db-password:latest,REDIS_PASS=redis-password:latest"
```

> **Tip:** Use Secret Manager for sensitive values like `DB_PASS` and `REDIS_PASS`.

## Development Tips

- **Hot Reload** — Use `bun run dev` for automatic restart on file changes
- **Connection Pooling** — Keep `DB_POOL_MAX` low (3–5) since Cloud Run scales horizontally
- **Migrations** — Run migrations in CI/CD or as a Cloud Run Job, not during container startup
- **OpenAPI Docs** — Set `ENABLE_SWAGGER=true` in development to explore the API at `/openapi`
- **Type Safety** — Leverage Elysia's TypeBox schemas for request/response validation
- **Eden Treaty** — Use the exported `App` type for end-to-end type-safe API clients

## Project Structure

```
src/
├── index.ts           # Application entry point
├── app.ts             # Elysia app configuration & plugin composition
├── env.ts             # Environment variable validation
├── config/            # Database, Redis, Logger configuration
│   ├── db.ts          # Drizzle + PostgreSQL connection
│   ├── redis.ts       # Redis client setup
│   └── logger.ts      # Structured logging
├── db/
│   ├── migrations/    # Drizzle migration files
│   └── schema/        # Table definitions (users, sessions)
├── middleware/        # Request processing
│   ├── error-handler.ts
│   ├── request-id.ts
│   └── timing.ts
├── modules/           # Feature modules
│   ├── auth/          # Authentication (login, register, JWT)
│   └── user/          # User management (CRUD operations)
├── plugins/           # Elysia plugins
│   ├── bearer.plugin.ts
│   ├── compression.plugin.ts
│   ├── cors.plugin.ts
│   ├── jwt.plugin.ts
│   ├── observability.plugin.ts
│   ├── openapi.plugin.ts
│   ├── rate-limit.plugin.ts
│   ├── security.plugin.ts
│   └── server-timing.plugin.ts
├── routes/            # API route handlers
│   ├── _router.ts     # Main router composition
│   ├── health.route.ts
│   └── v1/            # Versioned API routes
│       ├── auth.route.ts
│       └── users.route.ts
└── utils/             # Shared utilities
    ├── api-client.ts  # Eden Treaty client
    ├── errors.ts      # Custom error classes
    └── response.ts    # Response helpers
test/
└── api.test.ts        # API integration tests
```

## API Routes

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET`  | `/` | API welcome message |
| `GET`  | `/healthz` | Health check endpoint |
| `POST` | `/v1/auth/register` | User registration |
| `POST` | `/v1/auth/login` | User login |
| `GET`  | `/v1/users` | List users (authenticated) |
| `GET`  | `/v1/users/:id` | Get user by ID (authenticated) |

## Testing

Run tests using Bun's built-in test runner:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

Tests use Elysia's `.handle()` method for integration testing without starting the server.

## License

MIT

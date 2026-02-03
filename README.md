# Bun Elysia Cloud Run Starter

A production-ready API starter template built with Bun and Elysia, designed for deployment on Google Cloud Run.

## Overview

- **Bun + Elysia** — Fast, type-safe API framework with end-to-end TypeScript support
- **Designed for Google Cloud Run** — Stateless, containerized, auto-scaling
- **Cloud SQL (Postgres)** — Connected via Unix socket for secure, low-latency database access
- **Redis on VM** — Session/cache layer running in Docker, accessed via VPC Connector
- **Stateless API** — All persistent state lives in Postgres and Redis

## Architecture

```
Cloud Run (Bun + Elysia)
   ├─ Cloud SQL (Postgres) via Unix socket
   └─ Redis (Docker on VM) via VPC Connector
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
- **Swagger UI:** [http://localhost:8080/docs](http://localhost:8080/docs) (when `ENABLE_SWAGGER=true`)

## Environment Variables

| Name                | Description                        | Example                            |
| ------------------- | ---------------------------------- | ---------------------------------- |
| `PORT`              | Server port (Cloud Run uses 8080)  | `8080`                             |
| `NODE_ENV`          | Environment mode                   | `development` / `production`       |
| `CLOUDSQL_INSTANCE` | Cloud SQL connection name          | `myproj:asia-southeast1:pg-main`   |
| `DB_USER`           | Postgres username                  | `api_user`                         |
| `DB_PASS`           | Postgres password                  | `******`                           |
| `DB_NAME`           | Database name                      | `app_db`                           |
| `DB_POOL_MAX`       | Max connections per instance       | `5`                                |
| `REDIS_HOST`        | Redis VM private IP                | `10.10.0.5`                        |
| `REDIS_PORT`        | Redis port                         | `6379`                             |
| `REDIS_PASS`        | Redis password (optional)          | `******`                           |
| `ENABLE_SWAGGER`    | Enable Swagger UI                  | `true` / `false`                   |

## Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `bun run start`      | Start the production server              |
| `bun run dev`        | Start dev server with hot reload         |
| `bun run db:generate`| Generate Drizzle migrations              |
| `bun run db:migrate` | Apply database migrations                |
| `bun run db:push`    | Push schema directly (dev only)          |
| `bun run openapi:gen`| Generate OpenAPI spec from routes        |

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
- **Swagger UI** — Set `ENABLE_SWAGGER=true` in development to explore the API at `/docs`
- **Type Safety** — Leverage Elysia's TypeBox schemas for request/response validation

## Project Structure

```
src/
├── index.ts           # Application entry point
├── app.ts             # Elysia app configuration
├── env.ts             # Environment variable validation
├── config/            # Database, Redis, Logger setup
├── db/
│   ├── migrations/    # Drizzle migrations
│   └── schema/        # Table definitions
├── middleware/        # Request ID, timing, error handling
├── modules/           # Feature modules (auth, user)
├── plugins/           # Elysia plugins (cors, swagger, etc.)
├── routes/            # API route handlers
└── utils/             # Shared utilities
```

## License

MIT

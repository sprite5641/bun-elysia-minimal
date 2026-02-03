# Copilot Instructions

## Project Overview

This is a TypeScript backend project using the **Bun + Elysia + Drizzle** stack:
- **Bun** - JavaScript/TypeScript runtime and package manager
- **Elysia** - Type-safe web framework built for Bun
- **Drizzle ORM** - TypeScript-first SQL ORM with type-safe queries

## Developer Workflow

### Commands
```bash
bun install          # Install dependencies
bun run dev          # Start development server with hot reload
bun run build        # Build for production
bun test             # Run tests with Bun's built-in test runner
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Apply database migrations
bun run db:studio    # Open Drizzle Studio for database inspection
```

## Code Conventions

### Elysia Routes
- Define routes using Elysia's fluent API with type-safe request/response schemas
- Use `t` (TypeBox) for request validation: `t.Object({ name: t.String() })`
- Group related routes using `.group()` or separate route files with `.use()`

### Drizzle Schema
- Place schema definitions in `src/db/schema/`
- Use `drizzle-kit` for migrations stored in `drizzle/` directory
- Export typed table references for use in queries

### Project Structure
```
src/
├── index.ts        # Application entry point
├── routes/         # Elysia route handlers
├── db/
│   ├── index.ts    # Database connection
│   └── schema/     # Drizzle table definitions
├── services/       # Business logic layer
└── utils/          # Shared utilities
drizzle/            # Database migrations
```

## Key Patterns

- **Type Safety**: Leverage Elysia's end-to-end type inference - avoid manual type annotations where possible
- **Validation**: Use Elysia's built-in validation with TypeBox schemas in route definitions
- **Database Queries**: Use Drizzle's type-safe query builder; prefer `db.select()` over raw SQL
- **Error Handling**: Use Elysia's `error()` helper for consistent HTTP error responses

## Testing
- Use Bun's native test runner (`bun test`)
- Test files use `.test.ts` suffix
- Use Elysia's `.handle()` method for integration testing routes

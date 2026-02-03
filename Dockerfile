# ============================================
# Stage 1: Base image
# ============================================
FROM oven/bun:1 AS base
WORKDIR /app

# ============================================
# Stage 2: Install ALL dependencies (dev + prod)
# ============================================
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# ============================================
# Stage 3: Install production dependencies only
# ============================================
FROM base AS prod-deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# ============================================
# Stage 4: Build the application
# ============================================
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run TypeScript build if you have one
RUN bun run build || true

# Generate Drizzle migrations if needed
# RUN bun run db:generate

# ============================================
# Stage 5: Production release (Cloud Run optimized)
# ============================================
FROM base AS release

# Copy production dependencies only
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/package.json ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/drizzle.config.ts ./

# Set environment
ENV NODE_ENV=production

# Cloud Run sets PORT automatically, don't hardcode it
# ENV PORT=8080

# Expose port (Cloud Run uses PORT env var)
EXPOSE 8080

# Run as non-root user
USER bun

# Cloud Run has its own health checks, remove Docker HEALTHCHECK
# as it's not used by Cloud Run and adds overhead

# Start the application
CMD ["bun", "run", "src/index.ts"]

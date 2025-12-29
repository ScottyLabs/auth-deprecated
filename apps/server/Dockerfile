# Base image with Bun
FROM oven/bun:latest AS base
WORKDIR /app

# Build stage
FROM base AS builder
WORKDIR /app

# Copy everything
COPY . .

# Install deps from bun.lock
RUN bun install --frozen-lockfile

# Add verification here
RUN echo "==== CHECK swagger-ui-bundle.js (after build) ====" && \
    ls -lh apps/server/node_modules/swagger-ui-dist/swagger-ui-bundle.js && \
    wc -c apps/server/node_modules/swagger-ui-dist/swagger-ui-bundle.js && \
    cat apps/server/node_modules/swagger-ui-dist/swagger-ui-bundle.js

# Generate OpenAPI spec
RUN cd apps/server && bun run tsoa && bun run openapi

# Build the project
RUN bun run build --filter=@graph/server...

# Final runtime image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 server
USER server

# Copy swagger UI
COPY --from=builder --chown=server:nodejs /app/apps/server/build/swagger.yaml ./build/swagger.yaml

# Copy only what's needed to run the server
COPY --from=builder --chown=server:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=server:nodejs /app/apps/server/node_modules/swagger-ui-dist /app/node_modules/swagger-ui-dist

# Verify again after copy
RUN echo "==== VERIFY swagger-ui-bundle.js (in final image) ====" && \
    ls -lh /app/node_modules/swagger-ui-dist/swagger-ui-bundle.js && \
    wc -c /app/node_modules/swagger-ui-dist/swagger-ui-bundle.js && \
    cat /app/node_modules/swagger-ui-dist/swagger-ui-bundle.js

EXPOSE 3000
CMD ["bun", "apps/server/dist/server.js"]
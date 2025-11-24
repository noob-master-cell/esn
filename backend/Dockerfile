# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Generate client for build (needed for type checking/compilation)
RUN npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy package files
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm

# --- FIX START ---
# 1. Copy ALL dependencies (dev + prod) so we have the Prisma CLI available
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

# 2. Copy source files needed for generation
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

# 3. Generate the Prisma Client strictly for the production environment
# (This ensures it exists and is built for the correct OS/Architecture)
RUN npx prisma generate

# 4. Remove development dependencies to keep the image small
RUN pnpm prune --prod
# --- FIX END ---

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

# Copy start script
COPY --chown=nestjs:nodejs start.sh ./
RUN chmod +x start.sh

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["./start.sh"]
# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
# Cache bust - increment this to force dependency layer rebuild
ARG CACHE_BUST=1
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Generate client for build (needed for type checking/compilation)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy package files
COPY package.json pnpm-lock.yaml ./

# 1. Install pnpm
# 2. Install Prisma v6.10.1 globally.
#    This ensures 'npx prisma' finds this specific version at runtime (start.sh)
#    instead of downloading the broken v7.0.0.
RUN npm install -g pnpm prisma@6.10.1

# Install ONLY production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source files needed for generation and runtime
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist


# Generate the Prisma Client explicitly in the production environment
# using the globally installed v6 CLI.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" prisma generate

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
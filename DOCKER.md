# ESN Application - Docker Guide

## Overview

This guide explains how to run the ESN application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

### Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd esn

# Copy environment files
cp .env.docker .env
# Edit .env with your Auth0 credentials

# Build and start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:4000
# - GraphQL Playground: http://localhost:4000/graphql
# - PostgreSQL: localhost:5433
# - Redis: localhost:6380
```

### Production Environment

```bash
# Build images
./scripts/docker-build.sh prod

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check health
./scripts/health-check.sh

# The application will be available at:
# - Frontend: http://localhost (port 80)
# - Backend API: http://localhost:4000
```

## Docker Architecture

### Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| **backend** | Node 20 Alpine | 4000 | NestJS API Server |
| **frontend** | Nginx Alpine | 80 | React SPA |
| **postgres** | PostgreSQL 15 | 5432 | Database |
| **redis** | Redis 7 | 6379 | Caching |

### Network

All services communicate via the `esn-network` bridge network.

### Volumes

- `postgres_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence
- `./backend/uploads`: File uploads (mounted)

## Commands

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Build with no cache
docker-compose build --no-cache

# Using the build script
./scripts/docker-build.sh prod v1.0.0
```

### Starting Services

```bash
# Start all services (detached)
docker-compose up -d

# Start specific service
docker-compose up backend

# Development mode with hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### Viewing Logs

```bash
# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Executing Commands

```bash
# Run Prisma migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d esn_db

# Access Redis CLI
docker-compose exec redis redis-cli

# Access backend shell
docker-compose exec backend sh
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run db:seed

# Reset database
docker-compose exec backend npm run db:reset

# Open Prisma Studio
docker-compose exec backend npx prisma studio

# Backup database
docker-compose exec postgres pg_dump -U postgres esn_db > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U postgres esn_db
```

## Multi-Stage Builds

Both backend and frontend use multi-stage builds for optimization:

### Backend Dockerfile Stages

1. **dependencies**: Install all dependencies
2. **build**: Compile TypeScript to JavaScript
3. **production**: Runtime with only production dependencies

### Frontend Dockerfile Stages

1. **build**: Build React app with Vite
2. **production**: Serve with Nginx

## Environment Variables

### Backend (.env)

```bash
# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-audience

# Database (auto-configured in Docker)
DATABASE_URL=postgresql://postgres:password@postgres:5432/esn_db

# Redis (auto-configured in Docker)
REDIS_URL=redis://redis:6379

# Application
NODE_ENV=production
PORT=4000
```

### Frontend (.env.production)

```bash
VITE_API_URL=http://localhost:4000
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

## Development Workflow

### Hot Reload

Development mode includes hot-reload for both services:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

- Backend: Watches `./backend` directory
- Frontend: Watches `./frontend` directory

### Debugging

The backend exposes port 9229 in development for debugging:

```bash
# In docker-compose.dev.yml
ports:
  - "9229:9229"  # Debug port
```

Attach your IDE debugger to `localhost:9229`.

## Production Optimizations

### Image Size

- Multi-stage builds minimize final image size
- Alpine Linux base images
- Only production dependencies included

### Security

- Non-root user execution
- Read-only file systems where possible
- Minimal attack surface

### Performance

- Layer caching optimization
- Health checks for all services
- Resource limits in production mode

### Monitoring

Health checks are configured for all services:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
  interval: 30s
  timeout: 3s
  retries: 5
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check service status
docker-compose ps

# Restart services
docker-compose restart
```

### Database Connection Issues

```bash
# Ensure postgres is healthy
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify connection from backend
docker-compose exec backend npx prisma db pull
```

### Port Conflicts

If ports are already in use:

```bash
# Development ports (modify docker-compose.dev.yml)
postgres: 5433:5432
redis: 6380:6379
backend: 4001:4000
frontend: 5174:5173

# Or stop conflicting services
lsof -ti:4000 | xargs kill -9
```

### Clear Everything and Start Fresh

```bash
# Stop all containers
docker-compose down -v

# Remove all images
docker rmi $(docker images -q esn-*)

# Rebuild and start
docker-compose build --no-cache
docker-compose up -d
```

### Out of Disk Space

```bash
# Remove dangling images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything Docker
docker system prune -a --volumes
```

## Best Practices

1. **Always use docker-compose files** - Don't run containers manually
2. **Keep .env files secure** - Never commit to Git
3. **Use specific image versions** - Avoid `latest` in production
4. **Monitor resource usage** - `docker stats`
5. **Regular backups** - Backup PostgreSQL data
6. **Update dependencies** - Keep images up to date
7. **Use volumes for data** - Never store data in containers

## Next Steps

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- See [README.md](./README.md) for application documentation

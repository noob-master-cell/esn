# 🐳 Docker & CI/CD Pipeline - Quick Reference

## What's Included

### Docker Files
- ✅ **Backend Dockerfile** - Multi-stage Node.js build
- ✅ **Frontend Dockerfile** - Vite build + Nginx server
- ✅ **docker-compose.yml** - Full stack orchestration
- ✅ **docker-compose.dev.yml** - Development overrides with hot-reload
- ✅ **docker-compose.prod.yml** - Production optimizations
- ✅ **nginx.conf** - Production-ready Nginx configuration

### CI/CD Workflows
- ✅ **ci.yml** - Automated testing, linting, and building
- ✅ **docker-build.yml** - Build and push Docker images
- ✅ **deploy-staging.yml** - Auto-deploy to staging
- ✅ **deploy-production.yml** - Manual production deployment

### Helper Scripts
- ✅ **docker-build.sh** - Build all Docker images
- ✅ **deploy.sh** - Deploy to any environment
- ✅ **health-check.sh** - Verify all services are healthy

### Documentation
- ✅ **DOCKER.md** - Complete Docker usage guide
- ✅ **DEPLOYMENT.md** - Deployment instructions for all platforms

---

## Quick Start Commands

### Development (Hot Reload)

```bash
# Copy environment file
cp .env.docker .env
# Edit .env with your Auth0 credentials

# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:4000
# - GraphQL: http://localhost:4000/graphql
```

### Production

```bash
# Build images
./scripts/docker-build.sh prod

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check health
./scripts/health-check.sh

# Access:
# - Frontend: http://localhost (port 80)
# - Backend: http://localhost:4000
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Nginx)        │
│         Port: 80 (prod) / 5173 (dev)   │
└─────────────────┬───────────────────────┘
                  │
                  │ /graphql, /api, /uploads
                  ▼
┌─────────────────────────────────────────┐
│       Backend (NestJS + GraphQL)        │
│              Port: 4000                 │
└────┬─────────────────────────┬──────────┘
     │                         │
     │                         │
     ▼                         ▼
┌─────────────┐         ┌─────────────┐
│ PostgreSQL  │         │    Redis    │
│  Port: 5432 │         │  Port: 6379 │
└─────────────┘         └─────────────┘
```

---

## 🔧 Useful Commands

### View Logs
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend      # Backend only
docker-compose logs -f frontend     # Frontend only
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run db:seed

# Backup database
docker-compose exec postgres pg_dump -U postgres esn_db > backup.sql
```

### Container Management
```bash
# Stop all services
docker-compose down

# Restart specific service
docker-compose restart backend

# View resource usage
docker stats

# Execute command in container
docker-compose exec backend sh
```

---

## 📝 Environment Variables

### Required for Backend (.env)
```bash
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-audience
DATABASE_URL=postgresql://...  # Auto-configured in Docker
```

### Required for Frontend (.env.production)
```bash
VITE_API_URL=http://localhost:4000
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

---

## 🏥 Health Checks

All services include health checks:

```bash
# Check all services
./scripts/health-check.sh

# Or manually
curl http://localhost:4000/health   # Backend
curl http://localhost/health         # Frontend
```

---

## 🔍 Troubleshooting

### Services won't start
```bash
docker-compose down -v              # Stop and remove volumes
docker-compose build --no-cache     # Rebuild without cache
docker-compose up                   # Start and view logs
```

### Port conflicts
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or change ports in docker-compose.dev.yml
```

### Database issues
```bash
# Reset database (CAUTION: Deletes all data!)
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npx prisma migrate deploy
```

---

## 📚 Full Documentation

- **[DOCKER.md](./DOCKER.md)** - Complete Docker guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[security_analysis.md](./security_analysis.md)** - Security recommendations
- **[scalability_analysis.md](./scalability_analysis.md)** - Performance insights

---

## ✅ CI/CD Pipeline Features

- ✅ Automated testing on every push
- ✅ Lint checks for code quality
- ✅ Docker image building and pushing
- ✅ Automated staging deployments
- ✅ Manual production deployments with approval
- ✅ Health checks after deployment
- ✅ Automatic rollback on failure
- ✅ Slack notifications (optional)

---

## 🎯 Next Steps

1. **Configure Auth0**
   - Create application in Auth0 dashboard
   - Update `.env` with credentials

2. **Test Locally**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

3. **Deploy to Staging**
   ```bash
   git push origin develop
   # Auto-deploys via GitHub Actions
   ```

4. **Deploy to Production**
   - Create a release on GitHub
   - Approve deployment workflow
   - Or use: `./scripts/deploy.sh production`

---

## 🤝 Contributing

See workflow files in `.github/workflows/` for CI/CD pipeline details.

---

## 📧 Support

For issues:
1. Check logs: `docker-compose logs`
2. Review [DOCKER.md](./DOCKER.md) troubleshooting section
3. Check health: `./scripts/health-check.sh`

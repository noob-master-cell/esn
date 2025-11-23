# ESN Application - Deployment Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Deployment](#local-deployment)
- [Server Deployment](#server-deployment)
- [Cloud Deployment](#cloud-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required

- Docker 20.10+ and Docker Compose 2.0+
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if not using Docker)
- Auth0 account with configured application

### Optional

- Redis 7+ (for caching)
- Domain name with SSL certificate
- Server with minimum 2GB RAM, 20GB storage

## Local Deployment

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd esn

# 2. Configure environment
cp .env.docker .env
# Edit .env with your Auth0 credentials

# 3. Start with Docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Without Docker

```bash
# Backend
cd backend
npm install
npx prisma migrate deploy
npm run start:dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Server Deployment

### VPS/Dedicated Server Setup

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Create deployment directory
sudo mkdir -p /opt/esn
sudo chown $USER:$USER /opt/esn
```

#### 2. Clone and Configure

```bash
cd /opt/esn
git clone <repository-url> .

# Configure environment
cp .env.docker .env
nano .env  # Add your credentials
```

#### 3. Deploy

```bash
# Build and start
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Check health
./scripts/health-check.sh
```

#### 4. Setup Nginx Reverse Proxy (Optional)

```nginx
# /etc/nginx/sites-available/esn
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /graphql {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/esn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Cloud Deployment

### AWS Deployment

#### Option 1: EC2 + Docker

1. **Launch EC2 instance** (t3.medium or larger)
2. **Configure security groups**: Allow ports 22, 80, 443
3. **Follow VPS setup above**

#### Option 2: ECS with Fargate

See `.github/workflows/deploy-production.yml` for automated deployment.

**Required AWS Resources:**
- ECS Cluster
- Task Definitions for backend/frontend
- Application Load Balancer
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- ECR repositories for Docker images

### Railway.app (Recommended for MVP)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

**Environment Variables in Railway:**
- Set all variables from `.env.docker`
- Railway provides `DATABASE_URL` automatically

### Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Note**: Deploy backend separately (Railway, Render, etc.)

### Render.com

Create `render.yaml`:

```yaml
services:
  - type: web
    name: esn-backend
    env: docker
    dockerfilePath: ./backend/Dockerfile
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: esn-db
          property: connectionString
  
  - type: web
    name: esn-frontend
    env: docker
    dockerfilePath: ./frontend/Dockerfile

databases:
  - name: esn-db
    databaseName: esn_db
    user: postgres
```

## CI/CD Pipeline

### GitHub Actions Setup

#### Required Secrets

Add these to GitHub repository settings → Secrets:

```
AUTH0_DOMAIN
AUTH0_AUDIENCE
AUTH0_CLIENT_ID
STAGING_SSH_KEY (for staging deployment)
STAGING_HOST
STAGING_USER
PRODUCTION_SSH_KEY (for production)
PRODUCTION_HOST
PRODUCTION_USER
SLACK_WEBHOOK (optional, for notifications)
```

#### Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on every push and PR
   - Linting, testing, building
   
2. **Docker Build** (`.github/workflows/docker-build.yml`)
   - Builds and pushes images to GitHub Container Registry
   - Runs on main branch commits
   
3. **Staging Deployment** (`.github/workflows/deploy-staging.yml`)
   - Auto-deploys to staging on `develop` branch
   
4. **Production Deployment** (`.github/workflows/deploy-production.yml`)
   - Manual approval required
   - Includes automatic rollback on failure

### Manual Deployment

```bash
# Build locally
./scripts/docker-build.sh prod v1.0.0

# Deploy to server
./scripts/deploy.sh production v1.0.0
```

## Environment Configuration

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong database password
- [ ] Configure Auth0 production tenant
- [ ] Set up SSL certificates
- [ ] Configure CORS with production domain
- [ ] Set up error tracking (Sentry)
- [ ] Configure log aggregation
- [ ] Set up database backups
- [ ] Enable Redis persistence

### Environment Variables Reference

#### Backend Required

```bash
AUTH0_DOMAIN=           # Auth0 tenant domain
AUTH0_AUDIENCE=         # API identifier
DATABASE_URL=           # PostgreSQL connection string
NODE_ENV=               # development/production
PORT=                   # API port (default: 4000)
```

#### Backend Optional

```bash
REDIS_URL=              # Redis connection string
SENTRY_DSN=             # Error tracking
LOG_LEVEL=              # debug/info/warn/error
```

#### Frontend Required

```bash
VITE_API_URL=           # Backend URL
VITE_AUTH0_DOMAIN=      # Auth0 domain
VITE_AUTH0_CLIENT_ID=   # Auth0 client ID
VITE_AUTH0_AUDIENCE=    # Auth0 audience
```

## Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:4000/health

# Frontend
curl http://localhost/health

# All services
./scripts/health-check.sh
```

### Docker Stats

```bash
# Real-time resource usage
docker stats

# Specific service
docker stats esn_backend
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# With timestamp
docker-compose logs -f --timestamps backend
```

### Recommended Monitoring Tools

- **APM**: New Relic, DataDog, or Elastic APM
- **Error Tracking**: Sentry
- **Log Management**: Papertrail, Loggly, or ELK Stack
- **Uptime Monitoring**: UptimeRobot, Pingdom

## Database Management

### Backups

```bash
# Manual backup
docker-compose exec postgres pg_dump -U postgres esn_db > backup_$(date +%Y%m%d).sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U postgres esn_db

# Automated backups (cron)
0 2 * * * cd /opt/esn && docker-compose exec -T postgres pg_dump -U postgres esn_db | gzip > /backups/esn_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

### Migrations

```bash
# Run pending migrations
docker-compose exec backend npx prisma migrate deploy

# Create new migration
docker-compose exec backend npx prisma migrate dev --name description

# Reset database (development only!)
docker-compose exec backend npx prisma migrate reset
```

## Scaling

### Horizontal Scaling (Multiple Instances)

Update `docker-compose.prod.yml`:

```yaml
backend:
  deploy:
    replicas: 3  # Run 3 backend instances
```

Add load balancer (nginx, HAProxy, or cloud load balancer).

### Database Scaling

- Use managed database (RDS, Cloud SQL)
- Configure read replicas
- Enable connection pooling (PgBouncer)

### Redis Scaling

- Use managed Redis (ElastiCache, Redis Cloud)
- Configure Redis Cluster for sharding

## Troubleshooting

### Application Won't Start

```bash
# Check all container status
docker-compose ps

# View logs
docker-compose logs

# Restart specific service
docker-compose restart backend
```

### Database Connection Errors

```bash
# Verify database is running
docker-compose exec postgres pg_isready

# Check connection from backend
docker-compose exec backend npx prisma db pull

# Reset database connection
docker-compose restart backend postgres
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check database performance
docker-compose exec postgres psql -U postgres -d esn_db -c "SELECT * FROM pg_stat_activity;"

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

### SSL Certificate Issues

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW, Security Groups)
- [ ] Set up fail2ban for SSH brute force protection
- [ ] Regular security updates
- [ ] Database backups encrypted and off-site
- [ ] Regular security audits
- [ ] Monitor logs for suspicious activity

## Rollback Procedure

```bash
# List available versions
git tag

# Rollback to previous version
git checkout v1.0.0
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Restore database backup if needed
cat backup_previous.sql | docker-compose exec -T postgres psql -U postgres esn_db
```

## Support

For issues and questions:
- Check logs: `docker-compose logs`
- Review [DOCKER.md](./DOCKER.md) for Docker-specific help
- Check GitHub Issues
- Contact: your-email@domain.com

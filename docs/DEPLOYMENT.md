# Deployment Guide

## Prerequisites
- Docker Engine (>=20.10) and Docker Compose installed on the target host.
- Access to a PostgreSQL instance (can be the Docker‑provided one).
- Redis instance reachable by the backend.
- Auth0 tenant configured with the appropriate callback URLs.

## Production Docker Compose
Create a `docker-compose.prod.yml` (already present) with the following services:
```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: esn_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  backend:
    build: ./backend
    env_file: .env
    environment:
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    ports:
      - "4000:4000"
    restart: unless-stopped

  frontend:
    build: ./frontend
    env_file: .env
    environment:
      NODE_ENV: production
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  pgdata:
```
Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
The frontend will be served on port 80 (http) and the backend on port 4000.

## Environment Configuration
- Copy `.env.example` to `.env` and fill in production values.
- Ensure `REDIS_URL` points to the Redis service (`redis://redis:6379`).
- Set `DATABASE_URL` to the PostgreSQL service (`postgresql://postgres:password@postgres:5432/esn_db`).
- Provide Auth0 credentials (`AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `AUTH0_CLIENT_ID`).

## SSL / HTTPS
- Use a reverse proxy (e.g., Nginx or Traefik) in front of the containers to terminate TLS.
- Example Nginx config snippet:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    location / {
        proxy_pass http://frontend:80;
    }

    location /graphql {
        proxy_pass http://backend:4000;
    }
}
```

## Database Migrations
After containers are up, run Prisma migrations inside the backend container:
```bash
docker exec -it <backend_container_name> npx prisma migrate deploy
```
This will apply any pending migrations.

## Monitoring & Logging
- Logs are output to `stdout`/`stderr` and can be accessed via `docker logs`.
- For production, consider integrating with a log aggregator (e.g., Loki, Papertrail).
- Health endpoint: `GET /health` returns `OK` when the service is healthy.

## Scaling
- Increase replica count in Docker Compose or migrate to an orchestrator like Kubernetes.
- Ensure Redis and PostgreSQL are scaled appropriately (use managed services for high availability).

## Rollback
1. Stop the new containers: `docker-compose -f docker-compose.prod.yml down`.
2. Re‑deploy the previous image tag.
3. Restore the database from the latest backup if needed.

---
*All instructions avoid any references to payments or notification features.*

#!/bin/bash

# ESN Application - Deployment Script
# Usage: ./scripts/deploy.sh [environment] [version]
# Environment: staging, production
# Version: git tag or 'latest' (default: latest)

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "❌ Invalid environment. Use 'staging' or 'production'"
  exit 1
fi

echo "🚀 Deploying ESN Application"
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"
echo ""

# Confirmation for production
if [ "$ENVIRONMENT" = "production" ]; then
  read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " -r
  if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Deployment cancelled"
    exit 0
  fi
fi

# Pull latest code
echo "📥 Pulling latest code..."
git fetch --all
if [ "$VERSION" != "latest" ]; then
  git checkout "$VERSION"
fi

# Stop running containers
echo "🛑 Stopping running containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Pull latest images
echo "📥 Pulling Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Health check
echo "🏥 Running health checks..."
./scripts/health-check.sh

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Services status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

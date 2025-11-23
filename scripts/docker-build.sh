#!/bin/bash

# ESN Application - Docker Build Script
# Usage: ./scripts/docker-build.sh [environment]
# Environment: dev, prod (default: dev)

set -e

ENVIRONMENT=${1:-dev}
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
VERSION=${2:-latest}

echo "🐳 Building Docker images for ESN Application"
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"
echo "Git Commit: $GIT_COMMIT"
echo "Build Date: $BUILD_DATE"
echo ""

# Build backend
echo "📦 Building backend..."
docker build \
  --build-arg BUILD_DATE="$BUILD_DATE" \
  --build-arg GIT_COMMIT="$GIT_COMMIT" \
  --build-arg VERSION="$VERSION" \
  --target production \
  -t esn-backend:$VERSION \
  -t esn-backend:latest \
  ./backend

# Build frontend
echo "📦 Building frontend..."
docker build \
  --build-arg BUILD_DATE="$BUILD_DATE" \
  --build-arg GIT_COMMIT="$GIT_COMMIT" \
  --build-arg VERSION="$VERSION" \
  --target production \
  -t esn-frontend:$VERSION \
  -t esn-frontend:latest \
  ./frontend

echo ""
echo "✅ Build complete!"
echo ""
echo "Images created:"
docker images | grep esn-

echo ""
echo "To run the application:"
if [ "$ENVIRONMENT" = "dev" ]; then
  echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up"
else
  echo "  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
fi

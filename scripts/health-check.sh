#!/bin/bash

# ESN Application - Health Check Script
# Checks if all services are running and healthy

set -e

BACKEND_URL=${BACKEND_URL:-http://localhost:4000}
FRONTEND_URL=${FRONTEND_URL:-http://localhost}
MAX_RETRIES=10
RETRY_DELAY=3

echo "🏥 Running health checks..."
echo ""

# Function to check service health
check_service() {
  local name=$1
  local url=$2
  local retries=0

  echo -n "Checking $name... "
  
  while [ $retries -lt $MAX_RETRIES ]; do
    if curl -sf "$url" > /dev/null 2>&1; then
      echo "✅ Healthy"
      return 0
    fi
    
    retries=$((retries + 1))
    if [ $retries -lt $MAX_RETRIES ]; then
      sleep $RETRY_DELAY
    fi
  done
  
  echo "❌ Failed"
  return 1
}

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
  echo "✅ Healthy"
else
  echo "❌ Failed"
  exit 1
fi

# Check Redis
echo -n "Checking Redis... "
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
  echo "✅ Healthy"
else
  echo "❌ Failed"
  exit 1
fi

# Check Backend
if ! check_service "Backend API" "$BACKEND_URL/health"; then
  echo ""
  echo "Backend logs:"
  docker-compose logs --tail=50 backend
  exit 1
fi

# Check Frontend
if ! check_service "Frontend" "$FRONTEND_URL/health"; then
  echo ""
  echo "Frontend logs:"
  docker-compose logs --tail=50 frontend
  exit 1
fi

echo ""
echo "✅ All services are healthy!"
exit 0

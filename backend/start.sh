#!/bin/sh
set -e

echo "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set!"
else
  echo "DATABASE_URL is set (length: ${#DATABASE_URL})"
fi

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting application..."
node dist/main

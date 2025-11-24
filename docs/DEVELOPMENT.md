# Development Guide

## Prerequisites
- **Node.js** (>=18) and **npm** (or **pnpm**) installed.
- **Docker** & **Docker‑Compose** for PostgreSQL and Redis.
- **Auth0** account with an application configured for JWT authentication.

## Environment Variables (`.env`)
```dotenv
# Backend
DATABASE_URL=postgresql://postgres:password@localhost:5432/esn_db
REDIS_URL=redis://localhost:6379
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-api-audience
AUTH0_CLIENT_ID=your-client-id
NODE_ENV=development

# Frontend (Vite)
VITE_API_URL=http://localhost:4000/graphql
```
Place this file at the project root (do not commit it).

## Local Development Setup
```bash
# 1. Start supporting services
docker-compose up -d   # brings up PostgreSQL and Redis

# 2. Backend
cd backend
npm install           # or pnpm install
npm run start:dev     # NestJS server on http://localhost:4000/graphql

# 3. Frontend
cd ../frontend
npm install           # or pnpm install
npm run dev           # Vite dev server on http://localhost:5173
```
The frontend proxies GraphQL requests to the backend automatically.

## Testing
- **Backend**: `npm run test` (Jest) – runs unit and integration tests.
- **Frontend**: `npm run test` (React Testing Library) – runs component tests.

## Linting & Formatting
```bash
npm run lint          # ESLint
npm run format        # Prettier
```
The project is configured with strict TypeScript settings; CI will fail on type errors.

## Debugging
- Backend: set `DEBUG=*` env var for verbose logs.
- Frontend: use Chrome DevTools and React DevTools.

## Hot‑Reload
Both NestJS and Vite support hot‑reload out of the box. Changes to `.env` require a restart of the affected service.

## CI/CD
GitHub Actions run the following on each push:
1. Install dependencies
2. Run lint, format, and type checks
3. Execute unit tests
4. Build Docker images (for production workflow)

---
*All steps avoid any references to payments or notification features.*

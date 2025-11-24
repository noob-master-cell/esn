# ESN Event Management Platform – Comprehensive Documentation (Payments & Notifications Excluded)

## 1. Overview
The ESN Event Management Platform is a web application that enables ESN (Erasmus Student Network) chapters to create, publish, and manage events. It provides user registration, admin management, and integrates with Auth0 for authentication.

## 2. Core Features
- **Event Management**: Create, edit, publish, and delete events.
- **User Management**: Register, login, view profile, and update personal information.
- **Registration System**: Users can register for events, view their registrations, and cancel if needed.
- **Admin Dashboard**: Overview of events, registrations, and user statistics.
- **Authentication**: Secure login via Auth0 (JWT based).
- **Responsive UI**: Built with React and vanilla CSS for a modern, accessible experience.

## 3. Architecture
- **Frontend**: React (Vite) + TypeScript + Apollo Client for GraphQL.
- **Backend**: NestJS (Node.js) + GraphQL (Apollo) + Prisma ORM.
- **Database**: PostgreSQL.
- **Caching & Rate Limiting**: Redis (used by NestJS Throttler and CacheModule).
- **Deployment**: Docker‑compose for local development; can be deployed to any container‑orchestrated environment.

## 4. Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React, Vite, TypeScript | 18.x, 5.x, 5.x |
| Backend | NestJS, GraphQL, Prisma | 10.x, 15.x, 6.x |
| Database | PostgreSQL | 15.x |
| Auth | Auth0 (JWT) | – |
| Cache / Throttling | Redis | – |
| CI/CD | GitHub Actions | – |

## 5. Setup & Installation
### Prerequisites
- Node.js (>=18)
- Docker & Docker‑Compose
- PostgreSQL client (optional for DB inspection)

### Environment Variables (`.env`)
```
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
### Running Locally
```bash
# Start Docker services (Postgres + Redis)
docker-compose up -d

# Backend
cd backend
npm install
npm run start:dev   # runs NestJS server on port 4000

# Frontend
cd ../frontend
npm install
npm run dev         # runs Vite dev server on port 5173
```
Visit `http://localhost:5173` to view the app.

## 6. API Reference (GraphQL)
### Queries
- `events(filter: EventsFilterInput)`: List public events.
- `event(id: ID!)`: Retrieve a single event.
- `myEvents`: Events created by the authenticated user.
- `myRegistrations`: Registrations of the current user.
- `users`: List all users (admin only).
- `user(id: ID!)`: Retrieve a single user (admin only).

### Mutations
- `createEvent(createEventInput: CreateEventInput!)`: Create a new event.
- `updateEvent(updateEventInput: UpdateEventInput!)`: Update an existing event.
- `publishEvent(id: ID!)`: Publish an event.
- `removeEvent(id: ID!)`: Delete an event.
- `registerForEvent(createRegistrationInput: CreateRegistrationInput!)`: Register for an event.
- `updateRegistration(updateRegistrationInput: UpdateRegistrationInput!)`: Update registration status (e.g., cancel).
- `updateUserRole(userId: ID!, role: UserRole!)`: Change a user's role (admin only).

> **Note**: All mutations require a valid Auth0 JWT in the `Authorization` header.

## 7. Database Schema Overview (Prisma)
### Models
- **User**: Stores Auth0 user ID, profile information, and role.
- **Event**: Contains event details (title, description, dates, location, capacity, etc.).
- **Registration**: Links a user to an event, tracks status (`PENDING`, `CONFIRMED`, `CANCELLED`, `ATTENDED`).
- **Review**: User‑generated reviews for events.

### Relationships
- `User` 1‑* `Registration`
- `Event` 1‑* `Registration`
- `Event` 1‑* `Review`
- `User` 1‑* `Review`

### Indexes (Performance)
- Compound index on `Registration(eventId, status)` for fast look‑ups of registrations per event.
- Unique index on `User(email)`.
- Unique index on `Event(id)` (primary key).

## 8. Development Guide
### Project Structure
```
backend/
  src/
    app.module.ts
    events/
    registrations/
    users/
    auth/
    prisma/
frontend/
  src/
    components/
    pages/
    hooks/
    graphql/
    lib/apollo.ts
```
### Coding Standards
- Use TypeScript strict mode.
- Follow ESLint + Prettier configuration provided.
- Write unit tests with Jest (backend) and React Testing Library (frontend).
- Commit messages follow Conventional Commits.

### Testing
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd ../frontend
npm run test
```
### Debugging
- Backend: `npm run start:dev` with `DEBUG=*` env var for verbose logs.
- Frontend: Chrome DevTools + React DevTools.

## 9. Maintenance Guide
### Daily
- Verify health of API (`/health` endpoint).
- Check Redis connectivity.
### Weekly
- Run security audit (`npm audit`).
- Update dependencies (`npm update`).
- Review logs for errors.
### Monthly
- Perform database vacuum & analyze.
- Review index usage and add new indexes if needed.
- Backup PostgreSQL database.

## 10. Contributing Guide
- Fork the repository and create a feature branch.
- Follow the coding standards and write tests.
- Open a Pull Request with the `docs:` prefix if documentation is updated.
- Ensure CI passes before merging.

## 11. Security & Performance Summary
- **Security**: Auth0 JWT validation, Helmet headers, rate limiting via Redis, GraphQL introspection disabled in production.
- **Performance**: Redis caching for event queries, indexed registration look‑ups, GraphQL query complexity limits can be added if needed.

## 12. Navigation for New Developers
1. **Read `README.md`** – high‑level overview.
2. **Follow `DEVELOPMENT.md`** – set up local environment.
3. **Explore `API.md`** – understand GraphQL operations.
4. **Review `DATABASE.md`** – data model details.
5. **Run the app** – `npm run dev` (frontend) and `npm run start:dev` (backend).
6. **Make a small change** – update a UI component or add a query, then submit a PR.

## 13. Quick Reference Cheat Sheet
| Need | File |
|------|------|
| Project overview | `README.md` |
| Setup instructions | `docs/DEVELOPMENT.md` |
| API reference | `docs/API.md` |
| Database schema | `docs/DATABASE.md` |
| Contributing | `CONTRIBUTING.md` |
| Deployment | `DEPLOYMENT.md` |
| Docker usage | `DOCKER.md` |
| Maintenance tasks | `docs/MAINTENANCE.md` |

---
*All documentation is up‑to‑date with the current codebase and excludes any references to payments or notification features.*

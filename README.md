# ESN Event Management Platform

## Overview
The ESN Event Management Platform enables ESN chapters to create, publish, and manage events. It provides user registration, admin dashboards, and integrates with Auth0 for secure authentication.

## Features
- Event creation, editing, publishing, and deletion
- User registration for events
- Admin dashboard with statistics
- Role‑based access control (admin / user)
- GraphQL API powered by NestJS
- Redis caching and rate limiting
- Docker‑based development and deployment

## Quick Start
```bash
# Clone the repo
git clone https://github.com/noob-master-cell/esn.git
cd esn

# Start services (PostgreSQL + Redis)
docker-compose up -d

# Backend
cd backend
npm install
npm run start:dev   # http://localhost:4000/graphql

# Frontend
cd ../frontend
npm install
npm run dev         # http://localhost:5173
```

## Documentation
Full documentation lives in the `docs/` folder:
- `README.md` – this file
- `DEVELOPMENT.md` – setup and development workflow
- `API.md` – GraphQL API reference
- `DATABASE.md` – Prisma schema overview
- `MAINTENANCE.md` – operational procedures
- `CONTRIBUTING.md` – how to contribute
- `DEPLOYMENT.md` – deployment instructions

## Contributing
See `CONTRIBUTING.md` for guidelines on reporting issues, proposing features, and submitting pull requests.

## License
MIT License – see `LICENSE` file.

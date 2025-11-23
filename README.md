# ESN Event Management Platform - Complete Documentation

<p align="center">
  <img src="./frontend/src/assets/logo.svg" alt="ESN Logo" width="200"/>
</p>

<p align="center">
  <strong>A comprehensive event management platform for ESN (Erasmus Student Network) organizations</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The ESN Event Management Platform is a full-stack web application designed to streamline event organization and registration for ESN (Erasmus Student Network) chapters. It provides a comprehensive solution for event organizers to create, manage, and promote events while offering students an intuitive interface to discover and register for activities.

### Key Capabilities

- **Event Management**: Create, update, and publish events with detailed information
- **Registration System**: Handle event registrations with capacity management and waitlists
- **User Management**: Role-based access control (User, Organizer, Admin)
- **Payment Integration**: Stripe integration for paid events
- **Real-time Updates**: GraphQL subscriptions for live data
- **ESN Card Verification**: Validate ESN membership cards
- **Admin Dashboard**: Comprehensive analytics and management tools

---

## Features

### 🎫 Event Management

- **Event Creation & Publishing**
  - Rich event details (title, description, location, dates)
  - Multiple event categories (Social, Cultural, Educational, Sports, Travel, etc.)
  - Event types (Free, Paid, Members-only)
  - Image uploads and media management
  - Draft/Published status workflow

- **Registration Management**
  - Capacity limits and automatic waitlisting
  - Registration status tracking (Pending, Confirmed, Cancelled, Attended)
  - Special requests and dietary requirements
  - Emergency contact information

- **Event Types**
  - Single-day and multi-day events
  - Recurring events support
  - Registration deadlines
  - Member pricing vs. regular pricing

### 👥 User Management

- **Authentication**
  - Auth0 integration for secure authentication
  - Social login support (Google, Facebook, etc.)
  - Email verification
  - Password reset functionality

- **User Roles**
  - **USER**: Standard event participants
  - **ORGANIZER**: Can create and manage events
  - **ADMIN**: Full platform access and user management

- **User Profiles**
  - Personal information management
  - ESN card details and verification
  - University and chapter affiliation
  - Social media links (Telegram, Instagram)
  - Notification preferences

### 📊 Admin Features

- **Dashboard Analytics**
  - Total users, events, and registrations
  - Active events tracking
  - Revenue statistics
  - User growth metrics

- **User Management**
  - View all users
  - Update user roles
  - Verify ESN cards
  - Delete users

- **Event Oversight**
  - View all events (published and drafts)
  - Edit any event
  - Delete events
  - Manage registrations

### 💳 Payments

- **Stripe Integration**
  - Secure payment processing
  - Multiple payment methods
  - Automatic receipt generation
  - Refund management
  - Payment status tracking

### 🔔 Notifications

- **Email notifications** (planned)
- **Push notifications** (planned)
- **SMS reminders** (planned)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.0 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 7.0.0 | Build tool |
| **Apollo Client** | 3.13.8 | GraphQL client |
| **TailwindCSS** | 4.1.11 | Styling |
| **Auth0 React** | 2.3.0 | Authentication |
| **React Router** | 7.6.2 | Routing |
| **FullCalendar** | 6.1.18 | Calendar views |
| **Framer Motion** | 12.19.2 | Animations |
| **Zustand** | 5.0.6 | State management |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **NestJS** | 11.0.1 | Framework |
| **TypeScript** | 5.7.3 | Type safety |
| **GraphQL** | 16.11.0 | API layer |
| **Apollo Server** | 5.2.0 | GraphQL server |
| **Prisma** | 6.10.1 | ORM |
| **PostgreSQL** | 15 | Database |
| **Redis** | 7 | Caching |
| **Auth0** | - | Authentication |
| **Stripe** | 18.2.1 | Payments |
| **JWT** | 9.0.2 | Token management |

### DevOps

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **GitHub Actions** | CI/CD pipeline |
| **Nginx** | Reverse proxy (production) |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  - React Router                                          │
│  - Apollo Client (GraphQL)                               │
│  - Auth0 SDK                                             │
│  - Component Library                                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/GraphQL
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Backend (NestJS)                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │           GraphQL API Layer                      │   │
│  │  - Resolvers  - Guards  - Interceptors          │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │          Business Logic Layer                    │   │
│  │  - Services  - DTOs  - Validation                │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │          Data Access Layer (Prisma)              │   │
│  │  - Models  - Migrations  - Queries               │   │
│  └──────────────────┬───────────────────────────────┘   │
└────────────────────┬┴──────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼─────┐ ┌───▼──────┐
│  PostgreSQL  │ │ Redis  │ │  Stripe  │
│   Database   │ │ Cache  │ │    API   │
└──────────────┘ └────────┘ └──────────┘
```

### Backend Module Structure

```
backend/
├── auth/                 # Authentication & authorization
│   ├── guards/          # Auth0Guard, RolesGuard
│   ├── decorators/      # @CurrentUser, @Roles
│   └── strategies/      # JWT strategy
├── users/               # User management
│   ├── users.service.ts
│   ├── users.resolver.ts
│   └── entities/
├── events/              # Event management
│   ├── events.service.ts
│   ├── events.resolver.ts
│   └── dto/
├── registrations/       # Registration system
│   ├── registrations.service.ts
│   ├── registrations.resolver.ts
│   └── dto/
├── admin/               # Admin operations
│   ├── admin.service.ts
│   └── admin.resolver.ts
└── common/              # Shared utilities
    ├── upload.controller.ts
    └── health.controller.ts
```

### Frontend Component Structure

```
frontend/src/
├── components/          # Reusable components
│   ├── common/         # Buttons, inputs, cards
│   ├── events/         # Event-specific components
│   ├── users/          # User-specific components  
│   └── layout/         # Header, footer, sidebar
├── pages/              # Route pages
│   ├── HomePage.tsx
│   ├── EventsPage.tsx
│   ├── ProfilePage.tsx
│   └── admin/
├── graphql/            # GraphQL operations
│   ├── queries.ts
│   ├── mutations.ts
│   └── admin.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useEvents.ts
│   └── useRegistration.ts
└── routes.tsx          # Route definitions
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Auth0 account
- PostgreSQL 15+ (or use Docker)

### Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd esn

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your credentials

# 4. Start database
docker-compose up postgres redis -d

# 5. Run database migrations
cd backend
npx prisma migrate deploy
npx prisma generate

# 6. Seed database (optional)
npm run db:seed

# 7. Start backend
npm run start:dev

# 8. Start frontend (new terminal)
cd frontend
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

### Docker Setup

```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Project Structure

```
esn/
├── backend/                     # NestJS backend
│   ├── prisma/                 # Database schema & migrations
│   │   ├── schema.prisma       # Prisma schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Database seeding
│   ├── src/
│   │   ├── admin/              # Admin module
│   │   ├── auth/               # Authentication module
│   │   ├── events/             # Events module
│   │   ├── registrations/      # Registrations module
│   │   ├── users/              # Users module
│   │   ├── common/             # Shared utilities
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Application entry
│   ├── uploads/                # File uploads
│   ├── Dockerfile              # Production Dockerfile
│   └── package.json
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── graphql/            # GraphQL operations
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities
│   │   ├── styles/             # Global styles
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Application entry
│   ├── public/                 # Static assets
│   ├── Dockerfile              # Production Dockerfile
│   ├── nginx.conf              # Nginx configuration
│   └── package.json
│
├── .github/
│   └── workflows/              # CI/CD workflows
│       ├── ci.yml              # Continuous integration
│       ├── docker-build.yml    # Docker image builds
│       ├── deploy-staging.yml  # Staging deployment
│       └── deploy-production.yml # Production deployment
│
├── scripts/                     # Utility scripts
│   ├── docker-build.sh         # Build Docker images
│   ├── deploy.sh               # Deployment script
│   └── health-check.sh         # Health verification
│
├── docs/                        # Documentation
│   ├── API.md                  # API documentation
│   ├── DATABASE.md             # Database schema
│   ├── DEVELOPMENT.md          # Development guide
│   └── MAINTENANCE.md          # Maintenance guide
│
├── docker-compose.yml           # Base Docker Compose
├── docker-compose.dev.yml       # Development overrides
├── docker-compose.prod.yml      # Production overrides
├── DOCKER.md                    # Docker guide
├── DEPLOYMENT.md                # Deployment guide
└── README.md                    # This file
```

---

## Documentation

Comprehensive documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| **[API.md](./docs/API.md)** | Complete GraphQL API reference |
| **[DATABASE.md](./docs/DATABASE.md)** | Database schema and relationships |
| **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** | Development guidelines and best practices |
| **[MAINTENANCE.md](./docs/MAINTENANCE.md)** | Maintenance procedures and troubleshooting |
| **[DOCKER.md](./DOCKER.md)** | Docker usage guide |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Deployment instructions |
| **[security_analysis.md](./security_analysis.md)** | Security audit and recommendations |
| **[scalability_analysis.md](./scalability_analysis.md)** | Performance and scaling insights |

---

## Development

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

### Testing

```bash
# Backend tests
cd backend
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage

# Frontend tests
cd frontend
npm run test
```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### GraphQL Schema

The GraphQL schema is auto-generated by NestJS. Access the playground at:
http://localhost:4000/graphql

---

## Deployment

### Platform Options

1. **Railway.app** (Recommended for MVP)
   - Cost: $5-20/month
   - Capacity: 1,000-5,000 users
   - Setup time: 5 minutes

2. **VPS (DigitalOcean, AWS EC2)**
   - Cost: $12-50/month
   - Capacity: 2,000-10,000 users
   - Setup time: 30 minutes

3. **AWS ECS** (Enterprise)
   - Cost: $50-200/month
   - Capacity: 50,000+ users
   - Setup time: 2-3 hours

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md).

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Support

For support and questions:

- **Documentation**: Check the `docs/` directory
- **Issues**: Create a GitHub issue
- **Email**: support@esn-platform.com

---

## Acknowledgments

- **NestJS** - Framework
- **React** - UI library
- **Prisma** - ORM
- **Auth0** - Authentication
- **Stripe** - Payments
- **ESN** - Erasmus Student Network

---

**Built with ❤️ for ESN communities worldwide**

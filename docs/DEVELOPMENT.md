# Development Guide

## Welcome to ESN Platform Development!

This guide will help you get started with developing the ESN Event Management Platform, whether you're a new team member or a contributing developer.

---

## Table of Contents

[[TOC will be auto-generated]]

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 20+ | Runtime environment |
| **npm/pnpm** | Latest | Package management |
| **Docker** | 20.10+ | Database/containers |
| **Git** | 2.30+ | Version control |
| **VS Code** | Latest | Recommended IDE |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "graphql.vscode-graphql",
    "bradlc.vscode-tailwindcss",
    "streetsidesoftware.code-spell-checker",
    "eamodio.gitlens"
  ]
}
```

### Auth0 Setup

1. Create Auth0 account at https://auth0.com
2. Create new application (Single Page Application)
3. Configure allowed URLs:
   - Callback: `http://localhost:5173/callback`
   - Logout: `http://localhost:5173`
   - Web Origins: `http://localhost:5173`
4. Create API with identifier (audience)
5. Save credentials for `.env` files

---

## Development Setup

### Step-by-Step Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd esn

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

#4. Start database
cd ..
docker-compose up postgres redis -d

# 5. Configure environment variables
cd backend
cp .env.example .env
# Edit .env with your Auth0 credentials

cd ../frontend
cp .env.example .env
# Edit .env with your Auth0 credentials

# 6. Run database migrations
cd ../backend
npx prisma migrate deploy
npx prisma generate

# 7. (Optional) Seed database with sample data
npm run db:seed

# 8. Start backend (terminal 1)
npm run start:dev

# 9. Start frontend (terminal 2)
cd ../frontend
npm run dev
```

### Verify Setup

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql
- Database: localhost:5432

---

## Project Structure

### Backend Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data script
│
├── src/
│   ├── admin/             # Admin functionality
│   │   ├── admin.service.ts
│   │   ├── admin.resolver.ts
│   │   └── dto/
│   │
│   ├── auth/              # Authentication
│   │   ├── guards/
│   │   │   ├── auth0.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── auth.service.ts
│   │
│   ├── events/            # Event management
│   │   ├── events.service.ts
│   │   ├── events.resolver.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── registrations/     # Registration system
│   │   ├── registrations.service.ts
│   │   ├── registrations.resolver.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── users/             # User management
│   │   ├── users.service.ts
│   │   ├── users.resolver.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── common/            # Shared utilities
│   │   ├── upload.controller.ts
│   │   ├── health.controller.ts
│   │   └── transformers/
│   │
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
│
├── test/                  # E2E tests
├── uploads/               # File uploads
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   │
│   │   ├── events/       # Event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventList.tsx
│   │   │   └── EventForm.tsx
│   │   │
│   │   ├── users/        # User components
│   │   │   ├── UserTable.tsx
│   │   │   └── ProfileForm.tsx
│   │   │
│   │   └── layout/       # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── pages/            # Route pages
│   │   ├── HomePage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── UsersManagement.tsx
│   │       └── EventsManagement.tsx
│   │
│   ├── graphql/          # GraphQL operations
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── admin.ts
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   └── useRegistration.ts
│   │
│   ├── lib/              # Utilities
│   │   └── apollo-client.ts
│   │
│   ├── styles/           # Global styles
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── routes.tsx        # Route definitions
│
└── package.json
```

---

## Development Workflow

### Git Workflow

We follow **Git Flow**:

```
main          ──●────●────●──────  (Production releases)
               ╱      ╲
develop   ────●────────●────●───  (Development branch)
             ╱          ╲
feature/x  ──●            ●──────  (Feature branches)
```

#### Creating a Feature

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/add-event-filters

# 3. Make changes and commit
git add .
git commit -m "feat: add event category filters"

# 4. Push to remote
git push origin feature/add-event-filters

# 5. Create Pull Request on GitHub
# Target: develop branch
# Add description and reviewers
```

### Commit Messages

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:
```bash
feat(events): add event filtering by category
fix(auth): resolve token refresh issue
docs(api): update GraphQL schema documentation
refactor(users): extract user transformation logic
test(events): add unit tests for event service
```

---

## Coding Standards

### TypeScript

#### Naming Conventions

```typescript
// Classes & Interfaces - PascalCase
class EventService {}
interface CreateEventInput {}

// Functions & Variables - camelCase
const getUserById = (id: string) => {};
let eventCount = 0;

// Constants - UPPER_SNAKE_CASE
const MAX_PARTICIPANTS = 100;
const API_BASE_URL = 'http://api.example.com';

// Private members - prefix with _
class Example {
  private _internalState: string;
}
```

#### Type Safety

```typescript
// ✅ Good - Explicit types
function createEvent(input: CreateEventInput): Promise<Event> {
  // ...
}

// ❌ Bad - Implicit any
function createEvent(input) {
  // ...
}

// ✅ Good - Use interfaces
interface User {
  id: string;
  email: string;
}

// ❌ Bad - Inline types everywhere
function getUser(): { id: string; email: string } {
  // ...
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <button onClick={() => onRegister(event.id)}>Register</button>
    </div>
  );
};

// ❌ Bad - No types
export const EventCard = ({ event, onRegister }) => {
  // ...
};
```

### GraphQL

```typescript
// ✅ Good - Proper decorators and validation
@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  @Length(1, 200)
  title: string;
  
  @Field(() => EventCategory)
  category: EventCategory;
}

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @Field(() => Int)
  @Min(1)
  @Max(10000)
  maxParticipants: number;
}
```

### Prisma

```typescript
// ✅ Good - Include only what you need
const events = await prisma.event.findMany({
  select: {
    id: true,
    title: true,
    startDate: true,
    organizer: {
      select: {
        firstName: true,
        lastName: true
      }
    }
  }
});

// ❌ Bad - Loading everything
const events = await prisma.event.findMany({
  include: {
    organizer: true,
    registrations: true,
    payments: true,
    reviews: true
  }
});
```

---

## Testing

### Backend Testing

#### Unit Tests

```typescript
// events.service.spec.ts
import { Test } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventsService, PrismaService],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create an event', async () => {
    const input = {
      title: 'Test Event',
      // ... other fields
    };
    
    const result = await service.create(input, 'userId');
    
    expect(result).toBeDefined();
    expect(result.title).toBe(input.title);
  });
});
```

#### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Testing

```typescript
// EventCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from './EventCard';

describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    // ... other fields
  };
  
  const mockOnRegister = jest.fn();

  it('renders event title', () => {
    render(<EventCard event={mockEvent} onRegister={mockOnRegister} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('calls onRegister when button clicked', () => {
    render(<EventCard event={mockEvent} onRegister={mockOnRegister} />);
    fireEvent.click(screen.getByText('Register'));
    expect(mockOnRegister).toHaveBeenCalledWith('1');
  });
});
```

---

## Debugging

### Backend Debugging

#### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend",
      "restart": true,
      "protocol": "inspector",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Console Logging

```typescript
// Use consistent logging
console.log('🔍 Debug:', variable);
console.log('✅ Success:', message);
console.log('⚠️  Warning:', warning);
console.log('❌ Error:', error);
```

### Frontend Debugging

#### React DevTools

Install: https://chrome.google.com/webstore/detail/react-developer-tools

#### Apollo Client DevTools

Install: https://chrome.google.com/webstore/detail/apollo-client-devtools

#### Console Debugging

```typescript
// Debug GraphQL queries
const { data, loading, error } = useQuery(GET_EVENTS);

console.log('Query result:', { data, loading, error });
```

---

## Common Tasks

### Adding a New GraphQL Query

1. **Define the query in resolver**:

```typescript
// backend/src/events/events.resolver.ts
@Query(() => [Event])
@UseGuards(Auth0Guard)
async myQuery(@Args('filter') filter: FilterInput) {
  return this.eventsService.findWithFilter(filter);
}
```

2. **Implement in service**:

```typescript
// backend/src/events/events.service.ts
async findWithFilter(filter: FilterInput) {
  return this.prisma.event.findMany({
    where: filter
  });
}
```

3. **Use in frontend**:

```typescript
// frontend/src/graphql/queries.ts
export const MY_QUERY = gql`
  query MyQuery($filter: FilterInput!) {
    myQuery(filter: $filter) {
      id
      title
    }
  }
`;

// In component
const { data } = useQuery(MY_QUERY, {
  variables: { filter }
});
```

---

### Adding a Database Field

1. **Update Prisma schema**:

```prisma
model Event {
  // ... existing fields
  newField String?
}
```

2. **Create migration**:

```bash
npx prisma migrate dev --name add_event_new_field
```

3. **Update GraphQL types**:

```typescript
@ObjectType()
export class Event {
  // ... existing fields
  
  @Field({ nullable: true })
  newField?: string;
}
```

4. **Update DTOs**:

```typescript
@InputType()
export class CreateEventInput {
  // ... existing fields
  
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  newField?: string;
}
```

---

### Creating a New Component

```typescript
// frontend/src/components/events/EventFilter.tsx
import React from 'react';

interface EventFilterProps {
  onFilterChange: (category: string) => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({ onFilterChange }) => {
  return (
    <div className="event-filter">
      {/* Filter UI */}
    </div>
  );
};
```

---

## Troubleshooting

### Common Issues

#### Database Connection Error

**Problem**: `Error: Can't connect to database`

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check connection string in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/esn_db"
```

---

#### Prisma Client Not Generated

**Problem**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
cd backend
npx prisma generate
```

---

#### Auth0 Token Error

**Problem**: `Error: Authentication failed`

**Solution**:
1. Check Auth0 configuration in `.env`
2. Verify token in browser devtools (Application → Local Storage)
3. Try logging out and back in
4. Check Auth0 dashboard for application settings

---

#### Port Already in Use

**Problem**: `Error: Port 4000 already in use`

**Solution**:
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=4001 npm run start:dev
```

---

## Best Practices

### Code Organization

1. ✅ Keep files small and focused
2. ✅ Use descriptive names
3. ✅ Group related functionality
4. ✅ Extract reusable logic
5. ✅ Avoid deep nesting

### Performance

1. ✅ Use pagination for large lists
2. ✅ Implement proper indexes
3. ✅ Cache frequently accessed data
4. ✅ Optimize database queries
5. ✅ Lazy load components

### Security

1. ✅ Never commit `.env` files
2. ✅ Validate all user input
3. ✅ Use authentication guards
4. ✅ Sanitize user-generated content
5. ✅ Keep dependencies updated

### Documentation

1. ✅ Write clear comments
2. ✅ Document complex logic
3. ✅ Keep README updated
4. ✅ Add JSDoc for functions
5. ✅ Update API documentation

---

## Resources

- **NestJS Docs**: https://docs.nestjs.com
- **React Docs**: https://react.dev
- **Prisma Docs**: https://www.prisma.io/docs
- **GraphQL Docs**: https://graphql.org/learn
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Auth0 Docs**: https://auth0.com/docs

---

## Getting Help

1. Check this documentation
2. Review existing code
3. Search GitHub issues
4. Ask team members
5. Create detailed bug reports

---

**Happy Coding! 🚀**

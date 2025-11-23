# Database Schema Documentation

## Overview

The ESN Platform uses **PostgreSQL 15** as the primary database with **Prisma** as the ORM. This document provides a complete reference of the database schema, relationships, and best practices.

**Schema File**: `backend/prisma/schema.prisma`

---

## Table of Contents

- [Models](#models)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Enums](#enums)
- [Migrations](#migrations)
- [Seeding](#seeding)
- [Queries](#common-queries)
- [Performance](#performance-optimization)

---

## Database Diagram

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│    User     │────────▶│    Event     │◀───────│  Registration  │
│             │  1:N    │              │  N:1   │                │
│  - id       │         │  - id        │        │  - id          │
│  - email    │         │  - title     │        │  - userId      │
│  - role     │         │  - category  │        │  - eventId     │
│  - ...      │         │  - ...       │        │  - status      │
└─────────────┘         └──────────────┘        └────────────────┘
      │                        │                        │
      │                        │                        │
      │ 1:1                    │ 1:N                    │ 1:N
      ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────┐        ┌──────────────┐
│ UserPreferences  │    │    Review    │        │   Payment    │
│                  │    │              │        │              │
│  - emailEvents   │    │  - rating    │        │  - amount    │
│  - language      │    │  - comment   │        │  - status    │
└──────────────────┘    └──────────────┘        └──────────────┘
```

---

## Models

### User

Stores all user information including authentication, profile, and ESN-specific data.

```prisma
model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Auth Integration
  clerkId   String?  @unique  // Legacy
  auth0Id   String?  @unique  // Current
  
  // Basic Info
  email     String  @unique
  firstName String?
  lastName  String?
  avatar    String?
  phone     String?
  
  // ESN Specific
  esnCardNumber   String?  @unique
  esnCardVerified Boolean  @default(false)
  esnCardExpiry   DateTime?
  university      String?
  chapter         String?
  nationality     String?
  bio             String?
  telegram        String?
  instagram       String?
  emergencyContactName String?
  emergencyContactPhone String?
  
  // Account Status
  emailVerified Boolean @default(false)
  isActive      Boolean @default(true)
  role          UserRole @default(USER)
  
  // Relations
  notifications NotificationSettings?
  preferences   UserPreferences?
  registrations Registration[]
  payments      Payment[]
  reviews       Review[]
  createdEvents Event[] @relation("EventCreator")

  @@map("users")
}
```

**Indexes**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth0id ON users(auth0_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Purpose**: Central user table with role-based access control and ESN membership tracking.

---

### UserPreferences

User notification and display preferences.

```prisma
model UserPreferences {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Email preferences
  emailEvents       Boolean @default(true)
  emailReminders    Boolean @default(true)
  emailNewsletter   Boolean @default(false)
  emailPromotions   Boolean @default(false)
  
  // Display
  language String @default("en")
  timezone String @default("UTC")

  @@map("user_preferences")
}
```

**Relationship**: One-to-One with User (cascade delete)

---

### NotificationSettings

Push and SMS notification settings.

```prisma
model NotificationSettings {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Push notifications
  pushEvents     Boolean @default(true)
  pushReminders  Boolean @default(true)
  pushUpdates    Boolean @default(true)
  
  // SMS notifications
  smsReminders   Boolean @default(false)
  smsUpdates     Boolean @default(false)

  @@map("notification_settings")
}
```

**Relationship**: One-to-One with User (cascade delete)

---

### Event

Core event data and configuration.

```prisma
model Event {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Basic Info
  title       String
  description String
  shortDescription String?
  
  // Classification
  category    EventCategory
  type        EventType
  status      EventStatus @default(DRAFT)
  
  // Dates
  startDate   DateTime
  endDate     DateTime
  registrationDeadline DateTime?
  
  // Location
  location    String
  address     String?
  
  // Capacity
  maxParticipants Int
  
  // Pricing
  price       Float?
  memberPrice Float?
  
  // Media & Info
  imageUrl    String?
  tags        String[]
  requirements String?
  additionalInfo String?
  
  // Settings
  isPublic     Boolean @default(true)
  allowWaitlist Boolean @default(true)
  
  // Relations
  organizer    User     @relation("EventCreator", fields: [organizerId], references: [id])
  organizerId  String
  
  registrations Registration[]
  reviews      Review[]
  payments     Payment[]

  @@map("events")
}
```

**Indexes**:
```sql
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category_status ON events(category, status);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status_public ON events(status, is_public);
```

**Purpose**: Main event entity with full event lifecycle management.

---

### Registration

Event registration with status tracking and payment info.

```prisma
model Registration {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventId String
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  // Status
  status          RegistrationStatus @default(PENDING)
  registrationType RegistrationType  @default(REGULAR)
  position        Int?  // Waitlist position
  
  // Payment
  paymentRequired Boolean @default(false)
  paymentStatus   PaymentStatus @default(PENDING)
  amountDue       Decimal @default(0)
  currency        String @default("EUR")
  
  // Details
  specialRequests String?
  emergencyContact String?
  dietary         String?
  
  // Timestamps
  registeredAt DateTime @default(now())
  confirmedAt  DateTime?
  cancelledAt  DateTime?
  
  // Relations
  payments Payment[]

  @@unique([userId, eventId])
  @@map("registrations")
}
```

**Indexes**:
```sql
CREATE INDEX idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX idx_registrations_user_status ON registrations(user_id, status);
CREATE UNIQUE INDEX idx_registrations_user_event ON registrations(user_id, event_id);
```

**Purpose**: Tracks event registrations with unique constraint per user per event.

---

### Payment

Payment tracking for paid events.

```prisma
model Payment {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  eventId        String
  event          Event        @relation(fields: [eventId], references: [id])
  registrationId String
  registration   Registration @relation(fields: [registrationId], references: [id])
  
  // Payment Details
  amount         Decimal
  currency       String        @default("EUR")
  status         PaymentStatus @default(PENDING)
  method         PaymentMethod @default(STRIPE)
  
  // Stripe Integration
  stripePaymentIntentId String? @unique
  stripeSessionId       String? @unique
  stripeFeeAmount       Decimal @default(0)
  
  // Metadata
  description    String?
  refundAmount   Decimal @default(0)
  refundedAt     DateTime?
  failureReason  String?

  @@map("payments")
}
```

**Indexes**:
```sql
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_event_id ON payments(event_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE UNIQUE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
```

**Purpose**: Stripe payment tracking with refund support.

---

### Review

Event reviews and ratings.

```prisma
model Review {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventId String
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  // Review Content
  rating  Int    // 1-5 stars
  title   String?
  comment String?
  
  // Moderation
  isPublic  Boolean @default(true)
  isVerified Boolean @default(false) // Only attendees

  @@unique([userId, eventId])
  @@map("reviews")
}
```

**Indexes**:
```sql
CREATE INDEX idx_reviews_event_id ON reviews(event_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE UNIQUE INDEX idx_reviews_user_event ON reviews(user_id, event_id);
```

**Purpose**: User feedback for events with verification status.

---

## Relationships

### User Relationships

| Relation | Type | Target | Description |
|----------|------|--------|-------------|
| `notifications` | 1:1 | NotificationSettings | User notification preferences |
| `preferences` | 1:1 | UserPreferences | User display preferences |
| `registrations` | 1:N | Registration | User's event registrations |
| `payments` | 1:N | Payment | User's payments |
| `reviews` | 1:N | Review | User's event reviews |
| `createdEvents` | 1:N | Event | Events created by user |

### Event Relationships

| Relation | Type | Target | Description |
|----------|------|--------|-------------|
| `organizer` | N:1 | User | Event creator |
| `registrations` | 1:N | Registration | Event registrations |
| `reviews` | 1:N | Review | Event reviews |
| `payments` | 1:N | Payment | Event payments |

### Registration Relationships

| Relation | Type | Target | Description |
|----------|------|--------|-------------|
| `user` | N:1 | User | Registered user |
| `event` | N:1 | Event | Event registered for |
| `payments` | 1:N | Payment | Registration payments |

---

## Enums

### UserRole

```prisma
enum UserRole {
  USER          // Standard participant
  ORGANIZER     // Can create events  
  ADMIN         // Full platform access
}
```

**Usage**: Controls access to admin and organizer features.

---

### EventCategory

```prisma
enum EventCategory {
  SOCIAL
  CULTURAL
  EDUCATIONAL
  SPORTS
  TRAVEL
  VOLUNTEER
  NETWORKING
  PARTY
  WORKSHOP
  CONFERENCE
  OTHER
}
```

**Usage**: Event classification for filtering and categorization.

---

### EventType

```prisma
enum EventType {
  FREE           // No payment
  PAID           // Requires payment
  MEMBERS_ONLY   // ESN members only
}
```

---

### EventStatus

```prisma
enum EventStatus {
  DRAFT               // Not published
  PUBLISHED           // Visible
  REGISTRATION_OPEN   // Accepting registrations
  REGISTRATION_CLOSED // Registration ended
  ONGOING             // Event happening
  COMPLETED           // Event finished
  CANCELLED           // Event cancelled
}
```

**Workflow**:
```
DRAFT → PUBLISHED → REGISTRATION_OPEN → REGISTRATION_CLOSED → ONGOING → COMPLETED
                                                                     ↓
                                                                 CANCELLED
```

---

### RegistrationStatus

```prisma
enum RegistrationStatus {
  PENDING      // Awaiting confirmation
  CONFIRMED    // Confirmed spot
  WAITLISTED   // On waitlist
  CANCELLED    // Cancelled
  ATTENDED     // User attended
  NO_SHOW      // Did not attend
}
```

---

### PaymentStatus

```prisma
enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}
```

---

## Migrations

### Creating Migrations

```bash
# Create new migration
npx prisma migrate dev --name add_user_bio

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
```

### Migration Best Practices

1. **Always create migrations** - Never edit schema without migration
2. **Test locally first** - Verify migration before production
3. **Backup before migrating** - Always backup production database
4. **Name descriptively** - Use clear migration names
5. **Review SQL** - Check generated SQL in `migrations/` folder

---

## Seeding

### Seed Data

The seed script creates:
- 1 Admin user
- 2 Organizer users
- 10 Regular users
- 20 Sample events
- Various registrations

```bash
# Run seed
npm run db:seed

# Reset and seed
npm run db:reset
```

### Seed File

Location: `backend/prisma/seed.ts`

**Customize** seed data by editing this file.

---

## Common Queries

### Get Users with Registration Count

```typescript
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: { registrations: true }
    }
  }
});
```

---

### Get Events with Available Spots

```typescript
const events = await prisma.event.findMany({
  where: {
    status: 'PUBLISHED',
    registrations: {
      _count: {
        lte: prisma.event.fields.maxParticipants
      }
    }
  }
});
```

---

### Get User's Upcoming Events

```typescript
const userEvents = await prisma.registration.findMany({
  where: {
    userId: userId,
    status: { in: ['CONFIRMED', 'PENDING'] },
    event: {
      startDate: { gte: new Date() }
    }
  },
  include: {
    event: true
  },
  orderBy: {
    event: { startDate: 'asc' }
  }
});
```

---

### Get Event Statistics

```typescript
const eventStats = await prisma.event.findUnique({
  where: { id: eventId },
  include: {
    _count: {
      select: {
        registrations: true,
        reviews: true
      }
    },
    reviews: {
      select: {
        rating: true
      }
    }
  }
});

const avgRating = eventStats.reviews.reduce((sum, r) => sum + r.rating, 0) / eventStats.reviews.length;
```

---

## Database Indexes (Recommended)

### Add Performance Indexes

Add these indexes to improve query performance:

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_esn_card ON users(esn_card_number);

-- Event indexes
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || description));

-- Registration indexes
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created ON registrations(created_at);
```

---

## Performance Optimization

### Connection Pooling

```env
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=20&pool_timeout=10"
```

### Query Optimization Tips

1. **Use `select` to limit fields**
```typescript
prisma.user.findMany({
  select: { id: true, email: true }  // Only fetch needed fields
});
```

2. **Use `_count` for counting**
```typescript
prisma.user.findMany({
  include: {
    _count: { select: { registrations: true } }
  }
});
```

3. **Paginate large results**
```typescript
prisma.event.findMany({
  skip: page * pageSize,
  take: pageSize
});
```

4. **Use transaction for multiple operations**
```typescript
await prisma.$transaction([
  prisma.registration.create({ data: regData }),
  prisma.payment.create({ data: paymentData })
]);
```

---

## Backup & Restore

### Backup Database

```bash
# Backup to file
docker-compose exec postgres pg_dump -U postgres esn_db > backup_$(date +%Y%m%d).sql

# Compressed backup
docker-compose exec postgres pg_dump -U postgres esn_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore Database

```bash
# Restore from file
cat backup.sql | docker-compose exec -T postgres psql -U postgres esn_db

# Restore from compressed
gunzip -c backup.sql.gz | docker-compose exec -T postgres psql -U postgres esn_db
```

---

## Monitoring

### Database Size

```sql
SELECT pg_size_pretty(pg_database_size('esn_db'));
```

### Table Sizes

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active Connections

```sql
SELECT count(*) FROM pg_stat_activity;
```

---

## Troubleshooting

### Reset Migrations

```bash
# WARNING: Deletes all data!
npx prisma migrate reset
```

### Fix Migration Issues

```bash
# Mark migration as applied
npx prisma migrate resolve --applied migration_name

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back migration_name
```

### Regenerate Prisma Client

```bash
npx prisma generate
```

---

## Best Practices

1. ✅ Always use migrations for schema changes
2. ✅ Index frequently queried fields
3. ✅ Use transactions for related operations
4. ✅ Implement soft deletes for important data
5. ✅ Regular database backups
6. ✅ Monitor query performance
7. ✅ Use connection pooling
8. ✅ Validate data at application layer
9. ✅ Use prepared statements (Prisma does this)
10. ✅ Keep schema documentation updated

---

## Schema Version

**Current Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Prisma Version**: 6.10.1  
**PostgreSQL Version**: 15

---

## Support

- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/15/
- **Schema File**: `backend/prisma/schema.prisma`

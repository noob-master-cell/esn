# Database Documentation

## Prisma Schema Overview
```prisma
model User {
  id            String   @id @default(cuid())
  auth0Id       String   @unique
  email         String   @unique
  firstName     String?
  lastName      String?
  role          UserRole @default(USER)
  registrations Registration[]
  reviews       Review[]
}

enum UserRole {
  USER
  ADMIN
}

model Event {
  id                String        @id @default(cuid())
  title             String
  description       String?
  location          String?
  address           String?
  startDate         DateTime
  endDate           DateTime
  maxParticipants   Int
  registrationCount Int          @default(0)
  imageUrl          String?
  published         Boolean      @default(false)
  creatorId         String
  creator           User          @relation(fields: [creatorId], references: [id])
  registrations     Registration[]
  reviews           Review[]
}

model Registration {
  id               String           @id @default(cuid())
  eventId          String
  userId           String
  status           RegistrationStatus @default(PENDING)
  registeredAt     DateTime @default(now())
  event            Event   @relation(fields: [eventId], references: [id])
  user             User    @relation(fields: [userId], references: [id])
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  ATTENDED
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String?
  eventId   String
  userId    String
  event     Event    @relation(fields: [eventId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

// Index for fast look‑ups of registrations per event and status
@@index([eventId, status])
```

## Relationships
- **User** 1‑* **Registration**
- **Event** 1‑* **Registration**
- **Event** 1‑* **Review**
- **User** 1‑* **Review**

## Indexes
- Compound index `@@index([eventId, status])` on `Registration` for efficient status queries per event.
- Unique indexes on `User.email` and `User.auth0Id`.

## Migration & Seeding
- Run `npx prisma migrate dev` for schema changes.
- Use `prisma/seed.ts` (if present) to populate initial data.

## Backup & Restore
- Export: `pg_dump -U postgres -h localhost -Fc esn_db > backup.dump`
- Restore: `pg_restore -U postgres -d esn_db backup.dump`

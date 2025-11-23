# GraphQL API Documentation

## Overview

The ESN Platform uses GraphQL for all client-server communication. This document provides a complete reference of all available queries, mutations, and types.

**GraphQL Playground**: `http://localhost:4000/graphql`

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Events](#events)
- [Registrations](#registrations)
- [Admin](#admin)
- [Types](#types)
- [Enums](#enums)
- [Input Types](#input-types)

---

## Authentication

All API requests (except health check) require authentication via Auth0 JWT token.

### Headers

```graphql
{
  "Authorization": "Bearer <AUTH0_JWT_TOKEN>"
}
```

### Getting Token (Frontend)

```typescript
import { useAuth0 } from '@auth0/auth0-react';

const { getAccessTokenSilently } = useAuth0();
const token = await getAccessTokenSilently();
```

---

## Users

### Queries

#### `users`
Get all users (Admin only).

```graphql
query GetAllUsers {
  users {
    id
    email
    firstName
    lastName
    role
    esnCardVerified
    createdAt
  }
}
```

**Authorization**: Admin only  
**Returns**: `[User!]!`

---

#### `user`
Get user by ID.

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    avatar
    university
    chapter
    esnCardNumber
    role
  }
}
```

**Variables**:
```json
{
  "id": "user_id_here"
}
```

**Authorization**: Authenticated  
**Returns**: `User`

---

#### `me`
Get current user profile.

```graphql
query GetMyProfile {
  me {
    id
    email
    firstName
    lastName
    phone
    university
    chapter
    nationality
    bio
    telegram
    instagram
    esnCardNumber
    esnCardVerified
    esnCardExpiry
    role
    emailVerified
    createdAt
  }
}
```

**Authorization**: Authenticated  
**Returns**: `User!`

---

### Mutations

#### `updateProfile`
Update current user's profile.

```graphql
mutation UpdateProfile($input: UpdateUserInput!) {
  updateProfile(input: $input) {
    id
    firstName
    lastName
    phone
    university
    bio
  }
}
```

**Variables**:
```json
{
  "input": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "university": "University Name",
    "chapter": "ESN Chapter",
    "nationality": "Country",
    "bio": "Description",
    "telegram": "@username",
    "instagram": "@username"
  }
}
```

**Authorization**: Authenticated  
**Returns**: `User!`

---

#### `updateUserRole`
Update user role (Admin only).

```graphql
mutation UpdateUserRole($userId: String!, $role: UserRole!) {
  updateUserRole(userId: $userId, role: $role) {
    id
    email
    role
  }
}
```

**Variables**:
```json
{
  "userId": "user_id_here",
  "role": "ADMIN"
}
```

**Authorization**: Admin only  
**Returns**: `User!`

---

#### `verifyEsnCard`
Verify user's ESN card (Admin only).

```graphql
mutation VerifyEsnCard($userId: String!, $verified: Boolean!) {
  verifyEsnCard(userId: $userId, verified: $verified) {
    id
    esnCardVerified
  }
}
```

**Authorization**: Admin only  
**Returns**: `User!`

---

#### `deleteUser`
Delete user account.

```graphql
mutation DeleteUser {
  deleteUser
}
```

**Authorization**: Authenticated  
**Returns**: `Boolean!`

---

#### `adminDeleteUser`
Delete any user (Admin only).

```graphql
mutation AdminDeleteUser($userId: String!) {
  adminDeleteUser(userId: $userId)
}
```

**Authorization**: Admin only  
**Returns**: `Boolean!`

---

## Events

### Queries

#### `events`
Get all events with optional filters.

```graphql
query GetEvents($filter: EventsFilterInput) {
  events(filter: $filter) {
    id
    title
    description
    category
    type
    status
    startDate
    endDate
    location
    price
    memberPrice
    maxParticipants
    registrationCount
    waitlistCount
    imageUrl
    isRegistered
    canRegister
    organizer {
      id
      firstName
      lastName
    }
  }
}
```

**Variables**:
```json
{
  "filter": {
    "category": "SOCIAL",
    "type": "FREE",
    "status": "PUBLISHED",
    "location": "City Name",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "search": "keyword",
    "availableOnly": true,
    "orderBy": "startDate",
    "orderDirection": "asc",
    "skip": 0,
    "take": 20
  }
}
```

**Authorization**: Public (published events), Authenticated (all events)  
**Returns**: `[Event!]!`

---

#### `event`
Get single event by ID.

```graphql
query GetEvent($id: ID!) {
  event(id: $id) {
    id
    title
    description
    shortDescription
    category
    type
    status
    startDate
    endDate
    registrationDeadline
    location
    address
    maxParticipants
    price
    memberPrice
    imageUrl
    tags
    requirements
    additionalInfo
    isPublic
    allowWaitlist
    registrationCount
    waitlistCount
    isRegistered
    canRegister
    organizer {
      id
      firstName
      lastName
      avatar
    }
    createdAt
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "event_id_here"
}
```

**Authorization**: Public (if published), Authenticated  
**Returns**: `Event!`

---

#### `myEvents`
Get events created by current user.

```graphql
query GetMyEvents {
  myEvents {
    id
    title
    status
    startDate
    registrationCount
    maxParticipants
  }
}
```

**Authorization**: Authenticated  
**Returns**: `[Event!]!`

---

#### `eventsCount`
Get total count of events.

```graphql
query GetEventsCount($filter: EventsFilterInput) {
  eventsCount(filter: $filter)
}
```

**Authorization**: Public  
**Returns**: `Int!`

---

### Mutations

#### `createEvent`
Create new event (Organizer/Admin only).

```graphql
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
    title
    status
  }
}
```

**Variables**:
```json
{
  "input": {
    "title": "Event Title",
    "description": "Full description",
    "shortDescription": "Short description",
    "category": "SOCIAL",
    "type": "FREE",
    "startDate": "2025-06-01T18:00:00Z",
    "endDate": "2025-06-01T22:00:00Z",
    "registrationDeadline": "2025-05-31T23:59:59Z",
    "location": "City Center",
    "address": "123 Main St",
    "maxParticipants": 50,
    "price": 10.00,
    "memberPrice": 5.00,
    "imageUrl": "https://example.com/image.jpg",
    "tags": ["party", "social"],
    "requirements": "ESN card required",
    "additionalInfo": "Bring ID",
    "isPublic": true,
    "allowWaitlist": true
  }
}
```

**Authorization**: Organizer or Admin  
**Returns**: `Event!`

---

#### `updateEvent`
Update existing event.

```graphql
mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
  updateEvent(id: $id, input: $input) {
    id
    title
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "event_id_here",
  "input": {
    "title": "Updated Title",
    "description": "Updated description",
    "maxParticipants": 100
  }
}
```

**Authorization**: Event organizer or Admin  
**Returns**: `Event!`

---

#### `deleteEvent`
Delete event.

```graphql
mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id)
}
```

**Variables**:
```json
{
  "id": "event_id_here"
}
```

**Authorization**: Event organizer or Admin  
**Returns**: `Boolean!`

---

#### `publishEvent`
Publish draft event.

```graphql
mutation PublishEvent($id: ID!) {
  publishEvent(id: $id) {
    id
    status
  }
}
```

**Variables**:
```json
{
  "id": "event_id_here"
}
```

**Authorization**: Event organizer or Admin  
**Returns**: `Event!`

---

## Registrations

### Queries

#### `registrations`
Get all registrations (Admin only).

```graphql
query GetAllRegistrations {
  registrations {
    id
    status
    user {
      firstName
      lastName
    }
    event {
      title
    }
    createdAt
  }
}
```

**Authorization**: Admin only  
**Returns**: `[Registration!]!`

---

#### `myRegistrations`
Get current user's registrations.

```graphql
query GetMyRegistrations {
  myRegistrations {
    id
    status
    registrationType
    event {
      id
      title
      startDate
      location
    }
    paymentStatus
    amountDue
    registeredAt
  }
}
```

**Authorization**: Authenticated  
**Returns**: `[Registration!]!`

---

#### `eventRegistrations`
Get all registrations for an event.

```graphql
query GetEventRegistrations($eventId: ID!) {
  eventRegistrations(eventId: $eventId) {
    id
    status
    user {
      firstName
      lastName
      email
    }
    registeredAt
    specialRequests
    dietary
  }
}
```

**Variables**:
```json
{
  "eventId": "event_id_here"
}
```

**Authorization**: Event organizer or Admin  
**Returns**: `[Registration!]!`

---

#### `registration`
Get single registration.

```graphql
query GetRegistration($id: ID!) {
  registration(id: $id) {
    id
    status
    registrationType
    position
    paymentRequired
    paymentStatus
    amountDue
    specialRequests
    emergencyContact
    dietary
    user {
      firstName
      lastName
      phone
    }
    event {
      title
      startDate
    }
  }
}
```

**Authorization**: Authenticated (own registration) or Admin  
**Returns**: `Registration!`

---

### Mutations

#### `register`
Register for an event.

```graphql
mutation RegisterForEvent($input: CreateRegistrationInput!) {
  register(input: $input) {
    id
    status
    registrationType
  }
}
```

**Variables**:
```json
{
  "input": {
    "eventId": "event_id_here",
    "specialRequests": "Vegetarian meal",
    "emergencyContact": "+1234567890",
    "dietary": "Vegetarian"
  }
}
```

**Authorization**: Authenticated  
**Returns**: `Registration!`

---

#### `updateRegistration`
Update registration details.

```graphql
mutation UpdateRegistration($id: ID!, $input: UpdateRegistrationInput!) {
  updateRegistration(id: $id, input: $input) {
    id
    specialRequests
  }
}
```

**Authorization**: Authenticated (own registration) or Admin  
**Returns**: `Registration!`

---

#### `cancelRegistration`
Cancel a registration.

```graphql
mutation CancelRegistration($id: ID!) {
  cancelRegistration(id: $id) {
    id
    status
  }
}
```

**Authorization**: Authenticated (own registration) or Admin  
**Returns**: `Registration!`

---

#### `confirmRegistration`
Confirm a pending registration (Admin/Organizer).

```graphql
mutation ConfirmRegistration($registrationId: ID!) {
  confirmRegistration(registrationId: $registrationId)
}
```

**Authorization**: Event organizer or Admin  
**Returns**: `Boolean!`

---

#### `promoteFromWaitlist`
Promote user from waitlist to confirmed.

```graphql
mutation PromoteFromWaitlist($registrationId: ID!) {
  promoteFromWaitlist(registrationId: $registrationId) {
    id
    status
    position
  }
}
```

**Authorization**: Event organizer or Admin  
**Returns**: `Registration!`

---

## Admin

### Queries

#### `adminStats`
Get platform statistics (Admin only).

```graphql
query GetAdminStats {
  adminStats {
    totalUsers
    totalEvents
    totalRegistrations
    activeEvents
    revenue
  }
}
```

**Authorization**: Admin only  
**Returns**: `AdminStats!`

---

## Types

### User

```graphql
type User {
  id: ID!
  email: String!
  firstName: String
  lastName: String
  avatar: String
  phone: String
  
  # ESN specific
  esnCardNumber: String
  esnCardVerified: Boolean!
  esnCardExpiry: DateTime
  university: String
  chapter: String
  nationality: String
  
  # Social
  bio: String
  telegram: String
  instagram: String
  
  # Emergency
  emergencyContactName: String
  emergencyContactPhone: String
  
  # Account
  emailVerified: Boolean!
  isActive: Boolean!
  role: UserRole!
  
  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

### Event

```graphql
type Event {
  id: ID!
  title: String!
  description: String!
  shortDescription: String
  
  # Classification
  category: EventCategory!
  type: EventType!
  status: EventStatus!
  
  # Dates
  startDate: DateTime!
  endDate: DateTime!
  registrationDeadline: DateTime
  
  # Location
  location: String!
  address: String
  
  # Capacity
  maxParticipants: Int!
  registrationCount: Int!
  waitlistCount: Int!
  
  # Pricing
  price: Float
  memberPrice: Float
  
  # Media
  imageUrl: String
  tags: [String!]
  requirements: String
  additionalInfo: String
  
  # Settings
  isPublic: Boolean!
  allowWaitlist: Boolean!
  
  # Relations
  organizer: User!
  organizerId: String!
  
  # Computed
  isRegistered: Boolean
  canRegister: Boolean
  
  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

### Registration

```graphql
type Registration {
  id: ID!
  
  # Relations
  user: User!
  userId: String!
  event: Event!
  eventId: String!
  
  # Status
  status: RegistrationStatus!
  registrationType: RegistrationType!
  position: Int
  
  # Payment
  paymentRequired: Boolean!
  paymentStatus: PaymentStatus!
  amountDue: Decimal!
  currency: String!
  
  # Details
  specialRequests: String
  emergencyContact: String
  dietary: String
  
  # Timestamps
  registeredAt: DateTime!
  confirmedAt: DateTime
  cancelledAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

### AdminStats

```graphql
type AdminStats {
  totalUsers: Int!
  totalEvents: Int!
  totalRegistrations: Int!
  activeEvents: Int!
  revenue: Float!
}
```

---

## Enums

### UserRole

```graphql
enum UserRole {
  USER          # Standard user
  ORGANIZER     # Can create events
  ADMIN         # Full access
}
```

---

### EventCategory

```graphql
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

---

### EventType

```graphql
enum EventType {
  FREE           # No payment required
  PAID           # Payment required
  MEMBERS_ONLY   # ESN members only
}
```

---

### EventStatus

```graphql
enum EventStatus {
  DRAFT               # Not published
  PUBLISHED           # Visible to users
  REGISTRATION_OPEN   # Accepting registrations
  REGISTRATION_CLOSED # Not accepting registrations
  ONGOING             # Event is happening
  COMPLETED           # Event finished
  CANCELLED           # Event cancelled
}
```

---

### RegistrationStatus

```graphql
enum RegistrationStatus {
  PENDING      # Awaiting confirmation
  CONFIRMED    # Confirmed spot
  WAITLISTED   # On waitlist
  CANCELLED    # Cancelled by user
  ATTENDED     # User attended
  NO_SHOW      # Did not attend
}
```

---

### RegistrationType

```graphql
enum RegistrationType {
  REGULAR      # Standard registration
  WAITLIST     # Waitlist registration
  VIP          # VIP registration
  ORGANIZER    # Organizer registration
}
```

---

### PaymentStatus

```graphql
enum PaymentStatus {
  PENDING      # Payment not made
  PROCESSING   # Payment processing
  COMPLETED    # Payment successful
  FAILED       # Payment failed
  REFUNDED     # Payment refunded
  CANCELLED    # Payment cancelled
}
```

---

## Input Types

### UpdateUserInput

```graphql
input UpdateUserInput {
  firstName: String
  lastName: String
  phone: String
  university: String
  nationality: String
  avatar: String
  chapter: String
  bio: String
  telegram: String
  instagram: String
  emergencyContactName: String
  emergencyContactPhone: String
}
```

---

### CreateEventInput

```graphql
input CreateEventInput {
  title: String!
  description: String!
  shortDescription: String
  category: EventCategory!
  type: EventType!
  startDate: DateTime!
  endDate: DateTime!
  registrationDeadline: DateTime
  location: String!
  address: String
  maxParticipants: Int!
  price: Float
  memberPrice: Float
  imageUrl: String
  tags: [String!]
  requirements: String
  additionalInfo: String
  isPublic: Boolean = true
  allowWaitlist: Boolean = true
}
```

---

### UpdateEventInput

```graphql
input UpdateEventInput {
  title: String
  description: String
  shortDescription: String
  category: EventCategory
  type: EventType
  startDate: DateTime
  endDate: DateTime
  registrationDeadline: DateTime
  location: String
  address: String
  maxParticipants: Int
  price: Float
  memberPrice: Float
  imageUrl: String
  tags: [String!]
  requirements: String
  additionalInfo: String
  isPublic: Boolean
  allowWaitlist: Boolean
}
```

---

### CreateRegistrationInput

```graphql
input CreateRegistrationInput {
  eventId: String!
  specialRequests: String
  emergencyContact: String
  dietary: String
}
```

---

### EventsFilterInput

```graphql
input EventsFilterInput {
  search: String
  category: EventCategory
  type: EventType
  status: EventStatus
  location: String
  startDate: DateTime
  endDate: DateTime
  availableOnly: Boolean
  orderBy: String = "startDate"
  orderDirection: String = "asc"
  skip: Int = 0
  take: Int = 20
}
```

---

## Error Handling

All GraphQL errors follow this format:

```json
{
  "errors": [
    {
      "message": "Error message",
      "extensions": {
        "code": "ERROR_CODE",
        "statusCode": 400
      }
    }
  ]
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHENTICATED` | No valid JWT token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `BAD_USER_INPUT` | Invalid input data |
| `INTERNAL_SERVER_ERROR` | Server error |

---

## Rate Limiting

- **Rate Limit**: 100 requests per minute per user
- **Headers**: Check `X-RateLimit-*` headers in response

---

## Example Client Setup

### Apollo Client (React)

```typescript
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = await getAccessTokenSilently();
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

---

## Testing with cURL

```bash
# Get events
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "query { events { id title } }"
  }'
```

---

## Support

For API questions:
- Check GraphQL Playground: `http://localhost:4000/graphql`
- Review source code: `backend/src/*/resolvers.ts`
- Open an issue on GitHub

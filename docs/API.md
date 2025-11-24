# API Documentation

This file provides an overview of the GraphQL API endpoints available in the ESN Event Management Platform.

## Queries
- `events(filter: EventsFilterInput)`: List public events.
- `event(id: ID!)`: Retrieve a single event.
- `myEvents`: Events created by the authenticated user.
- `myRegistrations`: Registrations of the current user.
- `users`: List all users (admin only).
- `user(id: ID!)`: Retrieve a single user (admin only).

## Mutations
- `createEvent(createEventInput: CreateEventInput!)`
- `updateEvent(updateEventInput: UpdateEventInput!)`
- `publishEvent(id: ID!)`
- `removeEvent(id: ID!)`
- `registerForEvent(createRegistrationInput: CreateRegistrationInput!)`
- `updateRegistration(updateRegistrationInput: UpdateRegistrationInput!)`
- `updateUserRole(userId: ID!, role: UserRole!)`

All mutations require a valid Auth0 JWT in the `Authorization` header.

// frontend/src/lib/graphql/events.ts
import { gql } from "@apollo/client";

// Event fragment for reusability
export const EVENT_FRAGMENT = gql`
  fragment EventFragment on Event {
    id
    title
    description
    shortDescription
    startDate
    endDate
    registrationDeadline
    location
    address
    maxParticipants
    registrationCount
    waitlistCount
    price
    memberPrice
    imageUrl
    tags
    requirements
    additionalInfo
    category
    type
    status
    isPublic
    allowWaitlist
    canRegister
    isRegistered
    createdAt
    updatedAt
    organizer {
      id
      firstName
      lastName
      email
    }
  }
`;

// Get all events query
export const GET_EVENTS = gql`
  ${EVENT_FRAGMENT}
  query GetEvents($filter: EventsFilterInput) {
    events(filter: $filter) {
      ...EventFragment
    }
  }
`;

// Get single event query
export const GET_EVENT = gql`
  ${EVENT_FRAGMENT}
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventFragment
    }
  }
`;

// Get events count query
export const GET_EVENTS_COUNT = gql`
  query GetEventsCount($filter: EventsFilterInput) {
    eventsCount(filter: $filter)
  }
`;

// Get my events query (for organizers)
export const GET_MY_EVENTS = gql`
  ${EVENT_FRAGMENT}
  query GetMyEvents {
    myEvents {
      ...EventFragment
    }
  }
`;

// Event mutations
export const CREATE_EVENT = gql`
  ${EVENT_FRAGMENT}
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      ...EventFragment
    }
  }
`;

export const UPDATE_EVENT = gql`
  ${EVENT_FRAGMENT}
  mutation UpdateEvent($updateEventInput: UpdateEventInput!) {
    updateEvent(updateEventInput: $updateEventInput) {
      ...EventFragment
    }
  }
`;

export const PUBLISH_EVENT = gql`
  ${EVENT_FRAGMENT}
  mutation PublishEvent($id: ID!) {
    publishEvent(id: $id) {
      ...EventFragment
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    removeEvent(id: $id)
  }
`;

// TypeScript interfaces for type safety
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  location: string;
  address?: string;
  maxParticipants: number;
  registrationCount: number;
  waitlistCount: number;
  price?: number;
  memberPrice?: number;
  imageUrl?: string;
  tags?: string[];
  requirements?: string;
  additionalInfo?: string;
  category: EventCategory;
  type: EventType;
  status: EventStatus;
  isPublic: boolean;
  allowWaitlist: boolean;
  canRegister?: boolean;
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface EventsFilterInput {
  search?: string;
  category?: EventCategory;
  type?: EventType;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  location?: string;
  tags?: string[];
  availableOnly?: boolean;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface CreateEventInput {
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  type: EventType;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  location: string;
  address?: string;
  maxParticipants: number;
  price?: number;
  memberPrice?: number;
  imageUrl?: string;
  tags?: string[];
  requirements?: string;
  additionalInfo?: string;
  isPublic?: boolean;
  allowWaitlist?: boolean;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

// Enums
export enum EventCategory {
  SOCIAL = "SOCIAL",
  CULTURAL = "CULTURAL",
  EDUCATIONAL = "EDUCATIONAL",
  SPORTS = "SPORTS",
  TRAVEL = "TRAVEL",
  VOLUNTEER = "VOLUNTEER",
  NETWORKING = "NETWORKING",
  PARTY = "PARTY",
  WORKSHOP = "WORKSHOP",
  CONFERENCE = "CONFERENCE",
  OTHER = "OTHER",
}

export enum EventType {
  FREE = "FREE",
  PAID = "PAID",
  MEMBERS_ONLY = "MEMBERS_ONLY",
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  REGISTRATION_OPEN = "REGISTRATION_OPEN",
  REGISTRATION_CLOSED = "REGISTRATION_CLOSED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

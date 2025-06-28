// frontend/src/lib/graphql/registrations.ts
import { gql } from "@apollo/client";

// Registration fragment for reusability
export const REGISTRATION_FRAGMENT = gql`
  fragment RegistrationFragment on Registration {
    id
    status
    registrationType
    position
    paymentRequired
    paymentStatus
    amountDue
    currency
    specialRequests
    emergencyContact
    dietary
    registeredAt
    confirmedAt
    cancelledAt
    user {
      id
      firstName
      lastName
      email
    }
    event {
      id
      title
      startDate
      location
    }
  }
`;

// Register for event mutation
export const REGISTER_FOR_EVENT = gql`
  ${REGISTRATION_FRAGMENT}
  mutation RegisterForEvent(
    $createRegistrationInput: CreateRegistrationInput!
  ) {
    registerForEvent(createRegistrationInput: $createRegistrationInput) {
      ...RegistrationFragment
    }
  }
`;

// Cancel registration mutation
export const CANCEL_REGISTRATION = gql`
  ${REGISTRATION_FRAGMENT}
  mutation CancelRegistration($id: ID!) {
    cancelRegistration(id: $id) {
      ...RegistrationFragment
    }
  }
`;

// Update registration mutation
export const UPDATE_REGISTRATION = gql`
  ${REGISTRATION_FRAGMENT}
  mutation UpdateRegistration(
    $updateRegistrationInput: UpdateRegistrationInput!
  ) {
    updateRegistration(updateRegistrationInput: $updateRegistrationInput) {
      ...RegistrationFragment
    }
  }
`;

// Get my registrations query
export const GET_MY_REGISTRATIONS = gql`
  ${REGISTRATION_FRAGMENT}
  query GetMyRegistrations {
    myRegistrations {
      ...RegistrationFragment
    }
  }
`;

// Get event registrations query (for organizers)
export const GET_EVENT_REGISTRATIONS = gql`
  ${REGISTRATION_FRAGMENT}
  query GetEventRegistrations($eventId: ID!, $filter: RegistrationFilterInput) {
    eventRegistrations(eventId: $eventId, filter: $filter) {
      ...RegistrationFragment
    }
  }
`;

// TypeScript interfaces for type safety
export interface Registration {
  id: string;
  status: RegistrationStatus;
  registrationType: RegistrationType;
  position?: number;
  paymentRequired: boolean;
  paymentStatus: PaymentStatus;
  amountDue: number;
  currency: string;
  specialRequests?: string;
  emergencyContact?: string;
  dietary?: string;
  registeredAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    startDate: string;
    location: string;
  };
}

export interface CreateRegistrationInput {
  eventId: string;
  specialRequests?: string;
  dietary?: string;
  emergencyContact?: string;
  emergencyEmail?: string;
}

export interface UpdateRegistrationInput
  extends Partial<CreateRegistrationInput> {
  id: string;
  status?: RegistrationStatus;
}

export interface RegistrationFilterInput {
  status?: RegistrationStatus;
  registrationType?: RegistrationType;
  paymentStatus?: PaymentStatus;
  eventId?: string;
  userId?: string;
  registeredAfter?: string;
  registeredBefore?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

// Enums
export enum RegistrationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  WAITLISTED = "WAITLISTED",
  CANCELLED = "CANCELLED",
  ATTENDED = "ATTENDED",
  NO_SHOW = "NO_SHOW",
}

export enum RegistrationType {
  REGULAR = "REGULAR",
  WAITLIST = "WAITLIST",
  VIP = "VIP",
  ORGANIZER = "ORGANIZER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

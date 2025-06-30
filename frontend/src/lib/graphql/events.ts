// frontend/src/lib/graphql/events.ts
import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      id
      title
      status
      startDate
      endDate
      location
      maxParticipants
      registrationCount
      waitlistCount
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($updateEventInput: UpdateEventInput!) {
    updateEvent(updateEventInput: $updateEventInput) {
      id
      title
      status
      startDate
      endDate
      location
      maxParticipants
      registrationCount
      waitlistCount
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_EVENT_FOR_EDIT = gql`
  query GetEventForEdit($id: ID!) {
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
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_EVENT_DETAILS = gql`
  query GetEventDetails($id: ID!) {
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
      createdAt
      updatedAt
      organizer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_EVENTS_LIST = gql`
  query GetEventsList($filter: EventsFilterInput) {
    events(filter: $filter) {
      id
      title
      shortDescription
      category
      type
      status
      startDate
      endDate
      location
      maxParticipants
      price
      memberPrice
      imageUrl
      tags
      registrationCount
      waitlistCount
      isRegistered
      canRegister
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

// Legacy exports for backward compatibility
export const GET_EVENTS = gql`
  query GetEvents($filter: EventsFilterInput) {
    events(filter: $filter) {
      id
      title
      shortDescription
      category
      type
      status
      startDate
      endDate
      location
      maxParticipants
      price
      memberPrice
      imageUrl
      tags
      registrationCount
      waitlistCount
      isRegistered
      canRegister
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_EVENT = gql`
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
      createdAt
      updatedAt
      organizer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    removeEvent(id: $id)
  }
`;

export const PUBLISH_EVENT = gql`
  mutation PublishEvent($id: ID!) {
    publishEvent(id: $id) {
      id
      status
      registrationCount
      waitlistCount
    }
  }
`;

export const REGISTER_FOR_EVENT = gql`
  mutation RegisterForEvent(
    $createRegistrationInput: CreateRegistrationInput!
  ) {
    registerForEvent(createRegistrationInput: $createRegistrationInput) {
      id
      status
      registrationType
      paymentRequired
      paymentStatus
      amountDue
      currency
      event {
        id
        title
        registrationCount
        waitlistCount
      }
    }
  }
`;

export const CANCEL_REGISTRATION = gql`
  mutation CancelRegistration($registrationId: ID!) {
    updateRegistration(
      updateRegistrationInput: { id: $registrationId, status: CANCELLED }
    ) {
      id
      status
      event {
        id
        registrationCount
        waitlistCount
      }
    }
  }
`;
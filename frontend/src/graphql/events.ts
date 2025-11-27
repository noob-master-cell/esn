import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents($filter: EventsFilterInput) {
    events(filter: $filter) {
      items {
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
        isUnlimited
        price
        memberPrice
        images
        tags
        registrationCount

        isRegistered
        canRegister
        organizer {
          id
          firstName
          lastName
        }
      }
      total
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
      isUnlimited
      price
      memberPrice
      images
      tags
      requirements
      additionalInfo
      isPublic

      registrationCount

      isRegistered
      canRegister
      attendees {
        id
        firstName
        lastName
        avatar
      }
      createdAt
      updatedAt
      organizer {
        id
        firstName
        lastName
        email
        avatar
      }
    }
  }
`;

export const GET_EVENT_FOR_EDIT = GET_EVENT;

export const GET_ADMIN_EVENTS = gql`
  query GetAdminEvents($filter: EventsFilterInput) {
    adminEvents(filter: $filter) {
      items {
        id
        title
        startDate
        endDate
        location
        maxParticipants
        isUnlimited
        registrationCount
        status
        category
        images
        type
        price
        memberPrice
        organizer {
          id
          firstName
          lastName
        }
      }
      total
    }
  }
`;

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
      isUnlimited
      registrationCount

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

      organizer {
        id
        firstName
        lastName
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

      }
    }
  }
`;

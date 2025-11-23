import { gql } from "@apollo/client";

export const REGISTER_FOR_EVENT = gql`
  mutation RegisterForEvent(
    $createRegistrationInput: CreateRegistrationInput!
  ) {
    registerForEvent(createRegistrationInput: $createRegistrationInput) {
      id
      status
      registrationType
      position
      paymentRequired
      paymentStatus
      amountDue
      currency
      specialRequests
      dietary
      emergencyContact
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
        shortDescription
        startDate
        endDate
        location
        address
        imageUrl
        category
        type
        price
        memberPrice
        maxParticipants
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
  }
`;

export const GET_MY_REGISTRATIONS = gql`
  query GetMyRegistrations {
    myRegistrations {
      id
      status
      registrationType
      position
      paymentRequired
      paymentStatus
      amountDue
      currency
      specialRequests
      dietary
      emergencyContact
      registeredAt
      confirmedAt
      cancelledAt
      event {
        id
        title
        shortDescription
        startDate
        endDate
        location
        address
        imageUrl
        category
        type
        price
        memberPrice
        maxParticipants
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
  }
`;

export const UPDATE_REGISTRATION = gql`
  mutation UpdateRegistration(
    $updateRegistrationInput: UpdateRegistrationInput!
  ) {
    updateRegistration(updateRegistrationInput: $updateRegistrationInput) {
      id
      status
      specialRequests
      dietary
      emergencyContact
      event {
        id
        registrationCount
        waitlistCount
        isRegistered
        canRegister
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
      cancelledAt
      event {
        id
        registrationCount
        waitlistCount
        isRegistered
        canRegister
      }
    }
  }
`;

export const GET_EVENT_REGISTRATIONS = gql`
  query GetEventRegistrations($eventId: ID!, $filter: RegistrationFilterInput) {
    eventRegistrations(eventId: $eventId, filter: $filter) {
      id
      status
      registrationType
      paymentRequired
      paymentStatus
      amountDue
      currency
      registeredAt
      confirmedAt
      user {
        id
        firstName
        lastName
        email
        esnCardVerified
      }
    }
  }
`;

export const GET_REGISTRATION_DETAILS = gql`
  query GetRegistrationDetails($id: ID!) {
    registration(id: $id) {
      id
      status
      registrationType
      position
      paymentRequired
      paymentStatus
      amountDue
      currency
      specialRequests
      dietary
      emergencyContact
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
  }
`;

import { gql } from "@apollo/client";

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      id
      title
      startDate
      endDate
      location
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

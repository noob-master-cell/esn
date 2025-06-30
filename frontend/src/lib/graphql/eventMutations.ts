import { gql } from "@apollo/client";

export const GET_ADMIN_EVENTS = gql`
  query GetAdminEvents {
    events {
      id
      title
      date
      venue
      capacity
      registrations {
        id
      }
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(createEventInput: $input) {
      id
      title
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, updateEventInput: $input) {
      id
      title
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_FEEDBACKS = gql`
  query GetFeedbacks {
    feedbacks {
      id
      message
      type
      createdAt
      user {
        id
        auth0Id
        firstName
        lastName
        avatar
      }
    }
  }
`;

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($message: String!, $type: FeedbackType!) {
    createFeedback(message: $message, type: $type) {
      id
      message
      type
      createdAt
      user {
        id
        auth0Id
        firstName
        lastName
        avatar
      }
    }
  }
`;

export const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($id: String!, $message: String!, $type: FeedbackType!) {
    updateFeedback(id: $id, message: $message, type: $type) {
      id
      message
      type
      createdAt
      user {
        id
        auth0Id
        firstName
        lastName
        avatar
      }
    }
  }
`;

export const DELETE_FEEDBACK = gql`
  mutation DeleteFeedback($id: String!) {
    deleteFeedback(id: $id) {
      id
    }
  }
`;
export const FEEDBACK_ADDED_SUBSCRIPTION = gql`
  subscription FeedbackAdded {
    feedbackAdded {
      id
      message
      type
      createdAt
      user {
        id
        auth0Id
        firstName
        lastName
        avatar
      }
    }
  }
`;

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
        firstName
        lastName
        avatar
      }
    }
  }
`;

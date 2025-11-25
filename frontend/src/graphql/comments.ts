import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($eventId: String!, $skip: Int, $take: Int) {
    comments(eventId: $eventId, skip: $skip, take: $take) {
      id
      content
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

export const CREATE_COMMENT = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      content
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

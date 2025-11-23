import { gql } from "@apollo/client";

// User fragment for reusability
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    avatar
    phone
    esnCardNumber
    esnCardVerified
    esnCardExpiry
    university
    chapter
    nationality
    emailVerified
    isActive
    role
    createdAt
    updatedAt
  }
`;

// Get current user query
export const ME_QUERY = gql`
  ${USER_FRAGMENT}
  query Me {
    me {
      ...UserFragment
    }
  }
`;

// Hello query (test query)
export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

// Health check query (no auth required)
export const HEALTH_CHECK_QUERY = gql`
  query HealthCheck {
    healthCheck
  }
`;

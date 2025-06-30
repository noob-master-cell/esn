// frontend/src/lib/graphql/users.ts
import { gql } from "@apollo/client";

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    myProfile {
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
  }
`;

// Legacy alias for backward compatibility
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
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
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($updateUserInput: UpdateUserInput!) {
    updateUserProfile(updateUserInput: $updateUserInput) {
      id
      email
      firstName
      lastName
      avatar
      phone
      esnCardNumber
      esnCardVerified
      university
      chapter
      nationality
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails($id: String!) {
    user(id: $id) {
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
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($filter: UserFilterInput) {
    users(filter: $filter) {
      id
      email
      firstName
      lastName
      avatar
      role
      isActive
      esnCardVerified
      university
      chapter
      createdAt
      updatedAt
    }
  }
`;
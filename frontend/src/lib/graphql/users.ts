// frontend/src/lib/graphql/users.ts
import { gql } from "@apollo/client";

// User profile update mutation
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($updateUserInput: UpdateUserInput!) {
    updateUserProfile(updateUserInput: $updateUserInput) {
      id
      email
      firstName
      lastName
      university
      nationality
      phone
      avatar
      updatedAt
    }
  }
`;

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
// TypeScript interfaces
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  university?: string;
  nationality?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  esnCardNumber?: string;
  esnCardVerified: boolean;
  esnCardExpiry?: string;
  university?: string;
  chapter?: string;
  nationality?: string;
  emailVerified: boolean;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

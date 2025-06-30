// frontend/src/lib/graphql/admin.ts
import { gql } from "@apollo/client";

export const ADMIN_DASHBOARD_STATS = gql`
  query AdminDashboardStats {
    adminStats {
      totalEvents
      activeUsers
      totalRegistrations
      totalRevenue
      eventsThisMonth
      registrationsThisMonth
      revenueThisMonth
    }
  }
`;

export const RECENT_EVENTS = gql`
  query RecentEvents($limit: Int) {
    events(filter: { limit: $limit }) {
      id
      title
      location
      startDate
      endDate
      status
      maxParticipants
      registrationCount
      imageUrl
      category
      type
      price
      memberPrice
      organizer {
        id
        firstName
        lastName
      }
    }
  }
`;

export const ALL_USERS = gql`
  query AllUsers($filter: UserFilterInput) {
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

export const ALL_REGISTRATIONS = gql`
  query AllRegistrations($filter: RegistrationFilterInput) {
    registrations(filter: $filter) {
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
      }
      event {
        id
        title
        startDate
        location
      }
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($userId: ID!) {
    deactivateUser(userId: $userId) {
      id
      isActive
    }
  }
`;

export const ACTIVATE_USER = gql`
  mutation ActivateUser($userId: ID!) {
    activateUser(userId: $userId) {
      id
      isActive
    }
  }
`;

export const UPDATE_REGISTRATION_STATUS = gql`
  mutation UpdateRegistrationStatus(
    $registrationId: ID!
    $status: RegistrationStatus!
  ) {
    updateRegistrationStatus(registrationId: $registrationId, status: $status) {
      id
      status
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
    }
  }
`;

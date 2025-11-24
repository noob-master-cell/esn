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

export const ALL_EVENTS_SIMPLE = gql`
  query AllEventsSimple {
    events(filter: { take: 200 }) {
      items {
        id
        title
        startDate
        location
      }
    }
  }
`;

export const RECENT_EVENTS = gql`
  query RecentEvents($limit: Int) {
    events(filter: { take: $limit }) {
      items {
        id
        title
        location
        startDate
        endDate
        status
        maxParticipants
        registrationCount
        images
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
      total
    }
  }
`;

export const ALL_USERS = gql`
  query AllUsers($filter: UsersFilterInput) {
    users(filter: $filter) {
      items {
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
      total
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
  mutation UpdateUserRole($userId: String!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
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

export const VERIFY_ESN_CARD = gql`
  mutation VerifyEsnCard($userId: String!, $verified: Boolean!) {
    verifyEsnCard(userId: $userId, verified: $verified) {
      id
      esnCardVerified
    }
  }
`;
export const DELETE_USER_ADMIN = gql`
  mutation AdminDeleteUser($userId: String!) {
    adminDeleteUser(userId: $userId)
  }
`;

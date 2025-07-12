// frontend/src/lib/graphql/payments.ts
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
  query GetPayments($filter: PaymentFilterInput) {
    payments(filter: $filter) {
      id
      amount
      status
      method
      description
      stripePaymentIntentId
      stripeSessionId
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
        esnCard {
          cardNumber
          expiryDate
        }
      }
      event {
        id
        title
        startDate
        price
        memberPrice
      }
      registration {
        id
        status
      }
    }
  }
`;

export const GET_PAYMENT_STATS = gql`
  query GetPaymentStats($dateRange: DateRangeInput) {
    paymentStats(dateRange: $dateRange) {
      totalRevenue
      totalTransactions
      pendingPayments
      failedPayments
      refundedAmount
      averageTransactionValue
      revenueGrowth
      transactionGrowth
      topPaymentMethods {
        method
        count
        totalAmount
      }
      dailyRevenue {
        date
        amount
        transactions
      }
    }
  }
`;

export const GET_PAYMENT_DETAILS = gql`
  query GetPaymentDetails($id: ID!) {
    payment(id: $id) {
      id
      amount
      status
      method
      description
      stripePaymentIntentId
      stripeSessionId
      createdAt
      updatedAt
      refundedAt
      refundReason
      user {
        id
        firstName
        lastName
        email
        phone
        esnCard {
          cardNumber
          expiryDate
          verificationStatus
        }
      }
      event {
        id
        title
        startDate
        endDate
        location
        price
        memberPrice
        organizer {
          firstName
          lastName
          email
        }
      }
      registration {
        id
        status
        registeredAt
        checkedInAt
      }
      refunds {
        id
        amount
        reason
        status
        processedAt
        processedBy {
          firstName
          lastName
        }
      }
    }
  }
`;

export const REFUND_PAYMENT = gql`
  mutation RefundPayment($id: ID!, $reason: String!) {
    refundPayment(id: $id, reason: $reason) {
      id
      status
      refundedAt
      refundReason
      refunds {
        id
        amount
        reason
        status
        processedAt
      }
    }
  }
`;

export const PROCESS_REFUND = gql`
  mutation ProcessRefund($paymentId: ID!, $amount: Int!, $reason: String!) {
    processRefund(paymentId: $paymentId, amount: $amount, reason: $reason) {
      id
      amount
      reason
      status
      processedAt
    }
  }
`;

export const EXPORT_PAYMENTS = gql`
  mutation ExportPayments($filter: PaymentFilterInput!) {
    exportPayments(filter: $filter) {
      downloadUrl
      filename
      recordCount
    }
  }
`;

export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
    updatePaymentStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const RESEND_PAYMENT_CONFIRMATION = gql`
  mutation ResendPaymentConfirmation($id: ID!) {
    resendPaymentConfirmation(id: $id) {
      success
      message
    }
  }
`;

export const GET_PAYMENT_RECONCILIATION = gql`
  query GetPaymentReconciliation($dateRange: DateRangeInput!) {
    paymentReconciliation(dateRange: $dateRange) {
      stripePayments {
        id
        amount
        status
        created
        description
      }
      systemPayments {
        id
        amount
        status
        createdAt
        stripePaymentIntentId
      }
      discrepancies {
        type
        stripeId
        systemId
        amount
        description
      }
      summary {
        totalStripeAmount
        totalSystemAmount
        difference
        reconciled
        needsReview
      }
    }
  }
`;

// Subscription for real-time payment updates
export const PAYMENT_UPDATES = gql`
  subscription PaymentUpdates {
    paymentUpdated {
      id
      status
      amount
      updatedAt
      user {
        firstName
        lastName
        email
      }
      event {
        title
      }
    }
  }
`;

// frontend/src/lib/graphql/analytics.ts
import { gql } from "@apollo/client";

export const GET_ANALYTICS_OVERVIEW = gql`
  query GetAnalyticsOverview($dateRange: DateRangeInput!) {
    analyticsOverview(dateRange: $dateRange) {
      totalRevenue
      revenueGrowth
      activeEvents
      eventGrowth
      totalRegistrations
      registrationGrowth
      activeUsers
      userGrowth

      eventsByCategory {
        name
        count
        revenue
        avgAttendance
      }

      topEvents {
        id
        title
        registrations
        revenue
        attendanceRate
      }

      recentActivity {
        type
        description
        timestamp
        userId
        eventId
      }
    }
  }
`;

export const GET_REVENUE_ANALYTICS = gql`
  query GetRevenueAnalytics($dateRange: DateRangeInput!) {
    revenueAnalytics(dateRange: $dateRange) {
      totalRevenue
      totalTransactions
      averageTransactionValue
      revenueGrowth
      transactionGrowth

      dailyRevenue {
        date
        amount
        transactions
        averageValue
      }

      paymentMethods {
        name
        amount
        count
        percentage
      }

      topEventsByRevenue {
        id
        title
        revenue
        participants
        averageTicketPrice
      }

      revenueByCategory {
        category
        amount
        percentage
        eventCount
      }

      memberVsNonMember {
        memberRevenue
        nonMemberRevenue
        memberPercentage
        discountAmount
      }
    }
  }
`;

export const GET_EVENT_ANALYTICS = gql`
  query GetEventAnalytics($dateRange: DateRangeInput!) {
    eventAnalytics(dateRange: $dateRange) {
      totalEvents
      publishedEvents
      draftEvents
      cancelledEvents
      completedEvents

      events {
        id
        title
        category
        status
        startDate
        registrations
        attendees
        capacity
        revenue
        price
        memberPrice
        attendanceRate
        registrationRate
      }

      categories {
        name
        count
        revenue
        avgAttendance
        avgPrice
        totalRegistrations
      }

      performanceMetrics {
        averageAttendanceRate
        averageRegistrationRate
        mostPopularCategory
        peakRegistrationDay
        averageEventDuration
      }

      eventTimeline {
        date
        eventsCreated
        eventsPublished
        eventsCancelled
      }

      capacityUtilization {
        category
        averageCapacity
        averageRegistrations
        utilizationRate
      }
    }
  }
`;

export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics($dateRange: DateRangeInput!) {
    userAnalytics(dateRange: $dateRange) {
      totalUsers
      activeUsers
      newUsers
      verifiedUsers
      esnCardHolders

      users {
        id
        firstName
        lastName
        email
        role
        isActive
        createdAt
        lastActive
        eventCount
        totalSpent
        esnCard {
          verified
          cardNumber
          expiryDate
        }
        university
        age
      }

      userGrowth {
        monthlyGrowth
        quarterlyGrowth
        yearlyGrowth
      }

      registrationTimeline {
        date
        count
        cumulativeCount
      }

      growthData {
        month
        newUsers
        totalUsers
        activeUsers
        churnRate
      }

      topUniversities {
        name
        count
        percentage
      }

      ageDistribution {
        ageRange
        count
        percentage
      }

      engagementLevels {
        level
        userCount
        percentage
        description
      }

      retention {
        retention30d
        retention90d
        retention1y
        averageLifetime
      }

      userActivity {
        dailyActiveUsers
        weeklyActiveUsers
        monthlyActiveUsers
        peakActiveTime
      }
    }
  }
`;

export const GET_SYSTEM_METRICS = gql`
  query GetSystemMetrics {
    systemMetrics {
      responseTime
      uptime
      errorRate
      throughput
      memoryUsage
      cpuUsage
      databaseConnections
      activeConnections

      apiEndpoints {
        endpoint
        averageResponseTime
        requestCount
        errorCount
        errorRate
        status
      }

      healthChecks {
        service
        status
        lastCheck
        responseTime
        details
      }

      performanceHistory {
        timestamp
        responseTime
        errorRate
        throughput
        memoryUsage
        cpuUsage
      }
    }
  }
`;

export const GET_ENGAGEMENT_ANALYTICS = gql`
  query GetEngagementAnalytics($dateRange: DateRangeInput!) {
    engagementAnalytics(dateRange: $dateRange) {
      overallEngagement {
        participationRate
        repeatAttendanceRate
        averageEventsPerUser
        userSatisfactionScore
      }

      eventEngagement {
        eventId
        title
        registrationRate
        attendanceRate
        cancellationRate
        waitlistConversionRate
        userRating
        reviewCount
      }

      userSegments {
        segment
        userCount
        averageEngagement
        retentionRate
        characteristics
      }

      engagementTrends {
        date
        registrations
        attendance
        cancellations
        newUsers
        returningUsers
      }

      categoryEngagement {
        category
        popularityScore
        averageAttendance
        userSatisfaction
        repeatRate
      }
    }
  }
`;

export const GET_FINANCIAL_ANALYTICS = gql`
  query GetFinancialAnalytics($dateRange: DateRangeInput!) {
    financialAnalytics(dateRange: $dateRange) {
      revenue {
        total
        growth
        forecast
        breakdown {
          eventRevenue
          membershipRevenue
          sponsorshipRevenue
          other
        }
      }

      expenses {
        total
        growth
        breakdown {
          eventCosts
          platformCosts
          marketingCosts
          operationalCosts
        }
      }

      profitability {
        grossProfit
        netProfit
        profitMargin
        breakEvenPoint
      }

      cashFlow {
        date
        inflow
        outflow
        netFlow
        runningBalance
      }

      membershipImpact {
        memberRevenue
        memberDiscount
        memberRetention
        conversionRate
      }

      forecastData {
        period
        projectedRevenue
        projectedExpenses
        projectedProfit
        confidence
      }
    }
  }
`;

export const EXPORT_ANALYTICS_DATA = gql`
  mutation ExportAnalyticsData(
    $type: AnalyticsExportType!
    $dateRange: DateRangeInput!
    $format: ExportFormat!
  ) {
    exportAnalyticsData(type: $type, dateRange: $dateRange, format: $format) {
      downloadUrl
      filename
      fileSize
      recordCount
      expiresAt
    }
  }
`;

export const CREATE_ANALYTICS_REPORT = gql`
  mutation CreateAnalyticsReport($input: AnalyticsReportInput!) {
    createAnalyticsReport(input: $input) {
      id
      title
      description
      type
      status
      createdAt
      downloadUrl
      scheduledFor
      recipients
    }
  }
`;

export const GET_ANALYTICS_REPORTS = gql`
  query GetAnalyticsReports($filter: AnalyticsReportFilter) {
    analyticsReports(filter: $filter) {
      id
      title
      description
      type
      status
      createdAt
      downloadUrl
      fileSize
      creator {
        firstName
        lastName
        email
      }
    }
  }
`;

// Subscriptions for real-time analytics
export const ANALYTICS_UPDATES = gql`
  subscription AnalyticsUpdates {
    analyticsUpdated {
      type
      data
      timestamp
    }
  }
`;

export const SYSTEM_METRICS_UPDATES = gql`
  subscription SystemMetricsUpdates {
    systemMetricsUpdated {
      responseTime
      uptime
      errorRate
      throughput
      activeUsers
      timestamp
    }
  }
`;

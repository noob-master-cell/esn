import { gql } from "@apollo/client";

export const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      general {
        organizationName
        organizationDescription
        contactEmail
        contactPhone
        website
        address
        timezone
        language
        currency
        dateFormat
        timeFormat
        logoUrl
        faviconUrl
        primaryColor
        secondaryColor
        maintenanceMode
        registrationEnabled
        publicEventsVisible
        maxEventsPerPage
        maxFileUploadSize
        allowGuestRegistration
      }

      email {
        smtpHost
        smtpPort
        smtpUsername
        smtpPassword
        smtpSecure
        fromEmail
        fromName
        replyToEmail
        emailEnabled
        welcomeEmailEnabled
        confirmationEmailEnabled
        reminderEmailEnabled
        marketingEmailEnabled
        emailTemplates {
          welcome
          confirmation
          reminder
          cancellation
          refund
        }
      }



      notifications {
        pushNotificationsEnabled
        emailNotificationsEnabled
        smsNotificationsEnabled
        webhookNotificationsEnabled
        slackIntegrationEnabled
        discordIntegrationEnabled
        notificationFrequency
        digestEmailEnabled
        digestEmailTime
        eventReminderDays
        registrationDeadlineReminder
        eventUpdateNotifications
        paymentNotifications
        systemAlerts
        webhookUrl
        slackWebhookUrl
        discordWebhookUrl
      }

      security {
        passwordMinLength
        passwordRequireUppercase
        passwordRequireLowercase
        passwordRequireNumbers
        passwordRequireSymbols
        passwordExpirationDays
        maxLoginAttempts
        lockoutDurationMinutes
        sessionTimeoutMinutes
        twoFactorEnabled
        twoFactorRequired
        emailVerificationRequired
        phoneVerificationEnabled
        allowedEmailDomains
        blockedEmailDomains
        ipWhitelist
        ipBlacklist
        rateLimitingEnabled
        maxRequestsPerMinute
        encryptionEnabled
        sslRequired
        corsEnabled
        allowedOrigins
        auditLoggingEnabled
        gdprCompliant
        cookieConsentRequired
        dataRetentionDays
      }

      system {
        environment
        version
        timezone
        locale
        debugMode
        maintenanceMode
        backupEnabled
        backupFrequency
        backupRetentionDays
        loggingLevel
        errorReportingEnabled
        performanceMonitoringEnabled
        analyticsEnabled
        cacheEnabled
        cacheTtl
        cdnEnabled
        cdnUrl
        fileUploadPath
        maxConcurrentUsers
        databasePoolSize
        redisEnabled
        redisUrl
        searchEnabled
        searchProvider
        imageOptimizationEnabled
        compressionEnabled
        httpsCertificateExpiry
        lastBackupDate
        systemHealth
      }
    }
  }
`;

export const UPDATE_SYSTEM_SETTINGS = gql`
  mutation UpdateSystemSettings($category: String!, $settings: JSON!) {
    updateSystemSettings(category: $category, settings: $settings) {
      success
      message
      updatedAt
    }
  }
`;

export const BACKUP_SYSTEM_DATA = gql`
  mutation BackupSystemData(
    $includeImages: Boolean
    $includeUserData: Boolean
  ) {
    backupSystemData(
      includeImages: $includeImages
      includeUserData: $includeUserData
    ) {
      id
      filename
      downloadUrl
      fileSize
      createdAt
      expiresAt
      includesImages
      includesUserData
    }
  }
`;

export const RESTORE_SYSTEM_DATA = gql`
  mutation RestoreSystemData($backupId: ID!) {
    restoreSystemData(backupId: $backupId) {
      success
      message
      restoredAt
    }
  }
`;

export const GET_SYSTEM_BACKUPS = gql`
  query GetSystemBackups($limit: Int) {
    systemBackups(limit: $limit) {
      id
      filename
      fileSize
      createdAt
      expiresAt
      includesImages
      includesUserData
      downloadUrl
      status
    }
  }
`;

export const TEST_EMAIL_CONFIGURATION = gql`
  mutation TestEmailConfiguration($testEmail: String!) {
    testEmailConfiguration(testEmail: $testEmail) {
      success
      message
      testSentAt
    }
  }
`;



export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($filter: AuditLogFilter, $limit: Int, $offset: Int) {
    auditLogs(filter: $filter, limit: $limit, offset: $offset) {
      id
      action
      resource
      resourceId
      userId
      userEmail
      ipAddress
      userAgent
      timestamp
      changes
      status
      metadata
    }
  }
`;

export const GET_SYSTEM_HEALTH = gql`
  query GetSystemHealth {
    systemHealth {
      overall
      database {
        status
        connectionCount
        responseTime
        lastCheck
      }
      redis {
        status
        memoryUsage
        responseTime
        lastCheck
      }
      email {
        status
        lastEmailSent
        queueSize
        lastCheck
      }

      storage {
        status
        availableSpace
        usedSpace
        lastCheck
      }
      api {
        responseTime
        errorRate
        requestCount
        lastCheck
      }
    }
  }
`;

export const CLEAR_CACHE = gql`
  mutation ClearCache($cacheType: CacheType) {
    clearCache(cacheType: $cacheType) {
      success
      message
      clearedAt
    }
  }
`;

export const SEND_TEST_NOTIFICATION = gql`
  mutation SendTestNotification($type: NotificationType!, $recipient: String!) {
    sendTestNotification(type: $type, recipient: $recipient) {
      success
      message
      sentAt
    }
  }
`;

export const GET_INTEGRATION_STATUS = gql`
  query GetIntegrationStatus {
    integrationStatus {

      email {
        configured
        lastEmailSent
        dailyLimit
        monthlyUsage
        status
      }
      slack {
        connected
        webhook
        lastNotification
        status
      }
      discord {
        connected
        webhook
        lastNotification
        status
      }
      analytics {
        enabled
        provider
        trackingId
        lastEvent
        status
      }
    }
  }
`;

export const VALIDATE_SETTINGS = gql`
  mutation ValidateSettings($category: String!, $settings: JSON!) {
    validateSettings(category: $category, settings: $settings) {
      valid
      errors {
        field
        message
        code
      }
      warnings {
        field
        message
        code
      }
    }
  }
`;

export const EXPORT_SETTINGS = gql`
  mutation ExportSettings($categories: [String!]) {
    exportSettings(categories: $categories) {
      downloadUrl
      filename
      fileSize
      categories
      exportedAt
    }
  }
`;

export const IMPORT_SETTINGS = gql`
  mutation ImportSettings($fileUrl: String!, $overwrite: Boolean) {
    importSettings(fileUrl: $fileUrl, overwrite: $overwrite) {
      success
      message
      importedCategories
      skippedCategories
      errors
      importedAt
    }
  }
`;

// Subscriptions for real-time settings updates
export const SETTINGS_UPDATED = gql`
  subscription SettingsUpdated {
    settingsUpdated {
      category
      updatedBy {
        id
        firstName
        lastName
        email
      }
      updatedAt
      changes
    }
  }
`;

export const SYSTEM_HEALTH_UPDATED = gql`
  subscription SystemHealthUpdated {
    systemHealthUpdated {
      overall
      component
      status
      message
      timestamp
    }
  }
`;

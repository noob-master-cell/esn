// IMPORTANT: Load environment variables first
import { config } from 'dotenv';
config(); // This must run before accessing process.env

// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentry() {
    if (!process.env.SENTRY_DSN) {
        console.warn('⚠️  SENTRY_DSN not configured - APM disabled');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',

        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

        // Profiling
        profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        integrations: [
            nodeProfilingIntegration(),
            // Add more integrations as needed
        ],

        // Error filtering
        beforeSend(event, hint) {
            // Don't send 404s or validation errors to Sentry
            if (event.exception) {
                const error = hint.originalException;
                if (error instanceof Error) {
                    if (
                        error.name === 'NotFoundException' ||
                        error.name === 'ValidationError' ||
                        error.message?.includes('ECONNREFUSED')
                    ) {
                        return null; // Don't send to Sentry
                    }
                }
            }
            return event;
        },

        // Context enrichment
        beforeBreadcrumb(breadcrumb) {
            // Filter out sensitive data from breadcrumbs
            if (breadcrumb.category === 'http' && breadcrumb.data) {
                delete breadcrumb.data.auth0Id;
                delete breadcrumb.data.password;
                delete breadcrumb.data.token;
            }
            return breadcrumb;
        },
    });

    console.log('✅ Sentry APM initialized');
}

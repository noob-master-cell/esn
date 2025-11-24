// frontend/src/utils/analytics.ts
import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
    if (!measurementId) {
        console.warn('GA4 Measurement ID not provided');
        return;
    }

    ReactGA.initialize(measurementId, {
        gaOptions: {
            send_page_view: false, // We'll send page views manually
        },
    });

    console.log('Google Analytics initialized');
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
    ReactGA.send({
        hitType: 'pageview',
        page: path,
        title: title || document.title,
    });
};

// Track custom events
export const trackEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
) => {
    ReactGA.event({
        category,
        action,
        label,
        value,
    });
};

// Predefined event tracking functions
export const analytics = {
    // Page views
    pageView: (path: string, title?: string) => {
        trackPageView(path, title);
    },

    // Event tracking
    eventView: (_eventId: string, eventTitle: string) => {
        trackEvent('Event', 'View', eventTitle, undefined);
    },

    eventRegister: (_eventId: string, eventTitle: string) => {
        trackEvent('Registration', 'Create', eventTitle, undefined);
    },

    eventUnregister: (_eventId: string, eventTitle: string) => {
        trackEvent('Registration', 'Cancel', eventTitle, undefined);
    },

    // User actions
    userLogin: (method: string) => {
        trackEvent('User', 'Login', method, undefined);
    },

    userSignup: (method: string) => {
        trackEvent('User', 'Signup', method, undefined);
    },

    profileUpdate: () => {
        trackEvent('User', 'Profile Update', undefined, undefined);
    },

    photoUpload: () => {
        trackEvent('User', 'Photo Upload', undefined, undefined);
    },

    // Search and filters
    search: (query: string) => {
        trackEvent('Search', 'Query', query, undefined);
    },

    filterApply: (_filterType: string, value: string) => {
        trackEvent('Filter', 'Apply', `${_filterType}: ${value}`, undefined);
    },

    // Admin actions
    adminEventCreate: (eventTitle: string) => {
        trackEvent('Admin', 'Event Create', eventTitle, undefined);
    },

    adminEventEdit: (eventTitle: string) => {
        trackEvent('Admin', 'Event Edit', eventTitle, undefined);
    },

    adminEventDelete: (eventTitle: string) => {
        trackEvent('Admin', 'Event Delete', eventTitle, undefined);
    },

    adminUserUpdate: (userId: string) => {
        trackEvent('Admin', 'User Update', userId, undefined);
    },

    // Export actions
    exportData: (dataType: string) => {
        trackEvent('Export', dataType, undefined, undefined);
    },

    // Errors
    error: (_errorType: string, errorMessage: string) => {
        trackEvent('Error', _errorType, errorMessage, undefined);
    },
};

export default analytics;

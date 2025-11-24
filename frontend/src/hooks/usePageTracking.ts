// frontend/src/hooks/usePageTracking.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

/**
 * Custom hook to automatically track page views
 * Use this in your App component to track all route changes
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        analytics.pageView(location.pathname + location.search);
    }, [location]);
};

export default usePageTracking;

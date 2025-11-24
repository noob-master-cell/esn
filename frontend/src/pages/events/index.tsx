import React, { useState, useEffect } from "react";
import ResponsiveCalendarView from "../../components/events/ResponsiveCalendarView";
import { useEvents } from "../../hooks/api/useEvents";
import { usePullToRefresh, useNetworkStatus } from "./hooks/useEventPageHooks";
import { PullToRefreshIndicator } from "./components/PullToRefreshIndicator";
import { OfflineIndicator } from "./components/OfflineIndicator";

const EventsPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [showOfflineMessage, setShowOfflineMessage] = useState(false);
    const isOnline = useNetworkStatus();

    const { events, loading, error, refetch } = useEvents({
        filter: {
            take: 100,
            orderBy: "startDate",
            orderDirection: "asc",
        },
    });

    // Handle pull-to-refresh
    const handleRefresh = async () => {
        try {
            await refetch();
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to refresh:", err);
        }
    };

    const { isPulling, pullDistance } = usePullToRefresh(handleRefresh);

    // Show offline message when network goes offline
    useEffect(() => {
        if (!isOnline) {
            setShowOfflineMessage(true);
            const timer = setTimeout(() => setShowOfflineMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <PullToRefreshIndicator isPulling={isPulling} pullDistance={pullDistance} />
            <OfflineIndicator show={showOfflineMessage} />

            <div className="container mx-auto px-4 py-4 flex justify-end">
                <a
                    href={`${(import.meta.env.VITE_API_URL || 'http://localhost:4000').replace('http', 'webcal')}/calendar/feed`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Subscribe to Calendar
                </a>
            </div>

            <ResponsiveCalendarView
                key={refreshKey}
                events={events}
                loading={loading}
                error={error}
            />

            {/* Bottom safe area for mobile */}
            <div className="h-safe-area-inset-bottom"></div>
        </div>
    );
};

export default EventsPage;

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



            <ResponsiveCalendarView
                key={refreshKey}
                events={events}
                loading={loading}
                error={error}
            />

            {/* Bottom safe area for mobile */}
            <div className="h-safe-area-inset-bottom"></div>
        </div >
    );
};

export default EventsPage;

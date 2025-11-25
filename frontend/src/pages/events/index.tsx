import React, { useState, useEffect } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
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

            <div className="fixed bottom-6 right-6 z-30">
                <a
                    href={`${(import.meta.env.VITE_API_URL || 'http://localhost:4000').replace('http', 'webcal')}/calendar/feed`}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium group"
                >
                    <CalendarDaysIcon className="w-5 h-5" />
                    <span className="font-medium">Subscribe</span>
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
        </div >
    );
};

export default EventsPage;

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

    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredEvents = events.filter((event: any) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <PullToRefreshIndicator isPulling={isPulling} pullDistance={pullDistance} />
            <OfflineIndicator show={showOfflineMessage} />

            {/* Search Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Search events by title or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <ResponsiveCalendarView
                key={refreshKey}
                events={filteredEvents}
                loading={loading}
                error={error}
            />

            {/* Bottom safe area for mobile */}
            <div className="h-safe-area-inset-bottom"></div>
        </div >
    );
};

export default EventsPage;

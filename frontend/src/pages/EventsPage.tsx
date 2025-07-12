import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "../lib/graphql/events";
import ResponsiveCalendarView from "../components/events/ResponsiveCalendarView";

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  location: string;
  address?: string;
  maxParticipants: number;
  registrationCount: number;
  price?: number;
  memberPrice?: number;
  imageUrl?: string;
  category: string;
  type: string;
  status: string;
  canRegister?: boolean;
  organizer: {
    firstName: string;
    lastName: string;
  };
}

// Pull-to-refresh hook for mobile
const usePullToRefresh = (onRefresh: () => void) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    let touchStartY = 0;
    let pulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        setStartY(touchStartY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && touchStartY > 0) {
        const currentY = e.touches[0].clientY;
        const pullDistance = Math.max(0, currentY - touchStartY);

        if (pullDistance > 10) {
          pulling = true;
          setIsPulling(true);
          setPullDistance(Math.min(pullDistance, 120));
        }
      }
    };

    const handleTouchEnd = () => {
      if (pulling && pullDistance > 80) {
        onRefresh();
      }

      setIsPulling(false);
      setPullDistance(0);
      setStartY(0);
      pulling = false;
      touchStartY = 0;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onRefresh, pullDistance]);

  return { isPulling, pullDistance };
};

// Network status hook
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

const EventsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const isOnline = useNetworkStatus();

  const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
    variables: {
      filter: {
        take: 100,
        orderBy: "startDate",
        orderDirection: "asc",
      },
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network", // Use cache but also fetch from network
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

  const events: Event[] = data?.events || [];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 flex justify-center items-center bg-blue-500 text-white z-50 transition-all duration-200"
          style={{
            height: `${Math.min(pullDistance, 60)}px`,
            opacity: pullDistance / 80,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full ${
                pullDistance > 80 ? "animate-spin" : ""
              }`}
            ></div>
            <span className="text-sm font-medium">
              {pullDistance > 80 ? "Release to refresh" : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      {/* Network status indicator */}
      {showOfflineMessage && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v18M3 12h18"
              />
            </svg>
            <span className="text-sm font-medium">
              You're offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}

      {/* Main calendar content */}
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

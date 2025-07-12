import React, { useState, useRef, useEffect } from "react";
import MobileCalendarHeader from "./MobileCalendarHeader";
import MobileEventsByDate from "./MobileEventsByDate";

export type CalendarViewType = "daily" | "weekly" | "monthly";

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  maxParticipants: number;
  registrationCount: number;
  location: string;
  type: string;
  status: string;
}

interface GroupedEvents {
  date: Date;
  dateString: string;
  events: Event[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface SwipeCalendarProps {
  events: Event[];
  loading?: boolean;
  error?: any;
}

// Touch gesture detection
interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

const SwipeCalendar: React.FC<SwipeCalendarProps> = ({
  events = [],
  loading = false,
  error,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>("weekly");
  const [touchState, setTouchState] = useState<TouchState | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple date utilities
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const isSameMonth = (date1: Date, date2: Date): boolean => {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addWeeks = (date: Date, weeks: number): Date => {
    return addDays(date, weeks * 7);
  };

  const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const startOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };

  const endOfWeek = (date: Date): Date => {
    const startWeek = startOfWeek(date);
    return new Date(
      startWeek.getFullYear(),
      startWeek.getMonth(),
      startWeek.getDate() + 6
    );
  };

  // Navigation handlers
  const handleNavigate = (direction: "prev" | "next") => {
    const multiplier = direction === "next" ? 1 : -1;

    switch (viewType) {
      case "daily":
        setCurrentDate(addDays(currentDate, multiplier));
        break;
      case "weekly":
        setCurrentDate(addWeeks(currentDate, multiplier));
        break;
      case "monthly":
        setCurrentDate(addMonths(currentDate, multiplier));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (newViewType: CalendarViewType) => {
    setViewType(newViewType);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    // Determine if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault(); // Prevent scrolling

      setTouchState((prev) =>
        prev
          ? {
              ...prev,
              currentX: touch.clientX,
              currentY: touch.clientY,
              isDragging: true,
            }
          : null
      );

      // Apply visual feedback
      const maxOffset = 100;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState || !touchState.isDragging) {
      setTouchState(null);
      setSwipeOffset(0);
      return;
    }

    const deltaX = touchState.currentX - touchState.startX;
    const threshold = 80; // Minimum swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleNavigate("prev"); // Swipe right = previous
      } else {
        handleNavigate("next"); // Swipe left = next
      }
    }

    setTouchState(null);
    setSwipeOffset(0);
  };

  // Filter and group events based on current view
  const groupedEvents: GroupedEvents[] = React.useMemo(() => {
    const sortedEvents = [...events].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    let filtered: Event[] = [];

    switch (viewType) {
      case "daily":
        filtered = sortedEvents.filter((event) => {
          const eventDate = new Date(event.startDate);
          return isSameDay(eventDate, currentDate);
        });
        break;

      case "weekly":
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        filtered = sortedEvents.filter((event) => {
          const eventDate = new Date(event.startDate);
          return eventDate >= weekStart && eventDate <= weekEnd;
        });
        break;

      case "monthly":
        filtered = sortedEvents.filter((event) => {
          const eventDate = new Date(event.startDate);
          return isSameMonth(eventDate, currentDate);
        });
        break;
    }

    // Group events by date
    const grouped: GroupedEvents[] = [];
    const groupMap = new Map<string, Event[]>();

    filtered.forEach((event) => {
      const eventDate = new Date(event.startDate);
      const dateKey = eventDate.toDateString();

      if (!groupMap.has(dateKey)) {
        groupMap.set(dateKey, []);
      }
      groupMap.get(dateKey)!.push(event);
    });

    Array.from(groupMap.entries()).forEach(([dateString, events]) => {
      const date = new Date(dateString);
      grouped.push({
        date,
        dateString: date.toISOString().split("T")[0],
        events,
        isToday: isToday(date),
        isCurrentMonth: isSameMonth(date, new Date()),
      });
    });

    return grouped.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, currentDate, viewType]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-sm mx-auto">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Unable to load events
          </h3>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <MobileCalendarHeader
        currentDate={currentDate}
        viewType={viewType}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      {/* Swipeable Content Area */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: touchState?.isDragging
            ? "none"
            : "transform 0.3s ease-out",
        }}
      >
        {/* Swipe Indicator */}
        {touchState?.isDragging && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
              {swipeOffset > 0 ? "← Previous" : "Next →"}
            </div>
          </div>
        )}

        {/* Events Content */}
        <div className="pt-4">
          <MobileEventsByDate
            groupedEvents={groupedEvents}
            viewType={viewType}
            emptyMessage={
              viewType === "daily"
                ? "No events scheduled for this day."
                : viewType === "weekly"
                ? "No events scheduled for this week."
                : "No events scheduled for this month."
            }
          />
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default SwipeCalendar;

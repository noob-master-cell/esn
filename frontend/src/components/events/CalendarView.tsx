import React, { useState, useMemo } from "react";
import CalendarHeader, { type CalendarViewType } from "./CalendarHeader";
import EventsByDate from "./EventsByDate";
import CalendarGrid from "./CalendarGrid";

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

interface CalendarViewProps {
  events: Event[];
  loading?: boolean;
  error?: any;
}

// Simple date utilities without date-fns dependency
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
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
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

const CalendarView: React.FC<CalendarViewProps> = ({
  events = [],
  loading = false,
  error,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>("monthly");

  // Navigation handlers
  const handleNavigate = (direction: "prev" | "next") => {
    const navigateDate = (
      currentDate: Date,
      direction: "prev" | "next",
      viewType: CalendarViewType
    ): Date => {
      const multiplier = direction === "next" ? 1 : -1;

      switch (viewType) {
        case "daily":
          return addDays(currentDate, multiplier);
        case "weekly":
          return addWeeks(currentDate, multiplier);
        case "monthly":
          return addMonths(currentDate, multiplier);
        default:
          return currentDate;
      }
    };

    setCurrentDate(navigateDate(currentDate, direction, viewType));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (newViewType: CalendarViewType) => {
    setViewType(newViewType);
  };

  // Filter and group events based on current view
  const { filteredEvents, groupedEvents } = useMemo(() => {
    // Sort events by date first
    const sortedEvents = [...events].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    let filtered: Event[] = [];

    // Filter events based on current view
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

    // Group events by date for list views
    const grouped: GroupedEvents[] = [];
    if (viewType !== "monthly") {
      const groupMap = new Map<string, Event[]>();

      filtered.forEach((event) => {
        const eventDate = new Date(event.startDate);
        const dateKey = eventDate.toDateString();

        if (!groupMap.has(dateKey)) {
          groupMap.set(dateKey, []);
        }
        groupMap.get(dateKey)!.push(event);
      });

      // Convert to array with additional date info
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

      // Sort grouped events by date
      grouped.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    return { filteredEvents: filtered, groupedEvents: grouped };
  }, [events, currentDate, viewType]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 text-center">
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Calendar Header */}
      <CalendarHeader
        currentDate={currentDate}
        viewType={viewType}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      {/* Calendar Content */}
      <div className="mt-6">
        {viewType === "monthly" ? (
          <CalendarGrid currentDate={currentDate} events={filteredEvents} />
        ) : (
          <EventsByDate
            groupedEvents={groupedEvents}
            emptyMessage={
              viewType === "daily"
                ? "No events scheduled for this day."
                : "No events scheduled for this week."
            }
          />
        )}
      </div>

      {/* Summary stats */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              {viewType === "monthly"
                ? `${filteredEvents.length} events this month`
                : viewType === "weekly"
                  ? `${filteredEvents.length} events this week`
                  : `${filteredEvents.length} events today`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

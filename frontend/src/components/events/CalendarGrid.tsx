import React from "react";
import { useNavigate } from "react-router-dom";

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

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
}

// Simple utility functions without date-fns dependency
const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

// Get category color for event dots
const getCategoryColor = (category: string): string => {
  const colors = {
    PARTY: "bg-purple-500",
    CULTURAL: "bg-pink-500",
    SPORTS: "bg-green-500",
    TRAVEL: "bg-blue-500",
    SOCIAL: "bg-orange-500",
    EDUCATIONAL: "bg-indigo-500",
    VOLUNTEER: "bg-yellow-500",
    NETWORKING: "bg-gray-500",
    WORKSHOP: "bg-red-500",
    CONFERENCE: "bg-teal-500",
    OTHER: "bg-gray-400",
  };
  return colors[category as keyof typeof colors] || colors.OTHER;
};

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events }) => {
  const navigate = useNavigate();

  // Get calendar grid dates
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days for the calendar grid
  const calendarDays: Date[] = [];
  let day = new Date(calendarStart);
  while (day <= calendarEnd) {
    calendarDays.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  // Group events by date for quick lookup
  const eventsByDate = new Map<string, Event[]>();
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const dateKey = eventDate.toDateString();
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, []);
    }
    eventsByDate.get(dateKey)!.push(event);
  });

  // Handle day click - navigate to daily view or first event
  const handleDayClick = (day: Date) => {
    const dayEvents = eventsByDate.get(day.toDateString()) || [];
    if (dayEvents.length === 1) {
      navigate(`/events/${dayEvents[0].id}`);
    } else if (dayEvents.length > 1) {
      // Could navigate to daily view with this date

    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = eventsByDate.get(day.toDateString()) || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                }`}
              onClick={() => handleDayClick(day)}
            >
              {/* Day number */}
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-medium ${isDayToday
                    ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    : isCurrentMonth
                      ? "text-gray-900"
                      : "text-gray-400"
                    }`}
                >
                  {day.getDate()}
                </span>

                {/* Event count badge */}
                {dayEvents.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Events preview */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, _eventIndex) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 text-xs p-1 rounded hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}`);
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${getCategoryColor(
                        event.category
                      )}`}
                    ></div>
                    <span className="truncate text-gray-700">
                      {event.title}
                    </span>
                  </div>
                ))}

                {/* Show more indicator */}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-4">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-600">Events available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;

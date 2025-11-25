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

// Get category color for event pills
const getCategoryStyles = (category: string) => {
  const styles = {
    PARTY: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
    CULTURAL: "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100",
    SPORTS: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100",
    TRAVEL: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
    SOCIAL: "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
    EDUCATIONAL: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
    VOLUNTEER: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100",
    NETWORKING: "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100",
    WORKSHOP: "bg-red-50 text-red-700 border-red-100 hover:bg-red-100",
    CONFERENCE: "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100",
    OTHER: "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100",
  };
  return styles[category as keyof typeof styles] || styles.OTHER;
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 bg-gray-100 gap-px">
        {calendarDays.map((day, index) => {
          const dayEvents = eventsByDate.get(day.toDateString()) || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={index}
              className={`min-h-[140px] p-2 bg-white relative group transition-all hover:z-10 ${!isCurrentMonth ? "bg-gray-50/30" : ""
                }`}
              onClick={() => handleDayClick(day)}
            >
              {/* Day number */}
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isDayToday
                      ? "bg-gray-900 text-white shadow-md"
                      : isCurrentMonth
                        ? "text-gray-700 group-hover:bg-gray-100"
                        : "text-gray-400"
                    }`}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Events list */}
              <div className="space-y-1.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`px-2 py-1 rounded-md border text-xs font-medium truncate cursor-pointer transition-all ${getCategoryStyles(
                      event.category
                    )}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}`);
                    }}
                  >
                    {event.title}
                  </div>
                ))}

                {/* Show more indicator */}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-400 font-medium pl-1 hover:text-gray-600">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;

import React from "react";
import EventCard from "./EventCard";

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

interface EventsByDateProps {
  groupedEvents: GroupedEvents[];
  emptyMessage?: string;
}

// Simple date formatting without external dependencies
const formatDateHeader = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const formatDateShort = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const EventsByDate: React.FC<EventsByDateProps> = ({
  groupedEvents,
  emptyMessage = "No events found for this period.",
}) => {
  if (groupedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No events scheduled
        </h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedEvents.map((group, groupIndex) => (
        <div key={group.dateString} className="space-y-4">
          {/* Date Header */}
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 ${group.isToday ? "text-blue-600" : "text-gray-900"
                }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`text-2xl font-bold ${group.isToday ? "text-blue-600" : "text-gray-900"
                    }`}
                >
                  {group.date.getDate()}
                </div>
                <div
                  className={`text-sm font-medium uppercase tracking-wide ${group.isToday ? "text-blue-600" : "text-gray-500"
                    }`}
                >
                  {formatDateShort(group.date).split(" ")[0]}
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <h2
                className={`text-lg font-semibold ${group.isToday ? "text-blue-600" : "text-gray-900"
                  }`}
              >
                {formatDateHeader(group.date)}
                {group.isToday && (
                  <span className="ml-2 text-sm font-normal text-blue-500">
                    Today
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500">
                {group.events.length} event
                {group.events.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Events Grid - Using your existing EventCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-16">
            {group.events.map((event, eventIndex) => (
              <div
                key={event.id}
                className="opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${groupIndex * 0.1 + eventIndex * 0.05}s`,
                  animationFillMode: "forwards",
                }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventsByDate;

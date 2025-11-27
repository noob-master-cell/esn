import React, { useState } from "react";
import MobileEventCard from "./MobileEventCard";

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

interface MobileEventsByDateProps {
  groupedEvents: GroupedEvents[];
  emptyMessage?: string;
  viewType: "daily" | "weekly" | "monthly";
}

// Simple date formatting



const MobileEventsByDate: React.FC<MobileEventsByDateProps> = ({
  groupedEvents,
  emptyMessage = "No events found for this period.",
  viewType,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  if (groupedEvents.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
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
        <p className="text-gray-600 text-center max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const toggleGroupExpansion = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  // For mobile, show more compact view when there are many events
  const shouldUseCompactView =
    viewType === "monthly" || groupedEvents.some((g) => g.events.length > 3);

  return (
    <div className="space-y-4 px-4 pb-6">
      {groupedEvents.map((group, groupIndex) => {
        const groupKey = group.dateString;
        const isExpanded = expandedGroups.has(groupKey);
        const showExpandButton = group.events.length > 3;
        const visibleEvents =
          showExpandButton && !isExpanded
            ? group.events.slice(0, 3)
            : group.events;

        return (
          <div key={groupKey} className="space-y-3">
            {/* Date Header - Minimalist */}
            <div className="flex items-center justify-between py-4 px-1">
              <div className="flex items-center gap-4">
                {/* Day Number */}
                <span className={`text-3xl font-bold ${group.isToday ? "text-cyan-600" : "text-gray-900"}`}>
                  {group.date.getDate()}
                </span>

                {/* Month and Weekday */}
                <div className="flex flex-col leading-none gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {group.date.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className={`text-sm font-bold uppercase ${group.isToday ? "text-cyan-600" : "text-gray-600"}`}>
                    {group.isToday ? "Today" : group.date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                </div>

                {/* Event Count Pill */}
                <div className="px-2 py-1 bg-gray-100 rounded-full text-[10px] font-medium text-gray-500 ml-2">
                  {group.events.length} event{group.events.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Expand/Collapse for many events */}
              {showExpandButton && (
                <button
                  onClick={() => toggleGroupExpansion(groupKey)}
                  className="flex items-center gap-1 text-sm text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation"
                >
                  {isExpanded ? "Show Less" : "Show All"}
                  <svg
                    className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {visibleEvents.map((event, eventIndex) => (
                <div
                  key={event.id}
                  className="opacity-0 animate-fadeInUp"
                  style={{
                    animationDelay: `${groupIndex * 100 + eventIndex * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <MobileEventCard
                    event={event}
                    variant={shouldUseCompactView ? "compact" : "full"}
                  />
                </div>
              ))}
            </div>

            {/* Show more events indicator */}
            {showExpandButton && !isExpanded && (
              <button
                onClick={() => toggleGroupExpansion(groupKey)}
                className="w-full py-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              >
                +{group.events.length - 3} more events
              </button>
            )}
          </div>
        );
      })}

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
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MobileEventsByDate;

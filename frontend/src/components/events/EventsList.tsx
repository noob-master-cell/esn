import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../hooks/api/useEvents";
import EventCard from "./EventCard"; // Updated import - now default export
import { transformEventToCardProps } from "./eventCardUtils"; // New import
import { EventsListSkeleton } from "./EventsListSkeleton";

// Wrapper component to handle click functionality with new EventCard
const ClickableEventCard: React.FC<{ event: any }> = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("🎯 Event card clicked:", event.title);
    navigate(`/events/${event.id}`);
  };

  // Transform event data to new EventCard props
  const cardProps = transformEventToCardProps(event);

  return (
    <div
      className="cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <EventCard {...cardProps} />
    </div>
  );
};

export const EventsList: React.FC = () => {
  const [sortBy, setSortBy] = useState("date");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const { events, loading, error, refetch } = useEvents({
    filter: {
      take: 20,
      orderBy: "startDate",
      orderDirection: "asc",
    },
  });

  if (loading) return <EventsListSkeleton />;

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
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
          <p className="text-red-700 text-sm mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 text-center">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No events found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Check back soon for exciting new events and activities!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Upcoming Events
            </h1>
            <p className="text-gray-600 mt-1">
              {events.length} event{events.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded-md transition-colors ${viewType === "grid"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                title="Grid view"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded-md transition-colors ${viewType === "list"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                title="List view"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors group"
              title="Refresh events"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      <div className="mb-8">
        {viewType === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <ClickableEventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: "forwards",
                }}
              >
                <ClickableEventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {events.length >= 20 && (
        <div className="text-center pb-8">
          <button className="bg-white border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
            Load More Events
            <svg
              className="w-4 h-4 ml-2 inline-block"
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
        </div>
      )}

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
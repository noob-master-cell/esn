// frontend/src/components/events/EventsList.tsx
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "../../lib/graphql/events";
import { EventCard } from "./EventCard";
import { EventsListSkeleton } from "./EventsListSkeleton";

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
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

export const EventsList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_EVENTS, {
    variables: {
      filter: {
        take: 20,
        orderBy: "startDate",
        orderDirection: "asc",
      },
    },
  });

  if (loading) return <EventsListSkeleton />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
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
          <p className="text-red-700 text-sm mb-4">
            There was an error loading the events. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const events: Event[] = data?.events || [];

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600 mb-6">
            There are currently no events available. Check back soon for
            exciting new events!
          </p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Create First Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Upcoming Events</h2>
          <p className="text-gray-600 mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Sort/View Options */}
        <div className="flex items-center gap-3">
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="date">Sort by Date</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="price">Sort by Price</option>
            <option value="category">Sort by Category</option>
          </select>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="p-2 rounded-md bg-white shadow-sm">
              <svg
                className="w-4 h-4 text-gray-600"
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
            <button className="p-2 rounded-md">
              <svg
                className="w-4 h-4 text-gray-400"
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
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Load More Button */}
      {events.length >= 20 && (
        <div className="text-center mt-12">
          <button className="bg-white border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Events
          </button>
        </div>
      )}
    </div>
  );
};

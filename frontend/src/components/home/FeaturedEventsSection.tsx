import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents {
    events(filter: { take: 20, orderBy: "startDate", orderDirection: "asc" }) {
      items {
        id
        title
        startDate
        location
        images
        category
        price
        registrationCount
        maxParticipants
      }
      total
    }
  }
`;

export const FeaturedEventsSection: React.FC = () => {
    const { data, loading, error } = useQuery(GET_UPCOMING_EVENTS);

    // Filter for upcoming events and take the first 7
    const upcomingEvents = data?.events?.items
        ?.filter((event: any) => new Date(event.startDate) > new Date())
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 7) || [];

    if (loading) return null;
    if (error) return null;
    if (upcomingEvents.length === 0) return null;

    // Duplicate events for seamless infinite scroll
    const duplicatedEvents = [...upcomingEvents, ...upcomingEvents];

    return (
        <section
            className="w-full bg-transparent py-12 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                </div>

                {/* Auto-scrolling Container */}
                <div className="relative">
                    <div className="flex gap-4 animate-scroll">
                        {duplicatedEvents.map((event: any, index: number) => (
                            <Link
                                key={`${event.id}-${index}`}
                                to={`/events/${event.id}`}
                                className="flex-shrink-0 w-[240px] group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative h-32 overflow-hidden">
                                    {event.images && event.images.length > 0 ? (
                                        <img
                                            src={event.images[0]}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate max-w-[100px]">
                                            {event.location.split(',')[0]}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-240px * ${upcomingEvents.length} - ${upcomingEvents.length * 16}px));
                    }
                }
                
                .animate-scroll {
                    animation: scroll ${upcomingEvents.length * 5}s linear infinite;
                }
                
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

// frontend/src/components/events/EventCard.tsx
import React from "react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    startDate: string;
    registrationDeadline?: string;
    location: string;
    maxParticipants: number;
    registrationCount: number;
    price?: number;
    memberPrice?: number;
    imageUrl?: string;
    category: string;
    type: string;
    status: string;
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Get event type icon
  const getEventTypeIcon = (category: string) => {
    const icons = {
      PARTY: "🎉",
      CULTURE: "🎭",
      SPORTS: "⚽",
      TRIP: "✈️",
      SOCIAL: "👥",
      EDUCATION: "📚",
      OTHER: "📅",
    };
    return icons[category as keyof typeof icons] || icons.OTHER;
  };

  // Check if registration is open
  const isRegistrationOpen = () => {
    if (!event.registrationDeadline) return true;
    return new Date() < new Date(event.registrationDeadline);
  };

  // Get registration deadline info
  const getRegistrationInfo = () => {
    if (!event.registrationDeadline) return null;
    const deadline = formatDateTime(event.registrationDeadline);
    return `Opens ${deadline.date} at ${deadline.time}`;
  };

  const startDateTime = formatDateTime(event.startDate);
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const registrationOpen = isRegistrationOpen();
  const eventImage =
    event.imageUrl ||
    `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop`;

  return (
    <div className="card bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 max-w-sm">
      <div className="p-3">
        <div className="flex gap-3">
          {/* Left: Event Image */}
          <div className="flex-shrink-0">
            <img
              src={eventImage}
              alt={event.title}
              className="w-[60px] h-[60px] object-cover rounded-lg"
            />
          </div>

          {/* Right: Event Details */}
          <div className="flex-1 min-w-0">
            {/* Header: Type Icon + Name */}
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg flex-shrink-0">
                {getEventTypeIcon(event.category)}
              </span>
              <h4 className="font-semibold text-sm text-black line-clamp-2 leading-tight">
                {event.title}
              </h4>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-1 mb-1">
              <svg
                className="w-3 h-3 text-gray-500"
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
              <span className="text-xs text-gray-600">
                {startDateTime.date} • {startDateTime.time}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-2">
              <svg
                className="w-3 h-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              <span className="text-xs text-gray-600 line-clamp-1">
                {event.location}
              </span>
            </div>

            {/* Bottom Row: Price + Spots + Status */}
            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex items-center">
                {event.type === "FREE" ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Free
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    {event.memberPrice &&
                    event.memberPrice < (event.price || 0) ? (
                      <>
                        <span className="text-sm font-bold text-blue-600">
                          €{event.memberPrice}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          €{event.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-black">
                        €{event.price}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Spots Left */}
              <div className="text-xs text-gray-600">
                {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
              </div>
            </div>

            {/* Registration Status */}
            <div className="mt-2">
              {registrationOpen ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700 font-medium">
                    Registration Open
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-orange-700 font-medium">
                    🔒 {getRegistrationInfo()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

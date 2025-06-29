// frontend/src/components/events/EventCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

// LocationPinIcon component for the location icon
const LocationPinIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
  </svg>
);

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
  const navigate = useNavigate();

  // Handle card click
  const handleCardClick = () => {
    console.log("🎯 Event card clicked:", event.title);
    navigate(`/events/${event.id}`);
  };

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
      CULTURAL: "🎭",
      SPORTS: "⚽",
      TRAVEL: "✈️",
      SOCIAL: "👥",
      EDUCATIONAL: "📚",
      VOLUNTEER: "🤝",
      NETWORKING: "🌐",
      WORKSHOP: "🔧",
      CONFERENCE: "🎤",
      OTHER: "📅",
    };
    return icons[category as keyof typeof icons] || icons.OTHER;
  };

  // Get category badge color
  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      PARTY: "bg-purple-100 text-purple-800",
      CULTURAL: "bg-pink-100 text-pink-800",
      SPORTS: "bg-green-100 text-green-800",
      TRAVEL: "bg-blue-100 text-blue-800",
      SOCIAL: "bg-orange-100 text-orange-800",
      EDUCATIONAL: "bg-indigo-100 text-indigo-800",
      VOLUNTEER: "bg-yellow-100 text-yellow-800",
      NETWORKING: "bg-gray-100 text-gray-800",
      WORKSHOP: "bg-red-100 text-red-800",
      CONFERENCE: "bg-teal-100 text-teal-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.OTHER;
  };

  // Handle view details click (prevent event bubbling)
  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/events/${event.id}`);
  };

  const startDateTime = formatDateTime(event.startDate);
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const eventImage =
    event.imageUrl ||
    `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop`;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg font-sans cursor-pointer h-full flex flex-col"
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
        {/* Image container with badges */}
        <div className="relative">
          <div 
            className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
            style={{ backgroundImage: `url("${eventImage}")` }}
          ></div>
          
          {/* Spots left badge */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {spotsLeft > 0 ? `${spotsLeft} SPOTS LEFT` : "FULL"}
          </div>
          
          {/* Category badge */}
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(event.category)}`}>
              {event.category}
            </span>
          </div>
          
          {/* Event type icon */}
          <div className="absolute bottom-2 left-2">
            <span className="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg text-lg">
              {getEventTypeIcon(event.category)}
            </span>
          </div>
        </div>
        
        {/* Card content area - flex-grow to fill remaining space */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex flex-col gap-2 flex-grow">
            {/* Title and details */}
            <div className="flex flex-col gap-1 flex-grow">
              <p className="text-[#111518] text-lg font-bold leading-tight line-clamp-2 min-h-[3.5rem]">
                {event.title}
              </p>
              <p className="text-[#60768a] text-sm font-normal leading-normal">
                {startDateTime.date} · {startDateTime.time}
              </p>
              <div className="flex items-center text-[#60768a] text-sm mt-1">
                <LocationPinIcon />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              
              {/* Price information */}
              <div className="mt-2">
                {event.type === "FREE" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Free
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[#111518] font-bold text-sm">
                      €{event.memberPrice || event.price}
                    </span>
                    {event.memberPrice && event.memberPrice < (event.price || 0) && (
                      <span className="text-[#60768a] text-xs line-through">
                        €{event.price}
                      </span>
                    )}
                    {event.memberPrice && (
                      <span className="text-green-600 text-xs font-medium">
                        ESN Price
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* View Details Button - always at bottom */}
            <div className="mt-auto pt-3">
              <button 
                onClick={handleViewDetailsClick}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-[#f0f2f5] text-[#111518] text-sm font-medium leading-normal w-full hover:bg-gray-200 transition-colors"
              >
                <span className="truncate">View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
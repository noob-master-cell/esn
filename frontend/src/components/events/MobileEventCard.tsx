import React from "react";
import { useNavigate } from "react-router-dom";

import { getEventIcon } from "./eventIcons";

interface MobileEventCardProps {
  event: {
    id: string;
    title: string;
    startDate: string;
    category: string;
    maxParticipants: number;
    registrationCount: number;
    location?: string;
    type?: string;
    status?: string;
    isUnlimited?: boolean;
  };
  variant?: "compact" | "full";
}

const MobileEventCard: React.FC<MobileEventCardProps> = ({
  event,
  variant = "full",
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  // Format time from startDate
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate spots left and determine category
  const spotsLeft = event.maxParticipants - event.registrationCount;

  const getSpotsInfo = (spotsLeft: number, maxParticipants: number, isUnlimited?: boolean) => {
    if (isUnlimited) {
      return {
        text: "Unlimited Spots",
        category: "many" as const,
        shortText: "Open",
      };
    }

    if (spotsLeft <= 0) {
      return { text: "Full", category: "full" as const, shortText: "Full" };
    }

    const percentageLeft = (spotsLeft / maxParticipants) * 100;

    if (percentageLeft > 50) {
      return {
        text: "Many Spots Left",
        category: "many" as const,
        shortText: `${spotsLeft} left`,
      };
    } else if (percentageLeft > 10) {
      return {
        text: "Few Spots Left",
        category: "few" as const,
        shortText: `${spotsLeft} left`,
      };
    } else {
      return {
        text: `${spotsLeft} Spots Left`,
        category: "few" as const,
        shortText: `${spotsLeft} left`,
      };
    }
  };

  // Get badge classes based on spots category
  const getBadgeClasses = (spotsCategory: "many" | "few" | "full") => {
    switch (spotsCategory) {
      case "many":
        return "bg-green-100 text-green-800";
      case "few":
        return "bg-yellow-100 text-yellow-800";
      case "full":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get icon and colors
  const { icon, bgColor, textColor } = getEventIcon(event.category);
  const spotsInfo = getSpotsInfo(spotsLeft, event.maxParticipants, event.isUnlimited);

  if (variant === "compact") {
    // Compact version for mobile list view
    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 active:bg-gray-50 transition-colors touch-manipulation"
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
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`p-2 rounded-lg ${bgColor} flex-shrink-0`}>
            {React.cloneElement(icon, { className: `w-5 h-5 ${textColor}` })}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">
                {formatTime(event.startDate)}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClasses(
                  spotsInfo.category
                )}`}
              >
                {spotsInfo.shortText}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Full version - mobile-optimized but larger
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-all duration-200 touch-manipulation w-full max-w-sm mx-auto"
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
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-2xl ${bgColor} flex-shrink-0`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${textColor}` })}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3 font-medium">
              {formatTime(event.startDate)}
            </p>

            {/* Location if available */}
            {event.location && (
              <div className="flex items-center gap-1.5 mb-4">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-gray-500 truncate">
                  {event.location}
                </span>
              </div>
            )}

            {/* Availability badge */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${getBadgeClasses(
                  spotsInfo.category
                )}`}
              >
                {spotsInfo.text}
              </span>

              {/* Quick action button */}
              <button className="text-xs text-blue-600 font-semibold py-1.5 px-3 rounded-full bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileEventCard;

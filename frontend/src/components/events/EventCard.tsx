import React from "react";
import { useNavigate } from "react-router-dom";

// Define the icon components inline to avoid import issues
const getEventIcon = (category: string) => {
  const icons = {
    PARTY: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
        />
      </svg>
    ),
    CULTURAL: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h5.25M9 15h3.75M9 18h1.25m3.5 0h3.75a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v6.75A2.25 2.25 0 0 0 4.5 18m.75-9h9.75M12 15.75h.008v.008H12v-.008Z"
        />
      </svg>
    ),
    SPORTS: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-16.5 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21"
        />
      </svg>
    ),
    TRAVEL: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    ),
    SOCIAL: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.985 2.985 0 01-.184 1.005L19.5 12.75a.75.75 0 01-.356.596L18 14.25l.75 1.5H18l-1.5-3L15 12l1.5-1.5H18l-.75 1.5L18 14.25l1.144-.894A.75.75 0 0119.5 12.75l1.316-1.995A2.985 2.985 0 0121 9.75a3 3 0 10-6 0z"
        />
      </svg>
    ),
    EDUCATIONAL: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
    DEFAULT: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z"
        />
      </svg>
    ),
  };

  return icons[category as keyof typeof icons] || icons.DEFAULT;
};

const getIconColors = (category: string) => {
  const colorMap = {
    PARTY: { bgColor: "bg-purple-100", textColor: "text-purple-500" },
    CULTURAL: { bgColor: "bg-pink-100", textColor: "text-pink-500" },
    SPORTS: { bgColor: "bg-green-100", textColor: "text-green-500" },
    TRAVEL: { bgColor: "bg-blue-100", textColor: "text-blue-500" },
    SOCIAL: { bgColor: "bg-orange-100", textColor: "text-orange-500" },
    EDUCATIONAL: { bgColor: "bg-indigo-100", textColor: "text-indigo-500" },
    VOLUNTEER: { bgColor: "bg-yellow-100", textColor: "text-yellow-500" },
    NETWORKING: { bgColor: "bg-gray-100", textColor: "text-gray-500" },
    WORKSHOP: { bgColor: "bg-red-100", textColor: "text-red-500" },
    CONFERENCE: { bgColor: "bg-teal-100", textColor: "text-teal-500" },
    OTHER: { bgColor: "bg-gray-100", textColor: "text-gray-500" },
  };

  return colorMap[category as keyof typeof colorMap] || colorMap.OTHER;
};

// Interface that works with your existing event structure
interface EventCardProps {
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
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("🎯 Event card clicked:", event.title);
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

  const getSpotsInfo = (spotsLeft: number, maxParticipants: number) => {
    if (spotsLeft <= 0) {
      return { text: "Full", category: "full" as const };
    }

    const percentageLeft = (spotsLeft / maxParticipants) * 100;

    if (percentageLeft > 50) {
      return { text: "Many Spots Left", category: "many" as const };
    } else if (percentageLeft > 10) {
      return { text: "Few Spots Left", category: "few" as const };
    } else {
      return { text: `${spotsLeft} Spots Left`, category: "few" as const };
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
  const icon = getEventIcon(event.category);
  const { bgColor, textColor } = getIconColors(event.category);
  const spotsInfo = getSpotsInfo(spotsLeft, event.maxParticipants);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden w-72 transform hover:scale-105 transition-transform duration-300 ease-in-out relative cursor-pointer"
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
      {/* Main content area with icon and text */}
      <div className="p-3 flex items-center h-full">
        {/* Icon container */}
        <div className="flex-shrink-0 mr-4">
          <div className={`p-3 rounded-full ${bgColor}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${textColor}` })}
          </div>
        </div>
        {/* Event details container */}
        <div className="flex-grow">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {event.title}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {formatTime(event.startDate)}
          </p>
        </div>
      </div>
      {/* Availability Badge (absolutely positioned) */}
      <div className="absolute bottom-2 right-2">
        <div
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block ${getBadgeClasses(
            spotsInfo.category
          )}`}
        >
          {spotsInfo.text}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MusicalNoteIcon,
  GlobeAltIcon,
  TrophyIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HandRaisedIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  MicrophoneIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

// Map categories to Heroicons
const getEventIcon = (category: string) => {
  const icons: Record<string, React.ElementType> = {
    PARTY: MusicalNoteIcon,
    CULTURAL: GlobeAltIcon,
    SPORTS: TrophyIcon,
    TRAVEL: PaperAirplaneIcon,
    SOCIAL: UserGroupIcon,
    EDUCATIONAL: AcademicCapIcon,
    VOLUNTEER: HandRaisedIcon,
    NETWORKING: BriefcaseIcon,
    WORKSHOP: WrenchScrewdriverIcon,
    CONFERENCE: MicrophoneIcon,
    OTHER: StarIcon,
  };

  return icons[category] || StarIcon;
};

const getCategoryColors = (category: string) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    PARTY: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    CULTURAL: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
    SPORTS: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    TRAVEL: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    SOCIAL: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    EDUCATIONAL: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
    VOLUNTEER: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    NETWORKING: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
    WORKSHOP: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    CONFERENCE: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
    OTHER: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  };

  return colorMap[category] || colorMap.OTHER;
};

/**
 * Props for the EventCard component.
 */
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
    isUnlimited?: boolean;
  };
}

/**
 * Card component for displaying event summary.
 * Shows title, category, time, location, and availability.
 * Navigates to event details on click.
 */
const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const spotsLeft = event.maxParticipants - event.registrationCount;
  const Icon = getEventIcon(event.category);
  const colors = getCategoryColors(event.category);

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative w-full h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm 
        hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer overflow-hidden
      `}
      role="button"
      tabIndex={0}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          {/* Category Icon & Badge */}
          <div className={`
            flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium 
            ${colors.bg} ${colors.text}
          `}>
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{event.category.toLowerCase()}</span>
          </div>

          {/* Time */}
          <div className="flex items-center text-gray-400 text-xs font-medium bg-gray-50 px-2 py-1 rounded-full">
            <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
            {formatTime(event.startDate)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors flex-grow">
          {event.title}
        </h3>

        {/* Location */}
        {event.location && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {/* Footer: Spots & Type */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-50">
          {/* Spots */}
          <div className="flex items-center gap-1.5">
            <UsersIcon className="w-4 h-4 text-gray-400" />
            <span className={`text-xs font-medium ${spotsLeft <= 5 && !event.isUnlimited ? 'text-red-500' : 'text-gray-600'}`}>
              {event.isUnlimited
                ? 'Unlimited spots'
                : spotsLeft <= 0
                  ? 'Full'
                  : `${spotsLeft} spots left`}
            </span>
          </div>

          {/* Type Badge */}
          {event.type && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
              {event.type === 'FREE' ? 'Free' : 'Paid'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

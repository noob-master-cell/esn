

// --- Icon Definitions ---
// Defining icons here makes them easy to manage and pass as props.

import {
  CalendarIcon as CalendarIconOutline,
  MusicalNoteIcon,
  TicketIcon as TicketIconOutline,
  TrophyIcon,
  GlobeAmericasIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

export const CalendarIcon = <CalendarIconOutline />;
export const MusicIcon = <MusicalNoteIcon />;
export const TicketIcon = <TicketIconOutline />;
export const SportsIcon = <TrophyIcon />;
export const TravelIcon = <GlobeAmericasIcon />;
export const SocialIcon = <UserGroupIcon />;
export const EducationalIcon = <AcademicCapIcon />;
export const VolunteerIcon = <HeartIcon />;
export const NetworkingIcon = <BriefcaseIcon />;
export const WorkshopIcon = <WrenchScrewdriverIcon />;
export const ConferenceIcon = <PresentationChartLineIcon />;

// Map event categories to their respective icons and colors
export const getEventIcon = (category: string) => {
  const iconMap = {
    PARTY: {
      icon: MusicIcon,
      bgColor: "bg-purple-100",
      textColor: "text-purple-500",
    },
    CULTURAL: {
      icon: TicketIcon,
      bgColor: "bg-pink-100",
      textColor: "text-pink-500",
    },
    SPORTS: {
      icon: SportsIcon,
      bgColor: "bg-green-100",
      textColor: "text-green-500",
    },
    TRAVEL: {
      icon: TravelIcon,
      bgColor: "bg-blue-100",
      textColor: "text-blue-500",
    },
    SOCIAL: {
      icon: SocialIcon,
      bgColor: "bg-orange-100",
      textColor: "text-orange-500",
    },
    EDUCATIONAL: {
      icon: EducationalIcon,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
    VOLUNTEER: {
      icon: SocialIcon,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-500",
    },
    NETWORKING: {
      icon: SocialIcon,
      bgColor: "bg-gray-100",
      textColor: "text-gray-500",
    },
    WORKSHOP: {
      icon: EducationalIcon,
      bgColor: "bg-red-100",
      textColor: "text-red-500",
    },
    CONFERENCE: {
      icon: CalendarIcon,
      bgColor: "bg-teal-100",
      textColor: "text-teal-500",
    },
    OTHER: {
      icon: CalendarIcon,
      bgColor: "bg-gray-100",
      textColor: "text-gray-500",
    },
  };

  return iconMap[category as keyof typeof iconMap] || iconMap.OTHER;
};

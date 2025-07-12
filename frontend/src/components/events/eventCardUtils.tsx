import { getEventIcon } from "./eventIcons";

// Interface for your existing event data structure
interface EventData {
  id: string;
  title: string;
  startDate: string;
  category: string;
  maxParticipants: number;
  registrationCount: number;
}

// Interface for EventCard props
interface EventCardProps {
  icon: React.ReactElement;
  iconBgColor: string;
  iconTextColor: string;
  eventName: string;
  eventTime: string;
  spotsLeft: string;
  spotsCategory: "many" | "few" | "full";
}

// Transform event data to EventCard props
export const transformEventToCardProps = (event: EventData): EventCardProps => {
  // Format time from startDate
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate spots left
  const spotsLeft = event.maxParticipants - event.registrationCount;

  // Determine spots category and text
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

  // Get icon configuration
  const iconConfig = getEventIcon(event.category);
  const spotsInfo = getSpotsInfo(spotsLeft, event.maxParticipants);

  return {
    icon: iconConfig.icon,
    iconBgColor: iconConfig.bgColor,
    iconTextColor: iconConfig.textColor,
    eventName: event.title,
    eventTime: formatTime(event.startDate),
    spotsLeft: spotsInfo.text,
    spotsCategory: spotsInfo.category,
  };
};

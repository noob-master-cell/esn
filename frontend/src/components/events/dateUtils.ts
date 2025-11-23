// Date utilities for calendar functionality
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  parseISO,
} from "date-fns";

export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  maxParticipants: number;
  registrationCount: number;
  location: string;
  type: string;
  status: string;
}

export interface GroupedEvents {
  date: Date;
  dateString: string;
  events: Event[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

// Group events by date
export const groupEventsByDate = (events: Event[]): GroupedEvents[] => {
  // First, sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Group by date
  const grouped = new Map<string, Event[]>();

  sortedEvents.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const dateKey = format(eventDate, "yyyy-MM-dd");

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  });

  // Convert to array with additional date info
  return Array.from(grouped.entries()).map(([dateString, events]) => {
    const date = parseISO(dateString);
    return {
      date,
      dateString,
      events,
      isToday: isToday(date),
      isCurrentMonth: isSameMonth(date, new Date()),
    };
  });
};

// Format date for display
export const formatDateHeader = (date: Date): string => {
  return format(date, "EEEE, MMMM d, yyyy");
};

export const formatDateShort = (date: Date): string => {
  return format(date, "MMM d");
};

export const formatDateLong = (date: Date): string => {
  return format(date, "MMMM yyyy");
};

// Calendar navigation helpers
export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
};

export const getMonthRange = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
};

export const getDaysInRange = (start: Date, end: Date): Date[] => {
  return eachDayOfInterval({ start, end });
};

// Navigation functions
export const navigateDate = (
  currentDate: Date,
  direction: "prev" | "next",
  viewType: "daily" | "weekly" | "monthly"
): Date => {
  switch (viewType) {
    case "daily":
      return direction === "next"
        ? addDays(currentDate, 1)
        : subDays(currentDate, 1);
    case "weekly":
      return direction === "next"
        ? addWeeks(currentDate, 1)
        : subWeeks(currentDate, 1);
    case "monthly":
      return direction === "next"
        ? addMonths(currentDate, 1)
        : subMonths(currentDate, 1);
    default:
      return currentDate;
  }
};

// Filter events by date range
export const filterEventsByDateRange = (
  events: Event[],
  start: Date,
  end: Date
): Event[] => {
  return events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return eventDate >= start && eventDate <= end;
  });
};

// Get events for specific day
export const getEventsForDay = (events: Event[], day: Date): Event[] => {
  return events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return isSameDay(eventDate, day);
  });
};

import React, { useState, useEffect } from "react";
import CalendarView from "./CalendarView"; // Desktop version
import SwipeCalendar from "./SwipeCalendar"; // Mobile version

interface Event {
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

interface ResponsiveCalendarViewProps {
  events: Event[];
  loading?: boolean;
  error?: any;
}

// Hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

// Hook to detect if device supports touch
const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
};

const ResponsiveCalendarView: React.FC<ResponsiveCalendarViewProps> = ({
  events,
  loading,
  error,
}) => {
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();

  // Use mobile version for small screens or touch devices
  const shouldUseMobileVersion = isMobile || isTouch;

  if (shouldUseMobileVersion) {
    return <SwipeCalendar events={events} loading={loading} error={error} />;
  }

  return <CalendarView events={events} loading={loading} error={error} />;
};

export default ResponsiveCalendarView;

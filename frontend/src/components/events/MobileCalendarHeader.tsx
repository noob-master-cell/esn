import React, { useState } from "react";

export type CalendarViewType = "daily" | "weekly" | "monthly";

interface MobileCalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onToday: () => void;
}

const MobileCalendarHeader: React.FC<MobileCalendarHeaderProps> = ({
  currentDate,
  viewType,
  onViewChange,
  onNavigate,
  onToday,
}) => {
  const [showViewSelector, setShowViewSelector] = useState(false);

  // Format display title based on view type
  const getDisplayTitle = () => {
    switch (viewType) {
      case "daily":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      case "weekly":
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        const diff =
          currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.getDate()}`;
      case "monthly":
        return currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      default:
        return "";
    }
  };

  const getViewDisplayName = (view: CalendarViewType) => {
    switch (view) {
      case "daily":
        return "Day";
      case "weekly":
        return "Week";
      case "monthly":
        return "Month";
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header */}
      <div className="flex items-center justify-between p-4">
        {/* Left: Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("prev")}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        {/* Center: Title (tappable to go to today) */}
        <button
          onClick={onToday}
          className="flex-1 text-center px-4 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
        >
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {getDisplayTitle()}
          </h1>
          <p className="text-xs text-gray-500">Tap for today</p>
        </button>

        {/* Right: View Selector */}
        <div className="relative">
          <button
            onClick={() => setShowViewSelector(!showViewSelector)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
          >
            {getViewDisplayName(viewType)}
            <svg
              className={`w-4 h-4 transform transition-transform ${
                showViewSelector ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showViewSelector && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {(["daily", "weekly", "monthly"] as CalendarViewType[]).map(
                (view) => (
                  <button
                    key={view}
                    onClick={() => {
                      onViewChange(view);
                      setShowViewSelector(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors touch-manipulation ${
                      viewType === view
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    {getViewDisplayName(view)}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optional: Quick Date Navigation for Mobile */}
      {viewType === "monthly" && (
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const date = new Date(currentDate);
              date.setMonth(date.getMonth() + offset);
              const isCurrentMonth = offset === 0;

              return (
                <button
                  key={offset}
                  onClick={() => {
                    if (offset !== 0) {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() + offset);
                      // You'd need to update the calendar to this date
                    }
                  }}
                  className={`flex-shrink-0 px-3 py-1 text-xs rounded-full transition-colors touch-manipulation ${
                    isCurrentMonth
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showViewSelector && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowViewSelector(false)}
        />
      )}
    </div>
  );
};

export default MobileCalendarHeader;

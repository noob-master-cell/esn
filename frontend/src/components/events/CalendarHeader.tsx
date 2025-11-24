import React from "react";

export type CalendarViewType = "daily" | "weekly" | "monthly";

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewType,
  onViewChange,
  onNavigate,
  onToday,
}) => {
  // Format display title based on view type
  const getDisplayTitle = () => {


    switch (viewType) {
      case "daily":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "weekly":
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        const diff =
          currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
        startOfWeek.setDate(diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "monthly":
        return currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4 sm:mb-6">
      {/* Mobile: Stack everything vertically */}
      <div className="block sm:hidden">
        {/* Mobile title */}
        <h1 className="text-xl font-bold text-gray-900 text-center mb-4">
          {getDisplayTitle()}
        </h1>

        {/* Mobile navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => onNavigate("prev")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Previous"
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
            onClick={onToday}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Next"
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

        {/* Mobile view toggle - full width */}
        <div className="grid grid-cols-3 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange("daily")}
            className={`py-2 text-sm font-medium rounded-md transition-colors ${viewType === "daily"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange("weekly")}
            className={`py-2 text-sm font-medium rounded-md transition-colors ${viewType === "weekly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange("monthly")}
            className={`py-2 text-sm font-medium rounded-md transition-colors ${viewType === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Desktop: Original horizontal layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {/* Left: Title and Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("prev")}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Previous"
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
              onClick={onToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>

            <button
              onClick={() => onNavigate("next")}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Next"
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

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {getDisplayTitle()}
          </h1>
        </div>

        {/* Right: View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange("daily")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewType === "daily"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange("weekly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewType === "weekly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewType === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Month
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;

import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

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
    <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("prev")}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all touch-manipulation"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all touch-manipulation"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Center: Title (tappable to go to today) */}
        <button
          onClick={onToday}
          className="flex-1 text-center px-2 active:scale-95 transition-transform touch-manipulation"
        >
          <h1 className="text-lg font-bold text-gray-900 truncate leading-tight">
            {getDisplayTitle()}
          </h1>
          <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider mt-0.5">Tap for today</p>
        </button>

        {/* Right: View Selector */}
        <div className="relative">
          <button
            onClick={() => setShowViewSelector(!showViewSelector)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
          >
            {getViewDisplayName(viewType)}
            <ChevronDownIcon
              className={`w-4 h-4 transform transition-transform duration-200 ${showViewSelector ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showViewSelector && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowViewSelector(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {(["daily", "weekly", "monthly"] as CalendarViewType[]).map(
                  (view) => (
                    <button
                      key={view}
                      onClick={() => {
                        onViewChange(view);
                        setShowViewSelector(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors touch-manipulation flex items-center justify-between ${viewType === view
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        }`}
                    >
                      {getViewDisplayName(view)}
                      {viewType === view && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Date Navigation for Monthly View */}
      {viewType === "monthly" && (
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const date = new Date(currentDate);
              date.setMonth(date.getMonth() + offset);
              const isCurrentMonth = offset === 0;

              return (
                <button
                  key={offset}
                  onClick={() => {
                    if (offset !== 0) {
                      // Logic to navigate would be handled by parent, 
                      // but for now we just show visual state
                      if (offset < 0) onNavigate("prev");
                      if (offset > 0) onNavigate("next");
                    }
                  }}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all touch-manipulation ${isCurrentMonth
                      ? "bg-gray-900 text-white shadow-md"
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
    </div>
  );
};

export default MobileCalendarHeader;

import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ListBulletIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";

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
    <div className="flex flex-col gap-6 mb-8">
      {/* Mobile: Stack everything vertically */}
      <div className="block sm:hidden">
        {/* Mobile title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6 tracking-tight">
          {getDisplayTitle()}
        </h1>

        {/* Mobile navigation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => onNavigate("prev")}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            title="Previous"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={onToday}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
          >
            Today
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            title="Next"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile view toggle - full width */}
        <div className="grid grid-cols-3 bg-gray-100/80 p-1.5 rounded-2xl">
          <button
            onClick={() => onViewChange("daily")}
            className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${viewType === "daily"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange("weekly")}
            className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${viewType === "weekly"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange("monthly")}
            className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${viewType === "monthly"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Desktop: Original horizontal layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {/* Left: Title and Navigation */}
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            {getDisplayTitle()}
          </h1>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate("prev")}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              title="Previous"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <button
              onClick={onToday}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              Today
            </button>

            <button
              onClick={() => onNavigate("next")}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              title="Next"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewChange("daily")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewType === "daily"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            <ListBulletIcon className="w-4 h-4" />
            Day
          </button>
          <button
            onClick={() => onViewChange("weekly")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewType === "weekly"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            <Squares2X2Icon className="w-4 h-4" />
            Week
          </button>
          <button
            onClick={() => onViewChange("monthly")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewType === "monthly"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Month
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;

// frontend/src/components/admin/RegistrationFilters.tsx
import React from "react";
import { useAllEventsSimple } from "../../hooks/api/useAdmin";
import { Icon } from "../common/Icon";

interface RegistrationFiltersProps {
  filters: {
    status?: string;
    paymentStatus?: string;
    eventId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  onFilterChange: (filters: any) => void;
}

export const RegistrationFilters: React.FC<RegistrationFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { events } = useAllEventsSimple();
  const handleInputChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value);
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Search - Always Visible */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search registrations..."
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Icon name="search" size="sm" />
          </div>
        </div>

        {/* Filter Toggle & Clear */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isExpanded || hasActiveFilters
              ? "bg-cyan-50 text-cyan-700 border border-cyan-100"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-[10px] text-white">
                {Object.keys(filters).filter(k => k !== 'search' && filters[k as keyof typeof filters]).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ATTENDED">Attended</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>

          {/* Event Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Event
            </label>
            <select
              value={filters.eventId || ""}
              onChange={(e) => handleInputChange("eventId", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Events</option>
              {events.map((event: any) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => handleInputChange("dateFrom", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => handleInputChange("dateTo", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// frontend/src/components/admin/EventFilters.tsx
import React from "react";

interface EventFiltersProps {
  filters: {
    status?: string;
    category?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  onFilterChange: (filters: any) => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search - Always Visible */}
        <div className="relative w-full lg:max-w-md">
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Toggle & Active Count */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
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

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          )}
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
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="REGISTRATION_CLOSED">Registration Closed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Categories</option>
              <option value="SOCIAL">Social</option>
              <option value="CULTURAL">Cultural</option>
              <option value="EDUCATIONAL">Educational</option>
              <option value="SPORTS">Sports</option>
              <option value="TRAVEL">Travel</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="NETWORKING">Networking</option>
              <option value="PARTY">Party</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="CONFERENCE">Conference</option>
              <option value="OTHER">Other</option>
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

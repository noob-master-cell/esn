// frontend/src/components/admin/RegistrationFilters.tsx
import React from "react";

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Registrations
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user name, email, event..."
              value={filters.search || ""}
              onChange={(e) => handleInputChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
        </div>

        {/* Status Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Payment Status Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus || ""}
            onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Event Filter */}
        <div className="min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event ID
          </label>
          <input
            type="text"
            placeholder="Filter by event ID"
            value={filters.eventId || ""}
            onChange={(e) => handleInputChange("eventId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date From */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date To */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: {filters.search}
              <button
                onClick={() => handleInputChange("search", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Status: {filters.status}
              <button
                onClick={() => handleInputChange("status", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.paymentStatus && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Payment: {filters.paymentStatus}
              <button
                onClick={() => handleInputChange("paymentStatus", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.eventId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Event: {filters.eventId}
              <button
                onClick={() => handleInputChange("eventId", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-yellow-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              From: {filters.dateFrom}
              <button
                onClick={() => handleInputChange("dateFrom", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.dateTo && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              To: {filters.dateTo}
              <button
                onClick={() => handleInputChange("dateTo", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-red-200"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// frontend/src/components/admin/UserFilters.tsx
import React from "react";

interface UserFiltersProps {
  filters: {
    role?: string;
    isActive?: boolean;
    search?: string;
    esnCardVerified?: boolean;
    university?: string;
  };
  onFilterChange: (filters: any) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleInputChange = (key: string, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email..."
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

        {/* Role Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={filters.role || ""}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ORGANIZER">Organizer</option>
            <option value="ADMIN">Admin</option>

          </select>
        </div>

        {/* Status Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={
              filters.isActive === undefined ? "" : filters.isActive.toString()
            }
            onChange={(e) =>
              handleInputChange(
                "isActive",
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Users</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* ESN Card Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ESN Card
          </label>
          <select
            value={
              filters.esnCardVerified === undefined
                ? ""
                : filters.esnCardVerified.toString()
            }
            onChange={(e) =>
              handleInputChange(
                "esnCardVerified",
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Cards</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>

        {/* University Filter */}
        <div className="min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University
          </label>
          <input
            type="text"
            placeholder="Filter by university"
            value={filters.university || ""}
            onChange={(e) => handleInputChange("university", e.target.value)}
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
          {filters.role && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Role: {filters.role}
              <button
                onClick={() => handleInputChange("role", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.isActive !== undefined && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Status: {filters.isActive ? "Active" : "Inactive"}
              <button
                onClick={() => handleInputChange("isActive", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.esnCardVerified !== undefined && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ESN Card: {filters.esnCardVerified ? "Verified" : "Not Verified"}
              <button
                onClick={() => handleInputChange("esnCardVerified", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-yellow-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.university && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              University: {filters.university}
              <button
                onClick={() => handleInputChange("university", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200"
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

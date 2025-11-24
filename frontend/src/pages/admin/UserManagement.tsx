// frontend/src/pages/admin/UserManagement.tsx
import React, { useState } from "react";
import {
  useAdminUsers,
  useVerifyEsnCard,
} from "../../hooks/api/useAdmin";
import { Button } from "../../components/ui/Button";
import { Pagination } from "../../components/ui/Pagination";
import { Badge } from "../../components/ui/Badge";

interface UserFilters {
  search: string;
  role: string;
  status: string;
  esnCardStatus: string;
  university: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  esnCardNumber: string | null;
  esnCardVerified: boolean;
  registrationsCount: number;
  lastLogin: string;
  university?: string;
  nationality?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
    esnCardStatus: "all",
    university: "",
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState<User | null>(null);
  const [showESNCardModal, setShowESNCardModal] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { users, total, page, setPage, pageSize, refetch } = useAdminUsers({
    filter: {
      search: filters.search || undefined,
      role: filters.role !== "all" ? filters.role : undefined,
      isActive:
        filters.status === "active"
          ? true
          : filters.status === "inactive"
            ? false
            : undefined,
      isEsnCardVerified:
        filters.esnCardStatus === "verified"
          ? true
          : filters.esnCardStatus === "unverified"
            ? false
            : undefined,
      university: filters.university || undefined,
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  const { verifyEsnCard } = useVerifyEsnCard();

  const filteredUsers = users || [];

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user: User) => user.id));
    }
  };

  const handleVerifyESNCard = async (userId: string, cardNumber: string) => {
    try {
      await verifyEsnCard({ variables: { userId, cardNumber } });
      setSuccessMessage("ESN card verified successfully");
      setShowESNCardModal(null);
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to verify ESN card"
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleToggleUserStatus = async (_userId: string, _isActive: boolean) => {
    try {
      // TODO: Implement user activation/deactivation mutations
      setErrorMessage("User activation/deactivation is not yet implemented");
      setTimeout(() => setErrorMessage(""), 5000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update user status"
      );
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { variant: "neutral" | "info" | "primary" | "error"; label: string }> = {
      USER: { variant: "neutral", label: "User" },
      ORGANIZER: { variant: "info", label: "Organizer" },
      ADMIN: { variant: "primary", label: "Admin" },
      SUPER_ADMIN: { variant: "error", label: "Super Admin" },
    };

    const config = roleConfig[role] || roleConfig.USER;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (isActive: boolean, emailVerified: boolean) => {
    if (!isActive) {
      return <Badge variant="error">Inactive</Badge>;
    }
    if (!emailVerified) {
      return <Badge variant="warning">Unverified</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  const getESNCardBadge = (
    esnCardNumber: string | null,
    esnCardVerified: boolean
  ) => {
    if (!esnCardNumber) {
      return <Badge variant="neutral">No Card</Badge>;
    }
    if (!esnCardVerified) {
      return <Badge variant="warning">Pending</Badge>;
    }
    return <Badge variant="success">Verified</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {successMessage}
          <button
            onClick={() => setSuccessMessage("")}
            className="ml-2 float-right text-green-900"
          >
            &times;
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {errorMessage}
          <button
            onClick={() => setErrorMessage("")}
            className="ml-2 float-right text-red-900"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage user accounts and permissions ({filteredUsers.length} users)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => window.open("/admin/users/export", "_blank")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Users
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Invite User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Name or email..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="USER">User</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ESN Card
            </label>
            <select
              value={filters.esnCardStatus}
              onChange={(e) =>
                setFilters({ ...filters, esnCardStatus: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cards</option>
              <option value="verified">Verified</option>
              <option value="unverified">Pending</option>
              <option value="none">No Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>
            <input
              type="text"
              placeholder="University name..."
              value={filters.university}
              onChange={(e) =>
                setFilters({ ...filters, university: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Send Email
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Change Role
              </button>
              <button
                className="px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ESN Card
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Events
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {user.nationality}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.university || "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive, user.emailVerified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getESNCardBadge(
                          user.esnCardNumber,
                          user.esnCardVerified
                        )}
                        {user.esnCardNumber && !user.esnCardVerified && (
                          <button
                            onClick={() => setShowESNCardModal(user)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">
                        {user.registrationsCount}
                      </span>
                      <span className="text-gray-500"> events</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowUserModal(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            window.open(`mailto:${user.email}`, "_blank")
                          }
                          className="text-gray-600 hover:text-gray-800"
                          title="Send Email"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleToggleUserStatus(user.id, user.isActive)
                          }
                          className={
                            user.isActive
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }
                          title={
                            user.isActive ? "Deactivate User" : "Activate User"
                          }
                        >
                          {user.isActive ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={handlePageChange}
          totalItems={total}
          itemsPerPage={pageSize}
        />
      </div>

      {/* User Details Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowUserModal(null)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    User Details
                  </h3>
                  <button
                    onClick={() => setShowUserModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Profile */}
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {showUserModal.firstName[0]}
                    {showUserModal.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {showUserModal.firstName} {showUserModal.lastName}
                    </h4>
                    <p className="text-gray-600">{showUserModal.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(showUserModal.role)}
                      {getStatusBadge(
                        showUserModal.isActive,
                        showUserModal.emailVerified
                      )}
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      Personal Information
                    </h5>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">University:</dt>
                        <dd className="text-gray-900">
                          {showUserModal.university || "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Nationality:</dt>
                        <dd className="text-gray-900">
                          {showUserModal.nationality || "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Member since:</dt>
                        <dd className="text-gray-900">
                          {new Date(showUserModal.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      ESN Information
                    </h5>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">ESN Card:</dt>
                        <dd className="text-gray-900">
                          {showUserModal.esnCardNumber || "No card"}
                          {showUserModal.esnCardNumber && (
                            <span
                              className={`ml-2 ${showUserModal.esnCardVerified
                                ? "text-green-600"
                                : "text-orange-600"
                                }`}
                            >
                              (
                              {showUserModal.esnCardVerified
                                ? "Verified"
                                : "Pending"}
                              )
                            </span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Event Registrations:</dt>
                        <dd className="text-gray-900">
                          {showUserModal.registrationsCount} events
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Last Login:</dt>
                        <dd className="text-gray-900">
                          {new Date(showUserModal.lastLogin).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() =>
                      window.open(`mailto:${showUserModal.email}`, "_blank")
                    }
                    variant="outline"
                    className="flex-1"
                  >
                    Send Email
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle role change
                      setShowUserModal(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Change Role
                  </Button>
                  <Button
                    onClick={() =>
                      showUserModal &&
                      handleToggleUserStatus(
                        showUserModal.id,
                        showUserModal.isActive
                      )
                    }
                    className={`flex-1 ${showUserModal.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {showUserModal.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div >
      )}

      {/* ESN Card Verification Modal */}
      {
        showESNCardModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowESNCardModal(null)}
            ></div>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Verify ESN Card
                  </h3>
                  <button
                    onClick={() => setShowESNCardModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">User:</p>
                    <p className="font-medium">
                      {showESNCardModal.firstName} {showESNCardModal.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">ESN Card Number:</p>
                    <p className="font-medium">
                      {showESNCardModal.esnCardNumber}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Please verify the ESN card details before approving. This
                      will grant the user access to member discounts and benefits.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowESNCardModal(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        showESNCardModal.esnCardNumber &&
                        handleVerifyESNCard(
                          showESNCardModal.id,
                          showESNCardModal.esnCardNumber
                        )
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Verify Card
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default UserManagement;

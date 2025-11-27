// frontend/src/pages/admin/AdminUsersPage.tsx
import React, { useState } from "react";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { UsersTable } from "../../../components/admin/UsersTable";
import { UserFilters } from "../../../components/admin/UserFilters";
import {
  useAdminUsers,
  useUpdateUserRole,
  useVerifyEsnCard,
  useDeleteUserAdmin,
} from "../../../hooks/api/useAdmin";
import { StatsCard } from "../../../components/admin/StatsCard";
import { UsersIcon, CheckBadgeIcon, UserGroupIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

interface UserFiltersState {
  role?: string;
  isActive?: boolean;
  search?: string;
  esnCardVerified?: boolean;
  university?: string;
}

export const AdminUsersPage: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'staff'>('users');
  const [filters, setFilters] = useState<UserFiltersState>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { users, loading, error, refetch, page, setPage, pageSize, setPageSize, total } = useAdminUsers({
    filter: filters,
  });

  const { updateUserRole } = useUpdateUserRole();
  const { verifyEsnCard } = useVerifyEsnCard();
  const { deleteUserAdmin } = useDeleteUserAdmin();

  const handleFilterChange = (newFilters: UserFiltersState) => {
    setFilters(newFilters);
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateUserRole({ variables: { userId, role } });
      refetch();
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleVerifyEsnCard = async (userId: string, verified: boolean) => {
    try {
      await verifyEsnCard({ variables: { userId, verified } });
      refetch();
    } catch (err) {
      console.error("Error verifying ESN card:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserAdmin({ variables: { userId } });
      refetch();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };



  const actions = null;

  const filteredUsers = users?.filter((user: any) => {
    if (activeTab === 'users') return user.role === 'USER';
    return user.role === 'ADMIN' || user.role === 'ORGANIZER';
  });

  return (
    <AdminLayout
      title="Users Management"
      subtitle={`${users?.length || 0} total users`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              User Overview
            </h3>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-sm text-gray-500 hover:text-cyan-600 font-medium flex items-center gap-1 transition-colors"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
              <svg className={`w-4 h-4 transform transition-transform ${showStats ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showStats && users && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <StatsCard
                title="Total Users"
                value={users.length.toString()}
                icon={<UsersIcon className="w-6 h-6" />}
                description="All registered users"
              />
              <StatsCard
                title="Active"
                value={users.filter((u: any) => u.isActive).length.toString()}
                trend="up"
                change={`${((users.filter((u: any) => u.isActive).length / users.length) * 100).toFixed(0)}%`}
                icon={<CheckBadgeIcon className="w-6 h-6" />}
                description="Active accounts"
              />
              <StatsCard
                title="ESN Card Holders"
                value={users.filter((u: any) => u.esnCardVerified).length.toString()}
                trend="neutral"
                change={`${((users.filter((u: any) => u.esnCardVerified).length / users.length) * 100).toFixed(0)}%`}
                icon={<UserGroupIcon className="w-6 h-6" />}
                description="Verified members"
              />
              <StatsCard
                title="Organizers"
                value={users.filter((u: any) => u.role === 'ORGANIZER' || u.role === 'ADMIN').length.toString()}
                icon={<NoSymbolIcon className="w-6 h-6" />}
                description="Staff members"
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Normal Users
              <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${activeTab === 'users' ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-900'
                }`}>
                {users?.filter((u: any) => u.role === 'USER').length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`${activeTab === 'staff'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Admins & Organizers
              <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${activeTab === 'staff' ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-900'
                }`}>
                {users?.filter((u: any) => u.role === 'ADMIN' || u.role === 'ORGANIZER').length || 0}
              </span>
            </button>
          </nav>
        </div>

        {/* Filters */}
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Users Table */}
        <UsersTable
          users={filteredUsers || []}
          loading={loading}
          error={error}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onUpdateRole={handleUpdateRole}
          onVerifyEsnCard={handleVerifyEsnCard}
          onDeleteUser={handleDeleteUser}
        />

        {/* Pagination Controls */}
        {users && users.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Results Info */}
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Per page:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1); // Reset to first page
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminUsersPage;

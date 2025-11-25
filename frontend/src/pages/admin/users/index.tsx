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

interface UserFiltersState {
  role?: string;
  isActive?: boolean;
  search?: string;
  esnCardVerified?: boolean;
  university?: string;
}

export const AdminUsersPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFiltersState>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { users, loading, error, refetch } = useAdminUsers({
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

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case "make_organizer":
        if (window.confirm(`Make ${selectedUsers.length} users organizers?`)) {
          for (const userId of selectedUsers) {
            await updateUserRole({ variables: { userId, role: "ORGANIZER" } });
          }
          setSelectedUsers([]);
          refetch();
        }
        break;
    }
  };

  const actions =
    selectedUsers.length > 0 ? (
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {selectedUsers.length} selected
        </span>
        <button
          onClick={() => handleBulkAction("make_organizer")}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Make Organizer
        </button>
      </div>
    ) : null;

  return (
    <AdminLayout
      title="Users Management"
      subtitle={`${users?.length || 0} total users`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filters */}
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Users Table */}
        <UsersTable
          users={users || []}
          loading={loading}
          error={error}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onUpdateRole={handleUpdateRole}
          onVerifyEsnCard={handleVerifyEsnCard}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </AdminLayout>
  );
};
export default AdminUsersPage;

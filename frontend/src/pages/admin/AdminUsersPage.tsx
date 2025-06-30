// frontend/src/pages/admin/AdminUsersPage.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { UsersTable } from "../../components/admin/UsersTable";
import { UserFilters } from "../../components/admin/UserFilters";
import {
  ALL_USERS,
  UPDATE_USER_ROLE,
  DEACTIVATE_USER,
  ACTIVATE_USER,
} from "../../lib/graphql/admin";

interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  esnCardVerified?: boolean;
  university?: string;
}

export const AdminUsersPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data, loading, error, refetch } = useQuery(ALL_USERS, {
    variables: { filter: filters },
    fetchPolicy: "cache-and-network",
  });

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: () => refetch(),
  });

  const [deactivateUser] = useMutation(DEACTIVATE_USER, {
    onCompleted: () => refetch(),
  });

  const [activateUser] = useMutation(ACTIVATE_USER, {
    onCompleted: () => refetch(),
  });

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateUserRole({ variables: { userId, role } });
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateUser({ variables: { userId } });
      } else {
        await activateUser({ variables: { userId } });
      }
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case "deactivate":
        if (
          window.confirm(`Deactivate ${selectedUsers.length} selected users?`)
        ) {
          for (const userId of selectedUsers) {
            await deactivateUser({ variables: { userId } });
          }
          setSelectedUsers([]);
        }
        break;
      case "activate":
        for (const userId of selectedUsers) {
          await activateUser({ variables: { userId } });
        }
        setSelectedUsers([]);
        break;
      case "make_organizer":
        if (window.confirm(`Make ${selectedUsers.length} users organizers?`)) {
          for (const userId of selectedUsers) {
            await updateUserRole({ variables: { userId, role: "ORGANIZER" } });
          }
          setSelectedUsers([]);
        }
        break;
    }
  };

  const actions =
    selectedUsers.length > 0 ? (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {selectedUsers.length} selected
        </span>
        <button
          onClick={() => handleBulkAction("activate")}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Activate
        </button>
        <button
          onClick={() => handleBulkAction("deactivate")}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Deactivate
        </button>
        <button
          onClick={() => handleBulkAction("make_organizer")}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Make Organizer
        </button>
      </div>
    ) : null;

  return (
    <AdminLayout
      title="Users Management"
      subtitle={`${data?.users?.length || 0} total users`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filters */}
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Users Table */}
        <UsersTable
          users={data?.users || []}
          loading={loading}
          error={error}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onUpdateRole={handleUpdateRole}
          onToggleActive={handleToggleActive}
        />
      </div>
    </AdminLayout>
  );
};

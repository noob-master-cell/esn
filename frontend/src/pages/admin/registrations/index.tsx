// frontend/src/pages/admin/AdminRegistrationsPage.tsx
import React, { useState } from "react";
import {
  useAdminRegistrations,
  useUpdateRegistrationStatus,
} from "../../../hooks/api/useAdmin";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { RegistrationFilters } from "../../../components/admin/RegistrationFilters";
import { RegistrationsTable } from "../../../components/admin/RegistrationsTable";

interface RegistrationFiltersState {
  status?: string;
  paymentStatus?: string;
  eventId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface Registration {
  id: string;
  status: string;
  paymentStatus: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  event: {
    title: string;
    startDate: string;
  };
  createdAt: string;
}

export const AdminRegistrationsPage: React.FC = () => {
  const [filters, setFilters] = useState<RegistrationFiltersState>({});
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    []
  );

  const { registrations, loading, error, refetch } = useAdminRegistrations({
    filter: filters,
  });

  const { updateRegistrationStatus } = useUpdateRegistrationStatus();

  const handleFilterChange = (newFilters: RegistrationFiltersState) => {
    setFilters(newFilters);
  };

  const handleUpdateStatus = async (registrationId: string, status: string) => {
    try {
      await updateRegistrationStatus({
        variables: { registrationId, status },
      });
      refetch();
    } catch (err) {
      console.error("Error updating registration status:", err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRegistrations.length === 0) return;

    switch (action) {
      case "confirm":
        for (const registrationId of selectedRegistrations) {
          await updateRegistrationStatus({
            variables: { registrationId, status: "CONFIRMED" },
          });
        }
        refetch();
        setSelectedRegistrations([]);
        break;
      case "cancel":
        if (
          window.confirm(
            `Cancel ${selectedRegistrations.length} selected registrations?`
          )
        ) {
          for (const registrationId of selectedRegistrations) {
            await updateRegistrationStatus({
              variables: { registrationId, status: "CANCELLED" },
            });
          }
          refetch();
          setSelectedRegistrations([]);
        }
        break;
      case "waitlist":
        for (const registrationId of selectedRegistrations) {
          await updateRegistrationStatus({
            variables: { registrationId, status: "WAITLISTED" },
          });
        }
        refetch();
        setSelectedRegistrations([]);
        break;
    }
  };

  const getStats = () => {
    const regs = registrations || [];
    return {
      total: regs.length,
      confirmed: regs.filter((r: Registration) => r.status === "CONFIRMED")
        .length,
      pending: regs.filter((r: Registration) => r.status === "PENDING").length,
      waitlisted: regs.filter((r: Registration) => r.status === "WAITLISTED")
        .length,
      cancelled: regs.filter((r: Registration) => r.status === "CANCELLED")
        .length,
    };
  };

  const stats = getStats();

  const actions =
    selectedRegistrations.length > 0 ? (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {selectedRegistrations.length} selected
        </span>
        <button
          onClick={() => handleBulkAction("confirm")}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Confirm
        </button>
        <button
          onClick={() => handleBulkAction("waitlist")}
          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Waitlist
        </button>
        <button
          onClick={() => handleBulkAction("cancel")}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    ) : null;

  return (
    <AdminLayout
      title="Registrations Management"
      subtitle={`${stats.total} total registrations`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.waitlisted}
            </div>
            <div className="text-sm text-gray-500">Waitlisted</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </div>

        {/* Filters */}
        <RegistrationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Registrations Table */}
        <RegistrationsTable
          registrations={registrations || []}
          loading={loading}
          error={error}
          selectedRegistrations={selectedRegistrations}
          onSelectionChange={setSelectedRegistrations}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </AdminLayout>
  );
};
export default AdminRegistrationsPage;

// frontend/src/pages/admin/AdminRegistrationsPage.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { RegistrationsTable } from "../../components/admin/RegistrationsTable";
import { RegistrationFilters } from "../../components/admin/RegistrationFilters";
import {
  ALL_REGISTRATIONS,
  UPDATE_REGISTRATION_STATUS,
} from "../../lib/graphql/admin";

interface RegistrationFilters {
  status?: string;
  paymentStatus?: string;
  eventId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const AdminRegistrationsPage: React.FC = () => {
  const [filters, setFilters] = useState<RegistrationFilters>({});
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    []
  );

  const { data, loading, error, refetch } = useQuery(ALL_REGISTRATIONS, {
    variables: { filter: filters },
    fetchPolicy: "cache-and-network",
  });

  const [updateRegistrationStatus] = useMutation(UPDATE_REGISTRATION_STATUS, {
    onCompleted: () => refetch(),
  });

  const handleFilterChange = (newFilters: RegistrationFilters) => {
    setFilters(newFilters);
  };

  const handleUpdateStatus = async (registrationId: string, status: string) => {
    try {
      await updateRegistrationStatus({
        variables: { registrationId, status },
      });
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
          setSelectedRegistrations([]);
        }
        break;
      case "waitlist":
        for (const registrationId of selectedRegistrations) {
          await updateRegistrationStatus({
            variables: { registrationId, status: "WAITLISTED" },
          });
        }
        setSelectedRegistrations([]);
        break;
    }
  };

  const getStats = () => {
    const registrations = data?.registrations || [];
    return {
      total: registrations.length,
      confirmed: registrations.filter((r: any) => r.status === "CONFIRMED")
        .length,
      pending: registrations.filter((r: any) => r.status === "PENDING").length,
      waitlisted: registrations.filter((r: any) => r.status === "WAITLISTED")
        .length,
      cancelled: registrations.filter((r: any) => r.status === "CANCELLED")
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
          registrations={data?.registrations || []}
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

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
  registrationType: string;
  paymentRequired: boolean;
  paymentStatus: string;
  amountDue: number;
  currency: string;
  registeredAt: string;
  confirmedAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    startDate: string;
    location: string;
  };
}

export const AdminRegistrationsPage: React.FC = () => {
  const [filters, setFilters] = useState<RegistrationFiltersState>({});
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string>('registeredAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

  const { registrations, loading, error, refetch } = useAdminRegistrations({
    filter: {
      ...filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy,
      orderDirection: sortDirection,
    },
  });

  const { updateRegistrationStatus } = useUpdateRegistrationStatus();

  // Group registrations by event
  const groupedRegistrations = React.useMemo(() => {
    if (!registrations) return {};

    return (registrations as Registration[]).reduce<Record<string, Registration[]>>((groups, reg) => {
      const eventId = reg.event.id;
      if (!groups[eventId]) {
        groups[eventId] = [];
      }
      groups[eventId].push(reg);
      return groups;
    }, {});
  }, [registrations]);

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

    }
  };

  const getStats = () => {
    const regs = registrations || [];
    return {
      total: regs.length,
      confirmed: regs.filter((r: Registration) => r.status === "CONFIRMED")
        .length,
      pending: regs.filter((r: Registration) => r.status === "PENDING").length,

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
        {/* View Mode Toggle */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'grouped'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              Grouped by Event
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* Conditional View Rendering */}
        {viewMode === 'list' ? (
          <RegistrationsTable
            registrations={registrations || []}
            loading={loading}
            error={error}
            selectedRegistrations={selectedRegistrations}
            onSelectionChange={setSelectedRegistrations}
            onUpdateStatus={handleUpdateStatus}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={(field) => {
              if (sortBy === field) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(field);
                setSortDirection('asc');
              }
            }}
          />
        ) : (
          /* Grouped View */
          <div className="space-y-4">
            {Object.entries(groupedRegistrations).map(([eventId, eventRegs]) => {
              const event = eventRegs[0]?.event;
              const confirmedCount = eventRegs.filter(r => r.status === 'CONFIRMED').length;

              return (
                <details key={eventId} className="bg-white rounded-lg shadow-sm overflow-hidden" open>
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event?.title}</h3>
                      <p className="text-sm text-gray-500">{event?.location} • {new Date(event?.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {confirmedCount} confirmed • {eventRegs.length} total
                      </span>
                    </div>
                  </summary>
                  <div className="border-t border-gray-200">
                    <RegistrationsTable
                      registrations={eventRegs}
                      loading={false}
                      error={null}
                      selectedRegistrations={selectedRegistrations}
                      onSelectionChange={setSelectedRegistrations}
                      onUpdateStatus={handleUpdateStatus}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={(field) => {
                        if (sortBy === field) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(field);
                          setSortDirection('asc');
                        }
                      }}
                    />
                  </div>
                </details>
              );
            })}

            {Object.keys(groupedRegistrations).length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">No registrations found.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {(registrations && registrations.length > 0) && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Results Info */}
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, stats.total)} of {stats.total} results
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
                  Page {page} of {Math.ceil(stats.total / pageSize)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(stats.total / pageSize)}
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
export default AdminRegistrationsPage;

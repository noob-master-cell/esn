
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import {
  useAdminRegistrations,
  useUpdateRegistration,
  useRegistrationStats,
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
    endDate: string;
    location: string;
    images?: string[];
    confirmedCount?: number;
    pendingCount?: number;
    cancelledCount?: number;
  };
}

export const AdminRegistrationsPage: React.FC = () => {
  const [filters, setFilters] = useState<RegistrationFiltersState>({});
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortBy, setSortBy] = useState<string>('registeredAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


  const navigate = useNavigate();

  const { registrations, loading, refetch } = useAdminRegistrations({
    filter: {
      ...filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy,
      orderDirection: sortDirection,
    },
  });

  const { updateRegistration } = useUpdateRegistration();

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
      await updateRegistration({
        variables: {
          input: {
            id: registrationId,
            status,
          },
        },
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
          await updateRegistration({
            variables: {
              input: {
                id: registrationId,
                status: "CONFIRMED",
              },
            },
          });
        }
        refetch();
        setSelectedRegistrations([]);
        break;
      case "cancel":
        if (
          window.confirm(
            `Cancel ${selectedRegistrations.length} selected registrations ? `
          )
        ) {
          for (const registrationId of selectedRegistrations) {
            await updateRegistration({
              variables: {
                input: {
                  id: registrationId,
                  status: "CANCELLED",
                },
              },
            });
          }
          refetch();
          setSelectedRegistrations([]);
        }
        break;

    }
  };

  const { stats: globalStats } = useRegistrationStats();

  const stats = globalStats || {
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  };

  const actions =
    selectedRegistrations.length > 0 ? (
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {selectedRegistrations.length} selected
        </span>
        <button
          onClick={() => handleBulkAction("confirm")}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Confirm
        </button>

        <button
          onClick={() => handleBulkAction("cancel")}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
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
        {/* Filters */}
        <RegistrationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Grouped View */}
        <div className="space-y-6">
          {Object.entries(groupedRegistrations).map(([eventId, eventRegs]) => {
            const event = eventRegs[0]?.event;
            const confirmedCount = event?.confirmedCount || 0;
            const pendingCount = event?.pendingCount || 0;
            const totalCount = (event?.confirmedCount || 0) + (event?.pendingCount || 0) + (event?.cancelledCount || 0);

            return (
              <Disclosure key={eventId} as="div" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                {() => (
                  <>

                    <div className="w-full px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors">
                      <Disclosure.Button className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left focus:outline-none group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0">
                            {event?.images && event.images.length > 0 ? (
                              <img src={event.images[0]} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                              event?.title.charAt(0)
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 group-hover:text-cyan-600 transition-colors">
                              {event?.title}
                              <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-500 transform transition-transform ui-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(event?.startDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event?.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                          <div className="text-center sm:text-right">
                            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Confirmed</div>
                            <div className="text-sm sm:text-lg font-bold text-green-600">{confirmedCount}</div>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center sm:text-right">
                            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Pending</div>
                            <div className="text-sm sm:text-lg font-bold text-yellow-600">{pendingCount}</div>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center sm:text-right">
                            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">Total</div>
                            <div className="text-sm sm:text-lg font-bold text-gray-900">{totalCount}</div>
                          </div>
                        </div>
                      </Disclosure.Button>

                      <div className="w-full sm:w-auto">
                        <button
                          onClick={() => navigate(`/admin/events/${eventId}/attendance`)}
                          className="w-full sm:w-auto justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-cyan-600/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>Attendance</span>
                        </button>
                      </div>
                    </div>

                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="p-0">
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
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            );
          })}

          {Object.keys(groupedRegistrations).length === 0 && !loading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No registrations found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {
          (registrations && registrations.length > 0) && (
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
          )
        }
      </div>
    </AdminLayout>
  );
};
export default AdminRegistrationsPage;

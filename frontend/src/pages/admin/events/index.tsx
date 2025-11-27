// frontend/src/pages/admin/AdminEventsPage.tsx
import React, { useState } from "react";
import {
  useAdminEvents,
  useDeleteEvent,
  usePublishEvent,
  useUpdateEvent,
} from "../../../hooks/api/useEvents";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { EventFilters } from "../../../components/admin/EventFilters";
import { EventsTable } from "../../../components/admin/EventsTable";
import { StatsCard } from "../../../components/admin/StatsCard";
import { CalendarIcon, CheckCircleIcon, DocumentIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";

interface EventFiltersState {
  status?: string;
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const AdminEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState<EventFiltersState>({});
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const {
    events,
    loading,
    error,
    refetch,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
  } = useAdminEvents({
    filter: filters,
  });

  const { deleteEvent } = useDeleteEvent();
  const { publishEvent } = usePublishEvent();
  const { updateEvent } = useUpdateEvent();

  const handleFilterChange = (newFilters: EventFiltersState) => {
    setFilters(newFilters);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ variables: { id: eventId } });
        refetch();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    const event = events.find((e: any) => e.id === eventId);
    if (!event) return;

    try {
      if (event.status === 'PUBLISHED') {
        // Unpublish: Set back to DRAFT
        await updateEvent({
          variables: {
            updateEventInput: {
              id: eventId,
              status: 'DRAFT'
            }
          }
        });
      } else {
        // Publish: DRAFT -> PUBLISHED
        await publishEvent({ variables: { id: eventId } });
      }
      refetch();
    } catch (err) {
      console.error("Error toggling event status:", err);
      alert("Failed to update event status. " + (err as Error).message);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedEvents.length === 0) return;

    switch (action) {
      case "delete":
        if (
          window.confirm(`Delete ${selectedEvents.length} selected events?`)
        ) {
          for (const eventId of selectedEvents) {
            await deleteEvent({ variables: { id: eventId } });
          }
          refetch();
          setSelectedEvents([]);
        }
        break;
    }
  };

  const actions = (
    <div className="flex items-center gap-3">
      {selectedEvents.length > 0 && (
        <div className="flex items-center gap-2 mr-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {selectedEvents.length} selected
          </span>
          <button
            onClick={() => handleBulkAction("delete")}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Selected"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
        </div>
      )}
      <button
        onClick={() => navigate("/admin/events/create")}
        className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all shadow-sm hover:shadow-cyan-600/20 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Event
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Events Management"
      subtitle={`${total || 0} total events`}
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
              Event Overview
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

          {showStats && events && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <StatsCard
                title="Total Events"
                value={events.length.toString()}
                icon={<CalendarIcon className="w-6 h-6" />}
                description="All events"
              />
              <StatsCard
                title="Published"
                value={events.filter((e: any) => e.status === 'PUBLISHED').length.toString()}
                trend="up"
                change={`${((events.filter((e: any) => e.status === 'PUBLISHED').length / events.length) * 100).toFixed(0)}%`}
                icon={<CheckCircleIcon className="w-6 h-6" />}
                description="Live events"
              />
              <StatsCard
                title="Drafts"
                value={events.filter((e: any) => e.status === 'DRAFT').length.toString()}
                trend="neutral"
                change={`${((events.filter((e: any) => e.status === 'DRAFT').length / events.length) * 100).toFixed(0)}%`}
                icon={<DocumentIcon className="w-6 h-6" />}
                description="Unpublished"
              />
              <StatsCard
                title="Completed"
                value={events.filter((e: any) => e.status === 'COMPLETED').length.toString()}
                icon={<ArchiveBoxIcon className="w-6 h-6" />}
                description="Past events"
              />
            </div>
          )}
        </div>

        {/* Filters */}
        <EventFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Events Table */}
        <EventsTable
          events={events || []}
          loading={loading}
          error={error}
          selectedEvents={selectedEvents}
          onSelectionChange={setSelectedEvents}
          onDeleteEvent={handleDeleteEvent}
          onPublishEvent={handlePublishEvent}
          onEditEvent={(id: string) => navigate(`/admin/events/${id}/edit`)}
          onViewEvent={(id: string) => navigate(`/events/${id}`)}
          onCreateEvent={() => navigate("/admin/events/create")}
        />

        {/* Pagination */}
        {!loading && !error && events && events.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= total}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min(total, (page - 1) * pageSize + 1)}</span> to{" "}
                  <span className="font-medium">{Math.min(total, page * pageSize)}</span> of{" "}
                  <span className="font-medium">{total}</span> results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="block w-full rounded-md border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 sm:text-sm"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * pageSize >= total}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminEventsPage;

// frontend/src/pages/admin/AdminEventsPage.tsx
import React, { useState } from "react";
import {
  useAdminEvents,
  useDeleteEvent,
  usePublishEvent,
} from "../../../hooks/api/useEvents";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { EventFilters } from "../../../components/admin/EventFilters";
import { EventsTable } from "../../../components/admin/EventsTable";

interface EventFiltersState {
  status?: string;
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const AdminEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EventFiltersState>({});
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const { events, loading, error, refetch } = useAdminEvents({
    filter: filters,
  });

  const { deleteEvent } = useDeleteEvent();
  const { publishEvent } = usePublishEvent();

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
    try {
      await publishEvent({ variables: { id: eventId } });
      refetch();
    } catch (err) {
      console.error("Error publishing event:", err);
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
      case "publish":
        for (const eventId of selectedEvents) {
          await publishEvent({ variables: { id: eventId } });
        }
        refetch();
        setSelectedEvents([]);
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
            onClick={() => handleBulkAction("publish")}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Publish Selected"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
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
      subtitle={`${events?.length || 0} total events`}
      actions={actions}
    >
      <div className="space-y-6">
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
      </div>
    </AdminLayout>
  );
};
export default AdminEventsPage;

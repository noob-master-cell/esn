// frontend/src/pages/admin/AdminEventsPage.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { EventsTable } from "../../components/admin/EventsTable";
import { EventFilters } from "../../components/admin/EventFilters";
import {
  RECENT_EVENTS,
  DELETE_EVENT,
  PUBLISH_EVENT,
} from "../../lib/graphql/admin";

interface EventFilters {
  status?: string;
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const AdminEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EventFilters>({});
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const { data, loading, error, refetch } = useQuery(RECENT_EVENTS, {
    variables: { filter: filters },
    fetchPolicy: "cache-and-network",
  });

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      refetch();
    },
  });

  const [publishEvent] = useMutation(PUBLISH_EVENT, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ variables: { id: eventId } });
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      await publishEvent({ variables: { id: eventId } });
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
          setSelectedEvents([]);
        }
        break;
      case "publish":
        for (const eventId of selectedEvents) {
          await publishEvent({ variables: { id: eventId } });
        }
        setSelectedEvents([]);
        break;
    }
  };

  const actions = (
    <div className="flex items-center gap-3">
      {selectedEvents.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {selectedEvents.length} selected
          </span>
          <button
            onClick={() => handleBulkAction("publish")}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Publish
          </button>
          <button
            onClick={() => handleBulkAction("delete")}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
      <button
        onClick={() => navigate("/admin/events/create")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Events Management"
      subtitle={`${data?.events?.length || 0} total events`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filters */}
        <EventFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Events Table */}
        <EventsTable
          events={data?.events || []}
          loading={loading}
          error={error}
          selectedEvents={selectedEvents}
          onSelectionChange={setSelectedEvents}
          onDeleteEvent={handleDeleteEvent}
          onPublishEvent={handlePublishEvent}
          onEditEvent={(id) => navigate(`/admin/events/${id}/edit`)}
          onViewEvent={(id) => navigate(`/events/${id}`)}
        />
      </div>
    </AdminLayout>
  );
};

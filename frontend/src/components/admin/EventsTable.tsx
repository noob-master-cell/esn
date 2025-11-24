// frontend/src/components/admin/EventsTable.tsx
import React from "react";

interface Event {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  maxParticipants: number;
  registrationCount: number;
  imageUrl?: string;
  price?: number;
  memberPrice?: number;
}

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  error: any;
  selectedEvents: string[];
  onSelectionChange: (selected: string[]) => void;
  onDeleteEvent: (id: string) => void;
  onPublishEvent: (id: string) => void;
  onEditEvent: (id: string) => void;
  onViewEvent: (id: string) => void;
  onCreateEvent: () => void;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  loading,
  error,
  selectedEvents,
  onSelectionChange,
  onDeleteEvent,
  onPublishEvent,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PUBLISHED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      DRAFT: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      REGISTRATION_OPEN: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Open",
      },
      REGISTRATION_CLOSED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Closed",
      },
      COMPLETED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Completed",
      },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      SOCIAL: "bg-pink-100 text-pink-800",
      CULTURAL: "bg-purple-100 text-purple-800",
      EDUCATIONAL: "bg-blue-100 text-blue-800",
      SPORTS: "bg-green-100 text-green-800",
      TRAVEL: "bg-yellow-100 text-yellow-800",
      VOLUNTEER: "bg-orange-100 text-orange-800",
      NETWORKING: "bg-indigo-100 text-indigo-800",
      PARTY: "bg-red-100 text-red-800",
      WORKSHOP: "bg-teal-100 text-teal-800",
      CONFERENCE: "bg-gray-100 text-gray-800",
      OTHER: "bg-gray-100 text-gray-800",
    };

    const colorClass =
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
      >
        {category}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(events.map((event) => event.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedEvents, eventId]);
    } else {
      onSelectionChange(selectedEvents.filter((id) => id !== eventId));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-600">Error loading events: {error.message}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first event.
          </p>
          <button
            onClick={onCreateEvent}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedEvents.length === events.length && events.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={(e) =>
                      handleSelectEvent(event.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {event.imageUrl && (
                      <img
                        className="h-12 w-12 rounded-lg object-cover mr-4"
                        src={event.imageUrl}
                        alt={event.title}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{formatDate(event.startDate)}</div>
                    {event.startDate !== event.endDate && (
                      <div className="text-xs text-gray-500">
                        to {formatDate(event.endDate)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(event.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {event.registrationCount}
                    </span>
                    <span className="text-gray-500">
                      /{event.maxParticipants}
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (event.registrationCount / event.maxParticipants) *
                            100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(event.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.price ? (
                    <div>
                      <div>€{event.price}</div>
                      {event.memberPrice && (
                        <div className="text-xs text-green-600">
                          €{event.memberPrice} (ESN)
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium">Free</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewEvent(event.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditEvent(event.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    {event.status === "DRAFT" && (
                      <button
                        onClick={() => onPublishEvent(event.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
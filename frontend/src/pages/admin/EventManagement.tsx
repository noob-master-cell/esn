// frontend/src/pages/admin/EventManagement.tsx
import React, { useState } from "react";
import {
  useEvents,
  useDeleteEvent,
  usePublishEvent,
} from "../../hooks/api/useEvents";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Pagination } from "../../components/ui/Pagination";
import { Alert } from "../../components/ui/Alert";

interface EventFilters {
  status: string;
  category: string;
  search: string;
  dateRange: string;
}

interface Event {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
  startDate: string;
  registrationCount: number;
  maxParticipants: number;
  waitlistCount: number;
  status: string;
  category: string;
  organizer: {
    firstName: string;
    lastName: string;
  };
}

const EventManagement: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EventFilters>({
    status: "all",
    category: "all",
    search: "",
    dateRange: "all",
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { events, total, page, setPage, pageSize, loading, error, refetch } = useEvents({
    filter: {
      search: filters.search || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  const { deleteEvent, loading: deleting } = useDeleteEvent();
  const { publishEvent, loading: publishing } = usePublishEvent();

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events?.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events?.map((event: Event) => event.id) || []);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent({ variables: { id: eventId } });
      setSuccessMessage("Event deleted successfully");
      setShowDeleteConfirm(null);
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete event");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      await publishEvent({ variables: { id: eventId } });
      setSuccessMessage("Event published successfully");
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Publish error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to publish event");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      PUBLISHED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      REGISTRATION_OPEN: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Registration Open",
      },
      REGISTRATION_CLOSED: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Registration Closed",
      },
      ONGOING: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Ongoing",
      },
      COMPLETED: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Completed",
      },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      PARTY: "bg-purple-100 text-purple-800",
      CULTURAL: "bg-pink-100 text-pink-800",
      EDUCATIONAL: "bg-indigo-100 text-indigo-800",
      SPORTS: "bg-green-100 text-green-800",
      TRAVEL: "bg-blue-100 text-blue-800",
      VOLUNTEER: "bg-yellow-100 text-yellow-800",
      NETWORKING: "bg-gray-100 text-gray-800",
      WORKSHOP: "bg-red-100 text-red-800",
      CONFERENCE: "bg-teal-100 text-teal-800",
      SOCIAL: "bg-orange-100 text-orange-800",
      OTHER: "bg-gray-100 text-gray-800",
    };

    const colorClass =
      categoryColors[category as keyof typeof categoryColors] ||
      categoryColors.OTHER;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {category.toLowerCase()}
      </span>
    );
  };

  const filteredEvents = events || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert
          type="error"
          title="Failed to load events"
          message="There was an error loading the events. Please try again."
        />
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">
            Manage and organize all events ({filteredEvents.length} total)
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/events/new")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="REGISTRATION_CLOSED">Registration Closed</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="PARTY">Party</option>
              <option value="CULTURAL">Cultural</option>
              <option value="EDUCATIONAL">Educational</option>
              <option value="SPORTS">Sports</option>
              <option value="TRAVEL">Travel</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="NETWORKING">Networking</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="CONFERENCE">Conference</option>
              <option value="SOCIAL">Social</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedEvents.length} event(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Bulk Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Bulk Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
            <p className="text-gray-600 mb-6">
              {filters.search ||
                filters.status !== "all" ||
                filters.category !== "all"
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first event."}
            </p>
            <Button
              onClick={() => navigate("/admin/events/new")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Event
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedEvents.length === filteredEvents.length &&
                        filteredEvents.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event: Event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => handleSelectEvent(event.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {event.location}
                          </p>
                          <p className="text-xs text-gray-400">
                            By {event.organizer.firstName}{" "}
                            {event.organizer.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {event.registrationCount}
                        </span>
                        <span className="text-gray-500">
                          /{event.maxParticipants}
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                (event.registrationCount /
                                  event.maxParticipants) *
                                100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      {event.waitlistCount > 0 && (
                        <div className="text-xs text-orange-600">
                          +{event.waitlistCount} waitlisted
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(event.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Event"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/events/${event.id}/edit`)
                          }
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit Event"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/events/${event.id}/registrations`)
                          }
                          className="text-purple-600 hover:text-purple-800"
                          title="View Registrations"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </button>
                        {event.status === "DRAFT" && (
                          <button
                            onClick={() => handlePublishEvent(event.id)}
                            disabled={publishing}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            title="Publish Event"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(event.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Event"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={handlePageChange}
          totalItems={total}
          itemsPerPage={pageSize}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteConfirm(null)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Event
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this event? This action cannot
                  be undone and will also cancel all existing registrations.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1"
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(showDeleteConfirm)}
                    loading={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? "Deleting..." : "Delete Event"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;

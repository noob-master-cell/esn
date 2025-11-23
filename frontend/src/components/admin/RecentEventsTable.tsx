// frontend/src/components/admin/RecentEventsTable.tsx
import React from "react";
import { useRecentEvents } from "../../hooks/api/useAdmin";
import { useNavigate } from "react-router-dom";

export const RecentEventsTable: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading, error } = useRecentEvents({ limit: 5 });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Events
        </h3>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Events
        </h3>
        <p className="text-red-600">Error loading events</p>
      </div>
    );
  }

  // events is already destructured from hook

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          <button
            onClick={() => navigate("/admin/events")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all →
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No events found</p>
          <button
            onClick={() => navigate("/admin/events/create")}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Create your first event
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event: any) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {event.imageUrl && (
                        <img
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          src={event.imageUrl}
                          alt={event.title}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(event.startDate)}
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
                              (event.registrationCount /
                                event.maxParticipants) *
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/events/${event.id}/edit`)
                        }
                        className="text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Edit
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
  );
};

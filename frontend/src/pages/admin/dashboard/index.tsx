// frontend/src/pages/admin/AdminDashboardPage.tsx - Fixed version
import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { StatsCard } from "../../../components/admin/StatsCard";
import { useAdminStats, useRecentEvents } from "../../../hooks/api/useAdmin";

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { events: recentEvents, loading: eventsLoading, error: eventsError } = useRecentEvents({ limit: 5 });

  const loading = statsLoading || eventsLoading;
  const error = statsError || eventsError;

  const actions = (
    <button
      onClick={() => navigate("/admin/events/create")}
      className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors shadow-sm hover:shadow-cyan-600/20 font-medium flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Create Event
    </button>
  );

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Loading dashboard data..." actions={actions}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard" subtitle="Error loading dashboard" actions={actions}>
        <div className="bg-red-50 p-4 rounded-lg text-red-700 border border-red-100 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Error loading dashboard data: {error.message}
        </div>
      </AdminLayout>
    );
  }

  const dashboardStats = stats || {
    totalEvents: 0,
    activeUsers: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    eventsChange: 0,
    activeUsersChange: 0,
    registrationsChange: 0,
    revenueChange: 0,
  };

  const eventsList = recentEvents || [];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome to the admin panel"
      actions={actions}
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Events"
            value={dashboardStats.totalEvents.toString()}
            change={`${dashboardStats.eventsChange >= 0 ? '+' : ''}${dashboardStats.eventsChange?.toFixed(1)}%`}
            trend={dashboardStats.eventsChange >= 0 ? "up" : "down"}
            icon={
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <StatsCard
            title="Active Users"
            value={dashboardStats.activeUsers.toString()}
            change={`${dashboardStats.activeUsersChange >= 0 ? '+' : ''}${dashboardStats.activeUsersChange?.toFixed(1)}%`}
            trend={dashboardStats.activeUsersChange >= 0 ? "up" : "down"}
            icon={
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
          />

          <StatsCard
            title="Registrations"
            value={dashboardStats.totalRegistrations.toString()}
            change={`${dashboardStats.registrationsChange >= 0 ? '+' : ''}${dashboardStats.registrationsChange?.toFixed(1)}%`}
            trend={dashboardStats.registrationsChange >= 0 ? "up" : "down"}
            icon={
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />


        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/admin/events/create")}
              className="group p-6 border border-gray-100 rounded-2xl hover:border-cyan-100 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 text-left bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="flex items-start gap-4">
                <div className="bg-cyan-50 p-3 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">Create Event</p>
                  <p className="text-sm text-gray-500 mt-1">Add a new event to the calendar</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="group p-6 border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 text-left bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Manage Users</p>
                  <p className="text-sm text-gray-500 mt-1">View and edit user accounts</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/registrations")}
              className="group p-6 border border-gray-100 rounded-2xl hover:border-purple-100 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 text-left bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors"
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
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Registrations
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check event sign-ups
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Events</h3>
              <p className="text-sm text-gray-500 mt-1">Latest events added to the platform</p>
            </div>
            <button
              onClick={() => navigate("/admin/events")}
              className="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:underline flex items-center gap-1"
            >
              View all events
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registrations</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {eventsList.map((event: any) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl mr-4 overflow-hidden">
                          {(event.images && event.images.length > 0) ? (
                            <img src={event.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span>📅</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-500">{event.category || 'Uncategorized'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {new Date(event.startDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${Math.min(100, ((event.registrationCount || 0) / (event.maxParticipants || 100)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{event.registrationCount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${event.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${event.status === "PUBLISHED" ? "bg-green-500" : "bg-yellow-500"
                          }`}></span>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                        className="text-gray-400 hover:text-cyan-600 transition-colors mr-4"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="text-gray-400 hover:text-cyan-600 transition-colors"
                        title="View"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminDashboardPage;

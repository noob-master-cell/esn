import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { StatsCard } from "../../../components/admin/StatsCard";
import { useAdminStats, useRecentEvents } from "../../../hooks/api/useAdmin";
import { CalendarIcon, UsersIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { Avatar } from "../../../components/ui/Avatar";

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = React.useState(false);

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
        {/* Stats Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
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

          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <StatsCard
                title="Total Events"
                value={dashboardStats.totalEvents.toString()}
                change={`${dashboardStats.eventsChange >= 0 ? '+' : ''}${dashboardStats.eventsChange?.toFixed(1)}%`}
                trend={dashboardStats.eventsChange >= 0 ? "up" : "down"}
                icon={<CalendarIcon className="w-6 h-6" />}
                description="All events"
              />

              <StatsCard
                title="Active Users"
                value={dashboardStats.activeUsers.toString()}
                change={`${dashboardStats.activeUsersChange >= 0 ? '+' : ''}${dashboardStats.activeUsersChange?.toFixed(1)}%`}
                trend={dashboardStats.activeUsersChange >= 0 ? "up" : "down"}
                icon={<UsersIcon className="w-6 h-6" />}
                description="Active accounts"
              />

              <StatsCard
                title="Registrations"
                value={dashboardStats.totalRegistrations.toString()}
                change={`${dashboardStats.registrationsChange >= 0 ? '+' : ''}${dashboardStats.registrationsChange?.toFixed(1)}%`}
                trend={dashboardStats.registrationsChange >= 0 ? "up" : "down"}
                icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />}
                description="Total signups"
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/admin/events/create")}
              className="group p-4 border border-gray-100 rounded-xl hover:border-cyan-100 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 text-left bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="flex items-start gap-4">
                <div className="bg-cyan-50 p-2.5 rounded-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">Create Event</p>
                  <p className="text-xs text-gray-500 mt-0.5">Add a new event to the calendar</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="group p-4 border border-gray-100 rounded-xl hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 text-left bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <UsersIcon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Manage Users</p>
                  <p className="text-xs text-gray-500 mt-0.5">View and edit user accounts</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/registrations")}
              className="group p-4 border border-gray-100 rounded-xl hover:border-purple-100 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 text-left bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 p-2.5 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Registrations
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Check event sign-ups
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Events</h3>
              <p className="text-sm text-gray-500 mt-1">Latest events added to the platform</p>
            </div>
            <button
              onClick={() => navigate("/admin/events")}
              className="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            {eventsList.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registrations</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {eventsList.map((event: any) => (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Avatar
                              src={(event.images && event.images.length > 0) ? event.images[0] : null}
                              alt={event.title}
                              fallback="📅"
                              size="lg"
                              className="rounded-xl shadow-sm border border-gray-100"
                              bordered={false}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{event.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              {event.category || 'Uncategorized'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(event.startDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.startDate).toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full max-w-[140px]">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium text-gray-700">
                              {event.registrationCount} <span className="text-gray-400">/ {event.maxParticipants}</span>
                            </span>
                            <span className="text-gray-400">
                              {Math.round(((event.registrationCount || 0) / (event.maxParticipants || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${event.registrationCount >= event.maxParticipants
                                ? "bg-red-500"
                                : event.registrationCount >= event.maxParticipants * 0.8
                                  ? "bg-yellow-500"
                                  : "bg-cyan-500"
                                }`}
                              style={{ width: `${Math.min(100, ((event.registrationCount || 0) / (event.maxParticipants || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                            title="Edit Event"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                            title="View Public Page"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
                <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">Get started by creating your first event to see it listed here.</p>
                <button
                  onClick={() => navigate("/admin/events/create")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Create Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminDashboardPage;

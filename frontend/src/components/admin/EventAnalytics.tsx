// frontend/src/components/admin/EventAnalytics.tsx
import React, { useState } from "react";

interface EventAnalyticsProps {
  data: any;
  loading: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

type EventView = "overview" | "performance" | "categories" | "timeline";

export const EventAnalytics: React.FC<EventAnalyticsProps> = ({
  data,
  loading,
  dateRange,
}) => {
  const [activeView, setActiveView] = useState<EventView>("overview");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const eventData = data?.eventAnalytics || {};
  const events = eventData.events || [];
  const categories = eventData.categories || [];

  // Calculate metrics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (sum: number, event: any) => sum + (event.registrations || 0),
    0
  );
  const totalAttendees = events.reduce(
    (sum: number, event: any) => sum + (event.attendees || 0),
    0
  );
  const averageAttendanceRate =
    totalRegistrations > 0 ? (totalAttendees / totalRegistrations) * 100 : 0;

  const viewTabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "performance", name: "Performance", icon: "🎯" },
    { id: "categories", name: "Categories", icon: "📂" },
    { id: "timeline", name: "Timeline", icon: "📅" },
  ];

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Total Registrations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRegistrations.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Total Attendees
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalAttendees.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {averageAttendanceRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as EventView)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* View Content */}
      {activeView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Performing Events
            </h3>
            <div className="space-y-3">
              {events.slice(0, 5).map((event: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{event.registrations} registered</span>
                      <span>{event.attendees} attended</span>
                      <span>
                        {(
                          (event.attendees / event.registrations) *
                          100
                        ).toFixed(0)}
                        % rate
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{((event.revenue || 0) / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{event.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Status Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Event Status
            </h3>
            <div className="space-y-3">
              {[
                {
                  status: "Published",
                  count: events.filter((e: any) => e.status === "PUBLISHED")
                    .length,
                  color: "bg-green-500",
                },
                {
                  status: "Draft",
                  count: events.filter((e: any) => e.status === "DRAFT").length,
                  color: "bg-yellow-500",
                },
                {
                  status: "Cancelled",
                  count: events.filter((e: any) => e.status === "CANCELLED")
                    .length,
                  color: "bg-red-500",
                },
                {
                  status: "Completed",
                  count: events.filter((e: any) => e.status === "COMPLETED")
                    .length,
                  color: "bg-blue-500",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${item.color}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{
                          width: `${(item.count / totalEvents) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 min-w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "performance" && (
        <div className="space-y-6">
          {/* Performance Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Event Performance Details
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Attended
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {event.registrations}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {event.attendees}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (event.attendees / event.registrations) * 100 >= 80
                              ? "bg-green-100 text-green-800"
                              : (event.attendees / event.registrations) * 100 >=
                                60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(
                            (event.attendees / event.registrations) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        €{((event.revenue || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            event.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : event.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-800"
                              : event.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Events by Category
            </h3>
            <div className="space-y-3">
              {categories.map((category: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(category.count / totalEvents) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 min-w-8 text-right">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Category Performance
            </h3>
            <div className="space-y-3">
              {categories.map((category: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.count} events
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Avg. Attendance</p>
                      <p className="font-medium">{category.avgAttendance}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Revenue</p>
                      <p className="font-medium">
                        €{((category.revenue || 0) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg. Per Event</p>
                      <p className="font-medium">
                        €
                        {(
                          (category.revenue / category.count || 0) / 100
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "timeline" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Event Timeline
          </h3>
          <div className="space-y-4">
            {events
              .sort(
                (a: any, b: any) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )
              .map((event: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{event.registrations} registered</span>
                      <span>{event.attendees} attended</span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

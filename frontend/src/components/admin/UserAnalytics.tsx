// frontend/src/components/admin/UserAnalytics.tsx
import React, { useState } from "react";

interface UserAnalyticsProps {
  data: any;
  loading: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

type UserView = "overview" | "demographics" | "engagement" | "growth";

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({
  data,
  loading,
  dateRange,
}) => {
  const [activeView, setActiveView] = useState<UserView>("overview");

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

  const userData = data?.userAnalytics || {};
  const users = userData.users || [];

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((user: any) => user.isActive).length;
  const newUsers = users.filter(
    (user: any) => new Date(user.createdAt) >= new Date(dateRange.startDate)
  ).length;
  const averageEventsPerUser =
    totalUsers > 0
      ? users.reduce(
          (sum: number, user: any) => sum + (user.eventCount || 0),
          0
        ) / totalUsers
      : 0;

  const viewTabs = [
    { id: "overview", name: "Overview", icon: "👥" },
    { id: "demographics", name: "Demographics", icon: "📊" },
    { id: "engagement", name: "Engagement", icon: "💬" },
    { id: "growth", name: "Growth", icon: "📈" },
  ];

  return (
    <div className="space-y-6">
      {/* User Summary */}
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalUsers.toLocaleString()}
              </p>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeUsers.toLocaleString()}
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">New Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {newUsers.toLocaleString()}
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
                Avg. Events/User
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {averageEventsPerUser.toFixed(1)}
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
              onClick={() => setActiveView(tab.id as UserView)}
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
          {/* User Roles Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              User Roles
            </h3>
            <div className="space-y-3">
              {[
                {
                  role: "User",
                  count: users.filter((u: any) => u.role === "USER").length,
                  color: "bg-blue-500",
                },
                {
                  role: "Organizer",
                  count: users.filter((u: any) => u.role === "ORGANIZER")
                    .length,
                  color: "bg-green-500",
                },
                {
                  role: "Admin",
                  count: users.filter((u: any) => u.role === "ADMIN").length,
                  color: "bg-purple-500",
                },
                {
                  role: "Super Admin",
                  count: users.filter((u: any) => u.role === "SUPER_ADMIN")
                    .length,
                  color: "bg-red-500",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${item.color}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / totalUsers) * 100}%` }}
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

          {/* ESN Card Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ESN Card Status
            </h3>
            <div className="space-y-3">
              {[
                {
                  status: "Verified",
                  count: users.filter((u: any) => u.esnCard?.verified).length,
                  color: "bg-green-500",
                },
                {
                  status: "Pending",
                  count: users.filter(
                    (u: any) => u.esnCard && !u.esnCard.verified
                  ).length,
                  color: "bg-yellow-500",
                },
                {
                  status: "No Card",
                  count: users.filter((u: any) => !u.esnCard).length,
                  color: "bg-gray-500",
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
                        style={{ width: `${(item.count / totalUsers) * 100}%` }}
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

          {/* Most Active Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Most Active Users
            </h3>
            <div className="space-y-3">
              {users
                .sort(
                  (a: any, b: any) => (b.eventCount || 0) - (a.eventCount || 0)
                )
                .slice(0, 5)
                .map((user: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.eventCount || 0} events
                      </p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Registration Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Registration Timeline
            </h3>
            <div className="h-48 flex items-end justify-between space-x-1">
              {userData.registrationTimeline?.map((day: any, index: number) => {
                const maxRegistrations = Math.max(
                  ...(userData.registrationTimeline || []).map(
                    (d: any) => d.count
                  )
                );
                const height =
                  maxRegistrations > 0
                    ? (day.count / maxRegistrations) * 100
                    : 0;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${new Date(day.date).toLocaleDateString()}: ${
                        day.count
                      } registrations`}
                    ></div>

                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeView === "demographics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Age Distribution
            </h3>
            <div className="space-y-3">
              {[
                {
                  range: "18-22",
                  count: users.filter((u: any) => u.age >= 18 && u.age <= 22)
                    .length,
                },
                {
                  range: "23-27",
                  count: users.filter((u: any) => u.age >= 23 && u.age <= 27)
                    .length,
                },
                {
                  range: "28-32",
                  count: users.filter((u: any) => u.age >= 28 && u.age <= 32)
                    .length,
                },
                {
                  range: "33+",
                  count: users.filter((u: any) => u.age >= 33).length,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {item.range} years
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.count / totalUsers) * 100}%` }}
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

          {/* University Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Universities
            </h3>
            <div className="space-y-3">
              {(userData.topUniversities || []).map(
                (uni: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {uni.name}
                    </span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(uni.count / totalUsers) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 min-w-8 text-right">
                        {uni.count}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeView === "engagement" && (
        <div className="space-y-6">
          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Event Participation Rate
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {((activeUsers / totalUsers) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Avg. Events per Active User
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {activeUsers > 0
                  ? (
                      users
                        .filter((u: any) => u.isActive)
                        .reduce(
                          (sum: number, u: any) => sum + (u.eventCount || 0),
                          0
                        ) / activeUsers
                    ).toFixed(1)
                  : "0"}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Monthly Active Users
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {
                  users.filter(
                    (u: any) =>
                      u.lastActive &&
                      new Date(u.lastActive) >=
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </p>
            </div>
          </div>

          {/* User Engagement Levels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              User Engagement Levels
            </h3>
            <div className="space-y-3">
              {[
                {
                  level: "High (5+ events)",
                  users: users.filter((u: any) => (u.eventCount || 0) >= 5),
                  color: "bg-green-500",
                },
                {
                  level: "Medium (2-4 events)",
                  users: users.filter(
                    (u: any) =>
                      (u.eventCount || 0) >= 2 && (u.eventCount || 0) < 5
                  ),
                  color: "bg-yellow-500",
                },
                {
                  level: "Low (1 event)",
                  users: users.filter((u: any) => (u.eventCount || 0) === 1),
                  color: "bg-orange-500",
                },
                {
                  level: "No events",
                  users: users.filter((u: any) => (u.eventCount || 0) === 0),
                  color: "bg-red-500",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${item.color}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.level}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{
                          width: `${(item.users.length / totalUsers) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 min-w-12 text-right">
                      {item.users.length} (
                      {((item.users.length / totalUsers) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "growth" && (
        <div className="space-y-6">
          {/* Growth Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              User Growth Over Time
            </h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {userData.growthData?.map((month: any, index: number) => {
                const maxUsers = Math.max(
                  ...(userData.growthData || []).map((m: any) => m.totalUsers)
                );
                const height =
                  maxUsers > 0 ? (month.totalUsers / maxUsers) * 100 : 0;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${month.month}: ${month.totalUsers} total users, ${month.newUsers} new`}
                    ></div>

                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                      {month.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Growth Rate
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-green-600">
                    +{userData.monthlyGrowth || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Quarter</span>
                  <span className="text-sm font-medium text-green-600">
                    +{userData.quarterlyGrowth || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Year</span>
                  <span className="text-sm font-medium text-green-600">
                    +{userData.yearlyGrowth || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Retention Rate
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    30-day retention
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {userData.retention30d || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    90-day retention
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {userData.retention90d || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    1-year retention
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {userData.retention1y || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

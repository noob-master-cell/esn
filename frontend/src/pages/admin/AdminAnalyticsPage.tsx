// frontend/src/pages/admin/AdminAnalyticsPage.tsx
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { AnalyticsOverview } from "../../components/admin/AnalyticsOverview";
import { RevenueChart } from "../../components/admin/RevenueChart";
import { EventAnalytics } from "../../components/admin/EventAnalytics";
import { UserAnalytics } from "../../components/admin/UserAnalytics";
import { PerformanceMetrics } from "../../components/admin/PerformanceMetrics";
import {
  GET_ANALYTICS_OVERVIEW,
  GET_REVENUE_ANALYTICS,
  GET_EVENT_ANALYTICS,
  GET_USER_ANALYTICS,
} from "../../lib/graphql/analytics";

type AnalyticsTab = "overview" | "revenue" | "events" | "users" | "performance";

interface DateRange {
  startDate: string;
  endDate: string;
  period: "week" | "month" | "quarter" | "year" | "custom";
}

export const AdminAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    period: "month",
  });

  // Overview data
  const { data: overviewData, loading: overviewLoading } = useQuery(
    GET_ANALYTICS_OVERVIEW,
    {
      variables: { dateRange },
      fetchPolicy: "cache-and-network",
    }
  );

  // Revenue data (load only when needed)
  const { data: revenueData, loading: revenueLoading } = useQuery(
    GET_REVENUE_ANALYTICS,
    {
      variables: { dateRange },
      skip: activeTab !== "revenue" && activeTab !== "overview",
      fetchPolicy: "cache-and-network",
    }
  );

  // Event data
  const { data: eventData, loading: eventLoading } = useQuery(
    GET_EVENT_ANALYTICS,
    {
      variables: { dateRange },
      skip: activeTab !== "events" && activeTab !== "overview",
      fetchPolicy: "cache-and-network",
    }
  );

  // User data
  const { data: userData, loading: userLoading } = useQuery(
    GET_USER_ANALYTICS,
    {
      variables: { dateRange },
      skip: activeTab !== "users" && activeTab !== "overview",
      fetchPolicy: "cache-and-network",
    }
  );

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "revenue", name: "Revenue", icon: "💰" },
    { id: "events", name: "Events", icon: "🎯" },
    { id: "users", name: "Users", icon: "👥" },
    { id: "performance", name: "Performance", icon: "⚡" },
  ];

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  const handleExportData = () => {
    // Export current analytics data
    const dataToExport = {
      dateRange,
      tab: activeTab,
      overview: overviewData,
      revenue: revenueData,
      events: eventData,
      users: userData,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${activeTab}-${dateRange.startDate}-to-${dateRange.endDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const actions = (
    <div className="flex items-center gap-3">
      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <select
          value={dateRange.period}
          onChange={(e) => {
            const period = e.target.value as DateRange["period"];
            let startDate, endDate;
            const now = new Date();

            switch (period) {
              case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
              case "month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
              case "quarter":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
              case "year":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
              default:
                startDate = new Date(dateRange.startDate);
            }

            endDate = now;

            setDateRange({
              period,
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
            });
          }}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 90 days</option>
          <option value="year">Last year</option>
          <option value="custom">Custom range</option>
        </select>

        {dateRange.period === "custom" && (
          <>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
      </div>

      <button
        onClick={handleExportData}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Export Data
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Analytics Dashboard"
      subtitle={`Insights from ${dateRange.startDate} to ${dateRange.endDate}`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <AnalyticsOverview
              data={overviewData}
              loading={overviewLoading}
              dateRange={dateRange}
            />
          )}

          {activeTab === "revenue" && (
            <RevenueChart
              data={revenueData}
              loading={revenueLoading}
              dateRange={dateRange}
            />
          )}

          {activeTab === "events" && (
            <EventAnalytics
              data={eventData}
              loading={eventLoading}
              dateRange={dateRange}
            />
          )}

          {activeTab === "users" && (
            <UserAnalytics
              data={userData}
              loading={userLoading}
              dateRange={dateRange}
            />
          )}

          {activeTab === "performance" && (
            <PerformanceMetrics dateRange={dateRange} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// frontend/src/components/admin/RevenueChart.tsx
import React, { useState } from "react";

interface RevenueChartProps {
  data: any;
  loading: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

type ChartView = "daily" | "weekly" | "monthly";

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  loading,
  dateRange,
}) => {
  const [chartView, setChartView] = useState<ChartView>("daily");
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "transactions" | "average"
  >("revenue");

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

  const revenueData = data?.revenueAnalytics || {};
  const chartData = revenueData.dailyRevenue || [];

  // Calculate key metrics
  const totalRevenue = chartData.reduce(
    (sum: number, day: any) => sum + (day.amount || 0),
    0
  );
  const totalTransactions = chartData.reduce(
    (sum: number, day: any) => sum + (day.transactions || 0),
    0
  );
  const averageTransactionValue =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const maxValue = Math.max(
    ...chartData.map((day: any) => {
      switch (selectedMetric) {
        case "revenue":
          return day.amount || 0;
        case "transactions":
          return day.transactions || 0;
        case "average":
          return day.transactions > 0
            ? (day.amount || 0) / day.transactions
            : 0;
        default:
          return 0;
      }
    })
  );

  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case "revenue":
        return `€${(value / 100).toFixed(2)}`;
      case "transactions":
        return value.toString();
      case "average":
        return `€${(value / 100).toFixed(2)}`;
      default:
        return value.toString();
    }
  };

  const getMetricValue = (day: any) => {
    switch (selectedMetric) {
      case "revenue":
        return day.amount || 0;
      case "transactions":
        return day.transactions || 0;
      case "average":
        return day.transactions > 0 ? (day.amount || 0) / day.transactions : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                €{(totalRevenue / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalTransactions.toLocaleString()}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Avg. Transaction
              </p>
              <p className="text-2xl font-bold text-gray-900">
                €{(averageTransactionValue / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
          <div className="flex items-center space-x-4">
            {/* Metric Selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Revenue</option>
              <option value="transactions">Transactions</option>
              <option value="average">Avg. Value</option>
            </select>

            {/* View Selector */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(["daily", "weekly", "monthly"] as ChartView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setChartView(view)}
                  className={`px-3 py-1 text-sm font-medium ${
                    chartView === view
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.slice(0, 20).map((day: any, index: number) => {
              const value = getMetricValue(day);
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${new Date(
                        day.date
                      ).toLocaleDateString()}: ${formatValue(value)}`}
                    ></div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="text-center">
                        <div>{new Date(day.date).toLocaleDateString()}</div>
                        <div className="font-medium">{formatValue(value)}</div>
                      </div>
                    </div>
                  </div>

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

          {/* Chart Legend */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>
                {selectedMetric === "revenue"
                  ? "Revenue"
                  : selectedMetric === "transactions"
                  ? "Transactions"
                  : "Average Transaction Value"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue by Payment Method
          </h3>
          <div className="space-y-3">
            {(revenueData.paymentMethods || []).map(
              (method: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {method.name}
                  </span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(method.amount / totalRevenue) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 min-w-16 text-right">
                      €{((method.amount || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Top Events by Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Events by Revenue
          </h3>
          <div className="space-y-3">
            {(revenueData.topEventsByRevenue || []).map(
              (event: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.participants} participants
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{((event.revenue || 0) / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((event.revenue / totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

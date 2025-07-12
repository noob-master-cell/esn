// frontend/src/components/admin/PerformanceMetrics.tsx
import React, { useState, useEffect } from "react";

interface PerformanceMetricsProps {
  dateRange: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

interface SystemMetrics {
  responseTime: number;
  uptime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  databaseConnections: number;
  activeUsers: number;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  dateRange,
}) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    responseTime: 0,
    uptime: 0,
    errorRate: 0,
    throughput: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    databaseConnections: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Simulate real-time metrics (in a real app, this would come from your monitoring service)
  useEffect(() => {
    const fetchMetrics = () => {
      // Simulate metrics with some random variation
      setMetrics({
        responseTime: 120 + Math.random() * 80, // 120-200ms
        uptime: 99.5 + Math.random() * 0.4, // 99.5-99.9%
        errorRate: Math.random() * 0.5, // 0-0.5%
        throughput: 450 + Math.random() * 100, // 450-550 req/min
        memoryUsage: 60 + Math.random() * 20, // 60-80%
        cpuUsage: 30 + Math.random() * 20, // 30-50%
        databaseConnections: 15 + Math.floor(Math.random() * 10), // 15-25
        activeUsers: 120 + Math.floor(Math.random() * 50), // 120-170
      });
      setLoading(false);
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return "text-green-600 bg-green-100";
    if (value <= thresholds.warning) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.5) return "text-green-600 bg-green-100";
    if (uptime >= 99.0) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 mr-3">
              System Performance
            </h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-gray-500">
                Live data - Updates every 5 seconds
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Auto-refresh:</span>
            <button
              onClick={() => {
                if (refreshInterval) {
                  clearInterval(refreshInterval);
                  setRefreshInterval(null);
                } else {
                  const interval = setInterval(() => {
                    // Update metrics logic here
                  }, 5000);
                  setRefreshInterval(interval);
                }
              }}
              className={`px-3 py-1 rounded text-sm ${
                refreshInterval
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {refreshInterval ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Response Time */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Response Time
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.responseTime.toFixed(0)}ms
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  metrics.responseTime,
                  { good: 150, warning: 300 }
                )}`}
              >
                {metrics.responseTime <= 150
                  ? "Excellent"
                  : metrics.responseTime <= 300
                  ? "Good"
                  : "Slow"}
              </div>
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.uptime.toFixed(2)}%
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getUptimeColor(
                  metrics.uptime
                )}`}
              >
                {metrics.uptime >= 99.5
                  ? "Excellent"
                  : metrics.uptime >= 99.0
                  ? "Good"
                  : "Poor"}
              </div>
            </div>
          </div>

          {/* Error Rate */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.errorRate.toFixed(2)}%
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  metrics.errorRate,
                  { good: 0.1, warning: 1.0 }
                )}`}
              >
                {metrics.errorRate <= 0.1
                  ? "Excellent"
                  : metrics.errorRate <= 1.0
                  ? "Good"
                  : "High"}
              </div>
            </div>
          </div>

          {/* Throughput */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Throughput</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.throughput.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">req/min</p>
              </div>
              <div className="text-green-600">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Resources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            System Resources
          </h3>
          <div className="space-y-4">
            {/* Memory Usage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Memory Usage</span>
                <span className="text-gray-900">
                  {metrics.memoryUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metrics.memoryUsage > 80
                      ? "bg-red-500"
                      : metrics.memoryUsage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${metrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            {/* CPU Usage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">CPU Usage</span>
                <span className="text-gray-900">
                  {metrics.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metrics.cpuUsage > 80
                      ? "bg-red-500"
                      : metrics.cpuUsage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            {/* Database Connections */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  Database Connections
                </span>
                <span className="text-gray-900">
                  {metrics.databaseConnections} / 50
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(metrics.databaseConnections / 50) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Active Users */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                  <p className="text-sm font-medium text-gray-700">
                    Active Users
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {metrics.activeUsers}
                  </p>
                </div>
              </div>
              <div className="text-green-600">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            API Endpoint Performance
          </h3>
          <div className="space-y-3">
            {[
              {
                endpoint: "/api/events",
                responseTime: 95,
                requests: 1250,
                errors: 2,
              },
              {
                endpoint: "/api/auth/login",
                responseTime: 180,
                requests: 450,
                errors: 0,
              },
              {
                endpoint: "/api/registrations",
                responseTime: 120,
                requests: 820,
                errors: 1,
              },
              {
                endpoint: "/api/payments",
                responseTime: 250,
                requests: 380,
                errors: 5,
              },
              {
                endpoint: "/api/users",
                responseTime: 110,
                requests: 650,
                errors: 0,
              },
            ].map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {endpoint.endpoint}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{endpoint.requests} requests</span>
                    <span>{endpoint.errors} errors</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {endpoint.responseTime}ms
                  </p>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      endpoint.responseTime <= 150
                        ? "bg-green-100 text-green-800"
                        : endpoint.responseTime <= 300
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {endpoint.responseTime <= 150
                      ? "Fast"
                      : endpoint.responseTime <= 300
                      ? "OK"
                      : "Slow"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Checks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          System Health Checks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { service: "Database", status: "healthy", lastCheck: "30s ago" },
            { service: "Redis Cache", status: "healthy", lastCheck: "45s ago" },
            {
              service: "Email Service",
              status: "healthy",
              lastCheck: "1m ago",
            },
            {
              service: "Payment Gateway",
              status: "warning",
              lastCheck: "2m ago",
            },
            { service: "File Storage", status: "healthy", lastCheck: "1m ago" },
            {
              service: "External APIs",
              status: "healthy",
              lastCheck: "30s ago",
            },
            {
              service: "Background Jobs",
              status: "healthy",
              lastCheck: "15s ago",
            },
            { service: "Monitoring", status: "healthy", lastCheck: "10s ago" },
          ].map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {check.service}
                </p>
                <p className="text-xs text-gray-500">{check.lastCheck}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  check.status === "healthy"
                    ? "bg-green-500"
                    : check.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          Performance Optimization Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Response times under 200ms provide the best user experience
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Monitor memory usage; consider optimization above 80%</span>
          </div>
          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Keep error rates below 1% for optimal service quality</span>
          </div>
          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Scale resources proactively during high-traffic periods</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PerformanceMetrics;

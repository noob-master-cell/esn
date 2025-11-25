import React from "react";


interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  description,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;

    const iconClass = `w-4 h-4 ${getTrendColor()}`;

    switch (trend) {
      case "up":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17l9.2-9.2M17 17V7H7"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 7l-9.2 9.2M7 7v10h10"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-cyan-600 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

          {change && (
            <div className="flex items-center mt-3">
              <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-green-50 text-green-700' :
                trend === 'down' ? 'bg-red-50 text-red-700' :
                  'bg-gray-50 text-gray-600'
                }`}>
                {getTrendIcon()}
                <span className="ml-1">{change}</span>
              </div>
              <span className="ml-2 text-xs text-gray-400 font-medium">vs last month</span>
            </div>
          )}

          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 group-hover:bg-cyan-100 group-hover:text-cyan-700 transition-colors shadow-sm">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
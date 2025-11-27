import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/solid";

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
        return <ArrowTrendingUpIcon className={iconClass} />;
      case "down":
        return <ArrowTrendingDownIcon className={iconClass} />;
      default:
        return <MinusIcon className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 mb-1 group-hover:text-cyan-600 transition-colors uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>

          {change && (
            <div className="flex items-center mt-2">
              <div className={`flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${trend === 'up' ? 'bg-green-50 text-green-700' :
                trend === 'down' ? 'bg-red-50 text-red-700' :
                  'bg-gray-50 text-gray-600'
                }`}>
                {getTrendIcon()}
                <span className="ml-1">{change}</span>
              </div>
              <span className="ml-2 text-[10px] text-gray-400 font-medium">vs last month</span>
            </div>
          )}

          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {icon && (
          <div className="flex-shrink-0 ml-3">
            <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600 group-hover:bg-cyan-100 group-hover:text-cyan-700 transition-colors shadow-sm">
              {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" }) : icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
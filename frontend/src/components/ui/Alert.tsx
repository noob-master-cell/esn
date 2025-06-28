import * as React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const typeClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconClasses = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`p-4 rounded-md border ${typeClasses[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-lg">{iconClasses[type]}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-lg">×</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

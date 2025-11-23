import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">{icon}</div>
          </div>
        )}
        <input
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${icon ? "pl-10" : "pl-3"} pr-3 py-2
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

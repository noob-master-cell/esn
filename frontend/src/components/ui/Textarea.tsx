import React, { forwardRef } from "react";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", label, error, helperText, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={props.id || props.name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        ref={ref}
                        className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

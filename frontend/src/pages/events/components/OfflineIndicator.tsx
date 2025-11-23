import React from "react";

interface OfflineIndicatorProps {
    show: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed top-4 left-4 right-4 z-50">
            <div className="bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v18M3 12h18"
                    />
                </svg>
                <span className="text-sm font-medium">
                    You're offline. Some features may be limited.
                </span>
            </div>
        </div>
    );
};

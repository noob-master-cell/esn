import React from "react";

interface PullToRefreshIndicatorProps {
    isPulling: boolean;
    pullDistance: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
    isPulling,
    pullDistance,
}) => {
    if (!isPulling) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 flex justify-center items-center bg-blue-500 text-white z-50 transition-all duration-200"
            style={{
                height: `${Math.min(pullDistance, 60)}px`,
                opacity: pullDistance / 80,
            }}
        >
            <div className="flex items-center gap-2">
                <div
                    className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full ${pullDistance > 80 ? "animate-spin" : ""
                        }`}
                ></div>
                <span className="text-sm font-medium">
                    {pullDistance > 80 ? "Release to refresh" : "Pull to refresh"}
                </span>
            </div>
        </div>
    );
};

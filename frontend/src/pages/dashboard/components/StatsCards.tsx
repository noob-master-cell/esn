import React from "react";

interface StatsCardsProps {
    totalEvents: number;
    confirmedEvents: number;
    waitlistedEvents: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
    totalEvents,
    confirmedEvents,
    waitlistedEvents,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900">
                            {totalEvents}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">Total Events</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900">
                            {confirmedEvents}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">Confirmed</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900">
                            {waitlistedEvents}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">Waitlisted</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

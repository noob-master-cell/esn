import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

export const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-5 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2 md:space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-start text-sm md:text-base"
                    onClick={() => navigate("/events")}
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Browse Events
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start text-sm md:text-base"
                    onClick={() => navigate("/profile")}
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    Edit Profile
                </Button>
            </div>
        </div>
    );
};

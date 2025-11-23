import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

export const EmptyState: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Events Yet
            </h3>
            <p className="text-gray-600 mb-6">
                You haven't registered for any events yet. Discover amazing events
                happening around you!
            </p>
            <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate("/events")}
            >
                Browse Events
            </Button>
        </div>
    );
};

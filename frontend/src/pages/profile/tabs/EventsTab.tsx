import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../components/shared/StatusBadge";
import type { Registration } from "../types";

interface EventsTabProps {
    allRegistrations: Registration[];
    registrationsLoading: boolean;
    cancelRegistration: (id: string) => Promise<any>;
    refetchRegistrations: () => void;
    setUpdateSuccess: (value: boolean) => void;
    setUpdateError: (value: string) => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
    allRegistrations,
    registrationsLoading,
    cancelRegistration,
    refetchRegistrations,
    setUpdateSuccess,
    setUpdateError,
}) => {
    const navigate = useNavigate();
    const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

    const getFilteredRegistrations = () => {
        const now = new Date();
        switch (eventFilter) {
            case 'upcoming':
                return allRegistrations.filter((r: Registration) => new Date(r.event.startDate) > now && r.status !== 'CANCELLED');
            case 'past':
                return allRegistrations.filter((r: Registration) => new Date(r.event.startDate) <= now || r.status === 'ATTENDED');
            case 'cancelled':
                return allRegistrations.filter((r: Registration) => r.status === 'CANCELLED');
            default:
                return allRegistrations;
        }
    };

    const registrations = getFilteredRegistrations();

    const handleCancelRegistration = async (registrationId: string) => {
        if (window.confirm("Are you sure you want to cancel your registration?")) {
            try {
                await cancelRegistration(registrationId);
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
                refetchRegistrations();
            } catch (error) {
                console.error('Cancel registration error:', error);
                setUpdateError('Failed to cancel registration. Please try again.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['all', 'upcoming', 'past', 'cancelled'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setEventFilter(filter)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${eventFilter === filter
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {registrationsLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl h-24 animate-pulse"></div>
                    ))}
                </div>
            ) : registrations.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                    <div className="text-5xl mb-4">🎫</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-600 mb-6">
                        {eventFilter === 'all' ? "You haven't registered for any events yet." : `No ${eventFilter} events.`}
                    </p>
                    <Button onClick={() => navigate("/events")} className="bg-blue-600 hover:bg-blue-700">
                        Browse Events
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {registrations.map((registration: Registration) => {
                        const isUpcoming = new Date(registration.event.startDate) > new Date();
                        const canCancel = isUpcoming && registration.status !== 'CANCELLED';

                        return (
                            <div
                                key={registration.id}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    {registration.event.imageUrl && (
                                        <img
                                            src={registration.event.imageUrl}
                                            alt={registration.event.title}
                                            className="w-full md:w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3
                                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                                    onClick={() => navigate(`/events/${registration.event.id}`)}
                                                >
                                                    {registration.event.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(registration.event.startDate).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <StatusBadge status={registration.status} />
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            📍 {registration.event.location}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/events/${registration.event.id}`)}
                                            >
                                                View Details
                                            </Button>
                                            {canCancel && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleCancelRegistration(registration.id)}
                                                >
                                                    Cancel Registration
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

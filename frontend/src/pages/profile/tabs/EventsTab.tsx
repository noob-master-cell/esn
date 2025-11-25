import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../components/shared/StatusBadge";
import type { Registration } from "../types";

interface EventsTabProps {
    allRegistrations: Registration[];
    registrationsLoading: boolean;
    cancelRegistration: (id: string) => Promise<any>;
    createRegistration: (options: any) => Promise<any>;
    refetchRegistrations: () => void;
    setUpdateSuccess: (value: boolean) => void;
    setUpdateError: (value: string) => void;
    filter: 'all' | 'upcoming' | 'past' | 'cancelled';
    onFilterChange: (filter: 'all' | 'upcoming' | 'past' | 'cancelled') => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
    allRegistrations,
    registrationsLoading,
    cancelRegistration,
    createRegistration,
    refetchRegistrations,
    setUpdateSuccess,
    setUpdateError,
    filter,
    onFilterChange,
}) => {
    const navigate = useNavigate();
    // Removed local state eventFilter

    const getFilteredRegistrations = () => {
        const now = new Date();
        switch (filter) {
            case 'upcoming':
                return allRegistrations.filter((r: Registration) => {
                    const endDate = new Date(r.event.endDate);
                    const isCompleted = r.event.status === 'COMPLETED' || r.event.status === 'CANCELLED';
                    const isRegistrationCancelled = r.status === 'CANCELLED';
                    return endDate > now && !isCompleted && !isRegistrationCancelled;
                });
            case 'past':
                return allRegistrations.filter((r: Registration) => {
                    const endDate = new Date(r.event.endDate);
                    const isCompleted = r.event.status === 'COMPLETED';
                    const isAttended = r.status === 'ATTENDED';
                    return endDate <= now || isCompleted || isAttended;
                });
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

    const handleReRegister = async (eventId: string) => {
        if (window.confirm("Do you want to re-register for this event?")) {
            try {
                await createRegistration({
                    variables: {
                        createRegistrationInput: {
                            eventId,
                            registrationType: 'REGULAR', // Default
                        }
                    }
                });
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
                refetchRegistrations();
            } catch (error) {
                console.error('Re-register error:', error);
                setUpdateError('Failed to re-register. The event might be full or closed.');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                <div className="flex bg-gray-100/80 p-1.5 rounded-xl backdrop-blur-sm">
                    {(['all', 'upcoming', 'past', 'cancelled'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${filter === f
                                ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {registrationsLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl h-32 animate-pulse shadow-sm"></div>
                    ))}
                </div>
            ) : registrations.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="text-6xl mb-6 opacity-50 grayscale">🎫</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        {filter === 'all' ? "You haven't registered for any events yet. Explore our upcoming events and join the fun!" : `You don't have any ${filter} events.`}
                    </p>
                    <Button onClick={() => navigate("/events")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20">
                        Browse Events
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {registrations.map((registration: Registration) => {
                        const isUpcoming = new Date(registration.event.startDate) > new Date();
                        const canCancel = isUpcoming && registration.status !== 'CANCELLED';
                        const eventDate = new Date(registration.event.startDate);
                        const isCompleted = registration.event.status === 'COMPLETED';

                        return (
                            <div
                                key={registration.id}
                                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative shrink-0">
                                        {registration.event.images && registration.event.images.length > 0 ? (
                                            <img
                                                src={registration.event.images[0]}
                                                alt={registration.event.title}
                                                className="w-full md:w-48 h-48 md:h-32 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                                            />
                                        ) : (
                                            <div className="w-full md:w-48 h-48 md:h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-200">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 md:hidden">
                                            <StatusBadge status={registration.status} />
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3 text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">
                                                    <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    <span className="w-1 h-1 bg-blue-200 rounded-full"></span>
                                                    <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="hidden md:block">
                                                    <StatusBadge status={registration.status} />
                                                </div>
                                            </div>

                                            <h3
                                                className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors mb-2 line-clamp-1"
                                                onClick={() => navigate(`/events/${registration.event.id}`)}
                                            >
                                                {registration.event.title}
                                            </h3>

                                            <p className="text-gray-500 flex items-center gap-2 text-sm mb-4">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {registration.event.location}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50 mt-auto">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/events/${registration.event.id}`)}
                                                className="rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                            >
                                                View Details
                                            </Button>
                                            {canCancel && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors ml-auto"
                                                    onClick={() => handleCancelRegistration(registration.id)}
                                                >
                                                    Cancel Registration
                                                </Button>
                                            )}
                                            {registration.status === 'CANCELLED' && isUpcoming && !isCompleted && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 border-green-100 hover:bg-green-50 hover:border-green-200 rounded-lg transition-colors ml-auto"
                                                    onClick={() => handleReRegister(registration.event.id)}
                                                >
                                                    Re-register
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

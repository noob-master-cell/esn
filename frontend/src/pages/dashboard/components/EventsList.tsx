import React from "react";
import { RegistrationEventCard } from "../../../components/dashboard/RegistrationEventCard";

interface Registration {
    id: string;
    status: string;
    registrationType: string;
    position?: number;
    paymentRequired: boolean;
    paymentStatus: string;
    amountDue: number;
    currency: string;
    specialRequests?: string;
    dietary?: string;
    registeredAt: string;
    confirmedAt?: string;
    event: {
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        location: string;
        address?: string;
        imageUrl?: string;
        category: string;
        type: string;
        price?: number;
        memberPrice?: number;
    };
}

interface EventsListProps {
    registrations: Registration[];
    onRegistrationCancelled: () => void;
}

export const EventsList: React.FC<EventsListProps> = ({
    registrations,
    onRegistrationCancelled,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                <div className="text-sm text-gray-600">
                    {registrations.length} event{registrations.length !== 1 ? "s" : ""}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {registrations.map((registration: Registration) => (
                    <RegistrationEventCard
                        key={registration.id}
                        registration={registration}
                        onRegistrationCancelled={onRegistrationCancelled}
                    />
                ))}
            </div>
        </div>
    );
};

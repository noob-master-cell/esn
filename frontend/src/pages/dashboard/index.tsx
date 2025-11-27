import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMyRegistrations } from "../../hooks/api/useRegistration";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { StatsCards } from "./components/StatsCards";
import { QuickActions } from "./components/QuickActions";
import { EmptyState } from "./components/EmptyState";
import { EventsList } from "./components/EventsList";
import { Avatar } from "../../components/ui/Avatar";

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

const DashboardPage: React.FC = () => {
    const { isSignedIn, isLoaded, user } = useAuth();
    const navigate = useNavigate();

    const { registrations, loading, error, refetch } = useMyRegistrations({
        skip: !isSignedIn,
    });

    const handleRegistrationCancelled = () => {
        refetch();
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <Alert
                        type="error"
                        title="Failed to load dashboard"
                        message="There was an error loading your dashboard. Please try again."
                    />
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Sign In Required
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You need to sign in to view your dashboard.
                        </p>
                        <Button className="w-full">Sign In</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <Avatar
                            src={user?.publicMetadata?.avatar as string}
                            alt={`${user?.firstName} ${user?.lastName}`}
                            fallback={`${user?.firstName?.[0]}${user?.lastName?.[0]}`}
                            size="lg"
                            bordered
                        />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Welcome back, {user?.firstName}!
                            </h1>
                            <p className="text-sm md:text-base text-gray-600">
                                Manage your event registrations and discover new events
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Completion Alert */}
                {(!user?.publicMetadata?.university ||
                    !user?.publicMetadata?.esnCardNumber) && (
                        <div className="mb-6 md:mb-8">
                            <Alert
                                type="warning"
                                title="Complete Your Profile"
                                message={
                                    <span>
                                        Please complete your profile to get the most out of ESN.{" "}
                                        <button
                                            onClick={() => navigate("/profile")}
                                            className="font-medium underline hover:text-yellow-800"
                                        >
                                            Go to Profile
                                        </button>
                                    </span>
                                }
                            />
                        </div>
                    )}

                <StatsCards
                    totalEvents={registrations.length}
                    confirmedEvents={
                        registrations.filter((r: Registration) => r.status === "CONFIRMED")
                            .length
                    }
                    waitlistedEvents={
                        registrations.filter((r: Registration) => r.status === "WAITLISTED")
                            .length
                    }
                />

                <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
                    <div className="lg:col-span-1">
                        <QuickActions />
                    </div>

                    <div className="lg:col-span-3">
                        {registrations.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <EventsList
                                registrations={registrations}
                                onRegistrationCancelled={handleRegistrationCancelled}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

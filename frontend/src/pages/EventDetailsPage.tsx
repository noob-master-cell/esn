import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useAuth, useUser } from "@clerk/clerk-react";
import { GET_EVENT } from "../lib/graphql/events";
import { useRegistration } from "../hooks/useRegistration";
import EventDetails from "../components/events/EventDetails";

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  location: string;
  address?: string;
  maxParticipants: number;
  registrationCount: number;
  price?: number;
  memberPrice?: number;
  imageUrl?: string;
  category: string;
  type: string;
  status: string;
  tags?: string[];
  requirements?: string;
  additionalInfo?: string;
  organizer: {
    firstName: string;
    lastName: string;
  };
  canRegister?: boolean;
  isRegistered?: boolean;
}

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [shareStats, setShareStats] = useState<Record<string, number>>({});

  // Fetch event data
  const { data, loading, error, refetch } = useQuery(GET_EVENT, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });

  // Get registration status using existing hook
  const {
    isRegistered,
    registration,
    isLoading: registrationLoading,
    canRegister,
    registrationStatus,
  } = useRegistration(id || "");

  // Extract event from data - with null check
  const event: Event | null = data?.event || null;

  // Handle registration click - use existing registration page
  const handleRegisterClick = () => {
    if (!isSignedIn) {
      navigate("/sign-in", {
        state: { returnTo: `/events/${id}` },
      });
      return;
    }

    // Check if already registered
    if (isRegistered) {
      // Could show a toast or alert
      console.log("User is already registered for this event");
      return;
    }

    // Navigate to your existing registration page
    navigate(`/events/${id}/register`);
  };

  // Handle social sharing
  const handleShare = (platform: string) => {
    setShareStats((prev) => ({
      ...prev,
      [platform]: (prev[platform] || 0) + 1,
    }));

    // Analytics tracking could go here
    console.log(`Shared event ${id} via ${platform}`);
  };

  // Loading state
  if (loading || registrationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-6 max-w-4xl w-full p-4">
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state or event not found
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-red-700 mb-6">
            {error?.message ||
              "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Add registration status to event object
  const eventWithRegistration = {
    ...event,
    isRegistered,
    canRegister: canRegister && !isRegistered,
  };

  // Calculate spots left
  const spotsLeft = event.maxParticipants - event.registrationCount;

  // Main event details view - only render when event exists
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-friendly container */}
      <div className="max-w-4xl mx-auto bg-white shadow-sm">
        <EventDetails
          event={eventWithRegistration}
          loading={false}
          onRegister={handleRegisterClick}
          onShare={handleShare}
        />
      </div>

      {/* Quick action buttons for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
        <div className="max-w-sm mx-auto">
          {isRegistered ? (
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-4 px-6 bg-green-100 text-green-800 rounded-xl font-semibold text-lg"
              >
                ✓ You're registered
              </button>
              {registration && (
                <p className="text-xs text-center text-gray-600">
                  Status: {registration.status}
                  {registration.registrationType === "WAITLIST" &&
                    " (Waitlisted)"}
                </p>
              )}
            </div>
          ) : spotsLeft > 0 ? (
            <button
              onClick={handleRegisterClick}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Register Now
            </button>
          ) : canRegister ? (
            <button
              onClick={handleRegisterClick}
              className="w-full py-4 px-6 bg-orange-600 text-white rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors"
            >
              Join Waitlist
            </button>
          ) : (
            <button
              disabled
              className="w-full py-4 px-6 bg-gray-300 text-gray-600 rounded-xl font-semibold text-lg"
            >
              Registration Closed
            </button>
          )}
        </div>
      </div>

      {/* Bottom padding for mobile sticky button */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default EventDetailsPage;

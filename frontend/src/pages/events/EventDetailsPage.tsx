import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEvent } from "../../hooks/api/useEvents";
import { useRegistrationStatus } from "../../hooks/api/useRegistration";
import EventDetails from "../../components/events/EventDetails";

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Handle edge case where "create" might be passed as ID
  const isCreateRoute = id === "create";

  // Fetch event data
  const { event, loading, error } = useEvent(isCreateRoute ? "" : (id || ""));

  if (isCreateRoute) {
    return <Navigate to="/admin/events/create" replace />;
  }

  // Get registration status using existing hook
  const {
    isRegistered,

    isLoading: registrationLoading,
    canRegister,
  } = useRegistrationStatus(id || "");

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

      return;
    }

    // Navigate to your existing registration page
    navigate(`/events/${id}/register`);
  };

  // Handle social sharing
  const handleShare = (_platform: string) => {
    // Analytics tracking could go here

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


    </div>
  );
};

export default EventDetailsPage;

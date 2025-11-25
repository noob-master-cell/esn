import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEvent } from "../../hooks/api/useEvents";
import { useRegistration, useRegistrationStatus } from "../../hooks/api/useRegistration";
import { useMyProfile } from "../../hooks/api/useUsers";
import {
  CalendarIcon,
  MapPinIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

const EventRegistrationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const { user: profile } = useMyProfile();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Handle edge case where "create" might be passed as ID
  const isCreateRoute = id === "create";

  // Get event data
  const { event, loading, error } = useEvent(isCreateRoute ? "" : (id || ""));

  if (isCreateRoute) {
    return <Navigate to="/admin/events/create" replace />;
  }

  // Get registration status
  const {
    isRegistered,
    isLoading: statusLoading,
  } = useRegistrationStatus(id || "");

  // Registration mutation
  const { register, isLoading: registering, error: registrationError } = useRegistration({
    eventId: id || "",
    onSuccess: () => {
      setRegistrationSuccess(true);
      // Optional: Redirect after a delay, or let user choose
      // setTimeout(() => navigate(`/events/${id}`), 3000);
    },
  });

  const isAlreadyRegistered = isRegistered;

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
      return;
    }

    if (isAlreadyRegistered) return;

    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    try {
      await register({});
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  // Loading state
  if (loading || statusLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const startDateTime = formatDateTime(event.startDate);
  const endDateTime = formatDateTime(event.endDate);
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const isEventFull = spotsLeft <= 0;

  // Use event images or fallback
  const coverImage = event.images && event.images.length > 0
    ? event.images[0]
    : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop";

  // Success State (Premium Confirmation)
  if (registrationSuccess || isAlreadyRegistered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-green-500 to-emerald-600"></div>

          <div className="relative pt-16 px-8 pb-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
              <CheckCircleIcon className="w-14 h-14 text-green-500" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">You're In!</h2>
            <p className="text-gray-500 mb-8">
              Your spot for <span className="font-semibold text-gray-900">{event.title}</span> is confirmed.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CalendarIcon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{startDateTime.date}</div>
                  <div className="text-sm text-gray-500">{startDateTime.time} - {endDateTime.time}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPinIcon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{event.location}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{event.address}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/events/${id}`)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200"
              >
                View Ticket
              </button>
              <button
                onClick={() => navigate("/events")}
                className="w-full py-3 bg-white text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Browse More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-gray-900 selection:text-white">
      <main className="pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Your Spot</h1>
            <p className="text-gray-500">Complete your registration for {event.title}</p>
          </div>

          {/* Error Alert */}
          {registrationError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                <p className="text-sm text-red-600 mt-1">{registrationError.message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Left: Event Summary */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="aspect-video w-full rounded-xl bg-gray-100 mb-4 overflow-hidden">
                  <img src={coverImage} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 mb-4">{event.title}</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{startDateTime.date}</div>
                      <div className="text-gray-500">{startDateTime.time}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{event.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <TicketIcon className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.price ? `€${event.price}` : 'Free'}
                      </div>
                      {event.memberPrice && (
                        <div className="text-green-600 text-xs font-medium">
                          €{event.memberPrice} for members
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Registration Form */}
            <div className="md:col-span-8">
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-8">

                  {/* User Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <UserCircleIcon className="w-6 h-6 text-blue-600" />
                      Attendee Details
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">Name</label>
                          <div className="font-medium text-gray-900">
                            {profile?.firstName} {profile?.lastName || user?.name}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">Email</label>
                          <div className="font-medium text-gray-900">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                      Terms & Conditions
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 h-32 overflow-y-auto text-sm text-gray-600">
                      <p>
                        By registering for this event, you agree to abide by the ESN Kaiserslautern code of conduct.
                        Cancellations must be made at least 24 hours in advance.
                        Photos and videos may be taken during the event for promotional purposes.
                      </p>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400"
                        />
                        <CheckCircleIcon className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        I have read and agree to the terms and conditions
                      </span>
                    </label>
                  </div>

                  {/* Action */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSubmit}
                      disabled={!acceptTerms || registering || isEventFull}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2"
                    >
                      {registering ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : isEventFull ? (
                        'Event Full'
                      ) : (
                        'Confirm Registration'
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                      Secure registration powered by ESN
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default EventRegistrationPage;
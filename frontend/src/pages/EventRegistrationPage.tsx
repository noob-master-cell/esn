// frontend/src/pages/EventRegistrationPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENT } from "../lib/graphql/events";
import {
  REGISTER_FOR_EVENT,
  GET_MY_REGISTRATIONS,
} from "../lib/graphql/registrations";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

// SVG Icon Components
const CalendarIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ></path>
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);

// A reusable component to display event info with an icon
const InfoBlock = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center text-lg text-gray-700">
    {icon}
    {children}
  </div>
);

interface EventRegistrationPageProps {}

const EventRegistrationPage: React.FC<EventRegistrationPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Get event data
  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { id },
    skip: !id,
  });

  // Get user's registrations to check if already registered
  const {
    data: registrationsData,
    loading: registrationsLoading,
    error: registrationsError,
  } = useQuery(GET_MY_REGISTRATIONS, {
    skip: !isSignedIn,
    fetchPolicy: "cache-and-network", // Ensure we get fresh data
  });

  // Registration mutation
  const [registerForEvent, { loading: registering, error: registrationError }] =
    useMutation(REGISTER_FOR_EVENT, {
      onCompleted: () => {
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate(`/events/${id}`);
        }, 3000);
      },
      // Refetch registrations after successful registration
      refetchQueries: [
        { query: GET_MY_REGISTRATIONS },
        { query: GET_EVENT, variables: { id } },
      ],
    });

  // Check if user is already registered for this event
  const userRegistration = registrationsData?.myRegistrations?.find(
    (reg: any) => reg.event.id === id && reg.status !== "CANCELLED"
  );

  const isAlreadyRegistered = !!userRegistration;

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
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

    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    // Prevent registration if already registered
    if (isAlreadyRegistered) {
      console.warn("User is already registered for this event");
      return;
    }

    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    try {
      await registerForEvent({
        variables: {
          createRegistrationInput: {
            eventId: id,
          },
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  // Loading state
  if (loading || registrationsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 md:p-10">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.event) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The event you're trying to register for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => navigate("/events")} variant="primary">
              ← Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const event = data.event;
  const startDateTime = formatDateTime(event.startDate);
  const endDateTime = formatDateTime(event.endDate);
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const isEventFull = spotsLeft <= 0;
  const effectivePrice = event.memberPrice || event.price || 0;
  const isWaitlistRegistration = isEventFull && event.allowWaitlist;
  const eventImage =
    event.imageUrl ||
    `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop`;

  // Check if registration deadline has passed
  const isRegistrationClosed = event.registrationDeadline
    ? new Date(event.registrationDeadline) < new Date()
    : false;

  if (!isSignedIn) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to register for events.
            </p>
            <Button
              onClick={() => navigate("/sign-in")}
              className="w-full mb-3"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/events")}
              variant="outline"
              className="w-full"
            >
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Already Registered State
  if (isAlreadyRegistered) {
    const getRegistrationStatusDisplay = () => {
      const status = userRegistration.status;
      const statusConfig = {
        CONFIRMED: {
          bg: "bg-green-50 border-green-200",
          text: "text-green-800",
          icon: "✅",
          title: "Registration Confirmed",
          message: "You're all set for this event!",
        },
        PENDING: {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          icon: "⏳",
          title: "Registration Pending",
          message: userRegistration.paymentRequired
            ? "Payment required to confirm your registration"
            : "Your registration is being processed",
        },
        WAITLISTED: {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: "⏰",
          title: "On Waitlist",
          message: userRegistration.position
            ? `You're #${userRegistration.position} on the waitlist`
            : "You'll be notified if a spot becomes available",
        },
      };

      const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.CONFIRMED;

      return (
        <div className={`border rounded-lg p-6 ${config.bg}`}>
          <div className={`text-center ${config.text}`}>
            <div className="text-4xl mb-3">{config.icon}</div>
            <h3 className="text-xl font-bold mb-2">{config.title}</h3>
            <p className="text-base">{config.message}</p>

            {/* Additional registration details */}
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Registered:</strong>{" "}
                {new Date(userRegistration.registeredAt).toLocaleDateString()}
              </p>
              {userRegistration.amountDue > 0 && (
                <p>
                  <strong>Amount Due:</strong> €{userRegistration.amountDue}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Event Image */}
            <div
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${eventImage})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="text-white p-6">
                  <h1 className="text-3xl font-bold">{event.title}</h1>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
              {/* Event Details */}
              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoBlock icon={<CalendarIcon />}>
                    <div>
                      <p className="font-medium">{startDateTime.date}</p>
                      <p className="text-gray-600">
                        {startDateTime.time} - {endDateTime.time}
                      </p>
                    </div>
                  </InfoBlock>

                  <InfoBlock icon={<LocationIcon />}>
                    <div>
                      <p className="font-medium">{event.location}</p>
                      {event.address && (
                        <p className="text-gray-600">{event.address}</p>
                      )}
                    </div>
                  </InfoBlock>
                </div>
              </div>

              {/* Registration Status */}
              <div className="mb-8">{getRegistrationStatusDisplay()}</div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate(`/events/${id}`)}
                  variant="primary"
                  className="flex-1"
                >
                  View Event Details
                </Button>
                <Button
                  onClick={() => navigate("/profile")}
                  variant="outline"
                  className="flex-1"
                >
                  View My Registrations
                </Button>
                <Button
                  onClick={() => navigate("/events")}
                  variant="outline"
                  className="flex-1"
                >
                  Browse Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration closed state
  if (isRegistrationClosed) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Closed
            </h2>
            <p className="text-gray-600 mb-6">
              The registration deadline for this event has passed.
            </p>
            <Button
              onClick={() => navigate(`/events/${id}`)}
              className="w-full mb-3"
            >
              View Event Details
            </Button>
            <Button
              onClick={() => navigate("/events")}
              variant="outline"
              className="w-full"
            >
              Browse Other Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Success Message */}
      {registrationSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="success"
            title="Registration Successful!"
            message="You have been successfully registered for this event. Redirecting to event details..."
          />
        </div>
      )}

      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Event Image */}
          <div
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${eventImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="text-white p-6">
                <h1 className="text-3xl font-bold">{event.title}</h1>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Event Details */}
            <div className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoBlock icon={<CalendarIcon />}>
                  <div>
                    <p className="font-medium">{startDateTime.date}</p>
                    <p className="text-gray-600">
                      {startDateTime.time} - {endDateTime.time}
                    </p>
                  </div>
                </InfoBlock>

                <InfoBlock icon={<LocationIcon />}>
                  <div>
                    <p className="font-medium">{event.location}</p>
                    {event.address && (
                      <p className="text-gray-600">{event.address}</p>
                    )}
                  </div>
                </InfoBlock>
              </div>

              {/* Event Description */}
              {event.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About This Event
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Capacity Information */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Event Capacity</span>
                  <span className="font-medium">
                    {event.registrationCount} / {event.maxParticipants}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isEventFull ? "bg-red-500" : "bg-blue-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        (event.registrationCount / event.maxParticipants) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                {spotsLeft > 0 ? (
                  <p className="text-sm text-gray-600 mt-2">
                    {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    Event is full
                    {event.allowWaitlist && " - Join waitlist below"}
                  </p>
                )}
              </div>
            </div>

            {/* Waitlist Notice */}
            {isWaitlistRegistration && (
              <div className="mb-8">
                <Alert
                  type="info"
                  title="Join Waitlist"
                  message="This event is full, but you can join the waitlist. You'll be added to the waitlist and notified if a spot becomes available."
                />
              </div>
            )}

            {/* Error Display */}
            {registrationError && (
              <div className="mb-8">
                <Alert
                  type="error"
                  title="Registration Failed"
                  message={registrationError.message}
                />
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* User Information Display */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <UserIcon />
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Information
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Terms and Conditions
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700">
                    By registering for this event, you agree to abide by our
                    community guidelines and event policies...
                  </p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">
                    I accept the terms and conditions
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={!acceptTerms || registering}
                  className="flex-1"
                >
                  {registering ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isWaitlistRegistration
                        ? "Joining Waitlist..."
                        : "Registering..."}
                    </div>
                  ) : (
                    <>
                      {isWaitlistRegistration
                        ? "Join Waitlist"
                        : "Register for Event"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/events/${id}`)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>

              {/* Price Information */}
              {effectivePrice > 0 && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    Registration Fee: €{effectivePrice}
                  </p>
                  {event.memberPrice &&
                    event.price &&
                    event.memberPrice < event.price && (
                      <p className="text-sm text-blue-600">
                        ESN Members: €{event.memberPrice} (Regular: €
                        {event.price})
                      </p>
                    )}
                  <p className="text-sm text-gray-600 mt-2">
                    Payment will be processed after registration
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
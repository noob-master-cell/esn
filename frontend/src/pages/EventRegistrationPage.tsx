// frontend/src/pages/EventRegistrationPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth, useUser } from "@clerk/clerk-react";
import { GET_EVENT } from "../lib/graphql/events";
import { REGISTER_FOR_EVENT } from "../lib/graphql/registrations";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

// ----------- SVG Icon Components ----------- //

const CalendarIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-gray-500"
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

const ClockIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const LocationPinIcon = () => (
  <svg
    className="w-5 h-5 mr-3 text-gray-500"
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

const InfoIcon = () => (
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
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { id },
    skip: !id,
  });

  const [registerForEvent, { loading: registering, error: registrationError }] =
    useMutation(REGISTER_FOR_EVENT, {
      onCompleted: () => {
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate(`/events/${id}`);
        }, 3000);
      },
    });

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

  if (loading) {
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Success Message */}
      {registrationSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="success"
            title="Registration Successful!"
            message="You have been successfully registered for this event. Redirecting..."
            onClose={() => setRegistrationSuccess(false)}
          />
        </div>
      )}

      {/* Back Button */}
      <div className="container mx-auto p-4 pt-8">
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Event Details
        </button>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Event Summary */}
          <div
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url('${eventImage}')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                {isWaitlistRegistration
                  ? "Join Waitlist"
                  : "Register for Event"}
              </h1>
              <p className="text-xl opacity-90 mt-2">{event.title}</p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column: Registration Form */}
              <div className="lg:col-span-2">
                {/* Event Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Event Summary
                  </h2>
                  <div className="space-y-3">
                    <InfoBlock icon={<CalendarIcon />}>
                      {startDateTime.date}
                    </InfoBlock>
                    <InfoBlock icon={<ClockIcon />}>
                      {startDateTime.time} - {endDateTime.time}
                    </InfoBlock>
                    <InfoBlock icon={<LocationPinIcon />}>
                      {event.location}
                      {event.address && (
                        <span className="block text-sm text-gray-500 ml-8">
                          {event.address}
                        </span>
                      )}
                    </InfoBlock>
                  </div>
                </div>

                {/* Waitlist Warning */}
                {isWaitlistRegistration && (
                  <div className="mb-8">
                    <Alert
                      type="warning"
                      title="Event is Full"
                      message="This event has reached maximum capacity. You'll be added to the waitlist and notified if a spot becomes available."
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
                        <span className="text-gray-600 font-medium">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {user?.primaryEmailAddress?.emailAddress}
                        </span>
                      </div>
                      {user?.phoneNumbers?.[0]?.phoneNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Phone:
                          </span>
                          <span className="text-gray-900">
                            {user.phoneNumbers[0].phoneNumber}
                          </span>
                        </div>
                      )}
                      {user?.publicMetadata?.university && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            University:
                          </span>
                          <span className="text-gray-900">
                            {user.publicMetadata.university as string}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This information will be used for
                        your registration. To update your details, please visit
                        your{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/profile")}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          profile page
                        </button>
                        .
                      </p>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <InfoIcon />
                      <h3 className="text-xl font-bold text-gray-900">
                        Terms & Conditions
                      </h3>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="text-sm text-gray-700"
                      >
                        I accept the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          terms and conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          cancellation policy
                        </a>
                        . I understand that this registration is binding and may
                        be subject to cancellation fees.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/events/${id}`)}
                      className="flex-1"
                      disabled={registering}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                      loading={registering}
                      disabled={registering || !acceptTerms}
                    >
                      {registering
                        ? "Registering..."
                        : isWaitlistRegistration
                        ? "Join Waitlist"
                        : event.type === "FREE"
                        ? "Register for Free"
                        : `Pay €${effectivePrice} & Register`}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Right Column: Event Details & Pricing */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl shadow-inner p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-center mb-6">
                    Registration Details
                  </h2>

                  {/* Price Display */}
                  <div className="text-center mb-6">
                    {event.type === "FREE" ? (
                      <p className="text-4xl font-extrabold text-green-600">
                        FREE
                      </p>
                    ) : (
                      <>
                        <p className="text-4xl font-extrabold text-gray-800">
                          €{effectivePrice.toFixed(2)}
                        </p>
                        <p className="text-gray-500">
                          {event.memberPrice &&
                          event.memberPrice < (event.price || 0)
                            ? "ESN Member Price"
                            : "Standard Price"}
                        </p>
                      </>
                    )}
                  </div>

                  {/* ESN Card Discount */}
                  {event.memberPrice &&
                    event.memberPrice < (event.price || 0) && (
                      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md mb-6">
                        <p className="font-bold text-sm">
                          You're getting the ESN Card discount!
                        </p>
                        <p className="text-sm">
                          Regular price: €{event.price?.toFixed(2)}
                        </p>
                      </div>
                    )}

                  {/* Event Status */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">
                        {event.registrationCount}/{event.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (event.registrationCount / event.maxParticipants) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <span
                        className={`font-bold ${
                          spotsLeft > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {spotsLeft > 0
                          ? `${spotsLeft} spots remaining`
                          : "Event is full"}
                      </span>
                      {isWaitlistRegistration && (
                        <p className="text-sm text-orange-600 mt-1">
                          Waitlist registration available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  {event.type !== "FREE" && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Payment Information
                      </h3>
                      <p className="text-blue-800 text-sm">
                        You will be charged <strong>€{effectivePrice}</strong>{" "}
                        for this registration.
                        {!isWaitlistRegistration
                          ? " Payment will be processed immediately upon confirmation."
                          : " You will only be charged if your waitlist registration is confirmed."}
                      </p>
                    </div>
                  )}

                  {/* Organizer Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Organizer
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {event.organizer.firstName[0]}
                        {event.organizer.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.organizer.firstName} {event.organizer.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.organizer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;

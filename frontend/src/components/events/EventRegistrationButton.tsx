// frontend/src/components/events/EventRegistrationButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REGISTER_FOR_EVENT } from "../../lib/graphql/registrations";
import { useRegistrationStatus } from "../../hooks/useRegistrationStatus";
import { RegistrationStatus } from "./RegistrationStatus";

interface EventRegistrationButtonProps {
  event: {
    id: string;
    title: string;
    status: string;
    maxParticipants: number;
    registrationCount: number;
    waitlistCount?: number;
    allowWaitlist: boolean;
    price?: number;
    memberPrice?: number;
    type: string;
    registrationDeadline?: string;
  };
  onRegistrationChange?: () => void;
}

export const EventRegistrationButton: React.FC<
  EventRegistrationButtonProps
> = ({ event, onRegistrationChange }) => {
  const navigate = useNavigate();

  // Use the registration status hook
  const {
    isRegistered,
    registration,
    isLoading: statusLoading,
    canRegister,
  } = useRegistrationStatus(event.id);

  const [registerForEvent, { loading: registering }] = useMutation(
    REGISTER_FOR_EVENT,
    {
      onCompleted: () => {
        onRegistrationChange?.();
      },
      onError: (error) => {
        console.error("Registration error:", error);

        // Handle specific error for already registered
        if (error.message.includes("already registered")) {
          alert("You are already registered for this event!");
        } else {
          alert(`Registration failed: ${error.message}`);
        }
      },
      // Refetch registrations to update status
      refetchQueries: ["GetMyRegistrations"],
    }
  );

  // Calculate event status
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const isEventFull = spotsLeft <= 0;
  const canJoinWaitlist = isEventFull && event.allowWaitlist && canRegister;
  const canRegisterForSpot = !isEventFull && canRegister;

  // Check if registration deadline has passed
  const isRegistrationClosed = event.registrationDeadline
    ? new Date(event.registrationDeadline) < new Date()
    : false;

  const handleQuickRegister = async () => {
    // Prevent registration if already registered
    if (isRegistered) {
      alert("You are already registered for this event!");
      return;
    }

    if (!canRegisterForSpot && !canJoinWaitlist) {
      alert("Registration is not available for this event.");
      return;
    }

    try {
      await registerForEvent({
        variables: {
          createRegistrationInput: {
            eventId: event.id,
            registrationType: isEventFull ? "WAITLIST" : "REGULAR",
          },
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleDetailedRegister = () => {
    // Prevent navigation if already registered
    if (isRegistered) {
      alert("You are already registered for this event!");
      return;
    }

    navigate(`/events/${event.id}/register`);
  };

  const getPrice = () => {
    if (event.type === "FREE") {
      return <span className="text-green-600 font-semibold">Free</span>;
    }

    if (event.price) {
      return (
        <div>
          <span className="text-lg font-semibold">€{event.price}</span>
          {event.memberPrice && event.memberPrice < event.price && (
            <span className="text-sm text-blue-600 ml-2">
              (ESN Members: €{event.memberPrice})
            </span>
          )}
        </div>
      );
    }

    return null;
  };

  // Loading state
  if (statusLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If user is already registered, show registration status
  if (isRegistered) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Event Registration
          </h3>
          {getPrice()}
        </div>

        {/* Registration Status */}
        <RegistrationStatus
          eventId={event.id}
          className="mb-6"
          showDetails={true}
        />

        {/* Capacity Information */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Registered</span>
            <span>
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
            <p className="text-sm text-gray-600 mt-2 text-center">
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
            </p>
          ) : (
            <p className="text-sm text-red-600 mt-2 text-center font-medium">
              Event is full
              {event.waitlistCount && event.waitlistCount > 0 && (
                <span className="block text-blue-600">
                  {event.waitlistCount} on waitlist
                </span>
              )}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Event Details
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Manage Registration
          </button>
        </div>
      </div>
    );
  }

  // Registration closed state
  if (isRegistrationClosed) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Registration Closed
        </h3>
        <p className="text-gray-600">Registration deadline has passed</p>
        <button
          onClick={() => navigate(`/events/${event.id}`)}
          className="mt-4 w-full bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          View Event Details
        </button>
      </div>
    );
  }

  // Default registration form
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {canJoinWaitlist ? "Join Waitlist" : "Register for Event"}
        </h3>
        {getPrice()}
      </div>

      {/* Capacity Information */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Registered</span>
          <span>
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
          <p className="text-sm text-gray-600 mt-2 text-center">
            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
          </p>
        ) : (
          <p className="text-sm text-red-600 mt-2 text-center font-medium">
            Event is full
            {event.waitlistCount && event.waitlistCount > 0 && (
              <span className="block text-blue-600">
                {event.waitlistCount} on waitlist
              </span>
            )}
          </p>
        )}
      </div>

      {/* Registration Deadline Warning */}
      {event.registrationDeadline && !isRegistrationClosed && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-sm text-yellow-800">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span>
              Registration closes on{" "}
              {new Date(event.registrationDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {canRegisterForSpot || canJoinWaitlist ? (
          <>
            <button
              onClick={handleQuickRegister}
              disabled={registering}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
                canJoinWaitlist
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {registering ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {canJoinWaitlist ? "Joining Waitlist..." : "Registering..."}
                </div>
              ) : (
                <>{canJoinWaitlist ? "Join Waitlist" : "Register Now"}</>
              )}
            </button>

            <button
              onClick={handleDetailedRegister}
              disabled={registering}
              className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Detailed Registration
            </button>
          </>
        ) : (
          <div className="text-center">
            {isEventFull && !event.allowWaitlist ? (
              <span className="text-red-600 font-medium">Event Full</span>
            ) : (
              <span className="text-gray-600">Registration not available</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
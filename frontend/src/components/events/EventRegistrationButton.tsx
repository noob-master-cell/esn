// frontend/src/components/events/EventRegistrationButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  REGISTER_FOR_EVENT,
  GET_MY_REGISTRATIONS,
} from "../../lib/graphql/registrations";

interface EventRegistrationButtonProps {
  event: {
    id: string;
    title: string;
    status: string;
    maxParticipants: number;
    registrationCount: number;
    waitlistCount?: number;
    isRegistered?: boolean;
    canRegister?: boolean;
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

  const { data: registrationsData } = useQuery(GET_MY_REGISTRATIONS);

  const [registerForEvent, { loading: registering }] = useMutation(
    REGISTER_FOR_EVENT,
    {
      onCompleted: () => {
        onRegistrationChange?.();
      },
      onError: (error) => {
        console.error("Registration error:", error);
      },
    }
  );

  // Check if user is already registered
  const userRegistration = registrationsData?.myRegistrations?.find(
    (reg: any) => reg.event.id === event.id && reg.status !== "CANCELLED"
  );

  const isRegistered = event.isRegistered || !!userRegistration;
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const isEventFull = spotsLeft <= 0;
  const canJoinWaitlist = isEventFull && event.allowWaitlist && !isRegistered;
  const canRegister = event.canRegister && !isRegistered && !isEventFull;

  // Check if registration deadline has passed
  const isRegistrationClosed = event.registrationDeadline
    ? new Date(event.registrationDeadline) < new Date()
    : false;

  const handleQuickRegister = async () => {
    if (!canRegister && !canJoinWaitlist) return;

    try {
      await registerForEvent({
        variables: {
          createRegistrationInput: {
            eventId: event.id,
          },
        },
      });
    } catch (error) {
      console.error("Quick registration failed:", error);
    }
  };

  const handleDetailedRegister = () => {
    navigate(`/events/${event.id}/register`);
  };

  const getRegistrationStatus = () => {
    if (isRegistered) {
      const status = userRegistration?.status || "CONFIRMED";
      const statusConfig = {
        PENDING: {
          color: "bg-yellow-100 text-yellow-800",
          text: "Registration Pending",
        },
        CONFIRMED: { color: "bg-green-100 text-green-800", text: "Registered" },
        WAITLISTED: { color: "bg-blue-100 text-blue-800", text: "On Waitlist" },
        CANCELLED: { color: "bg-red-100 text-red-800", text: "Cancelled" },
      };

      const config =
        statusConfig[status as keyof typeof statusConfig] ||
        statusConfig.CONFIRMED;

      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {config.text}
        </span>
      );
    }
    return null;
  };

  const getPrice = () => {
    if (event.type === "FREE") {
      return <span className="text-2xl font-bold text-green-600">Free</span>;
    }

    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">€{event.price}</div>
        {event.memberPrice && event.memberPrice < (event.price || 0) && (
          <div className="text-sm text-green-600 font-medium">
            €{event.memberPrice} for ESN members
          </div>
        )}
      </div>
    );
  };

  if (event.status === "CANCELLED") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Event Cancelled
        </h3>
        <p className="text-gray-600">This event has been cancelled.</p>
      </div>
    );
  }

  if (event.status === "COMPLETED") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Event Completed
        </h3>
        <p className="text-gray-600">This event has already taken place.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {canJoinWaitlist ? "Join Waitlist" : "Register for Event"}
        </h3>
        {getPrice()}
      </div>

      {/* Registration Status */}
      {isRegistered && (
        <div className="mb-6 text-center">{getRegistrationStatus()}</div>
      )}

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
        {isRegistered ? (
          <div className="space-y-2">
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Event Details
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Manage My Registrations
            </button>
          </div>
        ) : isRegistrationClosed ? (
          <div className="text-center py-4">
            <div className="text-red-600 mb-2">
              <svg
                className="w-8 h-8 mx-auto"
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
            </div>
            <p className="text-sm text-gray-600">
              Registration deadline has passed
            </p>
          </div>
        ) : (
          <>
            {/* Quick Register Button */}
            {(canRegister || canJoinWaitlist) && event.type === "FREE" && (
              <button
                onClick={handleQuickRegister}
                disabled={registering}
                className={`w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors ${
                  canJoinWaitlist
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {registering ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    {canJoinWaitlist ? "Joining..." : "Registering..."}
                  </span>
                ) : (
                  <>{canJoinWaitlist ? "Join Waitlist" : "Register Now"}</>
                )}
              </button>
            )}

            {/* Detailed Registration Button */}
            {(canRegister || canJoinWaitlist) && (
              <button
                onClick={handleDetailedRegister}
                className={`w-full px-4 py-3 text-sm font-medium border rounded-lg transition-colors ${
                  event.type === "FREE"
                    ? "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                    : "text-white bg-blue-600 border-blue-600 hover:bg-blue-700"
                }`}
              >
                {event.type === "FREE"
                  ? "Register with Details"
                  : "Proceed to Payment"}
              </button>
            )}

            {/* Event Full Message */}
            {!canRegister && !canJoinWaitlist && !isRegistered && (
              <div className="text-center py-4">
                <div className="text-red-600 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  This event is full and waitlist is not available
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

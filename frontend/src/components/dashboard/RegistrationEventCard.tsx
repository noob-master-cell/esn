// frontend/src/components/dashboard/RegistrationEventCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CANCEL_REGISTRATION } from "../../lib/graphql/registrations";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

interface RegistrationEventCardProps {
  registration: {
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
  };
  onRegistrationCancelled?: () => void;
}

export const RegistrationEventCard: React.FC<RegistrationEventCardProps> = ({
  registration,
  onRegistrationCancelled,
}) => {
  const navigate = useNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [cancelRegistration, { loading: cancelling }] = useMutation(
    CANCEL_REGISTRATION,
    {
      onCompleted: () => {
        setShowCancelConfirm(false);
        onRegistrationCancelled?.();
      },
      onError: (error) => {
        setCancelError(error.message);
      },
    }
  );

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    let dateLabel = "";
    if (isToday) dateLabel = "Today";
    else if (isTomorrow) dateLabel = "Tomorrow";
    else
      dateLabel = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    return {
      dateLabel,
      fullDate: date.toLocaleDateString("en-US", {
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
      isPast: date < now,
      isUpcoming:
        date > now && date.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000, // Within 7 days
    };
  };

  // Get event type icon
  const getEventTypeIcon = (category: string) => {
    const icons = {
      PARTY: "🎉",
      CULTURAL: "🎭",
      SPORTS: "⚽",
      TRAVEL: "✈️",
      SOCIAL: "👥",
      EDUCATIONAL: "📚",
      VOLUNTEER: "🤝",
      NETWORKING: "🌐",
      WORKSHOP: "🔧",
      CONFERENCE: "🎤",
      OTHER: "📅",
    };
    return icons[category as keyof typeof icons] || icons.OTHER;
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    const configs = {
      CONFIRMED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Confirmed",
        icon: "✓",
      },
      WAITLISTED: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        label: `Waitlisted ${
          registration.position ? `#${registration.position}` : ""
        }`,
        icon: "⏳",
      },
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
        icon: "⏱️",
      },
      CANCELLED: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Cancelled",
        icon: "❌",
      },
      ATTENDED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Attended",
        icon: "🎯",
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  // Handle cancel registration
  const handleCancelRegistration = async () => {
    try {
      await cancelRegistration({
        variables: { id: registration.id },
      });
    } catch (error) {
      console.error("Cancel registration error:", error);
    }
  };

  const startDateTime = formatDateTime(registration.event.startDate);
  const statusConfig = getStatusConfig(registration.status);
  const eventImage =
    registration.event.imageUrl ||
    `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=200&fit=crop`;

  const canCancel =
    registration.status === "CONFIRMED" || registration.status === "WAITLISTED";
  const isPaidEvent = registration.event.type === "PAID";
  const effectivePrice =
    registration.event.memberPrice || registration.event.price || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Event Image */}
      <div className="relative h-40">
        <img
          src={eventImage}
          alt={registration.event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
          >
            <span>{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              startDateTime.isPast
                ? "bg-gray-100 text-gray-800"
                : startDateTime.isUpcoming
                ? "bg-blue-100 text-blue-800"
                : "bg-white/90 text-gray-800"
            }`}
          >
            {startDateTime.dateLabel}
          </div>
        </div>

        {/* Event Category Icon */}
        <div className="absolute bottom-3 left-3">
          <span className="text-2xl bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            {getEventTypeIcon(registration.event.category)}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title and Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {registration.event.title}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {startDateTime.fullDate} at {startDateTime.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span className="line-clamp-1">
                  {registration.event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Registration Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {isPaidEvent ? (
                <span className="font-medium text-gray-900">
                  €{effectivePrice}
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  Free
                </span>
              )}
              {registration.paymentRequired &&
                registration.paymentStatus !== "COMPLETED" && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium text-xs">
                    Payment Due
                  </span>
                )}
            </div>
            <div className="text-gray-500">
              Registered{" "}
              {new Date(registration.registeredAt).toLocaleDateString()}
            </div>
          </div>

          {/* Additional Info */}
          {(registration.specialRequests || registration.dietary) && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              {registration.dietary && (
                <div className="mb-1">
                  <span className="font-medium text-gray-700">Dietary:</span>{" "}
                  {registration.dietary}
                </div>
              )}
              {registration.specialRequests && (
                <div>
                  <span className="font-medium text-gray-700">
                    Special Requests:
                  </span>{" "}
                  {registration.specialRequests}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {cancelError && (
            <Alert
              type="error"
              message={cancelError}
              onClose={() => setCancelError(null)}
            />
          )}

          {/* Cancel Confirmation */}
          {showCancelConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">
                Cancel Registration?
              </h4>
              <p className="text-sm text-red-800 mb-4">
                Are you sure you want to cancel your registration for this
                event? This action cannot be undone.
                {isPaidEvent && " You may be charged a cancellation fee."}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelling}
                >
                  Keep Registration
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCancelRegistration}
                  loading={cancelling}
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/events/${registration.event.id}`)}
            >
              View Event
            </Button>
            {canCancel && !showCancelConfirm && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

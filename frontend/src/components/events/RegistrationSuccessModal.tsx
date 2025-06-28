// frontend/src/components/events/RegistrationSuccessModal.tsx
import React from "react";
import { Button } from "../ui/Button";

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: {
    event: {
      title: string;
      startDate: string;
      location: string;
    };
    status: string;
    position?: number;
    amountDue: number;
    currency: string;
  };
}

export const RegistrationSuccessModal: React.FC<
  RegistrationSuccessModalProps
> = ({ isOpen, onClose, registration }) => {
  if (!isOpen) return null;

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

  const startDateTime = formatDateTime(registration.event.startDate);
  const isWaitlisted = registration.status === "WAITLISTED";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Success Animation */}
          <div className="text-center pt-8 pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isWaitlisted ? "Added to Waitlist!" : "Registration Successful!"}
            </h2>
            <p className="text-gray-600">
              {isWaitlisted
                ? "You've been added to the waitlist and will be notified if a spot opens up."
                : "You're all set! We can't wait to see you at the event."}
            </p>
          </div>

          {/* Event Details */}
          <div className="px-8 pb-8">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                {registration.event.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{startDateTime.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{startDateTime.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">
                    {registration.event.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      isWaitlisted ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {isWaitlisted
                      ? `Waitlisted #${registration.position}`
                      : "Confirmed"}
                  </span>
                </div>
                {registration.amountDue > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      {registration.currency}
                      {registration.amountDue}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              {isWaitlisted ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    What happens next?
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>
                      • You're position #{registration.position} on the waitlist
                    </li>
                    <li>• We'll email you if a spot becomes available</li>
                    <li>• You can cancel your waitlist registration anytime</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    What happens next?
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Check your email for confirmation details</li>
                    <li>• Add the event to your calendar</li>
                    <li>• We'll send reminders before the event</li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Navigate to user dashboard
                    onClose();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  View My Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// frontend/src/components/events/EventRegistrationModal.tsx
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Alert } from "../ui/Alert";
import { REGISTER_FOR_EVENT } from "../../lib/graphql/registrations";

interface EventRegistrationModalProps {
  event: {
    id: string;
    title: string;
    startDate: string;
    location: string;
    price?: number;
    memberPrice?: number;
    type: string;
    maxParticipants: number;
    registrationCount: number;
    allowWaitlist: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    specialRequests: "",
    dietary: "",
    emergencyContact: "",
    emergencyEmail: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [registerForEvent, { loading, error }] = useMutation(
    REGISTER_FOR_EVENT,
    {
      onCompleted: () => {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          specialRequests: "",
          dietary: "",
          emergencyContact: "",
          emergencyEmail: "",
        });
        setAcceptTerms(false);
      },
    }
  );

  // Calculate pricing
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const isEventFull = spotsLeft <= 0;
  const effectivePrice = event.memberPrice || event.price || 0;
  const isWaitlistRegistration = isEventFull && event.allowWaitlist;

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      alert("Please sign in to register for events");
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
            eventId: event.id,
            specialRequests: formData.specialRequests || undefined,
            dietary: formData.dietary || undefined,
            emergencyContact: formData.emergencyContact || undefined,
            emergencyEmail: formData.emergencyEmail || undefined,
          },
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const startDateTime = formatDateTime(event.startDate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isWaitlistRegistration
                    ? "Join Waitlist"
                    : "Register for Event"}
                </h2>
                <p className="text-gray-600 mt-1">{event.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Event Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Event Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {startDateTime.date}, {startDateTime.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {event.type === "FREE" ? "Free" : `€${effectivePrice}`}
                    {event.memberPrice &&
                      event.memberPrice < (event.price || 0) && (
                        <span className="text-green-600 text-xs ml-1">
                          (ESN Member Price)
                        </span>
                      )}
                  </span>
                </div>
                {isWaitlistRegistration && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-orange-600">
                      Waitlist Registration
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Waitlist Warning */}
            {isWaitlistRegistration && (
              <div className="mb-6">
                <Alert
                  type="warning"
                  title="Event is Full"
                  message="This event has reached maximum capacity. You'll be added to the waitlist and notified if a spot becomes available."
                />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  title="Registration Failed"
                  message={error.message}
                />
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Requirements or Food Allergies
                    </label>
                    <textarea
                      name="dietary"
                      value={formData.dietary}
                      onChange={handleInputChange}
                      placeholder="Please specify any dietary requirements, allergies, or special meal preferences..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests or Accessibility Needs
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special accommodations, accessibility needs, or other requests..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Emergency Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Emergency Contact Name & Phone"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="John Doe - +49 123 456 7890"
                    required
                  />
                  <Input
                    label="Emergency Contact Email"
                    name="emergencyEmail"
                    type="email"
                    value={formData.emergencyEmail}
                    onChange={handleInputChange}
                    placeholder="emergency@example.com"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
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
                    . I understand that this registration is binding and may be
                    subject to cancellation fees.
                  </label>
                </div>
              </div>

              {/* Payment Information */}
              {event.type !== "FREE" && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Payment Information
                  </h3>
                  <p className="text-blue-800 text-sm">
                    You will be charged <strong>€{effectivePrice}</strong> for
                    this registration.
                    {!isWaitlistRegistration
                      ? " Payment will be processed immediately upon confirmation."
                      : " You will only be charged if your waitlist registration is confirmed."}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  loading={loading}
                  disabled={loading || !acceptTerms}
                >
                  {loading
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
        </div>
      </div>
    </div>
  );
};

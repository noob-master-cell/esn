import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  startDate: string;
  location: string;
  price?: number;
  memberPrice?: number;
  type: string;
  maxParticipants: number;
  registrationCount: number;
  requirements?: string;
}

interface RegistrationFormData {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  marketingEmails: boolean;
}

interface RegistrationFlowProps {
  event: Event;
  userProfile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    esnCard?: string;
    university?: string;
  };
  onRegister: (data: RegistrationFormData) => Promise<void>;
  onCancel: () => void;
}

const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  event,
  userProfile,
  onRegister,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});

  const [formData, setFormData] = useState<RegistrationFormData>({
    acceptTerms: false,
    acceptPrivacy: false,
    marketingEmails: true,
  });

  // Calculate price based on ESN card
  const finalPrice =
    userProfile?.esnCard && event.memberPrice
      ? event.memberPrice
      : event.price || 0;

  const hasDiscount =
    userProfile?.esnCard &&
    event.memberPrice &&
    event.memberPrice < (event.price || 0);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }
    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = "You must accept the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onRegister(formData);
      // Success handled by parent component
    } catch (error) {
      console.error("Registration failed:", error);
      // Error handling could be improved here
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">
          Complete Registration
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Review details and confirm your registration
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirm Your Registration
            </h2>
            <p className="text-gray-600">
              You're about to register for this amazing event!
            </p>
          </div>

          {/* Event Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-medium">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{event.location}</span>
              </div>
              {event.type !== "FREE" && (
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-gray-600">Price:</span>
                  <div className="text-right">
                    {hasDiscount && (
                      <div className="text-sm text-gray-500 line-through">
                        €{event.price}
                      </div>
                    )}
                    <span className="font-bold text-lg">
                      €{finalPrice}
                      {hasDiscount && (
                        <span className="text-green-600 text-sm ml-2">
                          ESN Discount!
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          {userProfile && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Your Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {userProfile.firstName} {userProfile.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{userProfile.email}</span>
                </div>
                {userProfile.esnCard && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ESN Card:</span>
                    <span className="font-medium text-green-600">✓ Valid</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Requirements */}
          {event.requirements && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
              <p className="text-gray-700">{event.requirements}</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6 max-h-48 overflow-y-auto">
              <h3 className="font-semibold mb-3">Event Terms & Conditions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>By registering for this event, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Arrive on time and participate responsibly</li>
                  <li>Respect other participants and event organizers</li>
                  <li>Follow all safety guidelines and venue rules</li>
                  <li>Not hold ESN liable for any injuries or damages</li>
                  <li>
                    Allow photos/videos to be taken for promotional purposes
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    updateFormData("acceptTerms", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I accept the terms and conditions *
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-600 text-sm ml-8">
                  {errors.acceptTerms}
                </p>
              )}

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacy}
                  onChange={(e) =>
                    updateFormData("acceptPrivacy", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I accept the privacy policy and data processing *
                </span>
              </label>
              {errors.acceptPrivacy && (
                <p className="text-red-600 text-sm ml-8">
                  {errors.acceptPrivacy}
                </p>
              )}

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.marketingEmails}
                  onChange={(e) =>
                    updateFormData("marketingEmails", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I want to receive marketing emails about future events
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </div>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFlow;

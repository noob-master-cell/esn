// frontend/src/components/events/RegistrationStatus.tsx
import React from "react";
import {
  useRegistrationStatus,
  getRegistrationStatusInfo,
} from "../../hooks/api/useRegistration";

interface RegistrationStatusProps {
  eventId: string;
  className?: string;
  showDetails?: boolean;
}

export const RegistrationStatus: React.FC<RegistrationStatusProps> = ({
  eventId,
  className = "",
  showDetails = true,
}) => {
  const { isRegistered, registration, isLoading, registrationStatus } =
    useRegistrationStatus(eventId);

  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 h-16 rounded-lg ${className}`}
      />
    );
  }

  if (!isRegistered) {
    return null; // Don't show anything if not registered
  }

  const statusInfo = getRegistrationStatusInfo(registrationStatus);

  return (
    <div className={`border rounded-lg p-4 ${statusInfo.bg} ${className}`}>
      <div className={`flex items-center ${statusInfo.text}`}>
        <span className="text-xl mr-3">{statusInfo.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold">{statusInfo.title}</h3>

          {showDetails && registration && (
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <strong>Registered:</strong>{" "}
                {new Date(registration.registeredAt).toLocaleDateString()}
              </p>

              {registration.position && registrationStatus === "WAITLISTED" && (
                <p>
                  <strong>Waitlist Position:</strong> #{registration.position}
                </p>
              )}

              {registration.amountDue > 0 && (
                <p>
                  <strong>Amount Due:</strong> €{registration.amountDue}
                </p>
              )}

              {registration.paymentRequired &&
                registrationStatus === "PENDING" && (
                  <p className="text-yellow-700 font-medium">
                    Payment required to confirm registration
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact version for buttons/badges
export const RegistrationStatusBadge: React.FC<{
  eventId: string;
  className?: string;
}> = ({ eventId, className = "" }) => {
  const { isRegistered, isLoading, registrationStatus } =
    useRegistrationStatus(eventId);

  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 h-6 w-20 rounded ${className}`}
      />
    );
  }

  if (!isRegistered) {
    return null;
  }

  const statusInfo = getRegistrationStatusInfo(registrationStatus);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text} ${className}`}
    >
      <span className="mr-1">{statusInfo.icon}</span>
      {statusInfo.title}
    </span>
  );
};

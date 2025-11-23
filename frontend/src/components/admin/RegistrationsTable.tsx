// frontend/src/components/admin/RegistrationsTable.tsx
import React from "react";

interface Registration {
  id: string;
  status: string;
  registrationType: string;
  paymentRequired: boolean;
  paymentStatus: string;
  amountDue: number;
  currency: string;
  registeredAt: string;
  confirmedAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    startDate: string;
    location: string;
  };
}

interface RegistrationsTableProps {
  registrations: Registration[];
  loading: boolean;
  error: any;
  selectedRegistrations: string[];
  onSelectionChange: (selected: string[]) => void;
  onUpdateStatus: (registrationId: string, status: string) => void;
}

export const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  registrations,
  loading,
  error,
  selectedRegistrations,
  onSelectionChange,
  onUpdateStatus,
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      CONFIRMED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Confirmed",
      },
      WAITLISTED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Waitlisted",
      },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
      ATTENDED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Attended",
      },
      NO_SHOW: { bg: "bg-gray-100", text: "text-gray-800", label: "No Show" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      PROCESSING: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Processing",
      },
      COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
      },
      FAILED: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
      REFUNDED: { bg: "bg-gray-100", text: "text-gray-800", label: "Refunded" },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getRegistrationTypeBadge = (type: string) => {
    const typeConfig = {
      REGULAR: { bg: "bg-gray-100", text: "text-gray-800", label: "Regular" },
      WAITLIST: { bg: "bg-blue-100", text: "text-blue-800", label: "Waitlist" },
      VIP: { bg: "bg-purple-100", text: "text-purple-800", label: "VIP" },
      ORGANIZER: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Organizer",
      },
    };

    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig.REGULAR;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(registrations.map((reg) => reg.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRegistration = (
    registrationId: string,
    checked: boolean
  ) => {
    if (checked) {
      onSelectionChange([...selectedRegistrations, registrationId]);
    } else {
      onSelectionChange(
        selectedRegistrations.filter((id) => id !== registrationId)
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-600">
          Error loading registrations: {error.message}
        </p>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No registrations found
          </h3>
          <p className="text-gray-500">Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedRegistrations.length === registrations.length &&
                    registrations.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map((registration) => (
              <tr key={registration.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRegistrations.includes(registration.id)}
                    onChange={(e) =>
                      handleSelectRegistration(
                        registration.id,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {registration.user.firstName} {registration.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {registration.user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {registration.event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {registration.event.location}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(registration.event.startDate)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRegistrationTypeBadge(registration.registrationType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={registration.status}
                    onChange={(e) =>
                      onUpdateStatus(registration.id, e.target.value)
                    }
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="WAITLISTED">Waitlisted</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="ATTENDED">Attended</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.paymentRequired ? (
                    getPaymentStatusBadge(registration.paymentStatus)
                  ) : (
                    <span className="text-sm text-gray-500">Not Required</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {registration.paymentRequired ? (
                    <div>
                      <span className="font-medium">
                        {registration.amountDue} {registration.currency}
                      </span>
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium">Free</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{formatDate(registration.registeredAt)}</div>
                    {registration.confirmedAt && (
                      <div className="text-xs text-green-600">
                        Confirmed: {formatDate(registration.confirmedAt)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {registration.status === "PENDING" && (
                      <button
                        onClick={() =>
                          onUpdateStatus(registration.id, "CONFIRMED")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Confirm
                      </button>
                    )}
                    {registration.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          onUpdateStatus(registration.id, "ATTENDED")
                        }
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Mark Attended
                      </button>
                    )}
                    {["PENDING", "CONFIRMED", "WAITLISTED"].includes(
                      registration.status
                    ) && (
                      <button
                        onClick={() =>
                          onUpdateStatus(registration.id, "CANCELLED")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

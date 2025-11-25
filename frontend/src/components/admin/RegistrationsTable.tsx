// frontend/src/components/admin/RegistrationsTable.tsx
import React from "react";
import { Icon } from "../common/Icon";
import { EmptyState } from "../common/EmptyState";

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
    avatar?: string;
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
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  registrations,
  loading,
  error,
  selectedRegistrations,
  onSelectionChange,
  onUpdateStatus,
  sortBy = 'registeredAt',
  sortDirection = 'desc',
  onSort,
}) => {


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
      <div className="bg-white rounded-lg shadow-sm">
        <EmptyState
          icon="calendar"
          title="No registrations found"
          description="Try adjusting your filters or search criteria"
        />
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
                    registrations.length > 0 &&
                    registrations.every((r) => selectedRegistrations.includes(r.id))
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      const newSelected = [
                        ...new Set([
                          ...selectedRegistrations,
                          ...registrations.map((r) => r.id),
                        ]),
                      ];
                      onSelectionChange(newSelected);
                    } else {
                      const pageIds = registrations.map((r) => r.id);
                      onSelectionChange(
                        selectedRegistrations.filter((id) => !pageIds.includes(id))
                      );
                    }
                  }}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('user')}
              >
                <div className="flex items-center gap-1">
                  User
                  {sortBy === 'user' && (
                    <Icon name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'} size="xs" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('event')}
              >
                <div className="flex items-center gap-1">
                  Event
                  {sortBy === 'event' && (
                    <Icon name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'} size="xs" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortBy === 'status' && (
                    <Icon name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'} size="xs" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('paymentStatus')}
              >
                <div className="flex items-center gap-1">
                  Payment
                  {sortBy === 'paymentStatus' && (
                    <Icon name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'} size="xs" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort?.('registeredAt')}
              >
                <div className="flex items-center gap-1">
                  Registered
                  {sortBy === 'registeredAt' && (
                    <Icon name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'} size="xs" />
                  )}
                </div>
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
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 mr-3">
                      {registration.user.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={registration.user.avatar}
                          alt={`${registration.user.firstName} ${registration.user.lastName}`}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {registration.user.firstName.charAt(0)}
                          {registration.user.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.user.firstName} {registration.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.user.email}
                      </div>
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

// frontend/src/components/admin/RegistrationsTable.tsx
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Icon } from "../common/Icon";
import { EmptyState } from "../common/EmptyState";
import { RegistrationDetailsModal } from "./RegistrationDetailsModal";

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
    endDate: string;
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      CONFIRMED: { bg: "bg-green-100", text: "text-green-800", label: "Confirmed" },
      WAITLISTED: { bg: "bg-orange-100", text: "text-orange-800", label: "Waitlisted" },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
      ATTENDED: { bg: "bg-blue-100", text: "text-blue-800", label: "Attended" },
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



  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString("en-US", {
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

  const [selectedRegistration, setSelectedRegistration] = React.useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
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
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
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
                    aria-label="Select all registrations"
                  />
                </th>
                <th
                  scope="col"
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
                  scope="col"
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
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
                <th
                  scope="col"
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        handleSelectRegistration(registration.id, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`Select registration for ${registration.user.firstName} ${registration.user.lastName}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {registration.user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={registration.user.avatar}
                            alt={`${registration.user.firstName} ${registration.user.lastName}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {registration.user.firstName?.charAt(0) || ""}
                              {registration.user.lastName?.charAt(0) || ""}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.user.firstName}{" "}
                          {registration.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {registration.event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(registration.event.startDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(registration.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(registration.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(registration.registeredAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Registration actions">
                          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleViewDetails(registration)}
                                  className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  View Details
                                </button>
                              )}
                            </Menu.Item>
                            {registration.status === 'PENDING' && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => onUpdateStatus(registration.id, 'CONFIRMED')}
                                    className={`${active ? 'bg-green-500 text-white' : 'text-green-600'
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                  >
                                    Confirm
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                            {registration.status === 'CONFIRMED' && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => onUpdateStatus(registration.id, 'ATTENDED')}
                                    className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                  >
                                    Mark Attended
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                          </div>
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to cancel this registration?")) {
                                      onUpdateStatus(registration.id, 'CANCELLED');
                                    }
                                  }}
                                  className={`${active ? 'bg-red-500 text-white' : 'text-red-600'
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  Cancel Registration
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {registrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRegistrations.includes(registration.id)}
                    onChange={(e) => handleSelectRegistration(registration.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    aria-label={`Select registration for ${registration.user.firstName} ${registration.user.lastName}`}
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      {registration.user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={registration.user.avatar}
                          alt={`${registration.user.firstName} ${registration.user.lastName}`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {registration.user.firstName?.charAt(0) || ""}
                            {registration.user.lastName?.charAt(0) || ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.user.firstName} {registration.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500 break-all">{registration.user.email}</div>
                    </div>
                  </div>
                </div>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none p-1" aria-label="Registration actions">
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleViewDetails(registration)}
                              className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              View Details
                            </button>
                          )}
                        </Menu.Item>
                        {registration.status === 'PENDING' && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onUpdateStatus(registration.id, 'CONFIRMED')}
                                className={`${active ? 'bg-green-500 text-white' : 'text-green-600'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Confirm
                              </button>
                            )}
                          </Menu.Item>
                        )}
                        {registration.status === 'CONFIRMED' && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onUpdateStatus(registration.id, 'ATTENDED')}
                                className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Mark Attended
                              </button>
                            )}
                          </Menu.Item>
                        )}
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to cancel this registration?")) {
                                  onUpdateStatus(registration.id, 'CANCELLED');
                                }
                              }}
                              className={`${active ? 'bg-red-500 text-white' : 'text-red-600'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Cancel Registration
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <span className="text-gray-500 block text-xs uppercase tracking-wide">Event</span>
                  <div className="mt-1 font-medium text-gray-900">{registration.event.title}</div>
                  <div className="text-gray-500 text-xs">{formatDate(registration.event.startDate)}</div>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide">Status</span>
                  <div className="mt-1">{getStatusBadge(registration.status)}</div>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wide">Payment</span>
                  <div className="mt-1">{getPaymentStatusBadge(registration.paymentStatus)}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block text-xs uppercase tracking-wide">Registered On</span>
                  <div className="mt-1 text-gray-900">{formatDate(registration.registeredAt)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegistrationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        registration={selectedRegistration}
      />
    </>
  );
};

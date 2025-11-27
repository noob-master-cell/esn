// frontend/src/components/admin/EventsTable.tsx
import React, { Fragment } from "react";
import { Avatar } from "../ui/Avatar";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface Event {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  maxParticipants?: number;
  registrationCount: number;
  images?: string[];
  imageUrl?: string;
  price?: number;
  memberPrice?: number;
}

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  error: any;
  selectedEvents: string[];
  onSelectionChange: (selected: string[]) => void;
  onDeleteEvent: (id: string) => void;
  onPublishEvent: (id: string) => void;
  onEditEvent: (id: string) => void;
  onViewEvent: (id: string) => void;
  onCreateEvent: () => void;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  loading,
  error,
  selectedEvents,
  onSelectionChange,
  onDeleteEvent,
  onPublishEvent,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PUBLISHED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      DRAFT: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      REGISTRATION_OPEN: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Open",
      },
      REGISTRATION_CLOSED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Closed",
      },
      COMPLETED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Completed",
      },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
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
      onSelectionChange(events.map((event) => event.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedEvents, eventId]);
    } else {
      onSelectionChange(selectedEvents.filter((id) => id !== eventId));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-600">Error loading events: {error.message}</p>
      </div>
    );
  }

  if (events.length === 0) {
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first event.
          </p>
          <button
            onClick={onCreateEvent}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:max-h-[calc(100vh-18rem)]">
      {/* Desktop Table View */}
      <div className="hidden md:block flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedEvents.length === events.length && events.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Select all events"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={(e) =>
                      handleSelectEvent(event.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-label={`Select event ${event.title}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Avatar
                        src={event.images && event.images.length > 0 ? event.images[0] : null}
                        alt={event.title}
                        fallback={<CalendarIcon className="h-6 w-6 text-gray-400" />}
                        size="md"
                        bordered
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.location || "No location"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(event.startDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.startDate).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(event.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wide">Registrations</span>
                    <div className="mt-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {event.registrationCount}
                        </span>
                        <span className="mx-1">/</span>
                        <span>{event.maxParticipants || "∞"}</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${event.registrationCount >= event.maxParticipants
                              ? "bg-red-500"
                              : "bg-green-500"
                              }`}
                            style={{
                              width: `${Math.min(
                                (event.registrationCount / event.maxParticipants) *
                                100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Event actions">
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
                                onClick={() => onViewEvent?.(event.id)}
                                className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                View Details
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onEditEvent?.(event.id)}
                                className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Edit Event
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => onPublishEvent?.(event.id)}
                                className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                {event.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this event?")) {
                                    onDeleteEvent?.(event.id);
                                  }
                                }}
                                className={`${active ? 'bg-red-500 text-white' : 'text-red-600'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                Delete Event
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
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.id)}
                  onChange={(e) => handleSelectEvent(event.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  aria-label={`Select event ${event.title}`}
                />
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Avatar
                      src={event.images && event.images.length > 0 ? event.images[0] : null}
                      alt={event.title}
                      fallback={<CalendarIcon className="h-6 w-6 text-gray-400" />}
                      size="md"
                      bordered
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.location || "No location"}
                    </div>
                  </div>
                </div>
              </div>

              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none p-1" aria-label="Event actions">
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
                            onClick={() => onViewEvent?.(event.id)}
                            className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            View Details
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onEditEvent?.(event.id)}
                            className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Edit Event
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onPublishEvent?.(event.id)}
                            className={`${active ? 'bg-cyan-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {event.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this event?")) {
                                onDeleteEvent?.(event.id);
                              }
                            }}
                            className={`${active ? 'bg-red-500 text-white' : 'text-red-600'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Delete Event
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
                <span className="text-gray-500 block text-xs uppercase tracking-wide">Date</span>
                <div className="mt-1 font-medium text-gray-900">{formatDate(event.startDate)}</div>
                <div className="text-gray-500 text-xs">
                  {new Date(event.startDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wide">Status</span>
                <div className="mt-1">{getStatusBadge(event.status)}</div>
              </div>
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wide">Registrations</span>
                <div className="mt-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {event.registrationCount}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{event.maxParticipants || "∞"}</span>
                  </div>
                  {event.maxParticipants && (
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${event.registrationCount >= event.maxParticipants
                          ? "bg-red-500"
                          : "bg-green-500"
                          }`}
                        style={{
                          width: `${Math.min(
                            (event.registrationCount / event.maxParticipants) *
                            100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
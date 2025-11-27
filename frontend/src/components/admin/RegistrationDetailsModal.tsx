import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";

interface RegistrationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    registration: any; // Using any for now to avoid circular dependency, ideally should be shared type
}

export const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
    isOpen,
    onClose,
    registration,
}) => {
    if (!registration) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-gray-900"
                                    >
                                        Registration Details
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* User Information */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            User Information
                                        </h4>
                                        <div className="flex items-start gap-4">
                                            {registration.user.avatar ? (
                                                <img
                                                    src={registration.user.avatar}
                                                    alt={registration.user.firstName}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">
                                                    {registration.user.firstName.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {registration.user.firstName} {registration.user.lastName}
                                                </p>
                                                <p className="text-gray-500">{registration.user.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    ID: {registration.user.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Registration Status */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            Status & Payment
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className="font-medium text-gray-900">
                                                    {registration.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type:</span>
                                                <span className="font-medium text-gray-900">
                                                    {registration.registrationType}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment:</span>
                                                <span className="font-medium text-gray-900">
                                                    {registration.paymentRequired
                                                        ? `${registration.amountDue} ${registration.currency} (${registration.paymentStatus})`
                                                        : "Free"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            Event Information
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="font-bold text-gray-900 text-lg mb-2">
                                                {registration.event.title}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Location</p>
                                                    <p className="font-medium text-gray-900">
                                                        {registration.event.location}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Date</p>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(registration.event.startDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                            Timeline
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Registered</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(registration.registeredAt)}
                                                </span>
                                            </div>
                                            {registration.confirmedAt && (
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Confirmed</span>
                                                    <span className="font-medium text-green-600">
                                                        {formatDate(registration.confirmedAt)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <Button variant="outline" onClick={onClose}>
                                        Close
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

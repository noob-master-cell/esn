import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components/ui/Button";
import { ImageUpload } from "../../../components/ui/ImageUpload";
import { useAuth } from "../../../hooks/useAuth";

interface PhotoUploadModalProps {
    dbUser: any;
    onClose: () => void;
    onUploadComplete: (url: string | null) => Promise<void>;
    isOpen?: boolean;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
    dbUser,
    onClose,
    onUploadComplete,
    isOpen = true,
}) => {
    const { getToken } = useAuth();

    const handleUpload = async (file: File) => {
        const token = await getToken();
        const formData = new FormData();
        formData.append('file', file);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
        const uploadUrl = apiUrl.replace('/graphql', '/upload');

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        return data.url;
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
                    <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative w-full transform overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-md">
                                <div className="absolute right-4 top-4">
                                    <button
                                        type="button"
                                        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="text-center sm:text-left">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900 flex items-center justify-center sm:justify-start gap-2"
                                    >
                                        <PhotoIcon className="h-6 w-6 text-cyan-600" />
                                        Update Profile Photo
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Upload a new photo to personalize your profile.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <ImageUpload
                                        value={dbUser?.avatar}
                                        onChange={async (url) => {
                                            if (url) {
                                                await onUploadComplete(url);
                                                onClose();
                                            }
                                        }}
                                        onUpload={handleUpload}
                                    />
                                </div>

                                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                                    {dbUser?.avatar && (
                                        <Button
                                            variant="danger"
                                            className="w-full sm:w-auto"
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to remove your profile photo?")) {
                                                    await onUploadComplete(null);
                                                    onClose();
                                                }
                                            }}
                                        >
                                            Remove Photo
                                        </Button>
                                    )}
                                    <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
                                        <Button
                                            variant="secondary"
                                            className="w-full sm:w-auto"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

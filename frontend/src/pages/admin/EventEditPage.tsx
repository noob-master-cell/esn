// frontend/src/pages/admin/EventEditPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { EventForm } from "../../components/admin/EventForm";
import { GET_EVENT_FOR_EDIT } from "../../lib/graphql/events";

export const EventEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery(GET_EVENT_FOR_EDIT, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <AdminLayout title="Edit Event" subtitle="Loading event data...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !data?.event) {
    return (
      <AdminLayout title="Edit Event" subtitle="Event not found">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Event Not Found
          </h3>
          <p className="text-gray-500 mb-6">
            The event you're trying to edit doesn't exist or you don't have
            permission to edit it.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  const event = data.event;

  // Transform event data for the form
  const initialData = {
    title: event.title,
    description: event.description,
    shortDescription: event.shortDescription || "",
    category: event.category,
    type: event.type,
    startDate: event.startDate
      ? new Date(event.startDate).toISOString().slice(0, 16)
      : "",
    endDate: event.endDate
      ? new Date(event.endDate).toISOString().slice(0, 16)
      : "",
    registrationDeadline: event.registrationDeadline
      ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
      : "",
    location: event.location,
    address: event.address || "",
    maxParticipants: event.maxParticipants,
    price: event.price,
    memberPrice: event.memberPrice,
    imageUrl: event.imageUrl || "",
    tags: event.tags || [],
    requirements: event.requirements || "",
    additionalInfo: event.additionalInfo || "",
    isPublic: event.isPublic,
    allowWaitlist: event.allowWaitlist,
  };

  return (
    <AdminLayout title="Edit Event" subtitle={`Editing: ${event.title}`}>
      <EventForm mode="edit" eventId={id} initialData={initialData} />
    </AdminLayout>
  );
};

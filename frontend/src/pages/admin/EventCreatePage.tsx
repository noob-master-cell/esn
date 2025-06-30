// frontend/src/pages/admin/EventCreatePage.tsx
import React from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { EventForm } from "../../components/admin/EventForm";

export const EventCreatePage: React.FC = () => {
  return (
    <AdminLayout
      title="Create Event"
      subtitle="Add a new event to the platform"
    >
      <EventForm mode="create" />
    </AdminLayout>
  );
};

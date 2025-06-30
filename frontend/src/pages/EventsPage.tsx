// frontend/src/pages/EventsPage.tsx
import React from "react";

import { EventsList } from "../components/events/EventsList";

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Events List */}
      <div className="col-span-1 lg:col-span-3 w-full">
        <EventsList />
      </div>
    </div>
  );
};

export default EventsPage;
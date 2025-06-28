// frontend/src/pages/EventsPage.tsx
import React from "react";
import { EventsHeader } from "../components/events/EventsHeader";
//import { EventsFilters } from "../components/events/EventsFilters";
import { EventsList } from "../components/events/EventsList";

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <EventsHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1"></div>

          {/* Main Events List */}
          <div className="lg:col-span-3">
            <EventsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

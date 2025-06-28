// frontend/src/pages/EventsPage.tsx
import React from "react";
import { EventsHeader } from "../components/events/EventsHeader";
import { EventsList } from "../components/events/EventsList";

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <EventsHeader />

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          {/* Future: Filters can be added here as a horizontal bar on mobile */}
          {/* <div className="mb-6 lg:hidden">
            <EventsFilters />
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar Filters - Hidden on mobile for now */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                {/* Placeholder for EventsFilters component */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                  <p className="text-sm text-gray-600">
                    Filters coming soon...
                  </p>
                </div>
              </div>
            </div>

            {/* Main Events List */}
            <div className="col-span-1 lg:col-span-3 w-full">
              <EventsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
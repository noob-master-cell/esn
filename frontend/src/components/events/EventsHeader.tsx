// frontend/src/components/events/EventsHeader.tsx
import React from "react";

export const EventsHeader: React.FC = () => {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Events Hub
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Join unforgettable experiences with the ESN community. From
              cultural nights to exciting trips, find your next adventure here.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">50+</div>
                  <div className="text-sm text-gray-600">Events This Month</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">1,200+</div>
                  <div className="text-sm text-gray-600">Happy Members</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">25+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse All Events
              </button>
              <button className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Join ESN Community
              </button>
            </div>
          </div>

          {/* Right: Featured Event Cards */}
          <div className="space-y-4">
            <div className="card bg-white p-4 rounded-2xl shadow-sm border hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=80&h=80&fit=crop"
                  className="h-16 w-16 rounded-xl object-cover"
                  alt="Welcome Party"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      This Week
                    </span>
                  </div>
                  <p className="font-semibold text-black">Welcome Party 2025</p>
                  <p className="text-sm text-gray-600">
                    Meet new friends • €10
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Jul 15</p>
                  <p className="text-xs text-gray-400">7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="card bg-white p-4 rounded-2xl shadow-sm border hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=80&h=80&fit=crop"
                  className="h-16 w-16 rounded-xl object-cover"
                  alt="City Tour"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                  <p className="font-semibold text-black">City Walking Tour</p>
                  <p className="text-sm text-gray-600">
                    Explore the city • Free for members
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Jul 20</p>
                  <p className="text-xs text-gray-400">10:00 AM</p>
                </div>
              </div>
            </div>

            <div className="card bg-blue-500 p-4 rounded-2xl shadow-sm text-white hover:bg-blue-600 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold mb-1">Create Your Own Event</p>
                  <p className="text-sm opacity-90">
                    Are you an organizer? Host amazing events!
                  </p>
                </div>
                <span className="card-arrow text-2xl">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

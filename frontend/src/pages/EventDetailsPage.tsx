// frontend/src/pages/EventDetailsPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useAuth } from "@clerk/clerk-react";
import { GET_EVENT } from "../lib/graphql/events";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { EventRegistrationModal } from "../components/events/EventRegistrationModal";

interface EventDetailsPageProps {}

const EventDetailsPage: React.FC<EventDetailsPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_EVENT, {
    variables: { id },
    skip: !id,
  });

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Get event type icon
  const getEventTypeIcon = (category: string) => {
    const icons = {
      PARTY: "🎉",
      CULTURAL: "🎭",
      SPORTS: "⚽",
      TRAVEL: "✈️",
      SOCIAL: "👥",
      EDUCATIONAL: "📚",
      VOLUNTEER: "🤝",
      NETWORKING: "🌐",
      WORKSHOP: "🔧",
      CONFERENCE: "🎤",
      OTHER: "📅",
    };
    return icons[category as keyof typeof icons] || icons.OTHER;
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const badges = {
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
      COMPLETED: "bg-blue-100 text-blue-800",
    };
    return badges[status as keyof typeof badges] || badges.PUBLISHED;
  };

  // Handle registration success
  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    refetch(); // Refetch event data to update registration status
    setTimeout(() => setRegistrationSuccess(false), 5000); // Hide success message after 5 seconds
  };

  // Handle registration button click
  const handleRegisterClick = () => {
    if (!isSignedIn) {
      // Redirect to sign in
      navigate("/sign-in");
      return;
    }
    setIsRegistrationModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading skeleton - same as before */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert
            type="error"
            title="Failed to load event"
            message="There was an error loading the event details. Please try again."
          />
          <div className="mt-4 text-center">
            <Button onClick={() => navigate("/events")} variant="outline">
              ← Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/events")} variant="primary">
              ← Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const event = data.event;
  const startDateTime = formatDateTime(event.startDate);
  const endDateTime = formatDateTime(event.endDate);
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const eventImage =
    event.imageUrl ||
    `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {registrationSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="success"
            title="Registration Successful!"
            message="You have been successfully registered for this event."
            onClose={() => setRegistrationSuccess(false)}
          />
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={eventImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Event category badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="text-lg">
                  {getEventTypeIcon(event.category)}
                </span>
                {event.category}
              </span>
            </div>

            {/* Status badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                  event.status
                )}`}
              >
                {event.status}
              </span>
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-white/90 text-lg">
                Organized by {event.organizer.firstName}{" "}
                {event.organizer.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
                {event.shortDescription && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      {event.shortDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements & Additional Info */}
            {(event.requirements || event.additionalInfo) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Important Information
                </h3>

                {event.requirements && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Requirements
                    </h4>
                    <p className="text-gray-700">{event.requirements}</p>
                  </div>
                )}

                {event.additionalInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Additional Information
                    </h4>
                    <p className="text-gray-700">{event.additionalInfo}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Event Info Card */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <div className="space-y-6">
                {/* Price */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Price
                  </h3>
                  {event.type === "FREE" ? (
                    <div className="text-2xl font-bold text-green-600">
                      Free
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">
                        €{event.price}
                      </div>
                      {event.memberPrice && event.memberPrice < event.price && (
                        <div className="text-sm text-green-600">
                          €{event.memberPrice} with ESN Card
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    When
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-500"
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
                      <div>
                        <div className="font-medium text-gray-900">
                          {startDateTime.date}
                        </div>
                        <div className="text-sm text-gray-600">
                          {startDateTime.time} - {endDateTime.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Where
                  </h3>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.location}
                      </div>
                      {event.address && (
                        <div className="text-sm text-gray-600 mt-1">
                          {event.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Capacity
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Registered</span>
                      <span className="font-medium">
                        {event.registrationCount}/{event.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (event.registrationCount / event.maxParticipants) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {spotsLeft > 0
                        ? `${spotsLeft} spots remaining`
                        : "Event is full"}
                      {event.allowWaitlist &&
                        spotsLeft <= 0 &&
                        " • Waitlist available"}
                    </div>
                  </div>
                </div>

                {/* Registration Button */}
                <div className="space-y-3">
                  {event.canRegister ? (
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                      onClick={handleRegisterClick}
                    >
                      {spotsLeft > 0 ? "Register Now" : "Join Waitlist"}
                    </Button>
                  ) : event.isRegistered ? (
                    <div className="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-lg text-center">
                      ✅ You're registered!
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-600 font-semibold py-3 rounded-lg text-center">
                      Registration Closed
                    </div>
                  )}

                  <button className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                    Share Event
                  </button>
                </div>

                {/* Registration Deadline */}
                {event.registrationDeadline && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <strong>Registration Deadline:</strong>
                      <br />
                      {formatDateTime(event.registrationDeadline).date} at{" "}
                      {formatDateTime(event.registrationDeadline).time}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Organizer
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {event.organizer.firstName[0]}
                  {event.organizer.lastName[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.organizer.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default EventDetailsPage;

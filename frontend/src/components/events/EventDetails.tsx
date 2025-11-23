import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  location: string;
  address?: string;
  maxParticipants: number;
  registrationCount: number;
  price?: number;
  memberPrice?: number;
  imageUrl?: string;
  category: string;
  type: string;
  status: string;
  tags?: string[];
  requirements?: string;
  additionalInfo?: string;
  organizer: {
    firstName: string;
    lastName: string;
  };
  canRegister?: boolean;
  isRegistered?: boolean;
}

interface EventDetailsProps {
  event: Event;
  loading?: boolean;
  onRegister?: () => void;
  onShare?: (platform: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  loading = false,
  onRegister,
  onShare,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "details" | "location" | "attendees"
  >("details");
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageGalleryIndex, setImageGalleryIndex] = useState(0);

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

  // Calculate spots left
  const spotsLeft = event.maxParticipants - event.registrationCount;
  const spotsPercentage = (spotsLeft / event.maxParticipants) * 100;

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      PARTY: "bg-purple-100 text-purple-800 border-purple-200",
      CULTURAL: "bg-pink-100 text-pink-800 border-pink-200",
      SPORTS: "bg-green-100 text-green-800 border-green-200",
      TRAVEL: "bg-blue-100 text-blue-800 border-blue-200",
      SOCIAL: "bg-orange-100 text-orange-800 border-orange-200",
      EDUCATIONAL: "bg-indigo-100 text-indigo-800 border-indigo-200",
      VOLUNTEER: "bg-yellow-100 text-yellow-800 border-yellow-200",
      NETWORKING: "bg-gray-100 text-gray-800 border-gray-200",
      WORKSHOP: "bg-red-100 text-red-800 border-red-200",
      CONFERENCE: "bg-teal-100 text-teal-800 border-teal-200",
      OTHER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.OTHER;
  };

  // Mock image gallery (you can extend this with real images)
  const images = [
    event.imageUrl ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=400&fit=crop",
  ];

  const startDateTime = formatDateTime(event.startDate);
  const endDateTime = formatDateTime(event.endDate);

  // Social sharing
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this event: ${event.title}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        // You could show a toast notification here
        break;
    }
    setShowShareModal(false);
    onShare?.(platform);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 p-4">
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Hero Image Gallery */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-t-2xl">
        <img
          src={images[imageGalleryIndex]}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setImageGalleryIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
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
            </button>
            <button
              onClick={() =>
                setImageGalleryIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImageGalleryIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === imageGalleryIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
              event.category
            )}`}
          >
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {event.title}
          </h1>

          {event.shortDescription && (
            <p className="text-lg text-gray-600 mb-4">
              {event.shortDescription}
            </p>
          )}

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Date & Time */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                  <p className="text-sm font-medium text-gray-900">
                    {startDateTime.date}
                  </p>
                  <p className="text-sm text-gray-600">{startDateTime.time}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.location}
                  </p>
                  {event.address && (
                    <p className="text-sm text-gray-600">{event.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${spotsLeft > 0 ? "bg-yellow-100" : "bg-red-100"
                    }`}
                >
                  <svg
                    className={`w-5 h-5 ${spotsLeft > 0 ? "text-yellow-600" : "text-red-600"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.registrationCount}/{event.maxParticipants} registered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Registration Progress</span>
              <span>
                {Math.round(
                  (event.registrationCount / event.maxParticipants) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${spotsPercentage > 80
                    ? "bg-red-500"
                    : spotsPercentage > 50
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                style={{
                  width: `${(event.registrationCount / event.maxParticipants) * 100
                    }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "details", label: "Details", icon: "📋" },
              { id: "location", label: "Location", icon: "📍" },
              { id: "attendees", label: "Attendees", icon: "👥" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About this event
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {event.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              {(event.requirements || event.additionalInfo || event.tags) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.requirements && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Requirements
                      </h4>
                      <p className="text-sm text-gray-600">
                        {event.requirements}
                      </p>
                    </div>
                  )}

                  {event.additionalInfo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Additional Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        {event.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Organized by</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {event.organizer.firstName[0]}
                      {event.organizer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Event Organizer</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Event Location
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-900">{event.location}</p>
                  {event.address && (
                    <p className="text-gray-600 mt-1">{event.address}</p>
                  )}
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  title="Event location map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(event.address || event.location)}&output=embed`}
                ></iframe>
              </div>
              {/* Open in external map app */}
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    event.address || event.location
                  )}`;
                  window.open(url, '_blank');
                }}
                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in Maps
              </button>

              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Get Directions
              </button>
            </div>
          )}

          {activeTab === "attendees" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attendees ({event.registrationCount})
                </h3>
              </div>

              {/* Attendee list placeholder */}
              <div className="space-y-3">
                {[...Array(Math.min(event.registrationCount, 5))].map(
                  (_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Attendee {index + 1}
                        </p>
                        <p className="text-sm text-gray-600">ESN Member</p>
                      </div>
                    </div>
                  )
                )}

                {event.registrationCount > 5 && (
                  <div className="text-center py-3">
                    <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                      View all {event.registrationCount} attendees
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Registration CTA */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Price Info */}
            {event.type !== "FREE" && (
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <div className="flex items-baseline gap-2">
                    {event.price && (
                      <span className="text-2xl font-bold text-gray-900">
                        €{event.price}
                      </span>
                    )}
                    {event.memberPrice &&
                      event.memberPrice < (event.price || 0) && (
                        <span className="text-lg text-green-600 font-semibold">
                          €{event.memberPrice} with ESN Card
                        </span>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Register Button */}
            <div className="flex-1">
              {event.isRegistered ? (
                <button
                  disabled
                  className="w-full py-4 px-6 bg-green-100 text-green-800 rounded-xl font-semibold text-lg"
                >
                  ✓ You're registered
                </button>
              ) : spotsLeft > 0 ? (
                <button
                  onClick={onRegister}
                  className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 bg-gray-300 text-gray-600 rounded-xl font-semibold text-lg"
                >
                  Event Full
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share this event
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "twitter",
                  label: "Twitter",
                  icon: "🐦",
                  color: "bg-blue-500",
                },
                {
                  id: "facebook",
                  label: "Facebook",
                  icon: "📘",
                  color: "bg-blue-600",
                },
                {
                  id: "whatsapp",
                  label: "WhatsApp",
                  icon: "💬",
                  color: "bg-green-500",
                },
                {
                  id: "copy",
                  label: "Copy Link",
                  icon: "🔗",
                  color: "bg-gray-500",
                },
              ].map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform.id)}
                  className={`flex flex-col items-center gap-2 p-4 ${platform.color} text-white rounded-xl hover:opacity-90 transition-opacity`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;

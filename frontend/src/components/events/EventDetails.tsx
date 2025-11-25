import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

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
  images: string[];
  category: string;
  type: string;
  status: string;
  tags?: string[];
  requirements?: string;
  additionalInfo?: string;
  organizer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  canRegister?: boolean;
  isRegistered?: boolean;
  attendees?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }[];
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
  const [showShareModal, setShowShareModal] = useState(false);

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const startDateTime = formatDateTime(event.startDate);
  const endDateTime = formatDateTime(event.endDate);
  const spotsLeft = event.maxParticipants - event.registrationCount;

  // Use event images or fallback
  const coverImage = event.images && event.images.length > 0
    ? event.images[0]
    : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop";

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Join me at ${event.title}!`;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`);
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareModal(false);
    onShare?.(platform);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      <main className="pt-8 pb-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-8">

            {/* Event Header */}
            <div className="space-y-6">
              {/* Navigation & Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
                >
                  <ShareIcon className="w-5 h-5" />
                  Share
                </button>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900 shadow-sm group">
                <img
                  src={coverImage}
                  alt={event.title}
                  className="w-full h-full object-contain"
                />

              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
                  {event.title}
                </h1>
                {event.shortDescription && (
                  <p className="text-xl text-gray-500 leading-relaxed">
                    {event.shortDescription}
                  </p>
                )}
              </div>

              {/* Host Info */}
              <div className="flex items-center gap-3 py-4 border-y border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-medium shadow-sm overflow-hidden">
                  {event.organizer.avatar ? (
                    <img src={event.organizer.avatar} alt={event.organizer.firstName} className="w-full h-full object-cover" />
                  ) : (
                    event.organizer.firstName[0]
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hosted By</div>
                  <div className="font-medium text-gray-900">{event.organizer.firstName} {event.organizer.lastName}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg prose-gray max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Event</h3>
              {event.description.split('\n').map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>
              ))}
            </div>

            {/* Location Map */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-50 rounded-2xl p-1 overflow-hidden border border-gray-100">
                <div className="h-48 w-full rounded-xl overflow-hidden bg-gray-200 relative">
                  <iframe
                    title="Event location map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(100%)' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(event.address || event.location)}&output=embed`}
                  ></iframe>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{event.location}</div>
                    <div className="text-sm text-gray-500">{event.address}</div>
                  </div>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location)}`, '_blank')}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MapPinIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 space-y-6">

              {/* Registration Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
                <div className="flex flex-col gap-6">

                  {/* Date/Time Row */}
                  <div className="flex gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg h-fit">
                      <CalendarIcon className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{startDateTime.fullDate}</div>
                      <div className="text-gray-500">{startDateTime.time} - {endDateTime.time}</div>
                    </div>
                  </div>

                  {/* Location Row */}
                  <div className="flex gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg h-fit">
                      <MapPinIcon className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{event.location}</div>
                      <div className="text-gray-500 text-sm line-clamp-1">{event.address}</div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full my-2"></div>

                  {/* Price & Action */}
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Price</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {event.type === 'FREE' ? 'Free' : `€${event.price}`}
                      </div>
                    </div>
                    {event.memberPrice && (
                      <div className="text-right">
                        <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          €{event.memberPrice} for members
                        </div>
                      </div>
                    )}
                  </div>

                  {event.isRegistered ? (
                    <button disabled className="w-full py-4 bg-green-50 text-green-700 font-bold rounded-xl border border-green-100 flex items-center justify-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      You're Going!
                    </button>
                  ) : spotsLeft > 0 ? (
                    <button
                      onClick={onRegister}
                      className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-900/20"
                    >
                      Register for Event
                    </button>
                  ) : (
                    <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                      Sold Out
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <UserCircleIcon className="w-4 h-4" />
                    <span>{event.registrationCount} people going</span>
                  </div>
                </div>
              </div>

              {/* Attendees Preview */}
              {event.registrationCount > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Who's going
                  </h4>
                  <div className="flex -space-x-3 overflow-hidden py-2">
                    {event.attendees?.slice(0, 5).map((attendee) => (
                      <div key={attendee.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center overflow-hidden">
                        {attendee.avatar ? (
                          <img src={attendee.avatar} alt={attendee.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-medium text-gray-500">
                            {attendee.firstName[0]}{attendee.lastName[0]}
                          </span>
                        )}
                      </div>
                    ))}
                    {(event.registrationCount > 5) && (
                      <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                        +{event.registrationCount - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bar (Only visible on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-40">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{event.title}</div>
            <div className="text-xs text-gray-500">
              {event.type === 'FREE' ? 'Free' : `€${event.price}`} • {startDateTime.date}
            </div>
          </div>
          {event.isRegistered ? (
            <button disabled className="px-6 py-3 bg-green-50 text-green-700 font-bold rounded-xl text-sm">
              Registered
            </button>
          ) : (
            <button
              onClick={onRegister}
              disabled={spotsLeft <= 0}
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-black disabled:bg-gray-300"
            >
              {spotsLeft > 0 ? 'Register' : 'Sold Out'}
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Share Event</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['twitter', 'facebook', 'whatsapp', 'copy'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <span className="capitalize font-medium text-gray-700">{platform}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;

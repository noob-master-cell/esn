import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserCircleIcon,
  XMarkIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import CommentsSection from "./CommentsSection";
import { Avatar } from "../ui/Avatar";

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
  isUnlimited?: boolean;
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
      case "instagram":
        // Instagram doesn't have a direct web share url, so we copy the link
        navigator.clipboard.writeText(url);
        alert("Link copied! You can paste it in your Instagram story or DM.");
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
              <div className="flex items-center gap-4 py-4 border-y border-gray-100">
                <Avatar
                  src={event.organizer.avatar}
                  alt={`${event.organizer.firstName} ${event.organizer.lastName}`}
                  fallback={event.organizer.firstName || "?"}
                  size="lg"
                  className="ring-4 ring-gray-50"
                />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-0.5">Hosted By</div>
                  <div className="text-xl font-bold text-gray-900">{event.organizer.firstName} {event.organizer.lastName}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg prose-gray max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Event</h3>
              {event.description.split('\n').map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>
              ))}

              {event.requirements && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Requirements</h3>
                  <div className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                    {event.requirements}
                  </div>
                </>
              )}

              {event.additionalInfo && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Additional Information</h3>
                  <div className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                    {event.additionalInfo}
                  </div>
                </>
              )}
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
                    style={{ border: 0 }}
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

                  {/* Status Badge */}
                  {event.status !== 'PUBLISHED' && event.status !== 'REGISTRATION_OPEN' && (
                    <div className={`
                      mb-4 p-3 rounded-xl text-center font-bold text-sm
                      ${event.status === 'REGISTRATION_CLOSED' ? 'bg-red-50 text-red-700' : ''}
                      ${event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                      ${event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : ''}
                      ${event.status === 'DRAFT' ? 'bg-yellow-50 text-yellow-700' : ''}
                    `}>
                      {event.status.replace(/_/g, ' ')}
                    </div>
                  )}

                  {event.isRegistered ? (
                    <button disabled className="w-full py-4 bg-green-50 text-green-700 font-bold rounded-xl border border-green-100 flex items-center justify-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      You're Going!
                    </button>
                  ) : (event.status === 'PUBLISHED' || event.status === 'REGISTRATION_OPEN') && spotsLeft > 0 ? (
                    <button
                      onClick={onRegister}
                      className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-900/20"
                    >
                      Register for Event
                    </button>
                  ) : (
                    <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                      {event.status === 'REGISTRATION_CLOSED' ? 'Registration Closed' :
                        event.status === 'CANCELLED' ? 'Event Cancelled' :
                          event.status === 'COMPLETED' ? 'Event Ended' :
                            spotsLeft <= 0 && !event.isUnlimited ? 'Sold Out' : 'Unavailable'}
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <UserCircleIcon className="w-4 h-4" />
                    <span>
                      {event.registrationCount} people going
                      {!event.isUnlimited && ` • ${spotsLeft} spots left`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendees Preview */}
              {event.registrationCount > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Who's going
                    <div className="w-full max-w-[140px]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-gray-700">
                          {event.isUnlimited ? (
                            "Unlimited spots"
                          ) : (
                            <>
                              {event.registrationCount} <span className="text-gray-400">/ {event.maxParticipants}</span>
                            </>
                          )}
                        </span>
                        {!event.isUnlimited && (
                          <span className="text-gray-400">
                            {Math.round(((event.registrationCount || 0) / (event.maxParticipants || 1)) * 100)}%
                          </span>
                        )}
                      </div>
                      {!event.isUnlimited && (
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${event.registrationCount >= event.maxParticipants
                              ? "bg-red-500"
                              : event.registrationCount >= event.maxParticipants * 0.8
                                ? "bg-yellow-500"
                                : "bg-cyan-500"
                              }`}
                            style={{ width: `${Math.min(100, ((event.registrationCount || 0) / (event.maxParticipants || 1)) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
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

              {/* Comments Section */}
              <CommentsSection eventId={event.id} isRegistered={!!event.isRegistered} />

            </div>
          </div>
        </div>
      </main>



      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Share Event</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center gap-6 mb-8">
              <button
                onClick={() => handleShare('whatsapp')}
                className="group relative flex flex-col items-center gap-2"
                aria-label="Share on WhatsApp"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 absolute -bottom-6 transition-opacity whitespace-nowrap">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('instagram')}
                className="group relative flex flex-col items-center gap-2"
                aria-label="Share on Instagram"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFD600] via-[#FF0100] to-[#D800B9] text-white flex items-center justify-center shadow-lg shadow-[#D800B9]/20 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 absolute -bottom-6 transition-opacity whitespace-nowrap">Instagram</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="group relative flex flex-col items-center gap-2"
                aria-label="Share on Facebook"
              >
                <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg shadow-[#1877F2]/20 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.898v1.074h3.44l-.615 3.672h-2.825v7.98c9.414-.865 16.531-8.79 16.531-18.36C30.65 6.524 23.65 0 15.325 0S0 6.524 0 14.662c0 9.571 7.118 17.495 16.531 18.36Z" transform="scale(0.75) translate(4,4)" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 absolute -bottom-6 transition-opacity whitespace-nowrap">Facebook</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="block w-full pl-10 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                aria-label="Event Link"
              />
              <button
                onClick={() => handleShare('copy')}
                className="absolute inset-y-1 right-1 px-3 bg-white rounded-lg text-xs font-bold text-gray-900 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                aria-label="Copy Link"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;

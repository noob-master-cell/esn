// frontend/src/pages/EventDetailsPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useAuth } from "@clerk/clerk-react";
import { GET_EVENT } from "../lib/graphql/events";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

// ----------- SVG Icon Components ----------- //

const CalendarIcon = () => (
  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const LocationPinIcon = () => (
  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const UserIcon = () => (
  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  </svg>
);

// ----------- Sub-components for the page ----------- //

// A reusable component to display event info with an icon
const InfoBlock = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center text-lg text-gray-700">{icon}{children}</div>
);

// Component for displaying a single comment
const Comment = ({ author, text, time }: { author: string; text: string; time: string }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <UserIcon />
    </div>
    <div className="flex-1">
      <div className="bg-gray-100 rounded-lg px-4 py-2">
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-gray-600">{text}</p>
      </div>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

interface EventDetailsPageProps {}

const EventDetailsPage: React.FC<EventDetailsPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data, loading, error } = useQuery(GET_EVENT, {
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

  // Handle registration button click - Navigate to registration page
  const handleRegisterClick = () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    navigate(`/events/${id}/register`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-64 md:h-96 bg-gray-200"></div>
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2 mt-8">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="h-80 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
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
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
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

  // Mock comments data - replace with real data when comments feature is implemented
  const mockComments = [
    { id: 1, author: "Maria S.", text: "Can't wait for this! Is lunch included?", time: "2 hours ago" },
    { id: 2, author: "Admin (ESN)", text: "Hi Maria! Lunch is not included, but we'll stop at a place with plenty of options to buy food.", time: "1 hour ago" },
    { id: 3, author: "Carlos G.", text: "Is it possible to join from a different city?", time: "30 minutes ago" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Back Button */}
      <div className="container mx-auto p-4 pt-8">
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

      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header Image */}
          <div 
            className="h-64 md:h-96 bg-cover bg-center" 
            style={{ backgroundImage: `url('${eventImage}')` }}
          ></div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {event.title}
                </h1>
                <div className="space-y-4 mt-6">
                  <InfoBlock icon={<CalendarIcon />}>
                    {startDateTime.date}
                  </InfoBlock>
                  <InfoBlock icon={<ClockIcon />}>
                    {startDateTime.time} - {endDateTime.time}
                  </InfoBlock>
                  <InfoBlock icon={<LocationPinIcon />}>
                    {event.location}
                    {event.address && (
                      <span className="block text-sm text-gray-500 ml-8">
                        {event.address}
                      </span>
                    )}
                  </InfoBlock>
                </div>
                
                {/* Event Description */}
                <div className="mt-8 prose max-w-none text-gray-600">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                  
                  {/* Additional Info */}
                  {event.requirements && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Requirements</h3>
                      <p className="text-gray-600">{event.requirements}</p>
                    </div>
                  )}
                  
                  {event.additionalInfo && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Additional Information</h3>
                      <p className="text-gray-600">{event.additionalInfo}</p>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Registration Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl shadow-inner p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-center mb-4">Register for this Event</h2>
                  
                  {/* Price Display */}
                  <div className="text-center mb-4">
                    {event.type === "FREE" ? (
                      <p className="text-5xl font-extrabold text-green-600">FREE</p>
                    ) : (
                      <>
                        <p className="text-5xl font-extrabold text-gray-800">
                          €{event.price?.toFixed(2)}
                        </p>
                        <p className="text-gray-500">Standard Price</p>
                      </>
                    )}
                  </div>
                  
                  {/* ESN Card Discount */}
                  {event.memberPrice && event.memberPrice < (event.price || 0) && (
                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md text-center mb-4">
                      <p className="font-bold">
                        ESN Card holders pay only €{event.memberPrice.toFixed(2)}!
                      </p>
                    </div>
                  )}
                  
                  {/* Registration Button */}
                  {event.canRegister ? (
                    <button 
                      onClick={handleRegisterClick}
                      className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg"
                    >
                      {spotsLeft > 0 ? "Register Now" : "Join Waitlist"}
                    </button>
                  ) : event.isRegistered ? (
                    <div className="w-full bg-green-100 text-green-800 font-bold py-3 px-4 rounded-lg text-center text-lg">
                      ✅ You're registered!
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-lg text-center text-lg">
                      Registration Closed
                    </div>
                  )}
                  
                  {/* Spots Left */}
                  <p className="text-center text-red-600 font-bold mt-3">
                    {spotsLeft > 0 ? `${spotsLeft} SPOTS LEFT` : "EVENT FULL"}
                  </p>
                  
                  {/* Organizer Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Organizer</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {event.organizer.firstName[0]}{event.organizer.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.organizer.firstName} {event.organizer.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.organizer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Community Discussion</h2>
              <div className="space-y-6">
                {mockComments.map(comment => (
                  <Comment key={comment.id} {...comment} />
                ))}
              </div>
              <div className="mt-8 flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <UserIcon />
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add a public comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button 
                    className="mt-2 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => {
                      // TODO: Implement comment posting
                      console.log("Posting comment:", newComment);
                      setNewComment("");
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
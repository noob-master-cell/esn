// frontend/src/pages/ProfilePage.tsx
import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_MY_REGISTRATIONS } from "../lib/graphql/registrations";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";

// ----------- SVG Icon Components ----------- //

const UserIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const LinkIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
  </svg>
);



// Section Header Component
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center mb-6">
    {icon}
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
  </div>
);

const ProfilePage: React.FC = () => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [esnCardNumber, setEsnCardNumber] = useState("");
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
    telegram: (user?.publicMetadata?.telegram as string) || "",
    birthday: (user?.publicMetadata?.birthday as string) || "",
  });

  const { data, loading, error, refetch } = useQuery(GET_MY_REGISTRATIONS, {
    skip: !isSignedIn,
    errorPolicy: "all",
  });

  // Handle profile update using Clerk's update method
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      await user?.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          telegram: profileData.telegram,
          birthday: profileData.birthday,
          phone: profileData.phone,
        },
      });

      setIsEditingProfile(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateError("Failed to update profile. Please try again.");
    }
  };

  // Handle ESN card submission
  const handleEsnCardSubmit = async () => {
    if (!esnCardNumber.trim()) {
      setUpdateError("Please enter a valid ESN card number");
      return;
    }

    setIsSubmittingCard(true);
    setUpdateError(null);

    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          esnCardNumber: esnCardNumber,
          esnCardVerified: false, // Will be verified by admin
        },
      });
      setEsnCardNumber("");
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("ESN card update error:", error);
      setUpdateError("Failed to add ESN card. Please try again.");
    } finally {
      setIsSubmittingCard(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 md:p-10">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in state
  if (!isSignedIn) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to view your profile.
            </p>
            <Button onClick={() => navigate("/sign-in")} className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const registrations = data?.myRegistrations || [];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Success Message */}
      {updateSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="success"
            title="Updated Successfully!"
            message="Your profile has been updated."
            onClose={() => setUpdateSuccess(false)}
          />
        </div>
      )}

      {/* Error Message */}
      {updateError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="error"
            title="Update Failed"
            message={updateError}
            onClose={() => setUpdateError(null)}
          />
        </div>
      )}

      {/* Back Button */}
      <div className="container mx-auto p-4 pt-8">
        <button
          onClick={() => navigate("/")}
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
          Back to Home
        </button>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header with Profile Card */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-xl opacity-90">ESN Member since {memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Left Column: Profile Details */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* User Information Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <SectionHeader icon={<UserIcon />} title="Personal Information" />
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {user?.phoneNumbers?.[0]?.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birthday
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {(user?.publicMetadata?.birthday as string) || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telegram Username
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {(user?.publicMetadata?.telegram as string) || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => alert("Profile picture change coming soon!")}
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>

               

                {/* Recent Events */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <SectionHeader icon={<CalendarIcon />} title={`Recent Events (${registrations.length})`} />
                  
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-16 animate-pulse"></div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-red-500 mb-2">Failed to load events</p>
                      <Button onClick={() => refetch()} variant="outline" size="sm">
                        Try Again
                      </Button>
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📅</div>
                      <p className="text-gray-500 mb-4">No events yet</p>
                      <Button
                        onClick={() => navigate("/events")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Browse Events
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {registrations.slice(0, 5).map((registration) => (
                        <div
                          key={registration.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/events/${registration.event.id}`)}
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {registration.event.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(registration.event.startDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              registration.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : registration.status === "WAITLISTED"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </div>
                      ))}
                      {registrations.length > 5 && (
                        <Button
                          onClick={() => navigate("/events")}
                          variant="outline"
                          className="w-full mt-3"
                        >
                          View All Events ({registrations.length - 5} more)
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: ESN Card & Settings */}
              <div className="lg:col-span-1 space-y-8">
                
                {/* ESN Card Section */}
                <div className="bg-gray-50 rounded-xl shadow-inner p-6 sticky top-8">
                  <SectionHeader icon={<CreditCardIcon />} title="ESN Card" />
                  
                  <div className="space-y-4">
                    <p className="text-gray-700 text-sm">
                      With an ESN card, you can enjoy discounts on most of our events. 
                      Check out all the offers on{" "}
                      <a
                        href="https://esncard.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        ESNcard.org
                      </a>
                      !
                    </p>

                    {/* Show current ESN card if exists */}
                    {user?.publicMetadata?.esnCardNumber && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              ESN Card: {user.publicMetadata.esnCardNumber}
                            </p>
                            <p className="text-xs text-green-600">
                              {user.publicMetadata.esnCardVerified
                                ? "✅ Verified"
                                : "⏳ Pending verification"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open("https://esncard.org", "_blank")}
                    >
                      Get ESN Card
                    </Button>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Add Your ESN Card</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ESN card number"
                          value={esnCardNumber}
                          onChange={(e) => setEsnCardNumber(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <Button
                          onClick={handleEsnCardSubmit}
                          loading={isSubmittingCard}
                          disabled={!esnCardNumber.trim() || isSubmittingCard}
                          size="sm"
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Integration */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <SectionHeader icon={<LinkIcon />} title="Calendar Integration" />
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Your personal calendar link:</p>
                    <div className="flex items-center gap-2 text-xs font-mono bg-white p-2 rounded border break-all">
                      <span className="text-gray-800">
                        esn.world/cal/{user?.id?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <SectionHeader icon={<SettingsIcon />} title="Quick Actions" />
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => navigate("/events")}
                    >
                      Browse Events
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-700 border-gray-200 hover:bg-gray-50"
                      onClick={() => {
                        const feedback = prompt("Please share your feedback:");
                        if (feedback) {
                          alert(`Thank you for your feedback: "${feedback}"`);
                        }
                      }}
                    >
                      Give Feedback
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsEditingProfile(false)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  placeholder="+49 123 456 7890"
                />
                <Input
                  label="Telegram Username"
                  value={profileData.telegram}
                  onChange={(e) =>
                    setProfileData({ ...profileData, telegram: e.target.value })
                  }
                  placeholder="@username"
                />
                <Input
                  label="Birthday"
                  type="date"
                  value={profileData.birthday}
                  onChange={(e) =>
                    setProfileData({ ...profileData, birthday: e.target.value })
                  }
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!profileData.firstName || !profileData.lastName}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileData({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
                        telegram: (user?.publicMetadata?.telegram as string) || "",
                        birthday: (user?.publicMetadata?.birthday as string) || "",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
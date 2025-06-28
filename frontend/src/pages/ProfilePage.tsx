// frontend/src/pages/ProfilePage.tsx
import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_MY_REGISTRATIONS } from "../lib/graphql/registrations";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not signed in state
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
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
    <div className="min-h-screen bg-gray-100">
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

      {/* Header Section */}
      <div className="bg-gray-200 pb-32 pt-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* ESN Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative max-w-md mx-auto">
            {/* ESN Header with Logo */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 relative">
              <div className="flex items-center gap-3 text-white">
                {/* ESN Star Logo */}
                <div className="text-white">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z M12 6.5L11.5 9.5L9.5 9.75L11.5 10L12 13L12.5 10L14.5 9.75L12.5 9.5L12 6.5Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">ESN</div>
                  <div className="text-sm opacity-90">
                    Erasmus Student Network
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="px-6 py-8 text-center relative">
              {/* Profile Avatar - positioned to overlap blue section */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </div>
              </div>

              {/* Name */}
              <div className="mt-12">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 mt-1">Member since {memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* User Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Information
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email:
                    </label>
                    <p className="text-gray-900">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birthday:
                    </label>
                    <p className="text-gray-900">
                      {(user?.publicMetadata?.birthday as string) || "Not set"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telegram username:
                    </label>
                    <p className="text-gray-900">
                      {(user?.publicMetadata?.telegram as string) || "not set"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone number:
                    </label>
                    <p className="text-gray-900">
                      {user?.phoneNumbers?.[0]?.phoneNumber ||
                        "Your phone number was not saved"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Update data
                  </Button>

                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center gap-2"
                    onClick={() => alert("Profile picture change coming soon!")}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                    </svg>
                    Change Profile picture
                  </Button>

                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete your account? This action cannot be undone."
                        )
                      ) {
                        alert("Account deletion coming soon!");
                      }
                    }}
                  >
                    Delete User account
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Integration Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Calendar Integration
                </h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span className="font-mono text-xs break-all">
                  https://esn.world/cal/private/{user?.id || "user-calendar-id"}
                </span>
              </div>
            </div>

            {/* Participated Events Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Participated events ({registrations.length})
                </h2>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg h-16 animate-pulse"
                    ></div>
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
                  <p className="text-gray-500 mb-4">No events yet</p>
                  <Button
                    onClick={() => navigate("/events")}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 mx-auto"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.slice(0, 3).map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {registration.event.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            registration.event.startDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  {registrations.length > 3 && (
                    <Button
                      onClick={() => navigate("/events")}
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View All Events ({registrations.length - 3} more)
                    </Button>
                  )}
                </div>
              )}

              <Button
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                onClick={() => {
                  const code = prompt("Enter event code:");
                  if (code) {
                    alert(
                      `Claiming event with code: ${code}\n(Feature coming soon!)`
                    );
                  }
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Claim event with code
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* ESN Card Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">ESNcard</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  With an ESNcard, you can enjoy a discount on most of our
                  events. Check out all the offers on{" "}
                  <a
                    href="https://esncard.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    ESNcard.org
                  </a>
                  !
                </p>

                <p className="text-gray-700">
                  You can get your ESNcard by clicking on the button below.
                </p>

                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  onClick={() => window.open("https://esncard.org", "_blank")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Get your ESNcard
                </Button>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Add your ESNcard
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    If you already have an ESNcard, you can add it here to
                    profit from special prices.
                  </p>

                  {/* Show current ESN card if exists */}
                  {user?.publicMetadata?.esnCardNumber && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
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

                  <div className="flex gap-2">
                    <Input
                      label=""
                      placeholder="ESNcard number*"
                      value={esnCardNumber}
                      onChange={(e) => setEsnCardNumber(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleEsnCardSubmit}
                      loading={isSubmittingCard}
                      disabled={!esnCardNumber.trim() || isSubmittingCard}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4"
                    >
                      Submit Number
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => {
              const feedback = prompt("Please share your feedback:");
              if (feedback) {
                alert(
                  `Thank you for your feedback: "${feedback}"\n(This will be sent to our team!)`
                );
              }
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Give Feedback
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Button>
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
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Profile
                </h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    disabled={!profileData.firstName || !profileData.lastName}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingProfile(false);
                      // Reset form data
                      setProfileData({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
                        telegram:
                          (user?.publicMetadata?.telegram as string) || "",
                        birthday:
                          (user?.publicMetadata?.birthday as string) || "",
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

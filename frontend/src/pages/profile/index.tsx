import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { useProfileData } from "./hooks/useProfileData";
import { useProfileActions } from "./hooks/useProfileActions";
import { ProfileHeader } from "./components/ProfileHeader";
import { PhotoUploadModal } from "./components/PhotoUploadModal";
import { OverviewTab } from "./tabs/OverviewTab";
import { EventsTab } from "./tabs/EventsTab";
import { SettingsTab } from "./tabs/SettingsTab";

const ProfilePage: React.FC = () => {
  const { isSignedIn, isLoaded, user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'settings'>('overview');
  const [activeEventFilter, setActiveEventFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Data
  const {
    dbUser,
    profileLoading,
    refetchProfile,
    allRegistrations,
    registrationsLoading,
    registrationsError,
    refetchRegistrations,
  } = useProfileData(isSignedIn);

  // Actions
  const { updateUserProfile, cancelRegistration, createRegistration, deleteUser } = useProfileActions();

  // Handlers
  const handlePhotoUpload = async (url: string | null) => {
    try {
      await updateUserProfile({
        variables: { updateUserInput: { avatar: url } },
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      refetchProfile();
    } catch (error) {
      console.error("Photo upload error:", error);
      setUpdateError("Failed to upload photo.");
    }
  };

  const handleExportData = () => {
    const userData = {
      profile: dbUser,
      registrations: allRegistrations,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esn-profile-${dbUser?.firstName}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCalendarLink = () => {
    return `${window.location.origin}/api/calendar/${user?.id}`;
  };

  const handleLogout = async () => {
    try {
      logout({ logoutParams: { returnTo: window.location.origin } });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await deleteUser();
        logout({ logoutParams: { returnTo: window.location.origin } });
        navigate("/");
      } catch (error) {
        console.error("Account deletion error:", error);
        setUpdateError("Failed to delete account. Please contact support.");
      }
    }
  };

  // Loading state
  if (!isLoaded || profileLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 md:p-10 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in state
  if (!isSignedIn) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">You need to sign in to view your profile.</p>
            <Button onClick={() => navigate("/sign-in")} className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            type="success"
            title="Updated Successfully!"
            message="Your changes have been saved."
            onClose={() => setUpdateSuccess(false)}
          />
        </div>
      )}
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

      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <ProfileHeader
            dbUser={dbUser}
            memberSince={memberSince}
            onChangePhoto={() => setIsChangingPhoto(true)}
          />

          {/* Photo Upload Modal */}
          <PhotoUploadModal
            dbUser={dbUser}
            isOpen={isChangingPhoto}
            onClose={() => setIsChangingPhoto(false)}
            onUploadComplete={handlePhotoUpload}
          />

          {/* Navigation Tabs */}
          <div className="px-6 md:px-10">
            <Tabs
              tabs={[
                { id: "overview", label: "Overview" },
                { id: "events", label: "Events", count: allRegistrations?.length || 0 },
                { id: "settings", label: "Settings" },
              ]}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as 'overview' | 'events' | 'settings')}
            />
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-10">
            {activeTab === "overview" && (
              <OverviewTab
                dbUser={dbUser}
                allRegistrations={allRegistrations || []}
                registrationsLoading={registrationsLoading}
                registrationsError={registrationsError}
                refetchRegistrations={refetchRegistrations}
                refetchProfile={refetchProfile}
                setActiveTab={setActiveTab}
                setEventFilter={setActiveEventFilter}
                handleExportData={handleExportData}
                getCalendarLink={getCalendarLink}
              />
            )}

            {activeTab === "events" && (
              <EventsTab
                allRegistrations={allRegistrations || []}
                registrationsLoading={registrationsLoading}
                cancelRegistration={cancelRegistration}
                createRegistration={createRegistration}
                refetchRegistrations={refetchRegistrations}
                setUpdateSuccess={setUpdateSuccess}
                setUpdateError={setUpdateError}
                filter={activeEventFilter}
                onFilterChange={setActiveEventFilter}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                handleLogout={handleLogout}
                handleDeleteAccount={handleDeleteAccount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
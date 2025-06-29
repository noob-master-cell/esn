// frontend/src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_MY_REGISTRATIONS } from "../lib/graphql/registrations";
import { UPDATE_USER_PROFILE, GET_USER_PROFILE } from "../lib/graphql/users";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";

// ----------- SVG Icon Components ----------- //

const UserIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM10.5 17H15l-5 5v-5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

// Section Header Component
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center mb-6">
    {icon}
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
  </div>
);

// Tab Component
const TabButton = ({ 
  active, 
  onClick, 
  children, 
  count 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
  count?: number; 
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
      active
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`}
  >
    {children}
    {count !== undefined && (
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
        active ? "bg-blue-500" : "bg-gray-200 text-gray-600"
      }`}>
        {count}
      </span>
    )}
  </button>
);

// Event Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    CONFIRMED: { bg: "bg-green-100", text: "text-green-800", label: "Confirmed" },
    WAITLISTED: { bg: "bg-orange-100", text: "text-orange-800", label: "Waitlisted" },
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    CANCELLED: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
    ATTENDED: { bg: "bg-blue-100", text: "text-blue-800", label: "Attended" },
  };
  
  const config = configs[status as keyof typeof configs] || configs.PENDING;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
  nationality: string;
  chapter: string;
  bio: string;
  telegram: string;
  instagram: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface NotificationSettings {
  emailEvents: boolean;
  emailReminders: boolean;
  emailNewsletter: boolean;
  emailPromotions: boolean;
  pushEvents: boolean;
  pushReminders: boolean;
  pushUpdates: boolean;
  smsReminders: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showUniversity: boolean;
  allowMessages: boolean;
}

const ProfilePage: React.FC = () => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  
  // Success/Error states
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  // ESN Card Management
  const [esnCardNumber, setEsnCardNumber] = useState("");
  const [esnCardExpiry, setEsnCardExpiry] = useState("");
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [esnCardDocument, setEsnCardDocument] = useState<File | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    university: "",
    nationality: "",
    chapter: "",
    bio: "",
    telegram: "",
    instagram: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailEvents: true,
    emailReminders: true,
    emailNewsletter: false,
    emailPromotions: false,
    pushEvents: true,
    pushReminders: true,
    pushUpdates: true,
    smsReminders: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showUniversity: true,
    allowMessages: true,
  });

  // GraphQL Queries and Mutations
  const { data: profileQueryData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_USER_PROFILE, {
    skip: !isSignedIn,
    errorPolicy: "all",
  });

  const { data: registrationsData, loading: registrationsLoading, error: registrationsError, refetch: refetchRegistrations } = useQuery(GET_MY_REGISTRATIONS, {
    skip: !isSignedIn,
    errorPolicy: "all",
  });

  const [updateUserProfile, { loading: updating }] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: () => {
      setIsEditingProfile(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      refetchProfile();
    },
    onError: (error) => {
      setUpdateError(error.message);
    },
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
        university: (user.publicMetadata?.university as string) || "",
        nationality: (user.publicMetadata?.nationality as string) || "",
        chapter: (user.publicMetadata?.chapter as string) || "",
        bio: (user.publicMetadata?.bio as string) || "",
        telegram: (user.publicMetadata?.telegram as string) || "",
        instagram: (user.publicMetadata?.instagram as string) || "",
        emergencyContactName: (user.publicMetadata?.emergencyContactName as string) || "",
        emergencyContactPhone: (user.publicMetadata?.emergencyContactPhone as string) || "",
      });

      // Load notification settings from user metadata
      const savedNotifications = user.publicMetadata?.notifications as NotificationSettings;
      if (savedNotifications) {
        setNotifications(savedNotifications);
      }

      // Load privacy settings from user metadata
      const savedPrivacy = user.publicMetadata?.privacy as PrivacySettings;
      if (savedPrivacy) {
        setPrivacy(savedPrivacy);
      }
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      // Update both Clerk and backend
      await user?.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          university: profileData.university,
          nationality: profileData.nationality,
          chapter: profileData.chapter,
          bio: profileData.bio,
          telegram: profileData.telegram,
          instagram: profileData.instagram,
          phone: profileData.phone,
          emergencyContactName: profileData.emergencyContactName,
          emergencyContactPhone: profileData.emergencyContactPhone,
        },
      });

      // Update backend through GraphQL
      await updateUserProfile({
        variables: {
          updateUserInput: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            university: profileData.university,
            nationality: profileData.nationality,
          },
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateError("Failed to update profile. Please try again.");
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (file: File) => {
    setIsUploadingPhoto(true);
    setUpdateError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to a service like Cloudinary or your backend
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { imageUrl } = await response.json();

      // Update user with new avatar URL
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          avatar: imageUrl,
        },
      });

      setIsChangingPhoto(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Photo upload error:", error);
      setUpdateError("Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
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
          esnCardExpiry: esnCardExpiry,
          esnCardVerified: false, // Will be verified by admin
        },
      });
      
      setEsnCardNumber("");
      setEsnCardExpiry("");
      setEsnCardDocument(null);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("ESN card update error:", error);
      setUpdateError("Failed to add ESN card. Please try again.");
    } finally {
      setIsSubmittingCard(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications,
        },
      });
      
      setShowNotificationSettings(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Notification settings update error:", error);
      setUpdateError("Failed to update notification settings.");
    }
  };

  // Handle privacy settings update
  const handlePrivacyUpdate = async () => {
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          privacy,
        },
      });
      
      setShowPrivacySettings(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Privacy settings update error:", error);
      setUpdateError("Failed to update privacy settings.");
    }
  };

  // Export user data
  const handleExportData = () => {
    const userData = {
      profile: profileData,
      registrations: registrationsData?.myRegistrations || [],
      notifications,
      privacy,
      createdAt: user?.createdAt,
      lastSignInAt: user?.lastSignInAt,
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `esn-profile-${user?.firstName}-${user?.lastName}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Generate calendar link
  const getCalendarLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/calendar/${user?.id}`;
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

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await user?.delete();
        navigate("/");
      } catch (error) {
        console.error("Account deletion error:", error);
        setUpdateError("Failed to delete account. Please contact support.");
      }
    }
  };

  // Filter registrations based on selected filter
  const getFilteredRegistrations = () => {
    const registrations = registrationsData?.myRegistrations || [];
    const now = new Date();

    switch (eventFilter) {
      case 'upcoming':
        return registrations.filter(r => new Date(r.event.startDate) > now && r.status !== 'CANCELLED');
      case 'past':
        return registrations.filter(r => new Date(r.event.startDate) <= now || r.status === 'ATTENDED');
      case 'cancelled':
        return registrations.filter(r => r.status === 'CANCELLED');
      default:
        return registrations;
    }
  };

  // Loading state
  if (!isLoaded || profileLoading) {
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">You need to sign in to view your profile.</p>
            <Button onClick={() => navigate("/sign-in")} className="w-full">Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  const registrations = getFilteredRegistrations();
  const allRegistrations = registrationsData?.myRegistrations || [];
  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Success Message */}
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <div className="relative group">
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg overflow-hidden">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.firstName?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <button
                    onClick={() => setIsChangingPhoto(true)}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-xl opacity-90">ESN Member since {memberSince}</p>
                  {(user?.publicMetadata?.university as string) && (
                    <p className="text-lg opacity-75">{user.publicMetadata.university}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 px-6 md:px-10">
            <div className="flex space-x-1 py-4">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabButton>
              <TabButton
                active={activeTab === 'events'}
                onClick={() => setActiveTab('events')}
                count={allRegistrations.length}
              >
                Events
              </TabButton>
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </TabButton>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                
                {/* Left Column: Profile Details */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* User Information Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <SectionHeader icon={<UserIcon />} title="Personal Information" />
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user?.phoneNumbers?.[0]?.phoneNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {(user?.publicMetadata?.university as string) || "Not set"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {(user?.publicMetadata?.nationality as string) || "Not set"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ESN Chapter</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {(user?.publicMetadata?.chapter as string) || "Not set"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {(user?.publicMetadata?.telegram as string) || "Not set"}
                        </p>
                      </div>
                    </div>

                    {/* Bio Section */}
                    {(user?.publicMetadata?.bio as string) && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.publicMetadata.bio}
                        </p>
                      </div>
                    )}

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
                        onClick={handleExportData}
                      >
                        <DownloadIcon />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  {/* Recent Events Preview */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <SectionHeader icon={<CalendarIcon />} title="Recent Events" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('events')}
                      >
                        View All
                      </Button>
                    </div>
                    
                    {registrationsLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-gray-100 rounded-lg h-16 animate-pulse"></div>
                        ))}
                      </div>
                    ) : registrationsError ? (
                      <div className="text-center py-4">
                        <p className="text-red-500 mb-2">Failed to load events</p>
                        <Button onClick={() => refetchRegistrations()} variant="outline" size="sm">
                          Try Again
                        </Button>
                      </div>
                    ) : allRegistrations.length === 0 ? (
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
                        {allRegistrations.slice(0, 3).map((registration) => (
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
                            <StatusBadge status={registration.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: ESN Card & Quick Actions */}
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
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                              {user.publicMetadata.esnCardExpiry && (
                                <p className="text-xs text-green-600">
                                  Expires: {new Date(user.publicMetadata.esnCardExpiry as string).toLocaleDateString()}
                                </p>
                              )}
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
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="ESN card number"
                            value={esnCardNumber}
                            onChange={(e) => setEsnCardNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <input
                            type="date"
                            placeholder="Expiry date"
                            value={esnCardExpiry}
                            onChange={(e) => setEsnCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <Button
                            onClick={handleEsnCardSubmit}
                            loading={isSubmittingCard}
                            disabled={!esnCardNumber.trim() || isSubmittingCard}
                            className="w-full bg-gray-600 hover:bg-gray-700"
                          >
                            {isSubmittingCard ? "Adding..." : "Add Card"}
                          </Button>
                        </div>
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
                        onClick={() => navigate("/dashboard")}
                      >
                        View Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-gray-700 border-gray-200 hover:bg-gray-50"
                        onClick={() => setShowNotificationSettings(true)}
                      >
                        <BellIcon />
                        Notifications
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-gray-700 border-gray-200 hover:bg-gray-50"
                        onClick={() => setShowPrivacySettings(true)}
                      >
                        <ShieldIcon />
                        Privacy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                  
                  {/* Event Filters */}
                  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <TabButton
                      active={eventFilter === 'all'}
                      onClick={() => setEventFilter('all')}
                      count={allRegistrations.length}
                    >
                      All
                    </TabButton>
                    <TabButton
                      active={eventFilter === 'upcoming'}
                      onClick={() => setEventFilter('upcoming')}
                      count={allRegistrations.filter(r => new Date(r.event.startDate) > new Date() && r.status !== 'CANCELLED').length}
                    >
                      Upcoming
                    </TabButton>
                    <TabButton
                      active={eventFilter === 'past'}
                      onClick={() => setEventFilter('past')}
                      count={allRegistrations.filter(r => new Date(r.event.startDate) <= new Date() || r.status === 'ATTENDED').length}
                    >
                      Past
                    </TabButton>
                    <TabButton
                      active={eventFilter === 'cancelled'}
                      onClick={() => setEventFilter('cancelled')}
                      count={allRegistrations.filter(r => r.status === 'CANCELLED').length}
                    >
                      Cancelled
                    </TabButton>
                  </div>
                </div>

                {registrationsLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                        <div className="space-y-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : registrationsError ? (
                  <div className="text-center py-12">
                    <Alert
                      type="error"
                      title="Failed to load events"
                      message="There was an error loading your events. Please try again."
                    />
                    <Button onClick={() => refetchRegistrations()} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {eventFilter !== 'all' ? eventFilter : ''} events found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {eventFilter === 'all' 
                        ? "You haven't registered for any events yet."
                        : `You don't have any ${eventFilter} events.`}
                    </p>
                    <Button
                      onClick={() => navigate("/events")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/events/${registration.event.id}`)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {registration.event.title}
                            </h3>
                            <StatusBadge status={registration.status} />
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>
                                {new Date(registration.event.startDate).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="line-clamp-1">{registration.event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              Registered {new Date(registration.registeredAt).toLocaleDateString()}
                            </span>
                            {registration.amountDue > 0 && (
                              <span className="font-medium text-gray-900">
                                €{registration.amountDue}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-4xl space-y-8">
                
                {/* Account Settings */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <SectionHeader icon={<SettingsIcon />} title="Account Settings" />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Change Password</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Update your password to keep your account secure.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(user?.passwordChangeUrl || '/change-password', '_blank')}
                      >
                        Change Password
                      </Button>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Add an extra layer of security to your account.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => alert("Two-factor authentication setup coming soon!")}
                      >
                        Setup 2FA
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Privacy & Visibility */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <SectionHeader icon={<ShieldIcon />} title="Privacy & Visibility" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPrivacySettings(true)}
                    >
                      <EyeIcon />
                      Manage
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Profile visible to others</span>
                        <span className={`text-sm font-medium ${privacy.profileVisible ? 'text-green-600' : 'text-gray-500'}`}>
                          {privacy.profileVisible ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Show email address</span>
                        <span className={`text-sm font-medium ${privacy.showEmail ? 'text-green-600' : 'text-gray-500'}`}>
                          {privacy.showEmail ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Show phone number</span>
                        <span className={`text-sm font-medium ${privacy.showPhone ? 'text-green-600' : 'text-gray-500'}`}>
                          {privacy.showPhone ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Show university</span>
                        <span className={`text-sm font-medium ${privacy.showUniversity ? 'text-green-600' : 'text-gray-500'}`}>
                          {privacy.showUniversity ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Allow messages from others</span>
                        <span className={`text-sm font-medium ${privacy.allowMessages ? 'text-green-600' : 'text-gray-500'}`}>
                          {privacy.allowMessages ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <SectionHeader icon={<BellIcon />} title="Notification Settings" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNotificationSettings(true)}
                    >
                      Manage
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Event notifications</span>
                        <span className={`text-sm font-medium ${notifications.emailEvents ? 'text-green-600' : 'text-gray-500'}`}>
                          {notifications.emailEvents ? 'On' : 'Off'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Event reminders</span>
                        <span className={`text-sm font-medium ${notifications.emailReminders ? 'text-green-600' : 'text-gray-500'}`}>
                          {notifications.emailReminders ? 'On' : 'Off'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Newsletter</span>
                        <span className={`text-sm font-medium ${notifications.emailNewsletter ? 'text-green-600' : 'text-gray-500'}`}>
                          {notifications.emailNewsletter ? 'On' : 'Off'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Push notifications</span>
                        <span className={`text-sm font-medium ${notifications.pushEvents ? 'text-green-600' : 'text-gray-500'}`}>
                          {notifications.pushEvents ? 'On' : 'Off'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SMS reminders</span>
                        <span className={`text-sm font-medium ${notifications.smsReminders ? 'text-green-600' : 'text-gray-500'}`}>
                          {notifications.smsReminders ? 'On' : 'Off'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data & Calendar */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <SectionHeader icon={<LinkIcon />} title="Data & Integrations" />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Export Your Data</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Download all your data in JSON format.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleExportData}
                      >
                        <DownloadIcon />
                        Export Data
                      </Button>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Calendar Integration</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Subscribe to your personal event calendar.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={getCalendarLink()}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(getCalendarLink());
                              setUpdateSuccess(true);
                              setTimeout(() => setUpdateSuccess(false), 2000);
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Sign Out</h4>
                        <p className="text-sm text-red-700">Sign out of your account on this device.</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700">Permanently delete your account and all data.</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                        onClick={() => setShowDeleteAccount(true)}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+49 123 456 7890"
                  />
                  <Input
                    label="University"
                    value={profileData.university}
                    onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                    placeholder="Your university"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nationality"
                    value={profileData.nationality}
                    onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                    placeholder="Your nationality"
                  />
                  <Input
                    label="ESN Chapter"
                    value={profileData.chapter}
                    onChange={(e) => setProfileData({ ...profileData, chapter: e.target.value })}
                    placeholder="ESN Chapter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Telegram Username"
                    value={profileData.telegram}
                    onChange={(e) => setProfileData({ ...profileData, telegram: e.target.value })}
                    placeholder="@username"
                  />
                  <Input
                    label="Instagram Handle"
                    value={profileData.instagram}
                    onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Contact Name"
                      value={profileData.emergencyContactName}
                      onChange={(e) => setProfileData({ ...profileData, emergencyContactName: e.target.value })}
                      placeholder="Full name"
                    />
                    <Input
                      label="Contact Phone"
                      value={profileData.emergencyContactPhone}
                      onChange={(e) => setProfileData({ ...profileData, emergencyContactPhone: e.target.value })}
                      placeholder="+49 123 456 7890"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    loading={updating}
                    disabled={!profileData.firstName || !profileData.lastName || updating}
                  >
                    {updating ? "Saving..." : "Save Changes"}
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
                        university: (user?.publicMetadata?.university as string) || "",
                        nationality: (user?.publicMetadata?.nationality as string) || "",
                        chapter: (user?.publicMetadata?.chapter as string) || "",
                        bio: (user?.publicMetadata?.bio as string) || "",
                        telegram: (user?.publicMetadata?.telegram as string) || "",
                        instagram: (user?.publicMetadata?.instagram as string) || "",
                        emergencyContactName: (user?.publicMetadata?.emergencyContactName as string) || "",
                        emergencyContactPhone: (user?.publicMetadata?.emergencyContactPhone as string) || "",
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

      {/* Change Photo Modal */}
      {isChangingPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsChangingPhoto(false)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Change Profile Photo</h3>
                <button
                  onClick={() => setIsChangingPhoto(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mb-4">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Current profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-500">
                        {user?.firstName?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <CloudUploadIcon />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handlePhotoUpload(file);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPhoto(false)}
                    className="flex-1"
                    disabled={isUploadingPhoto}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="flex-1"
                    loading={isUploadingPhoto}
                    disabled={isUploadingPhoto}
                  >
                    {isUploadingPhoto ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowNotificationSettings(false)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
                <button
                  onClick={() => setShowNotificationSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'emailEvents', label: 'New events' },
                      { key: 'emailReminders', label: 'Event reminders' },
                      { key: 'emailNewsletter', label: 'Newsletter' },
                      { key: 'emailPromotions', label: 'Promotions' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[key as keyof NotificationSettings]}
                            onChange={(e) => setNotifications({
                              ...notifications,
                              [key]: e.target.checked,
                            })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Push Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'pushEvents', label: 'New events' },
                      { key: 'pushReminders', label: 'Event reminders' },
                      { key: 'pushUpdates', label: 'System updates' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[key as keyof NotificationSettings]}
                            onChange={(e) => setNotifications({
                              ...notifications,
                              [key]: e.target.checked,
                            })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">SMS</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SMS reminders</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.smsReminders}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            smsReminders: e.target.checked,
                          })}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleNotificationUpdate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNotificationSettings(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacySettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowPrivacySettings(false)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Privacy Settings</h3>
                <button
                  onClick={() => setShowPrivacySettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Profile Visibility</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'profileVisible', label: 'Profile visible to other members' },
                      { key: 'showEmail', label: 'Show email address' },
                      { key: 'showPhone', label: 'Show phone number' },
                      { key: 'showUniversity', label: 'Show university' },
                      { key: 'allowMessages', label: 'Allow messages from other members' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy[key as keyof PrivacySettings]}
                            onChange={(e) => setPrivacy({
                              ...privacy,
                              [key]: e.target.checked,
                            })}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Even with privacy settings enabled, event organizers and admins may still be able to view your contact information for event management purposes.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handlePrivacyUpdate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPrivacySettings(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteAccount(false)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-red-900 mb-2">What will be deleted:</h4>
                  <ul className="text-sm text-red-800 text-left space-y-1">
                    <li>• Your profile and personal information</li>
                    <li>• All event registrations and history</li>
                    <li>• Payment records and receipts</li>
                    <li>• ESN card information</li>
                    <li>• Notification and privacy preferences</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteAccount(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
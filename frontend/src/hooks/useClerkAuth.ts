import { useAuth, useUser } from "@clerk/clerk-react";

export const useClerkAuth = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  return {
    // Auth state
    isLoaded,
    isSignedIn,
    user,

    // Get JWT token for API calls
    getToken,

    // Computed values
    isAdmin: user?.publicMetadata?.role === "admin",
    isOrganizer:
      user?.publicMetadata?.role === "organizer" ||
      user?.publicMetadata?.role === "admin",

    // User info helpers
    displayName: user?.fullName || `${user?.firstName} ${user?.lastName}`,
    email: user?.primaryEmailAddress?.emailAddress,
  };
};

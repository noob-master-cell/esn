import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();

    return {
        // Auth state
        isLoaded: !isLoading,
        isSignedIn: isAuthenticated,
        user,

        // Get JWT token for API calls
        getToken: async () => {
            try {
                return await getAccessTokenSilently();
            } catch (error) {
                console.error("Error getting Auth0 token:", error);
                return null;
            }
        },

        // Auth actions
        loginWithRedirect,
        logout,

        // Computed values - Auth0 stores custom claims in user metadata
        // This assumes your Auth0 user metadata includes a 'role' field
        isAdmin: user?.["https://esn.com/role"] === "ADMIN" || user?.["https://esn.com/role"] === "SUPER_ADMIN",
        isOrganizer:
            user?.["https://esn.com/role"] === "ORGANIZER" ||
            user?.["https://esn.com/role"] === "ADMIN" ||
            user?.["https://esn.com/role"] === "SUPER_ADMIN",

        // User info helpers
        displayName: user?.name || user?.email?.split("@")[0],
        email: user?.email,
    };
};

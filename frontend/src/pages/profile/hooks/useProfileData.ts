import { useMyProfile, useMyRegistrations } from "../../../hooks/api/useUsers";

export const useProfileData = (isSignedIn: boolean) => {
    const {
        user: dbUser,
        loading: profileLoading,

        refetch: refetchProfile
    } = useMyProfile({
        skip: !isSignedIn,
    });

    const {
        registrations: allRegistrations,
        loading: registrationsLoading,
        error: registrationsError,
        refetch: refetchRegistrations
    } = useMyRegistrations({
        skip: !isSignedIn,
    });

    return {
        dbUser,
        profileLoading,
        refetchProfile,
        allRegistrations,
        registrationsLoading,
        registrationsError,
        refetchRegistrations,
    };
};

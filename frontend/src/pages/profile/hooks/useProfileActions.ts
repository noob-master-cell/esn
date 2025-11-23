import { useUpdateProfile, useDeleteUser } from "../../../hooks/api/useUsers";
import { useCancelRegistration } from "../../../hooks/api/useRegistration";

export const useProfileActions = () => {
    const { updateProfile: updateUserProfile, loading: updating } = useUpdateProfile();
    const { cancelRegistration, loading: cancellingRegistration } = useCancelRegistration();
    const { deleteUser } = useDeleteUser();

    return {
        updateUserProfile,
        updating,
        cancelRegistration,
        cancellingRegistration,
        deleteUser,
    };
};

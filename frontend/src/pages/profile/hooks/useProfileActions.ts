import { useUpdateProfile, useDeleteUser } from "../../../hooks/api/useUsers";
import { useCancelRegistration, useCreateRegistration } from "../../../hooks/api/useRegistration";

export const useProfileActions = () => {
    const { updateProfile: updateUserProfile, loading: updating } = useUpdateProfile();
    const { cancelRegistration, loading: cancellingRegistration } = useCancelRegistration();
    const { createRegistration, loading: creatingRegistration } = useCreateRegistration();
    const { deleteUser } = useDeleteUser();

    return {
        updateUserProfile,
        updating,
        cancelRegistration,
        cancellingRegistration,
        createRegistration,
        creatingRegistration,
        deleteUser,
    };
};

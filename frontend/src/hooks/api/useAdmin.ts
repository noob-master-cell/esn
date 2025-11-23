import { useQuery, useMutation } from "@apollo/client";
import {
    ADMIN_DASHBOARD_STATS,
    ALL_USERS,
    UPDATE_USER_ROLE,
    ALL_REGISTRATIONS,
    UPDATE_REGISTRATION_STATUS,
    VERIFY_ESN_CARD,
    RECENT_EVENTS,
    DELETE_USER_ADMIN,
} from "../../graphql/admin";

export const useAdminStats = () => {
    const { data, loading, error, refetch } = useQuery(ADMIN_DASHBOARD_STATS);
    return { stats: data?.adminDashboardStats, loading, error, refetch };
};

export const useAdminUsers = (variables?: any) => {
    const { data, loading, error, refetch } = useQuery(ALL_USERS, { variables });
    return { users: data?.users, loading, error, refetch };
};

export const useUpdateUserRole = () => {
    const [updateUserRole, { loading, error }] = useMutation(UPDATE_USER_ROLE);
    return { updateUserRole, loading, error };
};

export const useAdminRegistrations = (variables?: any) => {
    const { data, loading, error, refetch } = useQuery(ALL_REGISTRATIONS, {
        variables,
    });
    return { registrations: data?.allRegistrations, loading, error, refetch };
};

export const useUpdateRegistrationStatus = () => {
    const [updateRegistrationStatus, { loading, error }] = useMutation(
        UPDATE_REGISTRATION_STATUS
    );
    return { updateRegistrationStatus, loading, error };
};

export const useVerifyEsnCard = () => {
    const [verifyEsnCard, { loading, error }] = useMutation(VERIFY_ESN_CARD);
    return { verifyEsnCard, loading, error };
};

export const useRecentEvents = (variables?: any) => {
    const { data, loading, error, refetch } = useQuery(RECENT_EVENTS, { variables });
    return { events: data?.recentEvents, loading, error, refetch };
};

export const useDeleteUserAdmin = () => {
    const [deleteUserAdmin, { loading, error }] = useMutation(DELETE_USER_ADMIN);
    return { deleteUserAdmin, loading, error };
};

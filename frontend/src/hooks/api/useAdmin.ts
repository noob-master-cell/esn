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
    ALL_EVENTS_SIMPLE,
} from "../../graphql/admin";

export const useAdminStats = () => {
    const { data, loading, error, refetch } = useQuery(ADMIN_DASHBOARD_STATS);
    return { stats: data?.adminDashboardStats, loading, error, refetch };
};

import { useState } from "react";

export const useAdminUsers = (initialFilter?: any) => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    // Extract the filter object if it's wrapped, otherwise use the whole object
    const filterParams = initialFilter?.filter || initialFilter || {};

    const variables = {
        filter: {
            ...filterParams,
            skip: (page - 1) * pageSize,
            take: pageSize,
        },
    };

    const { data, loading, error, refetch } = useQuery(ALL_USERS, { variables });

    return {
        users: data?.users?.items || [],
        total: data?.users?.total || 0,
        page,
        setPage,
        pageSize,
        loading,
        error,
        refetch,
    };
};

export const useUpdateUserRole = () => {
    const [updateUserRole, { loading, error }] = useMutation(UPDATE_USER_ROLE);
    return { updateUserRole, loading, error };
};

export const useAdminRegistrations = (variables?: any) => {
    const { data, loading, error, refetch } = useQuery(ALL_REGISTRATIONS, {
        variables,
    });
    return { registrations: data?.registrations, loading, error, refetch };
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
    return { events: data?.events?.items || [], loading, error, refetch };
};

export const useDeleteUserAdmin = () => {
    const [deleteUserAdmin, { loading, error }] = useMutation(DELETE_USER_ADMIN);
    return { deleteUserAdmin, loading, error };
};

export const useAllEventsSimple = () => {
    const { data, loading, error } = useQuery(ALL_EVENTS_SIMPLE);
    return { events: data?.events?.items || [], loading, error };
};

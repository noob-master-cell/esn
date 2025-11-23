import { useQuery, useMutation } from "@apollo/client";
import type { QueryHookOptions, OperationVariables } from "@apollo/client";
import {
    GET_MY_PROFILE,
    UPDATE_USER_PROFILE,
    GET_USER_DETAILS,
    GET_ALL_USERS,
    DELETE_USER,
} from "../../graphql/users";
import { GET_MY_REGISTRATIONS } from "../../graphql/registrations";

export const useMyProfile = (options?: QueryHookOptions) => {
    const { data, loading, error, refetch } = useQuery(GET_MY_PROFILE, options);

    return {
        user: data?.myProfile, // Updated to match query return type (usually myProfile or me)
        loading,
        error,
        refetch,
    };
};

export const useMyRegistrations = (options?: QueryHookOptions) => {
    const { data, loading, error, refetch } = useQuery(GET_MY_REGISTRATIONS, options);

    return {
        registrations: data?.myRegistrations || [],
        loading,
        error,
        refetch,
    };
};

export const useUpdateProfile = () => {
    const [updateProfile, { loading, error, data }] = useMutation(
        UPDATE_USER_PROFILE,
        {
            refetchQueries: [{ query: GET_MY_PROFILE }],
        }
    );

    return {
        updateProfile,
        loading,
        error,
        data,
    };
};

export const useUserDetails = (id: string) => {
    const { data, loading, error, refetch } = useQuery(GET_USER_DETAILS, {
        variables: { id },
        skip: !id,
    });

    return {
        user: data?.user,
        loading,
        error,
        refetch,
    };
};

export const useAllUsers = (variables?: OperationVariables) => {
    const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
        variables,
    });

    return {
        users: data?.users || [],
        loading,
        error,
        refetch,
    };
};

export const useDeleteUser = () => {
    const [deleteUser, { loading, error }] = useMutation(DELETE_USER);

    return {
        deleteUser,
        loading,
        error,
    };
};

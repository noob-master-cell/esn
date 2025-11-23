import { useQuery } from "@apollo/client";
import {
    HEALTH_CHECK_QUERY,
    HELLO_QUERY,
    ME_QUERY,
} from "../../graphql/misc";

export const useHealthCheck = () => {
    const { data, loading, error, refetch } = useQuery(HEALTH_CHECK_QUERY);
    return {
        healthCheck: data?.healthCheck,
        loading,
        error,
        refetch,
    };
};

export const useHello = (options?: any) => {
    const { data, loading, error, refetch } = useQuery(HELLO_QUERY, options);
    return {
        hello: data?.hello,
        loading,
        error,
        refetch,
    };
};

export const useMe = (options?: any) => {
    const { data, loading, error, refetch } = useQuery(ME_QUERY, options);
    return {
        me: data?.me,
        loading,
        error,
        refetch,
    };
};

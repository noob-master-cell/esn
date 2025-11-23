import { useQuery, useMutation } from "@apollo/client";
import {
    GET_EVENTS,
    GET_EVENT,
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
    PUBLISH_EVENT,
    GET_EVENT_FOR_EDIT,
} from "../../graphql/events";

export const useEvents = (variables?: any) => {
    const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
        variables,
    });

    return {
        events: data?.events || [],
        loading,
        error,
        refetch,
    };
};

export const useEvent = (id: string) => {
    const { data, loading, error, refetch } = useQuery(GET_EVENT, {
        variables: { id },
        skip: !id,
    });

    return {
        event: data?.event,
        loading,
        error,
        refetch,
    };
};

export const useEventForEdit = (id: string) => {
    const { data, loading, error } = useQuery(GET_EVENT_FOR_EDIT, {
        variables: { id },
        skip: !id,
    });

    return {
        event: data?.event,
        loading,
        error,
    };
};

export const useCreateEvent = () => {
    const [createEvent, { loading, error, data }] = useMutation(CREATE_EVENT, {
        refetchQueries: [{ query: GET_EVENTS }],
    });

    return {
        createEvent,
        loading,
        error,
        data,
    };
};

export const useUpdateEvent = () => {
    const [updateEvent, { loading, error, data }] = useMutation(UPDATE_EVENT);

    return {
        updateEvent,
        loading,
        error,
        data,
    };
};

export const useDeleteEvent = () => {
    const [deleteEvent, { loading, error }] = useMutation(DELETE_EVENT, {
        refetchQueries: [{ query: GET_EVENTS }],
    });

    return {
        deleteEvent,
        loading,
        error,
    };
};

export const usePublishEvent = () => {
    const [publishEvent, { loading, error }] = useMutation(PUBLISH_EVENT);

    return {
        publishEvent,
        loading,
        error,
    };
};

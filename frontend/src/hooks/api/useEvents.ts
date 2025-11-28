import { useQuery, useMutation } from "@apollo/client";
import {
    GET_EVENTS,
    GET_EVENT,
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
    PUBLISH_EVENT,
    GET_EVENT_FOR_EDIT,
    GET_ADMIN_EVENTS,
} from "../../graphql/events";

import { useState } from "react";

/**
 * Hook for fetching a paginated list of events.
 * 
 * @param initialFilter - Initial filter parameters.
 * @returns Object containing events list, pagination state, and loading/error status.
 */
export const useEvents = (initialFilter?: any) => {
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

    const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
        variables,
        fetchPolicy: "network-only",
    });

    return {
        events: data?.events?.items || [],
        total: data?.events?.total || 0,
        page,
        setPage,
        pageSize,
        loading,
        error,
        refetch,
    };
};

/**
 * Hook for fetching events for the admin dashboard.
 * 
 * @param initialFilter - Initial filter parameters.
 * @returns Object containing admin events list, pagination state, and loading/error status.
 */
export const useAdminEvents = (initialFilter?: any) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const filterParams = initialFilter?.filter || initialFilter || {};

    const variables = {
        filter: {
            ...filterParams,
            skip: (page - 1) * pageSize,
            take: pageSize,
        },
    };

    const { data, loading, error, refetch } = useQuery(GET_ADMIN_EVENTS, {
        variables,
        fetchPolicy: "network-only",
    });

    return {
        events: data?.adminEvents?.items || [],
        total: data?.adminEvents?.total || 0,
        page,
        setPage,
        pageSize,
        setPageSize,
        loading,
        error,
        refetch,
    };
};

/**
 * Hook for fetching a single event by ID.
 * 
 * @param id - Event ID.
 * @returns Object containing event data and loading/error status.
 */
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

/**
 * Hook for fetching an event for editing purposes.
 * 
 * @param id - Event ID.
 * @returns Object containing event data and loading/error status.
 */
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

/**
 * Hook for creating a new event.
 * 
 * @returns Object containing createEvent mutation and status.
 */
export const useCreateEvent = () => {
    const [createEvent, { loading, error, data }] = useMutation(CREATE_EVENT);

    return {
        createEvent,
        loading,
        error,
        data,
    };
};

/**
 * Hook for updating an existing event.
 * 
 * @returns Object containing updateEvent mutation and status.
 */
export const useUpdateEvent = () => {
    const [updateEvent, { loading, error, data }] = useMutation(UPDATE_EVENT);

    return {
        updateEvent,
        loading,
        error,
        data,
    };
};

/**
 * Hook for deleting an event.
 * Handles cache updates to remove the deleted event from lists.
 * 
 * @returns Object containing deleteEvent mutation and status.
 */
export const useDeleteEvent = () => {
    const [deleteEventMutation, { loading, error }] = useMutation(DELETE_EVENT);

    const deleteEvent = async (options: any) => {
        const id = options?.variables?.id;

        return deleteEventMutation({
            ...options,
            update(cache, { data }) {
                if (data?.removeEvent && id) {
                    cache.modify({
                        fields: {
                            events(existingEvents = {}, { readField }) {
                                return {
                                    ...existingEvents,
                                    items: existingEvents.items?.filter(
                                        (eventRef: any) => readField('id', eventRef) !== id
                                    ),
                                    total: existingEvents.total - 1,
                                };
                            },
                            adminEvents(existingEvents = {}, { readField }) {
                                return {
                                    ...existingEvents,
                                    items: existingEvents.items?.filter(
                                        (eventRef: any) => readField('id', eventRef) !== id
                                    ),
                                    total: existingEvents.total - 1,
                                };
                            }
                        },
                    });

                    // Also try direct eviction for safety
                    const normalizedId = cache.identify({ id, __typename: 'Event' });
                    if (normalizedId) {
                        cache.evict({ id: normalizedId });
                        cache.gc();
                    }
                }
            },
        });
    };

    return {
        deleteEvent,
        loading,
        error,
    };
};

/**
 * Hook for publishing a draft event.
 * 
 * @returns Object containing publishEvent mutation and status.
 */
export const usePublishEvent = () => {
    const [publishEvent, { loading, error }] = useMutation(PUBLISH_EVENT);

    return {
        publishEvent,
        loading,
        error,
    };
};

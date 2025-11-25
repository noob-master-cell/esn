import { useQuery, useMutation } from "@apollo/client";
import { GET_FEEDBACKS, CREATE_FEEDBACK, UPDATE_FEEDBACK, DELETE_FEEDBACK } from "../../graphql/feedback";

export const FeedbackType = {
    BUG: "BUG",
    FEEDBACK: "FEEDBACK",
    IMPROVEMENT: "IMPROVEMENT",
} as const;

export type FeedbackType = typeof FeedbackType[keyof typeof FeedbackType];

export interface Feedback {
    id: string;
    message: string;
    type: FeedbackType;
    createdAt: string;
    user: {
        id: string;
        auth0Id?: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

export const useFeedback = () => {
    const { data, loading, error, refetch } = useQuery(GET_FEEDBACKS, {
        fetchPolicy: "network-only",
    });

    const [createFeedbackMutation, { loading: creating }] = useMutation(CREATE_FEEDBACK, {
        onCompleted: () => {
            refetch();
        },
    });

    const [updateFeedbackMutation, { loading: updating }] = useMutation(UPDATE_FEEDBACK, {
        onCompleted: () => {
            refetch();
        },
    });

    const [deleteFeedbackMutation, { loading: deleting }] = useMutation(DELETE_FEEDBACK, {
        onCompleted: () => {
            refetch();
        },
    });

    const createFeedback = async (message: string, type: FeedbackType) => {
        await createFeedbackMutation({
            variables: {
                message,
                type,
            },
        });
    };

    const updateFeedback = async (id: string, message: string, type: FeedbackType) => {
        await updateFeedbackMutation({
            variables: {
                id,
                message,
                type,
            },
        });
    };

    const deleteFeedback = async (id: string) => {
        await deleteFeedbackMutation({
            variables: {
                id,
            },
        });
    };

    return {
        feedbacks: (data?.feedbacks || []) as Feedback[],
        loading,
        error,
        createFeedback,
        creating,
        updateFeedback,
        updating,
        deleteFeedback,
        deleting,
        refetch,
    };
};

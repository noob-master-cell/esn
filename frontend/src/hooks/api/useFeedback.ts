import { useQuery, useMutation } from "@apollo/client";
import { GET_FEEDBACKS, CREATE_FEEDBACK } from "../../graphql/feedback";

export enum FeedbackType {
    BUG = "BUG",
    FEEDBACK = "FEEDBACK",
    IMPROVEMENT = "IMPROVEMENT",
}

export interface Feedback {
    id: string;
    message: string;
    type: FeedbackType;
    createdAt: string;
    user: {
        id: string;
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

    const createFeedback = async (message: string, type: FeedbackType) => {
        await createFeedbackMutation({
            variables: {
                message,
                type,
            },
        });
    };

    return {
        feedbacks: (data?.feedbacks || []) as Feedback[],
        loading,
        error,
        createFeedback,
        creating,
        refetch,
    };
};

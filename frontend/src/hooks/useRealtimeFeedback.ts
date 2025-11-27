import { useSubscription, gql } from "@apollo/client";
import { FEEDBACK_ADDED_SUBSCRIPTION } from "../graphql/feedback";

export const useRealtimeFeedback = () => {
    useSubscription(FEEDBACK_ADDED_SUBSCRIPTION, {
        onData: ({ client, data }) => {
            const newFeedback = data.data?.feedbackAdded;
            if (newFeedback) {
                client.cache.modify({
                    fields: {
                        feedbacks(existingFeedbacks = []) {
                            const newFeedbackRef = client.cache.writeFragment({
                                data: newFeedback,
                                fragment: gql`
                                    fragment NewFeedback on Feedback {
                                        id
                                        message
                                        type
                                        createdAt
                                        user {
                                            id
                                            auth0Id
                                            firstName
                                            lastName
                                            avatar
                                        }
                                    }
                                `
                            });

                            // Check if feedback already exists to prevent duplicates
                            if (existingFeedbacks.some((ref: any) => client.cache.identify(ref) === client.cache.identify(newFeedback))) {
                                return existingFeedbacks;
                            }

                            return [newFeedbackRef, ...existingFeedbacks];
                        }
                    }
                });
            }
        }
    });
};

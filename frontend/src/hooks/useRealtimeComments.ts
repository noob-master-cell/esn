import { useSubscription, gql } from "@apollo/client";
import { COMMENT_ADDED_SUBSCRIPTION } from "../graphql/comments";

export const useRealtimeComments = (eventId: string) => {
    useSubscription(COMMENT_ADDED_SUBSCRIPTION, {
        variables: { eventId },
        onData: ({ client, data }) => {
            const newComment = data.data?.commentAdded;
            if (newComment) {
                client.cache.modify({
                    fields: {
                        comments(existingComments = []) {
                            const newCommentRef = client.cache.writeFragment({
                                data: newComment,
                                fragment: gql`
                                    fragment NewComment on Comment {
                                        id
                                        content
                                        createdAt
                                        user {
                                            id
                                            firstName
                                            lastName
                                            avatar
                                        }
                                    }
                                `
                            });

                            // Check if comment already exists to prevent duplicates
                            if (existingComments.some((ref: any) => client.cache.identify(ref) === client.cache.identify(newComment))) {
                                return existingComments;
                            }

                            return [newCommentRef, ...existingComments];
                        }
                    }
                });
            }
        }
    });
};

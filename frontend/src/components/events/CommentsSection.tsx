import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMMENTS, CREATE_COMMENT } from "../../graphql/comments";
import { PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/outline";

interface CommentsSectionProps {
    eventId: string;
    isRegistered: boolean;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ eventId, isRegistered }) => {
    const [content, setContent] = useState("");
    const PAGE_SIZE = 5;

    const { data, loading, error, fetchMore } = useQuery(GET_COMMENTS, {
        variables: { eventId, skip: 0, take: PAGE_SIZE },
        pollInterval: 10000, // Poll less frequently (10s) to reduce load
        notifyOnNetworkStatusChange: true,
    });

    const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
        refetchQueries: [{ query: GET_COMMENTS, variables: { eventId, skip: 0, take: PAGE_SIZE } }],
        onCompleted: () => setContent(""),
    });

    const comments: Comment[] = data?.comments || [];
    const hasMore = comments.length % PAGE_SIZE === 0 && comments.length > 0; // Simple heuristic, ideally backend returns total count

    const handleLoadMore = () => {
        fetchMore({
            variables: {
                skip: comments.length,
                take: PAGE_SIZE,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    comments: [...prev.comments, ...fetchMoreResult.comments],
                };
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await createComment({
                variables: {
                    createCommentInput: {
                        eventId,
                        content,
                    },
                },
            });
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    if (loading && !data) return <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div>;
    if (error) return <div className="text-red-500 text-sm">Failed to load comments</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                Comments
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {comments.length}
                </span>
            </h3>

            {/* Comment List */}
            <div className="space-y-6 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No comments yet. Be the first to say something!
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                                    {comment.user.avatar ? (
                                        <img
                                            src={comment.user.avatar}
                                            alt={comment.user.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <UserCircleIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 px-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-sm text-gray-900">
                                                {comment.user.firstName} {comment.user.lastName}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Load More Button */}
                        {hasMore && (
                            <button
                                onClick={handleLoadMore}
                                className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                Load more comments
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Input Form */}
            {isRegistered ? (
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                        maxLength={500}
                        disabled={creating}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-400">
                            {content.length}/500
                        </div>
                        <button
                            type="submit"
                            disabled={!content.trim() || creating}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:hover:bg-gray-900 transition-colors"
                        >
                            <PaperAirplaneIcon className="w-4 h-4" />
                            Post Comment
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
                    Only registered attendees can post comments.
                </div>
            )}
        </div>
    );
};

export default CommentsSection;

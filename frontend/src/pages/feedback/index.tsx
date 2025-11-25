import React, { useState } from "react";
import { useFeedback, FeedbackType } from "../../hooks/api/useFeedback";
import { useAuth } from "../../hooks/useAuth";
import { format } from "date-fns";
import { ChatBubbleLeftRightIcon, BugAntIcon, LightBulbIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const FeedbackPage: React.FC = () => {
    const { feedbacks, loading, createFeedback, creating } = useFeedback();
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [type, setType] = useState<FeedbackType>(FeedbackType.FEEDBACK);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await createFeedback(message, type);
            setMessage("");
            setType(FeedbackType.FEEDBACK);
        } catch (err) {
            console.error("Failed to submit feedback:", err);
        }
    };

    const getTypeIcon = (type: FeedbackType) => {
        switch (type) {
            case FeedbackType.BUG:
                return <BugAntIcon className="w-4 h-4 text-red-500" />;
            case FeedbackType.IMPROVEMENT:
                return <LightBulbIcon className="w-4 h-4 text-yellow-500" />;
            default:
                return <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTypeLabel = (type: FeedbackType) => {
        switch (type) {
            case FeedbackType.BUG:
                return "Bug Report";
            case FeedbackType.IMPROVEMENT:
                return "Improvement";
            default:
                return "General Feedback";
        }
    };

    const getBadgeColor = (type: FeedbackType) => {
        switch (type) {
            case FeedbackType.BUG:
                return "bg-red-50 text-red-700 border-red-100";
            case FeedbackType.IMPROVEMENT:
                return "bg-yellow-50 text-yellow-700 border-yellow-100";
            default:
                return "bg-blue-50 text-blue-700 border-blue-100";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Community Feedback
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Help us improve ESN by sharing your thoughts, reporting bugs, or suggesting new features.
                    </p>
                </div>

                {/* Submission Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <PaperAirplaneIcon className="w-5 h-5 text-cyan-600" />
                            Submit Feedback
                        </h2>

                        {user ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                                    <div className="flex gap-2">
                                        {Object.values(FeedbackType).map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${type === t
                                                        ? "bg-cyan-50 border-cyan-200 text-cyan-700 shadow-sm"
                                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(t)}
                                                    {getTypeLabel(t)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm resize-none"
                                        placeholder="Tell us what you think..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={creating || !message.trim()}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {creating ? "Submitting..." : "Submit Feedback"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">Please log in to submit feedback.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 px-1">Recent Feedback</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {feedbacks.map((feedback) => (
                                <div key={feedback.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {feedback.user.avatar ? (
                                                <img
                                                    src={feedback.user.avatar}
                                                    alt={feedback.user.firstName}
                                                    className="h-10 w-10 rounded-full object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {feedback.user.firstName[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {feedback.user.firstName} {feedback.user.lastName}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getBadgeColor(feedback.type)}`}>
                                                        {getTypeLabel(feedback.type)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {format(new Date(feedback.createdAt), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{feedback.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;

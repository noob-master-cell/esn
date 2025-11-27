import React, { useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { useFeedback, FeedbackType, type Feedback } from "../../hooks/api/useFeedback";
import { useRealtimeFeedback } from "../../hooks/useRealtimeFeedback";
import { useAuth } from "../../hooks/useAuth";
import { format, formatDistanceToNow } from "date-fns";
import {
    ChatBubbleLeftRightIcon,
    BugAntIcon,
    LightBulbIcon,
    PaperAirplaneIcon,
    PencilIcon,
    TrashIcon
} from "@heroicons/react/24/outline";

const FeedbackPage: React.FC = () => {
    const {
        feedbacks,
        loading,
        createFeedback,
        creating,
        updateFeedback,
        updating,
        deleteFeedback,
        deleting
    } = useFeedback();
    const { user, isAdmin } = useAuth();

    // Enable real-time updates
    useRealtimeFeedback();

    const [message, setMessage] = useState("");
    const [type, setType] = useState<FeedbackType>(FeedbackType.FEEDBACK);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FeedbackType | 'ALL'>('ALL');

    const filteredFeedbacks = feedbacks.filter(f => filter === 'ALL' || f.type === filter);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            if (editingId) {
                await updateFeedback(editingId, message, type);
                setEditingId(null);
            } else {
                await createFeedback(message, type);
            }
            setMessage("");
            setType(FeedbackType.FEEDBACK);
        } catch (err) {
            console.error("Failed to submit feedback:", err);
        }
    };

    const handleEdit = (feedback: Feedback) => {
        setEditingId(feedback.id);
        setMessage(feedback.message);
        setType(feedback.type);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setMessage("");
        setType(FeedbackType.FEEDBACK);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await deleteFeedback(id);
            } catch (err) {
                console.error("Failed to delete feedback:", err);
            }
        }
    };

    const canModify = (feedback: Feedback) => {
        if (!user) return false;
        return (user.sub && feedback.user.auth0Id && user.sub === feedback.user.auth0Id) || isAdmin;
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
                            {editingId ? (
                                <>
                                    <PencilIcon className="w-5 h-5 text-cyan-600" />
                                    Edit Feedback
                                </>
                            ) : (
                                <>
                                    <PaperAirplaneIcon className="w-5 h-5 text-cyan-600" />
                                    Submit Feedback
                                </>
                            )}
                        </h2>

                        {user ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                                    <div className="flex flex-wrap gap-2">
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

                                <div className="flex justify-end gap-3">
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={creating || updating || !message.trim()}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {editingId ? (updating ? "Updating..." : "Update Feedback") : (creating ? "Submitting..." : "Submit Feedback")}
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
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900">Recent Feedback</h2>

                        {/* Filter Tabs */}
                        <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setFilter('ALL')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${filter === 'ALL'
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                All
                            </button>
                            {Object.values(FeedbackType).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${filter === t
                                        ? 'bg-gray-900 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {t === FeedbackType.BUG && <BugAntIcon className="w-3.5 h-3.5" />}
                                    {t === FeedbackType.IMPROVEMENT && <LightBulbIcon className="w-3.5 h-3.5" />}
                                    {t === FeedbackType.FEEDBACK && <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />}
                                    {getTypeLabel(t)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
                        </div>
                    ) : filteredFeedbacks.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                {filter === FeedbackType.BUG ? (
                                    <BugAntIcon className="w-8 h-8 text-gray-300" />
                                ) : filter === FeedbackType.IMPROVEMENT ? (
                                    <LightBulbIcon className="w-8 h-8 text-gray-300" />
                                ) : (
                                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-300" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No feedback found</h3>
                            <p className="mt-1 text-gray-500">
                                {filter === 'ALL'
                                    ? "Be the first to share your thoughts!"
                                    : `No ${getTypeLabel(filter as FeedbackType).toLowerCase()}s found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredFeedbacks.map((feedback) => (
                                <div key={feedback.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                src={feedback.user.avatar}
                                                alt={`${feedback.user.firstName} ${feedback.user.lastName}`}
                                                fallback={feedback.user.firstName || "?"}
                                                size="md"
                                                className="border-2 border-white shadow-sm"
                                                bordered
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center justify-between gap-y-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-bold text-gray-900">
                                                        {feedback.user.firstName} {feedback.user.lastName}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(feedback.type)}`}>
                                                        {getTypeLabel(feedback.type)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-medium text-gray-400" title={format(new Date(feedback.createdAt), "PPpp")}>
                                                        {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                                                    </span>
                                                    {canModify(feedback) && (
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {(user?.sub === feedback.user.auth0Id || isAdmin) && (
                                                                <button
                                                                    onClick={() => handleEdit(feedback)}
                                                                    className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(feedback.id)}
                                                                disabled={deleting}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{feedback.message}</p>
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

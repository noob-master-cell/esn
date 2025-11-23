import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { UserIcon, CalendarIcon, LinkIcon, DownloadIcon } from "../components/shared/Icons";
import { SectionHeader } from "../components/shared/SectionHeader";
import { StatusBadge } from "../components/shared/StatusBadge";
import { useUpdateProfile } from "../../../hooks/api/useUsers";
import type { Registration } from "../types";

interface OverviewTabProps {
    dbUser: any;
    allRegistrations: Registration[];
    registrationsLoading: boolean;
    registrationsError: any;
    refetchRegistrations: () => void;
    refetchProfile: () => void;
    setActiveTab: (tab: 'overview' | 'events' | 'settings') => void;
    handleExportData: () => void;
    getCalendarLink: () => string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
    dbUser,
    allRegistrations,
    registrationsLoading,
    registrationsError,
    refetchRegistrations,
    refetchProfile,
    setActiveTab,
    handleExportData,
    getCalendarLink,
}) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: dbUser?.firstName || "",
        lastName: dbUser?.lastName || "",
        phone: dbUser?.phone || "",
        university: dbUser?.university || "",
        nationality: dbUser?.nationality || "",
        chapter: dbUser?.chapter || "",
        telegram: dbUser?.telegram || "",
        esnCardNumber: dbUser?.esnCardNumber || "",
        bio: dbUser?.bio || "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Update formData when dbUser changes (e.g., after initial load or refetch)
        setFormData({
            firstName: dbUser?.firstName || "",
            lastName: dbUser?.lastName || "",
            phone: dbUser?.phone || "",
            university: dbUser?.university || "",
            nationality: dbUser?.nationality || "",
            chapter: dbUser?.chapter || "",
            telegram: dbUser?.telegram || "",
            esnCardNumber: dbUser?.esnCardNumber || "",
            bio: dbUser?.bio || "",
        });
    }, [dbUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: typeof formData) => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            firstName: dbUser?.firstName || "",
            lastName: dbUser?.lastName || "",
            phone: dbUser?.phone || "",
            university: dbUser?.university || "",
            nationality: dbUser?.nationality || "",
            chapter: dbUser?.chapter || "",
            telegram: dbUser?.telegram || "",
            esnCardNumber: dbUser?.esnCardNumber || "",
            bio: dbUser?.bio || "",
        });
    };

    const { updateProfile } = useUpdateProfile();

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({
                variables: {
                    updateUserInput: formData,
                },
            });

            console.log("Profile updated successfully!");
            setIsEditing(false);
            refetchProfile(); // Refetch profile data to update the displayed information
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Profile Details */}
            <div className="lg:col-span-2 space-y-8">
                {/* Personal Information - Editable */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <SectionHeader icon={<UserIcon />} title="Personal Information" />
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                size="sm"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        // Edit Mode
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.email || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                    <input
                                        type="text"
                                        name="university"
                                        value={formData.university}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ESN Chapter</label>
                                    <input
                                        type="text"
                                        name="chapter"
                                        value={formData.chapter}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                                    <input
                                        type="text"
                                        name="telegram"
                                        value={formData.telegram}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="@username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ESN Card Number</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name="esnCardNumber"
                                        value={formData.esnCardNumber}
                                        onChange={handleChange}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="ESN-XXXX-XXXX-XXXX"
                                    />
                                    {dbUser?.esnCardVerified && (
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                    )}
                                    {dbUser?.esnCardNumber && !dbUser?.esnCardVerified && (
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter your ESN card number. It will be verified by an admin.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <>
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.firstName || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.lastName || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.email || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.phone || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.university || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.nationality || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ESN Chapter</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.chapter || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {dbUser?.telegram || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ESN Card Number</label>
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                                            {dbUser?.esnCardNumber || "Not set"}
                                        </p>
                                        {dbUser?.esnCardNumber && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${dbUser?.esnCardVerified
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {dbUser?.esnCardVerified ? '✓ Verified' : 'Pending'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {dbUser?.esnCardExpiry && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ESN Card Expiry</label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                            {new Date(dbUser.esnCardExpiry).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {dbUser?.bio && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{dbUser.bio}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    onClick={handleExportData}
                                >
                                    <DownloadIcon />
                                    Export Data
                                </Button>
                            </div>
                        </>
                    )}
                </Card>

                {/* Recent Events Preview */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <SectionHeader icon={<CalendarIcon />} title="Recent Events" />
                    </div>

                    {registrationsLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-lg h-16 animate-pulse"></div>
                            ))}
                        </div>
                    ) : registrationsError ? (
                        <div className="text-center py-4">
                            <p className="text-red-500 mb-2">Failed to load events</p>
                            <Button onClick={() => refetchRegistrations()} variant="outline" size="sm">
                                Try Again
                            </Button>
                        </div>
                    ) : allRegistrations.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📅</div>
                            <p className="text-gray-500 mb-4">No events yet</p>
                            <Button
                                onClick={() => navigate("/events")}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Browse Events
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {allRegistrations.slice(0, 3).map((registration: Registration) => (
                                <div
                                    key={registration.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/events/${registration.event.id}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                            {new Date(registration.event.startDate).getDate()}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 line-clamp-1">
                                                {registration.event.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(registration.event.startDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={registration.status} />
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    setActiveTab("events");
                                }}
                            >
                                View All Events
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Right Column: Quick Stats & Actions */}
            <div className="lg:col-span-1 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="text-gray-500 text-sm font-medium mb-1">Events Attended</div>
                        <div className="text-3xl font-bold text-gray-900">
                            {allRegistrations.filter((r: Registration) => r.status === "ATTENDED").length}
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="text-gray-500 text-sm font-medium mb-1">Upcoming Events</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {
                                allRegistrations.filter(
                                    (r: Registration) =>
                                        new Date(r.event.startDate) > new Date() && r.status !== "CANCELLED"
                                ).length
                            }
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <SectionHeader icon={<LinkIcon />} title="Quick Links" />
                    <div className="space-y-3">
                        <button
                            onClick={() => window.open(getCalendarLink(), "_blank")}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                            <span className="font-medium text-gray-700">Subscribe to Calendar</span>
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate("/events")}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                            <span className="font-medium text-gray-700">Browse Events</span>
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                            <span className="font-medium text-gray-700">Account Settings</span>
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h4 className="font-bold text-blue-900 mb-2">Need Help?</h4>
                    <p className="text-sm text-blue-700 mb-4">
                        Having trouble with your account or registrations? Contact your ESN section for
                        assistance.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-100"
                        onClick={() => (window.location.href = "mailto:support@esn.org")}
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
};

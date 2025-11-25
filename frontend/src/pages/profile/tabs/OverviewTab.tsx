import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
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


            setIsEditing(false);
            refetchProfile(); // Refetch profile data to update the displayed information
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Details */}
            <div className="lg:col-span-2 space-y-8">
                {/* Personal Information - Editable */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <SectionHeader icon={<UserIcon />} title="Personal Information" />
                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl px-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                                >
                                    Edit
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            // Edit Mode
                            <div className="space-y-5 animate-fadeIn">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                        <div className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed text-sm font-medium">
                                            {dbUser?.email || "Not provided"}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">University</label>
                                        <input
                                            type="text"
                                            name="university"
                                            value={formData.university}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nationality</label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ESN Chapter</label>
                                        <input
                                            type="text"
                                            name="chapter"
                                            value={formData.chapter}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Telegram</label>
                                        <input
                                            type="text"
                                            name="telegram"
                                            value={formData.telegram}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ESN Card Number</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            name="esnCardNumber"
                                            value={formData.esnCardNumber}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                                            placeholder="ESN-XXXX-XXXX-XXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-sm font-medium"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl shadow-lg shadow-blue-600/20 text-sm"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            resetForm();
                                        }}
                                        className="rounded-xl border-gray-200 hover:bg-gray-50 text-sm"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="animate-fadeIn space-y-6">
                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Full Name
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            {dbUser?.firstName} {dbUser?.lastName || <span className="text-gray-400 font-normal italic">Not set</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Email
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors truncate">
                                            {dbUser?.email || <span className="text-gray-400 font-normal italic">Not provided</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            Phone
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            {dbUser?.phone || <span className="text-gray-400 font-normal italic">Not set</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            University
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            {dbUser?.university || <span className="text-gray-400 font-normal italic">Not set</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Nationality
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            {dbUser?.nationality || <span className="text-gray-400 font-normal italic">Not set</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            ESN Chapter
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            {dbUser?.chapter || <span className="text-gray-400 font-normal italic">Not set</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            Telegram
                                        </label>
                                        <p className="text-gray-900 font-semibold text-base border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            {dbUser?.telegram || <span className="text-gray-400 font-normal italic">Not set</span>}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            ESN Card
                                        </label>
                                        <div className="flex items-center gap-3 border-b border-gray-50 pb-1 group-hover:border-blue-100 transition-colors">
                                            <p className="text-gray-900 font-semibold text-base">
                                                {dbUser?.esnCardNumber || <span className="text-gray-400 font-normal italic">Not set</span>}
                                            </p>
                                            {dbUser?.esnCardNumber && (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${dbUser?.esnCardVerified
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {dbUser?.esnCardVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {dbUser?.bio && (
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Me</label>
                                        <p className="text-gray-700 leading-relaxed text-sm">{dbUser.bio}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        className="text-gray-500 hover:text-gray-900 border-gray-200 hover:bg-gray-50 rounded-xl gap-2 text-sm w-full sm:w-auto"
                                        onClick={handleExportData}
                                    >
                                        <DownloadIcon />
                                        Export Data
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Events Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <SectionHeader icon={<CalendarIcon />} title="Recent Events" />
                        </div>

                        {registrationsLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl h-20 animate-pulse"></div>
                                ))}
                            </div>
                        ) : registrationsError ? (
                            <div className="text-center py-8 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-red-600 font-medium mb-2">Failed to load events</p>
                                <Button onClick={() => refetchRegistrations()} variant="outline" size="sm" className="bg-white border-red-200 text-red-600 hover:bg-red-50">
                                    Try Again
                                </Button>
                            </div>
                        ) : allRegistrations.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <div className="text-5xl mb-4 opacity-50">📅</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No events yet</h3>
                                <p className="text-gray-500 mb-6">You haven't registered for any events.</p>
                                <Button
                                    onClick={() => navigate("/events")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
                                >
                                    Browse Events
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {allRegistrations.slice(0, 3).map((registration: Registration) => (
                                    <div
                                        key={registration.id}
                                        className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => navigate(`/events/${registration.event.id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <span className="text-xs font-bold uppercase">{new Date(registration.event.startDate).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-xl font-bold leading-none">{new Date(registration.event.startDate).getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-lg">
                                                    {registration.event.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                                    <span>
                                                        {new Date(registration.event.startDate).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="capitalize">{registration.status.toLowerCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block">
                                            <StatusBadge status={registration.status} />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full mt-4 py-6 border-dashed border-2 border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                        setActiveTab("events");
                                    }}
                                >
                                    View All Events
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Quick Stats & Actions */}
            <div className="lg:col-span-1 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div
                        onClick={() => setActiveTab("events")}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all relative overflow-hidden group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="text-gray-300 group-hover:text-purple-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </div>
                        </div>

                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors">Events Attended</div>
                        <div className="text-4xl font-extrabold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                            {registrationsLoading ? (
                                <span className="inline-block w-8 h-8 bg-gray-100 rounded animate-pulse"></span>
                            ) : (
                                allRegistrations.filter((r: Registration) => r.status === "ATTENDED").length
                            )}
                        </div>
                        <div className="text-xs text-gray-400 font-medium group-hover:text-purple-500 transition-colors">
                            Lifetime participation
                        </div>
                    </div>

                    <div
                        onClick={() => setActiveTab("events")}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="text-gray-300 group-hover:text-blue-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </div>
                        </div>

                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors">Upcoming Events</div>
                        <div className="text-4xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                            {registrationsLoading ? (
                                <span className="inline-block w-8 h-8 bg-gray-100 rounded animate-pulse"></span>
                            ) : (
                                allRegistrations.filter(
                                    (r: Registration) =>
                                        new Date(r.event.startDate) > new Date() && r.status !== "CANCELLED"
                                ).length
                            )}
                        </div>
                        <div className="text-xs text-gray-400 font-medium group-hover:text-blue-500 transition-colors">
                            Registered & confirmed
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="mb-4">
                        <SectionHeader icon={<LinkIcon />} title="Quick Links" />
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.open(getCalendarLink(), "_blank")}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group text-left border border-transparent hover:border-blue-100"
                        >
                            <span className="font-medium text-gray-700 group-hover:text-blue-700">Subscribe to Calendar</span>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate("/events")}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group text-left border border-transparent hover:border-blue-100"
                        >
                            <span className="font-medium text-gray-700 group-hover:text-blue-700">Browse Events</span>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group text-left border border-transparent hover:border-blue-100"
                        >
                            <span className="font-medium text-gray-700 group-hover:text-blue-700">Account Settings</span>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                    <h4 className="font-bold text-blue-900 mb-2 text-lg">Need Help?</h4>
                    <p className="text-sm text-blue-700 mb-6 leading-relaxed">
                        Having trouble with your account or registrations? Contact your ESN section for
                        assistance.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 bg-white/50 backdrop-blur-sm rounded-xl"
                        onClick={() => (window.location.href = "mailto:support@esn.org")}
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
};

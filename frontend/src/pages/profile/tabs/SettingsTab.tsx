import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { BellIcon, ShieldIcon, SettingsIcon, UserIcon } from "../components/shared/Icons";
import { SectionHeader } from "../components/shared/SectionHeader";
import { useUpdateProfile } from "../../../hooks/api/useUsers";
import { useProfileData } from "../hooks/useProfileData";

interface SettingsTabProps {
    handleLogout: () => void;
    handleDeleteAccount: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    handleLogout,
    handleDeleteAccount,
}) => {
    const { dbUser, refetchProfile } = useProfileData(true);
    const { updateProfile, loading } = useUpdateProfile();

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        university: "",
        chapter: "",
        nationality: "",
        bio: "",
        telegram: "",
        instagram: "",
        esnCardNumber: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
    });

    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Populate form when user data loads
    useEffect(() => {
        if (dbUser) {
            setFormData({
                firstName: dbUser.firstName || "",
                lastName: dbUser.lastName || "",
                phone: dbUser.phone || "",
                university: dbUser.university || "",
                chapter: dbUser.chapter || "",
                nationality: dbUser.nationality || "",
                bio: dbUser.bio || "",
                telegram: dbUser.telegram || "",
                instagram: dbUser.instagram || "",
                esnCardNumber: dbUser.esnCardNumber || "",
                emergencyContactName: dbUser.emergencyContactName || "",
                emergencyContactPhone: dbUser.emergencyContactPhone || "",
            });
        }
    }, [dbUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                variables: {
                    updateUserInput: formData,
                },
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            refetchProfile();
        } catch (error: any) {
            console.error("Profile update error:", error);
            setSaveError(error.message || "Failed to update profile");
            setTimeout(() => setSaveError(null), 5000);
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            {/* Success/Error Messages */}
            {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    ✓ Profile updated successfully!
                </div>
            )}
            {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    ✗ {saveError}
                </div>
            )}

            {/* Edit Profile Form */}
            <Card>
                <SectionHeader icon={<UserIcon />} title="Edit Profile" />
                <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nationality
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your country"
                            />
                        </div>
                    </div>

                    {/* ESN Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                University
                            </label>
                            <input
                                type="text"
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your university"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ESN Chapter
                            </label>
                            <input
                                type="text"
                                name="chapter"
                                value={formData.chapter}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="ESN Chapter Name"
                            />
                        </div>
                    </div>

                    {/* ESN Card */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ESN Card Number
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="esnCardNumber"
                                value={formData.esnCardNumber}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="ESN-XXXX-XXXX-XXXX"
                            />
                            {dbUser?.esnCardVerified && (
                                <span className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                                    ✓ Verified
                                </span>
                            )}
                            {dbUser?.esnCardNumber && !dbUser?.esnCardVerified && (
                                <span className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                                    Pending
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Enter your ESN card number. It will be verified by an admin.
                        </p>
                    </div>

                    {/* Social Media */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telegram
                            </label>
                            <input
                                type="text"
                                name="telegram"
                                value={formData.telegram}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="@username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instagram
                            </label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="@username"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Emergency Contact */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Emergency Contact
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    name="emergencyContactName"
                                    value={formData.emergencyContactName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Emergency contact name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    name="emergencyContactPhone"
                                    value={formData.emergencyContactPhone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (dbUser) {
                                    setFormData({
                                        firstName: dbUser.firstName || "",
                                        lastName: dbUser.lastName || "",
                                        phone: dbUser.phone || "",
                                        university: dbUser.university || "",
                                        chapter: dbUser.chapter || "",
                                        nationality: dbUser.nationality || "",
                                        bio: dbUser.bio || "",
                                        telegram: dbUser.telegram || "",
                                        instagram: dbUser.instagram || "",
                                        esnCardNumber: dbUser.esnCardNumber || "",
                                        emergencyContactName: dbUser.emergencyContactName || "",
                                        emergencyContactPhone: dbUser.emergencyContactPhone || "",
                                    });
                                }
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Account Actions */}
            <Card>
                <SectionHeader icon={<SettingsIcon />} title="Account" />
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Sign Out</h4>
                            <p className="text-sm text-gray-600">Sign out of your account on this device</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Notifications */}
            <Card>
                <SectionHeader icon={<BellIcon />} title="Notifications" />
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive event updates and reminders via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Event Reminders</h4>
                            <p className="text-sm text-gray-600">Get reminded about upcoming events you're registered for</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card>
                <SectionHeader icon={<ShieldIcon />} title="Danger Zone" />
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                        onClick={handleDeleteAccount}
                    >
                        Delete My Account
                    </Button>
                </div>
            </Card>
        </div>
    );
};

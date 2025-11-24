import React from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { BellIcon, ShieldIcon, SettingsIcon } from "../components/shared/Icons";
import { SectionHeader } from "../components/shared/SectionHeader";

interface SettingsTabProps {
    handleLogout: () => void;
    handleDeleteAccount: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    handleLogout,
    handleDeleteAccount,
}) => {

    return (
        <div className="max-w-3xl space-y-6">
            {/* Account Settings */}
            <Card>
                <SectionHeader icon={<SettingsIcon />} title="Account Settings" />
                <div className="space-y-3">
                    <div className="group flex items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">Sign Out</h4>
                            <p className="text-sm text-gray-600">Sign out of your account on this device</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="ml-4 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Notification Preferences */}
            <Card>
                <SectionHeader icon={<BellIcon />} title="Notification Preferences" />
                <div className="space-y-3">
                    <div className="group flex items-center justify-between p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                <span>📧</span> Email Notifications
                            </h4>
                            <p className="text-sm text-gray-600">Receive event updates and reminders via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 shadow-sm"></div>
                        </label>
                    </div>
                    <div className="group flex items-center justify-between p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                <span>🔔</span> Event Reminders
                            </h4>
                            <p className="text-sm text-gray-600">Get reminded about upcoming events you're registered for</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 shadow-sm"></div>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card>
                <SectionHeader icon={<ShieldIcon />} title="Danger Zone" />
                <div className="group relative overflow-hidden border-2 border-red-200 rounded-xl p-6 bg-gradient-to-br from-red-50 to-orange-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-30 -mr-16 -mt-16"></div>
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">⚠️</span>
                            <h4 className="font-bold text-red-900">Delete Account</h4>
                        </div>
                        <p className="text-sm text-red-700 mb-4 leading-relaxed">
                            Once you delete your account, there is no going back. All your data, registrations, and history will be permanently removed.
                        </p>
                        <Button
                            variant="outline"
                            className="border-2 border-red-400 text-red-700 hover:bg-red-100 hover:border-red-500 font-semibold transition-all duration-200"
                            onClick={handleDeleteAccount}
                        >
                            🗑️ Delete My Account
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

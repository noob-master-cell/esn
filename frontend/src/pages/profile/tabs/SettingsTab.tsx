import React from "react";
import { Button } from "../../../components/ui/Button";
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
        <div className="max-w-3xl space-y-8">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <SectionHeader icon={<SettingsIcon />} title="Account Settings" />
                    </div>
                    <div className="space-y-4">
                        <div className="group flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Sign Out</h4>
                                <p className="text-sm text-gray-500">Sign out of your account on this device</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="ml-4 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-sm"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <SectionHeader icon={<BellIcon />} title="Notification Preferences" />
                    </div>
                    <div className="space-y-4">
                        <div className="group flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    <span className="text-xl">📧</span> Email Notifications
                                </h4>
                                <p className="text-sm text-gray-500">Receive event updates and reminders via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                            </label>
                        </div>
                        <div className="group flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    <span className="text-xl">🔔</span> Event Reminders
                                </h4>
                                <p className="text-sm text-gray-500">Get reminded about upcoming events you're registered for</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <SectionHeader icon={<ShieldIcon />} title="Danger Zone" />
                    </div>
                    <div className="group relative overflow-hidden border border-red-200 rounded-xl p-6 bg-red-50/50 hover:bg-red-50 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity -mr-10 -mt-10"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl bg-red-100 p-2 rounded-lg">⚠️</span>
                                <h4 className="text-lg font-bold text-red-900">Delete Account</h4>
                            </div>
                            <p className="text-sm text-red-700 mb-6 leading-relaxed max-w-xl">
                                Once you delete your account, there is no going back. All your data, registrations, and history will be permanently removed. Please be certain.
                            </p>
                            <Button
                                variant="outline"
                                className="bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 font-semibold transition-all duration-200 shadow-sm"
                                onClick={handleDeleteAccount}
                            >
                                🗑️ Delete My Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

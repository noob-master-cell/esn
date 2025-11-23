import React from "react";
import { Button } from "../../ui/Button";

interface NotificationSettingsProps {
    settings: Record<string, unknown>;
    onSave: (settings: Record<string, unknown>) => void;
    onChange: (category: string, key: string, value: unknown) => void;
    loading: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
    settings,
    onSave,
    loading,
}) => {
    return (
        <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Notification Settings
            </h3>
            <p className="text-gray-500 mb-6">
                Configure system notifications and alerts.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p className="text-sm text-yellow-700">
                    This section is currently under development.
                </p>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => onSave(settings)} loading={loading}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

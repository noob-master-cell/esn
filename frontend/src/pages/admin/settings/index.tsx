// frontend/src/pages/admin/AdminSettingsPage.tsx
import React, { useState } from "react";
import {
  useAllSystemSettings,
  useUpdateSettings,
  useBackupSystemData,
} from "../../../hooks/api/useSettings";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import { GeneralSettings } from "../../../components/admin/settings/GeneralSettings";
import { EmailSettings } from "../../../components/admin/settings/EmailSettings";
// import { IntegrationSettings } from "../../../components/admin/settings/IntegrationSettings";
import { NotificationSettings } from "../../../components/admin/settings/NotificationSettings";
import { SecuritySettings } from "../../../components/admin/settings/SecuritySettings";
import { SystemSettings } from "../../../components/admin/settings/SystemSettings";

type SettingsTab =
  | "general"
  | "email"

  | "notifications"
  | "security"
  | "system";

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { settings: data, loading, refetch } = useAllSystemSettings();

  const { updateSettings, loading: updating } = useUpdateSettings();

  const { backupSystemData } = useBackupSystemData();

  const handleSaveSettings = async (category: string, settings: Record<string, unknown>) => {
    try {
      await updateSettings(category, settings);
      setSaveMessage({
        type: "success",
        text: "Settings saved successfully!",
      });
      setUnsavedChanges(false);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: `Error saving settings: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleBackupData = async () => {
    try {
      const result = await backupSystemData();
      if (result.data?.backupSystemData) {
        const link = document.createElement("a");
        link.href = result.data.backupSystemData.downloadUrl;
        link.download = result.data.backupSystemData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  const settingsTabs = [
    {
      id: "general",
      name: "General",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "email",
      name: "Email",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },

    {
      id: "notifications",
      name: "Notifications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM12 8a7.2 7.2 0 0 0-5 2c0 0 0 7 0 7h5v-9z"
          />
        </svg>
      ),
    },
    {
      id: "security",
      name: "Security",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: "system",
      name: "System",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
    },
  ];

  const handleSettingChange = () => {
    setUnsavedChanges(true);
    // Handle setting change logic here
  };



  const actions = (
    <div className="flex items-center gap-3">
      {unsavedChanges && (
        <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
          Unsaved changes
        </span>
      )}
      {saveMessage && (
        <span
          className={`text-sm px-2 py-1 rounded ${saveMessage.type === "success"
            ? "text-green-600 bg-green-100"
            : "text-red-600 bg-red-100"
            }`}
        >
          {saveMessage.text}
        </span>
      )}
      <button
        onClick={handleBackupData}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Backup Data
      </button>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout
        title="Settings"
        subtitle="System Configuration"
        actions={actions}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const settings = data || {};

  return (
    <AdminLayout
      title="Settings"
      subtitle="Configure system preferences and options"
      actions={actions}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => refetch()}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🔄 Refresh Settings
              </button>
              <button
                onClick={handleBackupData}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                💾 Create Backup
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200">
            {activeTab === "general" && (
              <GeneralSettings
                settings={settings.general || {}}
                onSave={(settings: Record<string, unknown>) => handleSaveSettings("general", settings)}
                onChange={handleSettingChange}
                loading={updating}
              />
            )}

            {activeTab === "email" && (
              <EmailSettings
                settings={settings.email || {}}
                onSave={(settings: Record<string, unknown>) => handleSaveSettings("email", settings)}
                onChange={handleSettingChange}
                loading={updating}
              />
            )}



            {activeTab === "notifications" && (
              <NotificationSettings
                settings={settings.notifications || {}}
                onSave={(settings: Record<string, unknown>) =>
                  handleSaveSettings("notifications", settings)
                }
                onChange={handleSettingChange}
                loading={updating}
              />
            )}

            {activeTab === "security" && (
              <SecuritySettings
                settings={settings.security || {}}
                onSave={(settings: Record<string, unknown>) => handleSaveSettings("security", settings)}
                onChange={handleSettingChange}
                loading={updating}
              />
            )}

            {activeTab === "system" && (
              <SystemSettings
                settings={settings.system || {}}
                onSave={(settings: Record<string, unknown>) => handleSaveSettings("system", settings)}
                onChange={handleSettingChange}
                loading={updating}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminSettingsPage;

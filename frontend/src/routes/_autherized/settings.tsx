import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_autherized/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="w-7 h-7 mr-3 text-indigo-600" />
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Settings sections */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
          <p className="text-gray-500">Configure your account settings here</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          <p className="text-gray-500">Customize your experience</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h2>
          <p className="text-gray-500">Manage your privacy and security settings</p>
        </div>
      </div>
    </div>
  );
}

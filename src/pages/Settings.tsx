import React from 'react';
import Button from '../components/ui/button';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your application preferences and configurations.
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              General Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Configure your workspace preferences
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Organization Name
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Language
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <select
                  id="language"
                  name="language"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Timezone
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <select
                  id="timezone"
                  name="timezone"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Security Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Configure security preferences and authentication settings
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
              <div className="text-sm font-medium text-gray-700">
                Two-Factor Authentication
              </div>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
              <div className="text-sm font-medium text-gray-700">
                Session Management
              </div>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <Button variant="outline">View Active Sessions</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-5">
          <div className="flex justify-end">
            <Button variant="secondary" className="mr-3">
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
import React from 'react';
import Button from '@/components/ui/button';
import { Plus } from 'lucide-react';

const BusinessValues = () => {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Business Values</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's business values and their associated assets.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Business Value</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sample cards - replace with actual data */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Customer Data Protection
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Ensuring the confidentiality and integrity of customer information
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">
                Supporting Assets
              </h4>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-500">Customer Database</li>
                <li className="text-sm text-gray-500">Backup Systems</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Financial Operations
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Managing financial transactions and accounting processes
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">
                Supporting Assets
              </h4>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-500">Accounting Software</li>
                <li className="text-sm text-gray-500">Payment Gateway</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessValues;
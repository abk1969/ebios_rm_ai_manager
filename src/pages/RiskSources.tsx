import React from 'react';
import Button from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';

const RiskSources = () => {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Risk Sources</h1>
          <p className="mt-2 text-sm text-gray-700">
            Identify and analyze potential sources of risk to your organization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Risk Source</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sample risk source cards - replace with actual data */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-red-500" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Cyber Criminals
              </h3>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Individuals or groups seeking financial gain through cyber attacks
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">
                Potential Impacts
              </h4>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-500">Data theft</li>
                <li className="text-sm text-gray-500">Financial loss</li>
                <li className="text-sm text-gray-500">Reputation damage</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-red-600">High Risk</span>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-yellow-500" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Insider Threats
              </h3>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Employees or contractors with malicious intent
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">
                Potential Impacts
              </h4>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-500">Data leakage</li>
                <li className="text-sm text-gray-500">Intellectual property theft</li>
                <li className="text-sm text-gray-500">System sabotage</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-yellow-600">
                Medium Risk
              </span>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskSources;
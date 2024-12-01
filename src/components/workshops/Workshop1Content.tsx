import React from 'react';
import { Plus, Database, Shield, Server } from 'lucide-react';
import Button from '@/components/ui/button';
import type { BusinessValue, SecurityBaseline, DreadedEvent, Gap } from '@/types/ebios';

interface Workshop1ContentProps {
  businessValues: BusinessValue[];
  securityBaseline: SecurityBaseline[];
  onAddBusinessValue: () => void;
  onAddSecurityControl: () => void;
  onAddDreadedEvent: (businessValueId: string) => void;
  onEditBusinessValue: (id: string) => void;
  onEditSecurityControl: (id: string) => void;
}

const Workshop1Content: React.FC<Workshop1ContentProps> = ({
  businessValues,
  securityBaseline,
  onAddBusinessValue,
  onAddSecurityControl,
  onAddDreadedEvent,
  onEditBusinessValue,
  onEditSecurityControl,
}) => {
  const getComplianceStatus = (control: SecurityBaseline) => {
    const status = control.status as 'compliant' | 'partially_compliant' | 'non_compliant';
    return {
      isCompliant: status === 'compliant',
      isPartiallyCompliant: status === 'partially_compliant',
      isNonCompliant: status === 'non_compliant'
    };
  };

  return (
    <div className="space-y-8">
      {/* Business Values Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-blue-500" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">Business Values</h2>
            </div>
            <Button onClick={onAddBusinessValue} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Value</span>
            </Button>
          </div>

          <div className="mt-6 divide-y divide-gray-200">
            {businessValues.map((value) => (
              <div key={value.id} className="py-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{value.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onAddDreadedEvent(value.id)}
                      className="flex items-center space-x-1"
                    >
                      <Server className="h-4 w-4" />
                      <span>Add Event</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditBusinessValue(value.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{value.description}</p>
                
                {/* Dreaded Events */}
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-500">Dreaded Events:</h4>
                  {value.dreadedEvents && value.dreadedEvents.length > 0 ? (
                    <div className="mt-2">
                      {value.dreadedEvents.map((event) => (
                        <div key={event.id} className="text-sm text-gray-600">
                          <span className="font-medium">{event.name}</span>
                          <span className="ml-2 text-xs">
                            Impact: {event.impact} | Likelihood: {event.likelihood}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No dreaded events defined</p>
                  )}
                </div>
              </div>
            ))}
            {businessValues.length === 0 && (
              <div className="py-6 text-center">
                <Database className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No business values</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a business value.</p>
                <div className="mt-6">
                  <Button onClick={onAddBusinessValue}>Add Business Value</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Controls Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-green-500" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">Security Baseline</h2>
            </div>
            <Button onClick={onAddSecurityControl} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Control</span>
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {securityBaseline.map((control) => {
              const { isCompliant, isPartiallyCompliant } = getComplianceStatus(control);
              return (
                <div
                  key={control.id}
                  className={`rounded-lg p-4 ${
                    isCompliant
                      ? 'bg-green-50'
                      : isPartiallyCompliant
                      ? 'bg-yellow-50'
                      : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{control.name}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCompliant
                          ? 'bg-green-100 text-green-800'
                          : isPartiallyCompliant
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {control.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{control.description}</p>
                  {control.gaps && control.gaps.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-xs font-medium text-gray-700">Identified Gaps:</h4>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {control.gaps.map((gap: Gap) => (
                          <li key={gap.id} className="text-xs text-gray-600">
                            {gap.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditSecurityControl(control.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
            {securityBaseline.length === 0 && (
              <div className="text-center py-6">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No security controls</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a security control.</p>
                <div className="mt-6">
                  <Button onClick={onAddSecurityControl}>Add Security Control</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshop1Content;
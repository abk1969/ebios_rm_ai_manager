import React from 'react';
import { Database } from 'lucide-react';
import Button from '@/components/ui/button';
import { BusinessValue, DreadedEvent } from '@/types/ebios';

interface BusinessValueCardProps {
  businessValue: BusinessValue;
  onEdit?: (id: string) => void;
}

const BusinessValueCard: React.FC<BusinessValueCardProps> = ({ businessValue, onEdit }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-blue-500" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            {businessValue.name}
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">{businessValue.description}</p>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Biens Essentiels Supportés</h4>
          <div className="mt-2 text-sm text-gray-600">
            {businessValue.supportingEssentialAssets.length} bien(s) essentiel(s)
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <Button variant="ghost" size="sm" onClick={() => onEdit?.(businessValue.id)}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default BusinessValueCard;
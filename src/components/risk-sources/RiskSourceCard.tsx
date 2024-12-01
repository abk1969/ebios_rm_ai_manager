import React from 'react';
import { Target } from 'lucide-react';
import Button from '@/components/ui/button';
import type { RiskSource } from '@/types/ebios';

interface RiskSourceCardProps {
  riskSource: RiskSource;
  onEdit?: () => void;
}

const RiskSourceCard: React.FC<RiskSourceCardProps> = ({ riskSource, onEdit }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-red-500" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">
            {riskSource.name}
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">{riskSource.description}</p>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Category</h4>
          <p className="mt-1 text-sm text-gray-600">{riskSource.category}</p>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Objectives</h4>
          <ul className="mt-2 space-y-1">
            {riskSource.objectives.map((objective) => (
              <li key={objective.id} className="text-sm text-gray-600">
                {objective.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Pertinence Level</h4>
          <div className="mt-1">
            <div className="flex items-center">
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${(riskSource.pertinence / 5) * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {riskSource.pertinence}/5
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default RiskSourceCard;
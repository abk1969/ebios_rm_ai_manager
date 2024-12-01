import React from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { Workshop } from '@/types/ebios';

interface WorkshopProgressProps {
  workshop: Workshop;
  totalSteps: number;
  className?: string;
}

const WorkshopProgress: React.FC<WorkshopProgressProps> = ({ 
  workshop, 
  totalSteps,
  className = '' 
}) => {
  const getStatusIcon = () => {
    switch (workshop.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (workshop.status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const progress = (workshop.completedSteps.length / totalSteps) * 100;

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-900">
            {getStatusText()}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {workshop.completedSteps.length}/{totalSteps} steps
        </span>
      </div>
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {workshop.completedSteps.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-700">Completed Steps:</h4>
          <ul className="mt-2 space-y-1">
            {workshop.completedSteps.map((step, index) => (
              <li key={index} className="flex items-center text-xs text-gray-600">
                <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkshopProgress;
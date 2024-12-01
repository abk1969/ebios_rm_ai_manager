import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { Workshop } from '@/types/ebios';

interface WorkshopCardProps {
  workshop: Workshop;
  title: string;
  description: string;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, title, description }) => {
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

  return (
    <Link
      to={`/workshop-${workshop.number}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {getStatusIcon()}
      </div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <div className="mt-4">
        <div className="text-sm text-gray-500">
          Completed Steps: {workshop.completedSteps.length}
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{
              width: `${(workshop.completedSteps.length / 5) * 100}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default WorkshopCard;
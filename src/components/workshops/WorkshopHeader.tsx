import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/button';

interface WorkshopHeaderProps {
  title: string;
  description: string;
  workshopNumber: number;
  onSave?: () => void;
}

const WorkshopHeader: React.FC<WorkshopHeaderProps> = ({
  title,
  description,
  workshopNumber,
  onSave,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center">
            <Link
              to="/missions"
              className="mr-4 flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Mission
            </Link>
            <span className="text-sm font-medium text-blue-600">
              Workshop {workshopNumber}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {onSave && (
          <Button onClick={onSave} className="flex items-center gap-2">
            Save Progress
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkshopHeader;
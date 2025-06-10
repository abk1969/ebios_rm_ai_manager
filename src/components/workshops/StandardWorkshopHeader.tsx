import React from 'react';
import { Info } from 'lucide-react';
import Button from '@/components/ui/button';
import AICoherenceIndicator from '@/components/ai/AICoherenceIndicator';
import WorkshopMetricsDisplay from '@/components/workshops/WorkshopMetricsDisplay';

interface StandardWorkshopHeaderProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  missionId: string;
  data?: any;
  showHelp: boolean;
  onToggleHelp: () => void;
  helpContent: React.ReactNode;
}

// 🎨 COULEURS THÉMATIQUES STANDARDISÉES
const WORKSHOP_THEMES = {
  1: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600'
  },
  2: {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600'
  },
  3: {
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600'
  },
  4: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600'
  },
  5: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600'
  }
};

const StandardWorkshopHeader: React.FC<StandardWorkshopHeaderProps> = ({
  workshopNumber,
  title,
  description,
  missionId,
  data,
  showHelp,
  onToggleHelp,
  helpContent
}) => {
  const theme = WORKSHOP_THEMES[workshopNumber];

  return (
    <div className={`${theme.bgColor} ${theme.borderColor} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>

        </div>
        <div className="flex items-center space-x-4">
          {/* 🤖 INDICATEUR IA STANDARDISÉ */}
          <AICoherenceIndicator
            missionId={missionId}
            workshop={workshopNumber}
            data={data}
            size="md"
            autoRefresh={true}
            refreshInterval={60000}
          />

          {/* 📚 BOUTON AIDE ANSSI */}
          <Button
            variant="outline"
            onClick={onToggleHelp}
            className="flex items-center space-x-2"
          >
            <Info className="h-4 w-4" />
            <span>Aide ANSSI</span>
          </Button>
        </div>
      </div>
      
      {/* 📖 CONTENU D'AIDE CONTEXTUELLE */}
      {showHelp && (
        <div className="mt-4 p-4 bg-white rounded border">
          {helpContent}
        </div>
      )}
    </div>
  );
};

export default StandardWorkshopHeader;

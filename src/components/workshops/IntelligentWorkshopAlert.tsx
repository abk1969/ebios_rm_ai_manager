/**
 * 🚨 ALERTE INTELLIGENTE D'ATELIER
 * Composant qui guide l'utilisateur avec des actions concrètes
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  Target,
  Plus,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Button from '../ui/button';
import { cn } from '@/lib/utils';

interface WorkshopCriterion {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
  actionLabel?: string;
  onAction?: () => void;
  helpText?: string;
  priority: 'high' | 'medium' | 'low';
}

interface IntelligentWorkshopAlertProps {
  criteria: WorkshopCriterion[];
  workshopName: string;
  isComplete: boolean;
  onContinue?: () => void;
  className?: string;
}

const IntelligentWorkshopAlert: React.FC<IntelligentWorkshopAlertProps> = ({
  criteria,
  workshopName,
  isComplete,
  onContinue,
  className
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

  const incompleteCriteria = criteria.filter(c => !c.completed);
  const requiredIncomplete = incompleteCriteria.filter(c => c.required);
  const optionalIncomplete = incompleteCriteria.filter(c => !c.required);
  const completedCount = criteria.filter(c => c.completed).length;
  const progressPercentage = Math.round((completedCount / criteria.length) * 100);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Info className="h-4 w-4 text-orange-500" />;
      case 'low': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (isComplete) {
    return (
      <div className={cn('bg-green-50 border border-green-200 rounded-lg p-6', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                ✅ {workshopName} Terminé !
              </h3>
              <p className="text-green-800">
                Tous les critères obligatoires sont remplis. Vous pouvez continuer.
              </p>
            </div>
          </div>
          {onContinue && (
            <Button onClick={onContinue} className="bg-green-600 hover:bg-green-700">
              Continuer vers l'atelier suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white border rounded-lg shadow-sm', className)}>
      {/* En-tête avec progression */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {workshopName} - Progression {progressPercentage}%
              </h3>
              <p className="text-gray-600">
                {requiredIncomplete.length > 0 
                  ? `${requiredIncomplete.length} critère(s) obligatoire(s) manquant(s)`
                  : 'Critères obligatoires remplis ! Vous pouvez continuer.'
                }
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2"
          >
            <span>Détails</span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Actions rapides pour critères manquants */}
      {requiredIncomplete.length > 0 && (
        <div className="p-6 bg-orange-50 border-b">
          <h4 className="font-medium text-orange-900 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Actions Prioritaires
          </h4>
          <div className="space-y-2">
            {requiredIncomplete.slice(0, 3).map((criterion) => (
              <div key={criterion.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  {getPriorityIcon(criterion.priority)}
                  <span className="font-medium text-gray-900">{criterion.label}</span>
                </div>
                {criterion.onAction && (
                  <Button
                    size="sm"
                    onClick={criterion.onAction}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{criterion.actionLabel || 'Ajouter'}</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Détails complets */}
      {showDetails && (
        <div className="p-6">
          <div className="space-y-4">
            {/* Critères obligatoires manquants */}
            {requiredIncomplete.length > 0 && (
              <div>
                <h4 className="font-medium text-red-900 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Critères Obligatoires Manquants ({requiredIncomplete.length})
                </h4>
                <div className="space-y-2">
                  {requiredIncomplete.map((criterion) => (
                    <div key={criterion.id} className={cn('p-4 rounded-lg border', getPriorityColor(criterion.priority))}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getPriorityIcon(criterion.priority)}
                            <span className="font-medium text-gray-900">{criterion.label}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{criterion.description}</p>
                          {criterion.helpText && (
                            <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                              💡 {criterion.helpText}
                            </div>
                          )}
                        </div>
                        {criterion.onAction && (
                          <Button
                            size="sm"
                            onClick={criterion.onAction}
                            className="ml-4"
                          >
                            {criterion.actionLabel || 'Ajouter'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critères optionnels */}
            {optionalIncomplete.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                  Améliorations Suggérées ({optionalIncomplete.length})
                </h4>
                <div className="space-y-2">
                  {optionalIncomplete.map((criterion) => (
                    <div key={criterion.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{criterion.label}</span>
                          <p className="text-sm text-gray-600">{criterion.description}</p>
                        </div>
                        {criterion.onAction && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={criterion.onAction}
                          >
                            {criterion.actionLabel || 'Ajouter'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critères complétés */}
            {completedCount > 0 && (
              <div>
                <h4 className="font-medium text-green-900 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Critères Complétés ({completedCount})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {criteria.filter(c => c.completed).map((criterion) => (
                    <div key={criterion.id} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-900">{criterion.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions finales */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            💡 <strong>Conseil :</strong> Complétez les critères obligatoires pour débloquer la suite
          </div>
          {requiredIncomplete.length === 0 && onContinue && (
            <Button onClick={onContinue}>
              Continuer vers l'atelier suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentWorkshopAlert;

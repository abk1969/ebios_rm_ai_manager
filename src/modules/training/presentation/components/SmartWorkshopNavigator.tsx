import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Info,
  Database,
  Target,
  Users,
  Route,
  Shield,
  Navigation,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { WorkshopNavigationService, NavigationState, WorkshopTransition } from '../../domain/services/WorkshopNavigationService';

interface SmartWorkshopNavigatorProps {
  currentWorkshop: number;
  onNavigateToWorkshop: (workshopId: number) => void;
  onShowLinks?: () => void;
}

export const SmartWorkshopNavigator: React.FC<SmartWorkshopNavigatorProps> = ({
  currentWorkshop,
  onNavigateToWorkshop,
  onShowLinks
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<WorkshopTransition | null>(null);
  const [showTransitionDetails, setShowTransitionDetails] = useState(false);

  useEffect(() => {
    const state = WorkshopNavigationService.analyzeNavigationState(currentWorkshop);
    setNavigationState(state);
  }, [currentWorkshop]);

  const getWorkshopIcon = (workshopId: number) => {
    switch (workshopId) {
      case 1: return Database;
      case 2: return Target;
      case 3: return Users;
      case 4: return Route;
      case 5: return Shield;
      default: return FileText;
    }
  };

  const getWorkshopColor = (workshopId: number) => {
    if (!navigationState) return 'gray';
    
    if (navigationState.completedWorkshops.includes(workshopId)) return 'green';
    if (navigationState.currentWorkshop === workshopId) return 'blue';
    if (navigationState.availableWorkshops.includes(workshopId)) return 'yellow';
    if (navigationState.blockedWorkshops.includes(workshopId)) return 'gray';
    return 'gray';
  };

  const handleNavigationClick = (targetWorkshop: number) => {
    if (!navigationState) return;

    const validation = WorkshopNavigationService.validateNavigation(currentWorkshop, targetWorkshop);
    
    if (!validation.valid) {
      alert(`Navigation impossible :\n${validation.reasons.join('\n')}`);
      return;
    }

    // Planifier la transition si nécessaire
    if (Math.abs(targetWorkshop - currentWorkshop) > 1) {
      const transition = WorkshopNavigationService.planTransition(currentWorkshop, targetWorkshop);
      setSelectedTransition(transition);
      setShowTransitionDetails(true);
    } else {
      onNavigateToWorkshop(targetWorkshop);
    }
  };

  const executeTransition = () => {
    if (selectedTransition) {
      onNavigateToWorkshop(selectedTransition.to);
      setShowTransitionDetails(false);
      setSelectedTransition(null);
    }
  };

  if (!navigationState) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement navigation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête de navigation */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navigation className="w-6 h-6 mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Navigation Intelligente</h2>
              <p className="text-indigo-200 text-sm">Atelier {currentWorkshop} actuel</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200">Progression</div>
            <div className="text-xl font-bold">
              {navigationState.completedWorkshops.length}/5
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((workshopId, index) => {
            const Icon = getWorkshopIcon(workshopId);
            const color = getWorkshopColor(workshopId);
            const metadata = WorkshopNavigationService.getWorkshopMetadata(workshopId);
            
            return (
              <React.Fragment key={workshopId}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleNavigationClick(workshopId)}
                    disabled={navigationState.blockedWorkshops.includes(workshopId)}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      currentWorkshop === workshopId 
                        ? 'ring-2 ring-indigo-500 ring-offset-2' 
                        : ''
                    } ${
                      color === 'green' ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' :
                      color === 'blue' ? 'bg-blue-100 border-blue-300 text-blue-700' :
                      color === 'yellow' ? 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200' :
                      'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {navigationState.completedWorkshops.includes(workshopId) && (
                      <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-green-600" />
                    )}
                  </button>
                  <div className="text-center mt-2">
                    <div className="font-medium text-xs">A{workshopId}</div>
                    <div className="text-xs text-gray-600">{metadata?.shortTitle}</div>
                    <div className="text-xs text-gray-500">{metadata?.estimatedDuration}min</div>
                  </div>
                </div>
                
                {index < 4 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Légende */}
        <div className="flex justify-center space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div>
            <span className="text-gray-600">Terminé</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-1"></div>
            <span className="text-gray-600">Actuel</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-1"></div>
            <span className="text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-1"></div>
            <span className="text-gray-600">Bloqué</span>
          </div>
        </div>
      </div>

      {/* Prérequis et avertissements */}
      {(navigationState.prerequisites.length > 0 || navigationState.warnings.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prérequis */}
          {navigationState.prerequisites.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Prérequis Atelier {currentWorkshop}
              </h3>
              <div className="space-y-2">
                {navigationState.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      prereq.status === 'satisfied' ? 'bg-green-500' :
                      prereq.status === 'partial' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{prereq.requirement}</div>
                      <div className="text-xs text-gray-600">{prereq.description}</div>
                      {prereq.actions.length > 0 && prereq.status !== 'satisfied' && (
                        <div className="text-xs text-blue-600 mt-1">
                          Actions: {prereq.actions.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avertissements */}
          {navigationState.warnings.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Avertissements
              </h3>
              <div className="space-y-2">
                {navigationState.warnings.map((warning, index) => (
                  <div key={index} className={`p-2 rounded border-l-4 ${
                    warning.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    warning.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                    warning.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="text-sm font-medium">{warning.message}</div>
                    {warning.recommendations.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        Recommandations: {warning.recommendations.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions de navigation */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {navigationState.canNavigateBackward && (
              <Button
                onClick={() => handleNavigationClick(currentWorkshop - 1)}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atelier {currentWorkshop - 1}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {onShowLinks && (
              <Button
                onClick={onShowLinks}
                variant="outline"
                size="sm"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Voir les liens
              </Button>
            )}

            {navigationState.nextRecommendedWorkshop && (
              <Button
                onClick={() => handleNavigationClick(navigationState.nextRecommendedWorkshop!)}
                disabled={!navigationState.canNavigateForward}
                size="sm"
              >
                {navigationState.nextRecommendedWorkshop === currentWorkshop ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Continuer A{currentWorkshop}
                  </>
                ) : (
                  <>
                    Atelier {navigationState.nextRecommendedWorkshop}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails de transition */}
      {showTransitionDetails && selectedTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Transition A{selectedTransition.from} → A{selectedTransition.to}
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Complexité :</span>
                <span className={`text-sm font-medium ${
                  selectedTransition.complexity === 'simple' ? 'text-green-600' :
                  selectedTransition.complexity === 'moderate' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {selectedTransition.complexity}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Durée estimée :</span>
                <span className="text-sm font-medium">{selectedTransition.estimatedDuration} min</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Données à transférer :</span>
                <span className="text-sm font-medium">{selectedTransition.dataTransfer.totalItems} éléments</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Guidage :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedTransition.userGuidance.map((guidance, index) => (
                  <li key={index}>• {guidance}</li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowTransitionDetails(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={executeTransition}
                className="flex-1"
              >
                Continuer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

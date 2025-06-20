/**
 * 🧭 INTERFACE DE NAVIGATION LINÉAIRE
 * Composant React pour la navigation simplifiée du parcours EBIOS RM
 * Remplace la navigation chaotique par une interface intuitive
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  LogOut, 
  Clock, 
  CheckCircle,
  Circle,
  AlertCircle,
  Home
} from 'lucide-react';
import {
  LinearNavigationService,
  NavigationState,
  NavigationEvent,
  BreadcrumbItem
} from '../../domain/services/LinearNavigationService';
import { TrainingStep } from '../../domain/entities/LinearTrainingPath';

// 🎯 PROPS DU COMPOSANT
interface LinearNavigationInterfaceProps {
  navigationService: LinearNavigationService;
  onStepChange?: (step: TrainingStep) => void;
  onHelpRequest?: () => void;
  onExitRequest?: () => void;
  className?: string;
  showBreadcrumb?: boolean;
  showProgress?: boolean;
  showTimeEstimate?: boolean;
}

// 🎯 COMPOSANT PRINCIPAL
export const LinearNavigationInterface: React.FC<LinearNavigationInterfaceProps> = ({
  navigationService,
  onStepChange,
  onHelpRequest,
  onExitRequest,
  className = '',
  showBreadcrumb = true,
  showProgress = true,
  showTimeEstimate = true
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 CHARGER L'ÉTAT DE NAVIGATION
  const loadNavigationState = useCallback(() => {
    try {
      const state = navigationService.getCurrentNavigationState();
      setNavigationState(state);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état de navigation:', error);
    }
  }, [navigationService]);

  // 🎧 ÉCOUTER LES ÉVÉNEMENTS DE NAVIGATION
  useEffect(() => {
    const handleNavigationEvent = (event: NavigationEvent) => {
      if (event.type === 'step_change') {
        loadNavigationState();
        onStepChange?.(event.toStep!);
      } else if (event.type === 'help_request') {
        onHelpRequest?.();
      } else if (event.type === 'exit_request') {
        onExitRequest?.();
      }
    };

    navigationService.addEventListener('navigation', handleNavigationEvent);
    loadNavigationState();

    return () => {
      navigationService.removeEventListener('navigation');
    };
  }, [navigationService, loadNavigationState, onStepChange, onHelpRequest, onExitRequest]);

  // ⌨️ GESTION DES RACCOURCIS CLAVIER
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      navigationService.handleKeyboardShortcut(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigationService]);

  // 🎮 GESTIONNAIRES D'ACTIONS
  const handleNavigateBack = async () => {
    setIsLoading(true);
    try {
      await navigationService.navigateBack();
    } catch (error) {
      console.error('Erreur navigation arrière:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateForward = async () => {
    setIsLoading(true);
    try {
      await navigationService.navigateForward();
    } catch (error) {
      console.error('Erreur navigation avant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepClick = async (step: TrainingStep) => {
    if (!navigationState) return;
    
    const breadcrumbItem = navigationState.breadcrumb.find(item => item.step === step);
    if (!breadcrumbItem?.accessible) return;

    setIsLoading(true);
    try {
      await navigationService.navigateToStep(step);
    } catch (error) {
      console.error('Erreur navigation vers étape:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!navigationState) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement de la navigation...</span>
      </div>
    );
  }

  return (
    <div className={`linear-navigation-interface bg-white border-b border-gray-200 ${className}`}>
      {/* 📊 BARRE DE PROGRESSION */}
      {showProgress && (
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {navigationState.currentStepName}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                {navigationState.stepsCompleted}/{navigationState.totalSteps} étapes
              </span>
              {showTimeEstimate && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-600" />
                  ~{navigationState.estimatedTimeRemaining} min restantes
                </span>
              )}
            </div>
          </div>
          
          {/* Barre de progression visuelle */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${navigationState.progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Début</span>
            <span className="font-medium">{navigationState.progressPercentage}%</span>
            <span>Certification</span>
          </div>
        </div>
      )}

      {/* 🍞 FIL D'ARIANE */}
      {showBreadcrumb && (
        <div className="px-6 py-4">
          <nav className="flex items-center space-x-2 overflow-x-auto">
            {navigationState.breadcrumb.map((item, index) => (
              <React.Fragment key={item.step}>
                <BreadcrumbStepItem
                  item={item}
                  onClick={() => handleStepClick(item.step)}
                  isLoading={isLoading}
                />
                {index < navigationState.breadcrumb.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}

      {/* 🎮 CONTRÔLES DE NAVIGATION */}
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        {/* Boutons de navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNavigateBack}
            disabled={!navigationState.canGoBack || isLoading}
            className={`
              flex items-center px-4 py-2 rounded-lg font-medium transition-all
              ${navigationState.canGoBack && !isLoading
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Précédent (Alt+←)"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </button>

          <button
            onClick={handleNavigateForward}
            disabled={!navigationState.canGoForward || isLoading}
            className={`
              flex items-center px-6 py-2 rounded-lg font-medium transition-all
              ${navigationState.canGoForward && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Suivant (Alt+→)"
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Actions secondaires */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigationService.requestHelp()}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Aide (F1)"
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            Aide
          </button>

          <button
            onClick={() => navigationService.requestExit()}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Quitter (Ctrl+Q)"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Quitter
          </button>
        </div>
      </div>

      {/* 📝 DESCRIPTION DE L'ÉTAPE ACTUELLE */}
      {navigationState.currentStepDescription && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Cette étape :</span> {navigationState.currentStepDescription}
          </p>
        </div>
      )}
    </div>
  );
};

// 🎯 COMPOSANT ÉLÉMENT DU FIL D'ARIANE
interface BreadcrumbStepItemProps {
  item: BreadcrumbItem;
  onClick: () => void;
  isLoading: boolean;
}

const BreadcrumbStepItem: React.FC<BreadcrumbStepItemProps> = ({ 
  item, 
  onClick, 
  isLoading 
}) => {
  const getStepIcon = () => {
    if (item.completed) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (item.current) {
      return <AlertCircle className="w-4 h-4 text-blue-600" />;
    } else {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepClasses = () => {
    let baseClasses = "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all";
    
    if (item.current) {
      return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
    } else if (item.completed) {
      return `${baseClasses} bg-green-50 text-green-700 hover:bg-green-100`;
    } else if (item.accessible) {
      return `${baseClasses} text-gray-600 hover:bg-gray-100 cursor-pointer`;
    } else {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }
  };

  return (
    <button
      onClick={item.accessible && !isLoading ? onClick : undefined}
      disabled={!item.accessible || isLoading}
      className={getStepClasses()}
      title={item.accessible ? `Aller à : ${item.name}` : `${item.name} (non accessible)`}
    >
      {getStepIcon()}
      <span className="ml-2 whitespace-nowrap">{item.name}</span>
    </button>
  );
};

export default LinearNavigationInterface;

/**
 * 📱 INTERFACE OPTIMISÉE MOBILE
 * Composant spécialisé pour l'expérience mobile de la formation EBIOS RM
 * Design adaptatif et interactions tactiles optimisées
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Home,
  BookOpen,
  Target,
  Award,
  HelpCircle,
  Settings,
  Maximize2
} from 'lucide-react';
import { TrainingStep } from '../../domain/entities/LinearTrainingPath';
import { LinearTrainingOrchestrator } from '../../domain/services/LinearTrainingOrchestrator';

// 🎯 PROPS DU COMPOSANT
interface MobileOptimizedInterfaceProps {
  orchestrator: LinearTrainingOrchestrator;
  currentStep: TrainingStep;
  onStepChange: (step: TrainingStep) => void;
  onSettingsOpen: () => void;
  onHelpOpen: () => void;
  className?: string;
}

// 🎯 ÉTAT MOBILE
interface MobileState {
  showMenu: boolean;
  showQuickActions: boolean;
  isLandscape: boolean;
  touchStartY: number;
  swipeDirection: 'none' | 'up' | 'down' | 'left' | 'right';
}

// 🎯 COMPOSANT PRINCIPAL
export const MobileOptimizedInterface: React.FC<MobileOptimizedInterfaceProps> = ({
  orchestrator,
  currentStep,
  onStepChange,
  onSettingsOpen,
  onHelpOpen,
  className = ''
}) => {
  const [state, setState] = useState<MobileState>({
    showMenu: false,
    showQuickActions: false,
    isLandscape: false,
    touchStartY: 0,
    swipeDirection: 'none'
  });

  // 📱 DÉTECTION D'ORIENTATION
  useEffect(() => {
    const handleOrientationChange = () => {
      setState(prev => ({
        ...prev,
        isLandscape: window.innerHeight < window.innerWidth
      }));
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // 👆 GESTION DES GESTES TACTILES
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setState(prev => ({
      ...prev,
      touchStartY: e.touches[0].clientY,
      swipeDirection: 'none'
    }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (state.touchStartY === 0) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchY - state.touchStartY;

    if (Math.abs(deltaY) > 50) { // Seuil de swipe
      const direction = deltaY > 0 ? 'down' : 'up';
      setState(prev => ({ ...prev, swipeDirection: direction }));
    }
  }, [state.touchStartY]);

  const handleTouchEnd = useCallback(() => {
    if (state.swipeDirection === 'up') {
      setState(prev => ({ ...prev, showQuickActions: true }));
    } else if (state.swipeDirection === 'down') {
      setState(prev => ({ ...prev, showQuickActions: false }));
    }

    setState(prev => ({
      ...prev,
      touchStartY: 0,
      swipeDirection: 'none'
    }));
  }, [state.swipeDirection]);

  // 🎮 GESTIONNAIRES D'ACTIONS
  const toggleMenu = () => {
    setState(prev => ({ ...prev, showMenu: !prev.showMenu }));
  };

  const toggleQuickActions = () => {
    setState(prev => ({ ...prev, showQuickActions: !prev.showQuickActions }));
  };

  const handleStepNavigation = async (direction: 'prev' | 'next') => {
    const navigationService = orchestrator['navigationService'];
    
    if (direction === 'prev') {
      await navigationService.navigateBack();
    } else {
      await navigationService.navigateForward();
    }
  };

  // 📊 OBTENIR LES DONNÉES DE PROGRESSION
  const getProgressData = () => {
    const fullState = orchestrator.getFullState();
    return {
      globalProgress: fullState.progress.globalProgress,
      stepProgress: fullState.progress.stepProgress,
      currentStepName: getCurrentStepName(),
      canGoBack: fullState.navigation.canGoBack,
      canGoForward: fullState.navigation.canGoForward
    };
  };

  const getCurrentStepName = (): string => {
    const stepNames = {
      [TrainingStep.ONBOARDING]: 'Accueil',
      [TrainingStep.DISCOVERY]: 'Découverte',
      [TrainingStep.WORKSHOPS]: 'Ateliers',
      [TrainingStep.CERTIFICATION]: 'Certification',
      [TrainingStep.RESOURCES]: 'Ressources'
    };
    return stepNames[currentStep] || `Étape ${currentStep}`;
  };

  const progressData = getProgressData();

  return (
    <div 
      className={`mobile-interface ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 📱 BARRE DE NAVIGATION MOBILE */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {progressData.currentStepName}
          </h1>
          <div className="text-xs text-gray-500">
            {progressData.globalProgress}% complété
          </div>
        </div>

        <button
          onClick={toggleQuickActions}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 📊 BARRE DE PROGRESSION MOBILE */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressData.globalProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Début</span>
          <span>{progressData.globalProgress}%</span>
          <span>Fin</span>
        </div>
      </div>

      {/* 🎮 NAVIGATION TACTILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleStepNavigation('prev')}
            disabled={!progressData.canGoBack}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              progressData.canGoBack
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onHelpOpen}
              className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 active:bg-blue-300 transition-all"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => handleStepNavigation('next')}
            disabled={!progressData.canGoForward}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              progressData.canGoForward
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 📱 MENU LATÉRAL MOBILE */}
      {state.showMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="flex-1 bg-black bg-opacity-50"
            onClick={toggleMenu}
          />
          
          {/* Menu */}
          <div className="w-80 bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {[
                  { step: TrainingStep.ONBOARDING, name: 'Accueil', icon: Home },
                  { step: TrainingStep.DISCOVERY, name: 'Découverte', icon: BookOpen },
                  { step: TrainingStep.WORKSHOPS, name: 'Ateliers', icon: Target },
                  { step: TrainingStep.CERTIFICATION, name: 'Certification', icon: Award },
                  { step: TrainingStep.RESOURCES, name: 'Ressources', icon: BookOpen }
                ].map(({ step, name, icon: Icon }) => {
                  const fullState = orchestrator.getFullState();
                  const isCompleted = fullState.user.completedSteps.includes(step);
                  const isCurrent = step === currentStep;
                  const isAccessible = fullState.user.unlockedSteps.includes(step);

                  return (
                    <button
                      key={step}
                      onClick={() => {
                        if (isAccessible) {
                          onStepChange(step);
                          toggleMenu();
                        }
                      }}
                      disabled={!isAccessible}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all ${
                        isCurrent
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : isCompleted
                          ? 'bg-green-50 text-green-800 hover:bg-green-100'
                          : isAccessible
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{name}</span>
                      {isCompleted && (
                        <div className="ml-auto w-2 h-2 bg-green-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onSettingsOpen();
                  toggleMenu();
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Paramètres</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ ACTIONS RAPIDES */}
      {state.showQuickActions && (
        <div className="fixed bottom-20 right-4 z-40">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-2 space-y-2">
            <button
              onClick={onHelpOpen}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Aide</span>
            </button>
            
            <button
              onClick={onSettingsOpen}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Paramètres</span>
            </button>

            <button
              onClick={() => {
                // Basculer en mode plein écran mobile
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
                }
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded transition-all"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm">Plein écran</span>
            </button>
          </div>
        </div>
      )}

      {/* 💡 INDICATEUR DE SWIPE */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-gray-800 bg-opacity-75 text-white text-xs px-3 py-1 rounded-full">
          ↕️ Glissez pour les actions rapides
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedInterface;

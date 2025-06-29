/**
 * 🎓 VISITE GUIDÉE DE LA FORMATION
 * Composant pour guider l'utilisateur dans l'interface de formation
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ComponentType<any>;
}

interface TrainingGuidedTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const TrainingGuidedTour: React.FC<TrainingGuidedTourProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '🎉 Bienvenue dans votre formation !',
      description: 'Je vais vous guider à travers l\'interface pour que vous puissiez tirer le meilleur parti de votre apprentissage EBIOS RM.',
      target: 'main-interface',
      position: 'bottom',
      icon: Lightbulb
    },
    {
      id: 'chat',
      title: '💬 Chat avec l\'Expert IA',
      description: 'Posez toutes vos questions sur EBIOS RM à notre expert IA. Il peut vous expliquer les concepts, clarifier les étapes, et vous donner des exemples concrets.',
      target: 'chat-tab',
      position: 'bottom',
      icon: MessageCircle
    },
    {
      id: 'progress',
      title: '📊 Suivez votre progression',
      description: 'Consultez vos métriques d\'apprentissage : progression globale, score d\'engagement, et badges obtenus.',
      target: 'progress-tab',
      position: 'bottom',
      icon: BarChart3
    },
    {
      id: 'resources',
      title: '📚 Ressources et documentation',
      description: 'Accédez aux guides ANSSI, cas d\'usage sectoriels, et documentation officielle EBIOS RM.',
      target: 'resources-tab',
      position: 'bottom',
      icon: BookOpen
    },
    {
      id: 'case-study',
      title: '🏥 Cas d\'étude réel',
      description: 'Vous allez travailler sur un cas réel : l\'analyse des risques d\'un CHU métropolitain. C\'est un exemple concret du secteur santé.',
      target: 'sidebar-info',
      position: 'left',
      icon: Target
    },
    {
      id: 'start-learning',
      title: '🚀 Prêt à commencer ?',
      description: 'Vous avez maintenant toutes les clés en main ! Commencez par poser une question dans le chat ou explorez les ressources. Bonne formation !',
      target: 'chat-input',
      position: 'top',
      icon: CheckCircle
    }
  ];

  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      setCurrentStep(0);
    }
  }, [isVisible]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  if (!isActive || !isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const Icon = currentTourStep.icon;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50" />
      
      {/* Tour Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentTourStep.title}</h3>
                  <p className="text-blue-100 text-sm">
                    Étape {currentStep + 1} sur {tourSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {currentTourStep.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Progression</span>
                <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Précédent
                  </button>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Passer
                </button>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Terminer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Effect (optionnel) */}
      <style jsx>{`
        .tour-spotlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default TrainingGuidedTour;

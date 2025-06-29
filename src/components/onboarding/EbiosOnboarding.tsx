import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Target, AlertTriangle, Users, Shield, Settings, BookOpen, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/button';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ComponentType<any>;
  color: string;
}

interface EbiosOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 0,
    title: 'Bienvenue dans EBIOS Risk Manager',
    description: 'La méthode officielle ANSSI pour l\'analyse des risques cybersécurité',
    details: [
      'EBIOS RM v1.5 est la méthode française de référence',
      'Approche structurée en 5 ateliers progressifs',
      'Conforme aux exigences réglementaires',
      'Adaptée aux enjeux cyber actuels'
    ],
    icon: BookOpen,
    color: 'bg-indigo-500'
  },
  {
    id: 1,
    title: 'Atelier 1 - Cadrage et Valeurs Métier',
    description: 'Définissez le périmètre d\'étude et identifiez vos valeurs métier',
    details: [
      'Délimitation précise du périmètre d\'analyse',
      'Identification des valeurs métier critiques',
      'Définition des actifs support essentiels',
      'Cartographie des parties prenantes'
    ],
    icon: Target,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Atelier 2 - Sources de Risque',
    description: 'Identifiez et évaluez les sources de menaces',
    details: [
      'Catalogue des 7 types de sources de risque',
      'Évaluation de la pertinence pour votre contexte',
      'Analyse des capacités et motivations',
      'Priorisation selon votre exposition'
    ],
    icon: AlertTriangle,
    color: 'bg-orange-500'
  },
  {
    id: 3,
    title: 'Atelier 3 - Scénarios Stratégiques',
    description: 'Construisez les scénarios d\'attaque de haut niveau',
    details: [
      'Croisement sources de risque / valeurs métier',
      'Identification des événements redoutés',
      'Évaluation de la vraisemblance et gravité',
      'Priorisation des scénarios critiques'
    ],
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Atelier 4 - Scénarios Opérationnels',
    description: 'Détaillez les chemins d\'attaque techniques',
    details: [
      'Décomposition en étapes d\'attaque',
      'Analyse des techniques et tactiques',
      'Évaluation difficulté et détectabilité',
      'Cartographie des chemins d\'attaque'
    ],
    icon: Shield,
    color: 'bg-red-500'
  },
  {
    id: 5,
    title: 'Atelier 5 - Plan de Traitement',
    description: 'Définissez votre stratégie de traitement des risques',
    details: [
      'Identification des mesures de sécurité',
      'Priorisation selon le risque résiduel',
      'Plan d\'action et échéancier',
      'Stratégie de surveillance continue'
    ],
    icon: Settings,
    color: 'bg-green-500'
  }
];

const EbiosOnboarding: React.FC<EbiosOnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentOnboardingStep = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete?.();
    onClose();
  };

  const StepIcon = currentOnboardingStep.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${currentOnboardingStep.color}`}>
              <StepIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentOnboardingStep.title}
              </h2>
              <p className="text-sm text-gray-500">
                {isFirstStep ? 'Introduction' : `Étape ${currentStep} sur 5`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Intro</span>
            <span className="text-xs text-gray-500">Atelier 1</span>
            <span className="text-xs text-gray-500">Atelier 2</span>
            <span className="text-xs text-gray-500">Atelier 3</span>
            <span className="text-xs text-gray-500">Atelier 4</span>
            <span className="text-xs text-gray-500">Atelier 5</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-4">
              {currentOnboardingStep.description}
            </p>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">
              {isFirstStep ? 'Pourquoi EBIOS RM ?' : 'Objectifs de cet atelier :'}
            </h3>
            <ul className="space-y-3">
              {currentOnboardingStep.details.map((detail, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Methodology Flow (only on intro) */}
          {isFirstStep && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-blue-900 mb-4">
                Le processus EBIOS RM en 5 étapes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {onboardingSteps.slice(1).map((step, index) => (
                  <div key={step.id} className="text-center">
                    <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-2`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      Atelier {index + 1}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {step.title.split(' - ')[1]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workshop specific guidance */}
          {!isFirstStep && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-yellow-900 mb-2">
                💡 Conseil pratique
              </h4>
              <p className="text-sm text-yellow-800">
                {currentStep === 1 && "Commencez par bien définir votre périmètre. Un cadrage précis est essentiel pour la suite de l'analyse."}
                {currentStep === 2 && "Utilisez le catalogue EBIOS RM des sources de risque. Adaptez-le à votre contexte spécifique."}
                {currentStep === 3 && "Concentrez-vous sur les scénarios les plus vraisemblables et ayant le plus d'impact."}
                {currentStep === 4 && "Détaillez suffisamment pour identifier les points de contrôle et détection."}
                {currentStep === 5 && "Priorisez les mesures selon le ratio coût/efficacité et l'urgence."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Précédent</span>
          </Button>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleComplete}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Passer l'introduction
            </button>
            
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>{isLastStep ? 'Commencer' : 'Suivant'}</span>
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbiosOnboarding; 
/**
 * Tutoriel guidé pour le Workshop 1 EBIOS RM
 * Guide pas-à-pas pour les nouveaux utilisateurs
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle, Info, Target, Database, Server, Shield } from 'lucide-react';
import Button from '../ui/button';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  action?: string;
  highlight?: string;
}

interface Workshop1TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onStepComplete?: (stepId: string) => void;
}

const Workshop1Tutorial: React.FC<Workshop1TutorialProps> = ({
  isOpen,
  onClose,
  onStepComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue dans l\'Atelier 1 EBIOS RM',
      content: 'Cet atelier vous guide dans le cadrage de votre analyse de risque selon la méthodologie ANSSI EBIOS RM v1.5. Vous allez identifier vos valeurs métier, leurs actifs supports et les événements redoutés.',
      icon: Shield,
      action: 'Commencer le tutoriel'
    },
    {
      id: 'business-values',
      title: 'Étape 1 : Identifier les Valeurs Métier',
      content: 'Les valeurs métier représentent ce qui a de la valeur pour votre organisation. Classifiez-les en 3 catégories : Essentielles (mission critique), Primaires (importantes) et Support (facilitatrices). Commencez par cliquer sur "Ajouter" dans la section Valeurs Métier.',
      icon: Database,
      action: 'Créer une valeur métier',
      highlight: 'business-values-section'
    },
    {
      id: 'dreaded-events',
      title: 'Étape 2 : Définir les Événements Redoutés',
      content: 'Pour chaque valeur métier, identifiez ce que vous craignez qu\'il arrive. Les événements redoutés décrivent les impacts sur la disponibilité, intégrité, confidentialité, authenticité ou non-répudiation. L\'IA vous proposera des suggestions basées sur les référentiels ISO 27002, NIST et CIS.',
      icon: Target,
      action: 'Définir un événement redouté',
      highlight: 'dreaded-events-section'
    },
    {
      id: 'supporting-assets',
      title: 'Étape 3 : Cartographier les Actifs Supports',
      content: 'Les actifs supports sont les éléments techniques, organisationnels ou physiques qui permettent aux valeurs métier d\'exister. Identifiez les serveurs, applications, données, processus et personnes qui supportent chaque valeur métier.',
      icon: Server,
      action: 'Ajouter un actif support',
      highlight: 'supporting-assets-section'
    },
    {
      id: 'ai-suggestions',
      title: 'Étape 4 : Utiliser les Suggestions IA',
      content: 'L\'assistant IA analyse vos données et propose des suggestions enrichies basées sur les référentiels de sécurité internationaux. Ces suggestions incluent des recommandations ISO 27002, NIST CSF et CIS Controls pour améliorer votre analyse.',
      icon: Info,
      action: 'Explorer les suggestions IA'
    },
    {
      id: 'validation',
      title: 'Étape 5 : Validation et Progression',
      content: 'Le tableau de bord d\'avancement vous indique votre progression selon les critères ANSSI. Assurez-vous que tous les critères requis sont satisfaits avant de passer à l\'Atelier 2. La validation a été durcie pour garantir la qualité de votre analyse.',
      icon: CheckCircle,
      action: 'Vérifier la validation'
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      onStepComplete?.(currentStepData.id);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Marquer le tutoriel comme terminé
    localStorage.setItem('workshop1-tutorial-completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Étape {currentStep + 1} sur {tutorialSteps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progression</span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Contenu de l'étape */}
          <div className="mb-8">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.content}
              </p>
            </div>

            {/* Highlight de la section concernée */}
            {currentStepData.highlight && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Regardez la section "{currentStepData.highlight}" dans l'interface
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </Button>

            <div className="flex items-center space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < tutorialSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Terminer</span>
              </Button>
            )}
          </div>

          {/* Action suggérée */}
          {currentStepData.action && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  Action suggérée : {currentStepData.action}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Fermer le tutoriel temporairement pour permettre l'action
                    onClose();
                  }}
                >
                  Essayer maintenant
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workshop1Tutorial;

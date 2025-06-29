import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, BookOpen } from 'lucide-react';
import Button from '@/components/ui/button';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isRequired?: boolean;
  isCompleted?: boolean;
  canSkip?: boolean;
  helpContent?: React.ReactNode;
  validationRules?: () => { isValid: boolean; errors: string[] };
}

interface StepWizardProps {
  steps: WizardStep[];
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onComplete: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  showProgress?: boolean;
  allowSkipSteps?: boolean;
  className?: string;
}

const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  currentStepId,
  onStepChange,
  onComplete,
  onCancel,
  children,
  title = "Assistant de Configuration",
  subtitle = "Suivez les étapes pour compléter votre configuration",
  isLoading = false,
  showProgress = true,
  allowSkipSteps = false,
  className = ""
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Calculer la progression
  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // Valider l'étape actuelle
  useEffect(() => {
    if (currentStep && currentStep.validationRules) {
      const validation = currentStep.validationRules();
      setValidationErrors(validation.errors);
    } else {
      setValidationErrors([]);
    }
  }, [currentStep, currentStepId]);

  const canProceedToNext = () => {
    if (!currentStep) return false;
    
    // Si l'étape a des règles de validation
    if (currentStep.validationRules) {
      const validation = currentStep.validationRules();
      return validation.isValid;
    }
    
    // Si l'étape peut être ignorée
    if (currentStep.canSkip && allowSkipSteps) {
      return true;
    }
    
    // Si l'étape est requise, elle doit être complétée
    if (currentStep.isRequired) {
      return currentStep.isCompleted;
    }
    
    return true;
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else if (canProceedToNext()) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        onStepChange(nextStep.id);
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1];
      if (prevStep) {
        onStepChange(prevStep.id);
      }
    }
  };

  const handleStepClick = (stepId: string, stepIndex: number) => {
    // Permettre de naviguer vers les étapes précédentes ou complétées
    if (stepIndex <= currentStepIndex || steps[stepIndex].isCompleted) {
      onStepChange(stepId);
    }
  };

  const getStepStatus = (step: WizardStep, index: number) => {
    if (step.isCompleted) return 'completed';
    if (index === currentStepIndex) return 'current';
    if (index < currentStepIndex) return 'accessible';
    return 'disabled';
  };

  const getStepIcon = (step: WizardStep, index: number) => {
    const status = getStepStatus(step, index);
    
    if (status === 'completed') {
      return <Check className="h-4 w-4 text-white" />;
    }
    
    if (status === 'current' && validationErrors.length > 0) {
      return <AlertCircle className="h-4 w-4 text-white" />;
    }
    
    return <span className="text-sm font-medium">{index + 1}</span>;
  };

  const getStepColor = (step: WizardStep, index: number) => {
    const status = getStepStatus(step, index);
    
    switch (status) {
      case 'completed':
        return 'bg-green-600 border-green-600';
      case 'current':
        return validationErrors.length > 0 
          ? 'bg-red-600 border-red-600' 
          : 'bg-blue-600 border-blue-600';
      case 'accessible':
        return 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50';
      default:
        return 'bg-white border-gray-300 text-gray-400';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          {currentStep?.helpContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center space-x-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>Aide</span>
            </Button>
          )}
        </div>

        {/* Aide contextuelle */}
        {showHelp && currentStep?.helpContent && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            {currentStep.helpContent}
          </div>
        )}

        {/* Barre de progression */}
        {showProgress && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <span>{completedSteps}/{steps.length} étapes complétées</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation par étapes */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step, index);
              const isClickable = status === 'accessible' || status === 'completed' || status === 'current';
              
              return (
                <li key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => isClickable && handleStepClick(step.id, index)}
                      disabled={!isClickable}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        getStepColor(step, index)
                      } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      {getStepIcon(step, index)}
                    </button>
                    <div className="mt-2 text-center">
                      <div className={`text-xs font-medium ${
                        status === 'current' ? 'text-blue-600' :
                        status === 'completed' ? 'text-green-600' :
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      {step.description && (
                        <div className="text-xs text-gray-400 mt-1">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Connecteur */}
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Contenu de l'étape */}
      <div className="px-6 py-6">
        {/* Titre de l'étape actuelle */}
        {currentStep && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {currentStep.title}
            </h3>
            {currentStep.description && (
              <p className="text-sm text-gray-600 mt-1">
                {currentStep.description}
              </p>
            )}
            {currentStep.isRequired && (
              <p className="text-xs text-orange-600 mt-1">
                * Cette étape est obligatoire
              </p>
            )}
          </div>
        )}

        {/* Erreurs de validation */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h4 className="text-sm font-medium text-red-800">
                Veuillez corriger les erreurs suivantes :
              </h4>
            </div>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Contenu principal */}
        <div className="space-y-6">
          {children}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep?.canSkip && allowSkipSteps && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Ignorer cette étape
              </button>
            )}
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading || !canProceedToNext()}
              className="flex items-center space-x-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Terminer</span>
                </>
              ) : (
                <>
                  <span>Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepWizard; 
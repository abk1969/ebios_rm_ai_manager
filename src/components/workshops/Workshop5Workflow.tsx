import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Brain,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Target
} from 'lucide-react';
import Button from '../ui/button';
import type { SecurityMeasure, StrategicScenario } from '../../types/ebios';

interface Workshop5WorkflowProps {
  currentStep: WorkflowStep;
  strategicScenarios: StrategicScenario[];
  securityMeasures: SecurityMeasure[];
  onAddMeasure: () => void;
  onValidateWithAI: () => void;
  onGeneratePlan: () => void;
  isGeneratingPlan?: boolean;
}

type WorkflowStep = 'overview' | 'add-measures' | 'validate' | 'plan' | 'complete';

const WORKFLOW_STEPS = [
  {
    id: 'overview' as WorkflowStep,
    title: 'Vue d\'ensemble',
    description: 'Analyser les données des ateliers précédents',
    icon: BarChart3,
    color: 'blue'
  },
  {
    id: 'add-measures' as WorkflowStep,
    title: 'Mesures de sécurité',
    description: 'Définir les mesures de traitement du risque',
    icon: Shield,
    color: 'green'
  },
  {
    id: 'validate' as WorkflowStep,
    title: 'Validation IA',
    description: 'Valider la cohérence avec l\'IA',
    icon: Brain,
    color: 'purple'
  },
  {
    id: 'plan' as WorkflowStep,
    title: 'Plan d\'action',
    description: 'Générer le plan de traitement',
    icon: Target,
    color: 'orange'
  },
  {
    id: 'complete' as WorkflowStep,
    title: 'Finalisation',
    description: 'Révision et validation finale',
    icon: CheckCircle,
    color: 'emerald'
  }
];

const Workshop5Workflow: React.FC<Workshop5WorkflowProps> = ({
  currentStep,
  strategicScenarios,
  securityMeasures,
  onAddMeasure,
  onValidateWithAI,
  onGeneratePlan,
  isGeneratingPlan = false
}) => {
  const [localCurrentStep, setLocalCurrentStep] = useState<WorkflowStep>(currentStep);

  // Synchroniser l'état local avec la prop
  useEffect(() => {
    setLocalCurrentStep(currentStep);
  }, [currentStep]);

  const getCurrentStepIndex = () => WORKFLOW_STEPS.findIndex(step => step.id === localCurrentStep);
  const canGoNext = () => {
    switch (localCurrentStep) {
      case 'overview':
        return strategicScenarios.length > 0;
      case 'add-measures':
        return securityMeasures.length > 0;
      case 'validate':
        return securityMeasures.length > 0;
      case 'plan':
        return true;
      case 'complete':
        return false;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < WORKFLOW_STEPS.length - 1 && canGoNext()) {
      setLocalCurrentStep(WORKFLOW_STEPS[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setLocalCurrentStep(WORKFLOW_STEPS[currentIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    switch (localCurrentStep) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Données disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Scénarios stratégiques</span>
                    <span className={`text-lg font-bold ${strategicScenarios.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {strategicScenarios.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {strategicScenarios.length > 0 ? 'Prêt pour l\'analyse' : 'Complétez les ateliers 1-4'}
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Mesures définies</span>
                    <span className={`text-lg font-bold ${securityMeasures.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {securityMeasures.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Mesures de traitement du risque
                  </p>
                </div>
              </div>
            </div>
            
            {strategicScenarios.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    Prérequis manquants : Complétez d'abord les Ateliers 1-4
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 'add-measures':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-green-900">Mesures de sécurité</h3>
                <Button onClick={onAddMeasure} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Ajouter une mesure</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded border text-center">
                  <div className="text-2xl font-bold text-green-600">{securityMeasures.length}</div>
                  <div className="text-sm text-gray-600">Mesures définies</div>
                </div>
                <div className="bg-white p-4 rounded border text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {securityMeasures.filter(m => m.type === 'preventive').length}
                  </div>
                  <div className="text-sm text-gray-600">Préventives</div>
                </div>
                <div className="bg-white p-4 rounded border text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {securityMeasures.filter(m => m.type === 'detective').length}
                  </div>
                  <div className="text-sm text-gray-600">Détectives</div>
                </div>
              </div>

              {securityMeasures.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucune mesure définie</h4>
                  <p className="text-gray-600 mb-4">Commencez par ajouter des mesures de traitement du risque</p>
                  <Button onClick={onAddMeasure} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter la première mesure</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'validate':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-900">Validation IA</h3>
                <Button 
                  onClick={onValidateWithAI} 
                  disabled={securityMeasures.length === 0}
                  className="flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>Lancer la validation</span>
                </Button>
              </div>
              
              <p className="text-sm text-purple-800 mb-4">
                L'IA analysera la cohérence de vos mesures avec les scénarios stratégiques identifiés.
              </p>

              {securityMeasures.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      Ajoutez d'abord des mesures de sécurité pour pouvoir les valider
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-6">
            {/* Message d'aide contextuel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Comment utiliser cette étape ?</h4>
                  <p className="text-sm text-blue-800">
                    Cette étape génère automatiquement un plan de traitement des risques basé sur vos mesures de sécurité
                    et scénarios stratégiques. Le plan respecte la méthodologie EBIOS RM et inclut les priorités,
                    échéances et responsabilités.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-orange-900">Plan d'action</h3>
                <Button
                  onClick={onGeneratePlan}
                  disabled={securityMeasures.length === 0 || isGeneratingPlan}
                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 text-base disabled:opacity-50"
                  title={securityMeasures.length === 0 ? "Ajoutez d'abord des mesures de sécurité" : "Générer le plan de traitement automatique avec l'IA"}
                >
                  {isGeneratingPlan ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>🤖 Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <Target className="h-5 w-5" />
                      <span>🚀 Générer le Plan Automatique</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">À quoi sert ce bouton ?</h4>
                  <p className="text-sm text-orange-800 mb-3">
                    Le bouton "Générer le plan" utilise l'intelligence artificielle pour créer automatiquement
                    un plan de traitement des risques structuré selon la méthodologie EBIOS RM. Ce plan inclut :
                  </p>
                  <ul className="text-sm text-orange-700 space-y-1 ml-4">
                    <li>• Priorisation des mesures selon le niveau de risque</li>
                    <li>• Échéancier de mise en œuvre</li>
                    <li>• Estimation des coûts et ressources</li>
                    <li>• Responsabilités et indicateurs de suivi</li>
                  </ul>
                </div>

                {isGeneratingPlan ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-blue-800 font-medium">
                        🤖 L'IA analyse vos données et génère le plan de traitement...
                      </p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Analyse des {securityMeasures.length} mesures et {strategicScenarios.length} scénarios en cours
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-orange-800 font-medium">
                    ⚡ Cliquez sur "Générer le plan" pour créer votre plan de traitement automatique
                  </p>
                )}

                {securityMeasures.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Mesures de sécurité requises</p>
                        <p className="text-yellow-700 mt-1">
                          Vous devez d'abord définir des mesures de sécurité avant de pouvoir générer un plan de traitement.
                        </p>
                        <Button
                          onClick={onAddMeasure}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une mesure
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        {securityMeasures.length} mesure{securityMeasures.length > 1 ? 's' : ''} de sécurité définie{securityMeasures.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Vous pouvez maintenant générer le plan de traitement automatique.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
                <h3 className="text-lg font-medium text-emerald-900">Atelier 5 terminé</h3>
              </div>
              
              <p className="text-sm text-emerald-800 mb-4">
                Votre plan de traitement du risque est prêt. Vous pouvez maintenant générer le rapport final EBIOS RM.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Progress bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-900">Workflow Atelier 5</h2>
          <span className="text-sm text-gray-500">
            Étape {getCurrentStepIndex() + 1} sur {WORKFLOW_STEPS.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {WORKFLOW_STEPS.map((step, index) => {
            const isActive = step.id === localCurrentStep;
            const isCompleted = index < getCurrentStepIndex();
            const Icon = step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors ${
                    isActive
                      ? step.color === 'blue' ? 'border-blue-500 bg-blue-500 text-white' :
                        step.color === 'green' ? 'border-green-500 bg-green-500 text-white' :
                        step.color === 'purple' ? 'border-purple-500 bg-purple-500 text-white' :
                        step.color === 'orange' ? 'border-orange-500 bg-orange-500 text-white' :
                        'border-emerald-500 bg-emerald-500 text-white'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                  onClick={() => setLocalCurrentStep(step.id)}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {WORKFLOW_STEPS.find(s => s.id === localCurrentStep)?.title}
          </h3>
          <p className="text-gray-600">
            {WORKFLOW_STEPS.find(s => s.id === localCurrentStep)?.description}
          </p>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={getCurrentStepIndex() === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Précédent</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canGoNext() || getCurrentStepIndex() === WORKFLOW_STEPS.length - 1}
          className="flex items-center space-x-2"
        >
          <span>Suivant</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Workshop5Workflow;

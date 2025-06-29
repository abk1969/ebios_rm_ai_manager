import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Target,
  ArrowRight,
  Info,
  Lightbulb,
  FileText,
  Clock,
  Users
} from 'lucide-react';
import Button from '../ui/button';
import type { SecurityMeasure, StrategicScenario } from '../../types/ebios';

interface Workshop5UnifiedProps {
  strategicScenarios: StrategicScenario[];
  securityMeasures: SecurityMeasure[];
  treatmentPlan: string;
  isGeneratingPlan: boolean;
  onAddMeasure: () => void;
  onGeneratePlan: () => void;
}

interface WorkshopStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isCompleted: boolean;
  isBlocked: boolean;
  requirements: string[];
  action?: () => void;
  actionLabel?: string;
}

const Workshop5Unified: React.FC<Workshop5UnifiedProps> = ({
  strategicScenarios,
  securityMeasures,
  treatmentPlan,
  isGeneratingPlan,
  onAddMeasure,
  onGeneratePlan
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Définition des étapes du workflow
  const steps: WorkshopStep[] = [
    {
      id: 'prerequisites',
      title: 'Vérification des Prérequis',
      description: 'Vérifier que les ateliers précédents sont complétés',
      icon: CheckCircle,
      isCompleted: strategicScenarios.length > 0,
      isBlocked: false,
      requirements: [
        'Scénarios stratégiques des ateliers 1-4',
        'Au moins 1 scénario avec niveau de risque ≥ 3'
      ]
    },
    {
      id: 'measures',
      title: 'Définition des Mesures',
      description: 'Ajouter les mesures de sécurité pour traiter les risques',
      icon: Shield,
      isCompleted: securityMeasures.length >= 2,
      isBlocked: strategicScenarios.length === 0,
      requirements: [
        'Au moins 2 mesures de sécurité',
        'Mesures préventives, détectives et correctives',
        'Priorités et coûts définis'
      ],
      action: onAddMeasure,
      actionLabel: 'Ajouter une mesure'
    },
    {
      id: 'generation',
      title: 'Génération du Plan',
      description: 'Créer automatiquement le plan de traitement avec l\'IA',
      icon: Brain,
      isCompleted: treatmentPlan.length > 0,
      isBlocked: securityMeasures.length < 2 || strategicScenarios.length === 0,
      requirements: [
        'Plan de traitement généré par l\'IA',
        'Priorités calculées selon EBIOS RM',
        'Échéancier et responsabilités définis'
      ],
      action: onGeneratePlan,
      actionLabel: isGeneratingPlan ? 'Génération en cours...' : 'Générer le Plan de Traitement'
    },
    {
      id: 'validation',
      title: 'Validation Finale',
      description: 'Réviser et valider le plan de traitement',
      icon: Target,
      isCompleted: treatmentPlan.length > 0,
      isBlocked: treatmentPlan.length === 0,
      requirements: [
        'Plan de traitement validé',
        'Mesures priorisées et planifiées',
        'Atelier 5 complété'
      ]
    }
  ];

  const currentStep = steps[currentStepIndex];
  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const canProceedToNext = () => {
    return currentStep.isCompleted && currentStepIndex < steps.length - 1;
  };

  const canGoToPrevious = () => {
    return currentStepIndex > 0;
  };

  const nextStep = () => {
    if (canProceedToNext()) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (canGoToPrevious()) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getStepStatus = (step: WorkshopStep) => {
    if (step.isCompleted) return 'completed';
    if (step.isBlocked) return 'blocked';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-300';
      case 'blocked': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-blue-600 bg-blue-100 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* En-tête avec progression */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workshop 5 - Plan de Traitement</h1>
            <p className="text-gray-600">Définissez votre stratégie de traitement des risques selon EBIOS RM</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{completedSteps}/{steps.length}</div>
            <div className="text-sm text-gray-500">étapes complétées</div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progression globale</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Indicateurs d'étapes */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(step);
            const isActive = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                    isActive ? 'ring-2 ring-blue-300 ring-offset-2' : ''
                  } ${getStepColor(status)}`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded ${
                    step.isCompleted ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenu de l'étape actuelle */}
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-lg ${getStepColor(getStepStatus(currentStep))}`}>
              <currentStep.icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentStep.title}</h2>
              <p className="text-gray-600">{currentStep.description}</p>
            </div>
          </div>

          {/* État de l'étape */}
          <div className={`p-4 rounded-lg border ${getStepColor(getStepStatus(currentStep))}`}>
            {currentStep.isCompleted ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Étape complétée</span>
              </div>
            ) : currentStep.isBlocked ? (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Étape bloquée - Prérequis manquants</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">En attente de completion</span>
              </div>
            )}
          </div>
        </div>

        {/* Exigences de l'étape */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Exigences pour cette étape :</h3>
          <ul className="space-y-2">
            {currentStep.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contenu spécifique à l'étape */}
        {currentStep.id === 'prerequisites' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Scénarios stratégiques</span>
                  <span className={`text-2xl font-bold ${strategicScenarios.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {strategicScenarios.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {strategicScenarios.length > 0 ? 'Prêt pour l\'analyse' : 'Complétez les ateliers 1-4'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Niveau de risque max</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {strategicScenarios.length > 0 ? Math.max(...strategicScenarios.map(s =>
                      typeof s.riskLevel === 'number' ? s.riskLevel :
                      s.riskLevel === 'low' ? 1 :
                      s.riskLevel === 'medium' ? 2 :
                      s.riskLevel === 'high' ? 3 :
                      s.riskLevel === 'critical' ? 4 : 1
                    )) : 0}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Risque le plus élevé identifié
                </p>
              </div>
            </div>
            
            {strategicScenarios.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Prérequis manquants</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Vous devez compléter les ateliers 1-4 pour avoir des scénarios stratégiques à traiter.
                    </p>
                    <Button
                      onClick={() => window.location.href = `/workshops/${window.location.pathname.split('/')[2]}/4`}
                      variant="outline"
                      size="sm"
                      className="mt-3 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                    >
                      Aller à l'Atelier 4
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep.id === 'measures' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{securityMeasures.length}</div>
                <div className="text-sm text-gray-600">Mesures définies</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {securityMeasures.filter(m => m.type === 'preventive').length}
                </div>
                <div className="text-sm text-gray-600">Préventives</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {securityMeasures.filter(m => m.type === 'detective').length}
                </div>
                <div className="text-sm text-gray-600">Détectives</div>
              </div>
            </div>

            {securityMeasures.length < 2 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Conseils pour définir les mesures</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Commencez par les mesures préventives (authentification, chiffrement)</li>
                      <li>• Ajoutez des mesures détectives (monitoring, logs)</li>
                      <li>• Complétez avec des mesures correctives (sauvegarde, plan de continuité)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep.id === 'generation' && (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Génération automatique du plan</h4>
              <p className="text-sm text-orange-800 mb-3">
                L'IA va analyser vos {securityMeasures.length} mesures de sécurité et {strategicScenarios.length} scénarios 
                stratégiques pour créer un plan de traitement structuré selon EBIOS RM.
              </p>
              <div className="text-sm text-orange-700">
                <strong>Le plan inclura :</strong>
                <ul className="mt-1 ml-4 space-y-1">
                  <li>• Priorisation des mesures selon le niveau de risque</li>
                  <li>• Échéancier de mise en œuvre</li>
                  <li>• Estimation des coûts et ressources</li>
                  <li>• Responsabilités et indicateurs de suivi</li>
                </ul>
              </div>
            </div>

            {isGeneratingPlan && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Génération en cours...</h4>
                    <p className="text-sm text-blue-700">L'IA analyse vos données et génère le plan de traitement</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep.id === 'validation' && treatmentPlan && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Plan de traitement généré avec succès</h4>
              </div>
              <p className="text-sm text-green-700">
                Votre plan de traitement est prêt. Vous pouvez maintenant passer à la génération du rapport final EBIOS RM.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Aperçu du plan généré</h4>
              <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {treatmentPlan.substring(0, 200)}...
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Action principale de l'étape */}
        {currentStep.action && !currentStep.isCompleted && !currentStep.isBlocked && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Action requise</h4>
                <p className="text-sm text-gray-600">Cliquez pour compléter cette étape</p>
              </div>
              <Button
                onClick={currentStep.action}
                disabled={isGeneratingPlan && currentStep.id === 'generation'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3"
              >
                {currentStep.actionLabel}
              </Button>
            </div>
          </div>
        )}

        {/* Guide d'utilisation */}
        {currentStepIndex === 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-2">🎯 Comment utiliser le Workshop 5 ?</h4>
                <div className="text-sm text-green-800 space-y-2">
                  <p><strong>1. Parcours linéaire :</strong> Suivez les étapes dans l'ordre (1→2→3→4)</p>
                  <p><strong>2. Un seul bouton d'action :</strong> Plus de confusion, une seule action par étape</p>
                  <p><strong>3. Validation progressive :</strong> Chaque étape doit être complétée pour passer à la suivante</p>
                  <p><strong>4. Feedback clair :</strong> Voyez votre progression en temps réel</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <Button
            onClick={previousStep}
            disabled={!canGoToPrevious()}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span>Étape précédente</span>
          </Button>

          <div className="text-sm text-gray-500">
            Étape {currentStepIndex + 1} sur {steps.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={!canProceedToNext()}
            className="flex items-center space-x-2"
          >
            <span>Étape suivante</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Workshop5Unified;

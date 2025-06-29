import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Shield, 
  Target, 
  Brain, 
  AlertTriangle,
  Info,
  Plus,
  BookOpen,
  Lightbulb,
  FileText
} from 'lucide-react';
import Button from '../ui/button';
import type { SecurityMeasure, StrategicScenario } from '../../types/ebios';

interface Workshop5GuideProps {
  securityMeasures: SecurityMeasure[];
  strategicScenarios: StrategicScenario[];
  treatmentPlan: string;
  onAddMeasure: () => void;
  onGeneratePlan: () => void;
  isGeneratingPlan: boolean;
}

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isCompleted: boolean;
  isBlocked: boolean;
  action?: () => void;
  actionLabel?: string;
  requirements?: string[];
  tips?: string[];
  blockingReason?: string;
}

const Workshop5Guide: React.FC<Workshop5GuideProps> = ({
  securityMeasures,
  strategicScenarios,
  treatmentPlan,
  onAddMeasure,
  onGeneratePlan,
  isGeneratingPlan
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>('step1');

  // Calcul de l'état des étapes
  const steps: Step[] = [
    {
      id: 'step1',
      title: 'Définir les Mesures de Sécurité',
      description: 'Identifiez et configurez les mesures pour traiter les risques identifiés',
      icon: Shield,
      isCompleted: securityMeasures.length >= 2,
      isBlocked: strategicScenarios.length === 0,
      action: onAddMeasure,
      actionLabel: 'Ajouter une mesure',
      requirements: [
        'Au moins 2 mesures de sécurité définies',
        'Mesures alignées avec les scénarios stratégiques',
        'Priorités et coûts évalués'
      ],
      tips: [
        '💡 Commencez par les mesures préventives (authentification, chiffrement)',
        '💡 Ajoutez des mesures détectives (monitoring, logs)',
        '💡 Complétez avec des mesures correctives (sauvegarde, plan de continuité)'
      ],
      blockingReason: strategicScenarios.length === 0 ? 'Complétez d\'abord les ateliers 1-4 pour avoir des scénarios stratégiques' : undefined
    },
    {
      id: 'step2',
      title: 'Générer le Plan de Traitement',
      description: 'Créez automatiquement un plan structuré avec l\'IA EBIOS RM',
      icon: Brain,
      isCompleted: treatmentPlan.length > 0,
      isBlocked: securityMeasures.length === 0 || strategicScenarios.length === 0,
      action: onGeneratePlan,
      actionLabel: isGeneratingPlan ? 'Génération...' : 'Générer le plan',
      requirements: [
        'Plan de traitement généré par l\'IA',
        'Priorités définies selon EBIOS RM',
        'Échéances et responsabilités assignées'
      ],
      tips: [
        '💡 Le plan est généré selon la méthodologie EBIOS RM officielle',
        '💡 Les priorités sont calculées selon le niveau de risque',
        '💡 Vous pouvez régénérer le plan après avoir ajouté des mesures'
      ],
      blockingReason: securityMeasures.length === 0 ? 'Ajoutez d\'abord des mesures de sécurité' : 
                     strategicScenarios.length === 0 ? 'Complétez d\'abord les ateliers 1-4' : undefined
    },
    {
      id: 'step3',
      title: 'Valider et Finaliser',
      description: 'Vérifiez la complétude et validez votre stratégie de traitement',
      icon: Target,
      isCompleted: treatmentPlan.length > 0 && securityMeasures.length >= 2,
      isBlocked: treatmentPlan.length === 0,
      requirements: [
        'Plan de traitement validé',
        'Mesures de sécurité complètes',
        'Stratégie de traitement finalisée'
      ],
      tips: [
        '💡 Vérifiez que toutes les mesures sont réalisables',
        '💡 Assurez-vous que les échéances sont réalistes',
        '💡 Préparez la présentation aux parties prenantes'
      ],
      blockingReason: treatmentPlan.length === 0 ? 'Générez d\'abord le plan de traitement' : undefined
    }
  ];

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getNextStep = () => {
    return steps.find(step => !step.isCompleted && !step.isBlocked);
  };

  const nextStep = getNextStep();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Guide Workshop 5</h2>
              <p className="text-sm text-gray-600">Stratégie de traitement des risques</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{completedSteps}/3</div>
            <div className="text-sm text-gray-500">étapes complétées</div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progression</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Prochaine étape recommandée */}
        {nextStep && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-purple-900">Prochaine étape recommandée</h3>
                <p className="text-sm text-purple-700 mt-1">{nextStep.description}</p>
                {nextStep.action && (
                  <Button
                    onClick={nextStep.action}
                    className="mt-3"
                    size="sm"
                    disabled={isGeneratingPlan && nextStep.id === 'step2'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {nextStep.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prérequis manquants */}
        {strategicScenarios.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900">Prérequis manquants</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Le Workshop 5 nécessite des scénarios stratégiques des ateliers précédents.
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

        {/* Liste des étapes */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === step.id;
            
            return (
              <div key={step.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {step.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : step.isBlocked ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-500">
                        Étape {index + 1}
                      </span>
                    </div>
                    <Icon className={`h-5 w-5 ${
                      step.isCompleted ? 'text-green-600' : 
                      step.isBlocked ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`font-medium ${
                      step.isCompleted ? 'text-green-900' : 
                      step.isBlocked ? 'text-yellow-900' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    {/* Raison de blocage */}
                    {step.isBlocked && step.blockingReason && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <p className="text-sm text-yellow-800">{step.blockingReason}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Exigences */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Exigences :</h4>
                      <ul className="space-y-1">
                        {step.requirements?.map((req, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Conseils */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Conseils :</h4>
                      <ul className="space-y-1">
                        {step.tips?.map((tip, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action */}
                    {step.action && !step.isCompleted && !step.isBlocked && (
                      <Button
                        onClick={step.action}
                        className="w-full"
                        disabled={isGeneratingPlan && step.id === 'step2'}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {step.actionLabel}
                      </Button>
                    )}

                    {step.isCompleted && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Étape complétée</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Message de félicitations */}
        {completedSteps === steps.length && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Félicitations !</h3>
                <p className="text-sm text-green-700">
                  Vous avez complété le Workshop 5. Votre stratégie de traitement des risques 
                  est maintenant définie selon la méthodologie EBIOS RM.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshop5Guide;

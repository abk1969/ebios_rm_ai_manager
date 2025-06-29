import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Database, 
  AlertTriangle, 
  Server, 
  Info,
  Target,
  Plus,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import Button from '../ui/button';
import type { BusinessValue, DreadedEvent, SupportingAsset } from '../../types/ebios';

interface Workshop1GuideProps {
  businessValues: BusinessValue[];
  dreadedEvents: DreadedEvent[];
  supportingAssets: SupportingAsset[];
  onAddBusinessValue: () => void;
  onAddDreadedEvent: (businessValueId: string) => void;
  onAddSupportingAsset: (businessValueId: string) => void;
}

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isCompleted: boolean;
  action?: () => void;
  actionLabel?: string;
  requirements?: string[];
  tips?: string[];
}

const Workshop1Guide: React.FC<Workshop1GuideProps> = ({
  businessValues,
  dreadedEvents,
  supportingAssets,
  onAddBusinessValue,
  onAddDreadedEvent,
  onAddSupportingAsset
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>('step1');

  // Calcul de l'état des étapes
  const steps: Step[] = [
    {
      id: 'step1',
      title: 'Identifier les Valeurs Métier',
      description: 'Définissez ce qui a de la valeur pour votre organisation (processus, informations, services)',
      icon: Database,
      isCompleted: businessValues.length >= 2,
      action: onAddBusinessValue,
      actionLabel: 'Ajouter une valeur métier',
      requirements: [
        'Au moins 2 valeurs métier principales',
        'Description claire de chaque valeur',
        'Catégorisation appropriée (primaire, support, management)'
      ],
      tips: [
        '💡 Commencez par les processus cœur de métier',
        '💡 Pensez aux informations critiques (données clients, financières)',
        '💡 N\'oubliez pas les services essentiels à votre activité'
      ]
    },
    {
      id: 'step2',
      title: 'Définir les Événements Redoutés',
      description: 'Identifiez ce que vous craignez qu\'il arrive à vos valeurs métier',
      icon: AlertTriangle,
      isCompleted: dreadedEvents.length >= businessValues.length,
      action: businessValues.length > 0 ? () => onAddDreadedEvent(businessValues[0].id) : undefined,
      actionLabel: 'Ajouter un événement redouté',
      requirements: [
        'Au moins 1 événement redouté par valeur métier',
        'Impact clairement défini',
        'Gravité évaluée selon l\'échelle EBIOS RM'
      ],
      tips: [
        '💡 Pensez aux impacts sur la disponibilité, intégrité, confidentialité',
        '💡 Considérez les conséquences business (financières, réputation, légales)',
        '💡 Utilisez l\'échelle de gravité EBIOS RM (1-4)'
      ]
    },
    {
      id: 'step3',
      title: 'Cartographier les Actifs Supports',
      description: 'Identifiez les éléments techniques et organisationnels qui supportent vos valeurs métier',
      icon: Server,
      isCompleted: supportingAssets.length >= businessValues.length,
      action: businessValues.length > 0 ? () => onAddSupportingAsset(businessValues[0].id) : undefined,
      actionLabel: 'Ajouter un actif support',
      requirements: [
        'Au moins 1 actif support par valeur métier',
        'Classification de sécurité appropriée',
        'Type d\'actif correctement défini'
      ],
      tips: [
        '💡 Incluez matériel, logiciels, données, personnel, sites',
        '💡 Pensez aux dépendances entre actifs',
        '💡 Classifiez selon le niveau de sensibilité'
      ]
    }
  ];

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getNextStep = () => {
    return steps.find(step => !step.isCompleted);
  };

  const nextStep = getNextStep();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Guide Workshop 1</h2>
              <p className="text-sm text-gray-600">Suivez ces étapes pour compléter l'atelier</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completedSteps}/3</div>
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
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Prochaine étape recommandée */}
        {nextStep && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">Prochaine étape recommandée</h3>
                <p className="text-sm text-blue-700 mt-1">{nextStep.description}</p>
                {nextStep.action && (
                  <Button
                    onClick={nextStep.action}
                    className="mt-3"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {nextStep.actionLabel}
                  </Button>
                )}
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
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-500">
                        Étape {index + 1}
                      </span>
                    </div>
                    <Icon className={`h-5 w-5 ${step.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                    <h3 className={`font-medium ${step.isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
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
                    {step.action && !step.isCompleted && (
                      <Button
                        onClick={step.action}
                        className="w-full"
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
                  Vous avez complété toutes les étapes du Workshop 1. 
                  Vous pouvez maintenant passer au Workshop 2.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshop1Guide;

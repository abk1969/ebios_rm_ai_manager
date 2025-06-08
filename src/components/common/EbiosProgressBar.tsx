import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, Target, AlertTriangle, Users, Shield, Settings, Lock } from 'lucide-react';
// import { useEbiosValidation } from '@/hooks/useEbiosValidation';

interface EbiosStep {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  locked: boolean;
}

// 🔧 CORRECTION: Types pour les résultats de validation
interface ValidationResult {
  criterion: string;
  evidence: string;
  met: boolean;
  required: boolean;
}

interface WorkshopProgress {
  completed: boolean;
  validationResults: ValidationResult[];
  completionPercentage: number;
  unlocksNext: boolean;
  locked?: boolean;
}

interface EbiosProgressBarProps {
  currentStep?: number;
  missionId?: string;
  steps?: EbiosStep[];
}

const defaultSteps: EbiosStep[] = [
  {
    id: 1,
    title: 'Cadrage et Valeurs Métier',
    shortTitle: 'Cadrage',
    description: 'Définition du périmètre et identification des valeurs métier',
    path: '/workshop-1',
    icon: Target,
    completed: false,
    locked: false
  },
  {
    id: 2,
    title: 'Sources de Risque',
    shortTitle: 'Sources',
    description: 'Identification et évaluation des sources de risque',
    path: '/workshop-2',
    icon: AlertTriangle,
    completed: false,
    locked: true
  },
  {
    id: 3,
    title: 'Scénarios Stratégiques',
    shortTitle: 'Stratégique',
    description: 'Construction des scénarios d\'attaque stratégiques',
    path: '/workshop-3',
    icon: Users,
    completed: false,
    locked: true
  },
  {
    id: 4,
    title: 'Scénarios Opérationnels',
    shortTitle: 'Opérationnel',
    description: 'Détaillage des techniques et chemins d\'attaque',
    path: '/workshop-4',
    icon: Shield,
    completed: false,
    locked: true
  },
  {
    id: 5,
    title: 'Plan de Traitement',
    shortTitle: 'Traitement',
    description: 'Définition des mesures de sécurité et plan d\'action',
    path: '/workshop-5',
    icon: Settings,
    completed: false,
    locked: true
  }
];

const EbiosProgressBar: React.FC<EbiosProgressBarProps> = ({ 
  currentStep = 1, 
  missionId,
  steps = defaultSteps 
}) => {
  const location = useLocation();
  // const { progressState, canAccessWorkshop, getNextRecommendedWorkshop } = useEbiosValidation(missionId);
  
  // 🔧 CORRECTION: Version simplifiée temporaire avec types explicites
  const progressState: Record<string, WorkshopProgress> = {
    workshop1: {
      completed: false,
      validationResults: [
        { criterion: 'Périmètre défini', evidence: 'Document de cadrage', met: true, required: true },
        { criterion: 'Valeurs métier identifiées', evidence: 'Inventaire des actifs', met: false, required: true }
      ] as ValidationResult[],
      completionPercentage: 50,
      unlocksNext: true
    },
    workshop2: {
      completed: false,
      validationResults: [] as ValidationResult[],
      completionPercentage: 0,
      unlocksNext: false,
      locked: true
    },
    workshop3: {
      completed: false,
      validationResults: [] as ValidationResult[],
      completionPercentage: 0,
      unlocksNext: false,
      locked: true
    },
    workshop4: {
      completed: false,
      validationResults: [] as ValidationResult[],
      completionPercentage: 0,
      unlocksNext: false,
      locked: true
    },
    workshop5: {
      completed: false,
      validationResults: [] as ValidationResult[],
      completionPercentage: 0,
      unlocksNext: false,
      locked: true
    }
  };
  
  const canAccessWorkshop = (workshopNumber: number) => {
    return workshopNumber === 1; // Seul l'atelier 1 est accessible pour l'instant
  };
  
  const getNextRecommendedWorkshop = () => 1;

  const getStepUrl = (step: EbiosStep) => {
    if (!missionId) return step.path;
    return `${step.path}?missionId=${missionId}`;
  };

  const isCurrentStep = (step: EbiosStep) => {
    return location.pathname === step.path || currentStep === step.id;
  };

  const getStepStatus = (step: EbiosStep) => {
    const workshopKey = `workshop${step.id}` as keyof typeof progressState;
    const workshopProgress = progressState[workshopKey];
    
    if (workshopProgress.completed) return 'completed';
    if (isCurrentStep(step)) return 'current';
    if (!canAccessWorkshop(step.id)) return 'locked';
    return 'available';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white border-green-600';
      case 'current':
        return 'bg-blue-600 text-white border-blue-600';
      case 'locked':
        return 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:border-blue-400';
    }
  };

  const getConnectorClasses = (step: EbiosStep, nextStep?: EbiosStep) => {
    if (!nextStep) return '';
    
    if (step.completed && nextStep.completed) {
      return 'bg-green-600';
    } else if (step.completed || isCurrentStep(step)) {
      return 'bg-blue-600';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête méthodologique */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Méthode EBIOS Risk Manager v1.5 - ANSSI
          </h2>
          <p className="text-sm text-gray-600">
            Suivez le processus structuré d'analyse des risques cyber
          </p>
        </div>

        {/* Barre de progression */}
        <nav aria-label="Progress" className="flex items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const StepIcon = step.icon;
            const nextStep = steps[index + 1];
            
            return (
              <React.Fragment key={step.id}>
                {/* Étape */}
                <div className="flex flex-col items-center relative">
                  {status === 'locked' ? (
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepClasses(status)}`}
                      title={`Atelier ${step.id} - ${step.title} (Verrouillé)`}
                    >
                      <Circle className="w-5 h-5" />
                    </div>
                  ) : (
                    <Link
                      to={getStepUrl(step)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getStepClasses(status)}`}
                      title={`Atelier ${step.id} - ${step.title}`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </Link>
                  )}
                  
                  {/* Label de l'étape */}
                  <div className="mt-2 text-center">
                    <span className={`text-xs font-medium ${
                      status === 'locked' ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      Atelier {step.id}
                    </span>
                    <div className={`text-xs ${
                      status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.shortTitle}
                    </div>
                  </div>

                  {/* Indicateur de progression */}
                  {isCurrentStep(step) && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        En cours
                      </div>
                    </div>
                  )}
                </div>

                {/* Connecteur */}
                {nextStep && (
                  <div className="flex-1 mx-4">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${getConnectorClasses(step, nextStep)}`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Description de l'étape actuelle avec validation EBIOS RM */}
        {currentStep && missionId && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900">
                Atelier {currentStep} : {steps[currentStep - 1]?.title}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {steps[currentStep - 1]?.description}
              </p>
              
              {/* Statut de validation */}
              {(() => {
                const workshopKey = `workshop${currentStep}` as keyof typeof progressState;
                const workshopProgress = progressState[workshopKey];
                
                if (workshopProgress?.validationResults?.length > 0) {
                  const completedCriteria = workshopProgress.validationResults.filter(v => v.met).length;
                  const totalCriteria = workshopProgress.validationResults.length;
                  const requiredCriteria = workshopProgress.validationResults.filter(v => v.required);
                  const unmetRequired = requiredCriteria.filter(v => !v.met);
                  
                  return (
                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-900">
                          Progression EBIOS RM
                        </span>
                        <span className="text-xs text-blue-700">
                          {completedCriteria}/{totalCriteria} critères satisfaits
                        </span>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-blue-100 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${workshopProgress.completionPercentage}%` }}
                        />
                      </div>
                      
                      {/* Prérequis manquants */}
                      {unmetRequired.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-orange-700 font-medium">
                            Prérequis manquants pour continuer :
                          </span>
                          <ul className="text-xs text-orange-600 mt-1 space-y-1">
                            {unmetRequired.map((req, index) => (
                              <li key={index} className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {req.criterion} ({req.evidence})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Recommandation */}
                      {workshopProgress.completed && (
                        <div className="mt-2 flex items-center text-xs text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Atelier complété - Vous pouvez continuer vers l'Atelier {currentStep + 1}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            
            {/* Atelier recommandé */}
            {(() => {
              const nextRecommended = getNextRecommendedWorkshop();
              if (nextRecommended !== currentStep) {
                return (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Atelier recommandé : <strong>Atelier {nextRecommended}</strong>
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default EbiosProgressBar; 
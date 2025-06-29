import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  Info,
  Target,
  Users,
  Route,
  Shield,
  Database
} from 'lucide-react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    type: 'click' | 'input' | 'navigate';
    target: string;
    value?: string;
  };
  validation?: () => boolean;
}

export interface GuideModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: GuideStep[];
  prerequisites?: string[];
}

interface IntegratedUserGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule?: string;
  autoStart?: boolean;
}

/**
 * 📚 GUIDE UTILISATEUR INTÉGRÉ COMPLET
 * Système de guidage contextuel pour l'application EBIOS RM
 */
const IntegratedUserGuide: React.FC<IntegratedUserGuideProps> = ({
  isOpen,
  onClose,
  currentModule,
  autoStart = false
}) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(currentModule || null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  // 📚 MODULES DE GUIDE DISPONIBLES
  const guideModules: GuideModule[] = [
    {
      id: 'getting-started',
      title: 'Premiers pas avec EBIOS RM',
      description: 'Introduction à la méthodologie et navigation de base',
      icon: BookOpen,
      color: 'bg-blue-500',
      estimatedTime: '10 min',
      difficulty: 'beginner',
      steps: [
        {
          id: 'welcome',
          title: 'Bienvenue dans EBIOS RM',
          description: 'Découvrez la méthodologie ANSSI',
          content: (
            <div className="space-y-4">
              <p>EBIOS RM (Expression des Besoins et Identification des Objectifs de Sécurité - Risk Manager) est la méthode française de référence pour l'analyse des risques cybersécurité.</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pourquoi EBIOS RM ?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Méthode officielle ANSSI</li>
                  <li>• Conforme aux exigences réglementaires</li>
                  <li>• Approche structurée en 5 ateliers</li>
                  <li>• Adaptée aux enjeux cyber actuels</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          id: 'navigation',
          title: 'Navigation dans l\'application',
          description: 'Apprenez à naviguer entre les ateliers',
          content: (
            <div className="space-y-4">
              <p>L'application est organisée autour de 5 ateliers principaux :</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { num: 1, title: 'Cadrage & Socle', icon: Database, color: 'blue' },
                  { num: 2, title: 'Sources de Risque', icon: Target, color: 'orange' },
                  { num: 3, title: 'Scénarios Stratégiques', icon: Users, color: 'purple' },
                  { num: 4, title: 'Scénarios Opérationnels', icon: Route, color: 'red' },
                  { num: 5, title: 'Traitement du Risque', icon: Shield, color: 'green' }
                ].map((workshop) => {
                  const Icon = workshop.icon;
                  return (
                    <div key={workshop.num} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className={`h-5 w-5 text-${workshop.color}-600`} />
                      <div>
                        <div className="font-medium">Atelier {workshop.num}</div>
                        <div className="text-sm text-gray-600">{workshop.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ),
          targetElement: '.sidebar-navigation'
        }
      ]
    },
    {
      id: 'workshop1-guide',
      title: 'Atelier 1 : Cadrage et Socle',
      description: 'Guide complet pour le premier atelier EBIOS RM',
      icon: Database,
      color: 'bg-blue-500',
      estimatedTime: '15 min',
      difficulty: 'beginner',
      steps: [
        {
          id: 'w1-overview',
          title: 'Objectifs de l\'Atelier 1',
          description: 'Comprendre les enjeux du cadrage',
          content: (
            <div className="space-y-4">
              <p>L'Atelier 1 pose les fondations de votre analyse EBIOS RM :</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Valeurs métier</div>
                    <div className="text-sm text-gray-600">Ce qui a de la valeur pour votre organisation</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Actifs supports</div>
                    <div className="text-sm text-gray-600">Éléments qui supportent vos valeurs métier</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Événements redoutés</div>
                    <div className="text-sm text-gray-600">Ce que vous craignez qu'il arrive</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'w1-business-values',
          title: 'Ajouter des valeurs métier',
          description: 'Créez votre première valeur métier',
          content: (
            <div className="space-y-4">
              <p>Les valeurs métier représentent ce qui est important pour votre organisation :</p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">💡 Exemples de valeurs métier</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Chiffre d'affaires</li>
                  <li>• Réputation de l'entreprise</li>
                  <li>• Données clients</li>
                  <li>• Continuité de service</li>
                  <li>• Conformité réglementaire</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">Cliquez sur "Ajouter une valeur métier" pour commencer.</p>
            </div>
          ),
          targetElement: '[data-testid="add-business-value-button"]',
          action: {
            type: 'click',
            target: '[data-testid="add-business-value-button"]'
          }
        }
      ]
    }
  ];

  // 🎯 Gestion de la progression
  useEffect(() => {
    const savedProgress = localStorage.getItem('ebios-guide-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        setCompletedSteps(new Set(progress.completedSteps || []));
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
      }
    }
  }, []);

  const saveProgress = () => {
    const progress = {
      userProgress,
      completedSteps: Array.from(completedSteps),
      lastModule: selectedModule,
      lastStep: currentStep
    };
    localStorage.setItem('ebios-guide-progress', JSON.stringify(progress));
  };

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    saveProgress();
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    const module = guideModules.find(m => m.id === selectedModule);
    if (module && currentStep < module.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  const currentModuleData = guideModules.find(m => m.id === selectedModule);
  const currentStepData = currentModuleData?.steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 🌫️ OVERLAY */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* 📦 PANNEAU PRINCIPAL */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform">
        {/* 📋 EN-TÊTE */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Guide Utilisateur</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 📚 SÉLECTION DE MODULE */}
        {!selectedModule && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Choisissez un module :</h3>
              <div className="space-y-3">
                {guideModules.map((module) => {
                  const Icon = module.icon;
                  const progress = userProgress[module.id] || 0;
                  const isCompleted = progress >= module.steps.length;
                  
                  return (
                    <div
                      key={module.id}
                      onClick={() => handleModuleSelect(module.id)}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn('p-2 rounded-lg', module.color)}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>⏱️ {module.estimatedTime}</span>
                            <span>📊 {module.difficulty}</span>
                            <span>📈 {progress}/{module.steps.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 📖 CONTENU DU MODULE */}
        {selectedModule && currentModuleData && currentStepData && (
          <div className="flex flex-col h-full">
            {/* 🎯 PROGRESSION */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{currentModuleData.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedModule(null)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / currentModuleData.steps.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Étape {currentStep + 1} sur {currentModuleData.steps.length}
              </div>
            </div>

            {/* 📝 CONTENU DE L'ÉTAPE */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{currentStepData.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{currentStepData.description}</p>
                </div>
                <div className="prose prose-sm max-w-none">
                  {currentStepData.content}
                </div>
              </div>
            </div>

            {/* 🎮 CONTRÔLES */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleNext}
                  disabled={currentStep >= currentModuleData.steps.length - 1}
                >
                  {currentStep >= currentModuleData.steps.length - 1 ? 'Terminer' : 'Suivant'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegratedUserGuide;

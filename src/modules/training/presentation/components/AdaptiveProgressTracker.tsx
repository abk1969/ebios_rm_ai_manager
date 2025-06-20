/**
 * 📈 TRACKER DE PROGRESSION ADAPTATIF
 * Suivi de progression personnalisé selon l'expertise
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useState } from 'react';
import { SessionProgress } from '../hooks/useWorkshop1Intelligence';
import { ExpertiseLevel } from '../../domain/services/AdaptiveContentService';

// 🎯 TYPES POUR LE TRACKER

interface AdaptiveProgressTrackerProps {
  progress: SessionProgress;
  expertiseLevel: ExpertiseLevel | null;
  onProgressUpdate: (progress: Partial<SessionProgress>) => Promise<void>;
  className?: string;
}

interface ProgressModule {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'validated';
  estimatedTime: number; // en minutes
  expertLevel: 'all' | 'intermediate' | 'senior' | 'expert' | 'master';
  dependencies?: string[];
}

interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  threshold: number; // pourcentage
  achieved: boolean;
  achievedAt?: Date;
  reward?: string;
}

// 📈 COMPOSANT PRINCIPAL

export const AdaptiveProgressTracker: React.FC<AdaptiveProgressTrackerProps> = ({
  progress,
  expertiseLevel,
  onProgressUpdate,
  className = ''
}) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showMilestones, setShowMilestones] = useState(false);

  // 📊 GÉNÉRATION DES MODULES ADAPTATIFS

  const generateAdaptiveModules = (): ProgressModule[] => {
    const baseModules: ProgressModule[] = [
      {
        id: 'introduction',
        name: 'Introduction EBIOS RM',
        description: 'Découverte de la méthodologie',
        progress: progress.currentModule === 'introduction' ? progress.moduleProgress : 
                 ['cadrage', 'biens_essentiels', 'biens_supports'].includes(progress.currentModule) ? 100 : 0,
        status: progress.currentModule === 'introduction' ? 'in_progress' : 
                ['cadrage', 'biens_essentiels', 'biens_supports'].includes(progress.currentModule) ? 'completed' : 'not_started',
        estimatedTime: expertiseLevel?.level === 'master' ? 10 : expertiseLevel?.level === 'expert' ? 15 : 30,
        expertLevel: 'all'
      },
      {
        id: 'cadrage',
        name: 'Cadrage de l\'étude',
        description: 'Définition du périmètre et des enjeux',
        progress: progress.currentModule === 'cadrage' ? progress.moduleProgress : 
                 ['biens_essentiels', 'biens_supports'].includes(progress.currentModule) ? 100 : 0,
        status: progress.currentModule === 'cadrage' ? 'in_progress' : 
                ['biens_essentiels', 'biens_supports'].includes(progress.currentModule) ? 'completed' : 'not_started',
        estimatedTime: expertiseLevel?.level === 'master' ? 20 : expertiseLevel?.level === 'expert' ? 30 : 45,
        expertLevel: 'all',
        dependencies: ['introduction']
      },
      {
        id: 'biens_essentiels',
        name: 'Biens essentiels',
        description: 'Identification et hiérarchisation',
        progress: progress.currentModule === 'biens_essentiels' ? progress.moduleProgress : 
                 progress.currentModule === 'biens_supports' ? 100 : 0,
        status: progress.currentModule === 'biens_essentiels' ? 'in_progress' : 
                progress.currentModule === 'biens_supports' ? 'completed' : 'not_started',
        estimatedTime: expertiseLevel?.level === 'master' ? 25 : expertiseLevel?.level === 'expert' ? 35 : 50,
        expertLevel: 'all',
        dependencies: ['cadrage']
      },
      {
        id: 'biens_supports',
        name: 'Biens supports',
        description: 'Cartographie des dépendances',
        progress: progress.currentModule === 'biens_supports' ? progress.moduleProgress : 0,
        status: progress.currentModule === 'biens_supports' ? 'in_progress' : 'not_started',
        estimatedTime: expertiseLevel?.level === 'master' ? 30 : expertiseLevel?.level === 'expert' ? 40 : 60,
        expertLevel: 'all',
        dependencies: ['biens_essentiels']
      }
    ];

    // Modules avancés pour experts
    if (expertiseLevel?.level === 'expert' || expertiseLevel?.level === 'master') {
      baseModules.push(
        {
          id: 'analyse_strategique',
          name: 'Analyse stratégique',
          description: 'Enjeux business et gouvernance',
          progress: 0,
          status: 'not_started',
          estimatedTime: 45,
          expertLevel: 'expert',
          dependencies: ['biens_supports']
        },
        {
          id: 'validation_methodologique',
          name: 'Validation méthodologique',
          description: 'Cohérence et conformité EBIOS RM',
          progress: 0,
          status: 'not_started',
          estimatedTime: 30,
          expertLevel: 'master',
          dependencies: ['analyse_strategique']
        }
      );
    }

    return baseModules;
  };

  // 🏆 GÉNÉRATION DES JALONS

  const generateMilestones = (): ProgressMilestone[] => {
    return [
      {
        id: 'first_steps',
        title: 'Premiers pas',
        description: 'Complétion de l\'introduction',
        threshold: 15,
        achieved: progress.overallProgress >= 15,
        achievedAt: progress.overallProgress >= 15 ? new Date() : undefined,
        reward: '🎯 Badge Débutant'
      },
      {
        id: 'cadrage_master',
        title: 'Maître du cadrage',
        description: 'Cadrage de l\'étude terminé',
        threshold: 40,
        achieved: progress.overallProgress >= 40,
        achievedAt: progress.overallProgress >= 40 ? new Date() : undefined,
        reward: '🎭 Badge Cadrage'
      },
      {
        id: 'biens_expert',
        title: 'Expert des biens',
        description: 'Identification des biens complète',
        threshold: 70,
        achieved: progress.overallProgress >= 70,
        achievedAt: progress.overallProgress >= 70 ? new Date() : undefined,
        reward: '💎 Badge Expert'
      },
      {
        id: 'workshop1_complete',
        title: 'Workshop 1 Maîtrisé',
        description: 'Complétion totale du Workshop 1',
        threshold: 100,
        achieved: progress.overallProgress >= 100,
        achievedAt: progress.overallProgress >= 100 ? new Date() : undefined,
        reward: '🏆 Badge Maître Workshop 1'
      }
    ];
  };

  // 🎨 COULEURS SELON LE STATUT

  const getStatusColor = (status: ProgressModule['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'validated': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: ProgressModule['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'validated': return '🎓';
      case 'in_progress': return '⏳';
      default: return '⭕';
    }
  };

  // 📊 CALCULS DE PROGRESSION

  const calculateTotalEstimatedTime = (): number => {
    return generateAdaptiveModules().reduce((total, module) => total + module.estimatedTime, 0);
  };

  const calculateCompletionRate = (): number => {
    const modules = generateAdaptiveModules();
    const completedModules = modules.filter(m => m.status === 'completed' || m.status === 'validated').length;
    return Math.round((completedModules / modules.length) * 100);
  };

  // 🎯 RENDU PRINCIPAL

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col ${className}`}>
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 animate-fade-in">
          📈 Progression Workshop 1
        </h3>
        
        {/* Barre de progression globale */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm animate-fade-in">
            <span>Progression globale</span>
            <span className="font-medium animate-fade-in">{Math.round(progress.overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 animate-fade-in">
            <div
              className="bg-blue-500 h-3 rounded-full animate-fade-in"
              style={{ width: `${Math.round(progress.overallProgress)}%` }}
            />
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-center animate-fade-in">
          <div>
            <div className="text-2xl font-bold text-blue-600 animate-fade-in">{Math.round(progress.timeSpent)}</div>
            <div className="text-xs text-gray-500 animate-fade-in">Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 animate-fade-in">{Math.round(progress.engagementScore)}</div>
            <div className="text-xs text-gray-500 animate-fade-in">Engagement</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 animate-fade-in">{calculateCompletionRate()}</div>
            <div className="text-xs text-gray-500 animate-fade-in">Modules</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-200 animate-fade-in">
        <div className="flex space-x-2 animate-fade-in">
          <button
            onClick={() => setShowMilestones(false)}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              !showMilestones ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Modules
          </button>
          <button
            onClick={() => setShowMilestones(true)}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              showMilestones ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏆 Jalons
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
        <div>
          {!showMilestones ? (
            <div
              key="modules"
              className="space-y-3 animate-fade-in"
            >
              {generateAdaptiveModules().map((module, index) => (
                <div
                  key={module.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    expandedModule === module.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                >
                  <div className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center space-x-3 animate-fade-in">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(module.status)}`}>
                        <span className="text-sm animate-fade-in">{getStatusIcon(module.status)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 animate-fade-in">{module.name}</h4>
                        <p className="text-sm text-gray-600 animate-fade-in">{module.description}</p>
                      </div>
                    </div>
                    <div className="text-right animate-fade-in">
                      <div className="text-sm font-medium animate-fade-in">{module.progress}%</div>
                      <div className="text-xs text-gray-500 animate-fade-in">{module.estimatedTime}min</div>
                    </div>
                  </div>

                  {/* Barre de progression du module */}
                  <div className="mt-3 animate-fade-in">
                    <div className="w-full bg-gray-200 rounded-full h-2 animate-fade-in">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(module.status)}`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Détails étendus */}
                  <div>
                    {expandedModule === module.id && (
                      <div
                        className="mt-4 pt-4 border-t border-gray-200 animate-fade-in"
                      >
                        <div className="space-y-3 animate-fade-in">
                          {/* Dépendances */}
                          {module.dependencies && module.dependencies.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-1 animate-fade-in">Prérequis:</h5>
                              <div className="flex flex-wrap gap-1 animate-fade-in">
                                {module.dependencies.map(dep => (
                                  <span key={dep} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded animate-fade-in">
                                    {generateAdaptiveModules().find(m => m.id === dep)?.name || dep}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Niveau expert requis */}
                          {module.expertLevel !== 'all' && (
                            <div>
                              <span className="text-sm text-gray-600 animate-fade-in">Niveau requis: </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded animate-fade-in">
                                {module.expertLevel}
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex space-x-2 animate-fade-in">
                            {module.status === 'not_started' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onProgressUpdate({ currentModule: module.id, moduleProgress: 0 });
                                }}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 animate-fade-in"
                              >
                                Commencer
                              </button>
                            )}
                            {module.status === 'in_progress' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onProgressUpdate({ moduleProgress: 100 });
                                }}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 animate-fade-in"
                              >
                                Terminer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              key="milestones"
              className="space-y-4 animate-fade-in"
            >
              {generateMilestones().map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`border rounded-lg p-4 ${
                    milestone.achieved ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center space-x-3 animate-fade-in">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        milestone.achieved ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {milestone.achieved ? '🏆' : '🎯'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 animate-fade-in">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 animate-fade-in">{milestone.description}</p>
                        {milestone.reward && (
                          <p className="text-sm text-blue-600 mt-1 animate-fade-in">{milestone.reward}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right animate-fade-in">
                      <div className="text-sm font-medium animate-fade-in">{milestone.threshold}%</div>
                      {milestone.achievedAt && (
                        <div className="text-xs text-gray-500 animate-fade-in">
                          {milestone.achievedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Résumé en bas */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 animate-fade-in">
        <div className="text-center animate-fade-in">
          <div className="text-sm text-gray-600 animate-fade-in">
            Temps estimé restant: <span className="font-medium animate-fade-in">
              {Math.max(0, calculateTotalEstimatedTime() - progress.timeSpent)} minutes
            </span>
          </div>
          {expertiseLevel && (
            <div className="text-xs text-gray-500 mt-1 animate-fade-in">
              Adapté pour niveau {expertiseLevel.level} ({expertiseLevel.score}% de maîtrise)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdaptiveProgressTracker;

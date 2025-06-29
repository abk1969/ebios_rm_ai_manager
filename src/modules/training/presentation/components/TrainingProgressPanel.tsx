/**
 * 🎯 PANNEAU DE PROGRESSION
 * Composant pour afficher la progression de la formation
 * Métriques temps réel et visualisations
 */

import React from 'react';
import {
  Target,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Circle,
  Star,
  Brain,
  BarChart3,
  Calendar,
  Trophy,
  ChevronRight,
  Play
} from 'lucide-react';
import { useProgress, useMetrics, useCurrentSession, useTrainingActions } from '../stores/trainingStore';

// 🎯 PROPS DU COMPOSANT
export interface TrainingProgressPanelProps {
  compact?: boolean;
  className?: string;
}

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingProgressPanel: React.FC<TrainingProgressPanelProps> = ({
  compact = false,
  className = ''
}) => {
  // 🎪 HOOKS STORE
  const progress = useProgress();
  const metrics = useMetrics();
  const currentSession = useCurrentSession();
  const actions = useTrainingActions();

  // 🔄 INITIALISATION SESSION PAR DÉFAUT
  React.useEffect(() => {
    if (!currentSession && progress.currentWorkshop === null) {
      // Initialiser avec l'atelier 1 par défaut
      actions.setCurrentWorkshop(1);
      actions.updateProgress({
        currentStep: 1,
        completionPercentage: 0
      });
    }
  }, [currentSession, progress.currentWorkshop, actions]);

  // 🎯 DONNÉES DES ATELIERS
  const workshops = [
    { id: 1, title: 'Cadrage et Socle de Sécurité', icon: '🎯', color: 'blue' },
    { id: 2, title: 'Sources de Risques', icon: '⚔️', color: 'red' },
    { id: 3, title: 'Scénarios Stratégiques', icon: '🎲', color: 'purple' },
    { id: 4, title: 'Scénarios Opérationnels', icon: '🔧', color: 'green' },
    { id: 5, title: 'Traitement du Risque', icon: '🛡️', color: 'yellow' }
  ];

  // 🎯 CALCUL DU STATUT DES ATELIERS
  const getWorkshopStatus = (workshopId: number) => {
    if (!currentSession) return 'not-started';

    const currentWorkshop = progress.currentWorkshop;
    if (workshopId < currentWorkshop!) return 'completed';
    if (workshopId === currentWorkshop) return 'in-progress';
    return 'not-started';
  };

  // 🎯 GESTION DU CLIC SUR UN ATELIER
  const handleWorkshopClick = (workshopId: number) => {
    const status = getWorkshopStatus(workshopId);

    // Permettre l'accès aux ateliers terminés et à l'atelier en cours
    if (status === 'completed' || status === 'in-progress') {
      console.log(`🎯 Navigation vers l'atelier ${workshopId}`);

      // Mettre à jour l'atelier actuel
      actions.setCurrentWorkshop(workshopId);

      // Afficher un message contextuel
      actions.addMessage({
        type: 'instructor',
        content: `**🎯 ATELIER ${workshopId} ACTIVÉ**\n\nVous travaillez maintenant sur : **${workshops.find(w => w.id === workshopId)?.title}**\n\nPosez-moi vos questions techniques sur cet atelier spécifique.`,
        metadata: {
          instructionType: 'workshop_navigation' as const,
          confidence: 1.0,
          workshopId: workshopId
        }
      });
    } else {
      // Atelier non accessible
      console.log(`⚠️ Atelier ${workshopId} non accessible`);
      actions.addMessage({
        type: 'instructor',
        content: `**⚠️ ATELIER ${workshopId} NON ACCESSIBLE**\n\nVous devez d'abord terminer les ateliers précédents pour accéder à celui-ci.\n\n**Progression actuelle :** Atelier ${progress.currentWorkshop}`,
        metadata: {
          instructionType: 'access_denied' as const,
          confidence: 1.0
        }
      });
    }
  };

  // 🎯 VÉRIFIER SI UN ATELIER EST CLIQUABLE
  const isWorkshopClickable = (workshopId: number) => {
    const status = getWorkshopStatus(workshopId);
    return status === 'completed' || status === 'in-progress';
  };

  // 🎯 RENDU COMPACT
  if (compact) {
    return (
      <div className={`training-progress-compact ${className}`}>
        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-900">
                {progress.completionPercentage.toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">Progression</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-green-900">
                {Math.floor(progress.timeSpent / 60)}h{progress.timeSpent % 60}m
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">Temps passé</p>
          </div>
        </div>

        {/* Ateliers */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 mb-2">Ateliers</h3>
          {workshops.map((workshop) => {
            const status = getWorkshopStatus(workshop.id);
            const isClickable = isWorkshopClickable(workshop.id);

            return (
              <div
                key={workshop.id}
                onClick={() => isClickable && handleWorkshopClick(workshop.id)}
                className={`
                  flex items-center p-2 rounded-lg border transition-all
                  ${status === 'completed' ? 'bg-green-50 border-green-200' :
                    status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'}
                  ${isClickable ? 'cursor-pointer hover:shadow-md hover:scale-105' : 'cursor-not-allowed opacity-60'}
                `}
              >
                <div className="mr-2 text-lg">{workshop.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Atelier {workshop.id}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {workshop.title}
                  </p>
                </div>
                <div className="ml-2 flex items-center space-x-1">
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : status === 'in-progress' ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  {isClickable && (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges récents */}
        {progress.badges.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Badges récents</h3>
            <div className="flex flex-wrap gap-1">
              {progress.badges.slice(-3).map((badge, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                >
                  🏆 {badge}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🎯 RENDU COMPLET
  return (
    <div className={`training-progress-panel p-6 ${className}`}>
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre Progression</h2>
        <p className="text-gray-600">
          Suivez votre avancement dans la formation EBIOS RM
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Progression globale</p>
              <p className="text-2xl font-bold">{progress.completionPercentage.toFixed(0)}%</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Temps passé</p>
              <p className="text-2xl font-bold">
                {Math.floor(progress.timeSpent / 60)}h{progress.timeSpent % 60}m
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Score d'engagement</p>
              <p className="text-2xl font-bold">{metrics.engagementScore}/100</p>
            </div>
            <Brain className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Badges obtenus</p>
              <p className="text-2xl font-bold">{progress.badges.length}</p>
            </div>
            <Award className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Progression des ateliers */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression par atelier</h3>
        <div className="space-y-4">
          {workshops.map((workshop) => {
            const status = getWorkshopStatus(workshop.id);
            const isActive = workshop.id === progress.currentWorkshop;
            const isClickable = isWorkshopClickable(workshop.id);

            return (
              <div
                key={workshop.id}
                onClick={() => isClickable && handleWorkshopClick(workshop.id)}
                className={`
                  border rounded-lg p-4 transition-all
                  ${status === 'completed' ? 'border-green-200 bg-green-50' :
                    isActive ? 'border-blue-200 bg-blue-50 shadow-md' :
                    'border-gray-200 bg-white'}
                  ${isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : 'cursor-not-allowed opacity-60'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg
                      ${status === 'completed' ? 'bg-green-200' :
                        isActive ? 'bg-blue-200' :
                        'bg-gray-200'}
                    `}>
                      {workshop.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Atelier {workshop.id}: {workshop.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {status === 'completed' ? 'Terminé' :
                         isActive ? `Étape ${progress.currentStep}` :
                         'À venir'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {status === 'completed' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Terminé</span>
                      </div>
                    )}
                    {isActive && (
                      <div className="flex items-center text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                        <span className="text-sm font-medium">En cours</span>
                      </div>
                    )}
                    {status === 'not-started' && (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}

                    {/* Indicateur de clic pour les ateliers accessibles */}
                    {isClickable && (
                      <div className="flex items-center space-x-1 text-gray-400">
                        {status === 'in-progress' && (
                          <Play className="w-4 h-4 text-blue-600" />
                        )}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Barre de progression pour l'atelier actif */}
                {isActive && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Étape {progress.currentStep}</span>
                      <span>{Math.round((progress.currentStep / 10) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.currentStep / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Métriques de performance
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Compréhension</span>
                <span>{metrics.comprehensionLevel}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${metrics.comprehensionLevel}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Qualité des réponses</span>
                <span>{metrics.responseQuality}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${metrics.responseQuality}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Engagement</span>
                <span>{metrics.engagementScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${metrics.engagementScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Réalisations
          </h4>
          <div className="space-y-2">
            {progress.milestones.length > 0 ? (
              progress.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{milestone}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucune réalisation pour le moment</p>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges obtenus</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {progress.badges.map((badge, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-lg text-center text-white shadow-md"
              >
                <Award className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm font-medium">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProgressPanel;

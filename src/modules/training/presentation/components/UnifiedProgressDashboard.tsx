import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target,
  Brain,
  Users,
  MessageCircle,
  BookOpen,
  Eye,
  CheckCircle,
  Star,
  Zap,
  Trophy,
  Activity
} from 'lucide-react';
import { UnifiedMetricsManager, UnifiedMetrics } from '../../domain/services/UnifiedMetricsManager';

/**
 * 📊 TABLEAU DE BORD PROGRESSION UNIFIÉE
 * Affichage centralisé des métriques ChatExpert + Workshops
 */

interface UnifiedProgressDashboardProps {
  sessionId: string;
  currentMode: string;
  onNavigateToMode?: (mode: string) => void;
  className?: string;
}

export const UnifiedProgressDashboard: React.FC<UnifiedProgressDashboardProps> = ({
  sessionId,
  currentMode,
  onNavigateToMode,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<UnifiedMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = () => {
      try {
        const data = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
        setMetrics(data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
    
    // Mise à jour périodique
    const interval = setInterval(loadMetrics, 30000); // 30s
    return () => clearInterval(interval);
  }, [sessionId]);

  const getModeIcon = (modeId: string) => {
    switch (modeId) {
      case 'discovery': return Eye;
      case 'case-study': return BookOpen;
      case 'expert-chat': return MessageCircle;
      case 'workshops': return Users;
      default: return Target;
    }
  };

  const getModeColor = (modeId: string) => {
    switch (modeId) {
      case 'discovery': return 'purple';
      case 'case-study': return 'green';
      case 'expert-chat': return 'blue';
      case 'workshops': return 'indigo';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'text-purple-600 bg-purple-100';
      case 'Avancé': return 'text-indigo-600 bg-indigo-100';
      case 'Intermédiaire': return 'text-blue-600 bg-blue-100';
      case 'Débutant': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement métriques...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center p-8">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Métriques indisponibles</h3>
        <p className="text-gray-600">Impossible de charger les données de progression.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* En-tête progression globale */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" />
              Progression Formation
            </h2>
            <p className="text-blue-100">
              Niveau {metrics.globalProgress.level} • {metrics.globalProgress.overallCompletion}% terminé
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{metrics.globalProgress.overallCompletion}%</div>
            <div className="text-blue-200">Progression globale</div>
          </div>
        </div>
        
        {/* Barre progression globale */}
        <div className="mt-4">
          <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${metrics.globalProgress.overallCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(metrics.globalProgress.totalTimeSpent / 60)}h{metrics.globalProgress.totalTimeSpent % 60}m
            </div>
            <div className="text-sm text-gray-600">Temps total</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-green-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.globalProgress.averageScore}</div>
            <div className="text-sm text-gray-600">Score moyen</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-purple-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.globalProgress.modesCompleted}/{metrics.globalProgress.totalModes}
            </div>
            <div className="text-sm text-gray-600">Modules terminés</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-orange-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.globalProgress.streak}</div>
            <div className="text-sm text-gray-600">Jours consécutifs</div>
          </div>
        </div>
      </div>

      {/* Progression par mode */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Progression par module</h3>
        <div className="space-y-4">
          {Object.values(metrics.modeMetrics).map((mode) => {
            const Icon = getModeIcon(mode.modeId);
            const color = getModeColor(mode.modeId);
            const isCurrent = mode.modeId === currentMode;
            
            return (
              <div 
                key={mode.modeId}
                className={`p-4 rounded-lg border transition-all ${
                  isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-50' : 'bg-gray-50'
                } ${onNavigateToMode ? 'cursor-pointer hover:shadow-md' : ''}`}
                onClick={() => onNavigateToMode?.(mode.modeId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${color}-100`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{mode.modeName}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(mode.status)}`}>
                          {mode.status === 'completed' ? 'Terminé' :
                           mode.status === 'in_progress' ? 'En cours' :
                           'Non commencé'}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Actuel
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{mode.completion}%</div>
                    <div className="text-sm text-gray-600">{mode.timeSpent}min</div>
                  </div>
                </div>
                
                {/* Barre progression mode */}
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${mode.completion}%` }}
                    />
                  </div>
                </div>
                
                {/* Métriques spécifiques */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    {mode.score > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{mode.score}%</span>
                      </div>
                    )}
                    {mode.attempts > 0 && (
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{mode.attempts} tentatives</span>
                      </div>
                    )}
                  </div>
                  {mode.lastAccess && (
                    <div className="text-xs">
                      Dernière activité: {new Date(mode.lastAccess).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements récents */}
      {metrics.achievements.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Achievements récents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.achievements.slice(-4).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-900">{achievement.title}</h4>
                  <p className="text-sm text-yellow-700">{achievement.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      {achievement.rarity}
                    </span>
                    <span className="text-xs text-yellow-600">+{achievement.points} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations */}
      {metrics.recommendations.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-indigo-600" />
            Recommandations IA
          </h3>
          <div className="space-y-3">
            {metrics.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-indigo-900">{rec.title}</h4>
                    <p className="text-sm text-indigo-700 mt-1">{rec.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority === 'high' ? 'Priorité haute' :
                         rec.priority === 'medium' ? 'Priorité moyenne' :
                         'Priorité basse'}
                      </span>
                      {rec.estimatedTime && (
                        <span className="text-xs text-indigo-600">
                          ~{rec.estimatedTime}min
                        </span>
                      )}
                    </div>
                  </div>
                  {rec.actionUrl && onNavigateToMode && (
                    <button
                      onClick={() => {
                        const mode = rec.actionUrl?.split('mode=')[1];
                        if (mode) onNavigateToMode(mode);
                      }}
                      className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Aller
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session actuelle */}
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <h3 className="text-lg font-semibold mb-4">Session actuelle</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{metrics.sessionMetrics.currentDuration}min</div>
            <div className="text-sm text-gray-600">Durée session</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{metrics.sessionMetrics.engagementScore}%</div>
            <div className="text-sm text-gray-600">Engagement</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{metrics.sessionMetrics.actionsPerformed}</div>
            <div className="text-sm text-gray-600">Actions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

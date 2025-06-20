import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Users, 
  BookOpen, 
  Eye, 
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Zap
} from 'lucide-react';
import Button from '../../../../components/ui/button';

/**
 * 🧭 NAVIGATEUR UNIFIÉ FORMATION EBIOS RM
 * Système de navigation intelligent entre tous les modes de formation
 */

interface UnifiedTrainingNavigatorProps {
  currentMode: string;
  sessionId: string;
  onModeChange?: (mode: string) => void;
  className?: string;
}

interface TrainingMode {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  features: string[];
  prerequisites: string[];
  learningObjectives: string[];
  status: 'available' | 'recommended' | 'completed' | 'locked';
}

export const UnifiedTrainingNavigator: React.FC<UnifiedTrainingNavigatorProps> = ({
  currentMode,
  sessionId,
  onModeChange,
  className = ''
}) => {
  const [expandedMode, setExpandedMode] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<{ [key: string]: any }>({});

  // 📊 DÉFINITION DES MODES DE FORMATION
  const trainingModes: TrainingMode[] = [
    {
      id: 'discovery',
      title: 'Découverte EBIOS RM',
      shortTitle: 'Découverte',
      description: 'Apprenez les fondamentaux de la méthode EBIOS Risk Manager',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      estimatedDuration: 45,
      difficulty: 'beginner',
      features: ['Concepts de base', 'Méthodologie générale', 'Vocabulaire EBIOS RM'],
      prerequisites: ['Aucun prérequis'],
      learningObjectives: [
        'Comprendre les principes EBIOS RM',
        'Maîtriser le vocabulaire technique',
        'Identifier les 5 ateliers'
      ],
      status: 'available'
    },
    {
      id: 'case-study',
      title: 'Cas d\'étude pratique',
      shortTitle: 'Cas d\'étude',
      description: 'Analysez un cas réel du secteur de la santé',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      estimatedDuration: 90,
      difficulty: 'intermediate',
      features: ['Cas réel CHU', 'Analyse guidée', 'Méthodologie appliquée'],
      prerequisites: ['Découverte EBIOS RM recommandée'],
      learningObjectives: [
        'Appliquer EBIOS RM sur cas concret',
        'Analyser un écosystème complexe',
        'Identifier les enjeux sectoriels'
      ],
      status: 'recommended'
    },
    {
      id: 'expert-chat',
      title: 'Chat avec l\'expert',
      shortTitle: 'Chat Expert',
      description: 'Posez vos questions à l\'expert IA EBIOS RM',
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      estimatedDuration: 60,
      difficulty: 'intermediate',
      features: ['Questions personnalisées', 'Réponses expertes', 'Approfondissement'],
      prerequisites: ['Connaissances de base EBIOS RM'],
      learningObjectives: [
        'Approfondir des points spécifiques',
        'Clarifier des concepts complexes',
        'Obtenir des conseils personnalisés'
      ],
      status: 'available'
    },
    {
      id: 'workshops',
      title: 'Ateliers interactifs',
      shortTitle: 'Ateliers',
      description: 'Pratiquez les 5 ateliers EBIOS RM avec l\'IA',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      estimatedDuration: 425, // 5 ateliers × ~85min
      difficulty: 'expert',
      features: ['5 ateliers complets', 'Exercices experts', 'Liens inter-ateliers'],
      prerequisites: ['Maîtrise EBIOS RM', 'Cas d\'étude recommandé'],
      learningObjectives: [
        'Maîtriser les 5 ateliers EBIOS RM',
        'Pratiquer avec exercices experts',
        'Comprendre les liens inter-ateliers'
      ],
      status: 'available'
    }
  ];

  // 🎯 CHARGEMENT PROGRESSION UTILISATEUR
  useEffect(() => {
    // Simulation - en production, charger depuis le backend
    const mockProgress = {
      'discovery': { completed: true, score: 85, timeSpent: 42 },
      'case-study': { completed: false, score: 0, timeSpent: 15 },
      'expert-chat': { completed: false, score: 0, timeSpent: 25 },
      'workshops': { completed: false, score: 0, timeSpent: 0 }
    };
    setUserProgress(mockProgress);
  }, [sessionId]);

  // 🎯 GESTION NAVIGATION
  const handleModeSelect = (modeId: string) => {
    if (onModeChange) {
      onModeChange(modeId);
    } else {
      // Navigation directe via URL
      window.location.href = `/training/session/${sessionId}?mode=${modeId}`;
    }
  };

  // 🎯 CALCUL STATUT MODE
  const getModeStatus = (mode: TrainingMode): TrainingMode['status'] => {
    const progress = userProgress[mode.id];
    if (progress?.completed) return 'completed';
    if (mode.id === 'workshops' && !userProgress['case-study']?.completed) return 'locked';
    if (mode.id === currentMode) return 'recommended';
    return 'available';
  };

  // 🎯 COULEURS SELON STATUT
  const getStatusColors = (status: TrainingMode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'recommended':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'locked':
        return 'bg-gray-100 border-gray-300 text-gray-500';
      default:
        return 'bg-white border-gray-200 text-gray-700';
    }
  };

  // 🎯 ICÔNE STATUT
  const getStatusIcon = (status: TrainingMode['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'recommended':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'locked':
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-400" />;
    }
  };

  // 🎯 PROGRESSION GLOBALE
  const globalProgress = {
    completed: Object.values(userProgress).filter(p => p.completed).length,
    total: trainingModes.length,
    totalTime: Object.values(userProgress).reduce((sum, p) => sum + (p.timeSpent || 0), 0),
    averageScore: Object.values(userProgress).reduce((sum, p) => sum + (p.score || 0), 0) / trainingModes.length
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* En-tête navigation */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Navigation className="w-6 h-6 mr-3" />
              Navigation Formation
            </h2>
            <p className="text-indigo-100">
              Choisissez votre parcours d'apprentissage EBIOS RM
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{globalProgress.completed}/{globalProgress.total}</div>
            <div className="text-indigo-200">Modules terminés</div>
          </div>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{Math.round((globalProgress.completed / globalProgress.total) * 100)}%</div>
            <div className="text-sm text-gray-600">Progression</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.floor(globalProgress.totalTime / 60)}h{globalProgress.totalTime % 60}m</div>
            <div className="text-sm text-gray-600">Temps total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(globalProgress.averageScore)}</div>
            <div className="text-sm text-gray-600">Score moyen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{sessionId.slice(-6)}</div>
            <div className="text-sm text-gray-600">Session</div>
          </div>
        </div>
      </div>

      {/* Modes de formation */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingModes.map((mode) => {
            const status = getModeStatus(mode);
            const progress = userProgress[mode.id];
            const Icon = mode.icon;
            const isExpanded = expandedMode === mode.id;
            const isCurrent = currentMode === mode.id;

            return (
              <div
                key={mode.id}
                className={`border-2 rounded-lg transition-all ${
                  isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                } ${getStatusColors(status)} ${
                  status !== 'locked' ? 'hover:shadow-md cursor-pointer' : 'cursor-not-allowed opacity-75'
                }`}
                onClick={() => status !== 'locked' && setExpandedMode(isExpanded ? null : mode.id)}
              >
                <div className="p-4">
                  {/* En-tête mode */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${mode.bgColor}`}>
                        <Icon className={`w-6 h-6 ${mode.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{mode.title}</h3>
                        <p className="text-sm opacity-75">{mode.description}</p>
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  {/* Métriques mode */}
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{mode.estimatedDuration}min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="capitalize">{mode.difficulty}</span>
                      </div>
                      {progress && (
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>{progress.score || 0}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Détails étendus */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div>
                        <h4 className="font-medium mb-1">Fonctionnalités :</h4>
                        <ul className="text-sm space-y-1">
                          {mode.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Objectifs d'apprentissage :</h4>
                        <ul className="text-sm space-y-1">
                          {mode.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <TrendingUp className="w-3 h-3 text-blue-500" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action */}
                      <div className="pt-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModeSelect(mode.id);
                          }}
                          disabled={status === 'locked'}
                          className="w-full"
                          variant={isCurrent ? 'default' : 'outline'}
                        >
                          {isCurrent ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Mode actuel
                            </>
                          ) : status === 'completed' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Revoir
                            </>
                          ) : status === 'locked' ? (
                            <>
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Verrouillé
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Commencer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommandations */}
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <h3 className="font-semibold mb-3">💡 Recommandations :</h3>
        <div className="text-sm text-gray-700 space-y-2">
          {globalProgress.completed === 0 && (
            <p>• Commencez par la <strong>Découverte</strong> pour maîtriser les bases</p>
          )}
          {userProgress['discovery']?.completed && !userProgress['case-study']?.completed && (
            <p>• Continuez avec le <strong>Cas d'étude</strong> pour une application pratique</p>
          )}
          {userProgress['case-study']?.completed && !userProgress['workshops']?.completed && (
            <p>• Passez aux <strong>Ateliers</strong> pour une maîtrise complète</p>
          )}
          <p>• Utilisez le <strong>Chat Expert</strong> à tout moment pour des questions spécifiques</p>
        </div>
      </div>
    </div>
  );
};

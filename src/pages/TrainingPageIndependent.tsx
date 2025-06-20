/**
 * 🎓 PAGE DE FORMATION INDÉPENDANTE
 * Version complètement découplée sans dépendances Redux
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Play,
  Settings,
  Clock,
  BarChart3,
  Award,
  Users,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Target,
  Lightbulb,
  MessageCircle,
  FileText,
  Zap,
  ArrowRight,
  X,
  Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RealTrainingSessionService, RealTrainingSession } from '@/services/training/RealTrainingSessionService';

/**
 * 🎯 COMPOSANT PRINCIPAL INDÉPENDANT
 */
export const TrainingPageIndependent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 🎯 ÉTAT LOCAL SIMPLIFIÉ
  const [sessions, setSessions] = useState<RealTrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState({
    totalSessions: 0,
    completedSessions: 0,
    averageCompletionRate: 0,
    totalLearners: 1
  });
  
  // 🎯 SERVICE
  const trainingService = RealTrainingSessionService.getInstance();

  // 🔄 CHARGEMENT DES SESSIONS
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allSessions = await trainingService.getAllRealSessions();
      setSessions(allSessions);
      
      // Calculer les métriques
      const completed = allSessions.filter(s => s.status === 'completed').length;
      setMetrics({
        totalSessions: allSessions.length,
        completedSessions: completed,
        averageCompletionRate: allSessions.length > 0 ? (completed / allSessions.length) * 100 : 0,
        totalLearners: 1
      });
      
    } catch (err) {
      console.error('Erreur chargement sessions:', err);
      setError('Erreur lors du chargement des sessions');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 ÉTAPES DU PARCOURS D'APPRENTISSAGE
  const learningSteps = [
    {
      id: 0,
      title: "🎯 Workshop 1 Intelligent",
      description: "Formation adaptative avec IA - Socle de Sécurité EBIOS RM",
      icon: Brain,
      duration: "60 min",
      status: "available",
      isNew: true
    },
    {
      id: 1,
      title: "Découverte d'EBIOS RM",
      description: "Apprenez les fondamentaux de la méthode EBIOS Risk Manager",
      icon: Lightbulb,
      duration: "15 min",
      status: "available"
    },
    {
      id: 2,
      title: "Cas d'étude pratique",
      description: "Analysez un cas réel du secteur de la santé",
      icon: FileText,
      duration: "30 min",
      status: "available"
    },
    {
      id: 3,
      title: "Ateliers interactifs",
      description: "Pratiquez les 5 ateliers EBIOS RM avec l'IA",
      icon: Target,
      duration: "45 min",
      status: "available"
    },
    {
      id: 4,
      title: "Chat avec l'expert",
      description: "Posez vos questions à l'expert IA EBIOS RM",
      icon: MessageCircle,
      duration: "Illimité",
      status: "available"
    }
  ];

  // 🎯 CRÉATION DE SESSION
  const handleCreateSession = () => {
    setShowOnboarding(false);
    // Rediriger vers la session par défaut
    navigate('/training/session/session_healthcare_chu_2024');
  };

  // 🎯 COMMENCER LE PARCOURS GUIDÉ
  const handleStartLearning = () => {
    setShowOnboarding(false);
    setCurrentStep(1);
    handleCreateSession();
  };

  // 🎯 NAVIGATION VERS UN MODULE SPÉCIFIQUE
  const handleModuleClick = (moduleId: number) => {
    setShowOnboarding(false);

    switch (moduleId) {
      case 0:
        // 🎯 NOUVEAU Workshop 1 Intelligent
        navigate('/training/workshop1');
        break;
      case 1:
        // Découverte d'EBIOS RM - Session de base
        navigate('/training/session/session_healthcare_chu_2024');
        break;
      case 2:
        // Cas d'étude pratique - Session avec cas réel
        navigate('/training/session/session_healthcare_chu_2024?mode=case-study');
        break;
      case 3:
        // Ateliers interactifs - Session avec tous les ateliers
        navigate('/training/session/session_healthcare_chu_2024?mode=workshops');
        break;
      case 4:
        // Chat avec l'expert - Session chat libre
        navigate('/training/session/session_healthcare_chu_2024?mode=expert-chat');
        break;
      default:
        handleCreateSession();
    }
  };

  // 🎯 RENDU DE L'ONBOARDING GUIDÉ
  const renderOnboarding = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎓 Bienvenue dans votre Formation EBIOS RM</h1>
              <p className="text-blue-100 text-lg">
                Apprenez la méthodologie de gestion des risques avec l'assistance de l'Intelligence Artificielle
              </p>
            </div>
            <button
              onClick={() => setShowOnboarding(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-8">
          {/* Parcours d'apprentissage */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-600" />
              Votre parcours d'apprentissage
            </h2>

            <div className="grid gap-4">
              {learningSteps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => step.status === 'available' && handleModuleClick(step.id)}
                  className={`
                    flex items-center p-6 rounded-xl border-2 transition-all relative
                    ${step.isNew
                      ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 hover:border-emerald-300 cursor-pointer hover:shadow-lg'
                      : step.status === 'available'
                      ? 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer hover:shadow-md'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mr-4
                    ${step.isNew
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      : step.status === 'available'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500'
                    }
                  `}>
                    <step.icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{step.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{step.duration}</span>
                    </div>
                  </div>

                  <div className="ml-4">
                    {step.status === 'available' ? (
                      <div className="flex flex-col items-end">
                        {step.isNew && (
                          <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-2">
                            🚀 NOUVEAU
                          </span>
                        )}
                        <div className={`flex items-center ${step.isNew ? 'text-emerald-600' : 'text-blue-600'}`}>
                          <span className="text-sm font-medium mr-2">Commencer</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        Bientôt disponible
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages de la formation */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Pourquoi cette formation ?
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Certifiée ANSSI</h4>
                <p className="text-sm text-gray-600">Formation conforme aux standards ANSSI</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">IA Interactive</h4>
                <p className="text-sm text-gray-600">Assistance personnalisée par l'IA</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Cas Réels</h4>
                <p className="text-sm text-gray-600">Études de cas du secteur santé</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartLearning}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center text-lg font-semibold shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer ma formation
            </button>

            <button
              onClick={() => setShowOnboarding(false)}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center text-lg font-medium"
            >
              Explorer d'abord
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 🎯 RENDU DES MÉTRIQUES
  const renderMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Sessions totales</p>
            <p className="text-2xl font-bold">{metrics.totalSessions}</p>
          </div>
          <BookOpen className="w-8 h-8 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Sessions terminées</p>
            <p className="text-2xl font-bold">{metrics.completedSessions}</p>
          </div>
          <Award className="w-8 h-8 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Taux de réussite</p>
            <p className="text-2xl font-bold">{metrics.averageCompletionRate.toFixed(0)}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm">Apprenants</p>
            <p className="text-2xl font-bold">{metrics.totalLearners}</p>
          </div>
          <Users className="w-8 h-8 text-yellow-200" />
        </div>
      </div>
    </div>
  );

  // 🎯 RENDU DES SESSIONS
  const renderSessions = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des sessions...</span>
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <div className="text-center py-12">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎓 Prêt à maîtriser EBIOS RM ?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Découvrez la méthodologie de gestion des risques cyber avec une formation interactive
              assistée par l'Intelligence Artificielle
            </p>
          </div>

          {/* Étapes rapides */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Apprenez les bases</h4>
              <p className="text-sm text-gray-600">Découvrez les concepts fondamentaux d'EBIOS RM</p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pratiquez sur un cas réel</h4>
              <p className="text-sm text-gray-600">Analysez un CHU métropolitain avec l'IA</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Obtenez votre certification</h4>
              <p className="text-sm text-gray-600">Validez vos compétences EBIOS RM</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <button
              onClick={() => setShowOnboarding(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center mx-auto text-lg font-semibold shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer ma formation maintenant
            </button>

            <button
              onClick={handleCreateSession}
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center mx-auto"
            >
              <Zap className="w-4 h-4 mr-2" />
              Accès direct à la session
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {session.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{session.organization}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {session.estimatedDuration}
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {session.sector}
                  </span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {session.status === 'completed' ? 'Terminée' :
                     session.status === 'active' ? 'En cours' : 'Disponible'}
                  </span>
                </div>
                
                {/* Barre de progression */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${session.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex space-x-2">
                <button
                  onClick={() => navigate(`/training/session/${session.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Play className="w-4 h-4 mr-1" />
                  {session.status === 'active' ? 'Continuer' : 'Commencer'}
                </button>
                
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 🎯 RENDU PRINCIPAL
  return (
    <div className="training-page p-6">
      {/* 🎯 ONBOARDING MODAL */}
      {showOnboarding && renderOnboarding()}
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/missions')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Retour</span>
            </button>
            
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Formation EBIOS RM Interactive
              </h1>
              <p className="text-gray-600">
                Apprenez la méthodologie EBIOS Risk Manager avec l'assistance de l'IA
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {/* 🎯 NOUVEAU BOUTON WORKSHOP 1 INTELLIGENT */}
            <button
              onClick={() => navigate('/training/workshop1')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-md hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-lg"
            >
              <Brain className="w-4 h-4 mr-2" />
              Workshop 1 IA
              <span className="ml-2 bg-emerald-500 bg-opacity-30 text-emerald-100 px-2 py-0.5 rounded-full text-xs font-medium">
                NOUVEAU
              </span>
            </button>

            <button
              onClick={loadSessions}
              disabled={loading}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>

            <button
              onClick={handleCreateSession}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle formation
            </button>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Métriques */}
      {renderMetrics()}

      {/* Sessions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Mes sessions de formation
          </h2>
        </div>
        <div className="p-6">
          {renderSessions()}
        </div>
      </div>
    </div>
  );
};

export default TrainingPageIndependent;

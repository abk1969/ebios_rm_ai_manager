/**
 * 🎓 PAGE FORMATION - INTÉGRATION PRINCIPALE
 * Page d'accueil du module formation avec liste des sessions
 * Intégration Redux + Module Formation
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SafeTrainingWrapper } from '@/modules/training/SafeTrainingWrapper';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  loadTrainingSessions, 
  loadLearners, 
  createTrainingSession,
  setTrainingModuleOpen,
  selectTrainingState,
  selectTrainingMetrics,
  selectTrainingLoading,
  selectTrainingErrors
} from '@/store/slices/trainingSlice';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  Plus, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  Play,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
const TrainingPage: React.FC = () => {
  // 🎪 HOOKS
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  // 🎯 ÉTAT REDUX
  const trainingState = useAppSelector(selectTrainingState);
  const metrics = useAppSelector(selectTrainingMetrics);
  const loading = useAppSelector(selectTrainingLoading);
  const errors = useAppSelector(selectTrainingErrors);
  
  // 🎯 ÉTAT LOCAL
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🔄 INITIALISATION
  useEffect(() => {
    if (user?.uid) {
      dispatch(loadTrainingSessions(user.uid));
      dispatch(loadLearners(user.organization || 'default'));
    }
    
    // Marquer le module comme ouvert
    dispatch(setTrainingModuleOpen(true));
    
    return () => {
      dispatch(setTrainingModuleOpen(false));
    };
  }, [dispatch, user]);

  // 🎯 GESTION CRÉATION SESSION
  const handleCreateSession = async () => {
    if (!user?.uid) return;
    
    try {
      const result = await dispatch(createTrainingSession({
        learnerId: user.uid,
        workshopSequence: [1, 2, 3, 4, 5],
        sectorCustomization: 'generic'
      })).unwrap();
      
      if (result.success) {
        navigate(`/training/session/${result.sessionId}`);
      }
    } catch (error) {
      console.error('Erreur création session:', error);
    }
  };

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
    if (loading.sessions) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des sessions...</span>
        </div>
      );
    }

    if (trainingState.sessions.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune session de formation
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez votre première formation EBIOS RM interactive
          </p>
          <button
            onClick={handleCreateSession}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Créer ma première session
          </button>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {trainingState.sessions.map((session) => (
          <div
            key={session.id.value}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Formation EBIOS RM - Session {session.id.value.slice(-8)}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.floor(session.progress.timeSpent / 60)}h{session.progress.timeSpent % 60}m
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {session.completionPercentage.toFixed(0)}% terminé
                  </span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.isActive ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {session.status === 'completed' ? 'Terminée' :
                     session.isActive ? 'En cours' : 'En pause'}
                  </span>
                </div>
                
                {/* Barre de progression */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${session.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex space-x-2">
                <button
                  onClick={() => navigate(`/training/session/${session.id.value}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Play className="w-4 h-4 mr-1" />
                  {session.isActive ? 'Continuer' : 'Reprendre'}
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
    <SafeTrainingWrapper
      onError={(error) => console.error('Erreur formation:', error)}
      onBack={() => navigate('/dashboard')}
    >
      <div className="training-page p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Formation EBIOS RM Interactive
            </h1>
            <p className="text-gray-600">
              Apprenez la méthodologie EBIOS Risk Manager avec l'assistance de l'IA
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => dispatch(loadTrainingSessions(user?.uid || ''))}
              disabled={loading.sessions}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading.sessions ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            
            <button
              onClick={handleCreateSession}
              disabled={loading.sessions}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle formation
            </button>
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {(errors.sessions || errors.general) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            {errors.sessions || errors.general}
          </p>
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
    </SafeTrainingWrapper>
  );
};

export default TrainingPage;

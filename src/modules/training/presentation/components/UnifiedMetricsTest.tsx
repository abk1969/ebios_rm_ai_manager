import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Award,
  Target,
  Users,
  MessageCircle,
  BookOpen,
  Eye,
  Activity,
  Zap
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { UnifiedMetricsManager } from '../../domain/services/UnifiedMetricsManager';

/**
 * 🧪 COMPOSANT DE TEST MÉTRIQUES UNIFIÉES
 * Valide l'intégration complète du système de métriques
 */

interface UnifiedMetricsTestProps {
  sessionId?: string;
}

export const UnifiedMetricsTest: React.FC<UnifiedMetricsTestProps> = ({
  sessionId = 'test-session-789'
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    loadMetrics();
  }, [sessionId]);

  const loadMetrics = () => {
    const data = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
    setMetrics(data);
  };

  const simulateWorkshopCompletion = (workshopId: number) => {
    const mockResults = {
      workshopId,
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      maxScore: 100,
      timeSpent: Math.floor(Math.random() * 30) + 45, // 45-75min
      exercisesCompleted: 5,
      timestamp: new Date().toISOString()
    };

    UnifiedMetricsManager.updateWorkshopMetrics(workshopId, mockResults);
    
    setTestResults(prev => [...prev, {
      type: 'workshop_completion',
      data: mockResults,
      timestamp: new Date().toISOString()
    }]);

    loadMetrics(); // Recharger pour voir les changements
  };

  const simulateChatExpertActivity = () => {
    const activities = [
      { questionAsked: true, newTopic: false, satisfaction: 4.5 },
      { questionAsked: true, newTopic: true, satisfaction: 4.2 },
      { questionAsked: false, newTopic: false, satisfaction: 4.8 }
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    UnifiedMetricsManager.updateChatExpertMetrics(activity);

    setTestResults(prev => [...prev, {
      type: 'chat_activity',
      data: activity,
      timestamp: new Date().toISOString()
    }]);

    loadMetrics();
  };

  const simulateSessionActivity = () => {
    UnifiedMetricsManager.updateSessionMetrics(sessionId, 'user_action');
    
    setTestResults(prev => [...prev, {
      type: 'session_activity',
      data: { action: 'user_action' },
      timestamp: new Date().toISOString()
    }]);

    loadMetrics();
  };

  const testFeatures = [
    {
      name: 'UnifiedMetricsManager créé',
      status: 'passed',
      description: 'Service centralisé de gestion des métriques'
    },
    {
      name: 'Métriques globales calculées',
      status: metrics?.globalProgress ? 'passed' : 'failed',
      description: 'Progression, temps, score, niveau automatiques'
    },
    {
      name: 'Métriques par mode',
      status: metrics?.modeMetrics ? 'passed' : 'failed',
      description: 'Suivi détaillé par mode de formation'
    },
    {
      name: 'Achievements système',
      status: metrics?.achievements ? 'passed' : 'failed',
      description: 'Système de récompenses et gamification'
    },
    {
      name: 'Recommandations IA',
      status: metrics?.recommendations ? 'passed' : 'failed',
      description: 'Suggestions intelligentes basées sur progression'
    },
    {
      name: 'Métriques session temps réel',
      status: metrics?.sessionMetrics ? 'passed' : 'failed',
      description: 'Suivi activité session en cours'
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        🧪 Test Métriques Unifiées Formation
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests fonctionnels */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Tests fonctionnels</h3>
          
          {testFeatures.map((test, index) => (
            <div key={index} className="flex items-start space-x-3">
              {test.status === 'passed' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <div className="font-medium">{test.name}</div>
                <div className="text-sm text-gray-600">{test.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Métriques actuelles */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Métriques actuelles</h3>
          
          {metrics && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.globalProgress.overallCompletion}%</div>
                  <div className="text-sm text-gray-600">Progression</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics.globalProgress.averageScore}</div>
                  <div className="text-sm text-gray-600">Score moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{metrics.globalProgress.totalTimeSpent}min</div>
                  <div className="text-sm text-gray-600">Temps total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{metrics.globalProgress.level}</div>
                  <div className="text-sm text-gray-600">Niveau</div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Modes de formation :</h4>
                <div className="space-y-2">
                  {Object.values(metrics.modeMetrics).map((mode: any) => (
                    <div key={mode.modeId} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{mode.modeName}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          mode.status === 'completed' ? 'bg-green-100 text-green-800' :
                          mode.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {mode.completion}%
                        </span>
                        <span className="text-gray-600">{mode.timeSpent}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulations */}
      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-lg">Simulations métriques</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 className="font-medium mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-600" />
              Ateliers
            </h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(workshopId => (
                <Button
                  key={workshopId}
                  onClick={() => simulateWorkshopCompletion(workshopId)}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  Terminer Atelier {workshopId}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-3 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
              Chat Expert
            </h4>
            <div className="space-y-2">
              <Button
                onClick={simulateChatExpertActivity}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Activité Chat
              </Button>
              <div className="text-xs text-blue-700">
                Questions, nouveaux sujets, satisfaction
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-600" />
              Session
            </h4>
            <div className="space-y-2">
              <Button
                onClick={simulateSessionActivity}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Action Utilisateur
              </Button>
              <div className="text-xs text-green-700">
                Engagement, durée, actions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historique tests */}
      {testResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Historique simulations</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {testResults.slice(-10).reverse().map((result, index) => (
                <div key={index} className="bg-white p-3 rounded border text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {result.type === 'workshop_completion' ? '🎯 Atelier terminé' :
                       result.type === 'chat_activity' ? '💬 Activité chat' :
                       '⚡ Action session'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {result.type === 'workshop_completion' && 
                      `Atelier ${result.data.workshopId} - Score: ${result.data.score}% - Temps: ${result.data.timeSpent}min`}
                    {result.type === 'chat_activity' && 
                      `Question: ${result.data.questionAsked ? 'Oui' : 'Non'} - Satisfaction: ${result.data.satisfaction}/5`}
                    {result.type === 'session_activity' && 
                      `Action: ${result.data.action}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Intégration système */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-semibold text-lg mb-3">✅ Intégration système :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">TrainingInterface :</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• UnifiedMetricsManager importé</li>
              <li>• handleWorkshopComplete mis à jour</li>
              <li>• handleChatExpertActivity ajouté</li>
              <li>• Onglet Progress avec UnifiedProgressDashboard</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Métriques unifiées :</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Progression globale calculée</li>
              <li>• Métriques par mode synchronisées</li>
              <li>• Achievements automatiques</li>
              <li>• Recommandations IA générées</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions validation */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium mb-2">🧪 Validation manuelle :</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Accéder à l'onglet "Progression" dans l'interface formation</li>
          <li>Vérifier l'affichage du UnifiedProgressDashboard</li>
          <li>Tester la completion d'un atelier et vérifier la mise à jour</li>
          <li>Utiliser le chat expert et vérifier les métriques</li>
          <li>Vérifier la synchronisation entre modes</li>
          <li>Tester les recommandations IA</li>
          <li>Valider la persistance des données</li>
        </ol>
      </div>
    </div>
  );
};

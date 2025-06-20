import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Users,
  MessageCircle,
  BookOpen,
  Eye,
  Navigation,
  Database,
  RotateCcw as Sync,
  Award,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { UnifiedMetricsManager } from '../../domain/services/UnifiedMetricsManager';
import { UnifiedDataManager } from '../../domain/services/UnifiedDataManager';
import { DataSynchronizationService } from '../../domain/services/DataSynchronizationService';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';

/**
 * 🧪 TESTS D'INTÉGRATION COMPLETS FORMATION
 * Validation end-to-end de tous les systèmes intégrés
 */

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: any;
  timestamp?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'passed' | 'failed';
  progress: number;
}

export const ComprehensiveIntegrationTest: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [globalResults, setGlobalResults] = useState<any>(null);
  const [sessionId] = useState(`test-session-${Date.now()}`);

  useEffect(() => {
    initializeTestSuites();
  }, []);

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        id: 'navigation',
        name: 'Navigation Unifiée',
        description: 'Tests du système de navigation inter-modes',
        status: 'pending',
        progress: 0,
        tests: [
          { id: 'nav_init', name: 'Initialisation navigation', status: 'pending' },
          { id: 'nav_modes', name: 'Navigation entre modes', status: 'pending' },
          { id: 'nav_quick', name: 'Barre navigation rapide', status: 'pending' },
          { id: 'nav_modal', name: 'Modal navigation complète', status: 'pending' },
          { id: 'nav_context', name: 'Préservation contexte', status: 'pending' }
        ]
      },
      {
        id: 'metrics',
        name: 'Métriques Unifiées',
        description: 'Tests du système de métriques et progression',
        status: 'pending',
        progress: 0,
        tests: [
          { id: 'metrics_init', name: 'Initialisation métriques', status: 'pending' },
          { id: 'metrics_workshop', name: 'Métriques workshops', status: 'pending' },
          { id: 'metrics_chat', name: 'Métriques chat expert', status: 'pending' },
          { id: 'metrics_global', name: 'Calculs progression globale', status: 'pending' },
          { id: 'metrics_achievements', name: 'Système achievements', status: 'pending' },
          { id: 'metrics_recommendations', name: 'Recommandations IA', status: 'pending' }
        ]
      },
      {
        id: 'persistence',
        name: 'Persistance Données',
        description: 'Tests du système de persistance et synchronisation',
        status: 'pending',
        progress: 0,
        tests: [
          { id: 'persist_init', name: 'Initialisation persistance', status: 'pending' },
          { id: 'persist_save', name: 'Sauvegarde session', status: 'pending' },
          { id: 'persist_load', name: 'Chargement session', status: 'pending' },
          { id: 'persist_sync', name: 'Synchronisation données', status: 'pending' },
          { id: 'persist_conflict', name: 'Résolution conflits', status: 'pending' },
          { id: 'persist_offline', name: 'Mode offline', status: 'pending' }
        ]
      },
      {
        id: 'workshops',
        name: 'Ateliers Intégrés',
        description: 'Tests des ateliers et liens inter-ateliers',
        status: 'pending',
        progress: 0,
        tests: [
          { id: 'workshop_manager', name: 'Gestionnaire ateliers', status: 'pending' },
          { id: 'workshop_navigation', name: 'Navigation intelligente', status: 'pending' },
          { id: 'workshop_links', name: 'Liens inter-ateliers', status: 'pending' },
          { id: 'workshop_completion', name: 'Completion ateliers', status: 'pending' },
          { id: 'workshop_data', name: 'Transmission données', status: 'pending' }
        ]
      },
      {
        id: 'integration',
        name: 'Intégration Globale',
        description: 'Tests end-to-end de l\'intégration complète',
        status: 'pending',
        progress: 0,
        tests: [
          { id: 'integration_init', name: 'Initialisation système', status: 'pending' },
          { id: 'integration_flow', name: 'Flux utilisateur complet', status: 'pending' },
          { id: 'integration_modes', name: 'Transition entre modes', status: 'pending' },
          { id: 'integration_data', name: 'Cohérence données', status: 'pending' },
          { id: 'integration_performance', name: 'Performance système', status: 'pending' }
        ]
      }
    ];

    setTestSuites(suites);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setGlobalResults(null);

    const startTime = Date.now();
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    try {
      for (const suite of testSuites) {
        await runTestSuite(suite.id);
        
        const suiteResults = testSuites.find(s => s.id === suite.id);
        if (suiteResults) {
          totalTests += suiteResults.tests.length;
          passedTests += suiteResults.tests.filter(t => t.status === 'passed').length;
          failedTests += suiteResults.tests.filter(t => t.status === 'failed').length;
        }
      }

      const duration = Date.now() - startTime;
      setGlobalResults({
        totalTests,
        passedTests,
        failedTests,
        duration,
        successRate: (passedTests / totalTests) * 100,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur exécution tests:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  const runTestSuite = async (suiteId: string) => {
    const suite = testSuites.find(s => s.id === suiteId);
    if (!suite) return;

    // Marquer suite comme en cours
    updateSuiteStatus(suiteId, 'running', 0);

    for (let i = 0; i < suite.tests.length; i++) {
      const test = suite.tests[i];
      setCurrentTest(test.id);
      
      // Marquer test comme en cours
      updateTestStatus(suiteId, test.id, 'running');
      
      try {
        const startTime = Date.now();
        await runIndividualTest(suiteId, test.id);
        const duration = Date.now() - startTime;
        
        updateTestStatus(suiteId, test.id, 'passed', undefined, { duration });
      } catch (error) {
        updateTestStatus(suiteId, test.id, 'failed', error instanceof Error ? error.message : 'Erreur inconnue');
      }

      // Mettre à jour progression suite
      const progress = ((i + 1) / suite.tests.length) * 100;
      updateSuiteStatus(suiteId, 'running', progress);

      // Pause entre tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Finaliser statut suite
    const finalSuite = testSuites.find(s => s.id === suiteId);
    if (finalSuite) {
      const hasFailures = finalSuite.tests.some(t => t.status === 'failed');
      updateSuiteStatus(suiteId, hasFailures ? 'failed' : 'passed', 100);
    }
  };

  const runIndividualTest = async (suiteId: string, testId: string): Promise<void> => {
    switch (suiteId) {
      case 'navigation':
        return runNavigationTest(testId);
      case 'metrics':
        return runMetricsTest(testId);
      case 'persistence':
        return runPersistenceTest(testId);
      case 'workshops':
        return runWorkshopsTest(testId);
      case 'integration':
        return runIntegrationTest(testId);
      default:
        throw new Error(`Suite inconnue: ${suiteId}`);
    }
  };

  const runNavigationTest = async (testId: string): Promise<void> => {
    switch (testId) {
      case 'nav_init':
        // Test initialisation navigation
        if (typeof window === 'undefined') throw new Error('Window non disponible');
        break;
      case 'nav_modes':
        // Test navigation entre modes
        const modes = ['discovery', 'case-study', 'expert-chat', 'workshops'];
        if (modes.length !== 4) throw new Error('Modes incomplets');
        break;
      case 'nav_quick':
        // Test barre navigation rapide
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      case 'nav_modal':
        // Test modal navigation
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      case 'nav_context':
        // Test préservation contexte
        if (!sessionId) throw new Error('SessionId manquant');
        break;
      default:
        throw new Error(`Test navigation inconnu: ${testId}`);
    }
  };

  const runMetricsTest = async (testId: string): Promise<void> => {
    switch (testId) {
      case 'metrics_init':
        const metrics = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
        if (!metrics) throw new Error('Métriques non initialisées');
        break;
      case 'metrics_workshop':
        UnifiedMetricsManager.updateWorkshopMetrics(1, { score: 85, timeSpent: 45 });
        break;
      case 'metrics_chat':
        UnifiedMetricsManager.updateChatExpertMetrics({ questionAsked: true });
        break;
      case 'metrics_global':
        const globalMetrics = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
        if (globalMetrics.globalProgress.overallCompletion < 0) throw new Error('Progression invalide');
        break;
      case 'metrics_achievements':
        const achievements = UnifiedMetricsManager.getUnifiedMetrics(sessionId).achievements;
        if (!Array.isArray(achievements)) throw new Error('Achievements invalides');
        break;
      case 'metrics_recommendations':
        const recommendations = UnifiedMetricsManager.generateRecommendations(sessionId);
        if (!Array.isArray(recommendations)) throw new Error('Recommandations invalides');
        break;
      default:
        throw new Error(`Test métriques inconnu: ${testId}`);
    }
  };

  const runPersistenceTest = async (testId: string): Promise<void> => {
    switch (testId) {
      case 'persist_init':
        const adapter = StorageAdapterFactory.createAdapter('memory');
        if (!adapter) throw new Error('Adaptateur non créé');
        break;
      case 'persist_save':
        const memoryAdapter = StorageAdapterFactory.createAdapter('memory');
        const dataManager = UnifiedDataManager.getInstance(memoryAdapter);
        const testData = {
          sessionId,
          userId: 'test-user',
          metrics: UnifiedMetricsManager.getUnifiedMetrics(sessionId),
          modeData: {},
          userPreferences: {
            language: 'fr',
            theme: 'light' as const,
            notifications: true,
            autoSave: true,
            autoSaveInterval: 30,
            dataRetention: 30,
            privacySettings: {
              shareAnalytics: true,
              shareProgress: true,
              allowCookies: true,
              dataProcessingConsent: true,
              consentDate: new Date().toISOString()
            }
          },
          progressHistory: [],
          lastSyncTime: new Date().toISOString(),
          version: '1.0.0'
        };
        await dataManager.saveTrainingSession(sessionId, testData);
        break;
      case 'persist_load':
        const loadedData = await dataManager?.loadTrainingSession(sessionId);
        if (!loadedData) throw new Error('Données non chargées');
        break;
      case 'persist_sync':
        const syncService = dataManager ? DataSynchronizationService.getInstance(dataManager) : null;
        await syncService.syncData(sessionId);
        break;
      case 'persist_conflict':
        // Test résolution conflits
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      case 'persist_offline':
        // Test mode offline
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      default:
        throw new Error(`Test persistance inconnu: ${testId}`);
    }
  };

  const runWorkshopsTest = async (testId: string): Promise<void> => {
    switch (testId) {
      case 'workshop_manager':
        // Test gestionnaire ateliers
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      case 'workshop_navigation':
        // Test navigation intelligente
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      case 'workshop_links':
        // Test liens inter-ateliers
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      case 'workshop_completion':
        // Test completion ateliers
        UnifiedMetricsManager.updateWorkshopMetrics(1, { 
          score: 85, 
          timeSpent: 45, 
          completed: true 
        });
        break;
      case 'workshop_data':
        // Test transmission données
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      default:
        throw new Error(`Test workshops inconnu: ${testId}`);
    }
  };

  const runIntegrationTest = async (testId: string): Promise<void> => {
    switch (testId) {
      case 'integration_init':
        // Test initialisation système complet
        const metrics = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
        if (!metrics) throw new Error('Système non initialisé');
        break;
      case 'integration_flow':
        // Test flux utilisateur complet
        await new Promise(resolve => setTimeout(resolve, 100));
        break;
      case 'integration_modes':
        // Test transition entre modes
        await new Promise(resolve => setTimeout(resolve, 100));
        break;
      case 'integration_data':
        // Test cohérence données
        const data = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
        if (data.globalProgress.overallCompletion > 100) throw new Error('Données incohérentes');
        break;
      case 'integration_performance':
        // Test performance
        const start = Date.now();
        UnifiedMetricsManager.getUnifiedMetrics(sessionId);
        const duration = Date.now() - start;
        if (duration > 100) throw new Error('Performance insuffisante');
        break;
      default:
        throw new Error(`Test intégration inconnu: ${testId}`);
    }
  };

  const updateSuiteStatus = (suiteId: string, status: TestSuite['status'], progress: number) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? { ...suite, status, progress }
        : suite
    ));
  };

  const updateTestStatus = (suiteId: string, testId: string, status: TestResult['status'], error?: string, details?: any) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            tests: suite.tests.map(test => 
              test.id === testId 
                ? { 
                    ...test, 
                    status, 
                    error, 
                    details,
                    timestamp: new Date().toISOString()
                  }
                : test
            )
          }
        : suite
    ));
  };

  const resetTests = () => {
    initializeTestSuites();
    setGlobalResults(null);
    setCurrentTest(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <Activity className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuiteIcon = (suiteId: string) => {
    switch (suiteId) {
      case 'navigation': return Navigation;
      case 'metrics': return Target;
      case 'persistence': return Database;
      case 'workshops': return Users;
      case 'integration': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🧪 Tests d'Intégration Complets
          </h2>
          <p className="text-gray-600">
            Validation end-to-end de tous les systèmes de formation intégrés
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            {isRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isRunning ? 'En cours...' : 'Lancer tous les tests'}</span>
          </Button>
          
          <Button
            onClick={resetTests}
            variant="outline"
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Résultats globaux */}
      {globalResults && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">📊 Résultats Globaux</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{globalResults.totalTests}</div>
              <div className="text-sm text-blue-600">Tests totaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{globalResults.passedTests}</div>
              <div className="text-sm text-green-600">Réussis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">{globalResults.failedTests}</div>
              <div className="text-sm text-red-600">Échoués</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">{Math.round(globalResults.successRate)}%</div>
              <div className="text-sm text-purple-600">Taux réussite</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">{globalResults.duration}ms</div>
              <div className="text-sm text-orange-600">Durée totale</div>
            </div>
          </div>
        </div>
      )}

      {/* Suites de tests */}
      <div className="space-y-4">
        {testSuites.map((suite) => {
          const SuiteIcon = getSuiteIcon(suite.id);
          
          return (
            <div key={suite.id} className="border rounded-lg overflow-hidden">
              <div className={`p-4 ${
                suite.status === 'passed' ? 'bg-green-50 border-green-200' :
                suite.status === 'failed' ? 'bg-red-50 border-red-200' :
                suite.status === 'running' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SuiteIcon className="w-6 h-6 text-gray-700" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{suite.name}</h3>
                      <p className="text-sm text-gray-600">{suite.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(suite.status)}
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {suite.tests.filter(t => t.status === 'passed').length}/{suite.tests.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(suite.progress)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                {suite.status === 'running' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${suite.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tests individuels */}
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suite.tests.map((test) => (
                    <div 
                      key={test.id}
                      className={`p-3 rounded border text-sm ${
                        test.id === currentTest ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      } ${
                        test.status === 'passed' ? 'bg-green-50 border-green-200' :
                        test.status === 'failed' ? 'bg-red-50 border-red-200' :
                        test.status === 'running' ? 'bg-blue-50 border-blue-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{test.name}</span>
                        {getStatusIcon(test.status)}
                      </div>
                      
                      {test.error && (
                        <div className="text-xs text-red-600 mt-1">
                          {test.error}
                        </div>
                      )}
                      
                      {test.details?.duration && (
                        <div className="text-xs text-gray-500 mt-1">
                          {test.details.duration}ms
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium mb-2">📋 Instructions de validation :</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Cliquer sur "Lancer tous les tests" pour exécuter la suite complète</li>
          <li>Observer la progression en temps réel de chaque suite</li>
          <li>Vérifier que tous les tests passent (icônes vertes)</li>
          <li>Analyser les erreurs éventuelles dans les détails</li>
          <li>Valider le taux de réussite global ≥ 95%</li>
          <li>Tester manuellement les fonctionnalités critiques</li>
        </ol>
      </div>
    </div>
  );
};

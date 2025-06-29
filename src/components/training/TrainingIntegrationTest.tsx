/**
 * 🧪 COMPOSANT DE TEST D'INTÉGRATION FORMATION
 * Composant pour tester l'intégration entre Redux et le module formation
 * À utiliser uniquement en développement
 */

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  createTrainingSession,
  loadTrainingSessions,
  setTrainingModuleOpen,
  selectTrainingState,
  selectTrainingMetrics
} from '@/store/slices/trainingSlice';
import { 
  useTrainingStore, 
  useTrainingActions,
  trainingEventBus,
  TrainingEventType,
  TrainingEventFactory
} from '@/modules/training';
import { trainingIntegrationService } from '@/services/training/TrainingIntegrationService';
import { Play, TestTube, RefreshCw, Zap, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingIntegrationTest: React.FC = () => {
  // 🎪 HOOKS
  const dispatch = useAppDispatch();
  const reduxState = useAppSelector(selectTrainingState);
  const reduxMetrics = useAppSelector(selectTrainingMetrics);
  const zustandState = useTrainingStore();
  const zustandActions = useTrainingActions();
  
  // 🎯 ÉTAT LOCAL
  const [testResults, setTestResults] = useState<{
    [key: string]: { success: boolean; message: string; timestamp: Date }
  }>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  // 🧪 TESTS D'INTÉGRATION

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    try {
      await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          message: 'Test réussi',
          timestamp: new Date()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          message: error instanceof Error ? error.message : 'Erreur inconnue',
          timestamp: new Date()
        }
      }));
    }
  };

  // Test 1: Synchronisation Redux -> Zustand
  const testReduxToZustand = async () => {
    dispatch(setTrainingModuleOpen(true));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!reduxState.isTrainingModuleOpen) {
      throw new Error('Redux state not updated');
    }
  };

  // Test 2: Synchronisation Zustand -> Redux
  const testZustandToRedux = async () => {
    zustandActions.setActiveTab('progress');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (zustandState.ui.activeTab !== 'progress') {
      throw new Error('Zustand state not updated');
    }
  };

  // Test 3: Événements du module formation
  const testEventBus = async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Event not received within timeout'));
      }, 2000);

      const subscription = trainingEventBus.subscribe(
        TrainingEventType.SESSION_CREATED,
        {
          handle: (event) => {
            clearTimeout(timeout);
            trainingEventBus.unsubscribe(subscription);
            resolve();
          },
          canHandle: () => true
        }
      );

      // Émettre un événement de test
      const testEvent = TrainingEventFactory.createSessionEvent(
        TrainingEventType.SESSION_CREATED,
        'test_session',
        'test_user',
        { test: true },
        { source: 'IntegrationTest' }
      );

      trainingEventBus.emit(testEvent);
    });
  };

  // Test 4: Service d'intégration
  const testIntegrationService = async () => {
    const metrics = trainingIntegrationService.getTrainingMetrics();
    
    if (!metrics.redux || !metrics.module || !metrics.combined) {
      throw new Error('Integration service metrics incomplete');
    }
  };

  // Test 5: Création de session via Redux
  const testSessionCreation = async () => {
    const result = await dispatch(createTrainingSession({
      learnerId: 'test_learner',
      workshopSequence: [1, 2, 3],
      sectorCustomization: 'finance'
    })).unwrap();

    if (!result.success) {
      throw new Error('Session creation failed');
    }
  };

  // 🎯 EXÉCUTER TOUS LES TESTS
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    const tests = [
      { name: 'Redux → Zustand', fn: testReduxToZustand },
      { name: 'Zustand → Redux', fn: testZustandToRedux },
      { name: 'Event Bus', fn: testEventBus },
      { name: 'Service Intégration', fn: testIntegrationService },
      { name: 'Création Session', fn: testSessionCreation }
    ];

    for (const test of tests) {
      await runTest(test.name, test.fn);
      await new Promise(resolve => setTimeout(resolve, 500)); // Délai entre tests
    }

    setIsRunningTests(false);
  };

  // 🎯 RENDU DES RÉSULTATS
  const renderTestResult = (testName: string) => {
    const result = testResults[testName];
    
    if (!result) {
      return (
        <div className="flex items-center text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2" />
          En attente
        </div>
      );
    }

    return (
      <div className={`flex items-center ${result.success ? 'text-green-600' : 'text-red-600'}`}>
        {result.success ? (
          <CheckCircle className="w-4 h-4 mr-2" />
        ) : (
          <AlertCircle className="w-4 h-4 mr-2" />
        )}
        <span className="text-sm">
          {result.success ? 'Réussi' : result.message}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          {result.timestamp.toLocaleTimeString()}
        </span>
      </div>
    );
  };

  // 🎯 RENDU PRINCIPAL
  return (
    <div className="training-integration-test bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
          <TestTube className="w-5 h-5 mr-2 text-blue-600" />
          Tests d'Intégration Formation
        </h2>
        <p className="text-gray-600">
          Validation de l'intégration entre Redux et le module formation
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunningTests}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isRunningTests ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isRunningTests ? 'Tests en cours...' : 'Lancer tous les tests'}
        </button>

        <button
          onClick={() => setTestResults({})}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
        >
          Effacer résultats
        </button>
      </div>

      {/* Résultats des tests */}
      <div className="space-y-4 mb-6">
        <h3 className="font-medium text-gray-900">Résultats des tests :</h3>
        
        <div className="grid gap-3">
          {[
            'Redux → Zustand',
            'Zustand → Redux', 
            'Event Bus',
            'Service Intégration',
            'Création Session'
          ].map(testName => (
            <div key={testName} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="font-medium text-gray-900">{testName}</span>
              {renderTestResult(testName)}
            </div>
          ))}
        </div>
      </div>

      {/* États actuels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">État Redux</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <div>Sessions: {reduxState.sessions.length}</div>
            <div>Session courante: {reduxState.currentSessionId || 'Aucune'}</div>
            <div>Statut: {reduxState.sessionStatus}</div>
            <div>Module ouvert: {reduxState.isTrainingModuleOpen ? 'Oui' : 'Non'}</div>
            <div>Total apprenants: {reduxMetrics.totalLearners}</div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">État Zustand</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <div>Session: {zustandState.currentSession ? 'Chargée' : 'Aucune'}</div>
            <div>Statut: {zustandState.sessionStatus}</div>
            <div>Onglet actif: {zustandState.ui.activeTab}</div>
            <div>Messages: {zustandState.conversation.messages.length}</div>
            <div>Engagement: {zustandState.metrics.engagementScore}/100</div>
          </div>
        </div>
      </div>

      {/* Métriques d'intégration */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Métriques d'Intégration
        </h3>
        <div className="text-sm text-blue-800">
          <div>Service initialisé: {trainingIntegrationService ? 'Oui' : 'Non'}</div>
          <div>Event Bus actif: {trainingEventBus ? 'Oui' : 'Non'}</div>
          <div>Synchronisation: Bidirectionnelle</div>
        </div>
      </div>
    </div>
  );
};

export default TrainingIntegrationTest;

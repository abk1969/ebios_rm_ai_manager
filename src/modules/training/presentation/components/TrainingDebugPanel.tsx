/**
 * 🐛 PANNEAU DE DEBUG POUR LE MODULE FORMATION
 * Composant de développement pour tester et déboguer le module
 */

import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Code,
  Database,
  MessageSquare
} from 'lucide-react';
import { AgentOrchestrator } from '../../domain/services/AgentOrchestrator';
import { runAllTests } from '../../test-integration';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

export const TrainingDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [orchestrator, setOrchestrator] = useState<AgentOrchestrator | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<any>(null);

  // Initialiser l'orchestrateur
  useEffect(() => {
    const orch = new AgentOrchestrator();
    setOrchestrator(orch);
  }, []);

  // Tests individuels
  const runIndividualTest = async (testName: string) => {
    if (!orchestrator) return;

    setTestResults(prev => prev.map(test => 
      test.name === testName 
        ? { ...test, status: 'running' as const }
        : test
    ));

    const startTime = Date.now();

    try {
      switch (testName) {
        case 'Session Initialization':
          await orchestrator.initializeSession('debug_user', 'debug_session');
          const status = orchestrator.getSessionStatus();
          setSessionStatus(status);
          break;

        case 'Welcome Message':
          const welcome = orchestrator.getWelcomeMessage();
          if (!welcome || welcome.length < 10) throw new Error('Message trop court');
          break;

        case 'Workshop Start':
          const workshopMsg = orchestrator.startWorkshop(1);
          if (!workshopMsg || workshopMsg.length < 10) throw new Error('Message d\'atelier invalide');
          break;

        case 'Message Processing':
          const response = await orchestrator.processLearnerMessage('GO');
          if (!response || !response.text) throw new Error('Réponse invalide');
          break;

        case 'Intent Analysis':
          const analyzeIntent = (orchestrator as any)._analyzeMessageIntent.bind(orchestrator);
          const intent = analyzeIntent('Commençons l\'atelier 1');
          if (!intent || !intent.type) throw new Error('Analyse d\'intention échouée');
          break;

        default:
          throw new Error('Test non reconnu');
      }

      const duration = Date.now() - startTime;
      setTestResults(prev => prev.map(test => 
        test.name === testName 
          ? { ...test, status: 'passed' as const, duration, message: 'Test réussi' }
          : test
      ));

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => prev.map(test => 
        test.name === testName 
          ? { 
              ...test, 
              status: 'failed' as const, 
              duration, 
              message: error instanceof Error ? error.message : 'Erreur inconnue'
            }
          : test
      ));
    }
  };

  // Exécuter tous les tests
  const runAllTestsHandler = async () => {
    setIsRunningTests(true);
    
    const tests = [
      'Session Initialization',
      'Welcome Message', 
      'Workshop Start',
      'Message Processing',
      'Intent Analysis'
    ];

    setTestResults(tests.map(name => ({ name, status: 'pending' as const })));

    for (const test of tests) {
      await runIndividualTest(test);
      await new Promise(resolve => setTimeout(resolve, 500)); // Délai entre tests
    }

    setIsRunningTests(false);
  };

  // Réinitialiser les tests
  const resetTests = () => {
    setTestResults([]);
    setSessionStatus(null);
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Ouvrir le panneau de debug"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-50">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Debug Formation</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={runAllTestsHandler}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunningTests ? 'Tests en cours...' : 'Lancer tests'}
          </button>
          <button
            onClick={resetTests}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Résultats des tests */}
        {testResults.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Résultats des tests
            </h4>
            {testResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="text-sm">{test.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {test.duration && `${test.duration}ms`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statut de session */}
        {sessionStatus && (
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Statut de session
            </h4>
            <div className="p-2 bg-gray-50 rounded text-xs">
              <div>Atelier: {sessionStatus.currentWorkshop}</div>
              <div>Progression: {sessionStatus.overallProgress}%</div>
              <div>Prochaine étape: {sessionStatus.nextMilestone}</div>
            </div>
          </div>
        )}

        {/* Test rapide de message */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Test rapide
          </h4>
          <div className="grid grid-cols-2 gap-1">
            {['GO', 'CHU', 'Atelier 1', 'Aide'].map(msg => (
              <button
                key={msg}
                onClick={() => orchestrator && orchestrator.processLearnerMessage(msg)}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

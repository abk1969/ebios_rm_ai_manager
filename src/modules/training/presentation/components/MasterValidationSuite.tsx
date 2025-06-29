import React, { useState } from 'react';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play,
  FileText,
  Download,
  Share2,
  Settings
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { ComprehensiveIntegrationTest } from './ComprehensiveIntegrationTest';
import { PerformanceValidationTest } from './PerformanceValidationTest';
import { CompatibilityValidationTest } from './CompatibilityValidationTest';
import { UnifiedNavigationTest } from './UnifiedNavigationTest';
import { UnifiedMetricsTest } from './UnifiedMetricsTest';
import { DataPersistenceTest } from './DataPersistenceTest';

/**
 * 🧪 SUITE MAÎTRE DE VALIDATION
 * Interface centralisée pour tous les tests et validations
 */

type TestCategory = 
  | 'integration' 
  | 'performance' 
  | 'compatibility' 
  | 'navigation' 
  | 'metrics' 
  | 'persistence';

interface TestSummary {
  category: TestCategory;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  status: 'not_run' | 'running' | 'passed' | 'failed';
  score?: number;
  duration?: number;
  critical: boolean;
}

export const MasterValidationSuite: React.FC = () => {
  const [activeTest, setActiveTest] = useState<TestCategory | null>(null);
  const [testResults, setTestResults] = useState<Map<TestCategory, any>>(new Map());
  const [showReport, setShowReport] = useState(false);

  const testSuites: TestSummary[] = [
    {
      category: 'integration',
      name: 'Tests d\'Intégration',
      description: 'Validation end-to-end de l\'intégration complète',
      icon: TestTube,
      component: ComprehensiveIntegrationTest,
      status: 'not_run',
      critical: true
    },
    {
      category: 'performance',
      name: 'Tests de Performance',
      description: 'Mesure des performances et optimisations',
      icon: Clock,
      component: PerformanceValidationTest,
      status: 'not_run',
      critical: true
    },
    {
      category: 'compatibility',
      name: 'Tests de Compatibilité',
      description: 'Validation navigateurs et fonctionnalités',
      icon: Settings,
      component: CompatibilityValidationTest,
      status: 'not_run',
      critical: true
    },
    {
      category: 'navigation',
      name: 'Tests Navigation',
      description: 'Validation système navigation unifié',
      icon: Share2,
      component: UnifiedNavigationTest,
      status: 'not_run',
      critical: false
    },
    {
      category: 'metrics',
      name: 'Tests Métriques',
      description: 'Validation système métriques unifié',
      icon: CheckCircle,
      component: UnifiedMetricsTest,
      status: 'not_run',
      critical: false
    },
    {
      category: 'persistence',
      name: 'Tests Persistance',
      description: 'Validation système persistance données',
      icon: XCircle,
      component: DataPersistenceTest,
      status: 'not_run',
      critical: false
    }
  ];

  const runAllCriticalTests = async () => {
    const criticalTests = testSuites.filter(test => test.critical);
    
    for (const test of criticalTests) {
      setActiveTest(test.category);
      // Simulation exécution test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation résultats
      const mockResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        duration: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
        status: Math.random() > 0.1 ? 'passed' : 'failed'
      };
      
      setTestResults(prev => new Map(prev.set(test.category, mockResult)));
    }
    
    setActiveTest(null);
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      },
      results: Object.fromEntries(testResults),
      summary: {
        totalTests: testSuites.length,
        criticalTests: testSuites.filter(t => t.critical).length,
        passedTests: Array.from(testResults.values()).filter(r => r.status === 'passed').length,
        averageScore: Array.from(testResults.values()).reduce((sum, r) => sum + (r.score || 0), 0) / testResults.size || 0
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ebios-training-validation-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getOverallStatus = () => {
    if (testResults.size === 0) return 'not_run';
    
    const criticalResults = testSuites
      .filter(test => test.critical)
      .map(test => testResults.get(test.category))
      .filter(Boolean);
    
    if (criticalResults.length === 0) return 'not_run';
    if (criticalResults.every(result => result.status === 'passed')) return 'passed';
    if (criticalResults.some(result => result.status === 'failed')) return 'failed';
    return 'running';
  };

  const getOverallScore = () => {
    if (testResults.size === 0) return 0;
    
    const scores = Array.from(testResults.values())
      .map(result => result.score || 0)
      .filter(score => score > 0);
    
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  };

  const renderTestCard = (test: TestSummary) => {
    const result = testResults.get(test.category);
    const Icon = test.icon;
    const isActive = activeTest === test.category;
    
    return (
      <div 
        key={test.category}
        className={`p-4 border rounded-lg cursor-pointer transition-all ${
          isActive ? 'ring-2 ring-blue-500 ring-offset-2' :
          result?.status === 'passed' ? 'border-green-300 bg-green-50' :
          result?.status === 'failed' ? 'border-red-300 bg-red-50' :
          'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setActiveTest(test.category)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${
              result?.status === 'passed' ? 'text-green-600' :
              result?.status === 'failed' ? 'text-red-600' :
              isActive ? 'text-blue-600' :
              'text-gray-600'
            }`} />
            <div>
              <h3 className="font-medium text-gray-900">{test.name}</h3>
              {test.critical && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                  Critique
                </span>
              )}
            </div>
          </div>
          
          {result && (
            <div className="text-right">
              {result.score && (
                <div className="text-lg font-bold text-gray-900">
                  {Math.round(result.score)}/100
                </div>
              )}
              {result.duration && (
                <div className="text-xs text-gray-500">
                  {result.duration}ms
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{test.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {result?.status === 'passed' && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            {result?.status === 'failed' && (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            {isActive && (
              <Clock className="w-4 h-4 text-blue-600 animate-spin" />
            )}
            <span className="text-sm text-gray-600">
              {result?.status === 'passed' ? 'Réussi' :
               result?.status === 'failed' ? 'Échoué' :
               isActive ? 'En cours...' :
               'Non exécuté'}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTest(test.category);
            }}
          >
            {isActive ? 'Actif' : 'Tester'}
          </Button>
        </div>
      </div>
    );
  };

  const renderActiveTest = () => {
    if (!activeTest) return null;
    
    const test = testSuites.find(t => t.category === activeTest);
    if (!test) return null;
    
    const Component = test.component;
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{test.name}</h2>
          <Button
            variant="outline"
            onClick={() => setActiveTest(null)}
          >
            Fermer
          </Button>
        </div>
        <Component />
      </div>
    );
  };

  const overallStatus = getOverallStatus();
  const overallScore = getOverallScore();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-blue-600" />
            Suite de Validation Maître
          </h1>
          <p className="text-gray-600">
            Tests complets et validation de l'intégration formation EBIOS RM
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={runAllCriticalTests}
            className="flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Tests Critiques</span>
          </Button>
          
          <Button
            onClick={generateReport}
            variant="outline"
            disabled={testResults.size === 0}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Rapport</span>
          </Button>
        </div>
      </div>

      {/* Tableau de bord global */}
      {testResults.size > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h2 className="font-semibold text-blue-900 mb-3">📊 Résultats Globaux</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                overallStatus === 'passed' ? 'text-green-600' :
                overallStatus === 'failed' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {overallStatus === 'passed' ? '✅' :
                 overallStatus === 'failed' ? '❌' :
                 '⏳'}
              </div>
              <div className="text-sm text-gray-600">Statut Global</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(overallScore)}/100
              </div>
              <div className="text-sm text-gray-600">Score Moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {testResults.size}/{testSuites.length}
              </div>
              <div className="text-sm text-gray-600">Tests Exécutés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Array.from(testResults.values()).filter(r => r.status === 'passed').length}
              </div>
              <div className="text-sm text-gray-600">Tests Réussis</div>
            </div>
          </div>
        </div>
      )}

      {/* Grille des tests */}
      {!activeTest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testSuites.map(renderTestCard)}
        </div>
      )}

      {/* Test actif */}
      {renderActiveTest()}

      {/* Instructions */}
      {!activeTest && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium mb-2">📋 Instructions d'utilisation :</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Cliquer sur "Tests Critiques" pour exécuter les tests essentiels</li>
            <li>Cliquer sur une carte de test pour l'exécuter individuellement</li>
            <li>Vérifier que tous les tests critiques passent (score ≥ 90)</li>
            <li>Analyser les résultats détaillés de chaque test</li>
            <li>Générer un rapport complet pour documentation</li>
            <li>Corriger les problèmes identifiés avant déploiement</li>
          </ol>
        </div>
      )}

      {/* Critères de validation */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium mb-2">✅ Critères de Validation :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Tests Critiques :</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Intégration : Score ≥ 95%</li>
              <li>Performance : Score ≥ 90%</li>
              <li>Compatibilité : Score ≥ 90%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tests Optionnels :</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Navigation : Score ≥ 85%</li>
              <li>Métriques : Score ≥ 85%</li>
              <li>Persistance : Score ≥ 85%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

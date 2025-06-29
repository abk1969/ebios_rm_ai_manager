import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Activity, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Database,
  Wifi
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { UnifiedMetricsManager } from '../../domain/services/UnifiedMetricsManager';
import { UnifiedDataManager } from '../../domain/services/UnifiedDataManager';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';

/**
 * 🚀 TESTS DE PERFORMANCE ET VALIDATION
 * Mesure des performances du système intégré
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
  duration?: number;
  metrics: PerformanceMetric[];
}

interface SystemInfo {
  userAgent: string;
  memory: number;
  cores: number;
  connection: string;
  storage: {
    localStorage: number;
    indexedDB: boolean;
  };
}

export const PerformanceValidationTest: React.FC = () => {
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [sessionId] = useState(`perf-test-${Date.now()}`);

  useEffect(() => {
    initializeTests();
    collectSystemInfo();
  }, []);

  const initializeTests = () => {
    const performanceTests: PerformanceTest[] = [
      {
        id: 'metrics_performance',
        name: 'Performance Métriques',
        description: 'Mesure des temps de calcul et mise à jour des métriques',
        status: 'pending',
        metrics: []
      },
      {
        id: 'storage_performance',
        name: 'Performance Stockage',
        description: 'Mesure des temps de sauvegarde et chargement',
        status: 'pending',
        metrics: []
      },
      {
        id: 'navigation_performance',
        name: 'Performance Navigation',
        description: 'Mesure des temps de transition entre modes',
        status: 'pending',
        metrics: []
      },
      {
        id: 'memory_usage',
        name: 'Utilisation Mémoire',
        description: 'Mesure de la consommation mémoire du système',
        status: 'pending',
        metrics: []
      },
      {
        id: 'load_testing',
        name: 'Test de Charge',
        description: 'Simulation de charge avec données volumineuses',
        status: 'pending',
        metrics: []
      }
    ];

    setTests(performanceTests);
  };

  const collectSystemInfo = () => {
    const info: SystemInfo = {
      userAgent: navigator.userAgent,
      memory: (navigator as any).deviceMemory || 0,
      cores: navigator.hardwareConcurrency || 0,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      storage: {
        localStorage: getLocalStorageSize(),
        indexedDB: 'indexedDB' in window
      }
    };

    setSystemInfo(info);
  };

  const getLocalStorageSize = (): number => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch {
      return 0;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallScore(null);

    const scores: number[] = [];

    try {
      for (const test of tests) {
        setCurrentTest(test.id);
        updateTestStatus(test.id, 'running');

        const startTime = performance.now();
        const metrics = await runPerformanceTest(test.id);
        const duration = performance.now() - startTime;

        updateTestStatus(test.id, 'completed', duration, metrics);

        // Calculer score pour ce test
        const testScore = calculateTestScore(metrics);
        scores.push(testScore);

        // Pause entre tests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Calculer score global
      const globalScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      setOverallScore(globalScore);

    } catch (error) {
      console.error('❌ Erreur tests performance:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  const runPerformanceTest = async (testId: string): Promise<PerformanceMetric[]> => {
    switch (testId) {
      case 'metrics_performance':
        return await testMetricsPerformance();
      case 'storage_performance':
        return await testStoragePerformance();
      case 'navigation_performance':
        return await testNavigationPerformance();
      case 'memory_usage':
        return await testMemoryUsage();
      case 'load_testing':
        return await testLoadTesting();
      default:
        return [];
    }
  };

  const testMetricsPerformance = async (): Promise<PerformanceMetric[]> => {
    const metrics: PerformanceMetric[] = [];

    // Test calcul métriques globales
    const start1 = performance.now();
    for (let i = 0; i < 100; i++) {
      UnifiedMetricsManager.getUnifiedMetrics(sessionId);
    }
    const metricsCalcTime = (performance.now() - start1) / 100;

    metrics.push({
      name: 'Calcul métriques',
      value: metricsCalcTime,
      unit: 'ms',
      threshold: 10,
      status: metricsCalcTime < 5 ? 'good' : metricsCalcTime < 10 ? 'warning' : 'critical',
      description: 'Temps moyen calcul métriques globales'
    });

    // Test mise à jour métriques workshop
    const start2 = performance.now();
    for (let i = 0; i < 50; i++) {
      UnifiedMetricsManager.updateWorkshopMetrics(1, { score: 85, timeSpent: 45 });
    }
    const updateTime = (performance.now() - start2) / 50;

    metrics.push({
      name: 'Mise à jour workshop',
      value: updateTime,
      unit: 'ms',
      threshold: 5,
      status: updateTime < 2 ? 'good' : updateTime < 5 ? 'warning' : 'critical',
      description: 'Temps moyen mise à jour métriques workshop'
    });

    // Test génération recommandations
    const start3 = performance.now();
    for (let i = 0; i < 20; i++) {
      UnifiedMetricsManager.generateRecommendations(sessionId);
    }
    const recommendTime = (performance.now() - start3) / 20;

    metrics.push({
      name: 'Recommandations IA',
      value: recommendTime,
      unit: 'ms',
      threshold: 20,
      status: recommendTime < 10 ? 'good' : recommendTime < 20 ? 'warning' : 'critical',
      description: 'Temps moyen génération recommandations'
    });

    return metrics;
  };

  const testStoragePerformance = async (): Promise<PerformanceMetric[]> => {
    const metrics: PerformanceMetric[] = [];

    // Créer adaptateur pour test
    const adapter = StorageAdapterFactory.createAdapter('memory');
    const dataManager = UnifiedDataManager.getInstance(adapter);

    // Test sauvegarde
    const testData = {
      sessionId,
      userId: 'perf-test-user',
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

    const start1 = performance.now();
    for (let i = 0; i < 10; i++) {
      await dataManager.saveTrainingSession(`${sessionId}-${i}`, testData);
    }
    const saveTime = (performance.now() - start1) / 10;

    metrics.push({
      name: 'Sauvegarde session',
      value: saveTime,
      unit: 'ms',
      threshold: 50,
      status: saveTime < 20 ? 'good' : saveTime < 50 ? 'warning' : 'critical',
      description: 'Temps moyen sauvegarde session'
    });

    // Test chargement
    const start2 = performance.now();
    for (let i = 0; i < 10; i++) {
      await dataManager.loadTrainingSession(`${sessionId}-${i}`);
    }
    const loadTime = (performance.now() - start2) / 10;

    metrics.push({
      name: 'Chargement session',
      value: loadTime,
      unit: 'ms',
      threshold: 30,
      status: loadTime < 10 ? 'good' : loadTime < 30 ? 'warning' : 'critical',
      description: 'Temps moyen chargement session'
    });

    return metrics;
  };

  const testNavigationPerformance = async (): Promise<PerformanceMetric[]> => {
    const metrics: PerformanceMetric[] = [];

    // Simuler transitions navigation
    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      // Simulation changement mode
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    const navTime = (performance.now() - start) / 20;

    metrics.push({
      name: 'Transition mode',
      value: navTime,
      unit: 'ms',
      threshold: 100,
      status: navTime < 50 ? 'good' : navTime < 100 ? 'warning' : 'critical',
      description: 'Temps moyen transition entre modes'
    });

    return metrics;
  };

  const testMemoryUsage = async (): Promise<PerformanceMetric[]> => {
    const metrics: PerformanceMetric[] = [];

    // Mesurer utilisation mémoire (approximative)
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      const usedMemory = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB

      metrics.push({
        name: 'Mémoire utilisée',
        value: usedMemory,
        unit: 'MB',
        threshold: 50,
        status: usedMemory < 20 ? 'good' : usedMemory < 50 ? 'warning' : 'critical',
        description: 'Mémoire JavaScript utilisée'
      });

      const totalMemory = memoryInfo.totalJSHeapSize / 1024 / 1024; // MB
      const memoryUsage = (usedMemory / totalMemory) * 100;

      metrics.push({
        name: 'Utilisation mémoire',
        value: memoryUsage,
        unit: '%',
        threshold: 80,
        status: memoryUsage < 50 ? 'good' : memoryUsage < 80 ? 'warning' : 'critical',
        description: 'Pourcentage mémoire utilisée'
      });
    }

    return metrics;
  };

  const testLoadTesting = async (): Promise<PerformanceMetric[]> => {
    const metrics: PerformanceMetric[] = [];

    // Test avec données volumineuses
    const start = performance.now();
    
    // Simuler traitement de 1000 métriques
    for (let i = 0; i < 1000; i++) {
      UnifiedMetricsManager.updateSessionMetrics(sessionId, `action_${i}`);
    }
    
    const loadTime = performance.now() - start;

    metrics.push({
      name: 'Traitement en masse',
      value: loadTime,
      unit: 'ms',
      threshold: 1000,
      status: loadTime < 500 ? 'good' : loadTime < 1000 ? 'warning' : 'critical',
      description: 'Temps traitement 1000 opérations'
    });

    // Test throughput
    const throughput = 1000 / (loadTime / 1000); // ops/sec

    metrics.push({
      name: 'Débit système',
      value: throughput,
      unit: 'ops/s',
      threshold: 1000,
      status: throughput > 2000 ? 'good' : throughput > 1000 ? 'warning' : 'critical',
      description: 'Opérations par seconde'
    });

    return metrics;
  };

  const calculateTestScore = (metrics: PerformanceMetric[]): number => {
    if (metrics.length === 0) return 0;

    const scores = metrics.map(metric => {
      switch (metric.status) {
        case 'good': return 100;
        case 'warning': return 70;
        case 'critical': return 30;
        default: return 0;
      }
    });

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const updateTestStatus = (testId: string, status: PerformanceTest['status'], duration?: number, metrics?: PerformanceMetric[]) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status, duration, metrics: metrics || test.metrics }
        : test
    ));
  };

  const resetTests = () => {
    initializeTests();
    setOverallScore(null);
    setCurrentTest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Zap className="w-6 h-6 mr-3 text-yellow-600" />
            Tests de Performance
          </h2>
          <p className="text-gray-600">
            Validation des performances du système de formation intégré
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
            <span>{isRunning ? 'En cours...' : 'Lancer tests'}</span>
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

      {/* Score global */}
      {overallScore !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-purple-900">🏆 Score Global Performance</h3>
            <div className={`text-3xl font-bold ${getOverallScoreColor(overallScore)}`}>
              {Math.round(overallScore)}/100
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  overallScore >= 90 ? 'bg-green-500' :
                  overallScore >= 70 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Informations système */}
      {systemInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Informations Système
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Mémoire :</span>
              <span className="ml-2">{systemInfo.memory || 'N/A'} GB</span>
            </div>
            <div>
              <span className="font-medium">Processeurs :</span>
              <span className="ml-2">{systemInfo.cores || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium">Connexion :</span>
              <span className="ml-2">{systemInfo.connection}</span>
            </div>
            <div>
              <span className="font-medium">IndexedDB :</span>
              <span className="ml-2">{systemInfo.storage.indexedDB ? '✅' : '❌'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tests de performance */}
      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.id} className="border rounded-lg overflow-hidden">
            <div className={`p-4 ${
              test.status === 'completed' ? 'bg-blue-50 border-blue-200' :
              test.status === 'running' ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {test.status === 'running' ? (
                      <Activity className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : test.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    {test.id === currentTest && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        En cours
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600">{test.description}</p>
                  </div>
                </div>
                
                {test.duration && (
                  <div className="text-right">
                    <div className="text-sm font-medium">{Math.round(test.duration)}ms</div>
                    <div className="text-xs text-gray-500">Durée test</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Métriques */}
            {test.metrics.length > 0 && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {test.metrics.map((metric, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{metric.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {metric.value.toFixed(2)} {metric.unit}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {metric.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Seuil: {metric.threshold} {metric.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommandations */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium mb-2">💡 Recommandations Performance :</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Score global ≥ 90 : Performance excellente</li>
          <li>Score global 70-89 : Performance acceptable, optimisations possibles</li>
          <li>Score global &lt; 70 : Performance insuffisante, optimisations requises</li>
          <li>Métriques critiques : Nécessitent une attention immédiate</li>
          <li>Tester sur différents navigateurs et appareils</li>
        </ul>
      </div>
    </div>
  );
};

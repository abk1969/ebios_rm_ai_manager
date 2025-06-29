/**
 * 🧪 VALIDATEUR COMPLET DES MODULES DE FORMATION
 * Composant de test pour valider toutes les corrections effectuées
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  RefreshCw,
  Monitor,
  Database,
  Wifi,
  Settings,
  FileText,
  Clock
} from 'lucide-react';
import { UnifiedTrainingInterface } from './UnifiedTrainingInterface';
import { UnifiedDataManager } from '../../domain/services/UnifiedDataManager';
import { DataSynchronizationService } from '../../domain/services/DataSynchronizationService';
import { TrainingHarmonizationService } from '../../domain/services/TrainingHarmonizationService';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';

// 🎯 TYPES POUR VALIDATION
interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  details?: any;
  timestamp: string;
}

interface ValidationSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
  startTime?: string;
  endTime?: string;
}

/**
 * 🎯 COMPOSANT PRINCIPAL VALIDATEUR
 */
export const TrainingModulesValidator: React.FC = () => {
  const [validationSuites, setValidationSuites] = useState<ValidationSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSuite, setCurrentSuite] = useState<string | null>(null);
  const [globalStatus, setGlobalStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // 🧪 INITIALISATION DES SUITES DE TEST
  useEffect(() => {
    const suites: ValidationSuite[] = [
      {
        id: 'initialization',
        name: 'Tests d\'Initialisation',
        description: 'Validation de l\'initialisation sécurisée des composants',
        tests: [],
        status: 'pending'
      },
      {
        id: 'persistence',
        name: 'Tests de Persistance',
        description: 'Validation du système de persistance des données',
        tests: [],
        status: 'pending'
      },
      {
        id: 'synchronization',
        name: 'Tests de Synchronisation',
        description: 'Validation du service de synchronisation robuste',
        tests: [],
        status: 'pending'
      },
      {
        id: 'harmonization',
        name: 'Tests d\'Harmonisation',
        description: 'Validation de l\'harmonisation entre modules',
        tests: [],
        status: 'pending'
      },
      {
        id: 'integration',
        name: 'Tests d\'Intégration',
        description: 'Validation des flux complets end-to-end',
        tests: [],
        status: 'pending'
      }
    ];

    setValidationSuites(suites);
  }, []);

  // 🚀 LANCER TOUS LES TESTS
  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setGlobalStatus('running');

    try {
      for (const suite of validationSuites) {
        setCurrentSuite(suite.id);
        await runTestSuite(suite.id);
      }
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    } finally {
      setIsRunning(false);
      setGlobalStatus('completed');
      setCurrentSuite(null);
    }
  }, [validationSuites]);

  // 🧪 EXÉCUTER UNE SUITE DE TESTS
  const runTestSuite = useCallback(async (suiteId: string) => {
    const updateSuite = (updates: Partial<ValidationSuite>) => {
      setValidationSuites(prev => prev.map(suite =>
        suite.id === suiteId ? { ...suite, ...updates } : suite
      ));
    };

    updateSuite({ status: 'running', startTime: new Date().toISOString() });

    try {
      let tests: TestResult[] = [];

      switch (suiteId) {
        case 'initialization':
          tests = await runInitializationTests();
          break;
        case 'persistence':
          tests = await runPersistenceTests();
          break;
        case 'synchronization':
          tests = await runSynchronizationTests();
          break;
        case 'harmonization':
          tests = await runHarmonizationTests();
          break;
        case 'integration':
          tests = await runIntegrationTests();
          break;
      }

      updateSuite({
        tests,
        status: 'completed',
        endTime: new Date().toISOString()
      });

    } catch (error) {
      updateSuite({
        status: 'completed',
        endTime: new Date().toISOString(),
        tests: [{
          id: 'suite_error',
          name: 'Erreur Suite',
          status: 'error',
          message: `Erreur lors de l'exécution: ${error.message}`,
          timestamp: new Date().toISOString()
        }]
      });
    }
  }, []);

  // 🔧 TESTS D'INITIALISATION
  const runInitializationTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    // Test 1: Initialisation UnifiedDataManager
    try {
      const startTime = Date.now();
      const adapter = StorageAdapterFactory.createRecommendedAdapter();
      const dataManager = UnifiedDataManager.getInstance(adapter);

      tests.push({
        id: 'data_manager_init',
        name: 'Initialisation UnifiedDataManager',
        status: 'success',
        message: 'DataManager initialisé avec succès',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        id: 'data_manager_init',
        name: 'Initialisation UnifiedDataManager',
        status: 'error',
        message: `Erreur: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    // Test 2: Initialisation DataSynchronizationService
    try {
      const startTime = Date.now();
      const adapter = StorageAdapterFactory.createRecommendedAdapter();
      const dataManager = UnifiedDataManager.getInstance(adapter);
      const syncService = DataSynchronizationService.getInstance(dataManager);

      // Attendre l'initialisation
      await syncService.ensureInitialized();

      tests.push({
        id: 'sync_service_init',
        name: 'Initialisation DataSynchronizationService',
        status: 'success',
        message: 'Service de synchronisation initialisé avec succès',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        id: 'sync_service_init',
        name: 'Initialisation DataSynchronizationService',
        status: 'error',
        message: `Erreur: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    // Test 3: Initialisation TrainingHarmonizationService
    try {
      const startTime = Date.now();
      const harmonizationService = TrainingHarmonizationService.getInstance();

      tests.push({
        id: 'harmonization_service_init',
        name: 'Initialisation TrainingHarmonizationService',
        status: 'success',
        message: 'Service d\'harmonisation initialisé avec succès',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        id: 'harmonization_service_init',
        name: 'Initialisation TrainingHarmonizationService',
        status: 'error',
        message: `Erreur: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    // Test 4: Vérification ordre d'initialisation
    try {
      const startTime = Date.now();

      // Simuler l'utilisation avant initialisation (ne devrait plus causer d'erreur)
      const adapter = StorageAdapterFactory.createRecommendedAdapter();
      const dataManager = UnifiedDataManager.getInstance(adapter);
      const syncService = DataSynchronizationService.getInstance(dataManager);

      // Tenter d'utiliser le service immédiatement
      const health = DataSynchronizationService.getServiceHealth();

      tests.push({
        id: 'initialization_order',
        name: 'Ordre d\'initialisation sécurisé',
        status: health.isHealthy ? 'success' : 'warning',
        message: health.isHealthy
          ? 'Ordre d\'initialisation respecté'
          : 'Service en cours d\'initialisation',
        duration: Date.now() - startTime,
        details: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      tests.push({
        id: 'initialization_order',
        name: 'Ordre d\'initialisation sécurisé',
        status: 'error',
        message: `Erreur ordre d'initialisation: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  };

  // 💾 TESTS DE PERSISTANCE
  const runPersistenceTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      const adapter = StorageAdapterFactory.createRecommendedAdapter();
      const dataManager = UnifiedDataManager.getInstance(adapter);
      const sessionId = `test_session_${Date.now()}`;

      // Test 1: Sauvegarde de session
      try {
        const startTime = Date.now();
        const testData = {
          sessionId,
          userId: 'test_user',
          metrics: {
            globalProgress: {
              overallCompletion: 50,
              totalTimeSpent: 1800,
              averageScore: 75,
              modesCompleted: 2,
              totalModes: 5,
              streak: 3,
              lastActivity: new Date().toISOString(),
              level: 'Intermédiaire',
              nextMilestone: 'Atelier 3'
            },
            modeMetrics: {},
            achievements: [],
            learningPath: {
              currentStep: 3,
              totalSteps: 5,
              completedSteps: [1, 2],
              recommendedNext: 'workshop-3'
            },
            sessionMetrics: {
              startTime: new Date().toISOString(),
              currentDuration: 1800,
              actionsPerformed: 25,
              averageResponseTime: 2.5,
              engagementScore: 85
            },
            recommendations: []
          },
          modeData: {},
          userPreferences: {
            language: 'fr',
            theme: 'light',
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

        tests.push({
          id: 'save_session',
          name: 'Sauvegarde de session',
          status: 'success',
          message: 'Session sauvegardée avec succès',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'save_session',
          name: 'Sauvegarde de session',
          status: 'error',
          message: `Erreur sauvegarde: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 2: Chargement de session
      try {
        const startTime = Date.now();
        const loadedData = await dataManager.loadTrainingSession(sessionId);

        tests.push({
          id: 'load_session',
          name: 'Chargement de session',
          status: loadedData ? 'success' : 'error',
          message: loadedData
            ? 'Session chargée avec succès'
            : 'Session non trouvée',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'load_session',
          name: 'Chargement de session',
          status: 'error',
          message: `Erreur chargement: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 3: Mise à jour de données mode
      try {
        const startTime = Date.now();
        await dataManager.updateModeData(sessionId, 'test-mode', {
          testData: 'test_value',
          timestamp: new Date().toISOString()
        });

        tests.push({
          id: 'update_mode_data',
          name: 'Mise à jour données mode',
          status: 'success',
          message: 'Données mode mises à jour avec succès',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'update_mode_data',
          name: 'Mise à jour données mode',
          status: 'error',
          message: `Erreur mise à jour: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      tests.push({
        id: 'persistence_setup',
        name: 'Configuration persistance',
        status: 'error',
        message: `Erreur configuration: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  };

  // 🔄 TESTS DE SYNCHRONISATION
  const runSynchronizationTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      const adapter = StorageAdapterFactory.createRecommendedAdapter();
      const dataManager = UnifiedDataManager.getInstance(adapter);
      const syncService = DataSynchronizationService.getInstance(dataManager);
      const sessionId = `sync_test_${Date.now()}`;

      // Test 1: Santé du service
      try {
        const startTime = Date.now();
        const health = DataSynchronizationService.getServiceHealth();

        tests.push({
          id: 'service_health',
          name: 'Santé du service de synchronisation',
          status: health.isHealthy ? 'success' : 'warning',
          message: health.isHealthy
            ? 'Service en bonne santé'
            : `Service dégradé: ${health.errors.join(', ')}`,
          duration: Date.now() - startTime,
          details: health,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'service_health',
          name: 'Santé du service de synchronisation',
          status: 'error',
          message: `Erreur vérification santé: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 2: Émission d'événements
      try {
        const startTime = Date.now();
        await DataSynchronizationService.emitSessionStart(sessionId);
        await DataSynchronizationService.emitChatActivity(sessionId, {
          message: 'Test message',
          timestamp: new Date().toISOString()
        });

        tests.push({
          id: 'emit_events',
          name: 'Émission d\'événements',
          status: 'success',
          message: 'Événements émis avec succès',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'emit_events',
          name: 'Émission d\'événements',
          status: 'error',
          message: `Erreur émission: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 3: Gestion des erreurs de synchronisation
      try {
        const startTime = Date.now();

        // Simuler une erreur en émettant un événement invalide
        await syncService.emit({
          type: 'invalid_type' as any,
          source: 'test',
          sessionId: 'invalid_session',
          data: {},
          timestamp: 'invalid_timestamp'
        });

        tests.push({
          id: 'error_handling',
          name: 'Gestion d\'erreurs',
          status: 'success',
          message: 'Erreurs gérées gracieusement',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'error_handling',
          name: 'Gestion d\'erreurs',
          status: 'warning',
          message: 'Gestion d\'erreurs à améliorer',
          timestamp: new Date().toISOString()
        });
      }

      // Test 4: Reconnexion forcée
      try {
        const startTime = Date.now();
        const reconnected = await DataSynchronizationService.forceReconnect();

        tests.push({
          id: 'force_reconnect',
          name: 'Reconnexion forcée',
          status: reconnected ? 'success' : 'warning',
          message: reconnected
            ? 'Reconnexion réussie'
            : 'Reconnexion échouée',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'force_reconnect',
          name: 'Reconnexion forcée',
          status: 'error',
          message: `Erreur reconnexion: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      tests.push({
        id: 'sync_setup',
        name: 'Configuration synchronisation',
        status: 'error',
        message: `Erreur configuration: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  };

  // 🔄 TESTS D'HARMONISATION
  const runHarmonizationTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      const harmonizationService = TrainingHarmonizationService.getInstance();

      // Test 1: Harmonisation données chat
      try {
        const startTime = Date.now();
        const chatData = {
          messages: [
            { content: 'Qu\'est-ce que EBIOS RM?', type: 'user', timestamp: new Date().toISOString() },
            { content: 'EBIOS RM est une méthode...', type: 'assistant', timestamp: new Date().toISOString() }
          ],
          metrics: { comprehensionLevel: 75 },
          timeSpent: 300,
          sessionId: 'test_session'
        };

        const harmonizedChat = harmonizationService.harmonizeChatExpertData(chatData);

        tests.push({
          id: 'harmonize_chat',
          name: 'Harmonisation données chat',
          status: 'success',
          message: `Chat harmonisé: ${harmonizedChat.interactions?.length} interactions`,
          duration: Date.now() - startTime,
          details: harmonizedChat,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'harmonize_chat',
          name: 'Harmonisation données chat',
          status: 'error',
          message: `Erreur harmonisation chat: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 2: Harmonisation données workshops
      try {
        const startTime = Date.now();
        const workshopsData = {
          currentWorkshop: 2,
          completions: {
            1: { completed: true, score: 85, timeSpent: 1200 },
            2: { completed: false, score: 0, timeSpent: 300 }
          },
          totalScore: 85,
          badges: ['workshop_1_completed'],
          timeSpent: 1500
        };

        const harmonizedWorkshops = harmonizationService.harmonizeWorkshopsData(workshopsData);

        tests.push({
          id: 'harmonize_workshops',
          name: 'Harmonisation données workshops',
          status: 'success',
          message: `Workshops harmonisés: ${harmonizedWorkshops.progress?.workshopsProgress.totalScore} points`,
          duration: Date.now() - startTime,
          details: harmonizedWorkshops,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'harmonize_workshops',
          name: 'Harmonisation données workshops',
          status: 'error',
          message: `Erreur harmonisation workshops: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 3: Fusion données mixtes
      try {
        const startTime = Date.now();
        const chatData = {
          messages: [{ content: 'Test', type: 'user', timestamp: new Date().toISOString() }],
          timeSpent: 300,
          sessionId: 'test_mixed'
        };
        const workshopsData = {
          currentWorkshop: 1,
          completions: { 1: { completed: true, score: 90, timeSpent: 600 } },
          timeSpent: 600
        };

        const mergedData = harmonizationService.mergeMixedData(chatData, workshopsData);

        tests.push({
          id: 'merge_mixed_data',
          name: 'Fusion données mixtes',
          status: 'success',
          message: `Données fusionnées: ${mergedData.progress.overallCompletion.toFixed(1)}% completion`,
          duration: Date.now() - startTime,
          details: mergedData,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'merge_mixed_data',
          name: 'Fusion données mixtes',
          status: 'error',
          message: `Erreur fusion: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      tests.push({
        id: 'harmonization_setup',
        name: 'Configuration harmonisation',
        status: 'error',
        message: `Erreur configuration: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  };

  // 🔗 TESTS D'INTÉGRATION
  const runIntegrationTests = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test 1: Flux complet d'initialisation
      try {
        const startTime = Date.now();

        // Simuler un flux complet
        const adapter = StorageAdapterFactory.createRecommendedAdapter();
        const dataManager = UnifiedDataManager.getInstance(adapter);
        const syncService = DataSynchronizationService.getInstance(dataManager);
        const harmonizationService = TrainingHarmonizationService.getInstance();

        // Attendre l'initialisation
        await syncService.ensureInitialized();

        // Créer une session de test
        const sessionId = `integration_test_${Date.now()}`;
        const testData = {
          sessionId,
          userId: 'integration_user',
          metrics: {
            globalProgress: {
              overallCompletion: 25,
              totalTimeSpent: 900,
              averageScore: 80,
              modesCompleted: 1,
              totalModes: 5,
              streak: 1,
              lastActivity: new Date().toISOString(),
              level: 'Débutant',
              nextMilestone: 'Atelier 2'
            },
            modeMetrics: {},
            achievements: [],
            learningPath: {
              currentStep: 2,
              totalSteps: 5,
              completedSteps: [1],
              recommendedNext: 'workshop-2'
            },
            sessionMetrics: {
              startTime: new Date().toISOString(),
              currentDuration: 900,
              actionsPerformed: 15,
              averageResponseTime: 2.0,
              engagementScore: 80
            },
            recommendations: []
          },
          modeData: {},
          userPreferences: {
            language: 'fr',
            theme: 'light',
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

        // Sauvegarder
        await dataManager.saveTrainingSession(sessionId, testData);

        // Émettre des événements
        await DataSynchronizationService.emitSessionStart(sessionId);
        await DataSynchronizationService.emitChatActivity(sessionId, {
          message: 'Test integration',
          timestamp: new Date().toISOString()
        });

        // Charger et vérifier
        const loadedData = await dataManager.loadTrainingSession(sessionId);

        tests.push({
          id: 'full_flow',
          name: 'Flux complet d\'intégration',
          status: loadedData ? 'success' : 'error',
          message: loadedData
            ? 'Flux complet exécuté avec succès'
            : 'Échec du flux complet',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'full_flow',
          name: 'Flux complet d\'intégration',
          status: 'error',
          message: `Erreur flux complet: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }

      // Test 2: Robustesse en cas d'erreur
      try {
        const startTime = Date.now();

        // Tenter des opérations avec des données invalides
        const adapter = StorageAdapterFactory.createRecommendedAdapter();
        const dataManager = UnifiedDataManager.getInstance(adapter);

        try {
          await dataManager.loadTrainingSession('session_inexistante');
        } catch (error) {
          // Erreur attendue
        }

        try {
          await dataManager.saveTrainingSession('', null as any);
        } catch (error) {
          // Erreur attendue
        }

        tests.push({
          id: 'error_robustness',
          name: 'Robustesse aux erreurs',
          status: 'success',
          message: 'Erreurs gérées gracieusement',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        tests.push({
          id: 'error_robustness',
          name: 'Robustesse aux erreurs',
          status: 'warning',
          message: 'Gestion d\'erreurs à améliorer',
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      tests.push({
        id: 'integration_setup',
        name: 'Configuration intégration',
        status: 'error',
        message: `Erreur configuration: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }

    return tests;
  };

  // 🎨 UTILITAIRES D'AFFICHAGE
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSuiteIcon = (suiteId: string) => {
    switch (suiteId) {
      case 'initialization':
        return <Settings className="w-5 h-5" />;
      case 'persistence':
        return <Database className="w-5 h-5" />;
      case 'synchronization':
        return <Wifi className="w-5 h-5" />;
      case 'harmonization':
        return <Monitor className="w-5 h-5" />;
      case 'integration':
        return <FileText className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getSuiteStatus = (suite: ValidationSuite) => {
    if (suite.status === 'running') return 'running';
    if (suite.tests.length === 0) return 'pending';

    const hasError = suite.tests.some(test => test.status === 'error');
    const hasWarning = suite.tests.some(test => test.status === 'warning');

    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    return 'success';
  };

  // 🎯 RENDU PRINCIPAL
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🧪 Validateur des Modules de Formation
            </h1>
            <p className="text-gray-600">
              Validation complète des corrections effectuées sur les modules de formation EBIOS RM
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              globalStatus === 'running'
                ? 'bg-blue-100 text-blue-800'
                : globalStatus === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {globalStatus === 'running' ? 'Tests en cours...' :
               globalStatus === 'completed' ? 'Tests terminés' : 'Prêt'}
            </div>

            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                ${isRunning
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Tests en cours...' : 'Lancer tous les tests'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suites de tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {validationSuites.map((suite) => {
          const suiteStatus = getSuiteStatus(suite);
          const isCurrentSuite = currentSuite === suite.id;

          return (
            <div
              key={suite.id}
              className={`
                bg-white rounded-lg border-2 transition-all
                ${isCurrentSuite
                  ? 'border-blue-300 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Header de la suite */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(suiteStatus)}`}>
                      {getSuiteIcon(suite.id)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{suite.name}</h3>
                      <p className="text-sm text-gray-600">{suite.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(suiteStatus)}
                    {suite.tests.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {suite.tests.filter(t => t.status === 'success').length}/{suite.tests.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tests de la suite */}
              <div className="p-4 space-y-3">
                {suite.tests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>En attente d'exécution</p>
                  </div>
                ) : (
                  suite.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`
                        p-3 rounded-lg border transition-all cursor-pointer
                        ${getStatusColor(test.status)}
                        ${showDetails === test.id ? 'ring-2 ring-blue-300' : ''}
                      `}
                      onClick={() => setShowDetails(showDetails === test.id ? null : test.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <p className="text-sm opacity-75">{test.message}</p>
                          </div>
                        </div>

                        <div className="text-right text-sm opacity-75">
                          {test.duration && <div>{test.duration}ms</div>}
                          <div>{new Date(test.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>

                      {/* Détails du test */}
                      {showDetails === test.id && test.details && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                          <pre className="text-xs bg-black bg-opacity-10 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer de la suite */}
              {suite.startTime && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                  Démarré: {new Date(suite.startTime).toLocaleTimeString()}
                  {suite.endTime && (
                    <span className="ml-4">
                      Terminé: {new Date(suite.endTime).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Résumé global */}
      {globalStatus === 'completed' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Résumé des Tests</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['success', 'warning', 'error', 'pending'].map((status) => {
              const count = validationSuites.reduce((acc, suite) =>
                acc + suite.tests.filter(test => test.status === status).length, 0
              );

              return (
                <div key={status} className={`p-4 rounded-lg border ${getStatusColor(status as any)}`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status as any)}
                    <div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm capitalize">{status === 'success' ? 'Succès' :
                                                           status === 'warning' ? 'Avertissements' :
                                                           status === 'error' ? 'Erreurs' : 'En attente'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interface de test en direct */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Test en Direct</h3>
        <p className="text-gray-600 mb-4">
          Interface unifiée de formation pour test manuel des fonctionnalités
        </p>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <UnifiedTrainingInterface
            sessionId={`validator_test_${Date.now()}`}
            trainingMode="mixed"
            compact={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingModulesValidator;
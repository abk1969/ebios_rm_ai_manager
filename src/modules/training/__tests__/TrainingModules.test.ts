/**
 * 🧪 TESTS UNITAIRES DES MODULES DE FORMATION
 * Tests automatisés pour valider les corrections effectuées
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UnifiedDataManager } from '../domain/services/UnifiedDataManager';
import { DataSynchronizationService } from '../domain/services/DataSynchronizationService';
import { TrainingHarmonizationService } from '../domain/services/TrainingHarmonizationService';
import { StorageAdapterFactory } from '../infrastructure/storage/StorageAdapters';

// 🎯 MOCKS
const mockStorageAdapter = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn(),
  keys: vi.fn()
};

// 🧪 TESTS D'INITIALISATION
describe('Initialisation des Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset singletons
    (UnifiedDataManager as any).instance = null;
    (DataSynchronizationService as any).instance = null;
  });

  it('devrait initialiser UnifiedDataManager sans erreur', () => {
    expect(() => {
      const dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
      expect(dataManager).toBeDefined();
    }).not.toThrow();
  });

  it('devrait initialiser DataSynchronizationService avec DataManager', async () => {
    const dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
    
    expect(() => {
      const syncService = DataSynchronizationService.getInstance(dataManager);
      expect(syncService).toBeDefined();
    }).not.toThrow();
  });

  it('devrait initialiser TrainingHarmonizationService', () => {
    expect(() => {
      const harmonizationService = TrainingHarmonizationService.getInstance();
      expect(harmonizationService).toBeDefined();
    }).not.toThrow();
  });

  it('devrait gérer l\'initialisation dans le bon ordre', async () => {
    // Test de l'ordre d'initialisation sécurisé
    const dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
    const syncService = DataSynchronizationService.getInstance(dataManager);
    
    // Vérifier que le service peut être utilisé immédiatement
    const health = DataSynchronizationService.getServiceHealth();
    expect(health).toBeDefined();
    expect(health.status).toBeDefined();
  });
});

// 🧪 TESTS DE PERSISTANCE
describe('Persistance des Données', () => {
  let dataManager: UnifiedDataManager;
  
  beforeEach(() => {
    vi.clearAllMocks();
    (UnifiedDataManager as any).instance = null;
    mockStorageAdapter.get.mockResolvedValue(null);
    mockStorageAdapter.set.mockResolvedValue(undefined);
    dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
  });

  it('devrait sauvegarder une session de formation', async () => {
    const sessionId = 'test_session';
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

    await expect(dataManager.saveTrainingSession(sessionId, testData)).resolves.not.toThrow();
    expect(mockStorageAdapter.set).toHaveBeenCalled();
  });

  it('devrait charger une session existante', async () => {
    const sessionId = 'test_session';
    const mockData = { sessionId, userId: 'test_user' };
    
    mockStorageAdapter.get.mockResolvedValue(mockData);
    
    const result = await dataManager.loadTrainingSession(sessionId);
    expect(result).toEqual(mockData);
    expect(mockStorageAdapter.get).toHaveBeenCalledWith(`training_session_${sessionId}`);
  });

  it('devrait mettre à jour les données d\'un mode', async () => {
    const sessionId = 'test_session';
    const modeId = 'test_mode';
    const modeData = { testData: 'test_value' };

    // Mock session existante
    mockStorageAdapter.get.mockResolvedValue({
      sessionId,
      modeData: {}
    });

    await expect(dataManager.updateModeData(sessionId, modeId, modeData)).resolves.not.toThrow();
    expect(mockStorageAdapter.set).toHaveBeenCalled();
  });
});

// 🧪 TESTS DE SYNCHRONISATION
describe('Service de Synchronisation', () => {
  let dataManager: UnifiedDataManager;
  let syncService: DataSynchronizationService;

  beforeEach(() => {
    vi.clearAllMocks();
    (UnifiedDataManager as any).instance = null;
    (DataSynchronizationService as any).instance = null;
    
    dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
    syncService = DataSynchronizationService.getInstance(dataManager);
  });

  it('devrait émettre des événements de manière sécurisée', async () => {
    const sessionId = 'test_session';
    
    await expect(DataSynchronizationService.emitSessionStart(sessionId)).resolves.not.toThrow();
    await expect(DataSynchronizationService.emitChatActivity(sessionId, { test: 'data' })).resolves.not.toThrow();
    await expect(DataSynchronizationService.emitWorkshopCompletion(sessionId, 1, { score: 85 })).resolves.not.toThrow();
    await expect(DataSynchronizationService.emitSessionEnd(sessionId, 1800, { score: 85 })).resolves.not.toThrow();
  });

  it('devrait fournir des informations de santé', () => {
    const health = DataSynchronizationService.getServiceHealth();
    
    expect(health).toBeDefined();
    expect(health.isHealthy).toBeDefined();
    expect(health.status).toBeDefined();
    expect(health.errors).toBeInstanceOf(Array);
    expect(health.metrics).toBeDefined();
  });

  it('devrait gérer la reconnexion forcée', async () => {
    await expect(DataSynchronizationService.forceReconnect()).resolves.toBeDefined();
  });

  it('devrait valider les événements avant émission', async () => {
    // Test avec événement invalide
    const invalidEvent = {
      type: 'invalid_type' as any,
      source: '',
      sessionId: '',
      data: {},
      timestamp: 'invalid'
    };

    await expect(syncService.emit(invalidEvent)).resolves.not.toThrow();
  });
});

// 🧪 TESTS D'HARMONISATION
describe('Service d\'Harmonisation', () => {
  let harmonizationService: TrainingHarmonizationService;

  beforeEach(() => {
    harmonizationService = TrainingHarmonizationService.getInstance();
  });

  it('devrait harmoniser les données de chat expert', () => {
    const chatData = {
      messages: [
        { content: 'Qu\'est-ce que EBIOS RM?', type: 'user', timestamp: new Date().toISOString() },
        { content: 'EBIOS RM est une méthode...', type: 'assistant', timestamp: new Date().toISOString() }
      ],
      metrics: { comprehensionLevel: 75 },
      timeSpent: 300,
      sessionId: 'test_session'
    };

    const result = harmonizationService.harmonizeChatExpertData(chatData);
    
    expect(result).toBeDefined();
    expect(result.trainingMode).toBe('chat-expert');
    expect(result.progress).toBeDefined();
    expect(result.interactions).toBeDefined();
    expect(result.achievements).toBeDefined();
  });

  it('devrait harmoniser les données de workshops', () => {
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

    const result = harmonizationService.harmonizeWorkshopsData(workshopsData);
    
    expect(result).toBeDefined();
    expect(result.trainingMode).toBe('workshops');
    expect(result.progress).toBeDefined();
    expect(result.progress?.workshopsProgress.totalScore).toBe(85);
  });

  it('devrait fusionner les données mixtes', () => {
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

    const result = harmonizationService.mergeMixedData(chatData, workshopsData);
    
    expect(result).toBeDefined();
    expect(result.trainingMode).toBe('mixed');
    expect(result.progress.overallCompletion).toBeGreaterThan(0);
    expect(result.interactions.length).toBeGreaterThan(0);
  });
});

// 🧪 TESTS DE ROBUSTESSE
describe('Robustesse et Gestion d\'Erreurs', () => {
  it('devrait gérer les erreurs d\'initialisation gracieusement', () => {
    // Test avec adaptateur défaillant
    const faultyAdapter = {
      ...mockStorageAdapter,
      get: vi.fn().mockRejectedValue(new Error('Storage error')),
      set: vi.fn().mockRejectedValue(new Error('Storage error'))
    };

    expect(() => {
      const dataManager = UnifiedDataManager.getInstance(faultyAdapter);
      expect(dataManager).toBeDefined();
    }).not.toThrow();
  });

  it('devrait gérer les données corrompues', async () => {
    const dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
    
    // Mock données corrompues
    mockStorageAdapter.get.mockResolvedValue('invalid_json');
    
    const result = await dataManager.loadTrainingSession('test_session');
    expect(result).toBeNull(); // Devrait retourner null pour données invalides
  });

  it('devrait gérer les timeouts de synchronisation', async () => {
    const dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
    const syncService = DataSynchronizationService.getInstance(dataManager);
    
    // Simuler timeout
    mockStorageAdapter.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    await expect(syncService.syncData('test_session')).resolves.not.toThrow();
  });
});

// 🧪 TESTS D'INTÉGRATION
describe('Tests d\'Intégration', () => {
  it('devrait exécuter un flux complet sans erreur', async () => {
    // Initialisation
    const dataManager = UnifiedDataManager.getInstance(mockStorageAdapter);
    const syncService = DataSynchronizationService.getInstance(dataManager);
    const harmonizationService = TrainingHarmonizationService.getInstance();
    
    const sessionId = 'integration_test';
    
    // Mock données
    mockStorageAdapter.get.mockResolvedValue(null);
    mockStorageAdapter.set.mockResolvedValue(undefined);
    
    // Flux complet
    await expect(DataSynchronizationService.emitSessionStart(sessionId)).resolves.not.toThrow();
    
    const testData = {
      sessionId,
      userId: 'test_user',
      metrics: {},
      modeData: {},
      userPreferences: {},
      progressHistory: [],
      lastSyncTime: new Date().toISOString(),
      version: '1.0.0'
    };
    
    await expect(dataManager.saveTrainingSession(sessionId, testData)).resolves.not.toThrow();
    await expect(DataSynchronizationService.emitChatActivity(sessionId, { test: 'data' })).resolves.not.toThrow();
    await expect(DataSynchronizationService.emitSessionEnd(sessionId, 1800, {})).resolves.not.toThrow();
    
    // Vérification santé
    const health = DataSynchronizationService.getServiceHealth();
    expect(health).toBeDefined();
  });
});

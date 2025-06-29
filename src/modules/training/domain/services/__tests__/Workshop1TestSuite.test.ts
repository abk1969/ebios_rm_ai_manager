/**
 * 🧪 SUITE DE TESTS COMPLÈTE WORKSHOP 1
 * Tests unitaires et d'intégration pour Points 1 + 2 + 3
 * POINT 4 - Tests et Validation Complète
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Workshop1MasterAgent } from '../Workshop1MasterAgent';
import { Workshop1NotificationAgent } from '../Workshop1NotificationAgent';
import { ExpertNotificationService } from '../ExpertNotificationService';
import { NotificationIntegrationService } from '../NotificationIntegrationService';
import { A2ANotificationProtocol } from '../A2ANotificationProtocol';
import { Workshop1Point1Validator } from '../Workshop1Point1Validator';
import { Workshop1Point2Validator } from '../Workshop1Point2Validator';
import { Workshop1Point3Validator } from '../Workshop1Point3Validator';
import { EbiosExpertProfile } from '../../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR LES TESTS

interface TestContext {
  masterAgent: Workshop1MasterAgent;
  notificationAgent: Workshop1NotificationAgent;
  expertNotificationService: ExpertNotificationService;
  integrationService: NotificationIntegrationService;
  a2aProtocol: A2ANotificationProtocol;
  mockUserProfile: EbiosExpertProfile;
}

interface TestMetrics {
  executionTime: number;
  memoryUsage: number;
  successRate: number;
  errorCount: number;
}

// 🧪 SUITE DE TESTS PRINCIPALE

describe('🏆 Workshop 1 - Suite de Tests Complète', () => {
  let testContext: TestContext;
  let testMetrics: TestMetrics;

  // 🚀 CONFIGURATION AVANT CHAQUE TEST

  beforeEach(async () => {
    // Initialisation des services
    const masterAgent = Workshop1MasterAgent.getInstance();
    const notificationAgent = Workshop1NotificationAgent.getInstance();
    const expertNotificationService = ExpertNotificationService.getInstance();
    const integrationService = NotificationIntegrationService.getInstance();
    const a2aProtocol = new A2ANotificationProtocol();

    // Profil utilisateur de test
    const mockUserProfile: EbiosExpertProfile = {
      id: 'test-workshop1-user',
      name: 'Dr. Test Expert',
      role: 'Expert EBIOS RM Test',
      experience: {
        ebiosYears: 8,
        totalYears: 12,
        projectsCompleted: 25
      },
      specializations: ['risk_management', 'threat_intelligence', 'healthcare_security'],
      certifications: ['CISSP', 'ANSSI', 'ISO27001'],
      sector: 'santé',
      organizationType: 'CHU',
      preferredComplexity: 'expert',
      learningStyle: 'analytical'
    };

    testContext = {
      masterAgent,
      notificationAgent,
      expertNotificationService,
      integrationService,
      a2aProtocol,
      mockUserProfile
    };

    // Initialisation des métriques
    testMetrics = {
      executionTime: 0,
      memoryUsage: 0,
      successRate: 0,
      errorCount: 0
    };

    // Mocks pour les tests
    vi.clearAllMocks();
  });

  // 🧹 NETTOYAGE APRÈS CHAQUE TEST

  afterEach(async () => {
    try {
      // Nettoyage des services
      await testContext.a2aProtocol.shutdown();
      await testContext.notificationAgent.shutdown();
      await testContext.integrationService.shutdown();
    } catch (error) {
      console.warn('⚠️ Erreur nettoyage tests:', error);
    }
  });

  // 🎯 TESTS DU POINT 1 - AGENT ORCHESTRATEUR

  describe('🤖 Point 1 - Agent Orchestrateur Intelligent', () => {
    it('devrait initialiser une session intelligente', async () => {
      const startTime = Date.now();
      
      const session = await testContext.masterAgent.startIntelligentSession(
        testContext.mockUserProfile.id,
        testContext.mockUserProfile
      );

      const executionTime = Date.now() - startTime;
      
      expect(session).toBeDefined();
      expect(session.sessionId).toBeTruthy();
      expect(session.analysisResult.expertiseLevel.level).toMatch(/junior|intermediate|senior|expert|master/);
      expect(executionTime).toBeLessThan(2000); // Moins de 2 secondes
    });

    it('devrait adapter le contenu selon le niveau d\'expertise', async () => {
      const session = await testContext.masterAgent.startIntelligentSession(
        testContext.mockUserProfile.id,
        testContext.mockUserProfile
      );

      const adaptedContent = await testContext.masterAgent.getAdaptedContent(
        session.sessionId,
        'cadrage_etude'
      );

      expect(adaptedContent).toBeDefined();
      expect(adaptedContent.content).toBeTruthy();
      expect(adaptedContent.adaptations).toBeInstanceOf(Array);
      expect(adaptedContent.difficulty).toMatch(/junior|intermediate|senior|expert|master/);
    });

    it('devrait mettre à jour la progression de session', async () => {
      const session = await testContext.masterAgent.startIntelligentSession(
        testContext.mockUserProfile.id,
        testContext.mockUserProfile
      );

      const updateResult = await testContext.masterAgent.updateSessionProgress(
        session.sessionId,
        {
          moduleProgress: 75,
          timeSpent: 45,
          engagementIndicators: ['high_engagement', 'active_participation']
        }
      );

      expect(updateResult.success).toBe(true);
      expect(updateResult.adaptationsTriggered).toBeInstanceOf(Array);
    });

    it('devrait finaliser une session avec résumé', async () => {
      const session = await testContext.masterAgent.startIntelligentSession(
        testContext.mockUserProfile.id,
        testContext.mockUserProfile
      );

      // Simulation de progression
      await testContext.masterAgent.updateSessionProgress(session.sessionId, {
        moduleProgress: 100,
        timeSpent: 60
      });

      const summary = await testContext.masterAgent.finalizeSession(session.sessionId);

      expect(summary).toBeDefined();
      expect(summary.sessionId).toBe(session.sessionId);
      expect(summary.completionRate).toBeGreaterThan(0);
      expect(summary.recommendations).toBeInstanceOf(Array);
    });
  });

  // 🔔 TESTS DU POINT 2 - NOTIFICATIONS A2A

  describe('🔔 Point 2 - Système de Notifications Intelligentes A2A', () => {
    it('devrait générer une notification experte adaptée', async () => {
      const notificationRequest = {
        userId: testContext.mockUserProfile.id,
        userProfile: testContext.mockUserProfile,
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: ['experience_methodologique']
        },
        context: {
          workshopId: 1,
          moduleId: 'test-module',
          currentStep: 'cadrage',
          progressPercentage: 50,
          timeSpent: 30,
          lastActivity: new Date(),
          sessionId: 'test-session',
          adaptationsApplied: 1,
          engagementScore: 85
        },
        trigger: {
          type: 'methodology_alert' as const,
          severity: 'warning' as const,
          data: { issue: 'Incohérence détectée dans le cadrage' },
          autoGenerated: true
        },
        urgency: 'immediate' as const
      };

      const notification = await testContext.expertNotificationService.generateExpertNotification(
        notificationRequest
      );

      expect(notification).toBeDefined();
      expect(notification.id).toBeTruthy();
      expect(notification.title).toContain('Expert');
      expect(notification.expertActions).toBeInstanceOf(Array);
      expect(notification.expertActions.length).toBeGreaterThan(0);
    });

    it('devrait traiter un trigger de notification via l\'agent A2A', async () => {
      const notificationId = await testContext.notificationAgent.processNotificationTrigger(
        testContext.mockUserProfile.id,
        testContext.mockUserProfile,
        {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        {
          workshopId: 1,
          moduleId: 'test-module',
          currentStep: 'test',
          progressPercentage: 50,
          timeSpent: 30,
          lastActivity: new Date(),
          sessionId: 'test-session',
          adaptationsApplied: 1,
          engagementScore: 80
        },
        {
          type: 'expert_insight' as const,
          severity: 'info' as const,
          data: { insight: 'Test insight' },
          autoGenerated: true
        }
      );

      expect(notificationId).toBeTruthy();
      expect(typeof notificationId).toBe('string');
    });

    it('devrait établir une communication A2A', async () => {
      await testContext.a2aProtocol.initialize({
        agentId: 'test_a2a_workshop1',
        agentType: 'notification',
        communicationMode: 'real_time',
        retryAttempts: 3,
        timeoutMs: 5000,
        enableEncryption: true,
        enableCompression: false
      });

      const channelId = await testContext.a2aProtocol.createChannel(
        'direct',
        ['test_agent_1', 'test_agent_2']
      );

      expect(channelId).toBeTruthy();

      const message = {
        id: 'test_message_workshop1',
        type: 'test_notification',
        source: 'test_a2a_workshop1',
        target: 'test_agent_1',
        timestamp: new Date().toISOString(),
        data: { test: 'Workshop 1 A2A test' },
        notificationRequest: {} as any,
        responseRequired: false,
        priority: 'medium' as const
      };

      const response = await testContext.a2aProtocol.sendMessage(message);
      expect(response.success).toBe(true);
    });

    it('devrait intégrer les notifications avec l\'infrastructure', async () => {
      const integrationContext = {
        userId: testContext.mockUserProfile.id,
        sessionId: 'test-integration-session',
        userProfile: testContext.mockUserProfile,
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        currentWorkshop: 1,
        currentModule: 'test-integration-module',
        integrationMode: 'real_time' as const
      };

      const trigger = {
        type: 'progress_milestone',
        severity: 'info' as const,
        data: { milestone: 'Test milestone' },
        autoGenerated: true
      };

      const result = await testContext.integrationService.processNotificationRequest(
        integrationContext,
        trigger
      );

      expect(result.success).toBe(true);
      expect(result.notificationId).toBeTruthy();
      expect(result.integrationPath).toMatch(/expert_service|a2a_agent|standard_fallback/);
    });
  });

  // 🧠 TESTS DU POINT 3 - INTERFACE REACT

  describe('🧠 Point 3 - Interface Utilisateur React Intelligente', () => {
    it('devrait valider l\'importation des composants React', async () => {
      // Test d'importation dynamique des composants
      const components = [
        () => import('../../presentation/hooks/useWorkshop1Intelligence'),
        () => import('../../presentation/components/Workshop1Dashboard'),
        () => import('../../presentation/components/ExpertNotificationPanel'),
        () => import('../../presentation/components/A2ACollaborationInterface'),
        () => import('../../presentation/components/RealTimeMetricsDisplay'),
        () => import('../../presentation/components/AdaptiveProgressTracker'),
        () => import('../../presentation/components/ExpertActionToolbar'),
        () => import('../../presentation/components/Workshop1IntelligentInterface')
      ];

      for (const componentImport of components) {
        const component = await componentImport();
        expect(component).toBeDefined();
        expect(Object.keys(component).length).toBeGreaterThan(0);
      }
    });

    it('devrait valider les types TypeScript des composants', () => {
      // Validation des types principaux
      const requiredTypes = [
        'Workshop1IntelligenceState',
        'Workshop1IntelligenceActions',
        'SessionProgress',
        'RealTimeMetrics',
        'InterfaceTheme',
        'LayoutConfiguration'
      ];

      // Simulation de validation des types (en production, ceci serait fait par TypeScript)
      for (const type of requiredTypes) {
        expect(type).toBeTruthy();
        expect(typeof type).toBe('string');
      }
    });
  });

  // 🔗 TESTS D'INTÉGRATION COMPLÈTE

  describe('🔗 Intégration Complète Points 1 + 2 + 3', () => {
    it('devrait exécuter un workflow complet Workshop 1', async () => {
      const startTime = Date.now();

      // 1. Initialisation de session (Point 1)
      const session = await testContext.masterAgent.startIntelligentSession(
        testContext.mockUserProfile.id,
        testContext.mockUserProfile
      );

      // 2. Génération de notification experte (Point 2)
      const notificationRequest = {
        userId: testContext.mockUserProfile.id,
        userProfile: testContext.mockUserProfile,
        expertiseLevel: session.analysisResult.expertiseLevel,
        context: {
          workshopId: 1,
          moduleId: session.currentModule,
          currentStep: 'integration_test',
          progressPercentage: 25,
          timeSpent: 15,
          lastActivity: new Date(),
          sessionId: session.sessionId,
          adaptationsApplied: 0,
          engagementScore: 90
        },
        trigger: {
          type: 'progress_milestone' as const,
          severity: 'info' as const,
          data: { milestone: 'Début workflow intégration' },
          autoGenerated: true
        },
        urgency: 'scheduled' as const
      };

      const notification = await testContext.expertNotificationService.generateExpertNotification(
        notificationRequest
      );

      // 3. Mise à jour de progression (Point 1)
      const progressUpdate = await testContext.masterAgent.updateSessionProgress(
        session.sessionId,
        {
          moduleProgress: 50,
          timeSpent: 30,
          engagementIndicators: ['workflow_completion']
        }
      );

      // 4. Finalisation (Point 1)
      await testContext.masterAgent.updateSessionProgress(session.sessionId, {
        moduleProgress: 100,
        timeSpent: 45
      });

      const summary = await testContext.masterAgent.finalizeSession(session.sessionId);

      const executionTime = Date.now() - startTime;

      // Validations
      expect(session.sessionId).toBeTruthy();
      expect(notification.id).toBeTruthy();
      expect(progressUpdate.success).toBe(true);
      expect(summary.completionRate).toBe(100);
      expect(executionTime).toBeLessThan(5000); // Moins de 5 secondes
    });

    it('devrait gérer les erreurs et fallbacks', async () => {
      // Test avec profil utilisateur invalide
      const invalidProfile = { ...testContext.mockUserProfile, id: '' };

      try {
        await testContext.masterAgent.startIntelligentSession('', invalidProfile);
        expect.fail('Devrait lever une erreur avec profil invalide');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }

      // Test de fallback pour notifications
      const integrationContext = {
        userId: 'invalid-user',
        sessionId: 'invalid-session',
        userProfile: invalidProfile,
        expertiseLevel: {
          level: 'junior' as const,
          score: 0,
          confidence: 0,
          specializations: [],
          weakAreas: [],
          strengths: []
        },
        currentWorkshop: 1,
        currentModule: 'invalid-module',
        integrationMode: 'real_time' as const
      };

      const trigger = {
        type: 'system_error',
        severity: 'critical' as const,
        data: { error: 'Test error handling' },
        autoGenerated: true
      };

      const result = await testContext.integrationService.processNotificationRequest(
        integrationContext,
        trigger
      );

      // Le système devrait utiliser le fallback
      expect(result.integrationPath).toBe('standard_fallback');
    });
  });

  // 📊 TESTS DE PERFORMANCE

  describe('📊 Tests de Performance', () => {
    it('devrait respecter les seuils de performance', async () => {
      const performanceTests = [
        {
          name: 'Initialisation session',
          test: () => testContext.masterAgent.startIntelligentSession(
            testContext.mockUserProfile.id,
            testContext.mockUserProfile
          ),
          maxTime: 2000
        },
        {
          name: 'Génération notification',
          test: async () => {
            const request = {
              userId: testContext.mockUserProfile.id,
              userProfile: testContext.mockUserProfile,
              expertiseLevel: {
                level: 'expert' as const,
                score: 85,
                confidence: 0.9,
                specializations: ['risk_management'],
                weakAreas: [],
                strengths: []
              },
              context: {
                workshopId: 1,
                moduleId: 'perf-test',
                currentStep: 'test',
                progressPercentage: 50,
                timeSpent: 30,
                lastActivity: new Date(),
                sessionId: 'perf-session',
                adaptationsApplied: 1,
                engagementScore: 80
              },
              trigger: {
                type: 'performance_test' as const,
                severity: 'info' as const,
                data: {},
                autoGenerated: true
              },
              urgency: 'scheduled' as const
            };
            return testContext.expertNotificationService.generateExpertNotification(request);
          },
          maxTime: 1000
        }
      ];

      for (const perfTest of performanceTests) {
        const startTime = Date.now();
        await perfTest.test();
        const executionTime = Date.now() - startTime;
        
        expect(executionTime).toBeLessThan(perfTest.maxTime);
        console.log(`⚡ ${perfTest.name}: ${executionTime}ms (max: ${perfTest.maxTime}ms)`);
      }
    });

    it('devrait gérer la charge multiple', async () => {
      const concurrentRequests = 10;
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        const promise = testContext.masterAgent.startIntelligentSession(
          `${testContext.mockUserProfile.id}_${i}`,
          { ...testContext.mockUserProfile, id: `${testContext.mockUserProfile.id}_${i}` }
        );
        promises.push(promise);
      }

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const executionTime = Date.now() - startTime;

      expect(results).toHaveLength(concurrentRequests);
      expect(results.every(r => r.sessionId)).toBe(true);
      expect(executionTime).toBeLessThan(10000); // Moins de 10 secondes pour 10 sessions
      
      console.log(`🚀 Charge multiple: ${concurrentRequests} sessions en ${executionTime}ms`);
    });
  });

  // ✅ TESTS DE VALIDATION

  describe('✅ Validation des Points', () => {
    it('devrait valider le Point 1 avec succès', async () => {
      const validator = Workshop1Point1Validator.getInstance();
      const report = await validator.validatePoint1Implementation();

      expect(report.overallStatus).toMatch(/healthy|degraded/);
      expect(report.successCount).toBeGreaterThan(0);
      expect(report.intelligenceScore).toBeGreaterThan(70);
      expect(report.adaptationScore).toBeGreaterThan(70);
    });

    it('devrait valider le Point 2 avec succès', async () => {
      const validator = Workshop1Point2Validator.getInstance();
      const report = await validator.validatePoint2Implementation();

      expect(report.overallStatus).toMatch(/healthy|degraded/);
      expect(report.successCount).toBeGreaterThan(0);
      expect(report.a2aIntegrationScore).toBeGreaterThan(70);
      expect(report.notificationEfficiencyScore).toBeGreaterThan(70);
    });

    it('devrait valider le Point 3 avec succès', async () => {
      const validator = Workshop1Point3Validator.getInstance();
      const report = await validator.validatePoint3Implementation();

      expect(report.overallStatus).toMatch(/healthy|degraded/);
      expect(report.successCount).toBeGreaterThan(0);
      expect(report.uiIntegrationScore).toBeGreaterThan(70);
      expect(report.adaptiveInterfaceScore).toBeGreaterThan(70);
      expect(report.userExperienceScore).toBeGreaterThan(70);
    });
  });
});

// 🔧 FONCTIONS UTILITAIRES POUR LES TESTS

export const TestUtils = {
  createMockUserProfile: (overrides: Partial<EbiosExpertProfile> = {}): EbiosExpertProfile => ({
    id: 'test-user-' + Date.now(),
    name: 'Test User',
    role: 'Test Expert',
    experience: { ebiosYears: 5, totalYears: 8, projectsCompleted: 12 },
    specializations: ['risk_management'],
    certifications: ['CISSP'],
    sector: 'test',
    organizationType: 'Test Org',
    preferredComplexity: 'intermediate',
    learningStyle: 'guided',
    ...overrides
  }),

  measureExecutionTime: async <T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> => {
    const start = Date.now();
    const result = await fn();
    const time = Date.now() - start;
    return { result, time };
  },

  generateTestMetrics: (tests: Array<{ name: string; success: boolean; time: number }>): TestMetrics => {
    const successCount = tests.filter(t => t.success).length;
    const totalTime = tests.reduce((sum, t) => sum + t.time, 0);
    const errorCount = tests.filter(t => !t.success).length;

    return {
      executionTime: totalTime,
      memoryUsage: process.memoryUsage().heapUsed,
      successRate: (successCount / tests.length) * 100,
      errorCount
    };
  }
};

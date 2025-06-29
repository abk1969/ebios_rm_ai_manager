/**
 * 🎯 TESTS END-TO-END WORKSHOP 1
 * Tests de workflows complets et scénarios utilisateur
 * POINT 4 - Tests et Validation Complète
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Workshop1MasterAgent } from '../domain/services/Workshop1MasterAgent';
import { Workshop1NotificationAgent } from '../domain/services/Workshop1NotificationAgent';
import { ExpertNotificationService } from '../domain/services/ExpertNotificationService';
import { NotificationIntegrationService } from '../domain/services/NotificationIntegrationService';
import { A2ANotificationProtocol } from '../domain/services/A2ANotificationProtocol';
import { EbiosExpertProfile } from '../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR LES TESTS E2E

interface E2EScenario {
  name: string;
  description: string;
  userProfile: EbiosExpertProfile;
  expectedOutcome: {
    sessionCompleted: boolean;
    notificationsGenerated: number;
    adaptationsTriggered: number;
    a2aMessagesExchanged: number;
    finalScore: number;
  };
}

interface E2EResult {
  scenario: string;
  success: boolean;
  executionTime: number;
  actualOutcome: any;
  errors: string[];
  metrics: {
    sessionDuration: number;
    notificationCount: number;
    adaptationCount: number;
    a2aMessageCount: number;
    userSatisfaction: number;
  };
}

// 🎯 SCÉNARIOS E2E

const e2eScenarios: E2EScenario[] = [
  {
    name: 'Expert EBIOS RM - Workflow Complet',
    description: 'Expert expérimenté complète Workshop 1 avec collaboration',
    userProfile: {
      id: 'e2e-expert-001',
      name: 'Dr. Marie Expert',
      role: 'Expert EBIOS RM Senior',
      experience: { ebiosYears: 10, totalYears: 15, projectsCompleted: 50 },
      specializations: ['risk_management', 'threat_intelligence', 'governance'],
      certifications: ['CISSP', 'ANSSI', 'ISO27001'],
      sector: 'santé',
      organizationType: 'CHU',
      preferredComplexity: 'expert',
      learningStyle: 'analytical'
    },
    expectedOutcome: {
      sessionCompleted: true,
      notificationsGenerated: 8,
      adaptationsTriggered: 3,
      a2aMessagesExchanged: 5,
      finalScore: 90
    }
  },
  {
    name: 'Junior EBIOS RM - Apprentissage Guidé',
    description: 'Débutant découvre Workshop 1 avec support adaptatif',
    userProfile: {
      id: 'e2e-junior-001',
      name: 'Alex Junior',
      role: 'Analyste Cybersécurité Junior',
      experience: { ebiosYears: 1, totalYears: 2, projectsCompleted: 3 },
      specializations: ['basic_security'],
      certifications: [],
      sector: 'finance',
      organizationType: 'Banque',
      preferredComplexity: 'intermediate',
      learningStyle: 'guided'
    },
    expectedOutcome: {
      sessionCompleted: true,
      notificationsGenerated: 12,
      adaptationsTriggered: 8,
      a2aMessagesExchanged: 2,
      finalScore: 75
    }
  },
  {
    name: 'RSSI Expérimenté - Validation Méthodologique',
    description: 'RSSI valide la conformité méthodologique EBIOS RM',
    userProfile: {
      id: 'e2e-rssi-001',
      name: 'Jean-Claude RSSI',
      role: 'Responsable Sécurité SI',
      experience: { ebiosYears: 8, totalYears: 20, projectsCompleted: 100 },
      specializations: ['governance', 'compliance', 'risk_management'],
      certifications: ['CISSP', 'CISM', 'ANSSI'],
      sector: 'industrie',
      organizationType: 'Groupe Industriel',
      preferredComplexity: 'expert',
      learningStyle: 'collaborative'
    },
    expectedOutcome: {
      sessionCompleted: true,
      notificationsGenerated: 6,
      adaptationsTriggered: 2,
      a2aMessagesExchanged: 8,
      finalScore: 95
    }
  }
];

// 🎯 SUITE DE TESTS E2E

describe('🎯 Workshop 1 - Tests End-to-End', () => {
  let masterAgent: Workshop1MasterAgent;
  let notificationAgent: Workshop1NotificationAgent;
  let expertNotificationService: ExpertNotificationService;
  let integrationService: NotificationIntegrationService;
  let a2aProtocol: A2ANotificationProtocol;

  beforeEach(async () => {
    // Initialisation des services
    masterAgent = Workshop1MasterAgent.getInstance();
    notificationAgent = Workshop1NotificationAgent.getInstance();
    expertNotificationService = ExpertNotificationService.getInstance();
    integrationService = NotificationIntegrationService.getInstance();
    a2aProtocol = new A2ANotificationProtocol();

    // Initialisation du protocole A2A
    await a2aProtocol.initialize({
      agentId: 'e2e_test_agent',
      agentType: 'notification',
      communicationMode: 'real_time',
      retryAttempts: 3,
      timeoutMs: 5000,
      enableEncryption: true,
      enableCompression: false
    });
  });

  afterEach(async () => {
    try {
      await a2aProtocol.shutdown();
      await notificationAgent.shutdown();
      await integrationService.shutdown();
    } catch (error) {
      console.warn('⚠️ Erreur nettoyage E2E:', error);
    }
  });

  // 🚀 TESTS DES SCÉNARIOS COMPLETS

  describe('🚀 Scénarios Utilisateur Complets', () => {
    e2eScenarios.forEach(scenario => {
      it(`devrait exécuter le scénario: ${scenario.name}`, async () => {
        const result = await executeE2EScenario(scenario);
        
        expect(result.success).toBe(true);
        expect(result.actualOutcome.sessionCompleted).toBe(scenario.expectedOutcome.sessionCompleted);
        expect(result.actualOutcome.finalScore).toBeGreaterThanOrEqual(scenario.expectedOutcome.finalScore - 10);
        expect(result.errors).toHaveLength(0);
        
        console.log(`🎯 Scénario ${scenario.name}:`, {
          success: result.success,
          duration: `${result.executionTime}ms`,
          score: result.actualOutcome.finalScore,
          notifications: result.metrics.notificationCount,
          adaptations: result.metrics.adaptationCount
        });
      }, 60000); // Timeout de 60 secondes
    });

    // 🔧 FONCTION D'EXÉCUTION DE SCÉNARIO

    async function executeE2EScenario(scenario: E2EScenario): Promise<E2EResult> {
      const startTime = Date.now();
      const errors: string[] = [];
      let actualOutcome: any = {};
      let metrics = {
        sessionDuration: 0,
        notificationCount: 0,
        adaptationCount: 0,
        a2aMessageCount: 0,
        userSatisfaction: 0
      };

      try {
        // 1. INITIALISATION DE SESSION
        console.log(`🚀 Démarrage scénario: ${scenario.name}`);
        
        const session = await masterAgent.startIntelligentSession(
          scenario.userProfile.id,
          scenario.userProfile
        );

        expect(session.sessionId).toBeTruthy();
        expect(session.analysisResult.expertiseLevel).toBeDefined();

        // 2. SIMULATION DU PARCOURS UTILISATEUR
        const modules = ['introduction', 'cadrage', 'biens_essentiels', 'biens_supports'];
        let totalNotifications = 0;
        let totalAdaptations = 0;
        let totalA2AMessages = 0;

        for (const [index, moduleId] of modules.entries()) {
          console.log(`📚 Module: ${moduleId}`);
          
          // Adaptation du contenu
          const adaptedContent = await masterAgent.getAdaptedContent(session.sessionId, moduleId);
          expect(adaptedContent).toBeDefined();
          totalAdaptations += adaptedContent.adaptations.length;

          // Simulation de progression
          const progressPercentage = ((index + 1) / modules.length) * 100;
          const timeSpent = (index + 1) * 15; // 15 minutes par module

          const progressUpdate = await masterAgent.updateSessionProgress(session.sessionId, {
            moduleProgress: 100,
            timeSpent,
            engagementIndicators: ['module_completed', 'high_engagement']
          });

          expect(progressUpdate.success).toBe(true);
          totalAdaptations += progressUpdate.adaptationsTriggered.length;

          // Génération de notifications expertes
          const notificationRequest = {
            userId: scenario.userProfile.id,
            userProfile: scenario.userProfile,
            expertiseLevel: session.analysisResult.expertiseLevel,
            context: {
              workshopId: 1,
              moduleId,
              currentStep: 'module_completion',
              progressPercentage,
              timeSpent,
              lastActivity: new Date(),
              sessionId: session.sessionId,
              adaptationsApplied: totalAdaptations,
              engagementScore: 85 + (index * 2)
            },
            trigger: {
              type: 'progress_milestone' as const,
              severity: 'info' as const,
              data: { module: moduleId, completion: 100 },
              autoGenerated: true
            },
            urgency: 'scheduled' as const
          };

          const notification = await expertNotificationService.generateExpertNotification(notificationRequest);
          expect(notification.id).toBeTruthy();
          totalNotifications++;

          // Traitement via intégration A2A
          const integrationContext = {
            userId: scenario.userProfile.id,
            sessionId: session.sessionId,
            userProfile: scenario.userProfile,
            expertiseLevel: session.analysisResult.expertiseLevel,
            currentWorkshop: 1,
            currentModule: moduleId,
            integrationMode: 'real_time' as const
          };

          const integrationResult = await integrationService.processNotificationRequest(
            integrationContext,
            {
              type: 'module_completion',
              severity: 'info' as const,
              data: { module: moduleId },
              autoGenerated: true
            }
          );

          expect(integrationResult.success).toBe(true);

          // Simulation de collaboration A2A pour experts avancés
          if (session.analysisResult.expertiseLevel.level === 'expert' || 
              session.analysisResult.expertiseLevel.level === 'master') {
            
            const a2aMessage = {
              id: `e2e_message_${moduleId}_${Date.now()}`,
              type: 'collaboration_request',
              source: 'e2e_test_agent',
              target: 'expert_network',
              timestamp: new Date().toISOString(),
              data: { 
                module: moduleId, 
                expertise: session.analysisResult.expertiseLevel.level,
                sector: scenario.userProfile.sector
              },
              notificationRequest,
              responseRequired: false,
              priority: 'medium' as const
            };

            const a2aResponse = await a2aProtocol.sendMessage(a2aMessage);
            if (a2aResponse.success) {
              totalA2AMessages++;
            }
          }

          // Pause entre modules pour simulation réaliste
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // 3. FINALISATION DE SESSION
        const summary = await masterAgent.finalizeSession(session.sessionId);
        expect(summary.sessionId).toBe(session.sessionId);
        expect(summary.completionRate).toBe(100);

        // 4. COLLECTE DES MÉTRIQUES
        const sessionMetrics = masterAgent.getSessionMetrics(session.sessionId);
        const integrationMetrics = integrationService.getIntegrationMetrics();
        const a2aMetrics = a2aProtocol.getMetrics();

        metrics = {
          sessionDuration: Date.now() - startTime,
          notificationCount: totalNotifications,
          adaptationCount: totalAdaptations,
          a2aMessageCount: totalA2AMessages,
          userSatisfaction: sessionMetrics?.effectiveness || 85
        };

        actualOutcome = {
          sessionCompleted: true,
          notificationsGenerated: totalNotifications,
          adaptationsTriggered: totalAdaptations,
          a2aMessagesExchanged: totalA2AMessages,
          finalScore: summary.overallScore || metrics.userSatisfaction
        };

        console.log(`✅ Scénario ${scenario.name} terminé avec succès`);

      } catch (error) {
        console.error(`❌ Erreur scénario ${scenario.name}:`, error);
        errors.push(error instanceof Error ? error.message : 'Unknown error');
        
        actualOutcome = {
          sessionCompleted: false,
          notificationsGenerated: 0,
          adaptationsTriggered: 0,
          a2aMessagesExchanged: 0,
          finalScore: 0
        };
      }

      const executionTime = Date.now() - startTime;

      return {
        scenario: scenario.name,
        success: errors.length === 0 && actualOutcome.sessionCompleted,
        executionTime,
        actualOutcome,
        errors,
        metrics
      };
    }
  });

  // 🔄 TESTS DE WORKFLOWS SPÉCIALISÉS

  describe('🔄 Workflows Spécialisés', () => {
    it('devrait gérer un workflow de collaboration experte', async () => {
      const expertProfile: EbiosExpertProfile = {
        id: 'collab-expert-001',
        name: 'Expert Collaboration',
        role: 'Expert EBIOS RM Collaboratif',
        experience: { ebiosYears: 12, totalYears: 18, projectsCompleted: 75 },
        specializations: ['risk_management', 'collaboration', 'mentoring'],
        certifications: ['CISSP', 'ANSSI', 'PMP'],
        sector: 'conseil',
        organizationType: 'Cabinet Conseil',
        preferredComplexity: 'expert',
        learningStyle: 'collaborative'
      };

      // Initialisation de session
      const session = await masterAgent.startIntelligentSession(expertProfile.id, expertProfile);
      
      // Simulation de demandes de collaboration
      const collaborationRequests = [
        'Validation méthodologique Workshop 1',
        'Partage d\'expérience secteur santé',
        'Révision des livrables EBIOS RM'
      ];

      let collaborationCount = 0;
      for (const request of collaborationRequests) {
        const notificationId = await notificationAgent.processNotificationTrigger(
          expertProfile.id,
          expertProfile,
          session.analysisResult.expertiseLevel,
          {
            workshopId: 1,
            moduleId: 'collaboration',
            currentStep: 'expert_review',
            progressPercentage: 75,
            timeSpent: 60,
            lastActivity: new Date(),
            sessionId: session.sessionId,
            adaptationsApplied: 2,
            engagementScore: 95
          },
          {
            type: 'collaboration_request' as const,
            severity: 'info' as const,
            data: { request },
            autoGenerated: false
          }
        );

        expect(notificationId).toBeTruthy();
        collaborationCount++;
      }

      expect(collaborationCount).toBe(3);
      
      // Finalisation
      const summary = await masterAgent.finalizeSession(session.sessionId);
      expect(summary.completionRate).toBeGreaterThan(80);
    });

    it('devrait gérer un workflow d\'apprentissage adaptatif', async () => {
      const learnerProfile: EbiosExpertProfile = {
        id: 'adaptive-learner-001',
        name: 'Apprenant Adaptatif',
        role: 'Analyste en Formation',
        experience: { ebiosYears: 0.5, totalYears: 1, projectsCompleted: 1 },
        specializations: ['basic_security'],
        certifications: [],
        sector: 'éducation',
        organizationType: 'Université',
        preferredComplexity: 'intermediate',
        learningStyle: 'guided'
      };

      // Initialisation avec niveau débutant
      const session = await masterAgent.startIntelligentSession(learnerProfile.id, learnerProfile);
      expect(session.analysisResult.expertiseLevel.level).toMatch(/junior|intermediate/);

      // Simulation d'apprentissage progressif
      const learningSteps = [
        { difficulty: 'basic', engagement: 60 },
        { difficulty: 'intermediate', engagement: 70 },
        { difficulty: 'intermediate', engagement: 80 },
        { difficulty: 'advanced', engagement: 85 }
      ];

      let adaptationCount = 0;
      for (const [index, step] of learningSteps.entries()) {
        const progressUpdate = await masterAgent.updateSessionProgress(session.sessionId, {
          moduleProgress: (index + 1) * 25,
          timeSpent: (index + 1) * 20,
          engagementIndicators: step.engagement > 75 ? ['high_engagement'] : ['medium_engagement']
        });

        adaptationCount += progressUpdate.adaptationsTriggered.length;
      }

      expect(adaptationCount).toBeGreaterThan(2); // Adaptations déclenchées
      
      const summary = await masterAgent.finalizeSession(session.sessionId);
      expect(summary.recommendations).toBeInstanceOf(Array);
      expect(summary.recommendations.length).toBeGreaterThan(0);
    });
  });

  // 🚨 TESTS DE GESTION D'ERREURS

  describe('🚨 Gestion d\'Erreurs E2E', () => {
    it('devrait gérer les erreurs de session gracieusement', async () => {
      const invalidProfile: EbiosExpertProfile = {
        id: '', // ID invalide
        name: 'Invalid User',
        role: 'Test',
        experience: { ebiosYears: -1, totalYears: -1, projectsCompleted: -1 },
        specializations: [],
        certifications: [],
        sector: '',
        organizationType: '',
        preferredComplexity: 'intermediate',
        learningStyle: 'guided'
      };

      try {
        await masterAgent.startIntelligentSession(invalidProfile.id, invalidProfile);
        expect.fail('Devrait lever une erreur avec profil invalide');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('devrait utiliser les fallbacks en cas d\'erreur A2A', async () => {
      const testProfile: EbiosExpertProfile = {
        id: 'fallback-test-001',
        name: 'Fallback Test User',
        role: 'Test User',
        experience: { ebiosYears: 5, totalYears: 8, projectsCompleted: 12 },
        specializations: ['risk_management'],
        certifications: ['CISSP'],
        sector: 'test',
        organizationType: 'Test Org',
        preferredComplexity: 'intermediate',
        learningStyle: 'guided'
      };

      // Arrêt du protocole A2A pour forcer le fallback
      await a2aProtocol.shutdown();

      const integrationContext = {
        userId: testProfile.id,
        sessionId: 'fallback-session',
        userProfile: testProfile,
        expertiseLevel: {
          level: 'intermediate' as const,
          score: 60,
          confidence: 0.8,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        currentWorkshop: 1,
        currentModule: 'fallback-test',
        integrationMode: 'real_time' as const
      };

      const result = await integrationService.processNotificationRequest(
        integrationContext,
        {
          type: 'fallback_test',
          severity: 'warning' as const,
          data: { test: 'fallback scenario' },
          autoGenerated: true
        }
      );

      expect(result.success).toBe(true);
      expect(result.integrationPath).toBe('standard_fallback');
    });
  });

  // 📊 TESTS DE MÉTRIQUES E2E

  describe('📊 Métriques End-to-End', () => {
    it('devrait collecter des métriques complètes sur un workflow', async () => {
      const metricsProfile: EbiosExpertProfile = {
        id: 'metrics-test-001',
        name: 'Metrics Test User',
        role: 'Expert Métriques',
        experience: { ebiosYears: 6, totalYears: 10, projectsCompleted: 30 },
        specializations: ['risk_management', 'metrics'],
        certifications: ['CISSP'],
        sector: 'finance',
        organizationType: 'Banque',
        preferredComplexity: 'expert',
        learningStyle: 'analytical'
      };

      const startTime = Date.now();
      
      // Workflow complet avec collecte de métriques
      const session = await masterAgent.startIntelligentSession(metricsProfile.id, metricsProfile);
      
      // Simulation d'activité
      await masterAgent.updateSessionProgress(session.sessionId, {
        moduleProgress: 100,
        timeSpent: 45,
        engagementIndicators: ['high_engagement', 'expert_level']
      });
      
      const summary = await masterAgent.finalizeSession(session.sessionId);
      const executionTime = Date.now() - startTime;
      
      // Vérification des métriques
      const sessionMetrics = masterAgent.getSessionMetrics(session.sessionId);
      const integrationMetrics = integrationService.getIntegrationMetrics();
      
      expect(sessionMetrics).toBeDefined();
      expect(sessionMetrics.effectiveness).toBeGreaterThan(0);
      expect(integrationMetrics.totalNotificationsProcessed).toBeGreaterThanOrEqual(0);
      expect(executionTime).toBeLessThan(10000); // Moins de 10 secondes
      
      console.log('📊 Métriques E2E:', {
        sessionDuration: executionTime,
        effectiveness: sessionMetrics.effectiveness,
        completionRate: summary.completionRate,
        notificationsProcessed: integrationMetrics.totalNotificationsProcessed
      });
    });
  });
});

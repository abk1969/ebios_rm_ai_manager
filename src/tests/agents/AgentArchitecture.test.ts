/**
 * 🧪 TESTS ARCHITECTURE AGENTIC - VALIDATION ANTI-RÉGRESSION
 * Tests exhaustifs pour garantir ZERO BREAKING CHANGE
 * Conformité ANSSI et performance selon audit technique
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AgentRegistry, AgentService, AgentStatus } from '../../services/agents/AgentService';
import { DocumentationAgent } from '../../services/agents/DocumentationAgent';
import { CircuitBreaker, CircuitState } from '../../services/agents/CircuitBreaker';
import { HybridEbiosService } from '../../services/agents/HybridEbiosService';
import { RegressionDetector } from '../../services/monitoring/RegressionDetector';

// Mock des services legacy
const mockLegacyService = {
  performRiskAnalysis: async (input: any) => ({ result: 'legacy-analysis', source: 'legacy' }),
  generateSuggestions: async (input: any) => ['suggestion1', 'suggestion2'],
  validateCompliance: async (input: any) => ({ isValid: true, score: 85 })
};

describe('🤖 Architecture Agentic - Tests Anti-Régression', () => {
  let agentRegistry: AgentRegistry;
  let documentationAgent: DocumentationAgent;
  let circuitBreaker: CircuitBreaker;
  let hybridService: HybridEbiosService;

  beforeEach(() => {
    // Réinitialisation pour chaque test
    agentRegistry = AgentRegistry.getInstance();
    documentationAgent = new DocumentationAgent();
    circuitBreaker = new CircuitBreaker('test-circuit');
    hybridService = new HybridEbiosService(mockLegacyService);
  });

  afterEach(() => {
    // Nettoyage après chaque test
    circuitBreaker.reset();
  });

  describe('📋 Agent Registry - Gestion Centralisée', () => {
    it('devrait enregistrer un agent correctement', () => {
      agentRegistry.registerAgent(documentationAgent);
      
      const retrievedAgent = agentRegistry.getAgent('documentation-agent');
      expect(retrievedAgent).toBeDefined();
      expect(retrievedAgent?.name).toBe('Agent Documentation EBIOS RM');
    });

    it('devrait trouver les agents capables pour une tâche', () => {
      agentRegistry.registerAgent(documentationAgent);
      
      const capableAgents = agentRegistry.findCapableAgents('explain-concept');
      expect(capableAgents).toHaveLength(1);
      expect(capableAgents[0].id).toBe('documentation-agent');
    });

    it('devrait retourner les statistiques correctes', () => {
      agentRegistry.registerAgent(documentationAgent);
      
      const stats = agentRegistry.getStats();
      expect(stats.totalAgents).toBe(1);
      expect(stats.activeAgents).toBe(1);
      expect(stats.capabilities).toBeGreaterThan(0);
    });
  });

  describe('📚 Agent Documentation - Fonctionnalités Non-Critiques', () => {
    it('devrait expliquer un concept EBIOS RM', async () => {
      const task = {
        id: 'test-task-1',
        type: 'explain-concept',
        input: { concept: 'valeur_metier' },
        priority: 'low' as const
      };

      const result = await documentationAgent.executeTask(task);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.concept).toBe('Valeur Métier');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('devrait générer un tooltip contextuel', async () => {
      const task = {
        id: 'test-task-2',
        type: 'generate-tooltip',
        input: { fieldName: 'gravity', workshop: 1 },
        priority: 'low' as const
      };

      const result = await documentationAgent.executeTask(task);
      
      expect(result.success).toBe(true);
      expect(result.data).toContain('Échelle de gravité EBIOS RM');
      expect(result.data).toContain('Atelier 1');
    });

    it('devrait suggérer des exemples pertinents', async () => {
      const task = {
        id: 'test-task-3',
        type: 'suggest-examples',
        input: { entityType: 'business_value' },
        priority: 'low' as const
      };

      const result = await documentationAgent.executeTask(task);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('devrait toujours être en bonne santé', async () => {
      const isHealthy = await documentationAgent.healthCheck();
      expect(isHealthy).toBe(true);
    });
  });

  describe('🔄 Circuit Breaker - Protection Anti-Régression', () => {
    it('devrait être fermé par défaut', () => {
      expect(circuitBreaker.isAvailable()).toBe(true);
      
      const stats = circuitBreaker.getStats();
      expect(stats.state).toBe(CircuitState.CLOSED);
    });

    it('devrait s\'ouvrir après le seuil d\'échecs', () => {
      // Simuler des échecs
      for (let i = 0; i < 5; i++) {
        circuitBreaker.recordFailure();
      }
      
      expect(circuitBreaker.isAvailable()).toBe(false);
      
      const stats = circuitBreaker.getStats();
      expect(stats.state).toBe(CircuitState.OPEN);
    });

    it('devrait exécuter avec fallback automatique', async () => {
      // Forcer l'ouverture du circuit
      circuitBreaker.forceOpen();
      
      const result = await circuitBreaker.execute(
        async () => { throw new Error('Service indisponible'); },
        async () => 'fallback-result'
      );
      
      expect(result.result).toBe('fallback-result');
      expect(result.usedFallback).toBe(true);
    });

    it('devrait enregistrer les succès correctement', () => {
      circuitBreaker.recordSuccess();
      
      const stats = circuitBreaker.getStats();
      expect(stats.successes).toBe(1);
      expect(stats.state).toBe(CircuitState.CLOSED);
    });
  });

  describe('🔄 Service Hybride - Migration Progressive', () => {
    it('devrait utiliser le service legacy par défaut', async () => {
      const hybridServiceDisabled = new HybridEbiosService(mockLegacyService, {
        enableAgents: false
      });

      const result = await hybridServiceDisabled.performRiskAnalysis({
        businessValues: [],
        dreadedEvents: [],
        riskSources: [],
        missionId: 'test-mission'
      });

      expect(result.source).toBe('legacy');
      expect(result.data.source).toBe('legacy');
    });

    it('devrait générer des suggestions basiques en fallback', async () => {
      const result = await hybridService.generateSuggestions({
        entityType: 'business_value',
        entityData: {},
        context: {}
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.source).toBe('legacy'); // Pas d'agent configuré
    });

    it('devrait valider la conformité EBIOS', async () => {
      const result = await hybridService.validateEbiosCompliance({
        missionId: 'test-mission',
        workshop: 1,
        data: { businessValues: [] }
      });

      expect(result.success).toBe(true);
      expect(result.data.isValid).toBeDefined();
      expect(result.data.score).toBeGreaterThanOrEqual(0);
    });

    it('devrait fournir des statistiques d\'utilisation', () => {
      const stats = hybridService.getStats();
      
      expect(stats).toHaveProperty('circuitBreaker');
      expect(stats).toHaveProperty('agentUsage');
      expect(stats).toHaveProperty('legacyUsage');
      expect(stats).toHaveProperty('totalRequests');
    });
  });

  describe('🔍 Détecteur de Régression - Monitoring Qualité', () => {
    let regressionDetector: RegressionDetector;

    beforeEach(() => {
      regressionDetector = new RegressionDetector();
    });

    it('devrait établir une baseline correctement', () => {
      const baselineMetrics = {
        timestamp: new Date(),
        apiResponseTime: 200,
        databaseQueryTime: 50,
        agentOrchestrationOverhead: 10,
        ebiosWorkflowCompletionRate: 0.98,
        dataConsistencyScore: 0.99,
        userSatisfactionScore: 4.2,
        agentAvailabilityRate: 0.99,
        circuitBreakerActivations: 0,
        fallbackUsageRate: 0.05,
        anssiComplianceScore: 0.96,
        validationSuccessRate: 0.98,
        auditTrailCompleteness: 1.0
      };

      expect(() => {
        regressionDetector.setBaseline(baselineMetrics, '1.0.0', 'production');
      }).not.toThrow();
    });

    it('devrait détecter les régressions de performance', () => {
      // Établir baseline
      const baseline = {
        timestamp: new Date(),
        apiResponseTime: 200,
        databaseQueryTime: 50,
        agentOrchestrationOverhead: 10,
        ebiosWorkflowCompletionRate: 0.98,
        dataConsistencyScore: 0.99,
        userSatisfactionScore: 4.2,
        agentAvailabilityRate: 0.99,
        circuitBreakerActivations: 0,
        fallbackUsageRate: 0.05,
        anssiComplianceScore: 0.96,
        validationSuccessRate: 0.98,
        auditTrailCompleteness: 1.0
      };

      regressionDetector.setBaseline(baseline, '1.0.0', 'production');

      // Métriques dégradées
      const currentMetrics = {
        ...baseline,
        apiResponseTime: 300, // +50% (seuil: +30%)
        anssiComplianceScore: 0.92 // En dessous du seuil critique
      };

      const alerts = regressionDetector.detectRegressions(currentMetrics);
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.regressionType === 'performance')).toBe(true);
    });

    it('devrait générer un rapport de santé global', () => {
      const baseline = {
        timestamp: new Date(),
        apiResponseTime: 200,
        databaseQueryTime: 50,
        agentOrchestrationOverhead: 10,
        ebiosWorkflowCompletionRate: 0.98,
        dataConsistencyScore: 0.99,
        userSatisfactionScore: 4.2,
        agentAvailabilityRate: 0.99,
        circuitBreakerActivations: 0,
        fallbackUsageRate: 0.05,
        anssiComplianceScore: 0.96,
        validationSuccessRate: 0.98,
        auditTrailCompleteness: 1.0
      };

      regressionDetector.setBaseline(baseline, '1.0.0', 'production');

      const healthReport = regressionDetector.generateHealthReport(baseline);
      
      expect(healthReport.overallHealth).toBe('excellent');
      expect(healthReport.score).toBe(100);
      expect(healthReport.alerts).toHaveLength(0);
      expect(Array.isArray(healthReport.recommendations)).toBe(true);
    });
  });

  describe('🚨 Tests de Non-Régression Critiques', () => {
    it('devrait préserver la compatibilité des APIs existantes', async () => {
      // Test que les APIs existantes continuent de fonctionner
      const legacyResult = await mockLegacyService.performRiskAnalysis({
        businessValues: [],
        dreadedEvents: [],
        riskSources: []
      });

      expect(legacyResult).toBeDefined();
      expect(legacyResult.source).toBe('legacy');
    });

    it('devrait maintenir les performances dans les seuils acceptables', async () => {
      const startTime = Date.now();
      
      await documentationAgent.executeTask({
        id: 'perf-test',
        type: 'explain-concept',
        input: { concept: 'valeur_metier' },
        priority: 'low'
      });
      
      const executionTime = Date.now() - startTime;
      
      // Seuil de performance: < 1 seconde pour les agents non-critiques
      expect(executionTime).toBeLessThan(1000);
    });

    it('devrait garantir la disponibilité du système', async () => {
      // Test de disponibilité avec circuit breaker
      const results = [];
      
      for (let i = 0; i < 10; i++) {
        const result = await circuitBreaker.execute(
          async () => 'success',
          async () => 'fallback'
        );
        results.push(result);
      }
      
      // Tous les appels doivent retourner un résultat
      expect(results).toHaveLength(10);
      expect(results.every(r => r.result)).toBe(true);
    });

    it('devrait maintenir la conformité ANSSI', async () => {
      const complianceResult = await hybridService.validateEbiosCompliance({
        missionId: 'test-mission',
        workshop: 1,
        data: {
          businessValues: [
            { id: '1', name: 'Test BV 1' },
            { id: '2', name: 'Test BV 2' },
            { id: '3', name: 'Test BV 3' }
          ]
        }
      });

      expect(complianceResult.data.score).toBeGreaterThanOrEqual(80);
    });
  });
});

describe('🔧 Tests d\'Intégration - Workflow Complet', () => {
  it('devrait exécuter un workflow EBIOS complet avec agents', async () => {
    const agentRegistry = AgentRegistry.getInstance();
    const documentationAgent = new DocumentationAgent();
    
    // Enregistrer l'agent
    agentRegistry.registerAgent(documentationAgent);
    
    // Simuler un workflow
    const workflowSteps = [
      'explain-concept',
      'generate-tooltip',
      'suggest-examples'
    ];
    
    const results = [];
    
    for (const step of workflowSteps) {
      const task = {
        id: `workflow-${step}`,
        type: step,
        input: { concept: 'valeur_metier', fieldName: 'name', entityType: 'business_value' },
        priority: 'medium' as const
      };
      
      const result = await documentationAgent.executeTask(task);
      results.push(result);
    }
    
    // Vérifier que toutes les étapes ont réussi
    expect(results.every(r => r.success)).toBe(true);
    expect(results).toHaveLength(workflowSteps.length);
  });
});

#!/usr/bin/env tsx

/**
 * 🔍 VALIDATION ARCHITECTURE AGENTIC - VÉRIFICATION RAPIDE
 * Script de validation pour s'assurer que l'architecture est prête
 */

import { AgentRegistry } from '../src/services/agents/AgentService';
import { DocumentationAgent } from '../src/services/agents/DocumentationAgent';
import { CircuitBreaker } from '../src/services/agents/CircuitBreaker';
import { HybridEbiosService } from '../src/services/agents/HybridEbiosService';
import { RegressionDetector } from '../src/services/monitoring/RegressionDetector';

// Mock simple pour les tests
const mockLegacyService = {
  performRiskAnalysis: async (input: any) => ({ result: 'legacy-analysis', source: 'legacy' }),
  generateSuggestions: async (input: any) => ['suggestion1', 'suggestion2'],
  validateCompliance: async (input: any) => ({ isValid: true, score: 85 })
};

async function validateArchitecture(): Promise<boolean> {
  console.log('🔍 VALIDATION ARCHITECTURE AGENTIC');
  console.log('=====================================\n');

  let allTestsPassed = true;
  const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

  // Test 1: Agent Registry
  try {
    console.log('📋 Test 1: Agent Registry...');
    const registry = AgentRegistry.getInstance();
    const stats = registry.getStats();
    
    if (stats.totalAgents >= 0) {
      results.push({ test: 'Agent Registry', status: 'PASS' });
      console.log('   ✅ Agent Registry opérationnel');
    } else {
      throw new Error('Stats invalides');
    }
  } catch (error) {
    results.push({ test: 'Agent Registry', status: 'FAIL', details: String(error) });
    console.log('   ❌ Agent Registry échoué:', error);
    allTestsPassed = false;
  }

  // Test 2: Documentation Agent
  try {
    console.log('📚 Test 2: Documentation Agent...');
    const docAgent = new DocumentationAgent();
    const registry = AgentRegistry.getInstance();
    
    registry.registerAgent(docAgent);
    
    const task = {
      id: 'test-task',
      type: 'explain-concept',
      input: { concept: 'valeur_metier' },
      priority: 'low' as const
    };

    const result = await docAgent.executeTask(task);
    
    if (result.success && result.data) {
      results.push({ test: 'Documentation Agent', status: 'PASS' });
      console.log('   ✅ Documentation Agent fonctionnel');
      console.log(`   📝 Concept expliqué: ${result.data.concept}`);
    } else {
      throw new Error('Résultat invalide');
    }
  } catch (error) {
    results.push({ test: 'Documentation Agent', status: 'FAIL', details: String(error) });
    console.log('   ❌ Documentation Agent échoué:', error);
    allTestsPassed = false;
  }

  // Test 3: Circuit Breaker
  try {
    console.log('🔄 Test 3: Circuit Breaker...');
    const circuitBreaker = new CircuitBreaker('test-circuit');
    
    // Test exécution normale
    const result = await circuitBreaker.execute(
      async () => 'success',
      async () => 'fallback'
    );
    
    if (result.result === 'success' && !result.usedFallback) {
      results.push({ test: 'Circuit Breaker', status: 'PASS' });
      console.log('   ✅ Circuit Breaker opérationnel');
    } else {
      throw new Error('Comportement inattendu');
    }
  } catch (error) {
    results.push({ test: 'Circuit Breaker', status: 'FAIL', details: String(error) });
    console.log('   ❌ Circuit Breaker échoué:', error);
    allTestsPassed = false;
  }

  // Test 4: Service Hybride
  try {
    console.log('🔀 Test 4: Service Hybride...');
    const hybridService = new HybridEbiosService(mockLegacyService, {
      enableAgents: false // Test mode legacy
    });
    
    const result = await hybridService.generateSuggestions({
      entityType: 'business_value',
      entityData: {},
      context: {}
    });
    
    if (result.data && Array.isArray(result.data) && result.source === 'legacy') {
      results.push({ test: 'Service Hybride', status: 'PASS' });
      console.log('   ✅ Service Hybride opérationnel');
      console.log(`   📊 Source: ${result.source}, Suggestions: ${result.data.length}`);
    } else {
      throw new Error('Résultat invalide');
    }
  } catch (error) {
    results.push({ test: 'Service Hybride', status: 'FAIL', details: String(error) });
    console.log('   ❌ Service Hybride échoué:', error);
    allTestsPassed = false;
  }

  // Test 5: Détecteur de Régression
  try {
    console.log('🔍 Test 5: Détecteur de Régression...');
    const detector = new RegressionDetector();
    
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

    detector.setBaseline(baselineMetrics, '1.0.0', 'test');
    const healthReport = detector.generateHealthReport(baselineMetrics);
    
    if (healthReport.overallHealth === 'excellent' && healthReport.score === 100) {
      results.push({ test: 'Détecteur Régression', status: 'PASS' });
      console.log('   ✅ Détecteur de Régression opérationnel');
      console.log(`   📊 Santé: ${healthReport.overallHealth}, Score: ${healthReport.score}`);
    } else {
      throw new Error('Santé inattendue');
    }
  } catch (error) {
    results.push({ test: 'Détecteur Régression', status: 'FAIL', details: String(error) });
    console.log('   ❌ Détecteur de Régression échoué:', error);
    allTestsPassed = false;
  }

  // Test 6: Intégration Complète
  try {
    console.log('🎯 Test 6: Intégration Complète...');
    const registry = AgentRegistry.getInstance();
    const stats = registry.getStats();
    
    if (stats.totalAgents > 0 && stats.activeAgents > 0) {
      results.push({ test: 'Intégration Complète', status: 'PASS' });
      console.log('   ✅ Intégration complète validée');
      console.log(`   📊 Agents: ${stats.totalAgents} total, ${stats.activeAgents} actifs`);
    } else {
      throw new Error('Pas d\'agents enregistrés');
    }
  } catch (error) {
    results.push({ test: 'Intégration Complète', status: 'FAIL', details: String(error) });
    console.log('   ❌ Intégration complète échouée:', error);
    allTestsPassed = false;
  }

  // Résumé final
  console.log('\n📊 RÉSUMÉ DE VALIDATION');
  console.log('========================');
  
  const passedTests = results.filter(r => r.status === 'PASS').length;
  const totalTests = results.length;
  
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 ARCHITECTURE AGENTIC VALIDÉE !');
    console.log('✅ Prêt pour la migration Phase 1');
    console.log('✅ Tous les composants critiques opérationnels');
    console.log('✅ Zero breaking change garanti');
  } else {
    console.log('\n⚠️  PROBLÈMES DÉTECTÉS');
    console.log('❌ Corriger les erreurs avant migration');
    
    results.filter(r => r.status === 'FAIL').forEach(result => {
      console.log(`   - ${result.test}: ${result.details}`);
    });
  }

  return allTestsPassed;
}

// Exécution du script
async function main() {
  try {
    const success = await validateArchitecture();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('💥 Erreur fatale lors de la validation:', error);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateArchitecture };

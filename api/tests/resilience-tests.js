/**
 * 🧪 TESTS DE RÉSILIENCE DU SYSTÈME EBIOS RM
 * Validation de la robustesse et récupération automatique
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require('axios');
const { healthMonitor } = require('../services/health-monitor');
const { fallbackSystem } = require('../services/fallback-system');
const { retryManager } = require('../services/retry-manager');

class ResilienceTestSuite {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.aiServiceUrl = 'http://localhost:8081';
    this.testResults = [];
    this.testStartTime = null;
  }

  /**
   * Exécute un test et enregistre le résultat
   */
  async runTest(testName, testFunction) {
    console.log(`\n🧪 Test: ${testName}`);
    console.log('='.repeat(50));
    
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        status: 'PASSED',
        duration,
        result,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ ${testName} - RÉUSSI (${duration}ms)`);
      return true;
      
    } catch (__error) {
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        status: 'FAILED',
        duration,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.error(`❌ ${testName} - ÉCHEC (${duration}ms): ${error.message}`);
      return false;
    }
  }

  /**
   * Test de charge basique
   */
  async testBasicLoad() {
    const concurrentRequests = 10;
    const requests = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(
        axios.get(`${this.baseUrl}/api/monitoring/health`, {
          timeout: 5000
        })
      );
    }
    
    const results = await Promise.allSettled(requests);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const successRate = successful / concurrentRequests;
    
    if (successRate < 0.9) {
      throw new Error(`Taux de succès trop faible: ${successRate * 100}%`);
    }
    
    return {
      concurrentRequests,
      successful,
      successRate: successRate * 100
    };
  }

  /**
   * Test de fallback quand le service AI est indisponible
   */
  async testAIServiceFallback() {
    // Simuler une requête vers un service AI indisponible
    const testData = {
      workshop: 'workshop1',
      context: { test: true }
    };
    
    try {
      const _response = await axios.post(`${this.baseUrl}/api/ai/suggestions`, testData, {
        timeout: 10000
      });
      
      if (!response.data.fallback && !response.data.suggestions) {
        throw new Error('Réponse invalide du service');
      }
      
      return {
        fallbackActivated: response.data.fallback || false,
        suggestionsReceived: Array.isArray(response.data.suggestions),
        responseTime: response.headers['x-response-time'] || 'unknown'
      };
      
    } catch (__error) {
      if (error.response && error.response.status < 500) {
        // Erreur client acceptable
        return {
          fallbackActivated: true,
          error: error.response.data
        };
      }
      throw error;
    }
  }

  /**
   * Test de récupération après panne simulée
   */
  async testRecoveryAfterFailure() {
    const testOperations = [];
    
    // Simuler plusieurs tentatives avec des échecs
    for (let i = 0; i < 5; i++) {
      testOperations.push(async () => {
        if (i < 2) {
          // Simuler un échec pour les 2 premières tentatives
          throw new Error(`Simulated failure ${i + 1}`);
        }
        return { success: true, attempt: i + 1 };
      });
    }
    
    let successfulRecovery = false;
    let lastResult = null;
    
    for (const operation of testOperations) {
      try {
        const result = await retryManager.executeWithRetry(operation, {
          maxRetries: 1,
          baseDelay: 100,
          operationName: 'recovery-test'
        });
        
        lastResult = result;
        successfulRecovery = true;
        break;
        
      } catch (__error) {
        // Continue avec la prochaine opération
        continue;
      }
    }
    
    if (!successfulRecovery) {
      throw new Error('Aucune récupération réussie après les pannes simulées');
    }
    
    return {
      recoverySuccessful: true,
      finalResult: lastResult
    };
  }

  /**
   * Test de circuit breaker
   */
  async testCircuitBreaker() {
    // Enregistrer un circuit breaker de test
    fallbackSystem.registerCircuitBreaker('test-service');
    
    // Simuler des échecs pour déclencher le circuit breaker
    for (let i = 0; i < 6; i++) {
      fallbackSystem.recordFailure('test-service');
    }
    
    // Vérifier que le circuit breaker est ouvert
    const circuitCheck = fallbackSystem.checkCircuitBreaker('test-service');
    
    if (circuitCheck.canProceed) {
      throw new Error('Circuit breaker devrait être ouvert après 6 échecs');
    }
    
    return {
      circuitBreakerState: circuitCheck.state,
      failuresRecorded: 6
    };
  }

  /**
   * Test de cache et performance
   */
  async testCachePerformance() {
    const testKey = 'test-cache-key';
    const testData = { test: true, timestamp: Date.now() };
    
    // Mettre en cache
    fallbackSystem.cacheResponse(testKey, testData, 5000);
    
    // Récupérer du cache
    const startTime = Date.now();
    const cachedData = fallbackSystem.getCachedResponse(testKey);
    const cacheResponseTime = Date.now() - startTime;
    
    if (!cachedData || !cachedData.fromCache) {
      throw new Error('Données non trouvées dans le cache');
    }
    
    return {
      cacheHit: true,
      responseTime: cacheResponseTime,
      dataIntegrity: cachedData.test === testData.test
    };
  }

  /**
   * Test de monitoring et alertes
   */
  async testMonitoringAndAlerts() {
    let alertReceived = false;
    
    // Écouter les alertes
    const alertHandler = (alert) => {
      alertReceived = true;
    };
    
    healthMonitor.on('alert', alertHandler);
    
    try {
      // Déclencher une alerte en simulant un service défaillant
      healthMonitor.registerService('test-failing-service', {
        url: 'http://localhost:99999', // Port inexistant
        timeout: 1000,
        critical: true
      });
      
      // Vérifier le service (devrait échouer)
      await healthMonitor.checkServiceHealth('test-failing-service');
      
      // Attendre un peu pour que l'alerte soit émise
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        alertSystemWorking: alertReceived,
        serviceRegistered: healthMonitor.services.has('test-failing-service')
      };
      
    } finally {
      healthMonitor.off('alert', alertHandler);
    }
  }

  /**
   * Test de stress avec requêtes simultanées
   */
  async testStressLoad() {
    const concurrentRequests = 50;
    const requestsPerBatch = 10;
    const batches = Math.ceil(concurrentRequests / requestsPerBatch);
    
    let totalSuccessful = 0;
    let totalFailed = 0;
    
    for (let batch = 0; batch < batches; batch++) {
      const batchRequests = [];
      
      for (let i = 0; i < requestsPerBatch; i++) {
        batchRequests.push(
          axios.get(`${this.baseUrl}/api/monitoring/metrics`, {
            timeout: 5000
          }).catch(error => ({ error: true, message: error.message }))
        );
      }
      
      const results = await Promise.all(batchRequests);
      const batchSuccessful = results.filter(r => !r.error).length;
      const batchFailed = results.filter(r => r.error).length;
      
      totalSuccessful += batchSuccessful;
      totalFailed += batchFailed;
      
      // Petite pause entre les batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const successRate = totalSuccessful / concurrentRequests;
    
    if (successRate < 0.8) {
      throw new Error(`Taux de succès sous stress trop faible: ${successRate * 100}%`);
    }
    
    return {
      totalRequests: concurrentRequests,
      successful: totalSuccessful,
      failed: totalFailed,
      successRate: successRate * 100
    };
  }

  /**
   * Exécute tous les tests de résilience
   */
  async runAllTests() {
    console.log('🚀 DÉMARRAGE DES TESTS DE RÉSILIENCE EBIOS RM');
    console.log('='.repeat(60));
    
    this.testStartTime = Date.now();
    
    const tests = [
      ['Test de charge basique', () => this.testBasicLoad()],
      ['Test de fallback AI', () => this.testAIServiceFallback()],
      ['Test de récupération après panne', () => this.testRecoveryAfterFailure()],
      ['Test de circuit breaker', () => this.testCircuitBreaker()],
      ['Test de cache et performance', () => this.testCachePerformance()],
      ['Test de monitoring et alertes', () => this.testMonitoringAndAlerts()],
      ['Test de stress', () => this.testStressLoad()]
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const [testName, testFunction] of tests) {
      const success = await this.runTest(testName, testFunction);
      if (success) {
        passed++;
      } else {
        failed++;
      }
    }
    
    const totalDuration = Date.now() - this.testStartTime;
    const successRate = (passed / tests.length) * 100;
    
    console.log('\n📊 RÉSULTATS DES TESTS DE RÉSILIENCE');
    console.log('='.repeat(60));
    console.log(`Total: ${tests.length}`);
    console.log(`✅ Réussis: ${passed}`);
    console.log(`❌ Échecs: ${failed}`);
    console.log(`🎯 Taux de réussite: ${successRate.toFixed(1)}%`);
    console.log(`⏱️ Durée totale: ${totalDuration}ms`);
    
    return {
      summary: {
        total: tests.length,
        passed,
        failed,
        successRate,
        duration: totalDuration
      },
      details: this.testResults
    };
  }
}

module.exports = {
  ResilienceTestSuite
};

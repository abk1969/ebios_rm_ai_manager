/**
 * 🔄 GESTIONNAIRE DE RETRY AVEC BACKOFF EXPONENTIEL
 * Logique de retry robuste pour les services EBIOS RM
 */

class RetryManager {
  constructor() {
    this.defaultConfig = {
      maxRetries: 3,
      baseDelay: 1000, // 1 seconde
      maxDelay: 30000, // 30 secondes
      backoffFactor: 2,
      jitter: true,
      retryableErrors: [
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNRESET',
        'EPIPE'
      ],
      retryableStatusCodes: [408, 429, 500, 502, 503, 504]
    };
  }

  /**
   * Vérifie si une erreur est retryable
   */
  isRetryableError(error, config = {}) {
    const retryableErrors = config.retryableErrors || this.defaultConfig.retryableErrors;
    const retryableStatusCodes = config.retryableStatusCodes || this.defaultConfig.retryableStatusCodes;

    // Erreurs réseau
    if (error.code && retryableErrors.includes(error.code)) {
      return true;
    }

    // Codes de statut HTTP
    if (error.response && error.response.status) {
      return retryableStatusCodes.includes(error.response.status);
    }

    // Timeouts
    if (error.message && error.message.includes('timeout')) {
      return true;
    }

    return false;
  }

  /**
   * Calcule le délai d'attente avec backoff exponentiel
   */
  calculateDelay(attempt, config = {}) {
    const baseDelay = config.baseDelay || this.defaultConfig.baseDelay;
    const maxDelay = config.maxDelay || this.defaultConfig.maxDelay;
    const backoffFactor = config.backoffFactor || this.defaultConfig.backoffFactor;
    const jitter = config.jitter !== undefined ? config.jitter : this.defaultConfig.jitter;

    // Calcul du délai avec backoff exponentiel
    let delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
    
    // Limiter au délai maximum
    delay = Math.min(delay, maxDelay);
    
    // Ajouter du jitter pour éviter les thundering herds
    if (jitter) {
      const jitterAmount = delay * 0.1; // 10% de jitter
      delay += (Math.random() - 0.5) * 2 * jitterAmount;
    }
    
    return Math.max(delay, 0);
  }

  /**
   * Exécute une opération avec retry automatique
   */
  async executeWithRetry(operation, config = {}) {
    const maxRetries = config.maxRetries || this.defaultConfig.maxRetries;
    const operationName = config.operationName || 'unknown';
    
    let lastError;
    let attempt = 0;

    while (attempt <= maxRetries) {
      attempt++;
      
      try {
        console.log(`🔄 Tentative ${attempt}/${maxRetries + 1} pour ${operationName}`);
        
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;
        
        if (attempt > 1) {
          console.log(`✅ ${operationName} réussi après ${attempt} tentatives (${duration}ms)`);
        }
        
        return {
          success: true,
          result,
          attempts: attempt,
          duration
        };
        
      } catch (error) {
        lastError = error;
        
        console.error(`❌ Tentative ${attempt} échouée pour ${operationName}:`, error.message);
        
        // Vérifier si l'erreur est retryable
        if (!this.isRetryableError(error, config)) {
          console.error(`🚫 Erreur non-retryable pour ${operationName}, abandon`);
          throw error;
        }
        
        // Si c'est la dernière tentative, abandonner
        if (attempt > maxRetries) {
          console.error(`🔴 Toutes les tentatives épuisées pour ${operationName}`);
          break;
        }
        
        // Calculer et attendre le délai
        const delay = this.calculateDelay(attempt, config);
        console.log(`⏳ Attente de ${delay}ms avant la prochaine tentative...`);
        
        await this.sleep(delay);
      }
    }
    
    // Toutes les tentatives ont échoué
    const finalError = new Error(`Opération ${operationName} échouée après ${attempt} tentatives`);
    finalError.originalError = lastError;
    finalError.attempts = attempt;
    
    throw finalError;
  }

  /**
   * Exécute plusieurs opérations avec retry en parallèle
   */
  async executeMultipleWithRetry(operations, config = {}) {
    const results = await Promise.allSettled(
      operations.map((op, index) => 
        this.executeWithRetry(op.operation, {
          ...config,
          operationName: op.name || `operation-${index}`
        })
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    return {
      successful: successful.map(r => r.value),
      failed: failed.map(r => r.reason),
      successRate: successful.length / results.length
    };
  }

  /**
   * Crée un wrapper de retry pour une fonction
   */
  createRetryWrapper(originalFunction, config = {}) {
    return async (...args) => {
      const operation = () => originalFunction.apply(this, args);
      const result = await this.executeWithRetry(operation, {
        ...config,
        operationName: config.operationName || originalFunction.name
      });
      return result.result;
    };
  }

  /**
   * Retry conditionnel basé sur le résultat
   */
  async executeWithConditionalRetry(operation, shouldRetry, config = {}) {
    const maxRetries = config.maxRetries || this.defaultConfig.maxRetries;
    const operationName = config.operationName || 'conditional-operation';
    
    let attempt = 0;
    let lastResult;

    while (attempt <= maxRetries) {
      attempt++;
      
      try {
        console.log(`🔄 Tentative conditionnelle ${attempt}/${maxRetries + 1} pour ${operationName}`);
        
        const result = await operation();
        lastResult = result;
        
        // Vérifier si on doit retry basé sur le résultat
        const retryDecision = await shouldRetry(result, attempt);
        
        if (!retryDecision.shouldRetry) {
          console.log(`✅ ${operationName} terminé avec succès après ${attempt} tentatives`);
          return {
            success: true,
            result,
            attempts: attempt
          };
        }
        
        if (attempt > maxRetries) {
          console.warn(`⚠️ Limite de tentatives atteinte pour ${operationName}`);
          break;
        }
        
        console.log(`🔄 Retry requis: ${retryDecision.reason}`);
        
        // Attendre avant le prochain essai
        const delay = this.calculateDelay(attempt, config);
        await this.sleep(delay);
        
      } catch (error) {
        console.error(`❌ Erreur lors de la tentative ${attempt} pour ${operationName}:`, error.message);
        
        if (attempt > maxRetries) {
          throw error;
        }
        
        const delay = this.calculateDelay(attempt, config);
        await this.sleep(delay);
      }
    }
    
    return {
      success: false,
      result: lastResult,
      attempts: attempt
    };
  }

  /**
   * Retry avec circuit breaker intégré
   */
  async executeWithCircuitBreaker(operation, circuitBreaker, config = {}) {
    // Vérifier l'état du circuit breaker
    const canProceed = circuitBreaker.canExecute();
    if (!canProceed) {
      throw new Error('Circuit breaker ouvert - opération bloquée');
    }

    try {
      const result = await this.executeWithRetry(operation, config);
      circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  /**
   * Utilitaire pour attendre
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtient les statistiques de retry
   */
  getRetryStats() {
    return {
      defaultConfig: this.defaultConfig,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Met à jour la configuration par défaut
   */
  updateDefaultConfig(newConfig) {
    this.defaultConfig = {
      ...this.defaultConfig,
      ...newConfig
    };
  }
}

// Instance globale
const retryManager = new RetryManager();

module.exports = {
  RetryManager,
  retryManager
};

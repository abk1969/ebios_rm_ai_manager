/**
 * 🛡️ SYSTÈME DE FALLBACK INTELLIGENT
 * Gestion des pannes et réponses dégradées pour EBIOS RM
 */

const EventEmitter = require('events');

class FallbackSystem extends EventEmitter {
  constructor() {
    super();
    this.cache = new Map();
    this.fallbackResponses = new Map();
    this.serviceStatus = new Map();
    this.circuitBreakers = new Map();
    
    // Configuration
    this.config = {
      cacheTimeout: 3600000, // 1 heure
      circuitBreakerThreshold: 5, // 5 échecs consécutifs
      circuitBreakerTimeout: 30000, // 30 secondes
      maxCacheSize: 1000
    };
    
    this.initializeFallbackResponses();
  }

  /**
   * Initialise les réponses de fallback par défaut
   */
  initializeFallbackResponses() {
    // Suggestions EBIOS RM par défaut
    this.fallbackResponses.set('ai_suggestions', {
      workshop1: [
        'Serveurs de base de données',
        'Postes de travail utilisateurs',
        'Infrastructure réseau',
        'Applications métier critiques',
        'Systèmes de sauvegarde'
      ],
      workshop2: [
        'Attaques par déni de service (DDoS)',
        'Intrusion par vulnérabilités logicielles',
        'Compromission de comptes privilégiés',
        'Malware et ransomware',
        'Ingénierie sociale'
      ],
      workshop3: [
        'Perte de confidentialité des données',
        'Indisponibilité des services critiques',
        'Atteinte à l\'intégrité des données',
        'Non-conformité réglementaire',
        'Impact sur la réputation'
      ],
      workshop4: [
        'Authentification forte (MFA)',
        'Chiffrement des données sensibles',
        'Surveillance et détection d\'intrusion',
        'Sauvegardes régulières et testées',
        'Formation de sensibilisation'
      ]
    });

    // Analyses sémantiques par défaut
    this.fallbackResponses.set('semantic_analysis', {
      keywords: ['sécurité', 'risque', 'menace', 'vulnérabilité', 'protection'],
      sentiment: 'neutral',
      confidence: 0.6,
      entities: [],
      summary: 'Analyse en mode dégradé - Service AI temporairement indisponible'
    });

    // Métriques par défaut
    this.fallbackResponses.set('ai_metrics', {
      responseTime: 1000,
      accuracy: 0.7,
      availability: 0.95,
      status: 'degraded'
    });
  }

  /**
   * Enregistre un circuit breaker pour un service
   */
  registerCircuitBreaker(serviceName) {
    this.circuitBreakers.set(serviceName, {
      state: 'closed', // closed, open, half-open
      failureCount: 0,
      lastFailureTime: null,
      nextAttemptTime: null
    });
  }

  /**
   * Vérifie l'état du circuit breaker
   */
  checkCircuitBreaker(serviceName) {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) {
      this.registerCircuitBreaker(serviceName);
      return { canProceed: true, state: 'closed' };
    }

    const now = Date.now();

    switch (breaker.state) {
      case 'closed':
        return { canProceed: true, state: 'closed' };
        
      case 'open':
        if (now >= breaker.nextAttemptTime) {
          breaker.state = 'half-open';
          return { canProceed: true, state: 'half-open' };
        }
        return { canProceed: false, state: 'open' };
        
      case 'half-open':
        return { canProceed: true, state: 'half-open' };
        
      default:
        return { canProceed: true, state: 'closed' };
    }
  }

  /**
   * Enregistre un succès pour le circuit breaker
   */
  recordSuccess(serviceName) {
    const breaker = this.circuitBreakers.get(serviceName);
    if (breaker) {
      breaker.failureCount = 0;
      breaker.state = 'closed';
      breaker.lastFailureTime = null;
      breaker.nextAttemptTime = null;
    }
  }

  /**
   * Enregistre un échec pour le circuit breaker
   */
  recordFailure(serviceName) {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) {
      this.registerCircuitBreaker(serviceName);
      return this.recordFailure(serviceName);
    }

    breaker.failureCount++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failureCount >= this.config.circuitBreakerThreshold) {
      breaker.state = 'open';
      breaker.nextAttemptTime = Date.now() + this.config.circuitBreakerTimeout;
      
      this.emit('circuitBreakerOpen', {
        serviceName,
        failureCount: breaker.failureCount,
        nextAttemptTime: breaker.nextAttemptTime
      });
      
      console.warn(`🔴 Circuit breaker OUVERT pour ${serviceName} (${breaker.failureCount} échecs)`);
    }
  }

  /**
   * Met en cache une réponse
   */
  cacheResponse(key, data, ttl = null) {
    const expiresAt = Date.now() + (ttl || this.config.cacheTimeout);
    
    // Nettoyer le cache si trop plein
    if (this.cache.size >= this.config.maxCacheSize) {
      this.cleanupCache();
    }
    
    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now()
    });
  }

  /**
   * Récupère une réponse du cache
   */
  getCachedResponse(key) {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return {
      ...cached.data,
      fromCache: true,
      cachedAt: cached.createdAt
    };
  }

  /**
   * Nettoie le cache des entrées expirées
   */
  cleanupCache() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    // Si pas assez nettoyé, supprimer les plus anciennes
    if (this.cache.size >= this.config.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].createdAt - b[1].createdAt);
      
      const toRemove = Math.floor(this.config.maxCacheSize * 0.2); // Supprimer 20%
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.cache.delete(entries[i][0]);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cache nettoyé: ${cleaned} entrées supprimées`);
    }
  }

  /**
   * Obtient une réponse de fallback
   */
  getFallbackResponse(type, context = {}) {
    const fallback = this.fallbackResponses.get(type);
    if (!fallback) {
      return {
        error: 'Service temporairement indisponible',
        fallback: true,
        timestamp: new Date().toISOString()
      };
    }

    // Personnaliser la réponse selon le contexte
    switch (type) {
      case 'ai_suggestions':
        const workshop = context.workshop || 'workshop1';
        return {
          suggestions: fallback[workshop] || fallback.workshop1,
          confidence: 0.6,
          source: 'fallback',
          fallback: true,
          timestamp: new Date().toISOString()
        };

      case 'semantic_analysis':
        return {
          ...fallback,
          fallback: true,
          timestamp: new Date().toISOString()
        };

      case 'ai_metrics':
        return {
          ...fallback,
          fallback: true,
          timestamp: new Date().toISOString()
        };

      default:
        return {
          data: fallback,
          fallback: true,
          timestamp: new Date().toISOString()
        };
    }
  }

  /**
   * Exécute une requête avec fallback intelligent
   */
  async executeWithFallback(serviceName, operation, fallbackType, context = {}) {
    const cacheKey = `${serviceName}_${fallbackType}_${JSON.stringify(context)}`;
    
    // Vérifier le circuit breaker
    const circuitCheck = this.checkCircuitBreaker(serviceName);
    if (!circuitCheck.canProceed) {
      console.warn(`⚡ Circuit breaker ouvert pour ${serviceName}, utilisation du fallback`);
      return this.getFallbackResponse(fallbackType, context);
    }

    try {
      // Essayer l'opération principale
      const result = await operation();
      
      // Succès - enregistrer et mettre en cache
      this.recordSuccess(serviceName);
      this.cacheResponse(cacheKey, result);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur ${serviceName}:`, error.message);
      
      // Enregistrer l'échec
      this.recordFailure(serviceName);
      
      // Essayer le cache d'abord
      const cached = this.getCachedResponse(cacheKey);
      if (cached) {
        console.log(`📦 Utilisation du cache pour ${serviceName}`);
        return cached;
      }
      
      // Utiliser le fallback
      console.log(`🛡️ Utilisation du fallback pour ${serviceName}`);
      return this.getFallbackResponse(fallbackType, context);
    }
  }

  /**
   * Obtient les statistiques du système de fallback
   */
  getStats() {
    const stats = {
      cache: {
        size: this.cache.size,
        maxSize: this.config.maxCacheSize,
        hitRate: 0 // À implémenter si nécessaire
      },
      circuitBreakers: {},
      fallbackResponses: Array.from(this.fallbackResponses.keys())
    };

    for (const [serviceName, breaker] of this.circuitBreakers) {
      stats.circuitBreakers[serviceName] = {
        state: breaker.state,
        failureCount: breaker.failureCount,
        lastFailureTime: breaker.lastFailureTime
      };
    }

    return stats;
  }
}

// Instance globale
const fallbackSystem = new FallbackSystem();

module.exports = {
  FallbackSystem,
  fallbackSystem
};

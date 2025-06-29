/**
 * 🔄 CIRCUIT BREAKER - PROTECTION ANTI-RÉGRESSION
 * Implémente le pattern Circuit Breaker pour migration sécurisée
 * Fallback automatique vers services legacy en cas d'échec
 */

export enum CircuitState {
  CLOSED = 'closed',     // Fonctionnement normal
  OPEN = 'open',         // Circuit ouvert, fallback actif
  HALF_OPEN = 'half_open' // Production ready
}

export interface CircuitBreakerConfig {
  failureThreshold: number;      // Nombre d'échecs avant ouverture
  recoveryTimeout: number;       // Temps avant test de récupération (ms)
  monitoringWindow: number;      // Fenêtre de surveillance (ms)
  successThreshold: number;      // Succès requis pour fermeture
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  totalRequests: number;
  fallbackUsage: number;
}

/**
 * Circuit Breaker pour protection des agents
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  private totalRequests: number = 0;
  private fallbackUsage: number = 0;
  
  private readonly config: CircuitBreakerConfig;
  private readonly name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      monitoringWindow: 300000, // 5 minutes
      successThreshold: 3,
      ...config
    };
  }

  /**
   * Vérifie si le circuit est disponible
   */
  isAvailable(): boolean {
    this.updateState();
    return this.state !== CircuitState.OPEN;
  }

  /**
   * Enregistre un succès
   */
  recordSuccess(): void {
    this.totalRequests++;
    this.successes++;
    this.lastSuccessTime = Date.now();
    
    // Si en mode HALF_OPEN, vérifier si on peut fermer le circuit
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        console.log(`🔄 Circuit Breaker ${this.name}: FERMÉ (récupération réussie)`);
      }
    }
  }

  /**
   * Enregistre un échec
   */
  recordFailure(): void {
    this.totalRequests++;
    this.failures++;
    this.lastFailureTime = Date.now();
    this.fallbackUsage++;
    
    // Ouvrir le circuit si seuil atteint
    if (this.failures >= this.config.failureThreshold && this.state === CircuitState.CLOSED) {
      this.state = CircuitState.OPEN;
      console.warn(`⚠️ Circuit Breaker ${this.name}: OUVERT (${this.failures} échecs)`);
    }
  }

  /**
   * Met à jour l'état du circuit
   */
  private updateState(): void {
    const now = Date.now();
    
    // Si circuit ouvert, vérifier si on peut passer en HALF_OPEN
    if (this.state === CircuitState.OPEN && this.lastFailureTime) {
      if (now - this.lastFailureTime >= this.config.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successes = 0; // Reset pour test de récupération
        console.log(`🔄 Circuit Breaker ${this.name}: HALF_OPEN (test de récupération)`);
      }
    }
    
    // Nettoyer les anciennes métriques
    this.cleanOldMetrics(now);
  }

  /**
   * Nettoie les métriques anciennes
   */
  private cleanOldMetrics(now: number): void {
    // Réinitialiser les compteurs si fenêtre de surveillance dépassée
    if (this.lastFailureTime && now - this.lastFailureTime > this.config.monitoringWindow) {
      if (this.state === CircuitState.CLOSED) {
        this.failures = 0;
      }
    }
  }

  /**
   * Exécute une fonction avec protection Circuit Breaker
   */
  async execute<T>(
    primaryFn: () => Promise<T>,
    fallbackFn: () => Promise<T>
  ): Promise<{ result: T; usedFallback: boolean }> {
    
    if (!this.isAvailable()) {
      // Circuit ouvert, utiliser fallback directement
      const result = await fallbackFn();
      return { result, usedFallback: true };
    }

    try {
      // Tenter l'exécution principale
      const result = await primaryFn();
      this.recordSuccess();
      return { result, usedFallback: false };
    } catch (error) {
      // Échec, enregistrer et utiliser fallback
      this.recordFailure();
      console.warn(`⚠️ Circuit Breaker ${this.name}: Fallback utilisé`, error);
      
      const result = await fallbackFn();
      return { result, usedFallback: true };
    }
  }

  /**
   * Statistiques du circuit breaker
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      fallbackUsage: this.fallbackUsage
    };
  }

  /**
   * Réinitialise le circuit breaker
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
    console.log(`🔄 Circuit Breaker ${this.name}: RÉINITIALISÉ`);
  }

  /**
   * Force l'ouverture du circuit (pour maintenance)
   */
  forceOpen(): void {
    this.state = CircuitState.OPEN;
    console.log(`🔄 Circuit Breaker ${this.name}: FORCÉ OUVERT`);
  }

  /**
   * Force la fermeture du circuit
   */
  forceClose(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    console.log(`🔄 Circuit Breaker ${this.name}: FORCÉ FERMÉ`);
  }
}

/**
 * Gestionnaire global des Circuit Breakers
 */
export class CircuitBreakerManager {
  private static instance: CircuitBreakerManager;
  private breakers: Map<string, CircuitBreaker> = new Map();

  static getInstance(): CircuitBreakerManager {
    if (!CircuitBreakerManager.instance) {
      CircuitBreakerManager.instance = new CircuitBreakerManager();
    }
    return CircuitBreakerManager.instance;
  }

  /**
   * Crée ou récupère un circuit breaker
   */
  getCircuitBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, config));
    }
    return this.breakers.get(name)!;
  }

  /**
   * Statistiques globales
   */
  getGlobalStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    for (const [name, breaker] of this.breakers.entries()) {
      stats[name] = breaker.getStats();
    }
    return stats;
  }

  /**
   * Réinitialise tous les circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }
}

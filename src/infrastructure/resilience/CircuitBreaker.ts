/**
 * ⚡ CIRCUIT BREAKER - PATTERN RÉSILIENCE POUR AGENTS EBIOS RM
 * Implémente la protection contre les défaillances en cascade
 * Selon recommandations audit technique Phase 1
 */

import { Logger } from '../logging/Logger';
import { EventEmitter } from 'events';

export enum CircuitBreakerState {
  CLOSED = 'closed',     // Fonctionnement normal
  OPEN = 'open',         // Circuit ouvert, rejette les requêtes
  HALF_OPEN = 'half_open' // Production ready
}

export interface CircuitBreakerConfig {
  failureThreshold: number;    // Nombre d'échecs avant ouverture
  recoveryTimeout: number;     // Temps avant tentative de récupération (ms)
  timeout: number;            // Timeout des opérations (ms)
  monitoringWindow: number;   // Fenêtre de surveillance (ms)
  minimumThroughput: number;  // Minimum de requêtes pour déclencher
}

export interface CircuitBreakerMetrics {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  totalRequests: number;
  failureRate: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  stateChangedAt: Date;
  timeInCurrentState: number;
}

/**
 * Circuit Breaker pour protéger les agents contre les défaillances
 * Implémente le pattern avec états CLOSED/OPEN/HALF_OPEN
 */
export class CircuitBreaker extends EventEmitter {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private totalRequests: number = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private stateChangedAt: Date = new Date();
  private nextAttemptTime: number = 0;
  private logger: Logger;
  
  private readonly config: Required<CircuitBreakerConfig>;
  
  // Fenêtre glissante pour le monitoring
  private requestHistory: Array<{ timestamp: number; success: boolean }> = [];

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    super();
    
    this.config = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      timeout: 30000,         // 30 secondes
      monitoringWindow: 300000, // 5 minutes
      minimumThroughput: 10,
      ...config
    };
    
    this.logger = new Logger('CircuitBreaker');
    
    // Nettoyage périodique de l'historique
    setInterval(() => this.cleanupHistory(), 60000);
  }

  /**
   * Exécute une opération protégée par le circuit breaker
   */
  public async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.shouldRejectRequest()) {
      this.logger.warn('Circuit breaker is OPEN, rejecting request');
      
      if (fallback) {
        this.logger.info('Executing fallback operation');
        return await fallback();
      }
      
      throw new Error('Circuit breaker is OPEN and no fallback provided');
    }

    const startTime = Date.now();
    this.totalRequests++;
    
    try {
      // Timeout de l'opération
      const result = await this.executeWithTimeout(operation);
      
      this.onSuccess();
      this.recordRequest(true);
      
      return result;
      
    } catch (error) {
      this.onFailure(error);
      this.recordRequest(false);
      
      // Si on a un fallback, on l'utilise
      if (fallback) {
        this.logger.info('Primary operation failed, executing fallback');
        try {
          return await fallback();
        } catch (fallbackError) {
          this.logger.error('Fallback operation also failed:', fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Vérifie si le circuit breaker doit rejeter la requête
   */
  public shouldRejectRequest(): boolean {
    if (this.state === CircuitBreakerState.CLOSED) {
      return false;
    }
    
    if (this.state === CircuitBreakerState.OPEN) {
      // Vérifier si on peut passer en HALF_OPEN
      if (Date.now() >= this.nextAttemptTime) {
        this.transitionToHalfOpen();
        return false;
      }
      return true;
    }
    
    // État HALF_OPEN : on laisse passer une requête de test
    return false;
  }

  /**
   * Force l'ouverture du circuit
   */
  public open(): void {
    this.transitionToOpen();
  }

  /**
   * Force la fermeture du circuit
   */
  public close(): void {
    this.transitionToClosed();
  }

  /**
   * Remet à zéro les compteurs
   */
  public reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.totalRequests = 0;
    this.requestHistory = [];
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
    this.transitionToClosed();
    
    this.logger.info('Circuit breaker reset');
  }

  /**
   * Obtient l'état actuel du circuit breaker
   */
  public getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Vérifie si le circuit est ouvert
   */
  public isOpen(): boolean {
    return this.state === CircuitBreakerState.OPEN;
  }

  /**
   * Obtient les métriques du circuit breaker
   */
  public getMetrics(): CircuitBreakerMetrics {
    const now = Date.now();
    const recentRequests = this.getRecentRequests();
    const failureRate = recentRequests.length > 0 
      ? recentRequests.filter(r => !r.success).length / recentRequests.length 
      : 0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalRequests: this.totalRequests,
      failureRate,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      stateChangedAt: this.stateChangedAt,
      timeInCurrentState: now - this.stateChangedAt.getTime()
    };
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.config.timeout}ms`));
      }, this.config.timeout);

      operation()
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private onSuccess(): void {
    this.successCount++;
    this.lastSuccessTime = new Date();
    
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.transitionToClosed();
    }
  }

  private onFailure(error: any): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    this.logger.warn('Circuit breaker recorded failure:', error.message);
    
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.transitionToOpen();
    } else if (this.state === CircuitBreakerState.CLOSED) {
      if (this.shouldOpen()) {
        this.transitionToOpen();
      }
    }
  }

  private shouldOpen(): boolean {
    // Vérifier le seuil de défaillances
    if (this.failureCount >= this.config.failureThreshold) {
      return true;
    }
    
    // Vérifier le taux de défaillance sur la fenêtre glissante
    const recentRequests = this.getRecentRequests();
    if (recentRequests.length >= this.config.minimumThroughput) {
      const recentFailures = recentRequests.filter(r => !r.success).length;
      const failureRate = recentFailures / recentRequests.length;
      
      return failureRate >= 0.5; // 50% de taux d'échec
    }
    
    return false;
  }

  private transitionToClosed(): void {
    if (this.state !== CircuitBreakerState.CLOSED) {
      this.logger.info('Circuit breaker transitioning to CLOSED');
      this.state = CircuitBreakerState.CLOSED;
      this.stateChangedAt = new Date();
      this.failureCount = 0;
      this.emit('stateChanged', this.state);
    }
  }

  private transitionToOpen(): void {
    if (this.state !== CircuitBreakerState.OPEN) {
      this.logger.warn('Circuit breaker transitioning to OPEN');
      this.state = CircuitBreakerState.OPEN;
      this.stateChangedAt = new Date();
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      this.emit('stateChanged', this.state);
    }
  }

  private transitionToHalfOpen(): void {
    if (this.state !== CircuitBreakerState.HALF_OPEN) {
      this.logger.info('Circuit breaker transitioning to HALF_OPEN');
      this.state = CircuitBreakerState.HALF_OPEN;
      this.stateChangedAt = new Date();
      this.emit('stateChanged', this.state);
    }
  }

  private recordRequest(success: boolean): void {
    this.requestHistory.push({
      timestamp: Date.now(),
      success
    });
  }

  private getRecentRequests(): Array<{ timestamp: number; success: boolean }> {
    const cutoff = Date.now() - this.config.monitoringWindow;
    return this.requestHistory.filter(r => r.timestamp >= cutoff);
  }

  private cleanupHistory(): void {
    const cutoff = Date.now() - this.config.monitoringWindow;
    this.requestHistory = this.requestHistory.filter(r => r.timestamp >= cutoff);
  }
}

/**
 * Factory pour créer des circuit breakers avec des configurations prédéfinies
 */
export class CircuitBreakerFactory {
  private static readonly PRESETS = {
    // Configuration pour agents critiques (ateliers)
    critical: {
      failureThreshold: 3,
      recoveryTimeout: 30000,
      timeout: 15000,
      monitoringWindow: 180000,
      minimumThroughput: 5
    },
    
    // Configuration pour agents non-critiques (documentation, visualisation)
    standard: {
      failureThreshold: 5,
      recoveryTimeout: 60000,
      timeout: 30000,
      monitoringWindow: 300000,
      minimumThroughput: 10
    },
    
    // Configuration pour services externes
    external: {
      failureThreshold: 2,
      recoveryTimeout: 120000,
      timeout: 10000,
      monitoringWindow: 600000,
      minimumThroughput: 3
    }
  };

  public static create(preset: keyof typeof CircuitBreakerFactory.PRESETS): CircuitBreaker {
    const config = CircuitBreakerFactory.PRESETS[preset];
    return new CircuitBreaker(config);
  }

  public static createCustom(config: Partial<CircuitBreakerConfig>): CircuitBreaker {
    return new CircuitBreaker(config);
  }
}
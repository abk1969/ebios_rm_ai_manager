/**
 * Service de monitoring de performance pour les workshops EBIOS RM
 * Recommandé par l'audit pour optimiser Workshop4
 */

import { logger } from '../logging/SecureLogger';

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  context: string;
  metadata?: Record<string, any>;
}

export interface WorkshopPerformanceData {
  workshop: number;
  loadTime: number;
  validationTime: number;
  renderTime: number;
  dataSize: {
    businessValues: number;
    supportingAssets: number;
    scenarios: number;
    attackPaths: number;
  };
  userInteractions: number;
  errors: number;
  warnings: number;
}

/**
 * Service de monitoring de performance
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private workshopData: Map<number, WorkshopPerformanceData> = new Map();
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = import.meta.env.DEV ||
                     import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
      // 🔧 CORRECTION: Nettoyer les données de test au démarrage
      PerformanceMonitor.instance.cleanupTestData();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Démarre une mesure de performance
   */
  public startMeasure(name: string, context: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      context,
      metadata
    };

    this.metrics.set(name, metric);
    
    logger.debug(`Performance measure started: ${name}`, { context, metadata }, 'PerformanceMonitor');
  }

  /**
   * Termine une mesure de performance
   */
  public endMeasure(name: string, additionalMetadata?: Record<string, any>): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`Performance measure not found: ${name}`, undefined, 'PerformanceMonitor');
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    if (additionalMetadata) {
      metric.metadata = { ...metric.metadata, ...additionalMetadata };
    }

    // Log si la durée est significative
    if (metric.duration > 100) { // Plus de 100ms
      logger.info(
        `Performance measure completed: ${name} took ${metric.duration.toFixed(2)}ms`,
        {
          duration: metric.duration,
          context: metric.context,
          metadata: metric.metadata
        },
        'PerformanceMonitor'
      );
    }

    // Alerter si performance dégradée
    if (metric.duration > 2000) { // Plus de 2 secondes
      logger.warn(
        `Slow performance detected: ${name} took ${metric.duration.toFixed(2)}ms`,
        {
          duration: metric.duration,
          context: metric.context,
          metadata: metric.metadata
        },
        'PerformanceMonitor'
      );
    }

    this.metrics.delete(name);
    return metric.duration;
  }

  /**
   * Mesure automatique d'une fonction
   */
  public async measureAsync<T>(
    name: string,
    context: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    if (!this.isEnabled) {
      return await fn();
    }

    this.startMeasure(name, context, metadata);
    try {
      const result = await fn();
      this.endMeasure(name, { success: true });
      return result;
    } catch (error) {
      this.endMeasure(name, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Mesure synchrone d'une fonction
   */
  public measure<T>(
    name: string,
    context: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    if (!this.isEnabled) {
      return fn();
    }

    this.startMeasure(name, context, metadata);
    try {
      const result = fn();
      this.endMeasure(name, { success: true });
      return result;
    } catch (error) {
      this.endMeasure(name, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Initialise le monitoring pour un workshop
   */
  public initWorkshopMonitoring(workshop: number): void {
    if (!this.isEnabled) return;

    // 🔧 CORRECTION: Empêcher l'initialisation de workshops de test (999)
    if (workshop === 999) {
      logger.warn('Tentative d\'initialisation du workshop de test 999 bloquée', { workshop }, 'PerformanceMonitor');
      return;
    }

    // Valider que le workshop est dans la plage valide (1-5)
    if (workshop < 1 || workshop > 5) {
      logger.warn('Tentative d\'initialisation d\'un workshop invalide', { workshop }, 'PerformanceMonitor');
      return;
    }

    const data: WorkshopPerformanceData = {
      workshop,
      loadTime: 0,
      validationTime: 0,
      renderTime: 0,
      dataSize: {
        businessValues: 0,
        supportingAssets: 0,
        scenarios: 0,
        attackPaths: 0
      },
      userInteractions: 0,
      errors: 0,
      warnings: 0
    };

    this.workshopData.set(workshop, data);
    this.startMeasure(`workshop_${workshop}_load`, `Workshop${workshop}`);
  }

  /**
   * Met à jour les données de performance d'un workshop
   */
  public updateWorkshopData(
    workshop: number,
    updates: Partial<WorkshopPerformanceData>
  ): void {
    if (!this.isEnabled) return;

    const current = this.workshopData.get(workshop);
    if (current) {
      this.workshopData.set(workshop, { ...current, ...updates });
    }
  }

  /**
   * Enregistre le temps de chargement d'un workshop
   */
  public recordWorkshopLoadTime(workshop: number): void {
    if (!this.isEnabled) return;

    const duration = this.endMeasure(`workshop_${workshop}_load`);
    if (duration !== null) {
      this.updateWorkshopData(workshop, { loadTime: duration });
    }
  }

  /**
   * Enregistre une interaction utilisateur
   */
  public recordUserInteraction(workshop: number, action: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const current = this.workshopData.get(workshop);
    if (current) {
      current.userInteractions++;
      this.workshopData.set(workshop, current);
    }

    logger.debug(
      `User interaction: ${action}`,
      { workshop, metadata },
      'PerformanceMonitor'
    );
  }

  /**
   * Enregistre une erreur
   */
  public recordError(workshop: number, error: string | Error, context?: string): void {
    const current = this.workshopData.get(workshop);
    if (current) {
      current.errors++;
      this.workshopData.set(workshop, current);
    }

    logger.error(
      `Workshop ${workshop} error: ${error instanceof Error ? error.message : error}`,
      error instanceof Error ? error : undefined,
      context || 'PerformanceMonitor'
    );
  }

  /**
   * Enregistre un avertissement
   */
  public recordWarning(workshop: number, warning: string, context?: string): void {
    const current = this.workshopData.get(workshop);
    if (current) {
      current.warnings++;
      this.workshopData.set(workshop, current);
    }

    logger.warn(
      `Workshop ${workshop} warning: ${warning}`,
      undefined,
      context || 'PerformanceMonitor'
    );
  }

  /**
   * Mesure la performance de validation
   */
  public measureValidation(workshop: number, validationFn: () => any): any {
    return this.measure(
      `workshop_${workshop}_validation`,
      `Workshop${workshop}`,
      () => {
        const result = validationFn();
        const duration = this.endMeasure(`workshop_${workshop}_validation`);
        if (duration !== null) {
          this.updateWorkshopData(workshop, { validationTime: duration });
        }
        return result;
      }
    );
  }

  /**
   * Mesure la performance de rendu
   */
  public measureRender(workshop: number, renderFn: () => void): void {
    this.measure(
      `workshop_${workshop}_render`,
      `Workshop${workshop}`,
      () => {
        renderFn();
        const duration = this.endMeasure(`workshop_${workshop}_render`);
        if (duration !== null) {
          this.updateWorkshopData(workshop, { renderTime: duration });
        }
      }
    );
  }

  /**
   * Génère un rapport de performance pour un workshop
   */
  public generateWorkshopReport(workshop: number): WorkshopPerformanceData | null {
    const data = this.workshopData.get(workshop);
    if (!data) return null;

    // Calculer des métriques dérivées
    const totalTime = data.loadTime + data.validationTime + data.renderTime;
    const totalDataItems = Object.values(data.dataSize).reduce((sum, count) => sum + count, 0);

    logger.info(
      `Workshop ${workshop} Performance Report`,
      {
        ...data,
        totalTime,
        totalDataItems,
        averageInteractionTime: data.userInteractions > 0 ? totalTime / data.userInteractions : 0,
        errorRate: data.userInteractions > 0 ? (data.errors / data.userInteractions) * 100 : 0
      },
      'PerformanceMonitor'
    );

    return data;
  }

  /**
   * Nettoie les données de performance anciennes
   */
  public cleanup(): void {
    // Nettoyer les mesures en cours depuis plus de 5 minutes
    const fiveMinutesAgo = performance.now() - (5 * 60 * 1000);
    
    for (const [name, metric] of this.metrics.entries()) {
      if (metric.startTime < fiveMinutesAgo) {
        logger.warn(
          `Cleaning up stale performance measure: ${name}`,
          { startTime: metric.startTime, context: metric.context },
          'PerformanceMonitor'
        );
        this.metrics.delete(name);
      }
    }
  }

  /**
   * Active/désactive le monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    logger.info(
      `Performance monitoring ${enabled ? 'enabled' : 'disabled'}`,
      undefined,
      'PerformanceMonitor'
    );
  }

  /**
   * Récupère toutes les données de performance
   */
  public getAllData(): Map<number, WorkshopPerformanceData> {
    return new Map(this.workshopData);
  }

  /**
   * 🔧 CORRECTION: Nettoie les données de test
   */
  private cleanupTestData(): void {
    // Supprimer les workshops de test (999, etc.)
    const testWorkshops = [999];
    testWorkshops.forEach(workshop => {
      if (this.workshopData.has(workshop)) {
        this.workshopData.delete(workshop);
        logger.debug(`Données de test supprimées pour workshop ${workshop}`, undefined, 'PerformanceMonitor');
      }
    });

    // Nettoyer les métriques de test
    const testMetrics = Array.from(this.metrics.keys()).filter(key =>
      key.includes('test_') || key.includes('workshop_999')
    );
    testMetrics.forEach(key => {
      this.metrics.delete(key);
    });

    if (testMetrics.length > 0) {
      logger.debug(`${testMetrics.length} métriques de test supprimées`, undefined, 'PerformanceMonitor');
    }
  }
}

// Instance globale
export const performanceMonitor = PerformanceMonitor.getInstance();

// Fonctions utilitaires
export const perf = {
  start: (name: string, context: string, metadata?: Record<string, any>) => 
    performanceMonitor.startMeasure(name, context, metadata),
  
  end: (name: string, metadata?: Record<string, any>) => 
    performanceMonitor.endMeasure(name, metadata),
  
  measure: <T>(name: string, context: string, fn: () => T, metadata?: Record<string, any>) => 
    performanceMonitor.measure(name, context, fn, metadata),
  
  measureAsync: <T>(name: string, context: string, fn: () => Promise<T>, metadata?: Record<string, any>) => 
    performanceMonitor.measureAsync(name, context, fn, metadata),
  
  recordInteraction: (workshop: number, action: string, metadata?: Record<string, any>) => 
    performanceMonitor.recordUserInteraction(workshop, action, metadata),
  
  recordError: (workshop: number, error: string | Error, context?: string) => 
    performanceMonitor.recordError(workshop, error, context),
  
  recordWarning: (workshop: number, warning: string, context?: string) => 
    performanceMonitor.recordWarning(workshop, warning, context)
};

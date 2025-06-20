/**
 * 🎯 GESTIONNAIRE CENTRAL DES NOTIFICATIONS EBIOS RM
 * Orchestrateur principal pour tous les services de notifications
 * 
 * @fileoverview Service manager central qui coordonne tous les services
 * de notifications, gère le cache des imports dynamiques, et fournit
 * une interface unifiée avec gestion d'erreurs robuste.
 * 
 * @version 1.0.0
 * @author Équipe EBIOS RM
 */

import type {
  EbiosNotification,
  NotificationSettings,
  NotificationFilters,
  NotificationStats,
  NotificationEvent,
  NotificationContext,
  CreateNotificationInput
} from '../types';

// 🎯 TYPES POUR LE MANAGER
interface ServiceCache {
  notificationService?: any;
  notificationGenerators?: any;
  notificationScheduler?: any;
  notificationAnalytics?: any;
  notificationActions?: any;
  notificationNavigation?: any;
  ebiosNotificationGenerator?: any;
}

interface ManagerConfig {
  enableCache: boolean;
  enableFallbacks: boolean;
  maxRetries: number;
  retryDelay: number;
  enableLogging: boolean;
  enableMetrics: boolean;
}

interface ServiceStatus {
  isLoaded: boolean;
  isInitialized: boolean;
  lastError?: string;
  loadTime?: number;
  retryCount: number;
}

interface ManagerMetrics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  cacheHitRate: number;
  servicesStatus: Record<string, ServiceStatus>;
}

/**
 * 🎯 GESTIONNAIRE CENTRAL DES NOTIFICATIONS
 */
export class NotificationManager {
  private static instance: NotificationManager | null = null;
  private serviceCache: ServiceCache = {};
  private config: ManagerConfig;
  private metrics: ManagerMetrics;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.config = {
      enableCache: true,
      enableFallbacks: true,
      maxRetries: 3,
      retryDelay: 1000,
      enableLogging: true,
      enableMetrics: true
    };

    this.metrics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      servicesStatus: {}
    };
  }

  // 🏭 SINGLETON PATTERN
  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // 🚀 INITIALISATION CENTRALISÉE
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  private async _performInitialization(): Promise<void> {
    try {
      this.log('🚀 Initialisation NotificationManager...');

      // Charger les services essentiels
      await this.loadEssentialServices();

      // Initialiser les services chargés
      await this.initializeLoadedServices();

      this.isInitialized = true;
      this.log('✅ NotificationManager initialisé avec succès');

    } catch (error) {
      this.logError('❌ Erreur initialisation NotificationManager:', error);
      throw error;
    }
  }

  // 📦 CHARGEMENT DES SERVICES ESSENTIELS
  private async loadEssentialServices(): Promise<void> {
    const essentialServices = [
      'notificationService',
      'notificationGenerators',
      'notificationAnalytics'
    ];

    for (const serviceName of essentialServices) {
      try {
        await this.loadService(serviceName);
      } catch (error) {
        this.logError(`❌ Erreur chargement service ${serviceName}:`, error);
        if (!this.config.enableFallbacks) {
          throw error;
        }
      }
    }
  }

  // 🔄 CHARGEMENT DYNAMIQUE AVEC CACHE
  private async loadService(serviceName: string): Promise<any> {
    const startTime = Date.now();

    try {
      // Vérifier le cache
      if (this.config.enableCache && this.serviceCache[serviceName as keyof ServiceCache]) {
        this.updateCacheHitRate(true);
        return this.serviceCache[serviceName as keyof ServiceCache];
      }

      this.updateCacheHitRate(false);

      // Charger le service
      let service: any;
      switch (serviceName) {
        case 'notificationService':
          const { notificationService } = await import('./NotificationService');
          service = notificationService;
          break;

        case 'notificationGenerators':
          const { notificationGenerators } = await import('./NotificationGenerators');
          service = notificationGenerators;
          break;

        case 'notificationScheduler':
          const { notificationScheduler } = await import('./NotificationScheduler');
          service = notificationScheduler;
          break;

        case 'notificationAnalytics':
          const { notificationAnalytics } = await import('./NotificationAnalytics');
          service = notificationAnalytics;
          break;

        case 'notificationActions':
          const { notificationActions } = await import('./NotificationActions');
          service = notificationActions;
          break;

        case 'notificationNavigation':
          const { notificationNavigation } = await import('./NotificationNavigation');
          service = notificationNavigation;
          break;

        case 'ebiosNotificationGenerator':
          const { ebiosNotificationGenerator } = await import('./EbiosNotificationGenerator');
          service = ebiosNotificationGenerator;
          break;

        default:
          throw new Error(`Service inconnu: ${serviceName}`);
      }

      // Mettre en cache
      if (this.config.enableCache) {
        this.serviceCache[serviceName as keyof ServiceCache] = service;
      }

      // Mettre à jour les métriques
      const loadTime = Date.now() - startTime;
      this.updateServiceStatus(serviceName, {
        isLoaded: true,
        isInitialized: false,
        loadTime,
        retryCount: 0
      });

      this.log(`✅ Service ${serviceName} chargé en ${loadTime}ms`);
      return service;

    } catch (error) {
      this.updateServiceStatus(serviceName, {
        isLoaded: false,
        isInitialized: false,
        lastError: error instanceof Error ? error.message : 'Erreur inconnue',
        retryCount: (this.metrics.servicesStatus[serviceName]?.retryCount || 0) + 1
      });

      throw error;
    }
  }

  // 🔧 INITIALISATION DES SERVICES CHARGÉS
  private async initializeLoadedServices(): Promise<void> {
    for (const [serviceName, service] of Object.entries(this.serviceCache)) {
      if (service && typeof service.initialize === 'function') {
        try {
          await service.initialize();
          this.updateServiceStatus(serviceName, {
            ...this.metrics.servicesStatus[serviceName],
            isInitialized: true
          });
          this.log(`✅ Service ${serviceName} initialisé`);
        } catch (error) {
          this.logError(`❌ Erreur initialisation ${serviceName}:`, error);
        }
      }
    }
  }

  // 🔔 API UNIFIÉE POUR LES NOTIFICATIONS

  /**
   * Créer une notification avec gestion d'erreurs robuste
   */
  public async createNotification(notification: CreateNotificationInput): Promise<string> {
    return this.executeWithFallback(
      'createNotification',
      async () => {
        const service = await this.getService('notificationService');
        return await service.createNotification(notification);
      },
      () => this.fallbackCreateNotification(notification)
    );
  }

  /**
   * Récupérer les notifications avec cache
   */
  public async getNotifications(filters?: NotificationFilters): Promise<EbiosNotification[]> {
    return this.executeWithFallback(
      'getNotifications',
      async () => {
        const service = await this.getService('notificationService');
        return service.getNotifications(filters);
      },
      () => []
    );
  }

  /**
   * Traiter un événement avec générateurs intelligents
   */
  public async processEvent(event: any, context: any): Promise<string[]> {
    return this.executeWithFallback(
      'processEvent',
      async () => {
        const generators = await this.getService('notificationGenerators');
        return await generators.processEvent(event, context);
      },
      () => []
    );
  }

  /**
   * Planifier une notification
   */
  public async scheduleNotification(
    ruleId: string,
    userId: string,
    triggerTime: Date,
    event: any
  ): Promise<string> {
    return this.executeWithFallback(
      'scheduleNotification',
      async () => {
        const scheduler = await this.getService('notificationScheduler');
        return scheduler.scheduleNotification(ruleId, userId, triggerTime, event);
      },
      () => 'fallback_scheduled_' + Date.now()
    );
  }

  /**
   * Exécuter une action
   */
  public async executeAction(actionId: string, context: any): Promise<any> {
    return this.executeWithFallback(
      'executeAction',
      async () => {
        const actions = await this.getService('notificationActions');
        return await actions.executeAction(actionId, context);
      },
      () => ({ success: false, message: 'Service indisponible' })
    );
  }

  /**
   * Naviguer vers une notification
   */
  public async navigateToNotification(
    notificationId: string,
    context: NotificationContext,
    preserveState = true
  ): Promise<boolean> {
    return this.executeWithFallback(
      'navigateToNotification',
      async () => {
        const navigation = await this.getService('notificationNavigation');
        return await navigation.navigateToNotification(notificationId, context, preserveState);
      },
      () => false
    );
  }

  // 🔧 MÉTHODES UTILITAIRES

  /**
   * Récupérer un service avec retry automatique
   */
  private async getService(serviceName: string): Promise<any> {
    let retryCount = 0;
    
    while (retryCount < this.config.maxRetries) {
      try {
        const service = await this.loadService(serviceName);
        if (service) {
          return service;
        }
      } catch (error) {
        retryCount++;
        if (retryCount >= this.config.maxRetries) {
          throw error;
        }
        
        this.log(`⚠️ Retry ${retryCount}/${this.config.maxRetries} pour ${serviceName}`);
        await this.delay(this.config.retryDelay * retryCount);
      }
    }
    
    throw new Error(`Impossible de charger le service ${serviceName} après ${this.config.maxRetries} tentatives`);
  }

  /**
   * Exécuter une opération avec fallback
   */
  private async executeWithFallback<T>(
    operationName: string,
    operation: () => Promise<T>,
    fallback: () => T
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalOperations++;

    try {
      const result = await operation();
      
      this.metrics.successfulOperations++;
      this.updateAverageResponseTime(Date.now() - startTime);
      
      return result;

    } catch (error) {
      this.metrics.failedOperations++;
      this.logError(`❌ Erreur ${operationName}:`, error);

      if (this.config.enableFallbacks) {
        this.log(`🔄 Utilisation du fallback pour ${operationName}`);
        return fallback();
      }

      throw error;
    }
  }

  /**
   * Fallback pour création de notification
   */
  private fallbackCreateNotification(notification: CreateNotificationInput): string {
    const id = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Stocker en localStorage comme fallback
    try {
      const fallbackNotifications = JSON.parse(localStorage.getItem('fallback_notifications') || '[]');
      fallbackNotifications.push({
        ...notification,
        id,
        createdAt: new Date().toISOString(),
        status: 'unread'
      });
      localStorage.setItem('fallback_notifications', JSON.stringify(fallbackNotifications));
    } catch (error) {
      this.logError('❌ Erreur fallback localStorage:', error);
    }

    return id;
  }

  // 📊 MÉTRIQUES ET MONITORING

  private updateServiceStatus(serviceName: string, status: Partial<ServiceStatus>): void {
    this.metrics.servicesStatus[serviceName] = {
      ...this.metrics.servicesStatus[serviceName],
      ...status
    };
  }

  private updateCacheHitRate(isHit: boolean): void {
    const totalRequests = this.metrics.totalOperations + 1;
    const currentHits = this.metrics.cacheHitRate * this.metrics.totalOperations;
    this.metrics.cacheHitRate = (currentHits + (isHit ? 1 : 0)) / totalRequests;
  }

  private updateAverageResponseTime(responseTime: number): void {
    const totalOps = this.metrics.successfulOperations;
    const currentAvg = this.metrics.averageResponseTime;
    this.metrics.averageResponseTime = (currentAvg * (totalOps - 1) + responseTime) / totalOps;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(message: string): void {
    if (this.config.enableLogging) {
      console.log(`[NotificationManager] ${message}`);
    }
  }

  private logError(message: string, error: any): void {
    if (this.config.enableLogging) {
      console.error(`[NotificationManager] ${message}`, error);
    }
  }

  // 📊 API PUBLIQUE POUR MÉTRIQUES

  public getMetrics(): ManagerMetrics {
    return { ...this.metrics };
  }

  public getServiceStatus(serviceName: string): ServiceStatus | undefined {
    return this.metrics.servicesStatus[serviceName];
  }

  public clearCache(): void {
    this.serviceCache = {};
    this.log('🧹 Cache des services vidé');
  }

  public updateConfig(newConfig: Partial<ManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('⚙️ Configuration mise à jour');
  }

  // 🔄 MÉTHODES DE MAINTENANCE

  public async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const serviceName of Object.keys(this.serviceCache)) {
      try {
        const service = await this.getService(serviceName);
        health[serviceName] = !!service;
      } catch (error) {
        health[serviceName] = false;
      }
    }

    return health;
  }

  public async restart(): Promise<void> {
    this.log('🔄 Redémarrage NotificationManager...');
    
    this.isInitialized = false;
    this.initializationPromise = null;
    this.clearCache();
    
    await this.initialize();
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationManager = NotificationManager.getInstance();

export default NotificationManager;

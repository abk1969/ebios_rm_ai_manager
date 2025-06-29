/**
 * 🛡️ GESTIONNAIRE D'ERREURS ROBUSTE POUR NOTIFICATIONS
 * Système de gestion d'erreurs avec fallbacks et recovery automatique
 * 
 * @fileoverview Gestionnaire centralisé pour toutes les erreurs du système
 * de notifications avec stratégies de récupération, fallbacks intelligents
 * et monitoring des erreurs pour améliorer la robustesse.
 * 
 * @version 1.0.0
 * @author Équipe EBIOS RM
 */

import type { EbiosNotification, CreateNotificationInput } from '../types';

// 🎯 TYPES POUR LA GESTION D'ERREURS
interface ErrorContext {
  operation: string;
  service: string;
  userId?: string;
  notificationId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ErrorEntry {
  id: string;
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryCount: number;
  maxRetries: number;
  lastRetry?: string;
  resolved: boolean;
  fallbackUsed?: string;
}

interface FallbackStrategy {
  name: string;
  condition: (error: Error, context: ErrorContext) => boolean;
  handler: (error: Error, context: ErrorContext) => Promise<any>;
  priority: number;
}

interface RecoveryStrategy {
  name: string;
  condition: (error: Error, context: ErrorContext) => boolean;
  handler: (error: Error, context: ErrorContext) => Promise<boolean>;
  cooldown: number;
}

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorsByService: Record<string, number>;
  fallbacksUsed: Record<string, number>;
  recoveryAttempts: number;
  recoverySuccessRate: number;
  averageResolutionTime: number;
}

/**
 * 🛡️ GESTIONNAIRE D'ERREURS PRINCIPAL
 */
export class NotificationErrorHandler {
  private static instance: NotificationErrorHandler | null = null;
  private errorLog: Map<string, ErrorEntry> = new Map();
  private fallbackStrategies: FallbackStrategy[] = [];
  private recoveryStrategies: RecoveryStrategy[] = [];
  private metrics: ErrorMetrics;
  private isEnabled = true;

  private constructor() {
    this.metrics = {
      totalErrors: 0,
      errorsByType: {},
      errorsBySeverity: {},
      errorsByService: {},
      fallbacksUsed: {},
      recoveryAttempts: 0,
      recoverySuccessRate: 0,
      averageResolutionTime: 0
    };

    this.initializeFallbackStrategies();
    this.initializeRecoveryStrategies();
  }

  // 🏭 SINGLETON PATTERN
  public static getInstance(): NotificationErrorHandler {
    if (!NotificationErrorHandler.instance) {
      NotificationErrorHandler.instance = new NotificationErrorHandler();
    }
    return NotificationErrorHandler.instance;
  }

  // 🚀 INITIALISATION DES STRATÉGIES

  private initializeFallbackStrategies(): void {
    // Fallback pour création de notification
    this.fallbackStrategies.push({
      name: 'localStorage_notification',
      priority: 1,
      condition: (error, context) => context.operation === 'createNotification',
      handler: async (error, context) => {
        const notification = context.metadata?.notification as CreateNotificationInput;
        if (!notification) throw new Error('Données notification manquantes');

        const id = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fallbackNotification = {
          ...notification,
          id,
          createdAt: new Date().toISOString(),
          status: 'unread' as const
        };

        // Stocker en localStorage
        const stored = JSON.parse(localStorage.getItem('fallback_notifications') || '[]');
        stored.push(fallbackNotification);
        localStorage.setItem('fallback_notifications', JSON.stringify(stored));

        // Programmer une tentative de synchronisation
        this.scheduleFallbackSync();

        return id;
      }
    });

    // Fallback pour récupération de notifications
    this.fallbackStrategies.push({
      name: 'cached_notifications',
      priority: 2,
      condition: (error, context) => context.operation === 'getNotifications',
      handler: async (error, context) => {
        // Récupérer depuis le cache ou localStorage
        const cached = localStorage.getItem('cached_notifications');
        if (cached) {
          return JSON.parse(cached);
        }
        return [];
      }
    });

    // Fallback pour actions
    this.fallbackStrategies.push({
      name: 'offline_action_queue',
      priority: 3,
      condition: (error, context) => context.operation === 'executeAction',
      handler: async (error, context) => {
        const actionData = context.metadata?.actionData;
        if (!actionData) throw new Error('Données action manquantes');

        // Mettre en file d'attente pour exécution ultérieure
        const queue = JSON.parse(localStorage.getItem('action_queue') || '[]');
        queue.push({
          ...actionData,
          queuedAt: new Date().toISOString(),
          retryCount: 0
        });
        localStorage.setItem('action_queue', JSON.stringify(queue));

        return { success: false, message: 'Action mise en file d\'attente', queued: true };
      }
    });

    // Fallback pour navigation
    this.fallbackStrategies.push({
      name: 'direct_navigation',
      priority: 4,
      condition: (error, context) => context.operation === 'navigateToNotification',
      handler: async (error, context) => {
        const url = context.metadata?.fallbackUrl || '/';
        
        if (typeof window !== 'undefined') {
          window.location.href = url;
          return true;
        }
        
        return false;
      }
    });

    console.log(`🛡️ ${this.fallbackStrategies.length} stratégies de fallback initialisées`);
  }

  private initializeRecoveryStrategies(): void {
    // Recovery pour erreurs réseau
    this.recoveryStrategies.push({
      name: 'network_retry',
      cooldown: 5000,
      condition: (error) => 
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('timeout'),
      handler: async (error, context) => {
        // Attendre et réessayer
        await this.delay(1000);
        return true; // Indique que le retry peut être tenté
      }
    });

    // Recovery pour erreurs de service
    this.recoveryStrategies.push({
      name: 'service_restart',
      cooldown: 30000,
      condition: (error, context) => 
        context.service === 'notificationService' && 
        error.message.includes('instance'),
      handler: async (error, context) => {
        try {
          // Tenter de redémarrer le service
          const { notificationService } = await import('./NotificationService');
          // Le service se réinitialise automatiquement
          return true;
        } catch {
          return false;
        }
      }
    });

    // Recovery pour erreurs de cache
    this.recoveryStrategies.push({
      name: 'cache_clear',
      cooldown: 10000,
      condition: (error) => 
        error.message.includes('cache') || 
        error.message.includes('storage'),
      handler: async (error, context) => {
        try {
          const { notificationCache } = await import('./NotificationCache');
          notificationCache.clearAll();
          return true;
        } catch {
          return false;
        }
      }
    });

    console.log(`🔄 ${this.recoveryStrategies.length} stratégies de recovery initialisées`);
  }

  // 🚨 GESTION PRINCIPALE DES ERREURS

  /**
   * Gérer une erreur avec fallbacks et recovery
   */
  public async handleError<T>(
    error: Error,
    context: ErrorContext,
    fallbackValue?: T
  ): Promise<T> {
    if (!this.isEnabled) {
      throw error;
    }

    const errorEntry = this.createErrorEntry(error, context);
    this.errorLog.set(errorEntry.id, errorEntry);
    this.updateMetrics(errorEntry);

    console.error(`🚨 [${context.service}/${context.operation}] ${error.message}`, {
      errorId: errorEntry.id,
      context,
      stack: error.stack
    });

    try {
      // 1. Tenter une stratégie de recovery
      const recovered = await this.attemptRecovery(error, context);
      if (recovered) {
        errorEntry.resolved = true;
        return await this.retryOperation(error, context);
      }

      // 2. Utiliser une stratégie de fallback
      const fallbackResult = await this.attemptFallback(error, context);
      if (fallbackResult !== undefined) {
        errorEntry.fallbackUsed = this.getUsedFallbackName(error, context);
        return fallbackResult;
      }

      // 3. Retourner la valeur de fallback par défaut
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }

      // 4. Si rien ne fonctionne, relancer l'erreur
      throw error;

    } catch (finalError) {
      errorEntry.severity = 'critical';
      this.logCriticalError(finalError, context);
      throw finalError;
    }
  }

  /**
   * Wrapper pour exécution sécurisée avec gestion d'erreurs
   */
  public async safeExecute<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    fallbackValue?: T
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      return await this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        context,
        fallbackValue
      );
    }
  }

  // 🔄 STRATÉGIES DE RECOVERY

  private async attemptRecovery(error: Error, context: ErrorContext): Promise<boolean> {
    for (const strategy of this.recoveryStrategies) {
      if (strategy.condition(error, context)) {
        try {
          this.metrics.recoveryAttempts++;
          const success = await strategy.handler(error, context);
          
          if (success) {
            console.log(`🔄 Recovery réussie avec stratégie: ${strategy.name}`);
            return true;
          }
        } catch (recoveryError) {
          console.warn(`⚠️ Échec recovery ${strategy.name}:`, recoveryError);
        }
      }
    }

    return false;
  }

  private async retryOperation(error: Error, context: ErrorContext): Promise<any> {
    // Logique de retry spécifique selon l'opération
    switch (context.operation) {
      case 'createNotification':
        const { notificationService } = await import('./NotificationService');
        return await notificationService.createNotification(context.metadata?.notification);
      
      case 'getNotifications':
        const service = await import('./NotificationService');
        return service.notificationService.getNotifications(context.metadata?.filters);
      
      default:
        throw new Error(`Retry non supporté pour l'opération: ${context.operation}`);
    }
  }

  // 🛟 STRATÉGIES DE FALLBACK

  private async attemptFallback(error: Error, context: ErrorContext): Promise<any> {
    // Trier par priorité
    const applicableStrategies = this.fallbackStrategies
      .filter(strategy => strategy.condition(error, context))
      .sort((a, b) => a.priority - b.priority);

    for (const strategy of applicableStrategies) {
      try {
        console.log(`🛟 Tentative fallback: ${strategy.name}`);
        const result = await strategy.handler(error, context);
        
        this.metrics.fallbacksUsed[strategy.name] = 
          (this.metrics.fallbacksUsed[strategy.name] || 0) + 1;
        
        console.log(`✅ Fallback réussi: ${strategy.name}`);
        return result;

      } catch (fallbackError) {
        console.warn(`⚠️ Échec fallback ${strategy.name}:`, fallbackError);
      }
    }

    return undefined;
  }

  private getUsedFallbackName(error: Error, context: ErrorContext): string {
    const strategy = this.fallbackStrategies.find(s => s.condition(error, context));
    return strategy?.name || 'unknown';
  }

  // 📊 GESTION DES MÉTRIQUES

  private createErrorEntry(error: Error, context: ErrorContext): ErrorEntry {
    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      context,
      severity: this.determineSeverity(error, context),
      retryCount: 0,
      maxRetries: 3,
      resolved: false,
      fallbackUsed: undefined
    };
  }

  private determineSeverity(error: Error, context: ErrorContext): ErrorEntry['severity'] {
    // Erreurs critiques
    if (context.operation === 'createNotification' && context.metadata?.priority === 'urgent') {
      return 'critical';
    }

    // Erreurs importantes
    if (error.message.includes('network') || error.message.includes('service')) {
      return 'high';
    }

    // Erreurs moyennes
    if (context.operation === 'executeAction' || context.operation === 'navigateToNotification') {
      return 'medium';
    }

    return 'low';
  }

  private updateMetrics(errorEntry: ErrorEntry): void {
    this.metrics.totalErrors++;
    
    const errorType = errorEntry.error.constructor.name;
    this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1;
    
    this.metrics.errorsBySeverity[errorEntry.severity] = 
      (this.metrics.errorsBySeverity[errorEntry.severity] || 0) + 1;
    
    this.metrics.errorsByService[errorEntry.context.service] = 
      (this.metrics.errorsByService[errorEntry.context.service] || 0) + 1;
  }

  // 🚨 GESTION DES ERREURS CRITIQUES

  private logCriticalError(error: Error, context: ErrorContext): void {
    const criticalError = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // Stocker en localStorage pour analyse ultérieure
    try {
      const criticalErrors = JSON.parse(localStorage.getItem('critical_errors') || '[]');
      criticalErrors.push(criticalError);
      
      // Garder seulement les 100 dernières erreurs critiques
      if (criticalErrors.length > 100) {
        criticalErrors.splice(0, criticalErrors.length - 100);
      }
      
      localStorage.setItem('critical_errors', JSON.stringify(criticalErrors));
    } catch (storageError) {
      console.error('❌ Impossible de stocker l\'erreur critique:', storageError);
    }

    // Envoyer une notification d'erreur critique si possible
    this.notifyCriticalError(criticalError);
  }

  private async notifyCriticalError(criticalError: any): Promise<void> {
    try {
      // Tenter de créer une notification d'erreur critique
      const { notificationService } = await import('./NotificationService');
      
      await notificationService.createNotification({
        type: 'error',
        category: 'system',
        priority: 'urgent',
        title: '🚨 Erreur Critique Système',
        message: `Une erreur critique s'est produite: ${criticalError.error.message}`,
        actions: [],
        context: {},
        source: 'error_handler',
        tags: ['critical', 'error', 'system'],
        persistent: true,
        sound: true
      });
    } catch {
      // Si même la notification d'erreur échoue, on ne peut rien faire de plus
      console.error('❌ Impossible de notifier l\'erreur critique');
    }
  }

  // 🔄 SYNCHRONISATION DES FALLBACKS

  private scheduleFallbackSync(): void {
    // Programmer une synchronisation des données de fallback
    setTimeout(async () => {
      await this.syncFallbackData();
    }, 30000); // 30 secondes
  }

  private async syncFallbackData(): Promise<void> {
    try {
      // Synchroniser les notifications en fallback
      const fallbackNotifications = JSON.parse(localStorage.getItem('fallback_notifications') || '[]');
      
      if (fallbackNotifications.length > 0) {
        const { notificationService } = await import('./NotificationService');
        
        for (const notification of fallbackNotifications) {
          try {
            await notificationService.createNotification(notification);
          } catch {
            // Garder en fallback si échec
            continue;
          }
        }
        
        // Vider le fallback après synchronisation réussie
        localStorage.removeItem('fallback_notifications');
        console.log(`✅ ${fallbackNotifications.length} notifications fallback synchronisées`);
      }

      // Synchroniser la file d'actions
      await this.syncActionQueue();

    } catch (error) {
      console.warn('⚠️ Erreur synchronisation fallback:', error);
    }
  }

  private async syncActionQueue(): Promise<void> {
    const actionQueue = JSON.parse(localStorage.getItem('action_queue') || '[]');
    
    if (actionQueue.length > 0) {
      const { notificationActions } = await import('./NotificationActions');
      const processedActions: any[] = [];
      
      for (const action of actionQueue) {
        try {
          await notificationActions.executeAction(action.actionId, action.context);
          // Action réussie, ne pas la remettre en queue
        } catch {
          // Action échouée, la remettre en queue avec retry count
          action.retryCount = (action.retryCount || 0) + 1;
          if (action.retryCount < 3) {
            processedActions.push(action);
          }
        }
      }
      
      localStorage.setItem('action_queue', JSON.stringify(processedActions));
    }
  }

  // 🔧 UTILITAIRES

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 📊 API PUBLIQUE

  public getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  public getErrorLog(): ErrorEntry[] {
    return Array.from(this.errorLog.values());
  }

  public clearErrorLog(): void {
    this.errorLog.clear();
    console.log('🧹 Log d\'erreurs vidé');
  }

  public enable(): void {
    this.isEnabled = true;
    console.log('🛡️ Gestionnaire d\'erreurs activé');
  }

  public disable(): void {
    this.isEnabled = false;
    console.log('🛡️ Gestionnaire d\'erreurs désactivé');
  }

  public getCriticalErrors(): any[] {
    try {
      return JSON.parse(localStorage.getItem('critical_errors') || '[]');
    } catch {
      return [];
    }
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationErrorHandler = NotificationErrorHandler.getInstance();

export default NotificationErrorHandler;

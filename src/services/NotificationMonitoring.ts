/**
 * 📊 SYSTÈME DE MONITORING AVANCÉ POUR NOTIFICATIONS
 * Surveillance temps réel avec alertes et dashboards
 * 
 * @fileoverview Système de monitoring complet pour surveiller la santé,
 * les performances et l'utilisation du système de notifications avec
 * alertes automatiques et métriques détaillées.
 * 
 * @version 1.0.0
 * @author Équipe EBIOS RM
 */

import type { EbiosNotification, NotificationEvent } from '../types';

// 🎯 TYPES POUR LE MONITORING
interface MonitoringMetrics {
  // Métriques de performance
  performance: {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    throughput: number; // notifications/minute
    errorRate: number; // percentage
    cacheHitRate: number; // percentage
  };

  // Métriques de santé système
  health: {
    servicesStatus: Record<string, 'healthy' | 'degraded' | 'down'>;
    memoryUsage: number; // MB
    cacheSize: number; // MB
    queueLength: number;
    lastHealthCheck: string;
  };

  // Métriques d'utilisation
  usage: {
    totalNotifications: number;
    notificationsByType: Record<string, number>;
    notificationsByCategory: Record<string, number>;
    notificationsByPriority: Record<string, number>;
    activeUsers: number;
    peakHours: number[];
  };

  // Métriques de qualité
  quality: {
    userEngagement: number; // percentage
    actionCompletionRate: number; // percentage
    notificationRelevance: number; // percentage
    userSatisfaction: number; // score 1-10
  };
}

interface Alert {
  id: string;
  type: 'performance' | 'health' | 'usage' | 'quality';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

interface MonitoringConfig {
  enableRealTimeMonitoring: boolean;
  enableAlerts: boolean;
  enablePerformanceTracking: boolean;
  enableHealthChecks: boolean;
  metricsRetentionDays: number;
  alertThresholds: {
    responseTime: number; // ms
    errorRate: number; // percentage
    memoryUsage: number; // MB
    cacheHitRate: number; // percentage
    userEngagement: number; // percentage
  };
  healthCheckInterval: number; // ms
  metricsCollectionInterval: number; // ms
}

interface PerformanceEntry {
  timestamp: string;
  operation: string;
  duration: number;
  success: boolean;
  metadata?: Record<string, any>;
}

/**
 * 📊 SYSTÈME DE MONITORING PRINCIPAL
 */
export class NotificationMonitoring {
  private static instance: NotificationMonitoring | null = null;
  private metrics: MonitoringMetrics;
  private alerts: Map<string, Alert> = new Map();
  private performanceHistory: PerformanceEntry[] = [];
  private config: MonitoringConfig;
  private isRunning = false;
  private intervals: NodeJS.Timeout[] = [];

  private constructor() {
    this.config = {
      enableRealTimeMonitoring: true,
      enableAlerts: true,
      enablePerformanceTracking: true,
      enableHealthChecks: true,
      metricsRetentionDays: 7,
      alertThresholds: {
        responseTime: 5000, // 5 seconds
        errorRate: 5, // 5%
        memoryUsage: 100, // 100MB
        cacheHitRate: 80, // 80%
        userEngagement: 60 // 60%
      },
      healthCheckInterval: 30000, // 30 seconds
      metricsCollectionInterval: 60000 // 1 minute
    };

    this.metrics = this.initializeMetrics();
  }

  // 🏭 SINGLETON PATTERN
  public static getInstance(): NotificationMonitoring {
    if (!NotificationMonitoring.instance) {
      NotificationMonitoring.instance = new NotificationMonitoring();
    }
    return NotificationMonitoring.instance;
  }

  // 🚀 INITIALISATION
  private initializeMetrics(): MonitoringMetrics {
    return {
      performance: {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        throughput: 0,
        errorRate: 0,
        cacheHitRate: 0
      },
      health: {
        servicesStatus: {},
        memoryUsage: 0,
        cacheSize: 0,
        queueLength: 0,
        lastHealthCheck: new Date().toISOString()
      },
      usage: {
        totalNotifications: 0,
        notificationsByType: {},
        notificationsByCategory: {},
        notificationsByPriority: {},
        activeUsers: 0,
        peakHours: []
      },
      quality: {
        userEngagement: 0,
        actionCompletionRate: 0,
        notificationRelevance: 0,
        userSatisfaction: 0
      }
    };
  }

  // 🚀 DÉMARRAGE DU MONITORING
  public start(): void {
    if (this.isRunning) {
      console.log('📊 Monitoring déjà en cours');
      return;
    }

    console.log('📊 Démarrage du monitoring des notifications...');
    this.isRunning = true;

    if (this.config.enableHealthChecks) {
      this.startHealthChecks();
    }

    if (this.config.enableRealTimeMonitoring) {
      this.startMetricsCollection();
    }

    console.log('✅ Monitoring des notifications démarré');
  }

  // 🛑 ARRÊT DU MONITORING
  public stop(): void {
    if (!this.isRunning) return;

    console.log('📊 Arrêt du monitoring...');
    this.isRunning = false;

    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];

    console.log('✅ Monitoring arrêté');
  }

  // 📊 COLLECTE DE MÉTRIQUES

  /**
   * Enregistrer une performance d'opération
   */
  public recordPerformance(operation: string, duration: number, success: boolean, metadata?: Record<string, any>): void {
    if (!this.config.enablePerformanceTracking) return;

    const entry: PerformanceEntry = {
      timestamp: new Date().toISOString(),
      operation,
      duration,
      success,
      metadata
    };

    this.performanceHistory.push(entry);

    // Limiter l'historique
    if (this.performanceHistory.length > 10000) {
      this.performanceHistory = this.performanceHistory.slice(-5000);
    }

    // Mettre à jour les métriques de performance
    this.updatePerformanceMetrics();

    // Vérifier les seuils d'alerte
    if (this.config.enableAlerts) {
      this.checkPerformanceAlerts(duration, success);
    }
  }

  /**
   * Enregistrer une notification créée
   */
  public recordNotificationCreated(notification: EbiosNotification): void {
    this.metrics.usage.totalNotifications++;
    
    // Compter par type
    this.metrics.usage.notificationsByType[notification.type] = 
      (this.metrics.usage.notificationsByType[notification.type] || 0) + 1;
    
    // Compter par catégorie
    this.metrics.usage.notificationsByCategory[notification.category] = 
      (this.metrics.usage.notificationsByCategory[notification.category] || 0) + 1;
    
    // Compter par priorité
    this.metrics.usage.notificationsByPriority[notification.priority] = 
      (this.metrics.usage.notificationsByPriority[notification.priority] || 0) + 1;

    // Analyser les heures de pointe
    this.updatePeakHours();
  }

  /**
   * Enregistrer un événement utilisateur
   */
  public recordUserEvent(event: NotificationEvent): void {
    // Mettre à jour les métriques de qualité selon le type d'événement
    switch (event.type) {
      case 'read':
        this.updateEngagementMetrics('read');
        break;
      case 'clicked':
        this.updateEngagementMetrics('clicked');
        break;
      case 'action_performed':
        this.updateEngagementMetrics('action');
        break;
      case 'dismissed':
        this.updateEngagementMetrics('dismissed');
        break;
    }
  }

  // 📊 MISE À JOUR DES MÉTRIQUES

  private updatePerformanceMetrics(): void {
    const recentEntries = this.performanceHistory.slice(-1000); // Dernières 1000 entrées
    
    if (recentEntries.length === 0) return;

    // Temps de réponse moyen
    const totalDuration = recentEntries.reduce((sum, entry) => sum + entry.duration, 0);
    this.metrics.performance.averageResponseTime = totalDuration / recentEntries.length;

    // Percentiles
    const sortedDurations = recentEntries.map(e => e.duration).sort((a, b) => a - b);
    const p95Index = Math.floor(sortedDurations.length * 0.95);
    const p99Index = Math.floor(sortedDurations.length * 0.99);
    
    this.metrics.performance.p95ResponseTime = sortedDurations[p95Index] || 0;
    this.metrics.performance.p99ResponseTime = sortedDurations[p99Index] || 0;

    // Taux d'erreur
    const errorCount = recentEntries.filter(e => !e.success).length;
    this.metrics.performance.errorRate = (errorCount / recentEntries.length) * 100;

    // Throughput (notifications par minute)
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const recentCount = recentEntries.filter(e => e.timestamp >= oneMinuteAgo).length;
    this.metrics.performance.throughput = recentCount;
  }

  private updateEngagementMetrics(eventType: string): void {
    // Logique simplifiée pour calculer l'engagement
    // Dans un vrai système, cela serait plus sophistiqué
    const weights = {
      read: 1,
      clicked: 2,
      action: 3,
      dismissed: -1
    };

    const weight = weights[eventType as keyof typeof weights] || 0;
    
    // Mise à jour progressive de l'engagement
    const currentEngagement = this.metrics.quality.userEngagement;
    this.metrics.quality.userEngagement = Math.max(0, Math.min(100, currentEngagement + weight * 0.1));
  }

  private updatePeakHours(): void {
    const currentHour = new Date().getHours();
    
    // Compter les notifications par heure (simplifié)
    if (!this.metrics.usage.peakHours.includes(currentHour)) {
      this.metrics.usage.peakHours.push(currentHour);
      
      // Garder seulement les 5 heures les plus actives
      if (this.metrics.usage.peakHours.length > 5) {
        this.metrics.usage.peakHours.shift();
      }
    }
  }

  // 🏥 VÉRIFICATIONS DE SANTÉ

  private startHealthChecks(): void {
    const healthCheckInterval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(healthCheckInterval);
        return;
      }

      await this.performHealthCheck();
    }, this.config.healthCheckInterval);

    this.intervals.push(healthCheckInterval);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Vérifier les services
      await this.checkServicesHealth();
      
      // Vérifier l'utilisation mémoire
      this.checkMemoryUsage();
      
      // Vérifier la taille du cache
      await this.checkCacheHealth();
      
      // Mettre à jour le timestamp
      this.metrics.health.lastHealthCheck = new Date().toISOString();

      console.log('💚 Health check completed');

    } catch (error) {
      console.error('❌ Health check failed:', error);
      
      if (this.config.enableAlerts) {
        this.createAlert('health', 'critical', 'Health Check Failed', 
          'Le health check du système a échoué', 0, 1);
      }
    }
  }

  private async checkServicesHealth(): Promise<void> {
    const services = [
      'notificationService',
      'notificationManager',
      'notificationCache',
      'notificationGenerators',
      'notificationScheduler'
    ];

    for (const serviceName of services) {
      try {
        // Simuler une vérification de santé du service
        // Dans un vrai système, cela ferait des appels réels
        this.metrics.health.servicesStatus[serviceName] = 'healthy';
      } catch (error) {
        this.metrics.health.servicesStatus[serviceName] = 'down';
        
        if (this.config.enableAlerts) {
          this.createAlert('health', 'critical', `Service ${serviceName} Down`, 
            `Le service ${serviceName} ne répond pas`, 0, 1);
        }
      }
    }
  }

  private checkMemoryUsage(): void {
    // Estimation approximative de l'utilisation mémoire
    const estimatedUsage = this.performanceHistory.length * 0.001 + // 1KB par entrée
                          this.alerts.size * 0.002 + // 2KB par alerte
                          Object.keys(this.metrics.usage.notificationsByType).length * 0.001;

    this.metrics.health.memoryUsage = estimatedUsage;

    if (estimatedUsage > this.config.alertThresholds.memoryUsage) {
      this.createAlert('health', 'warning', 'High Memory Usage', 
        `Utilisation mémoire élevée: ${estimatedUsage.toFixed(2)}MB`, 
        this.config.alertThresholds.memoryUsage, estimatedUsage);
    }
  }

  private async checkCacheHealth(): Promise<void> {
    try {
      const { notificationCache } = await import('./NotificationCache');
      const cacheMetrics = notificationCache.getMetrics();
      
      this.metrics.performance.cacheHitRate = cacheMetrics.hitRate;
      this.metrics.health.cacheSize = cacheMetrics.totalSize / (1024 * 1024); // Convert to MB

      if (cacheMetrics.hitRate < this.config.alertThresholds.cacheHitRate) {
        this.createAlert('performance', 'warning', 'Low Cache Hit Rate', 
          `Taux de cache faible: ${cacheMetrics.hitRate.toFixed(1)}%`, 
          this.config.alertThresholds.cacheHitRate, cacheMetrics.hitRate);
      }
    } catch (error) {
      console.warn('⚠️ Impossible de vérifier la santé du cache:', error);
    }
  }

  // 🚨 GESTION DES ALERTES

  private checkPerformanceAlerts(duration: number, success: boolean): void {
    // Alerte temps de réponse
    if (duration > this.config.alertThresholds.responseTime) {
      this.createAlert('performance', 'warning', 'Slow Response Time', 
        `Temps de réponse lent: ${duration}ms`, 
        this.config.alertThresholds.responseTime, duration);
    }

    // Alerte taux d'erreur
    if (this.metrics.performance.errorRate > this.config.alertThresholds.errorRate) {
      this.createAlert('performance', 'critical', 'High Error Rate', 
        `Taux d'erreur élevé: ${this.metrics.performance.errorRate.toFixed(1)}%`, 
        this.config.alertThresholds.errorRate, this.metrics.performance.errorRate);
    }
  }

  private createAlert(
    type: Alert['type'], 
    severity: Alert['severity'], 
    title: string, 
    message: string, 
    threshold: number, 
    currentValue: number
  ): void {
    const alertId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert: Alert = {
      id: alertId,
      type,
      severity,
      title,
      message,
      threshold,
      currentValue,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.set(alertId, alert);

    console.warn(`🚨 [${severity.toUpperCase()}] ${title}: ${message}`);

    // Nettoyer les anciennes alertes
    this.cleanupOldAlerts();
  }

  private cleanupOldAlerts(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    for (const [alertId, alert] of this.alerts.entries()) {
      if (alert.timestamp < oneDayAgo && (alert.acknowledged || alert.resolvedAt)) {
        this.alerts.delete(alertId);
      }
    }
  }

  // 📊 COLLECTE DE MÉTRIQUES PÉRIODIQUE

  private startMetricsCollection(): void {
    const metricsInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(metricsInterval);
        return;
      }

      this.collectMetrics();
    }, this.config.metricsCollectionInterval);

    this.intervals.push(metricsInterval);
  }

  private async collectMetrics(): Promise<void> {
    try {
      // Collecter les métriques des différents services
      await this.collectServiceMetrics();
      
      // Calculer les métriques dérivées
      this.calculateDerivedMetrics();
      
      // Persister les métriques si nécessaire
      this.persistMetrics();

    } catch (error) {
      console.error('❌ Erreur collecte métriques:', error);
    }
  }

  private async collectServiceMetrics(): Promise<void> {
    try {
      // Collecter depuis le manager
      const { notificationManager } = await import('./NotificationManager');
      const managerMetrics = notificationManager.getMetrics();
      
      // Collecter depuis le cache
      const { notificationCache } = await import('./NotificationCache');
      const cacheMetrics = notificationCache.getMetrics();
      
      // Collecter depuis l'error handler
      const { notificationErrorHandler } = await import('./NotificationErrorHandler');
      const errorMetrics = notificationErrorHandler.getMetrics();

      // Intégrer les métriques
      this.metrics.performance.cacheHitRate = cacheMetrics.hitRate;
      this.metrics.health.cacheSize = cacheMetrics.totalSize / (1024 * 1024);
      
    } catch (error) {
      console.warn('⚠️ Erreur collecte métriques services:', error);
    }
  }

  private calculateDerivedMetrics(): void {
    // Calculer les métriques dérivées
    const totalNotifications = this.metrics.usage.totalNotifications;
    
    if (totalNotifications > 0) {
      // Calculer la satisfaction utilisateur basée sur l'engagement
      this.metrics.quality.userSatisfaction = Math.min(10, this.metrics.quality.userEngagement / 10);
      
      // Calculer la pertinence des notifications
      this.metrics.quality.notificationRelevance = Math.max(0, 100 - this.metrics.performance.errorRate * 2);
    }
  }

  private persistMetrics(): void {
    try {
      // Sauvegarder les métriques dans localStorage
      const metricsSnapshot = {
        timestamp: new Date().toISOString(),
        metrics: this.metrics
      };

      const savedMetrics = JSON.parse(localStorage.getItem('notification_metrics_history') || '[]');
      savedMetrics.push(metricsSnapshot);

      // Garder seulement les métriques des derniers jours
      const retentionDate = new Date(Date.now() - this.config.metricsRetentionDays * 24 * 60 * 60 * 1000);
      const filteredMetrics = savedMetrics.filter((m: any) => new Date(m.timestamp) >= retentionDate);

      localStorage.setItem('notification_metrics_history', JSON.stringify(filteredMetrics));

    } catch (error) {
      console.warn('⚠️ Erreur persistance métriques:', error);
    }
  }

  // 📊 API PUBLIQUE

  public getMetrics(): MonitoringMetrics {
    return JSON.parse(JSON.stringify(this.metrics));
  }

  public getAlerts(): Alert[] {
    return Array.from(this.alerts.values());
  }

  public getActiveAlerts(): Alert[] {
    return this.getAlerts().filter(alert => !alert.acknowledged && !alert.resolvedAt);
  }

  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  public getPerformanceHistory(limit: number = 100): PerformanceEntry[] {
    return this.performanceHistory.slice(-limit);
  }

  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Configuration monitoring mise à jour');
  }

  public getDashboardData(): any {
    return {
      metrics: this.getMetrics(),
      alerts: this.getActiveAlerts(),
      performance: this.getPerformanceHistory(50),
      health: this.metrics.health,
      lastUpdate: new Date().toISOString()
    };
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationMonitoring = NotificationMonitoring.getInstance();

export default NotificationMonitoring;

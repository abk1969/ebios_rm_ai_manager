/**
 * 📊 SERVICE DE MONITORING WORKSHOP 1
 * Monitoring complet avec métriques, alertes et observabilité
 * POINT 5 - Déploiement et Intégration Production
 */

// 🎯 TYPES POUR LE MONITORING

export interface MonitoringInitConfig {
  environment: 'development' | 'staging' | 'production';
  enableMetrics: boolean;
  enableErrorReporting: boolean;
  metricsRetentionDays: number;
}

export interface MetricsConfig {
  collectInterval: number;
  enableDetailedMetrics: boolean;
  enableUserMetrics: boolean;
  enableSystemMetrics: boolean;
}

export interface MonitoringEvent {
  type: 'system_initialization' | 'session_started' | 'session_completed' | 'health_check_critical' | 
        'health_check_degraded' | 'session_cleanup' | 'error_occurred' | 'performance_alert' | 
        'user_action' | 'system_metric';
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number; // pourcentage
    loadAverage: number[];
  };
  memory: {
    used: number; // bytes
    total: number; // bytes
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connectionsActive: number;
  };
  application: {
    activeSessions: number;
    totalNotifications: number;
    a2aMessagesExchanged: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}

export interface UserMetrics {
  userId: string;
  sessionId: string;
  timestamp: Date;
  actions: {
    type: string;
    duration: number;
    success: boolean;
  }[];
  engagement: {
    timeSpent: number;
    interactionCount: number;
    completionRate: number;
    satisfactionScore?: number;
  };
  performance: {
    pageLoadTime: number;
    apiResponseTime: number;
    errorCount: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: 'warning' | 'critical';
  enabled: boolean;
  threshold: number;
  windowMinutes: number;
  cooldownMinutes: number;
  lastTriggered?: Date;
}

export interface Alert {
  id: string;
  ruleId: string;
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata: Record<string, any>;
}

// 📊 SERVICE DE MONITORING

export class Workshop1MonitoringService {
  private static instance: Workshop1MonitoringService;
  private isInitialized = false;
  private config: MonitoringInitConfig | null = null;
  private metricsConfig: MetricsConfig | null = null;
  
  // Stockage des données
  private events: MonitoringEvent[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private userMetrics: UserMetrics[] = [];
  private alerts: Alert[] = [];
  private alertRules: AlertRule[] = [];
  
  // Intervalles de collecte
  private metricsInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;
  
  // État du service
  private startTime = Date.now();
  private isHealthy = true;
  private lastHealthCheck = new Date();

  private constructor() {
    this.initializeDefaultAlertRules();
  }

  public static getInstance(): Workshop1MonitoringService {
    if (!Workshop1MonitoringService.instance) {
      Workshop1MonitoringService.instance = new Workshop1MonitoringService();
    }
    return Workshop1MonitoringService.instance;
  }

  // 🚀 INITIALISATION

  public async initialize(config: MonitoringInitConfig): Promise<void> {
    if (this.isInitialized) {
      console.log('⚠️ Service de monitoring déjà initialisé');
      return;
    }

    try {
      console.log('📊 Initialisation du service de monitoring...');
      this.config = config;
      
      // Démarrage de la collecte de métriques
      if (config.enableMetrics) {
        this.startMetricsCollection();
      }
      
      // Démarrage du nettoyage automatique
      this.startCleanupTasks();
      
      this.isInitialized = true;
      this.isHealthy = true;
      
      await this.recordEvent({
        type: 'system_initialization',
        severity: 'info',
        message: 'Service de monitoring initialisé',
        metadata: { environment: config.environment }
      });
      
      console.log('✅ Service de monitoring initialisé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur initialisation monitoring:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  // ⚙️ CONFIGURATION DES MÉTRIQUES

  public configureMetrics(config: MetricsConfig): void {
    this.metricsConfig = config;
    
    // Redémarrage de la collecte avec la nouvelle configuration
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    if (this.config?.enableMetrics) {
      this.startMetricsCollection();
    }
    
    console.log('⚙️ Configuration des métriques mise à jour');
  }

  // 📝 ENREGISTREMENT D'ÉVÉNEMENTS

  public async recordEvent(event: MonitoringEvent): Promise<void> {
    try {
      const enrichedEvent: MonitoringEvent = {
        ...event,
        timestamp: event.timestamp || new Date()
      };
      
      this.events.push(enrichedEvent);
      
      // Logging selon la sévérité
      switch (event.severity) {
        case 'critical':
        case 'error':
          console.error(`🚨 [${event.severity.toUpperCase()}] ${event.message}`, event.metadata);
          break;
        case 'warning':
          console.warn(`⚠️ [WARNING] ${event.message}`, event.metadata);
          break;
        case 'info':
          console.log(`ℹ️ [INFO] ${event.message}`, event.metadata);
          break;
        case 'debug':
          console.debug(`🔍 [DEBUG] ${event.message}`, event.metadata);
          break;
      }
      
      // Vérification des règles d'alerte
      if (event.severity === 'error' || event.severity === 'critical') {
        await this.checkAlertRules(event);
      }
      
    } catch (error) {
      console.error('❌ Erreur enregistrement événement:', error);
    }
  }

  // 🚨 ENREGISTREMENT D'ERREURS

  public async recordError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.recordEvent({
      type: 'error_occurred',
      severity: 'error',
      message: error.message,
      metadata: {
        stack: error.stack,
        name: error.name,
        context: context || {}
      }
    });
  }

  // 📊 ENREGISTREMENT DE MÉTRIQUES

  public async recordMetrics(metrics: Record<string, any>): Promise<void> {
    try {
      const systemMetric: SystemMetrics = {
        timestamp: new Date(),
        cpu: {
          usage: metrics.cpuUsage?.user || 0,
          loadAverage: [0, 0, 0] // Simulation
        },
        memory: {
          used: metrics.memoryUsage || process.memoryUsage().heapUsed,
          total: metrics.totalMemory || process.memoryUsage().heapTotal,
          percentage: ((metrics.memoryUsage || process.memoryUsage().heapUsed) / 
                      (metrics.totalMemory || process.memoryUsage().heapTotal)) * 100
        },
        network: {
          bytesIn: metrics.networkBytesIn || 0,
          bytesOut: metrics.networkBytesOut || 0,
          connectionsActive: metrics.activeConnections || 0
        },
        application: {
          activeSessions: metrics.activeSessions || 0,
          totalNotifications: metrics.totalNotifications || 0,
          a2aMessagesExchanged: metrics.a2aMessagesExchanged || 0,
          averageResponseTime: metrics.averageResponseTime || 0,
          errorRate: metrics.errorRate || 0,
          uptime: this.getUptime()
        }
      };
      
      this.systemMetrics.push(systemMetric);
      
      // Vérification des seuils d'alerte
      await this.checkMetricThresholds(systemMetric);
      
    } catch (error) {
      console.error('❌ Erreur enregistrement métriques:', error);
    }
  }

  // 👤 ENREGISTREMENT DE MÉTRIQUES UTILISATEUR

  public async recordUserMetrics(userMetrics: UserMetrics): Promise<void> {
    try {
      this.userMetrics.push(userMetrics);
      
      await this.recordEvent({
        type: 'user_action',
        severity: 'debug',
        message: `Métriques utilisateur enregistrées pour ${userMetrics.userId}`,
        metadata: {
          userId: userMetrics.userId,
          sessionId: userMetrics.sessionId,
          actionCount: userMetrics.actions.length,
          timeSpent: userMetrics.engagement.timeSpent
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur enregistrement métriques utilisateur:', error);
    }
  }

  // 📊 COLLECTE AUTOMATIQUE DE MÉTRIQUES

  private startMetricsCollection(): void {
    if (!this.metricsConfig) {
      console.warn('⚠️ Configuration des métriques manquante');
      return;
    }
    
    this.metricsInterval = setInterval(async () => {
      try {
        await this.collectSystemMetrics();
      } catch (error) {
        console.error('❌ Erreur collecte métriques:', error);
      }
    }, this.metricsConfig.collectInterval);
    
    console.log(`📊 Collecte de métriques démarrée (intervalle: ${this.metricsConfig.collectInterval}ms)`);
  }

  // 🔍 COLLECTE DES MÉTRIQUES SYSTÈME

  private async collectSystemMetrics(): Promise<void> {
    if (!this.metricsConfig?.enableSystemMetrics) return;
    
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    await this.recordMetrics({
      memoryUsage: memoryUsage.heapUsed,
      totalMemory: memoryUsage.heapTotal,
      cpuUsage: cpuUsage,
      timestamp: new Date()
    });
  }

  // 🧹 TÂCHES DE NETTOYAGE

  private startCleanupTasks(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // Toutes les 24 heures
    
    console.log('🧹 Tâches de nettoyage démarrées');
  }

  private cleanupOldData(): void {
    if (!this.config) return;
    
    const retentionMs = this.config.metricsRetentionDays * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(Date.now() - retentionMs);
    
    // Nettoyage des événements
    const eventsBefore = this.events.length;
    this.events = this.events.filter(event => 
      (event.timestamp || new Date()) > cutoffDate
    );
    
    // Nettoyage des métriques système
    const metricsBefore = this.systemMetrics.length;
    this.systemMetrics = this.systemMetrics.filter(metric => 
      metric.timestamp > cutoffDate
    );
    
    // Nettoyage des métriques utilisateur
    const userMetricsBefore = this.userMetrics.length;
    this.userMetrics = this.userMetrics.filter(metric => 
      metric.timestamp > cutoffDate
    );
    
    const eventsRemoved = eventsBefore - this.events.length;
    const metricsRemoved = metricsBefore - this.systemMetrics.length;
    const userMetricsRemoved = userMetricsBefore - this.userMetrics.length;
    
    if (eventsRemoved > 0 || metricsRemoved > 0 || userMetricsRemoved > 0) {
      console.log(`🧹 Nettoyage effectué: ${eventsRemoved} événements, ${metricsRemoved} métriques système, ${userMetricsRemoved} métriques utilisateur supprimés`);
    }
  }

  // 🚨 GESTION DES ALERTES

  private initializeDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: 'high_error_rate',
        name: 'Taux d\'erreur élevé',
        condition: 'errorRate > 5',
        severity: 'critical',
        enabled: true,
        threshold: 5,
        windowMinutes: 5,
        cooldownMinutes: 15
      },
      {
        id: 'slow_response_time',
        name: 'Temps de réponse lent',
        condition: 'averageResponseTime > 2000',
        severity: 'warning',
        enabled: true,
        threshold: 2000,
        windowMinutes: 10,
        cooldownMinutes: 30
      },
      {
        id: 'high_memory_usage',
        name: 'Utilisation mémoire élevée',
        condition: 'memoryPercentage > 80',
        severity: 'warning',
        enabled: true,
        threshold: 80,
        windowMinutes: 5,
        cooldownMinutes: 20
      },
      {
        id: 'service_down',
        name: 'Service indisponible',
        condition: 'serviceStatus = critical',
        severity: 'critical',
        enabled: true,
        threshold: 1,
        windowMinutes: 1,
        cooldownMinutes: 5
      }
    ];
  }

  private async checkAlertRules(event: MonitoringEvent): Promise<void> {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;
      
      // Vérification du cooldown
      if (rule.lastTriggered) {
        const cooldownMs = rule.cooldownMinutes * 60 * 1000;
        if (Date.now() - rule.lastTriggered.getTime() < cooldownMs) {
          continue;
        }
      }
      
      // Évaluation de la condition (simplifiée)
      if (this.evaluateAlertCondition(rule, event)) {
        await this.triggerAlert(rule, event);
      }
    }
  }

  private async checkMetricThresholds(metrics: SystemMetrics): Promise<void> {
    // Vérification du taux d'erreur
    if (metrics.application.errorRate > 5) {
      await this.triggerAlert(
        this.alertRules.find(r => r.id === 'high_error_rate')!,
        {
          type: 'performance_alert',
          severity: 'critical',
          message: `Taux d'erreur élevé: ${metrics.application.errorRate}%`,
          metadata: { errorRate: metrics.application.errorRate }
        }
      );
    }
    
    // Vérification du temps de réponse
    if (metrics.application.averageResponseTime > 2000) {
      await this.triggerAlert(
        this.alertRules.find(r => r.id === 'slow_response_time')!,
        {
          type: 'performance_alert',
          severity: 'warning',
          message: `Temps de réponse lent: ${metrics.application.averageResponseTime}ms`,
          metadata: { responseTime: metrics.application.averageResponseTime }
        }
      );
    }
    
    // Vérification de l'utilisation mémoire
    if (metrics.memory.percentage > 80) {
      await this.triggerAlert(
        this.alertRules.find(r => r.id === 'high_memory_usage')!,
        {
          type: 'performance_alert',
          severity: 'warning',
          message: `Utilisation mémoire élevée: ${metrics.memory.percentage.toFixed(1)}%`,
          metadata: { memoryPercentage: metrics.memory.percentage }
        }
      );
    }
  }

  private evaluateAlertCondition(rule: AlertRule, event: MonitoringEvent): boolean {
    // Évaluation simplifiée des conditions
    switch (rule.id) {
      case 'service_down':
        return event.severity === 'critical' && event.type === 'health_check_critical';
      default:
        return false;
    }
  }

  private async triggerAlert(rule: AlertRule, event: MonitoringEvent): Promise<void> {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      severity: rule.severity,
      title: rule.name,
      message: event.message,
      timestamp: new Date(),
      resolved: false,
      metadata: event.metadata || {}
    };
    
    this.alerts.push(alert);
    rule.lastTriggered = new Date();
    
    console.log(`🚨 ALERTE ${rule.severity.toUpperCase()}: ${rule.name} - ${event.message}`);
    
    // Ici, on pourrait envoyer des notifications (email, Slack, etc.)
    await this.sendAlertNotification(alert);
  }

  private async sendAlertNotification(alert: Alert): Promise<void> {
    // Simulation d'envoi de notification
    console.log(`📧 Notification d'alerte envoyée: ${alert.title}`);
  }

  // 📊 MÉTHODES DE CONSULTATION

  public getEvents(filters?: {
    type?: string;
    severity?: string;
    since?: Date;
    limit?: number;
  }): MonitoringEvent[] {
    let events = [...this.events];
    
    if (filters?.type) {
      events = events.filter(e => e.type === filters.type);
    }
    
    if (filters?.severity) {
      events = events.filter(e => e.severity === filters.severity);
    }
    
    if (filters?.since) {
      events = events.filter(e => (e.timestamp || new Date()) >= filters.since!);
    }
    
    if (filters?.limit) {
      events = events.slice(-filters.limit);
    }
    
    return events.sort((a, b) => 
      ((b.timestamp || new Date()).getTime() - (a.timestamp || new Date()).getTime())
    );
  }

  public getSystemMetrics(since?: Date, limit?: number): SystemMetrics[] {
    let metrics = [...this.systemMetrics];
    
    if (since) {
      metrics = metrics.filter(m => m.timestamp >= since);
    }
    
    if (limit) {
      metrics = metrics.slice(-limit);
    }
    
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getUserMetrics(userId?: string, since?: Date): UserMetrics[] {
    let metrics = [...this.userMetrics];
    
    if (userId) {
      metrics = metrics.filter(m => m.userId === userId);
    }
    
    if (since) {
      metrics = metrics.filter(m => m.timestamp >= since);
    }
    
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getAlerts(resolved?: boolean): Alert[] {
    let alerts = [...this.alerts];
    
    if (resolved !== undefined) {
      alerts = alerts.filter(a => a.resolved === resolved);
    }
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // 🏥 ÉTAT DE SANTÉ

  public isHealthy(): boolean {
    return this.isHealthy && this.isInitialized;
  }

  public getHealthStatus() {
    return {
      isHealthy: this.isHealthy,
      isInitialized: this.isInitialized,
      uptime: this.getUptime(),
      lastHealthCheck: this.lastHealthCheck,
      eventsCount: this.events.length,
      metricsCount: this.systemMetrics.length,
      userMetricsCount: this.userMetrics.length,
      activeAlertsCount: this.alerts.filter(a => !a.resolved).length
    };
  }

  private getUptime(): number {
    return Date.now() - this.startTime;
  }

  // 🛑 ARRÊT DU SERVICE

  public async shutdown(): Promise<void> {
    console.log('🛑 Arrêt du service de monitoring...');
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    await this.recordEvent({
      type: 'system_initialization',
      severity: 'info',
      message: 'Service de monitoring arrêté'
    });
    
    this.isInitialized = false;
    console.log('✅ Service de monitoring arrêté');
  }
}

export default Workshop1MonitoringService;

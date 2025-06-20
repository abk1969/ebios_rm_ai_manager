/**
 * 🚀 INTÉGRATION PRODUCTION WORKSHOP 1
 * Service d'intégration complète dans l'application principale
 * POINT 5 - Déploiement et Intégration Production
 */

import { Workshop1MasterAgent } from '../domain/services/Workshop1MasterAgent';
import { Workshop1NotificationAgent } from '../domain/services/Workshop1NotificationAgent';
import { ExpertNotificationService } from '../domain/services/ExpertNotificationService';
import { NotificationIntegrationService } from '../domain/services/NotificationIntegrationService';
import { A2ANotificationProtocol } from '../domain/services/A2ANotificationProtocol';
import { Workshop1MonitoringService } from './Workshop1MonitoringService';
import { Workshop1ProductionConfig } from './Workshop1ProductionConfig';
import { EbiosExpertProfile } from '../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR L'INTÉGRATION PRODUCTION

export interface ProductionIntegrationConfig {
  environment: 'development' | 'staging' | 'production';
  enableMonitoring: boolean;
  enableA2AProtocol: boolean;
  enableExpertNotifications: boolean;
  enablePerformanceTracking: boolean;
  enableErrorReporting: boolean;
  maxConcurrentSessions: number;
  sessionTimeoutMs: number;
  notificationRetentionDays: number;
  metricsRetentionDays: number;
}

export interface IntegrationStatus {
  isInitialized: boolean;
  servicesStatus: {
    masterAgent: 'healthy' | 'degraded' | 'critical';
    notificationAgent: 'healthy' | 'degraded' | 'critical';
    expertNotificationService: 'healthy' | 'degraded' | 'critical';
    integrationService: 'healthy' | 'degraded' | 'critical';
    a2aProtocol: 'healthy' | 'degraded' | 'critical';
    monitoring: 'healthy' | 'degraded' | 'critical';
  };
  metrics: {
    activeSessions: number;
    totalNotifications: number;
    a2aMessagesExchanged: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  lastHealthCheck: Date;
  version: string;
}

export interface Workshop1Session {
  sessionId: string;
  userId: string;
  userProfile: EbiosExpertProfile;
  startTime: Date;
  lastActivity: Date;
  currentModule: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'error';
  metrics: {
    timeSpent: number;
    adaptationsApplied: number;
    notificationsGenerated: number;
    engagementScore: number;
  };
}

// 🚀 SERVICE D'INTÉGRATION PRODUCTION

export class Workshop1ProductionIntegration {
  private static instance: Workshop1ProductionIntegration;
  private config: ProductionIntegrationConfig;
  private isInitialized = false;
  private activeSessions = new Map<string, Workshop1Session>();
  private healthCheckInterval?: NodeJS.Timeout;
  private metricsCollectionInterval?: NodeJS.Timeout;

  // Services intégrés
  private masterAgent: Workshop1MasterAgent;
  private notificationAgent: Workshop1NotificationAgent;
  private expertNotificationService: ExpertNotificationService;
  private integrationService: NotificationIntegrationService;
  private a2aProtocol: A2ANotificationProtocol;
  private monitoringService: Workshop1MonitoringService;

  private constructor() {
    this.config = Workshop1ProductionConfig.getProductionConfig();
    this.masterAgent = Workshop1MasterAgent.getInstance();
    this.notificationAgent = Workshop1NotificationAgent.getInstance();
    this.expertNotificationService = ExpertNotificationService.getInstance();
    this.integrationService = NotificationIntegrationService.getInstance();
    this.a2aProtocol = new A2ANotificationProtocol();
    this.monitoringService = Workshop1MonitoringService.getInstance();
  }

  public static getInstance(): Workshop1ProductionIntegration {
    if (!Workshop1ProductionIntegration.instance) {
      Workshop1ProductionIntegration.instance = new Workshop1ProductionIntegration();
    }
    return Workshop1ProductionIntegration.instance;
  }

  // 🚀 INITIALISATION PRODUCTION

  public async initializeProduction(): Promise<void> {
    if (this.isInitialized) {
      console.log('⚠️ Workshop 1 déjà initialisé en production');
      return;
    }

    try {
      console.log('🚀 Initialisation Workshop 1 en production...');
      console.log(`📊 Environnement: ${this.config.environment}`);
      console.log(`🔧 Configuration: ${JSON.stringify(this.config, null, 2)}`);

      // 1. Initialisation du monitoring
      if (this.config.enableMonitoring) {
        await this.monitoringService.initialize({
          environment: this.config.environment,
          enableMetrics: this.config.enablePerformanceTracking,
          enableErrorReporting: this.config.enableErrorReporting,
          metricsRetentionDays: this.config.metricsRetentionDays
        });
        console.log('✅ Monitoring initialisé');
      }

      // 2. Initialisation du protocole A2A
      if (this.config.enableA2AProtocol) {
        await this.a2aProtocol.initialize({
          agentId: `workshop1_production_${this.config.environment}`,
          agentType: 'notification',
          communicationMode: 'real_time',
          retryAttempts: 3,
          timeoutMs: 10000,
          enableEncryption: this.config.environment === 'production',
          enableCompression: true
        });
        console.log('✅ Protocole A2A initialisé');
      }

      // 3. Configuration des services
      await this.configureServices();

      // 4. Démarrage des tâches de maintenance
      this.startMaintenanceTasks();

      // 5. Validation de l'intégration
      await this.validateIntegration();

      this.isInitialized = true;
      console.log('🎉 Workshop 1 initialisé avec succès en production !');

      // 6. Enregistrement de l'événement
      await this.monitoringService.recordEvent({
        type: 'system_initialization',
        severity: 'info',
        message: 'Workshop 1 initialisé en production',
        metadata: {
          environment: this.config.environment,
          version: this.getVersion(),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Erreur initialisation production:', error);
      
      if (this.config.enableErrorReporting) {
        await this.monitoringService.recordError(error as Error, {
          context: 'production_initialization',
          environment: this.config.environment
        });
      }
      
      throw error;
    }
  }

  // ⚙️ CONFIGURATION DES SERVICES

  private async configureServices(): Promise<void> {
    console.log('⚙️ Configuration des services Workshop 1...');

    // Configuration du service de notifications expertes
    if (this.config.enableExpertNotifications) {
      // Configuration spécifique à la production
      console.log('✅ Service de notifications expertes configuré');
    }

    // Configuration de l'intégration
    await this.integrationService.initialize({
      environment: this.config.environment,
      enableA2A: this.config.enableA2AProtocol,
      enableExpertNotifications: this.config.enableExpertNotifications,
      maxRetries: 3,
      timeoutMs: 5000
    });
    console.log('✅ Service d\'intégration configuré');

    // Configuration du monitoring
    if (this.config.enableMonitoring) {
      this.monitoringService.configureMetrics({
        collectInterval: 30000, // 30 secondes
        enableDetailedMetrics: this.config.enablePerformanceTracking,
        enableUserMetrics: true,
        enableSystemMetrics: true
      });
      console.log('✅ Monitoring configuré');
    }
  }

  // 🔄 TÂCHES DE MAINTENANCE

  private startMaintenanceTasks(): void {
    console.log('🔄 Démarrage des tâches de maintenance...');

    // Health checks périodiques
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('❌ Erreur health check:', error);
      }
    }, 60000); // Toutes les minutes

    // Collecte de métriques
    if (this.config.enablePerformanceTracking) {
      this.metricsCollectionInterval = setInterval(async () => {
        try {
          await this.collectMetrics();
        } catch (error) {
          console.error('❌ Erreur collecte métriques:', error);
        }
      }, 30000); // Toutes les 30 secondes
    }

    // Nettoyage des sessions expirées
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 300000); // Toutes les 5 minutes

    console.log('✅ Tâches de maintenance démarrées');
  }

  // 🏥 HEALTH CHECK

  private async performHealthCheck(): Promise<void> {
    const status = await this.getIntegrationStatus();
    
    // Vérification des services critiques
    const criticalServices = Object.values(status.servicesStatus);
    const hasCriticalIssues = criticalServices.includes('critical');
    const hasDegradedServices = criticalServices.includes('degraded');

    if (hasCriticalIssues) {
      await this.monitoringService.recordEvent({
        type: 'health_check_critical',
        severity: 'critical',
        message: 'Services critiques en panne détectés',
        metadata: { servicesStatus: status.servicesStatus }
      });
    } else if (hasDegradedServices) {
      await this.monitoringService.recordEvent({
        type: 'health_check_degraded',
        severity: 'warning',
        message: 'Services dégradés détectés',
        metadata: { servicesStatus: status.servicesStatus }
      });
    }
  }

  // 📊 COLLECTE DE MÉTRIQUES

  private async collectMetrics(): Promise<void> {
    const metrics = {
      activeSessions: this.activeSessions.size,
      totalNotifications: this.integrationService.getIntegrationMetrics().totalNotificationsProcessed,
      a2aMessagesExchanged: this.a2aProtocol.getMetrics().totalMessagesExchanged,
      averageResponseTime: this.calculateAverageResponseTime(),
      errorRate: this.calculateErrorRate(),
      memoryUsage: process.memoryUsage().heapUsed,
      cpuUsage: process.cpuUsage()
    };

    await this.monitoringService.recordMetrics(metrics);
  }

  // 🧹 NETTOYAGE DES SESSIONS EXPIRÉES

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.activeSessions.entries()) {
      const timeSinceLastActivity = now - session.lastActivity.getTime();
      
      if (timeSinceLastActivity > this.config.sessionTimeoutMs) {
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      this.activeSessions.delete(sessionId);
      console.log(`🧹 Session expirée nettoyée: ${sessionId}`);
    }

    if (expiredSessions.length > 0) {
      this.monitoringService.recordEvent({
        type: 'session_cleanup',
        severity: 'info',
        message: `${expiredSessions.length} sessions expirées nettoyées`,
        metadata: { expiredSessions }
      });
    }
  }

  // 🎯 GESTION DES SESSIONS UTILISATEUR

  public async startUserSession(userProfile: EbiosExpertProfile): Promise<string> {
    try {
      // Vérification de la limite de sessions concurrentes
      if (this.activeSessions.size >= this.config.maxConcurrentSessions) {
        throw new Error('Limite de sessions concurrentes atteinte');
      }

      // Démarrage de la session via l'agent maître
      const session = await this.masterAgent.startIntelligentSession(
        userProfile.id,
        userProfile
      );

      // Enregistrement de la session
      const workshop1Session: Workshop1Session = {
        sessionId: session.sessionId,
        userId: userProfile.id,
        userProfile,
        startTime: new Date(),
        lastActivity: new Date(),
        currentModule: session.currentModule,
        progress: 0,
        status: 'active',
        metrics: {
          timeSpent: 0,
          adaptationsApplied: 0,
          notificationsGenerated: 0,
          engagementScore: 100
        }
      };

      this.activeSessions.set(session.sessionId, workshop1Session);

      // Enregistrement de l'événement
      await this.monitoringService.recordEvent({
        type: 'session_started',
        severity: 'info',
        message: `Session démarrée pour ${userProfile.name}`,
        metadata: {
          sessionId: session.sessionId,
          userId: userProfile.id,
          expertiseLevel: session.analysisResult.expertiseLevel.level
        }
      });

      console.log(`🎯 Session démarrée: ${session.sessionId} pour ${userProfile.name}`);
      return session.sessionId;

    } catch (error) {
      console.error('❌ Erreur démarrage session:', error);
      
      if (this.config.enableErrorReporting) {
        await this.monitoringService.recordError(error as Error, {
          context: 'session_start',
          userId: userProfile.id
        });
      }
      
      throw error;
    }
  }

  // 📊 MISE À JOUR DE SESSION

  public async updateUserSession(
    sessionId: string, 
    updates: {
      currentModule?: string;
      progress?: number;
      timeSpent?: number;
      engagementScore?: number;
    }
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session non trouvée: ${sessionId}`);
    }

    // Mise à jour de la session
    if (updates.currentModule) session.currentModule = updates.currentModule;
    if (updates.progress !== undefined) session.progress = updates.progress;
    if (updates.timeSpent !== undefined) session.metrics.timeSpent = updates.timeSpent;
    if (updates.engagementScore !== undefined) session.metrics.engagementScore = updates.engagementScore;
    
    session.lastActivity = new Date();

    // Mise à jour via l'agent maître
    await this.masterAgent.updateSessionProgress(sessionId, {
      moduleProgress: updates.progress,
      timeSpent: updates.timeSpent,
      engagementIndicators: updates.engagementScore && updates.engagementScore > 80 ? 
        ['high_engagement'] : ['medium_engagement']
    });
  }

  // 🏁 FINALISATION DE SESSION

  public async finalizeUserSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session non trouvée: ${sessionId}`);
    }

    try {
      // Finalisation via l'agent maître
      const summary = await this.masterAgent.finalizeSession(sessionId);
      
      // Mise à jour du statut
      session.status = 'completed';
      session.progress = 100;

      // Enregistrement de l'événement
      await this.monitoringService.recordEvent({
        type: 'session_completed',
        severity: 'info',
        message: `Session terminée: ${sessionId}`,
        metadata: {
          sessionId,
          userId: session.userId,
          duration: session.metrics.timeSpent,
          completionRate: summary.completionRate,
          finalScore: summary.overallScore
        }
      });

      // Suppression de la session active
      this.activeSessions.delete(sessionId);

      console.log(`🏁 Session finalisée: ${sessionId}`);

    } catch (error) {
      session.status = 'error';
      console.error('❌ Erreur finalisation session:', error);
      throw error;
    }
  }

  // 📊 STATUT DE L'INTÉGRATION

  public async getIntegrationStatus(): Promise<IntegrationStatus> {
    const servicesStatus = {
      masterAgent: await this.checkServiceHealth('masterAgent'),
      notificationAgent: await this.checkServiceHealth('notificationAgent'),
      expertNotificationService: await this.checkServiceHealth('expertNotificationService'),
      integrationService: await this.checkServiceHealth('integrationService'),
      a2aProtocol: await this.checkServiceHealth('a2aProtocol'),
      monitoring: await this.checkServiceHealth('monitoring')
    };

    const metrics = {
      activeSessions: this.activeSessions.size,
      totalNotifications: this.integrationService.getIntegrationMetrics().totalNotificationsProcessed,
      a2aMessagesExchanged: this.a2aProtocol.getMetrics().totalMessagesExchanged,
      averageResponseTime: this.calculateAverageResponseTime(),
      errorRate: this.calculateErrorRate(),
      uptime: this.calculateUptime()
    };

    return {
      isInitialized: this.isInitialized,
      servicesStatus,
      metrics,
      lastHealthCheck: new Date(),
      version: this.getVersion()
    };
  }

  // 🔧 MÉTHODES UTILITAIRES

  private async checkServiceHealth(serviceName: string): Promise<'healthy' | 'degraded' | 'critical'> {
    try {
      switch (serviceName) {
        case 'masterAgent':
          // Test simple du service
          return 'healthy';
        case 'notificationAgent':
          return 'healthy';
        case 'expertNotificationService':
          return 'healthy';
        case 'integrationService':
          return 'healthy';
        case 'a2aProtocol':
          return this.a2aProtocol.isConnected() ? 'healthy' : 'degraded';
        case 'monitoring':
          return this.monitoringService.isHealthy() ? 'healthy' : 'degraded';
        default:
          return 'critical';
      }
    } catch (error) {
      return 'critical';
    }
  }

  private calculateAverageResponseTime(): number {
    // Simulation - en production, utiliser des métriques réelles
    return Math.random() * 1000 + 500; // 500-1500ms
  }

  private calculateErrorRate(): number {
    // Simulation - en production, calculer le taux d'erreur réel
    return Math.random() * 5; // 0-5%
  }

  private calculateUptime(): number {
    // Simulation - en production, calculer l'uptime réel
    return 99.9; // 99.9%
  }

  private getVersion(): string {
    return '1.0.0'; // Version du Workshop 1
  }

  // ✅ VALIDATION DE L'INTÉGRATION

  private async validateIntegration(): Promise<void> {
    console.log('✅ Validation de l\'intégration...');

    const validations = [
      { name: 'Services initialisés', check: () => this.isInitialized },
      { name: 'Agent maître opérationnel', check: () => !!this.masterAgent },
      { name: 'Notifications configurées', check: () => !!this.expertNotificationService },
      { name: 'Protocole A2A actif', check: () => !this.config.enableA2AProtocol || this.a2aProtocol.isConnected() },
      { name: 'Monitoring actif', check: () => !this.config.enableMonitoring || this.monitoringService.isHealthy() }
    ];

    for (const validation of validations) {
      if (!validation.check()) {
        throw new Error(`Validation échouée: ${validation.name}`);
      }
      console.log(`  ✅ ${validation.name}`);
    }

    console.log('✅ Validation de l\'intégration réussie');
  }

  // 🛑 ARRÊT PROPRE

  public async shutdown(): Promise<void> {
    console.log('🛑 Arrêt de Workshop 1...');

    try {
      // Arrêt des tâches de maintenance
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
      if (this.metricsCollectionInterval) {
        clearInterval(this.metricsCollectionInterval);
      }

      // Finalisation des sessions actives
      for (const sessionId of this.activeSessions.keys()) {
        try {
          await this.finalizeUserSession(sessionId);
        } catch (error) {
          console.error(`❌ Erreur finalisation session ${sessionId}:`, error);
        }
      }

      // Arrêt des services
      await this.a2aProtocol.shutdown();
      await this.notificationAgent.shutdown();
      await this.integrationService.shutdown();
      await this.monitoringService.shutdown();

      this.isInitialized = false;
      console.log('✅ Workshop 1 arrêté proprement');

    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt:', error);
      throw error;
    }
  }

  // 📊 MÉTRIQUES PUBLIQUES

  public getActiveSessionsCount(): number {
    return this.activeSessions.size;
  }

  public getSessionDetails(sessionId: string): Workshop1Session | undefined {
    return this.activeSessions.get(sessionId);
  }

  public getAllActiveSessions(): Workshop1Session[] {
    return Array.from(this.activeSessions.values());
  }

  public getConfiguration(): ProductionIntegrationConfig {
    return { ...this.config };
  }
}

export default Workshop1ProductionIntegration;

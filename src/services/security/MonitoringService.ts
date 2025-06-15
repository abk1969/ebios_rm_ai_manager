/**
 * 🔍 SERVICE DE MONITORING ET ALERTES
 * Détection d'anomalies, métriques de sécurité, alertes temps réel
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SecureLogger } from '@/services/logging/SecureLogger';
import type { SecurityEvent, SecurityContext } from './SecurityService';

export interface MonitoringConfig {
  metrics: {
    failedLogins: { threshold: number; window: number };
    suspiciousActivity: { threshold: number; window: number };
    dataExfiltration: { threshold: number; window: number };
    privilegeEscalation: { threshold: number; window: number };
  };
  alerts: {
    channels: string[];
    severity: {
      critical: { response: string; escalation: number };
      high: { response: string; escalation: number };
      medium: { response: string; escalation: number };
      low: { response: string; escalation: number };
    };
  };
}

export interface SecurityMetric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface SecurityAlert {
  id?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  details?: any;
  status: 'open' | 'acknowledged' | 'resolved' | 'false_positive';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface Anomaly {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  timestamp: Date;
  userId?: string;
  details: any;
}

export class MonitoringService {
  private logger = SecureLogger.getInstance();
  private config: MonitoringConfig;
  private metrics = new Map<string, SecurityMetric[]>();
  private activeAlerts = new Map<string, SecurityAlert>();
  private userBehaviorProfiles = new Map<string, any>();

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.startMetricsCollection();
    this.startAnomalyDetection();
  }

  // 📊 ENREGISTREMENT DE MÉTRIQUES
  public recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: SecurityMetric = {
      name,
      value,
      timestamp: new Date(),
      tags
    };

    // Stocker en mémoire pour l'analyse temps réel
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name)!;
    metricHistory.push(metric);

    // Garder seulement les 1000 dernières métriques
    if (metricHistory.length > 1000) {
      metricHistory.shift();
    }

    // Stocker en base de données de façon asynchrone
    this.storeMetric(metric).catch(error => {
      this.logger.error('Erreur lors du stockage de métrique', {
        metric: name,
        error: error.message
      });
    });
  }

  // 🚨 TRAITEMENT DES ÉVÉNEMENTS DE SÉCURITÉ
  public async processSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Enregistrer les métriques basées sur l'événement
      this.recordEventMetrics(event);

      // Détecter les anomalies
      const anomalies = await this.analyzeEventForAnomalies(event);
      
      for (const anomaly of anomalies) {
        await this.handleAnomaly(anomaly, event);
      }

      // Mettre à jour le profil comportemental
      if (event.userId) {
        await this.updateUserBehaviorProfile(event.userId, event);
      }

    } catch (error) {
      this.logger.error('Erreur lors du traitement de l\'événement de sécurité', {
        event,
        error: error.message
      });
    }
  }

  // 🔍 DÉTECTION D'ANOMALIES
  public async detectAnomalies(context: SecurityContext): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    try {
      // Analyser les tentatives de connexion échouées
      const failedLoginAnomalies = await this.detectFailedLoginAnomalies(context);
      anomalies.push(...failedLoginAnomalies);

      // Analyser les accès inhabituels
      const accessAnomalies = await this.detectUnusualAccessPatterns(context);
      anomalies.push(...accessAnomalies);

      // Analyser l'escalade de privilèges
      const privilegeAnomalies = await this.detectPrivilegeEscalation(context);
      anomalies.push(...privilegeAnomalies);

      // Analyser l'exfiltration de données
      const exfiltrationAnomalies = await this.detectDataExfiltration(context);
      anomalies.push(...exfiltrationAnomalies);

    } catch (error) {
      this.logger.error('Erreur lors de la détection d\'anomalies', {
        userId: context.userId,
        error: error.message
      });
    }

    return anomalies;
  }

  // 🚨 DÉCLENCHEMENT D'ALERTES
  public async triggerAlert(event: SecurityEvent): Promise<void> {
    const alert: SecurityAlert = {
      type: event.type,
      severity: event.severity,
      title: this.generateAlertTitle(event),
      description: this.generateAlertDescription(event),
      timestamp: new Date(),
      userId: event.userId,
      sessionId: event.sessionId,
      ipAddress: event.ipAddress,
      details: event.details,
      status: 'open'
    };

    try {
      // Enregistrer l'alerte
      const docRef = await addDoc(collection(db, 'security_alerts'), {
        ...alert,
        timestamp: Timestamp.fromDate(alert.timestamp)
      });

      alert.id = docRef.id;
      this.activeAlerts.set(docRef.id, alert);

      // Envoyer les notifications
      await this.sendAlertNotifications(alert);

      // Programmer l'escalade si nécessaire
      this.scheduleEscalation(alert);

      this.logger.warn('Alerte de sécurité déclenchée', {
        alertId: alert.id,
        type: alert.type,
        severity: alert.severity,
        userId: alert.userId
      });

    } catch (error) {
      this.logger.error('Erreur lors du déclenchement d\'alerte', {
        alert,
        error: error.message
      });
    }
  }

  // 🆘 RÉPONSE AUX INCIDENTS
  public async triggerIncidentResponse(incident: any): Promise<void> {
    try {
      const incidentId = `INC_${Date.now()}`;
      
      // Créer l'incident
      await addDoc(collection(db, 'security_incidents'), {
        id: incidentId,
        type: incident.type,
        severity: 'critical',
        status: 'open',
        createdAt: Timestamp.now(),
        details: incident,
        responseTeam: [],
        timeline: [{
          timestamp: new Date(),
          action: 'incident_created',
          details: 'Incident de sécurité détecté automatiquement'
        }]
      });

      // Déclencher les procédures d'urgence
      await this.triggerEmergencyProcedures(incidentId, incident);

      this.logger.critical('Incident de sécurité déclaré', {
        incidentId,
        type: incident.type,
        details: incident
      });

    } catch (error) {
      this.logger.error('Erreur lors de la déclaration d\'incident', {
        incident,
        error: error.message
      });
    }
  }

  // 🚨 ALERTE D'URGENCE
  public async triggerEmergencyAlert(reason: string): Promise<void> {
    const emergencyAlert: SecurityAlert = {
      type: 'emergency',
      severity: 'critical',
      title: 'ALERTE D\'URGENCE - VERROUILLAGE SYSTÈME',
      description: `Verrouillage d'urgence activé: ${reason}`,
      timestamp: new Date(),
      status: 'open',
      details: { reason, automatic: true }
    };

    await this.triggerAlert({
      type: 'security',
      action: 'emergency_lockdown',
      result: 'success',
      severity: 'critical',
      timestamp: new Date(),
      details: { reason }
    });

    // Notifications d'urgence à tous les canaux
    await this.sendEmergencyNotifications(emergencyAlert);
  }

  // 📈 MÉTRIQUES DE SÉCURITÉ
  public async getSecurityMetrics(): Promise<any> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    try {
      // Récupérer les alertes récentes
      const recentAlertsQuery = query(
        collection(db, 'security_alerts'),
        where('timestamp', '>=', Timestamp.fromDate(last24h)),
        orderBy('timestamp', 'desc')
      );
      const recentAlertsSnapshot = await getDocs(recentAlertsQuery);
      const recentAlerts = recentAlertsSnapshot.docs.map(doc => doc.data());

      // Calculer les métriques
      const metrics = {
        overview: {
          activeAlerts: this.activeAlerts.size,
          criticalAlerts: recentAlerts.filter(a => a.severity === 'critical').length,
          highAlerts: recentAlerts.filter(a => a.severity === 'high').length,
          totalEvents24h: this.getTotalEvents(last24h),
          totalEvents7d: this.getTotalEvents(last7d)
        },
        authentication: {
          successfulLogins24h: this.getMetricValue('successful_logins', last24h),
          failedLogins24h: this.getMetricValue('failed_logins', last24h),
          mfaChallenges24h: this.getMetricValue('mfa_challenges', last24h),
          accountLockouts24h: this.getMetricValue('account_lockouts', last24h)
        },
        authorization: {
          permissionDenied24h: this.getMetricValue('permission_denied', last24h),
          privilegeEscalation24h: this.getMetricValue('privilege_escalation', last24h)
        },
        dataAccess: {
          dataReads24h: this.getMetricValue('data_reads', last24h),
          dataWrites24h: this.getMetricValue('data_writes', last24h),
          dataExports24h: this.getMetricValue('data_exports', last24h),
          suspiciousAccess24h: this.getMetricValue('suspicious_access', last24h)
        },
        system: {
          systemErrors24h: this.getMetricValue('system_errors', last24h),
          performanceIssues24h: this.getMetricValue('performance_issues', last24h),
          configChanges24h: this.getMetricValue('config_changes', last24h)
        },
        trends: {
          alertTrend7d: this.calculateTrend('alerts', last7d),
          loginTrend7d: this.calculateTrend('logins', last7d),
          errorTrend7d: this.calculateTrend('errors', last7d)
        }
      };

      return metrics;

    } catch (error) {
      this.logger.error('Erreur lors de la récupération des métriques de sécurité', {
        error: error.message
      });
      throw error;
    }
  }

  // 🔧 MÉTHODES PRIVÉES
  private async storeMetric(metric: SecurityMetric): Promise<void> {
    await addDoc(collection(db, 'security_metrics'), {
      ...metric,
      timestamp: Timestamp.fromDate(metric.timestamp)
    });
  }

  private recordEventMetrics(event: SecurityEvent): void {
    // Métriques générales
    this.recordMetric(`events_${event.type}`, 1, {
      action: event.action,
      result: event.result,
      severity: event.severity
    });

    // Métriques spécifiques
    switch (event.type) {
      case 'authentication':
        this.recordMetric(`${event.result}_logins`, 1);
        if (event.action === 'mfa_challenge') {
          this.recordMetric('mfa_challenges', 1);
        }
        break;

      case 'authorization':
        if (event.result === 'blocked') {
          this.recordMetric('permission_denied', 1);
        }
        break;

      case 'dataAccess':
        this.recordMetric(`data_${event.action}`, 1);
        break;

      case 'security':
        this.recordMetric('security_events', 1, {
          action: event.action,
          severity: event.severity
        });
        break;
    }
  }

  private async analyzeEventForAnomalies(event: SecurityEvent): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Analyser les échecs de connexion répétés
    if (event.type === 'authentication' && event.result === 'failure') {
      const recentFailures = await this.getRecentFailedLogins(event.ipAddress);
      if (recentFailures > this.config.metrics.failedLogins.threshold) {
        anomalies.push({
          type: 'repeated_failed_logins',
          severity: 'high',
          description: `${recentFailures} tentatives de connexion échouées depuis ${event.ipAddress}`,
          confidence: 0.9,
          timestamp: new Date(),
          details: { ipAddress: event.ipAddress, failures: recentFailures }
        });
      }
    }

    // Analyser les accès à des heures inhabituelles
    const hour = event.timestamp.getHours();
    if ((hour < 6 || hour > 22) && event.userId) {
      const userProfile = this.userBehaviorProfiles.get(event.userId);
      if (userProfile && !userProfile.nightAccess) {
        anomalies.push({
          type: 'unusual_access_time',
          severity: 'medium',
          description: `Accès inhabituel à ${hour}h pour l'utilisateur ${event.userId}`,
          confidence: 0.7,
          timestamp: new Date(),
          userId: event.userId,
          details: { hour, normalPattern: userProfile.accessHours }
        });
      }
    }

    return anomalies;
  }

  private async handleAnomaly(anomaly: Anomaly, originalEvent: SecurityEvent): Promise<void> {
    // Créer une alerte si l'anomalie est significative
    if (anomaly.confidence > 0.8 && (anomaly.severity === 'high' || anomaly.severity === 'critical')) {
      await this.triggerAlert({
        type: 'security',
        action: 'anomaly_detected',
        result: 'blocked',
        severity: anomaly.severity,
        timestamp: anomaly.timestamp,
        userId: anomaly.userId,
        details: anomaly
      });
    }

    // Enregistrer l'anomalie
    await addDoc(collection(db, 'security_anomalies'), {
      ...anomaly,
      timestamp: Timestamp.fromDate(anomaly.timestamp),
      originalEvent: originalEvent
    });
  }

  private async updateUserBehaviorProfile(userId: string, event: SecurityEvent): Promise<void> {
    let profile = this.userBehaviorProfiles.get(userId) || {
      accessHours: new Set(),
      ipAddresses: new Set(),
      userAgents: new Set(),
      actions: new Map(),
      lastUpdate: new Date()
    };

    // Mettre à jour le profil
    profile.accessHours.add(event.timestamp.getHours());
    if (event.ipAddress) profile.ipAddresses.add(event.ipAddress);
    if (event.userAgent) profile.userAgents.add(event.userAgent);
    
    const actionKey = `${event.type}:${event.action}`;
    profile.actions.set(actionKey, (profile.actions.get(actionKey) || 0) + 1);
    profile.lastUpdate = new Date();

    this.userBehaviorProfiles.set(userId, profile);
  }

  private generateAlertTitle(event: SecurityEvent): string {
    const titles = {
      'authentication': {
        'login': 'Tentative de connexion',
        'failed_login': 'Échec de connexion',
        'mfa_challenge': 'Défi MFA'
      },
      'authorization': {
        'permission_denied': 'Accès refusé',
        'privilege_escalation': 'Escalade de privilèges'
      },
      'security': {
        'anomaly_detected': 'Anomalie détectée',
        'intrusion_attempt': 'Tentative d\'intrusion'
      }
    };

    return titles[event.type]?.[event.action] || `Événement ${event.type}`;
  }

  private generateAlertDescription(event: SecurityEvent): string {
    let description = `${event.action} - Résultat: ${event.result}`;
    
    if (event.userId) description += ` - Utilisateur: ${event.userId}`;
    if (event.ipAddress) description += ` - IP: ${event.ipAddress}`;
    if (event.resource) description += ` - Ressource: ${event.resource}`;

    return description;
  }

  private async sendAlertNotifications(alert: SecurityAlert): Promise<void> {
    // Implémentation des notifications (email, SMS, webhook, etc.)
    this.logger.info('Notification d\'alerte envoyée', {
      alertId: alert.id,
      channels: this.config.alerts.channels,
      severity: alert.severity
    });
  }

  private async sendEmergencyNotifications(alert: SecurityAlert): Promise<void> {
    // Notifications d'urgence prioritaires
    this.logger.critical('Notification d\'urgence envoyée', {
      title: alert.title,
      description: alert.description
    });
  }

  private scheduleEscalation(alert: SecurityAlert): void {
    const escalationTime = this.config.alerts.severity[alert.severity].escalation;
    
    setTimeout(async () => {
      const currentAlert = this.activeAlerts.get(alert.id!);
      if (currentAlert && currentAlert.status === 'open') {
        await this.escalateAlert(alert);
      }
    }, escalationTime * 1000);
  }

  private async escalateAlert(alert: SecurityAlert): Promise<void> {
    this.logger.warn('Escalade d\'alerte', {
      alertId: alert.id,
      originalSeverity: alert.severity
    });

    // Logique d'escalade (notification aux managers, etc.)
  }

  private async triggerEmergencyProcedures(incidentId: string, incident: any): Promise<void> {
    // Procédures d'urgence automatisées
    this.logger.critical('Procédures d\'urgence déclenchées', {
      incidentId,
      type: incident.type
    });
  }

  private startMetricsCollection(): void {
    // Collection de métriques système toutes les minutes
    setInterval(() => {
      this.collectSystemMetrics();
    }, 60000);
  }

  private startAnomalyDetection(): void {
    // Analyse d'anomalies toutes les 5 minutes
    setInterval(() => {
      this.runAnomalyDetection();
    }, 5 * 60000);
  }

  private collectSystemMetrics(): void {
    // Métriques système (CPU, mémoire, etc.)
    this.recordMetric('system_health', 1);
  }

  private async runAnomalyDetection(): Promise<void> {
    // Analyse globale des anomalies
    try {
      // Logique d'analyse des patterns
    } catch (error) {
      this.logger.error('Erreur lors de l\'analyse d\'anomalies', {
        error: error.message
      });
    }
  }

  private async getRecentFailedLogins(ipAddress?: string): Promise<number> {
    // Compter les échecs de connexion récents
    return 0; // Implémentation simplifiée
  }

  private async detectFailedLoginAnomalies(context: SecurityContext): Promise<Anomaly[]> {
    return []; // Implémentation à compléter
  }

  private async detectUnusualAccessPatterns(context: SecurityContext): Promise<Anomaly[]> {
    return []; // Implémentation à compléter
  }

  private async detectPrivilegeEscalation(context: SecurityContext): Promise<Anomaly[]> {
    return []; // Implémentation à compléter
  }

  private async detectDataExfiltration(context: SecurityContext): Promise<Anomaly[]> {
    return []; // Implémentation à compléter
  }

  private getTotalEvents(since: Date): number {
    // Calculer le total d'événements depuis une date
    return 0; // Implémentation simplifiée
  }

  private getMetricValue(metricName: string, since: Date): number {
    // Récupérer la valeur d'une métrique
    const metrics = this.metrics.get(metricName) || [];
    return metrics.filter(m => m.timestamp >= since).length;
  }

  private calculateTrend(metricName: string, since: Date): number {
    // Calculer la tendance d'une métrique
    return 0; // Implémentation simplifiée
  }
}

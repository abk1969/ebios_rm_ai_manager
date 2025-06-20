/**
 * 🔒 SERVICE DE SÉCURITÉ PRINCIPAL
 * Orchestration de tous les composants de sécurité pour l'homologation ANSSI
 */

import { SECURITY_CONFIG, getSecurityConfig } from '@/config/security';
import { AuthenticationService } from './AuthenticationService';
import { AuthorizationService } from './AuthorizationService';
import { EncryptionService } from './EncryptionService';
import { AuditService } from './AuditService';
import { MonitoringService } from './MonitoringService';
import { ComplianceService } from './ComplianceService';
import { SecureLogger } from '@/services/logging/SecureLogger';

export interface SecurityContext {
  userId: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  mfaVerified: boolean;
}

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'dataAccess' | 'system' | 'security';
  action: string;
  userId?: string;
  sessionId?: string;
  resource?: string;
  result: 'success' | 'failure' | 'blocked';
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class SecurityService {
  private static instance: SecurityService;
  private config = getSecurityConfig(import.meta.env.MODE || 'development');
  private logger = SecureLogger.getInstance();
  
  private authService: AuthenticationService;
  private authzService: AuthorizationService;
  private encryptionService: EncryptionService;
  private auditService: AuditService;
  private monitoringService: MonitoringService;
  private complianceService: ComplianceService;

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private initializeServices(): void {
    try {
      this.authService = new AuthenticationService(this.config.auth);
      this.authzService = new AuthorizationService(this.config.rbac);
      this.encryptionService = new EncryptionService(this.config.encryption);
      this.auditService = new AuditService(this.config.audit);
      this.monitoringService = new MonitoringService(this.config.monitoring);
      this.complianceService = new ComplianceService(this.config.compliance);

      this.logger.info('🔒 Services de sécurité initialisés', {
        environment: import.meta.env.MODE,
        mfaEnabled: this.config.auth.mfaRequired,
        encryptionEnabled: true,
        auditEnabled: true
      });
    } catch (error) {
      this.logger.error('❌ Erreur initialisation services sécurité', {
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      throw error;
    }
  }

  // 🔐 AUTHENTIFICATION
  public async authenticate(credentials: any): Promise<SecurityContext> {
    const startTime = Date.now();
    
    try {
      const authResult = await this.authService.authenticate(credentials);
      
      const context: SecurityContext = {
        userId: authResult.userId,
        sessionId: authResult.sessionId,
        roles: authResult.roles,
        permissions: await this.authzService.getUserPermissions(authResult.userId),
        ipAddress: credentials.ipAddress,
        userAgent: credentials.userAgent,
        timestamp: new Date(),
        mfaVerified: authResult.mfaVerified
      };

      await this.logSecurityEvent({
        type: 'authentication',
        action: 'login',
        userId: context.userId,
        sessionId: context.sessionId,
        result: 'success',
        severity: 'low',
        timestamp: new Date(),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });

      return context;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'authentication',
        action: 'login',
        result: 'failure',
        severity: 'medium',
        timestamp: new Date(),
        ipAddress: credentials.ipAddress,
        userAgent: credentials.userAgent,
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });

      throw error;
    } finally {
      this.monitoringService.recordMetric('auth_duration', Date.now() - startTime);
    }
  }

  // 🛡️ AUTORISATION
  public async authorize(context: SecurityContext, resource: string, action: string): Promise<boolean> {
    try {
      const permission = `${resource}:${action}`;
      const authorized = await this.authzService.hasPermission(context.userId, permission, context);

      await this.logSecurityEvent({
        type: 'authorization',
        action: `${action}_${resource}`,
        userId: context.userId,
        sessionId: context.sessionId,
        resource,
        result: authorized ? 'success' : 'blocked',
        severity: authorized ? 'low' : 'medium',
        timestamp: new Date(),
        ipAddress: context.ipAddress
      });

      return authorized;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'authorization',
        action: `${action}_${resource}`,
        userId: context.userId,
        sessionId: context.sessionId,
        resource,
        result: 'failure',
        severity: 'high',
        timestamp: new Date(),
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });

      return false;
    }
  }

  // 🔒 CHIFFREMENT
  public async encryptSensitiveData(data: any, context: SecurityContext): Promise<string> {
    try {
      const encrypted = await this.encryptionService.encrypt(data, context.userId);
      
      await this.logSecurityEvent({
        type: 'dataAccess',
        action: 'encrypt',
        userId: context.userId,
        sessionId: context.sessionId,
        result: 'success',
        severity: 'low',
        timestamp: new Date()
      });

      return encrypted;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'security',
        action: 'encryption_failure',
        userId: context.userId,
        sessionId: context.sessionId,
        result: 'failure',
        severity: 'high',
        timestamp: new Date(),
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });

      throw error;
    }
  }

  public async decryptSensitiveData(encryptedData: string, context: SecurityContext): Promise<any> {
    try {
      const decrypted = await this.encryptionService.decrypt(encryptedData, context.userId);
      
      await this.logSecurityEvent({
        type: 'dataAccess',
        action: 'decrypt',
        userId: context.userId,
        sessionId: context.sessionId,
        result: 'success',
        severity: 'low',
        timestamp: new Date()
      });

      return decrypted;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'security',
        action: 'decryption_failure',
        userId: context.userId,
        sessionId: context.sessionId,
        result: 'failure',
        severity: 'high',
        timestamp: new Date(),
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });

      throw error;
    }
  }

  // 📊 AUDIT ET TRAÇABILITÉ
  public async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await this.auditService.logEvent(event);
      await this.monitoringService.processSecurityEvent(event);
      
      // Alertes en temps réel pour les événements critiques
      if (event.severity === 'critical' || event.severity === 'high') {
        await this.monitoringService.triggerAlert(event);
      }
    } catch (error) {
      this.logger.error('Erreur lors de l\'enregistrement de l\'événement de sécurité', {
        event,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // 🔍 DÉTECTION D'ANOMALIES
  public async detectAnomalies(context: SecurityContext): Promise<void> {
    const anomalies = await this.monitoringService.detectAnomalies(context);
    
    for (const anomaly of anomalies) {
      await this.logSecurityEvent({
        type: 'security',
        action: 'anomaly_detected',
        userId: context.userId,
        sessionId: context.sessionId,
        result: 'blocked',
        severity: anomaly.severity,
        timestamp: new Date(),
        details: anomaly
      });
    }
  }

  // 📋 VALIDATION DE CONFORMITÉ
  public async validateCompliance(): Promise<any> {
    return await this.complianceService.validateCompliance();
  }

  // 🔧 CONFIGURATION DE SÉCURITÉ
  public getSecurityConfig(): any {
    return {
      ...this.config,
      // Masquer les informations sensibles
      encryption: {
        ...this.config.encryption,
        keys: '***'
      }
    };
  }

  // 🚨 GESTION DES INCIDENTS
  public async handleSecurityIncident(incident: any, context: SecurityContext): Promise<void> {
    await this.logSecurityEvent({
      type: 'security',
      action: 'incident_detected',
      userId: context.userId,
      sessionId: context.sessionId,
      result: 'blocked',
      severity: 'critical',
      timestamp: new Date(),
      details: incident
    });

    // Déclencher les procédures d'incident
    await this.monitoringService.triggerIncidentResponse(incident);
  }

  // 🔄 ROTATION DES CLÉS
  public async rotateKeys(): Promise<void> {
    try {
      await this.encryptionService.rotateKeys();
      
      await this.logSecurityEvent({
        type: 'system',
        action: 'key_rotation',
        result: 'success',
        severity: 'medium',
        timestamp: new Date()
      });
    } catch (error) {
      await this.logSecurityEvent({
        type: 'system',
        action: 'key_rotation',
        result: 'failure',
        severity: 'high',
        timestamp: new Date(),
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });

      throw error;
    }
  }

  // 🧹 NETTOYAGE DES SESSIONS
  public async cleanupExpiredSessions(): Promise<void> {
    const cleaned = await this.authService.cleanupExpiredSessions();
    
    await this.logSecurityEvent({
      type: 'system',
      action: 'session_cleanup',
      result: 'success',
      severity: 'low',
      timestamp: new Date(),
      details: { cleanedSessions: cleaned }
    });
  }

  // 📊 MÉTRIQUES DE SÉCURITÉ
  public async getSecurityMetrics(): Promise<any> {
    return await this.monitoringService.getSecurityMetrics();
  }

  // 🔒 VERROUILLAGE D'URGENCE
  public async emergencyLockdown(reason: string, context: SecurityContext): Promise<void> {
    await this.logSecurityEvent({
      type: 'security',
      action: 'emergency_lockdown',
      userId: context.userId,
      sessionId: context.sessionId,
      result: 'success',
      severity: 'critical',
      timestamp: new Date(),
      details: { reason }
    });

    // Implémenter les mesures de verrouillage
    await this.authService.lockdownSystem();
    await this.monitoringService.triggerEmergencyAlert(reason);
  }
}

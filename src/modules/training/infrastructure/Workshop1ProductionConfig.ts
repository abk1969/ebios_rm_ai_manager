/**
 * ⚙️ CONFIGURATION PRODUCTION WORKSHOP 1
 * Configuration optimisée pour l'environnement de production
 * POINT 5 - Déploiement et Intégration Production
 */

import { ProductionIntegrationConfig } from './Workshop1ProductionIntegration';

// 🎯 TYPES POUR LA CONFIGURATION

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'staging' | 'production';
  WORKSHOP1_ENABLE_MONITORING: string;
  WORKSHOP1_ENABLE_A2A: string;
  WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS: string;
  WORKSHOP1_ENABLE_PERFORMANCE_TRACKING: string;
  WORKSHOP1_ENABLE_ERROR_REPORTING: string;
  WORKSHOP1_MAX_CONCURRENT_SESSIONS: string;
  WORKSHOP1_SESSION_TIMEOUT_MS: string;
  WORKSHOP1_NOTIFICATION_RETENTION_DAYS: string;
  WORKSHOP1_METRICS_RETENTION_DAYS: string;
  WORKSHOP1_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  WORKSHOP1_FIREBASE_PROJECT_ID: string;
  WORKSHOP1_FIREBASE_API_KEY: string;
  WORKSHOP1_SENTRY_DSN?: string;
  WORKSHOP1_MONITORING_ENDPOINT?: string;
}

export interface SecurityConfig {
  enableEncryption: boolean;
  enableAuthentication: boolean;
  enableRateLimit: boolean;
  rateLimitRequests: number;
  rateLimitWindow: number; // en minutes
  enableCORS: boolean;
  allowedOrigins: string[];
  enableCSP: boolean;
  enableHSTS: boolean;
}

export interface PerformanceConfig {
  enableCaching: boolean;
  cacheMaxAge: number; // en secondes
  enableCompression: boolean;
  compressionLevel: number;
  enableLazyLoading: boolean;
  maxMemoryUsage: number; // en MB
  maxCpuUsage: number; // en pourcentage
  enableResourceOptimization: boolean;
}

export interface MonitoringConfig {
  enableHealthChecks: boolean;
  healthCheckInterval: number; // en ms
  enableMetricsCollection: boolean;
  metricsCollectionInterval: number; // en ms
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserAnalytics: boolean;
  enableSystemMetrics: boolean;
  alertThresholds: {
    errorRate: number; // pourcentage
    responseTime: number; // ms
    memoryUsage: number; // pourcentage
    cpuUsage: number; // pourcentage
  };
}

// ⚙️ CLASSE DE CONFIGURATION PRODUCTION

export class Workshop1ProductionConfig {
  private static instance: Workshop1ProductionConfig;
  private environmentConfig: EnvironmentConfig;
  private securityConfig: SecurityConfig;
  private performanceConfig: PerformanceConfig;
  private monitoringConfig: MonitoringConfig;

  private constructor() {
    this.environmentConfig = this.loadEnvironmentConfig();
    this.securityConfig = this.loadSecurityConfig();
    this.performanceConfig = this.loadPerformanceConfig();
    this.monitoringConfig = this.loadMonitoringConfig();
  }

  public static getInstance(): Workshop1ProductionConfig {
    if (!Workshop1ProductionConfig.instance) {
      Workshop1ProductionConfig.instance = new Workshop1ProductionConfig();
    }
    return Workshop1ProductionConfig.instance;
  }

  // 🌍 CHARGEMENT DE LA CONFIGURATION ENVIRONNEMENT

  private loadEnvironmentConfig(): EnvironmentConfig {
    return {
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      WORKSHOP1_ENABLE_MONITORING: process.env.WORKSHOP1_ENABLE_MONITORING || 'true',
      WORKSHOP1_ENABLE_A2A: process.env.WORKSHOP1_ENABLE_A2A || 'true',
      WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS: process.env.WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS || 'true',
      WORKSHOP1_ENABLE_PERFORMANCE_TRACKING: process.env.WORKSHOP1_ENABLE_PERFORMANCE_TRACKING || 'true',
      WORKSHOP1_ENABLE_ERROR_REPORTING: process.env.WORKSHOP1_ENABLE_ERROR_REPORTING || 'true',
      WORKSHOP1_MAX_CONCURRENT_SESSIONS: process.env.WORKSHOP1_MAX_CONCURRENT_SESSIONS || '100',
      WORKSHOP1_SESSION_TIMEOUT_MS: process.env.WORKSHOP1_SESSION_TIMEOUT_MS || '3600000', // 1 heure
      WORKSHOP1_NOTIFICATION_RETENTION_DAYS: process.env.WORKSHOP1_NOTIFICATION_RETENTION_DAYS || '30',
      WORKSHOP1_METRICS_RETENTION_DAYS: process.env.WORKSHOP1_METRICS_RETENTION_DAYS || '90',
      WORKSHOP1_LOG_LEVEL: (process.env.WORKSHOP1_LOG_LEVEL as any) || 'info',
      WORKSHOP1_FIREBASE_PROJECT_ID: process.env.WORKSHOP1_FIREBASE_PROJECT_ID || 'ebiosdatabase',
      WORKSHOP1_FIREBASE_API_KEY: process.env.WORKSHOP1_FIREBASE_API_KEY || 'AIzaSyCN4GaNMnshiDw0Z0dgGnhmgbokVyd7LmA',
      WORKSHOP1_SENTRY_DSN: process.env.WORKSHOP1_SENTRY_DSN,
      WORKSHOP1_MONITORING_ENDPOINT: process.env.WORKSHOP1_MONITORING_ENDPOINT
    };
  }

  // 🔒 CONFIGURATION DE SÉCURITÉ

  private loadSecurityConfig(): SecurityConfig {
    const isProduction = this.environmentConfig.NODE_ENV === 'production';
    
    return {
      enableEncryption: isProduction,
      enableAuthentication: true,
      enableRateLimit: isProduction,
      rateLimitRequests: isProduction ? 100 : 1000, // requêtes par fenêtre
      rateLimitWindow: 15, // 15 minutes
      enableCORS: true,
      allowedOrigins: isProduction 
        ? ['https://ebios-ai-manager.web.app', 'https://ebios-ai-manager.firebaseapp.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
      enableCSP: isProduction,
      enableHSTS: isProduction
    };
  }

  // ⚡ CONFIGURATION DE PERFORMANCE

  private loadPerformanceConfig(): PerformanceConfig {
    const isProduction = this.environmentConfig.NODE_ENV === 'production';
    
    return {
      enableCaching: isProduction,
      cacheMaxAge: isProduction ? 3600 : 300, // 1 heure en prod, 5 min en dev
      enableCompression: isProduction,
      compressionLevel: 6, // Niveau de compression gzip
      enableLazyLoading: true,
      maxMemoryUsage: isProduction ? 512 : 1024, // MB
      maxCpuUsage: isProduction ? 80 : 90, // pourcentage
      enableResourceOptimization: isProduction
    };
  }

  // 📊 CONFIGURATION DU MONITORING

  private loadMonitoringConfig(): MonitoringConfig {
    const isProduction = this.environmentConfig.NODE_ENV === 'production';
    
    return {
      enableHealthChecks: true,
      healthCheckInterval: isProduction ? 60000 : 30000, // 1 min en prod, 30s en dev
      enableMetricsCollection: this.environmentConfig.WORKSHOP1_ENABLE_PERFORMANCE_TRACKING === 'true',
      metricsCollectionInterval: 30000, // 30 secondes
      enableErrorTracking: this.environmentConfig.WORKSHOP1_ENABLE_ERROR_REPORTING === 'true',
      enablePerformanceMonitoring: isProduction,
      enableUserAnalytics: isProduction,
      enableSystemMetrics: true,
      alertThresholds: {
        errorRate: isProduction ? 5 : 10, // pourcentage
        responseTime: isProduction ? 2000 : 5000, // ms
        memoryUsage: isProduction ? 80 : 90, // pourcentage
        cpuUsage: isProduction ? 70 : 85 // pourcentage
      }
    };
  }

  // 🎯 CONFIGURATION PRINCIPALE

  public static getProductionConfig(): ProductionIntegrationConfig {
    const instance = Workshop1ProductionConfig.getInstance();
    const env = instance.environmentConfig;
    
    return {
      environment: env.NODE_ENV,
      enableMonitoring: env.WORKSHOP1_ENABLE_MONITORING === 'true',
      enableA2AProtocol: env.WORKSHOP1_ENABLE_A2A === 'true',
      enableExpertNotifications: env.WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS === 'true',
      enablePerformanceTracking: env.WORKSHOP1_ENABLE_PERFORMANCE_TRACKING === 'true',
      enableErrorReporting: env.WORKSHOP1_ENABLE_ERROR_REPORTING === 'true',
      maxConcurrentSessions: parseInt(env.WORKSHOP1_MAX_CONCURRENT_SESSIONS),
      sessionTimeoutMs: parseInt(env.WORKSHOP1_SESSION_TIMEOUT_MS),
      notificationRetentionDays: parseInt(env.WORKSHOP1_NOTIFICATION_RETENTION_DAYS),
      metricsRetentionDays: parseInt(env.WORKSHOP1_METRICS_RETENTION_DAYS)
    };
  }

  // 🔒 CONFIGURATION DE SÉCURITÉ

  public getSecurityConfig(): SecurityConfig {
    return { ...this.securityConfig };
  }

  // ⚡ CONFIGURATION DE PERFORMANCE

  public getPerformanceConfig(): PerformanceConfig {
    return { ...this.performanceConfig };
  }

  // 📊 CONFIGURATION DU MONITORING

  public getMonitoringConfig(): MonitoringConfig {
    return { ...this.monitoringConfig };
  }

  // 🌍 CONFIGURATION ENVIRONNEMENT

  public getEnvironmentConfig(): EnvironmentConfig {
    return { ...this.environmentConfig };
  }

  // 🔧 CONFIGURATION FIREBASE

  public getFirebaseConfig() {
    return {
      apiKey: this.environmentConfig.WORKSHOP1_FIREBASE_API_KEY,
      authDomain: `${this.environmentConfig.WORKSHOP1_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: this.environmentConfig.WORKSHOP1_FIREBASE_PROJECT_ID,
      storageBucket: `${this.environmentConfig.WORKSHOP1_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: "123456789", // À configurer selon le projet
      appId: "1:123456789:web:abcdef123456789" // À configurer selon le projet
    };
  }

  // 📊 CONFIGURATION DES MÉTRIQUES

  public getMetricsConfig() {
    return {
      enableCollection: this.monitoringConfig.enableMetricsCollection,
      collectionInterval: this.monitoringConfig.metricsCollectionInterval,
      retentionDays: parseInt(this.environmentConfig.WORKSHOP1_METRICS_RETENTION_DAYS),
      enableDetailedMetrics: this.environmentConfig.NODE_ENV !== 'production',
      enableUserMetrics: this.monitoringConfig.enableUserAnalytics,
      enableSystemMetrics: this.monitoringConfig.enableSystemMetrics,
      alertThresholds: this.monitoringConfig.alertThresholds
    };
  }

  // 🚨 CONFIGURATION DES ALERTES

  public getAlertConfig() {
    const isProduction = this.environmentConfig.NODE_ENV === 'production';
    
    return {
      enableAlerts: isProduction,
      enableEmailAlerts: isProduction,
      enableSlackAlerts: isProduction,
      enableSMSAlerts: false, // Désactivé par défaut
      alertChannels: {
        email: process.env.WORKSHOP1_ALERT_EMAIL || 'admin@ebios-ai-manager.com',
        slack: process.env.WORKSHOP1_SLACK_WEBHOOK,
        sms: process.env.WORKSHOP1_SMS_ENDPOINT
      },
      alertRules: [
        {
          name: 'High Error Rate',
          condition: 'errorRate > 5',
          severity: 'critical',
          enabled: true
        },
        {
          name: 'Slow Response Time',
          condition: 'responseTime > 2000',
          severity: 'warning',
          enabled: true
        },
        {
          name: 'High Memory Usage',
          condition: 'memoryUsage > 80',
          severity: 'warning',
          enabled: true
        },
        {
          name: 'Service Down',
          condition: 'serviceStatus = critical',
          severity: 'critical',
          enabled: true
        }
      ]
    };
  }

  // 🔄 CONFIGURATION DU CACHE

  public getCacheConfig() {
    return {
      enableCaching: this.performanceConfig.enableCaching,
      cacheProvider: 'memory', // ou 'redis' en production
      maxAge: this.performanceConfig.cacheMaxAge,
      maxSize: '100MB',
      enableCompression: this.performanceConfig.enableCompression,
      cacheStrategies: {
        userProfiles: { ttl: 3600, maxSize: '10MB' }, // 1 heure
        expertiseAnalysis: { ttl: 1800, maxSize: '5MB' }, // 30 minutes
        notifications: { ttl: 300, maxSize: '20MB' }, // 5 minutes
        metrics: { ttl: 60, maxSize: '50MB' } // 1 minute
      }
    };
  }

  // 📝 CONFIGURATION DES LOGS

  public getLoggingConfig() {
    return {
      level: this.environmentConfig.WORKSHOP1_LOG_LEVEL,
      enableFileLogging: this.environmentConfig.NODE_ENV === 'production',
      enableConsoleLogging: true,
      enableStructuredLogging: true,
      logFormat: this.environmentConfig.NODE_ENV === 'production' ? 'json' : 'pretty',
      logRotation: {
        enabled: true,
        maxFiles: 10,
        maxSize: '10MB',
        datePattern: 'YYYY-MM-DD'
      },
      logLevels: {
        error: true,
        warn: true,
        info: this.environmentConfig.WORKSHOP1_LOG_LEVEL !== 'error',
        debug: this.environmentConfig.WORKSHOP1_LOG_LEVEL === 'debug'
      }
    };
  }

  // ✅ VALIDATION DE LA CONFIGURATION

  public validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation des variables d'environnement requises
    const requiredEnvVars = [
      'WORKSHOP1_FIREBASE_PROJECT_ID',
      'WORKSHOP1_FIREBASE_API_KEY'
    ];

    for (const envVar of requiredEnvVars) {
      if (!this.environmentConfig[envVar as keyof EnvironmentConfig]) {
        errors.push(`Variable d'environnement manquante: ${envVar}`);
      }
    }

    // Validation des valeurs numériques
    const numericConfigs = [
      { key: 'WORKSHOP1_MAX_CONCURRENT_SESSIONS', min: 1, max: 1000 },
      { key: 'WORKSHOP1_SESSION_TIMEOUT_MS', min: 60000, max: 86400000 }, // 1 min à 24h
      { key: 'WORKSHOP1_NOTIFICATION_RETENTION_DAYS', min: 1, max: 365 },
      { key: 'WORKSHOP1_METRICS_RETENTION_DAYS', min: 1, max: 365 }
    ];

    for (const config of numericConfigs) {
      const value = parseInt(this.environmentConfig[config.key as keyof EnvironmentConfig]);
      if (isNaN(value) || value < config.min || value > config.max) {
        errors.push(`Configuration invalide ${config.key}: doit être entre ${config.min} et ${config.max}`);
      }
    }

    // Validation de l'environnement
    if (!['development', 'staging', 'production'].includes(this.environmentConfig.NODE_ENV)) {
      errors.push('NODE_ENV doit être development, staging ou production');
    }

    // Validation de la sécurité en production
    if (this.environmentConfig.NODE_ENV === 'production') {
      if (!this.securityConfig.enableEncryption) {
        errors.push('Le chiffrement doit être activé en production');
      }
      if (!this.securityConfig.enableAuthentication) {
        errors.push('L\'authentification doit être activée en production');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 📊 RÉSUMÉ DE LA CONFIGURATION

  public getConfigurationSummary() {
    return {
      environment: this.environmentConfig.NODE_ENV,
      features: {
        monitoring: this.environmentConfig.WORKSHOP1_ENABLE_MONITORING === 'true',
        a2aProtocol: this.environmentConfig.WORKSHOP1_ENABLE_A2A === 'true',
        expertNotifications: this.environmentConfig.WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS === 'true',
        performanceTracking: this.environmentConfig.WORKSHOP1_ENABLE_PERFORMANCE_TRACKING === 'true',
        errorReporting: this.environmentConfig.WORKSHOP1_ENABLE_ERROR_REPORTING === 'true'
      },
      limits: {
        maxConcurrentSessions: parseInt(this.environmentConfig.WORKSHOP1_MAX_CONCURRENT_SESSIONS),
        sessionTimeoutMs: parseInt(this.environmentConfig.WORKSHOP1_SESSION_TIMEOUT_MS),
        notificationRetentionDays: parseInt(this.environmentConfig.WORKSHOP1_NOTIFICATION_RETENTION_DAYS),
        metricsRetentionDays: parseInt(this.environmentConfig.WORKSHOP1_METRICS_RETENTION_DAYS)
      },
      security: {
        encryption: this.securityConfig.enableEncryption,
        authentication: this.securityConfig.enableAuthentication,
        rateLimit: this.securityConfig.enableRateLimit,
        cors: this.securityConfig.enableCORS
      },
      performance: {
        caching: this.performanceConfig.enableCaching,
        compression: this.performanceConfig.enableCompression,
        lazyLoading: this.performanceConfig.enableLazyLoading,
        resourceOptimization: this.performanceConfig.enableResourceOptimization
      },
      monitoring: {
        healthChecks: this.monitoringConfig.enableHealthChecks,
        metricsCollection: this.monitoringConfig.enableMetricsCollection,
        errorTracking: this.monitoringConfig.enableErrorTracking,
        userAnalytics: this.monitoringConfig.enableUserAnalytics
      }
    };
  }
}

export default Workshop1ProductionConfig;

/**
 * Service d'intégration avec Google Cloud Platform Cloud Logging
 * Pour le logging distant sécurisé en production
 */

import { logger, LogLevel, LogEntry } from '../logging/SecureLogger';

export interface GCPLoggingConfig {
  projectId: string;
  logName: string;
  apiKey?: string;
  serviceAccountKey?: string;
  environment: 'development' | 'staging' | 'production';
  enableBatching: boolean;
  batchSize: number;
  flushInterval: number; // en millisecondes
}

export interface GCPLogEntry {
  timestamp: string;
  severity: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  resource: {
    type: string;
    labels: Record<string, string>;
  };
  labels: Record<string, string>;
  jsonPayload: Record<string, any>;
  sourceLocation?: {
    file: string;
    line: number;
    function: string;
  };
}

/**
 * Service Cloud Logging GCP
 */
export class CloudLoggingService {
  private static instance: CloudLoggingService;
  private config: GCPLoggingConfig;
  private logBuffer: GCPLogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private isEnabled: boolean = false;

  private constructor() {
    this.config = {
      projectId: import.meta.env.VITE_GCP_PROJECT_ID || '',
      logName: import.meta.env.VITE_GCP_LOG_NAME || 'ebios-ai-manager',
      apiKey: import.meta.env.VITE_GCP_API_KEY,
      environment: (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development',
      enableBatching: true,
      batchSize: 10,
      flushInterval: 30000 // 30 secondes
    };

    this.isEnabled = this.config.projectId !== '' && import.meta.env.PROD;
    
    if (this.isEnabled) {
      this.startFlushTimer();
    }
  }

  public static getInstance(): CloudLoggingService {
    if (!CloudLoggingService.instance) {
      CloudLoggingService.instance = new CloudLoggingService();
    }
    return CloudLoggingService.instance;
  }

  /**
   * Configure le service avec les paramètres GCP
   */
  public configure(config: Partial<GCPLoggingConfig>): void {
    this.config = { ...this.config, ...config };
    this.isEnabled = this.config.projectId !== '' && process.env.NODE_ENV === 'production';
    
    if (this.isEnabled && !this.flushTimer) {
      this.startFlushTimer();
    }
    
    logger.info('GCP Cloud Logging configured', { 
      projectId: this.config.projectId,
      logName: this.config.logName,
      enabled: this.isEnabled 
    }, 'CloudLoggingService');
  }

  /**
   * Envoie un log vers GCP Cloud Logging
   */
  public async sendLog(entry: LogEntry): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const gcpEntry = this.convertToGCPFormat(entry);
      
      if (this.config.enableBatching) {
        this.addToBatch(gcpEntry);
      } else {
        await this.sendToGCP([gcpEntry]);
      }
    } catch (error) {
      // En cas d'erreur, log localement seulement
      logger.error('Failed to send log to GCP', error, 'CloudLoggingService');
    }
  }

  /**
   * Convertit un LogEntry vers le format GCP
   */
  private convertToGCPFormat(entry: LogEntry): GCPLogEntry {
    return {
      timestamp: entry.timestamp,
      severity: this.mapLogLevelToGCPSeverity(entry.level),
      message: entry.message,
      resource: {
        type: 'global',
        labels: {
          project_id: this.config.projectId
        }
      },
      labels: {
        environment: this.config.environment,
        application: 'ebios-ai-manager',
        workshop: entry.context || 'unknown',
        session_id: entry.sessionId || '',
        user_id: entry.userId || 'anonymous',
        source: entry.source
      },
      jsonPayload: {
        data: entry.data,
        context: entry.context,
        level: LogLevel[entry.level]
      }
    };
  }

  /**
   * Mappe les niveaux de log vers les sévérités GCP
   */
  private mapLogLevelToGCPSeverity(level: LogLevel): GCPLogEntry['severity'] {
    switch (level) {
      case LogLevel.DEBUG: return 'DEBUG';
      case LogLevel.INFO: return 'INFO';
      case LogLevel.WARN: return 'WARNING';
      case LogLevel.ERROR: return 'ERROR';
      case LogLevel.CRITICAL: return 'CRITICAL';
      default: return 'INFO';
    }
  }

  /**
   * Ajoute un log au batch
   */
  private addToBatch(entry: GCPLogEntry): void {
    this.logBuffer.push(entry);
    
    if (this.logBuffer.length >= this.config.batchSize) {
      this.flushLogs();
    }
  }

  /**
   * Envoie les logs vers GCP Cloud Logging API
   */
  private async sendToGCP(entries: GCPLogEntry[]): Promise<void> {
    if (!this.config.projectId || !this.config.apiKey) {
      throw new Error('GCP configuration incomplete');
    }

    const url = `https://logging.googleapis.com/v2/entries:write?key=${this.config.apiKey}`;
    
    const payload = {
      entries: entries.map(entry => ({
        ...entry,
        logName: `projects/${this.config.projectId}/logs/${this.config.logName}`
      }))
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`GCP Logging API error: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Force l'envoi de tous les logs en attente
   */
  public async flushLogs(): Promise<void> {
    if (!this.isEnabled || this.logBuffer.length === 0) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this.sendToGCP(logsToSend);
      logger.debug(`Flushed ${logsToSend.length} logs to GCP`, undefined, 'CloudLoggingService');
    } catch (error) {
      // Remettre les logs dans le buffer en cas d'échec
      this.logBuffer = [...logsToSend, ...this.logBuffer];
      throw error;
    }
  }

  /**
   * Démarre le timer de flush automatique
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flushLogs().catch(error => {
          logger.error('Auto-flush to GCP failed', error, 'CloudLoggingService');
        });
      }
    }, this.config.flushInterval);
  }

  /**
   * Arrête le service et flush les logs restants
   */
  public async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    if (this.logBuffer.length > 0) {
      await this.flushLogs();
    }

    logger.info('GCP Cloud Logging service shutdown', undefined, 'CloudLoggingService');
  }

  /**
   * Teste la connexion à GCP
   */
  public async testConnection(): Promise<boolean> {
    if (!this.isEnabled) {
      logger.warn('GCP Cloud Logging not enabled', undefined, 'CloudLoggingService');
      return false;
    }

    try {
      const testEntry: GCPLogEntry = {
        timestamp: new Date().toISOString(),
        severity: 'INFO',
        message: 'GCP Cloud Logging connection test',
        resource: {
          type: 'global',
          labels: {
            project_id: this.config.projectId
          }
        },
        labels: {
          environment: this.config.environment,
          application: 'ebios-ai-manager',
          test: 'connection'
        },
        jsonPayload: {
          test: true,
          timestamp: Date.now()
        }
      };

      await this.sendToGCP([testEntry]);
      logger.info('GCP Cloud Logging connection test successful', undefined, 'CloudLoggingService');
      return true;
    } catch (error) {
      logger.error('GCP Cloud Logging connection test failed', error, 'CloudLoggingService');
      return false;
    }
  }

  /**
   * Récupère les statistiques du service
   */
  public getStats(): {
    enabled: boolean;
    bufferSize: number;
    config: GCPLoggingConfig;
  } {
    return {
      enabled: this.isEnabled,
      bufferSize: this.logBuffer.length,
      config: { ...this.config, apiKey: this.config.apiKey ? '***' : undefined }
    };
  }
}

// Instance globale
export const cloudLoggingService = CloudLoggingService.getInstance();

// Hook pour intégrer avec SecureLogger
export const initializeGCPLogging = (config?: Partial<GCPLoggingConfig>) => {
  if (config) {
    cloudLoggingService.configure(config);
  }

  // Tester la connexion au démarrage
  if (process.env.NODE_ENV === 'production') {
    cloudLoggingService.testConnection().then(success => {
      if (success) {
        logger.info('GCP Cloud Logging initialized successfully', undefined, 'CloudLoggingService');
      } else {
        logger.warn('GCP Cloud Logging initialization failed', undefined, 'CloudLoggingService');
      }
    });
  }

  // Cleanup au déchargement de la page
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      cloudLoggingService.shutdown();
    });
  }
};

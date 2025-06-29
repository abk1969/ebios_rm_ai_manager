/**
 * Service de logging sécurisé pour remplacer console.log en production
 * Conforme aux recommandations de l'audit de sécurité
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  source: string;
}

export interface LoggerConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  minLevel: LogLevel;
  maxEntries: number;
  sensitiveFields: string[];
  remoteEndpoint?: string;
}

/**
 * Service de logging sécurisé
 */
export class SecureLogger {
  private static instance: SecureLogger;
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      enableConsole: import.meta.env.DEV,
      enableRemote: import.meta.env.PROD,
      minLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.ERROR,
      maxEntries: 1000,
      sensitiveFields: [
        'password', 'token', 'apiKey', 'secret', 'credential',
        'email', 'phone', 'ssn', 'creditCard', 'personalData'
      ],
      remoteEndpoint: import.meta.env.VITE_LOG_ENDPOINT
    };
  }

  public static getInstance(): SecureLogger {
    if (!SecureLogger.instance) {
      SecureLogger.instance = new SecureLogger();
    }
    return SecureLogger.instance;
  }

  /**
   * Log de débogage (développement uniquement)
   */
  public debug(message: string, data?: any, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Log d'information
   */
  public info(message: string, data?: any, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log d'avertissement
   */
  public warn(message: string, data?: any, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log d'erreur
   */
  public error(message: string, error?: Error | any, context?: string): void {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: import.meta.env.DEV ? error.stack : undefined
    } : error;

    this.log(LogLevel.ERROR, message, errorData, context);
  }

  /**
   * Log critique (sécurité, corruption de données)
   */
  public critical(message: string, data?: any, context?: string): void {
    this.log(LogLevel.CRITICAL, message, data, context);
    
    // En cas de log critique, forcer l'envoi immédiat
    if (this.config.enableRemote) {
      this.flushLogs();
    }
  }

  /**
   * Log principal avec filtrage et sécurisation
   */
  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    // Vérifier le niveau minimum
    if (level < this.config.minLevel) {
      return;
    }

    // Créer l'entrée de log
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: this.sanitizeMessage(message),
      context,
      data: this.sanitizeData(data),
      sessionId: this.sessionId,
      source: this.getSource()
    };

    // Ajouter au buffer
    this.addToBuffer(entry);

    // Log console en développement
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Envoyer en remote si configuré
    if (this.config.enableRemote && level >= LogLevel.WARN) {
      this.sendToRemote(entry);
    }
  }

  /**
   * Sanitise le message pour éviter les fuites de données sensibles
   */
  private sanitizeMessage(message: string): string {
    let sanitized = message;
    
    // Masquer les données sensibles communes
    sanitized = sanitized.replace(/password[=:]\s*\S+/gi, 'password=***');
    sanitized = sanitized.replace(/token[=:]\s*\S+/gi, 'token=***');
    sanitized = sanitized.replace(/api[_-]?key[=:]\s*\S+/gi, 'apiKey=***');
    sanitized = sanitized.replace(/secret[=:]\s*\S+/gi, 'secret=***');
    
    // Masquer les emails
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***@***.***');
    
    return sanitized;
  }

  /**
   * Sanitise les données pour éviter les fuites
   */
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    if (typeof data === 'string') {
      return this.sanitizeMessage(data);
    }
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      
      // Masquer les champs sensibles
      this.config.sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '***';
        }
      });
      
      // Récursion pour les objets imbriqués (limitée)
      Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
          sanitized[key] = this.sanitizeData(sanitized[key]);
        }
      });
      
      return sanitized;
    }
    
    return data;
  }

  /**
   * Ajoute une entrée au buffer avec rotation
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    // Rotation du buffer si trop plein
    if (this.logBuffer.length > this.config.maxEntries) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxEntries);
    }
  }

  /**
   * Log vers la console (développement)
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${LogLevel[entry.level]}]`;
    const message = entry.context ? `${prefix} [${entry.context}] ${entry.message}` : `${prefix} ${entry.message}`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.data);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(message, entry.data);
        break;
    }
  }

  /**
   * Envoie vers un service de logging distant
   */
  private async sendToRemote(entry: LogEntry): Promise<void> {
    // Essayer d'abord GCP Cloud Logging si disponible
    try {
      const { cloudLoggingService } = await import('../gcp/CloudLoggingService');
      await cloudLoggingService.sendLog(entry);
      return;
    } catch (error) {
      // Fallback vers l'endpoint générique si GCP échoue
    }

    // Fallback vers endpoint générique
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // En cas d'erreur d'envoi, log localement seulement
      if (this.config.enableConsole) {
        console.error('Failed to send log to remote endpoint:', error);
      }
    }
  }

  /**
   * Force l'envoi de tous les logs en attente
   */
  public async flushLogs(): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;
    
    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];
    
    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSend })
      });
    } catch (error) {
      // Remettre les logs dans le buffer en cas d'échec
      this.logBuffer = [...logsToSend, ...this.logBuffer];
      throw error;
    }
  }

  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  }

  /**
   * Détermine la source du log
   */
  private getSource(): string {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return 'unknown';
  }

  /**
   * Met à jour la configuration
   */
  public updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Récupère les logs du buffer (pour debug)
   */
  public getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logBuffer.filter(entry => entry.level >= level);
    }
    return [...this.logBuffer];
  }

  /**
   * Vide le buffer de logs
   */
  public clearLogs(): void {
    this.logBuffer = [];
  }
}

// Instance globale
export const logger = SecureLogger.getInstance();

// Fonctions utilitaires pour un usage simple
export const log = {
  debug: (message: string, data?: any, context?: string) => logger.debug(message, data, context),
  info: (message: string, data?: any, context?: string) => logger.info(message, data, context),
  warn: (message: string, data?: any, context?: string) => logger.warn(message, data, context),
  error: (message: string, error?: Error | any, context?: string) => logger.error(message, error, context),
  critical: (message: string, data?: any, context?: string) => logger.critical(message, data, context)
};

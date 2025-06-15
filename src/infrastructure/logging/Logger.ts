/**
 * 📝 SYSTÈME DE LOGGING CENTRALISÉ - TRAÇABILITÉ AGENTS EBIOS RM
 * Implémente la traçabilité complète des décisions et opérations AI
 * Selon recommandations audit technique Phase 1
 */

import { EventEmitter } from 'events';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  logger: string;
  message: string;
  data?: any;
  error?: Error;
  context?: LogContext;
  traceId?: string;
  spanId?: string;
}

export interface LogContext {
  agentId?: string;
  taskId?: string;
  workshopNumber?: number;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  filePath?: string;
  remoteEndpoint?: string;
  maxFileSize: number;
  maxFiles: number;
  enableStructuredLogging: boolean;
  enableTracing: boolean;
}

/**
 * Logger centralisé pour l'architecture agentic EBIOS RM
 * Supporte la traçabilité distribuée et la corrélation des logs
 */
export class Logger extends EventEmitter {
  private static globalConfig: LoggerConfig = {
    level: LogLevel.INFO,
    enableConsole: true,
    enableFile: false,
    enableRemote: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    enableStructuredLogging: true,
    enableTracing: true
  };

  private static loggers: Map<string, Logger> = new Map();
  private static globalContext: LogContext = {};
  private static appenders: LogAppender[] = [];

  private name: string;
  private context: LogContext = {};
  private traceId?: string;
  private spanId?: string;

  constructor(name: string, context?: LogContext) {
    super();
    this.name = name;
    this.context = { ...context };
    
    // Génération automatique des IDs de trace
    if (Logger.globalConfig.enableTracing) {
      this.traceId = this.generateTraceId();
      this.spanId = this.generateSpanId();
    }
  }

  /**
   * Configuration globale du système de logging
   */
  public static configure(config: Partial<LoggerConfig>): void {
    Logger.globalConfig = { ...Logger.globalConfig, ...config };
    
    // Initialisation des appenders
    Logger.initializeAppenders();
  }

  /**
   * Obtient ou crée un logger nommé
   */
  public static getLogger(name: string, context?: LogContext): Logger {
    const key = `${name}:${JSON.stringify(context || {})}`;
    
    if (!Logger.loggers.has(key)) {
      Logger.loggers.set(key, new Logger(name, context));
    }
    
    return Logger.loggers.get(key)!;
  }

  /**
   * Définit le contexte global pour tous les loggers
   */
  public static setGlobalContext(context: LogContext): void {
    Logger.globalContext = { ...Logger.globalContext, ...context };
  }

  /**
   * Ajoute un appender personnalisé
   */
  public static addAppender(appender: LogAppender): void {
    Logger.appenders.push(appender);
  }

  /**
   * Log de niveau DEBUG
   */
  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log de niveau INFO
   */
  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log de niveau WARN
   */
  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log de niveau ERROR
   */
  public error(message: string, error?: Error | any, data?: any): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, message, data, errorObj);
  }

  /**
   * Log de niveau FATAL
   */
  public fatal(message: string, error?: Error | any, data?: any): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.FATAL, message, data, errorObj);
  }

  /**
   * Log d'une décision AI avec traçabilité complète
   */
  public logAIDecision(decision: {
    agentId: string;
    taskId: string;
    decision: string;
    reasoning: string;
    confidence: number;
    inputs: any;
    outputs: any;
    metadata?: any;
  }): void {
    this.info('AI Decision Made', {
      type: 'ai_decision',
      ...decision,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log d'une exécution d'agent
   */
  public logAgentExecution(execution: {
    agentId: string;
    taskId: string;
    operation: string;
    duration: number;
    success: boolean;
    inputs?: any;
    outputs?: any;
    error?: string;
  }): void {
    this.info('Agent Execution', {
      type: 'agent_execution',
      ...execution,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log d'un workflow EBIOS
   */
  public logWorkflow(workflow: {
    workshopNumber: number;
    phase: string;
    status: 'started' | 'completed' | 'failed';
    duration?: number;
    participants?: string[];
    results?: any;
    error?: string;
  }): void {
    this.info('EBIOS Workflow', {
      type: 'ebios_workflow',
      ...workflow,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log de performance
   */
  public logPerformance(metrics: {
    operation: string;
    duration: number;
    resourceUsage?: {
      cpu: number;
      memory: number;
      network?: number;
    };
    metadata?: any;
  }): void {
    this.info('Performance Metrics', {
      type: 'performance',
      ...metrics,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log de sécurité
   */
  public logSecurity(event: {
    type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity';
    userId?: string;
    resource?: string;
    action: string;
    success: boolean;
    details?: any;
  }): void {
    this.warn('Security Event', {
      ...event,
      type: 'security',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Définit le contexte local du logger
   */
  public setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Crée un logger enfant avec contexte étendu
   */
  public child(name: string, context?: LogContext): Logger {
    const childContext = { ...this.context, ...context };
    const childLogger = new Logger(`${this.name}.${name}`, childContext);
    
    // Héritage des IDs de trace
    childLogger.traceId = this.traceId;
    childLogger.spanId = this.generateSpanId();
    
    return childLogger;
  }

  /**
   * Démarre un span de tracing
   */
  public startSpan(operation: string): LogSpan {
    return new LogSpan(this, operation);
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (level < Logger.globalConfig.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      logger: this.name,
      message,
      data,
      error,
      context: { ...Logger.globalContext, ...this.context },
      traceId: this.traceId,
      spanId: this.spanId
    };

    // Émission de l'événement
    this.emit('log', entry);
    
    // Envoi aux appenders
    Logger.appenders.forEach(appender => {
      try {
        appender.append(entry);
      } catch (err) {
        console.error('Appender error:', err);
      }
    });

    // Console par défaut
    if (Logger.globalConfig.enableConsole) {
      this.logToConsole(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${levelName}] [${entry.logger}]`;
    
    if (Logger.globalConfig.enableStructuredLogging) {
      const structured = {
        ...entry,
        timestamp: entry.timestamp.toISOString()
      };
      console.log(`${prefix} ${JSON.stringify(structured)}`);
    } else {
      const message = `${prefix} ${entry.message}`;
      
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
        case LogLevel.FATAL:
          console.error(message, entry.error, entry.data);
          break;
      }
    }
  }

  private generateTraceId(): string {
    return ((Date.now() % 1000) / 1000).toString(36).substring(2, 15) + 
           ((Date.now() % 1000) / 1000).toString(36).substring(2, 15);
  }

  private generateSpanId(): string {
    return ((Date.now() % 1000) / 1000).toString(36).substring(2, 10);
  }

  private static initializeAppenders(): void {
    Logger.appenders = [];
    
    if (Logger.globalConfig.enableFile && Logger.globalConfig.filePath) {
      Logger.appenders.push(new FileAppender(Logger.globalConfig.filePath));
    }
    
    if (Logger.globalConfig.enableRemote && Logger.globalConfig.remoteEndpoint) {
      Logger.appenders.push(new RemoteAppender(Logger.globalConfig.remoteEndpoint));
    }
  }
}

/**
 * Interface pour les appenders de logs
 */
export interface LogAppender {
  append(entry: LogEntry): void;
}

/**
 * Appender pour écriture dans un fichier
 */
export class FileAppender implements LogAppender {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  append(entry: LogEntry): void {
    // Implémentation simplifiée - en production, utiliser un système de rotation
    const logLine = JSON.stringify({
      ...entry,
      timestamp: entry.timestamp.toISOString()
    }) + '\n';
    
    // Note: En production, utiliser fs.appendFile de manière asynchrone
    try {
      require('fs').appendFileSync(this.filePath, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
}

/**
 * Appender pour envoi vers un endpoint distant
 */
export class RemoteAppender implements LogAppender {
  private endpoint: string;
  private buffer: LogEntry[] = [];
  private flushInterval: number = 5000; // 5 secondes

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    
    // Flush périodique du buffer
    setInterval(() => this.flush(), this.flushInterval);
  }

  append(entry: LogEntry): void {
    this.buffer.push(entry);
    
    // Flush immédiat pour les erreurs critiques
    if (entry.level >= LogLevel.ERROR) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const entries = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs: entries })
      });
    } catch (error) {
      console.error('Failed to send logs to remote endpoint:', error);
      // Remettre les entrées dans le buffer en cas d'échec
      this.buffer.unshift(...entries);
    }
  }
}

/**
 * Classe pour le tracing des opérations
 */
export class LogSpan {
  private logger: Logger;
  private operation: string;
  private startTime: number;
  private metadata: Record<string, any> = {};

  constructor(logger: Logger, operation: string) {
    this.logger = logger;
    this.operation = operation;
    this.startTime = Date.now();
    
    this.logger.debug(`Started span: ${operation}`);
  }

  /**
   * Ajoute des métadonnées au span
   */
  public setMetadata(key: string, value: any): void {
    this.metadata[key] = value;
  }

  /**
   * Termine le span avec succès
   */
  public finish(result?: any): void {
    const duration = Date.now() - this.startTime;
    
    this.logger.info(`Completed span: ${this.operation}`, {
      type: 'span_completed',
      operation: this.operation,
      duration,
      result,
      metadata: this.metadata
    });
  }

  /**
   * Termine le span avec une erreur
   */
  public error(error: Error): void {
    const duration = Date.now() - this.startTime;
    
    this.logger.error(`Failed span: ${this.operation}`, error, {
      type: 'span_failed',
      operation: this.operation,
      duration,
      metadata: this.metadata
    });
  }
}
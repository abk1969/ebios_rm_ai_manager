/**
 * 📊 COLLECTEUR DE MÉTRIQUES - MONITORING AGENTS EBIOS RM
 * Collecte et agrège les métriques de performance et santé des agents
 * Selon recommandations audit technique Phase 1
 */

import { EventEmitter } from 'events';
import { Logger } from '../logging/Logger';

export interface AgentMetric {
  agentId: string;
  timestamp: Date;
  metricType: MetricType;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

export enum MetricType {
  // Métriques de performance
  EXECUTION_TIME = 'execution_time',
  THROUGHPUT = 'throughput',
  LATENCY = 'latency',
  
  // Métriques de ressources
  CPU_USAGE = 'cpu_usage',
  MEMORY_USAGE = 'memory_usage',
  NETWORK_IO = 'network_io',
  
  // Métriques de qualité
  SUCCESS_RATE = 'success_rate',
  ERROR_RATE = 'error_rate',
  ACCURACY = 'accuracy',
  CONFIDENCE = 'confidence',
  
  // Métriques EBIOS spécifiques
  COMPLIANCE_SCORE = 'compliance_score',
  RISK_COVERAGE = 'risk_coverage',
  WORKSHOP_COMPLETION = 'workshop_completion',
  
  // Métriques système
  CIRCUIT_BREAKER_STATE = 'circuit_breaker_state',
  FALLBACK_RATE = 'fallback_rate',
  AGENT_AVAILABILITY = 'agent_availability'
}

export interface MetricAggregation {
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  stdDev: number;
}

export interface MetricSummary {
  agentId: string;
  metricType: MetricType;
  timeWindow: string;
  aggregation: MetricAggregation;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: Date;
}

export interface ExecutionRecord {
  agentId: string;
  taskType: string;
  executionTime: number;
  success: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Collecteur centralisé de métriques pour l'architecture agentic
 */
export class MetricsCollector extends EventEmitter {
  private static instance: MetricsCollector;
  private metrics: Map<string, AgentMetric[]> = new Map();
  private executionRecords: ExecutionRecord[] = [];
  private aggregations: Map<string, MetricSummary> = new Map();
  private logger: Logger;
  
  // Configuration
  private maxMetricsPerAgent: number = 10000;
  private maxExecutionRecords: number = 50000;
  private aggregationInterval: number = 60000; // 1 minute
  private retentionPeriod: number = 24 * 60 * 60 * 1000; // 24 heures
  
  // Timers
  private aggregationTimer?: NodeJS.Timeout;
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    super();
    this.logger = new Logger('MetricsCollector');
    this.startPeriodicTasks();
  }

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  /**
   * Enregistre une métrique
   */
  public recordMetric(metric: Omit<AgentMetric, 'timestamp'>): void {
    const fullMetric: AgentMetric = {
      ...metric,
      timestamp: new Date()
    };

    const key = `${metric.agentId}:${metric.metricType}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const agentMetrics = this.metrics.get(key)!;
    agentMetrics.push(fullMetric);
    
    // Limitation de la taille
    if (agentMetrics.length > this.maxMetricsPerAgent) {
      agentMetrics.splice(0, agentMetrics.length - this.maxMetricsPerAgent);
    }
    
    this.emit('metricRecorded', fullMetric);
    this.logger.debug(`Recorded metric: ${metric.agentId}:${metric.metricType} = ${metric.value}`);
  }

  /**
   * Enregistre l'exécution d'un agent
   */
  public recordExecution(record: Omit<ExecutionRecord, 'timestamp'>): void {
    const fullRecord: ExecutionRecord = {
      ...record,
      timestamp: new Date()
    };
    
    this.executionRecords.push(fullRecord);
    
    // Limitation de la taille
    if (this.executionRecords.length > this.maxExecutionRecords) {
      this.executionRecords.splice(0, this.executionRecords.length - this.maxExecutionRecords);
    }
    
    // Enregistrement automatique des métriques dérivées
    this.recordMetric({
      agentId: record.agentId,
      metricType: MetricType.EXECUTION_TIME,
      value: record.executionTime,
      unit: 'ms',
      tags: { taskType: record.taskType },
      metadata: record.metadata
    });
    
    this.recordMetric({
      agentId: record.agentId,
      metricType: record.success ? MetricType.SUCCESS_RATE : MetricType.ERROR_RATE,
      value: 1,
      unit: 'count',
      tags: { taskType: record.taskType }
    });
    
    this.emit('executionRecorded', fullRecord);
  }

  /**
   * Obtient les métriques d'un agent
   */
  public getMetrics(agentId: string, metricType?: MetricType, timeWindow?: number): AgentMetric[] {
    const now = Date.now();
    const cutoff = timeWindow ? now - timeWindow : 0;
    
    if (metricType) {
      const key = `${agentId}:${metricType}`;
      const metrics = this.metrics.get(key) || [];
      return metrics.filter(m => m.timestamp.getTime() >= cutoff);
    }
    
    // Toutes les métriques de l'agent
    const allMetrics: AgentMetric[] = [];
    
    this.metrics.forEach((metrics, key) => {
      if (key.startsWith(`${agentId}:`)) {
        allMetrics.push(...metrics.filter(m => m.timestamp.getTime() >= cutoff));
      }
    });
    
    return allMetrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Obtient les enregistrements d'exécution
   */
  public getExecutionRecords(agentId?: string, timeWindow?: number): ExecutionRecord[] {
    const now = Date.now();
    const cutoff = timeWindow ? now - timeWindow : 0;
    
    let records = this.executionRecords.filter(r => r.timestamp.getTime() >= cutoff);
    
    if (agentId) {
      records = records.filter(r => r.agentId === agentId);
    }
    
    return records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Calcule l'agrégation d'une métrique
   */
  public getAggregation(agentId: string, metricType: MetricType, timeWindow: number = 3600000): MetricAggregation {
    const metrics = this.getMetrics(agentId, metricType, timeWindow);
    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    
    if (values.length === 0) {
      return {
        count: 0,
        sum: 0,
        min: 0,
        max: 0,
        avg: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        stdDev: 0
      };
    }
    
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    
    return {
      count: values.length,
      sum,
      min: values[0],
      max: values[values.length - 1],
      avg,
      p50: this.percentile(values, 0.5),
      p95: this.percentile(values, 0.95),
      p99: this.percentile(values, 0.99),
      stdDev: Math.sqrt(variance)
    };
  }

  /**
   * Obtient le résumé des métriques
   */
  public getMetricSummary(agentId: string, metricType: MetricType): MetricSummary | undefined {
    const key = `${agentId}:${metricType}`;
    return this.aggregations.get(key);
  }

  /**
   * Obtient toutes les agrégations
   */
  public getAllAggregations(): MetricSummary[] {
    return Array.from(this.aggregations.values());
  }

  /**
   * Calcule les métriques de santé globale
   */
  public getHealthMetrics(): Record<string, any> {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recentRecords = this.getExecutionRecords(undefined, oneHour);
    
    const agentIds = Array.from(new Set(recentRecords.map(r => r.agentId)));
    const totalExecutions = recentRecords.length;
    const successfulExecutions = recentRecords.filter(r => r.success).length;
    const avgExecutionTime = recentRecords.length > 0 
      ? recentRecords.reduce((sum, r) => sum + r.executionTime, 0) / recentRecords.length 
      : 0;
    
    return {
      timestamp: new Date(),
      activeAgents: agentIds.length,
      totalExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      avgExecutionTime,
      throughput: totalExecutions / (oneHour / 1000), // executions per second
      agentHealth: this.calculateAgentHealth(agentIds)
    };
  }

  /**
   * Obtient les métriques EBIOS spécifiques
   */
  public getEBIOSMetrics(): Record<string, any> {
    const workshops = [1, 2, 3, 4, 5];
    const metrics: Record<string, any> = {};
    
    workshops.forEach(workshop => {
      const workshopRecords = this.executionRecords.filter(r => 
        r.metadata?.workshopNumber === workshop
      );
      
      metrics[`workshop_${workshop}`] = {
        totalExecutions: workshopRecords.length,
        successRate: workshopRecords.length > 0 
          ? (workshopRecords.filter(r => r.success).length / workshopRecords.length) * 100 
          : 0,
        avgExecutionTime: workshopRecords.length > 0 
          ? workshopRecords.reduce((sum, r) => sum + r.executionTime, 0) / workshopRecords.length 
          : 0
      };
    });
    
    return {
      timestamp: new Date(),
      workshops: metrics,
      overallCompliance: this.calculateComplianceScore(),
      riskCoverage: this.calculateRiskCoverage()
    };
  }

  /**
   * Exporte les métriques au format JSON
   */
  public exportMetrics(timeWindow?: number): any {
    const now = Date.now();
    const cutoff = timeWindow ? now - timeWindow : 0;
    
    const exportData = {
      timestamp: new Date(),
      timeWindow: timeWindow || 'all',
      metrics: {} as Record<string, AgentMetric[]>,
      executions: this.executionRecords.filter(r => r.timestamp.getTime() >= cutoff),
      aggregations: Array.from(this.aggregations.values()),
      health: this.getHealthMetrics(),
      ebios: this.getEBIOSMetrics()
    };
    
    this.metrics.forEach((metrics, key) => {
      exportData.metrics[key] = metrics.filter(m => m.timestamp.getTime() >= cutoff);
    });
    
    return exportData;
  }

  /**
   * Nettoie les anciennes métriques
   */
  public cleanup(): void {
    const cutoff = Date.now() - this.retentionPeriod;
    
    // Nettoyage des métriques
    this.metrics.forEach((metrics, key) => {
      const filtered = metrics.filter(m => m.timestamp.getTime() >= cutoff);
      if (filtered.length !== metrics.length) {
        this.metrics.set(key, filtered);
      }
    });
    
    // Nettoyage des enregistrements d'exécution
    this.executionRecords = this.executionRecords.filter(r => r.timestamp.getTime() >= cutoff);
    
    this.logger.info(`Cleaned up metrics older than ${this.retentionPeriod}ms`);
  }

  private startPeriodicTasks(): void {
    // Agrégation périodique
    this.aggregationTimer = setInterval(() => {
      this.performAggregation();
    }, this.aggregationInterval);
    
    // Nettoyage périodique
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.retentionPeriod / 4); // Nettoyage 4 fois par période de rétention
  }

  private performAggregation(): void {
    const timeWindow = this.aggregationInterval * 10; // 10 minutes
    
    this.metrics.forEach((metrics, key) => {
      const [agentId, metricType] = key.split(':');
      const aggregation = this.getAggregation(agentId, metricType as MetricType, timeWindow);
      
      if (aggregation.count > 0) {
        const summary: MetricSummary = {
          agentId,
          metricType: metricType as MetricType,
          timeWindow: `${timeWindow}ms`,
          aggregation,
          trend: this.calculateTrend(agentId, metricType as MetricType),
          lastUpdated: new Date()
        };
        
        this.aggregations.set(key, summary);
      }
    });
  }

  private calculateTrend(agentId: string, metricType: MetricType): 'increasing' | 'decreasing' | 'stable' {
    const recentMetrics = this.getMetrics(agentId, metricType, this.aggregationInterval * 2);
    
    if (recentMetrics.length < 2) {
      return 'stable';
    }
    
    const midPoint = Math.floor(recentMetrics.length / 2);
    const firstHalf = recentMetrics.slice(0, midPoint);
    const secondHalf = recentMetrics.slice(midPoint);
    
    const firstAvg = firstHalf.reduce((sum, m) => sum + m.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, m) => sum + m.value, 0) / secondHalf.length;
    
    const threshold = firstAvg * 0.05; // 5% de seuil
    
    if (secondAvg > firstAvg + threshold) {
      return 'increasing';
    } else if (secondAvg < firstAvg - threshold) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  private calculateAgentHealth(agentIds: string[]): Record<string, any> {
    const health: Record<string, any> = {};
    
    agentIds.forEach(agentId => {
      const recentRecords = this.getExecutionRecords(agentId, 60 * 60 * 1000); // 1 heure
      const successRate = recentRecords.length > 0 
        ? (recentRecords.filter(r => r.success).length / recentRecords.length) * 100 
        : 0;
      
      health[agentId] = {
        status: successRate >= 95 ? 'healthy' : successRate >= 80 ? 'degraded' : 'unhealthy',
        successRate,
        executionCount: recentRecords.length,
        lastExecution: recentRecords.length > 0 
          ? recentRecords[recentRecords.length - 1].timestamp 
          : null
      };
    });
    
    return health;
  }

  private calculateComplianceScore(): number {
    // Calcul simplifié du score de conformité EBIOS
    const complianceMetrics = this.metrics.get('compliance_score') || [];
    if (complianceMetrics.length === 0) {
      return 0;
    }
    
    const recentMetrics = complianceMetrics.slice(-10); // 10 dernières mesures
    return recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
  }

  private calculateRiskCoverage(): number {
    // Calcul simplifié de la couverture des risques
    const coverageMetrics = this.metrics.get('risk_coverage') || [];
    if (coverageMetrics.length === 0) {
      return 0;
    }
    
    const recentMetrics = coverageMetrics.slice(-10);
    return recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
  }

  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    
    const index = Math.ceil(values.length * p) - 1;
    return values[Math.max(0, Math.min(index, values.length - 1))];
  }

  public shutdown(): void {
    if (this.aggregationTimer) {
      clearInterval(this.aggregationTimer);
    }
    
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.logger.info('MetricsCollector shut down');
  }
}
/**
 * 📊 METRICS COLLECTION SERVICE - COLLECTE INTELLIGENTE DE MÉTRIQUES
 * Service de collecte et agrégation de métriques pour l'écosystème agentic
 * CRITICITÉ : HIGH - Observabilité complète du système EBIOS RM
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { AlertingService } from './AlertingService';

export interface MetricDefinition {
  id: string;
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary' | 'timer';
  category: 'performance' | 'functional' | 'technical' | 'business' | 'security';
  unit: string;
  description: string;
  labels: string[];
  aggregationMethods: AggregationMethod[];
  retentionDays: number;
  samplingRate: number; // 0.0 to 1.0
  enabled: boolean;
  alertingEnabled: boolean;
  customTags: Record<string, string>;
}

export type AggregationMethod = 
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'count'
  | 'p50'
  | 'p90'
  | 'p95'
  | 'p99'
  | 'rate'
  | 'stddev';

export interface MetricValue {
  id: string;
  metricName: string;
  value: number;
  timestamp: Date;
  labels: Record<string, string>;
  context: {
    agentId?: string;
    workshopId?: number;
    userId?: string;
    sessionId?: string;
    component?: string;
    environment: 'development' | 'staging' | 'production';
    version?: string;
  };
  metadata: Record<string, any>;
}

export interface AggregatedMetric {
  id: string;
  metricName: string;
  aggregationMethod: AggregationMethod;
  value: number;
  timestamp: Date;
  timeWindow: number; // en secondes
  sampleCount: number;
  labels: Record<string, string>;
  context: MetricValue['context'];
}

export interface MetricQuery {
  metricNames: string[];
  startTime: Date;
  endTime: Date;
  aggregationMethod?: AggregationMethod;
  timeWindow?: number; // en secondes
  labels?: Record<string, string>;
  context?: Partial<MetricValue['context']>;
  limit?: number;
  orderBy?: 'timestamp' | 'value';
  orderDirection?: 'asc' | 'desc';
}

export interface MetricSeries {
  metricName: string;
  aggregationMethod: AggregationMethod;
  dataPoints: Array<{
    timestamp: Date;
    value: number;
    sampleCount?: number;
  }>;
  labels: Record<string, string>;
  metadata: {
    totalSamples: number;
    timeRange: { start: Date; end: Date };
    resolution: number; // en secondes
  };
}

export interface MetricStatistics {
  metricName: string;
  period: { start: Date; end: Date };
  statistics: {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
    stddev: number;
    percentiles: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
  trend: {
    direction: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
    confidence: number; // 0.0 to 1.0
  };
}

export interface MetricAlert {
  metricName: string;
  condition: 'threshold' | 'anomaly' | 'trend';
  threshold?: {
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    value: number;
    timeWindow: number;
  };
  anomalyDetection?: {
    algorithm: 'zscore' | 'iqr' | 'isolation_forest';
    sensitivity: number;
    trainingPeriod: number;
  };
  trendDetection?: {
    direction: 'increasing' | 'decreasing';
    minChangePercent: number;
    timeWindow: number;
  };
}

export interface CollectionConfiguration {
  globalEnabled: boolean;
  defaultSamplingRate: number;
  batchSize: number;
  flushInterval: number; // en secondes
  maxMemoryUsage: number; // en MB
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  retentionPolicies: Record<string, number>; // métrique -> jours
  aggregationIntervals: number[]; // en secondes
  anomalyDetectionEnabled: boolean;
  realTimeAlerting: boolean;
}

export interface PerformanceMetrics {
  collectionLatency: number;
  aggregationLatency: number;
  storageLatency: number;
  memoryUsage: number;
  diskUsage: number;
  throughput: number; // métriques/seconde
  errorRate: number;
  queueSize: number;
}

/**
 * Service de collecte et agrégation de métriques
 */
export class MetricsCollectionService {
  private static instance: MetricsCollectionService;
  private configuration: CollectionConfiguration;
  private metricDefinitions: Map<string, MetricDefinition> = new Map();
  private metricBuffer: MetricValue[] = [];
  private aggregationBuffer: Map<string, AggregatedMetric[]> = new Map();
  private flushInterval: NodeJS.Timeout | null = null;
  private aggregationInterval: NodeJS.Timeout | null = null;
  private alertingService: AlertingService;
  private performanceMetrics: PerformanceMetrics;
  private isInitialized = false;

  private constructor() {
    this.configuration = this.getDefaultConfiguration();
    this.alertingService = AlertingService.getInstance();
    this.performanceMetrics = this.initializePerformanceMetrics();
  }

  /**
   * Singleton pattern
   */
  static getInstance(): MetricsCollectionService {
    if (!MetricsCollectionService.instance) {
      MetricsCollectionService.instance = new MetricsCollectionService();
    }
    return MetricsCollectionService.instance;
  }

  /**
   * Initialise le service de collecte
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📊 Initialisation Metrics Collection Service');
      
      // Charger la configuration
      await this.loadConfiguration();
      
      // Charger les définitions de métriques
      await this.loadMetricDefinitions();
      
      // Démarrer les intervalles de traitement
      this.startFlushInterval();
      this.startAggregationInterval();
      
      // Créer les métriques par défaut
      await this.createDefaultMetrics();
      
      this.isInitialized = true;
      console.log('✅ Metrics Collection Service initialisé');
      
    } catch (error) {
      console.error('❌ Erreur initialisation Metrics Collection Service:', error);
      throw error;
    }
  }

  /**
   * Collecte une métrique
   */
  async collectMetric(
    metricName: string,
    value: number,
    labels: Record<string, string> = {},
    context: Partial<MetricValue['context']> = {},
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      if (!this.configuration.globalEnabled) {
        return;
      }

      const definition = this.metricDefinitions.get(metricName);
      if (!definition || !definition.enabled) {
        return;
      }

      // Échantillonnage basé sur timestamp
      if ((Date.now() % 100) / 100 > definition.samplingRate) {
        return;
      }

      const startTime = Date.now();

      // Créer la valeur métrique
      const metricValue: MetricValue = {
        id: `metric-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
        metricName,
        value,
        timestamp: new Date(),
        labels: { ...labels, ...definition.customTags },
        context: {
          environment: 'production',
          ...context
        },
        metadata: {
          ...metadata,
          collectionLatency: Date.now() - startTime
        }
      };

      // Ajouter au buffer
      this.metricBuffer.push(metricValue);

      // Vérifier la taille du buffer
      if (this.metricBuffer.length >= this.configuration.batchSize) {
        await this.flushMetrics();
      }

      // Alerting en temps réel si activé
      if (this.configuration.realTimeAlerting && definition.alertingEnabled) {
        await this.alertingService.evaluateMetric(
          metricName,
          value,
          definition.unit,
          metricValue.context,
          metricValue.metadata
        );
      }

      // Mettre à jour les métriques de performance
      this.updatePerformanceMetrics('collection', Date.now() - startTime);

    } catch (error) {
      console.error(`❌ Erreur collecte métrique ${metricName}:`, error);
      this.updatePerformanceMetrics('error');
    }
  }

  /**
   * Collecte multiple métriques en batch
   */
  async collectMetricsBatch(metrics: Array<{
    metricName: string;
    value: number;
    labels?: Record<string, string>;
    context?: Partial<MetricValue['context']>;
    metadata?: Record<string, any>;
  }>): Promise<void> {
    const startTime = Date.now();
    
    try {
      for (const metric of metrics) {
        await this.collectMetric(
          metric.metricName,
          metric.value,
          metric.labels,
          metric.context,
          metric.metadata
        );
      }
      
      this.updatePerformanceMetrics('batch_collection', Date.now() - startTime);
      
    } catch (error) {
      console.error('❌ Erreur collecte batch métriques:', error);
      this.updatePerformanceMetrics('error');
    }
  }

  /**
   * Incrémente un compteur
   */
  async incrementCounter(
    metricName: string,
    increment: number = 1,
    labels: Record<string, string> = {},
    context: Partial<MetricValue['context']> = {}
  ): Promise<void> {
    await this.collectMetric(metricName, increment, labels, context, {
      type: 'counter_increment'
    });
  }

  /**
   * Enregistre une valeur de gauge
   */
  async recordGauge(
    metricName: string,
    value: number,
    labels: Record<string, string> = {},
    context: Partial<MetricValue['context']> = {}
  ): Promise<void> {
    await this.collectMetric(metricName, value, labels, context, {
      type: 'gauge_value'
    });
  }

  /**
   * Enregistre une durée (timer)
   */
  async recordTimer(
    metricName: string,
    durationMs: number,
    labels: Record<string, string> = {},
    context: Partial<MetricValue['context']> = {}
  ): Promise<void> {
    await this.collectMetric(metricName, durationMs, labels, context, {
      type: 'timer_duration'
    });
  }

  /**
   * Enregistre une valeur d'histogramme
   */
  async recordHistogram(
    metricName: string,
    value: number,
    buckets: number[],
    labels: Record<string, string> = {},
    context: Partial<MetricValue['context']> = {}
  ): Promise<void> {
    // Déterminer le bucket approprié
    const bucket = buckets.find(b => value <= b) || 'inf';
    
    await this.collectMetric(metricName, value, {
      ...labels,
      bucket: bucket.toString()
    }, context, {
      type: 'histogram_value',
      buckets
    });
  }

  /**
   * Mesure et enregistre l'exécution d'une fonction
   */
  async measureFunction<T>(
    metricName: string,
    fn: () => Promise<T> | T,
    labels: Record<string, string> = {},
    context: Partial<MetricValue['context']> = {}
  ): Promise<T> {
    const startTime = Date.now();
    let success = true;
    let error: any = null;
    
    try {
      const result = await fn();
      return result;
    } catch (err) {
      success = false;
      error = err;
      throw err;
    } finally {
      const duration = Date.now() - startTime;
      
      await this.collectMetric(metricName, duration, {
        ...labels,
        success: success.toString()
      }, context, {
        type: 'function_execution',
        error: error?.message
      });
    }
  }

  /**
   * Flush les métriques vers le stockage
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricBuffer.length === 0) return;

    const startTime = Date.now();
    const metricsToFlush = [...this.metricBuffer];
    this.metricBuffer = [];

    try {
      // Grouper par métrique pour optimiser l'écriture
      const groupedMetrics = this.groupMetricsByName(metricsToFlush);
      
      // Écrire en batch
      for (const [metricName, metrics] of groupedMetrics) {
        await this.writeMetricsBatch(metricName, metrics);
      }
      
      this.updatePerformanceMetrics('flush', Date.now() - startTime);
      this.performanceMetrics.throughput = metricsToFlush.length / ((Date.now() - startTime) / 1000);
      
      console.log(`📊 ${metricsToFlush.length} métriques flushées`);
      
    } catch (error) {
      console.error('❌ Erreur flush métriques:', error);
      // Remettre les métriques dans le buffer en cas d'erreur
      this.metricBuffer.unshift(...metricsToFlush);
      this.updatePerformanceMetrics('error');
    }
  }

  /**
   * Groupe les métriques par nom
   */
  private groupMetricsByName(metrics: MetricValue[]): Map<string, MetricValue[]> {
    const grouped = new Map<string, MetricValue[]>();
    
    for (const metric of metrics) {
      if (!grouped.has(metric.metricName)) {
        grouped.set(metric.metricName, []);
      }
      grouped.get(metric.metricName)!.push(metric);
    }
    
    return grouped;
  }

  /**
   * Écrit un batch de métriques
   */
  private async writeMetricsBatch(
    metricName: string,
    metrics: MetricValue[]
  ): Promise<void> {
    try {
      const collectionName = `metrics_${metricName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      // Écrire chaque métrique
      for (const metric of metrics) {
        await addDoc(collection(db, collectionName), {
          metric_name: metric.metricName,
          value: metric.value,
          timestamp: metric.timestamp,
          labels: metric.labels,
          context: metric.context,
          metadata: metric.metadata,
          created_at: new Date()
        });
      }
      
    } catch (error) {
      console.error(`Erreur écriture batch ${metricName}:`, error);
      throw error;
    }
  }

  /**
   * Démarre l'intervalle de flush
   */
  private startFlushInterval(): void {
    this.flushInterval = setInterval(async () => {
      await this.flushMetrics();
    }, this.configuration.flushInterval * 1000);
  }

  /**
   * Démarre l'intervalle d'agrégation
   */
  private startAggregationInterval(): void {
    this.aggregationInterval = setInterval(async () => {
      await this.performAggregation();
    }, 60 * 1000); // Toutes les minutes
  }

  /**
   * Effectue l'agrégation des métriques
   */
  private async performAggregation(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('📊 Début agrégation métriques');
      
      for (const interval of this.configuration.aggregationIntervals) {
        await this.aggregateMetricsForInterval(interval);
      }
      
      this.updatePerformanceMetrics('aggregation', Date.now() - startTime);
      console.log('✅ Agrégation métriques terminée');
      
    } catch (error) {
      console.error('❌ Erreur agrégation métriques:', error);
      this.updatePerformanceMetrics('error');
    }
  }

  /**
   * Agrège les métriques pour un intervalle donné
   */
  private async aggregateMetricsForInterval(intervalSeconds: number): Promise<void> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - intervalSeconds * 1000);
    
    for (const [metricName, definition] of this.metricDefinitions) {
      if (!definition.enabled) continue;
      
      try {
        const rawMetrics = await this.getRawMetrics(metricName, startTime, endTime);
        
        if (rawMetrics.length === 0) continue;
        
        // Agrégation par méthode
        for (const method of definition.aggregationMethods) {
          const aggregatedValue = this.calculateAggregation(rawMetrics, method);
          
          const aggregatedMetric: AggregatedMetric = {
            id: `agg-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
            metricName,
            aggregationMethod: method,
            value: aggregatedValue,
            timestamp: endTime,
            timeWindow: intervalSeconds,
            sampleCount: rawMetrics.length,
            labels: this.mergeLabels(rawMetrics),
            context: this.mergeContexts(rawMetrics)
          };
          
          await this.saveAggregatedMetric(aggregatedMetric);
        }
        
      } catch (error) {
        console.error(`Erreur agrégation ${metricName}:`, error);
      }
    }
  }

  /**
   * Récupère les métriques brutes pour une période
   */
  private async getRawMetrics(
    metricName: string,
    startTime: Date,
    endTime: Date
  ): Promise<MetricValue[]> {
    try {
      const collectionName = `metrics_${metricName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      const q = query(
        collection(db, collectionName),
        where('timestamp', '>=', startTime),
        where('timestamp', '<=', endTime),
        orderBy('timestamp', 'asc')
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          metricName: data.metric_name,
          value: data.value,
          timestamp: data.timestamp.toDate(),
          labels: data.labels || {},
          context: data.context || {},
          metadata: data.metadata || {}
        };
      });
      
    } catch (error) {
      console.error(`Erreur récupération métriques ${metricName}:`, error);
      return [];
    }
  }

  /**
   * Calcule l'agrégation selon la méthode
   */
  private calculateAggregation(
    metrics: MetricValue[],
    method: AggregationMethod
  ): number {
    const values = metrics.map(m => m.value);
    
    switch (method) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'count':
        return values.length;
      case 'p50':
        return this.calculatePercentile(values, 0.5);
      case 'p90':
        return this.calculatePercentile(values, 0.9);
      case 'p95':
        return this.calculatePercentile(values, 0.95);
      case 'p99':
        return this.calculatePercentile(values, 0.99);
      case 'rate':
        // Calculer le taux par seconde
        const timeSpan = (metrics[metrics.length - 1].timestamp.getTime() - metrics[0].timestamp.getTime()) / 1000;
        return timeSpan > 0 ? values.length / timeSpan : 0;
      case 'stddev':
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        return Math.sqrt(variance);
      default:
        return 0;
    }
  }

  /**
   * Calcule un percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Fusionne les labels de plusieurs métriques
   */
  private mergeLabels(metrics: MetricValue[]): Record<string, string> {
    const merged: Record<string, string> = {};
    
    for (const metric of metrics) {
      for (const [key, value] of Object.entries(metric.labels)) {
        if (!merged[key]) {
          merged[key] = value;
        }
      }
    }
    
    return merged;
  }

  /**
   * Fusionne les contextes de plusieurs métriques
   */
  private mergeContexts(metrics: MetricValue[]): MetricValue['context'] {
    const merged: MetricValue['context'] = {
      environment: 'production'
    };
    
    for (const metric of metrics) {
      Object.assign(merged, metric.context);
    }
    
    return merged;
  }

  /**
   * Sauvegarde une métrique agrégée
   */
  private async saveAggregatedMetric(metric: AggregatedMetric): Promise<void> {
    try {
      await addDoc(collection(db, 'aggregated_metrics'), {
        metric_name: metric.metricName,
        aggregation_method: metric.aggregationMethod,
        value: metric.value,
        timestamp: metric.timestamp,
        time_window: metric.timeWindow,
        sample_count: metric.sampleCount,
        labels: metric.labels,
        context: metric.context,
        created_at: new Date()
      });
    } catch (error) {
      console.error('Erreur sauvegarde métrique agrégée:', error);
    }
  }

  /**
   * Requête de métriques
   */
  async queryMetrics(query: MetricQuery): Promise<MetricSeries[]> {
    try {
      const series: MetricSeries[] = [];
      
      for (const metricName of query.metricNames) {
        const metricSeries = await this.queryMetricSeries(metricName, query);
        if (metricSeries) {
          series.push(metricSeries);
        }
      }
      
      return series;
      
    } catch (error) {
      console.error('❌ Erreur requête métriques:', error);
      return [];
    }
  }

  /**
   * Requête d'une série de métriques
   */
  private async queryMetricSeries(
    metricName: string,
    query: MetricQuery
  ): Promise<MetricSeries | null> {
    try {
      const useAggregated = query.aggregationMethod && query.timeWindow;
      const collectionName = useAggregated ? 'aggregated_metrics' : `metrics_${metricName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      let firestoreQuery = collection(db, collectionName);
      let constraints: any[] = [];
      
      if (useAggregated) {
        constraints.push(where('metric_name', '==', metricName));
        constraints.push(where('aggregation_method', '==', query.aggregationMethod));
        if (query.timeWindow) {
          constraints.push(where('time_window', '==', query.timeWindow));
        }
      } else {
        constraints.push(where('metric_name', '==', metricName));
      }
      
      constraints.push(where('timestamp', '>=', query.startTime));
      constraints.push(where('timestamp', '<=', query.endTime));
      
      if (query.orderBy) {
        constraints.push(orderBy(query.orderBy, query.orderDirection || 'asc'));
      }
      
      if (query.limit) {
        constraints.push(limit(query.limit));
      }
      
      const q = (query as any)(firestoreQuery, ...constraints); // 🔧 CORRECTION: Type assertion pour query
      const snapshot = await getDocs(q);
      
      const dataPoints = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          timestamp: (data as any).timestamp.toDate(), // 🔧 CORRECTION: Type assertion
          value: (data as any).value, // 🔧 CORRECTION: Type assertion
          sampleCount: (data as any).sample_count // 🔧 CORRECTION: Type assertion
        };
      });
      
      if (dataPoints.length === 0) {
        return null;
      }
      
      return {
        metricName,
        aggregationMethod: query.aggregationMethod || 'avg',
        dataPoints,
        labels: query.labels || {},
        metadata: {
          totalSamples: dataPoints.reduce((sum, dp) => sum + (dp.sampleCount || 1), 0),
          timeRange: { start: query.startTime, end: query.endTime },
          resolution: query.timeWindow || 60
        }
      };
      
    } catch (error) {
      console.error(`Erreur requête série ${metricName}:`, error);
      return null;
    }
  }

  /**
   * Calcule les statistiques d'une métrique
   */
  async getMetricStatistics(
    metricName: string,
    startTime: Date,
    endTime: Date
  ): Promise<MetricStatistics | null> {
    try {
      const rawMetrics = await this.getRawMetrics(metricName, startTime, endTime);
      
      if (rawMetrics.length === 0) {
        return null;
      }
      
      const values = rawMetrics.map(m => m.value);
      const sum = values.reduce((s, v) => s + v, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      // Calcul de l'écart-type
      const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length;
      const stddev = Math.sqrt(variance);
      
      // Calcul des percentiles
      const sortedValues = values.sort((a, b) => a - b);
      const percentiles = {
        p50: this.calculatePercentile(sortedValues, 0.5),
        p90: this.calculatePercentile(sortedValues, 0.9),
        p95: this.calculatePercentile(sortedValues, 0.95),
        p99: this.calculatePercentile(sortedValues, 0.99)
      };
      
      // Calcul de la tendance
      const trend = this.calculateTrend(rawMetrics);
      
      return {
        metricName,
        period: { start: startTime, end: endTime },
        statistics: {
          count: values.length,
          sum,
          avg,
          min,
          max,
          stddev,
          percentiles
        },
        trend
      };
      
    } catch (error) {
      console.error(`Erreur calcul statistiques ${metricName}:`, error);
      return null;
    }
  }

  /**
   * Calcule la tendance d'une métrique
   */
  private calculateTrend(metrics: MetricValue[]): {
    direction: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
    confidence: number;
  } {
    if (metrics.length < 2) {
      return { direction: 'stable', changePercent: 0, confidence: 0 };
    }
    
    // Régression linéaire simple
    const n = metrics.length;
    const sumX = metrics.reduce((sum, _, i) => sum + i, 0);
    const sumY = metrics.reduce((sum, m) => sum + m.value, 0);
    const sumXY = metrics.reduce((sum, m, i) => sum + i * m.value, 0);
    const sumXX = metrics.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Calcul du coefficient de corrélation
    const avgX = sumX / n;
    const avgY = sumY / n;
    const numerator = metrics.reduce((sum, m, i) => sum + (i - avgX) * (m.value - avgY), 0);
    const denomX = Math.sqrt(metrics.reduce((sum, _, i) => sum + Math.pow(i - avgX, 2), 0));
    const denomY = Math.sqrt(metrics.reduce((sum, m) => sum + Math.pow(m.value - avgY, 2), 0));
    const correlation = denomX * denomY > 0 ? numerator / (denomX * denomY) : 0;
    
    const firstValue = metrics[0].value;
    const lastValue = metrics[metrics.length - 1].value;
    const changePercent = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    
    let direction: 'increasing' | 'decreasing' | 'stable';
    if (Math.abs(slope) < 0.01) {
      direction = 'stable';
    } else if (slope > 0) {
      direction = 'increasing';
    } else {
      direction = 'decreasing';
    }
    
    return {
      direction,
      changePercent,
      confidence: Math.abs(correlation)
    };
  }

  /**
   * Met à jour les métriques de performance
   */
  private updatePerformanceMetrics(
    operation: 'collection' | 'flush' | 'aggregation' | 'batch_collection' | 'error',
    latency?: number
  ): void {
    switch (operation) {
      case 'collection':
        if (latency !== undefined) {
          this.performanceMetrics.collectionLatency = latency;
        }
        break;
      case 'flush':
        if (latency !== undefined) {
          this.performanceMetrics.storageLatency = latency;
        }
        break;
      case 'aggregation':
        if (latency !== undefined) {
          this.performanceMetrics.aggregationLatency = latency;
        }
        break;
      case 'batch_collection':
        if (latency !== undefined) {
          this.performanceMetrics.collectionLatency = latency;
        }
        break;
      case 'error':
        this.performanceMetrics.errorRate += 0.01;
        break;
    }
    
    // Mettre à jour l'utilisation mémoire
    this.performanceMetrics.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    this.performanceMetrics.queueSize = this.metricBuffer.length;
  }

  /**
   * Obtient les métriques de performance
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Initialise les métriques de performance
   */
  private initializePerformanceMetrics(): PerformanceMetrics {
    return {
      collectionLatency: 0,
      aggregationLatency: 0,
      storageLatency: 0,
      memoryUsage: 0,
      diskUsage: 0,
      throughput: 0,
      errorRate: 0,
      queueSize: 0
    };
  }

  /**
   * Charge la configuration
   */
  private async loadConfiguration(): Promise<void> {
    try {
      // Charger depuis la base ou utiliser la configuration par défaut
      this.configuration = this.getDefaultConfiguration();
    } catch (error) {
      console.error('Erreur chargement configuration:', error);
    }
  }

  /**
   * Charge les définitions de métriques
   */
  private async loadMetricDefinitions(): Promise<void> {
    try {
      const q = query(collection(db, 'metric_definitions'));
      const snapshot = await getDocs(q);
      
      snapshot.forEach(doc => {
        const data = doc.data() as MetricDefinition;
        this.metricDefinitions.set(data.name, data);
      });
      
      console.log(`✅ ${this.metricDefinitions.size} définitions de métriques chargées`);
    } catch (error) {
      console.error('Erreur chargement définitions métriques:', error);
    }
  }

  /**
   * Crée les métriques par défaut
   */
  private async createDefaultMetrics(): Promise<void> {
    const defaultMetrics: Omit<MetricDefinition, 'id'>[] = [
      {
        name: 'response_time',
        type: 'timer',
        category: 'performance',
        unit: 'ms',
        description: 'Temps de réponse des requêtes',
        labels: ['endpoint', 'method', 'status'],
        aggregationMethods: ['avg', 'p50', 'p90', 'p95', 'p99', 'max'],
        retentionDays: 30,
        samplingRate: 1.0,
        enabled: true,
        alertingEnabled: true,
        customTags: { service: 'ebios-rm' }
      },
      {
        name: 'error_rate',
        type: 'gauge',
        category: 'technical',
        unit: 'ratio',
        description: 'Taux d\'erreur des requêtes',
        labels: ['component', 'error_type'],
        aggregationMethods: ['avg', 'max', 'sum'],
        retentionDays: 30,
        samplingRate: 1.0,
        enabled: true,
        alertingEnabled: true,
        customTags: { service: 'ebios-rm' }
      },
      {
        name: 'agent_execution_time',
        type: 'timer',
        category: 'functional',
        unit: 'ms',
        description: 'Temps d\'exécution des agents',
        labels: ['agent_type', 'workshop', 'success'],
        aggregationMethods: ['avg', 'p50', 'p90', 'p95', 'max'],
        retentionDays: 60,
        samplingRate: 1.0,
        enabled: true,
        alertingEnabled: true,
        customTags: { service: 'ebios-rm', component: 'agents' }
      },
      {
        name: 'ebios_compliance_score',
        type: 'gauge',
        category: 'business',
        unit: 'score',
        description: 'Score de conformité EBIOS RM',
        labels: ['workshop', 'organization'],
        aggregationMethods: ['avg', 'min', 'max'],
        retentionDays: 90,
        samplingRate: 1.0,
        enabled: true,
        alertingEnabled: true,
        customTags: { service: 'ebios-rm', component: 'compliance' }
      },
      {
        name: 'user_interactions',
        type: 'counter',
        category: 'business',
        unit: 'count',
        description: 'Nombre d\'interactions utilisateur',
        labels: ['action', 'component', 'user_role'],
        aggregationMethods: ['sum', 'rate'],
        retentionDays: 30,
        samplingRate: 0.1,
        enabled: true,
        alertingEnabled: false,
        customTags: { service: 'ebios-rm', component: 'ui' }
      },
      {
        name: 'memory_usage',
        type: 'gauge',
        category: 'technical',
        unit: 'MB',
        description: 'Utilisation mémoire',
        labels: ['component', 'process'],
        aggregationMethods: ['avg', 'max'],
        retentionDays: 7,
        samplingRate: 1.0,
        enabled: true,
        alertingEnabled: true,
        customTags: { service: 'ebios-rm', component: 'system' }
      },
      {
        name: 'database_query_time',
        type: 'timer',
        category: 'performance',
        unit: 'ms',
        description: 'Temps d\'exécution des requêtes base de données',
        labels: ['collection', 'operation'],
        aggregationMethods: ['avg', 'p50', 'p90', 'p95', 'max'],
        retentionDays: 30,
        samplingRate: 0.5,
        enabled: true,
        alertingEnabled: true,
        customTags: { service: 'ebios-rm', component: 'database' }
      }
    ];

    for (const metric of defaultMetrics) {
      if (!this.metricDefinitions.has(metric.name)) {
        const docRef = await addDoc(collection(db, 'metric_definitions'), metric);
        this.metricDefinitions.set(metric.name, {
          ...metric,
          id: docRef.id
        });
      }
    }

    console.log('✅ Métriques par défaut créées');
  }

  /**
   * Obtient la configuration par défaut
   */
  private getDefaultConfiguration(): CollectionConfiguration {
    return {
      globalEnabled: true,
      defaultSamplingRate: 1.0,
      batchSize: 100,
      flushInterval: 30, // 30 secondes
      maxMemoryUsage: 512, // 512 MB
      compressionEnabled: true,
      encryptionEnabled: false,
      retentionPolicies: {
        default: 30,
        performance: 7,
        business: 90,
        security: 365
      },
      aggregationIntervals: [60, 300, 3600], // 1min, 5min, 1h
      anomalyDetectionEnabled: true,
      realTimeAlerting: true
    };
  }

  /**
   * Nettoie les anciennes métriques selon les politiques de rétention
   */
  async cleanupOldMetrics(): Promise<void> {
    try {
      console.log('🧹 Nettoyage anciennes métriques');
      
      for (const [metricName, definition] of this.metricDefinitions) {
        const retentionDays = definition.retentionDays;
        const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
        
        await this.deleteOldMetrics(metricName, cutoffDate);
      }
      
      console.log('✅ Nettoyage terminé');
    } catch (error) {
      console.error('❌ Erreur nettoyage métriques:', error);
    }
  }

  /**
   * Supprime les anciennes métriques
   */
  private async deleteOldMetrics(metricName: string, cutoffDate: Date): Promise<void> {
    try {
      const collectionName = `metrics_${metricName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      const q = query(
        collection(db, collectionName),
        where('timestamp', '<', cutoffDate),
        limit(1000) // Traiter par batch
      );
      
      const snapshot = await getDocs(q);
      
      // Supprimer les documents
      for (const docSnapshot of snapshot.docs) {
        await (docSnapshot.ref as any).delete(); // 🔧 CORRECTION: Type assertion pour delete
      }
      
      if (snapshot.size > 0) {
        console.log(`🗑️ ${snapshot.size} anciennes métriques supprimées pour ${metricName}`);
      }
      
    } catch (error) {
      console.error(`Erreur suppression métriques ${metricName}:`, error);
    }
  }

  /**
   * Arrête le service de collecte
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Arrêt Metrics Collection Service');
    
    // Flush final
    await this.flushMetrics();
    
    // Arrêter les intervalles
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    if (this.aggregationInterval) {
      clearInterval(this.aggregationInterval);
      this.aggregationInterval = null;
    }
    
    // Nettoyer les buffers
    this.metricBuffer = [];
    this.aggregationBuffer.clear();
    this.metricDefinitions.clear();
    
    this.isInitialized = false;
    console.log('✅ Metrics Collection Service arrêté');
  }
}
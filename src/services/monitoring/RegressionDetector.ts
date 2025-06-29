/**
 * 🔍 DÉTECTEUR DE RÉGRESSION - MONITORING ANTI-RÉGRESSION
 * Surveillance continue pour éviter la disqualification ANSSI
 * Alerting intelligent selon audit technique
 */

import { MigrationMetrics, Alert, RegressionAlert } from '@/types/agents';

export interface RegressionThresholds {
  performance: {
    apiResponseTime: number;        // +30% max
    databaseQueryTime: number;      // +20% max
    agentOverhead: number;          // +20% max
  };
  functional: {
    workflowCompletionRate: number; // 95% min
    dataConsistencyScore: number;   // 98% min
    userSatisfactionScore: number;  // 80% min
  };
  technical: {
    agentAvailabilityRate: number;  // 99% min
    fallbackUsageRate: number;      // 10% max
  };
  compliance: {
    anssiComplianceScore: number;   // 95% min
    validationSuccessRate: number;  // 98% min
    auditTrailCompleteness: number; // 100% requis
  };
}

export interface BaselineMetrics {
  timestamp: Date;
  metrics: MigrationMetrics;
  version: string;
  environment: 'development' | 'staging' | 'production';
}

/**
 * Détecteur de régression pour migration sécurisée
 */
export class RegressionDetector {
  private baseline: BaselineMetrics | null = null;
  private thresholds: RegressionThresholds;
  private alertHistory: Alert[] = [];

  constructor(thresholds?: Partial<RegressionThresholds>) {
    this.thresholds = {
      performance: {
        apiResponseTime: 1.3,      // +30%
        databaseQueryTime: 1.2,    // +20%
        agentOverhead: 1.2         // +20%
      },
      functional: {
        workflowCompletionRate: 0.95,  // 95%
        dataConsistencyScore: 0.98,    // 98%
        userSatisfactionScore: 0.80    // 80%
      },
      technical: {
        agentAvailabilityRate: 0.99,   // 99%
        fallbackUsageRate: 0.10        // 10%
      },
      compliance: {
        anssiComplianceScore: 0.95,    // 95%
        validationSuccessRate: 0.98,   // 98%
        auditTrailCompleteness: 1.0    // 100%
      },
      ...thresholds
    };
  }

  /**
   * Établit la baseline de référence
   */
  setBaseline(metrics: MigrationMetrics, version: string, environment: string): void {
    this.baseline = {
      timestamp: new Date(),
      metrics,
      version,
      environment: environment as any
    };
    
    console.log(`📊 Baseline établie pour ${environment} v${version}`);
  }

  /**
   * Détecte les régressions par rapport à la baseline
   */
  detectRegressions(currentMetrics: MigrationMetrics): RegressionAlert[] {
    if (!this.baseline) {
      console.warn('⚠️ Aucune baseline définie pour la détection de régression');
      return [];
    }

    const alerts: RegressionAlert[] = [];
    const baseMetrics = this.baseline.metrics;

    // 🚀 DÉTECTION RÉGRESSIONS PERFORMANCE
    alerts.push(...this.checkPerformanceRegressions(baseMetrics, currentMetrics));

    // 🔧 DÉTECTION RÉGRESSIONS FONCTIONNELLES
    alerts.push(...this.checkFunctionalRegressions(baseMetrics, currentMetrics));

    // ⚙️ DÉTECTION RÉGRESSIONS TECHNIQUES
    alerts.push(...this.checkTechnicalRegressions(baseMetrics, currentMetrics));

    // 📋 DÉTECTION RÉGRESSIONS CONFORMITÉ (CRITIQUE)
    alerts.push(...this.checkComplianceRegressions(baseMetrics, currentMetrics));

    // Enregistrer les alertes
    this.alertHistory.push(...alerts);

    return alerts;
  }

  /**
   * Vérifie les régressions de performance
   */
  private checkPerformanceRegressions(
    baseline: MigrationMetrics, 
    current: MigrationMetrics
  ): RegressionAlert[] {
    const alerts: RegressionAlert[] = [];

    // Temps de réponse API
    const apiRatio = current.apiResponseTime / baseline.apiResponseTime;
    if (apiRatio > this.thresholds.performance.apiResponseTime) {
      alerts.push({
        id: `perf-api-${Date.now()}`,
        severity: apiRatio > 1.5 ? 'critical' : 'error',
        title: 'Régression Performance API',
        message: `Temps de réponse API dégradé: ${(apiRatio * 100 - 100).toFixed(1)}% plus lent`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'performance',
        baseline: baseline.apiResponseTime,
        current: current.apiResponseTime,
        threshold: this.thresholds.performance.apiResponseTime,
        impact: apiRatio > 2 ? 'critical' : apiRatio > 1.5 ? 'high' : 'medium',
        suggestedActions: [
          'Vérifier la charge des agents',
          'Optimiser les requêtes base de données',
          'Activer le circuit breaker si nécessaire'
        ]
      });
    }

    // Temps de requête base de données
    const dbRatio = current.databaseQueryTime / baseline.databaseQueryTime;
    if (dbRatio > this.thresholds.performance.databaseQueryTime) {
      alerts.push({
        id: `perf-db-${Date.now()}`,
        severity: dbRatio > 1.4 ? 'critical' : 'error',
        title: 'Régression Performance Base de Données',
        message: `Requêtes DB plus lentes: ${(dbRatio * 100 - 100).toFixed(1)}%`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'performance',
        baseline: baseline.databaseQueryTime,
        current: current.databaseQueryTime,
        threshold: this.thresholds.performance.databaseQueryTime,
        impact: dbRatio > 1.5 ? 'critical' : 'high',
        suggestedActions: [
          'Analyser les requêtes lentes',
          'Vérifier les index manquants',
          'Optimiser les jointures'
        ]
      });
    }

    return alerts;
  }

  /**
   * Vérifie les régressions fonctionnelles
   */
  private checkFunctionalRegressions(
    baseline: MigrationMetrics, 
    current: MigrationMetrics
  ): RegressionAlert[] {
    const alerts: RegressionAlert[] = [];

    // Taux de complétion des workflows EBIOS
    if (current.ebiosWorkflowCompletionRate < this.thresholds.functional.workflowCompletionRate) {
      alerts.push({
        id: `func-workflow-${Date.now()}`,
        severity: 'critical',
        title: 'CRITIQUE: Échec Workflows EBIOS',
        message: `Taux de complétion: ${(current.ebiosWorkflowCompletionRate * 100).toFixed(1)}% (seuil: ${(this.thresholds.functional.workflowCompletionRate * 100)}%)`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'functional',
        baseline: baseline.ebiosWorkflowCompletionRate,
        current: current.ebiosWorkflowCompletionRate,
        threshold: this.thresholds.functional.workflowCompletionRate,
        impact: 'critical',
        suggestedActions: [
          'URGENT: Vérifier la logique métier EBIOS',
          'Analyser les échecs de validation ANSSI',
          'Activer le fallback legacy immédiatement'
        ]
      });
    }

    // Cohérence des données
    if (current.dataConsistencyScore < this.thresholds.functional.dataConsistencyScore) {
      alerts.push({
        id: `func-consistency-${Date.now()}`,
        severity: 'critical',
        title: 'CRITIQUE: Incohérence Données',
        message: `Score cohérence: ${(current.dataConsistencyScore * 100).toFixed(1)}%`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'data_consistency',
        baseline: baseline.dataConsistencyScore,
        current: current.dataConsistencyScore,
        threshold: this.thresholds.functional.dataConsistencyScore,
        impact: 'critical',
        suggestedActions: [
          'URGENT: Audit intégrité données',
          'Vérifier les migrations de schéma',
          'Restaurer backup si nécessaire'
        ]
      });
    }

    return alerts;
  }

  /**
   * Vérifie les régressions techniques
   */
  private checkTechnicalRegressions(
    baseline: MigrationMetrics, 
    current: MigrationMetrics
  ): RegressionAlert[] {
    const alerts: RegressionAlert[] = [];

    // Disponibilité des agents
    if (current.agentAvailabilityRate < this.thresholds.technical.agentAvailabilityRate) {
      alerts.push({
        id: `tech-availability-${Date.now()}`,
        severity: 'error',
        title: 'Disponibilité Agents Dégradée',
        message: `Disponibilité: ${(current.agentAvailabilityRate * 100).toFixed(1)}%`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'performance',
        baseline: baseline.agentAvailabilityRate,
        current: current.agentAvailabilityRate,
        threshold: this.thresholds.technical.agentAvailabilityRate,
        impact: 'medium',
        suggestedActions: [
          'Redémarrer les agents défaillants',
          'Vérifier les ressources système',
          'Augmenter le timeout des agents'
        ]
      });
    }

    return alerts;
  }

  /**
   * Vérifie les régressions de conformité (CRITIQUE ANSSI)
   */
  private checkComplianceRegressions(
    baseline: MigrationMetrics, 
    current: MigrationMetrics
  ): RegressionAlert[] {
    const alerts: RegressionAlert[] = [];

    // Score conformité ANSSI (CRITIQUE)
    if (current.anssiComplianceScore < this.thresholds.compliance.anssiComplianceScore) {
      alerts.push({
        id: `compliance-anssi-${Date.now()}`,
        severity: 'critical',
        title: '🚨 DISQUALIFICATION ANSSI IMMINENTE',
        message: `Conformité ANSSI: ${(current.anssiComplianceScore * 100).toFixed(1)}% (minimum: ${(this.thresholds.compliance.anssiComplianceScore * 100)}%)`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'compliance',
        baseline: baseline.anssiComplianceScore,
        current: current.anssiComplianceScore,
        threshold: this.thresholds.compliance.anssiComplianceScore,
        impact: 'critical',
        suggestedActions: [
          '🚨 ARRÊT IMMÉDIAT DU DÉPLOIEMENT',
          'Audit conformité EBIOS RM complet',
          'Validation ANSSI avant reprise',
          'Rollback vers version stable'
        ]
      });
    }

    // Traçabilité audit (OBLIGATOIRE)
    if (current.auditTrailCompleteness < this.thresholds.compliance.auditTrailCompleteness) {
      alerts.push({
        id: `compliance-audit-${Date.now()}`,
        severity: 'critical',
        title: '🚨 TRAÇABILITÉ AUDIT INCOMPLÈTE',
        message: `Traçabilité: ${(current.auditTrailCompleteness * 100).toFixed(1)}% (requis: 100%)`,
        source: 'RegressionDetector',
        timestamp: new Date(),
        resolved: false,
        regressionType: 'compliance',
        baseline: baseline.auditTrailCompleteness,
        current: current.auditTrailCompleteness,
        threshold: this.thresholds.compliance.auditTrailCompleteness,
        impact: 'critical',
        suggestedActions: [
          'Vérifier logs de décision',
          'Compléter historique manquant',
          'Activer traçabilité complète'
        ]
      });
    }

    return alerts;
  }

  /**
   * Génère un rapport de santé global
   */
  generateHealthReport(currentMetrics: MigrationMetrics): {
    overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
    score: number;
    alerts: RegressionAlert[];
    recommendations: string[];
  } {
    const alerts = this.detectRegressions(currentMetrics);
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const errorAlerts = alerts.filter(a => a.severity === 'error');

    let overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
    let score = 100;

    if (criticalAlerts.length > 0) {
      overallHealth = 'critical';
      score = Math.max(0, score - (criticalAlerts.length * 30));
    } else if (errorAlerts.length > 0) {
      overallHealth = 'warning';
      score = Math.max(0, score - (errorAlerts.length * 15));
    } else if (alerts.length > 0) {
      overallHealth = 'good';
      score = Math.max(0, score - (alerts.length * 5));
    } else {
      overallHealth = 'excellent';
    }

    const recommendations = this.generateRecommendations(alerts);

    return {
      overallHealth,
      score,
      alerts,
      recommendations
    };
  }

  /**
   * Génère des recommandations basées sur les alertes
   */
  private generateRecommendations(alerts: RegressionAlert[]): string[] {
    const recommendations: string[] = [];

    if (alerts.some(a => a.regressionType === 'compliance')) {
      recommendations.push('🚨 PRIORITÉ ABSOLUE: Résoudre les problèmes de conformité ANSSI');
    }

    if (alerts.some(a => a.regressionType === 'functional')) {
      recommendations.push('Vérifier l\'intégrité des workflows EBIOS RM');
    }

    if (alerts.some(a => a.regressionType === 'performance')) {
      recommendations.push('Optimiser les performances avant mise en production');
    }

    if (alerts.length === 0) {
      recommendations.push('Migration en bonne voie - Continuer le monitoring');
    }

    return recommendations;
  }

  /**
   * Historique des alertes
   */
  getAlertHistory(): Alert[] {
    return [...this.alertHistory];
  }

  /**
   * Réinitialise l\'historique
   */
  clearHistory(): void {
    this.alertHistory = [];
  }
}

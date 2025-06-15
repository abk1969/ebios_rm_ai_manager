/**
 * 🚩 FEATURE FLAGS - CONTRÔLE D'ACTIVATION PROGRESSIVE DES AGENTS
 * Permet l'activation/désactivation dynamique des fonctionnalités agentic
 * Selon recommandations audit technique Phase 1
 */

import { Logger } from '../logging/Logger';
import { EventEmitter } from 'events';

export interface FeatureFlagConfig {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;  // Pourcentage de déploiement progressif
  conditions?: FeatureFlagCondition[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlagCondition {
  type: 'user_id' | 'environment' | 'time_window' | 'custom';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range';
  value: any;
  description?: string;
}

export interface FeatureFlagEvaluation {
  flagName: string;
  enabled: boolean;
  reason: string;
  evaluatedAt: Date;
  context?: Record<string, any>;
}

/**
 * Gestionnaire de feature flags pour l'architecture agentic EBIOS RM
 */
export class FeatureFlags extends EventEmitter {
  private flags: Map<string, FeatureFlagConfig> = new Map();
  private logger: Logger;
  private evaluationHistory: FeatureFlagEvaluation[] = [];
  private maxHistorySize: number = 1000;

  constructor() {
    super();
    this.logger = new Logger('FeatureFlags');
    this.initializeDefaultFlags();
  }

  /**
   * Vérifie si une fonctionnalité est activée
   */
  public isEnabled(flagName: string, context?: Record<string, any>): boolean {
    const evaluation = this.evaluate(flagName, context);
    this.recordEvaluation(evaluation);
    
    this.logger.debug(`Feature flag '${flagName}': ${evaluation.enabled} (${evaluation.reason})`);
    return evaluation.enabled;
  }

  /**
   * Évalue une feature flag avec contexte
   */
  public evaluate(flagName: string, context?: Record<string, any>): FeatureFlagEvaluation {
    const flag = this.flags.get(flagName);
    const evaluatedAt = new Date();
    
    if (!flag) {
      return {
        flagName,
        enabled: false,
        reason: 'Flag not found',
        evaluatedAt,
        context
      };
    }

    // Vérification de base
    if (!flag.enabled) {
      return {
        flagName,
        enabled: false,
        reason: 'Flag disabled',
        evaluatedAt,
        context
      };
    }

    // Vérification du rollout progressif
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      const hash = this.hashContext(flagName, context);
      const percentage = hash % 100;
      
      if (percentage >= flag.rolloutPercentage) {
        return {
          flagName,
          enabled: false,
          reason: `Rollout percentage: ${percentage}% >= ${flag.rolloutPercentage}%`,
          evaluatedAt,
          context
        };
      }
    }

    // Vérification des conditions
    if (flag.conditions && flag.conditions.length > 0) {
      for (const condition of flag.conditions) {
        if (!this.evaluateCondition(condition, context)) {
          return {
            flagName,
            enabled: false,
            reason: `Condition failed: ${condition.type} ${condition.operator} ${condition.value}`,
            evaluatedAt,
            context
          };
        }
      }
    }

    return {
      flagName,
      enabled: true,
      reason: 'All conditions met',
      evaluatedAt,
      context
    };
  }

  /**
   * Définit ou met à jour une feature flag
   */
  public setFlag(config: Omit<FeatureFlagConfig, 'createdAt' | 'updatedAt'>): void {
    const existingFlag = this.flags.get(config.name);
    const now = new Date();
    
    const flagConfig: FeatureFlagConfig = {
      ...config,
      createdAt: existingFlag?.createdAt || now,
      updatedAt: now
    };
    
    this.flags.set(config.name, flagConfig);
    
    this.logger.info(`Feature flag '${config.name}' ${existingFlag ? 'updated' : 'created'}`);
    this.emit('flagChanged', config.name, flagConfig);
  }

  /**
   * Active une feature flag
   */
  public enable(flagName: string): void {
    const flag = this.flags.get(flagName);
    if (flag) {
      this.setFlag({ ...flag, enabled: true });
    } else {
      this.logger.warn(`Attempted to enable non-existent flag: ${flagName}`);
    }
  }

  /**
   * Désactive une feature flag
   */
  public disable(flagName: string): void {
    const flag = this.flags.get(flagName);
    if (flag) {
      this.setFlag({ ...flag, enabled: false });
    } else {
      this.logger.warn(`Attempted to disable non-existent flag: ${flagName}`);
    }
  }

  /**
   * Met à jour le pourcentage de rollout
   */
  public setRolloutPercentage(flagName: string, percentage: number): void {
    const flag = this.flags.get(flagName);
    if (flag) {
      this.setFlag({ ...flag, rolloutPercentage: Math.max(0, Math.min(100, percentage)) });
    } else {
      this.logger.warn(`Attempted to set rollout for non-existent flag: ${flagName}`);
    }
  }

  /**
   * Obtient la configuration d'une feature flag
   */
  public getFlag(flagName: string): FeatureFlagConfig | undefined {
    return this.flags.get(flagName);
  }

  /**
   * Liste toutes les feature flags
   */
  public getAllFlags(): FeatureFlagConfig[] {
    return Array.from(this.flags.values());
  }

  /**
   * Supprime une feature flag
   */
  public removeFlag(flagName: string): boolean {
    const deleted = this.flags.delete(flagName);
    if (deleted) {
      this.logger.info(`Feature flag '${flagName}' removed`);
      this.emit('flagRemoved', flagName);
    }
    return deleted;
  }

  /**
   * Obtient l'historique des évaluations
   */
  public getEvaluationHistory(flagName?: string): FeatureFlagEvaluation[] {
    if (flagName) {
      return this.evaluationHistory.filter(e => e.flagName === flagName);
    }
    return [...this.evaluationHistory];
  }

  /**
   * Obtient les statistiques d'utilisation
   */
  public getUsageStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    this.flags.forEach((flag, name) => {
      const evaluations = this.evaluationHistory.filter(e => e.flagName === name);
      const enabledCount = evaluations.filter(e => e.enabled).length;
      
      stats[name] = {
        totalEvaluations: evaluations.length,
        enabledCount,
        disabledCount: evaluations.length - enabledCount,
        enabledPercentage: evaluations.length > 0 ? (enabledCount / evaluations.length) * 100 : 0,
        lastEvaluated: evaluations.length > 0 ? evaluations[evaluations.length - 1].evaluatedAt : null
      };
    });
    
    return stats;
  }

  /**
   * Exporte la configuration des flags
   */
  public exportConfig(): Record<string, FeatureFlagConfig> {
    const config: Record<string, FeatureFlagConfig> = {};
    this.flags.forEach((flag, name) => {
      config[name] = { ...flag };
    });
    return config;
  }

  /**
   * Importe une configuration de flags
   */
  public importConfig(config: Record<string, FeatureFlagConfig>): void {
    Object.entries(config).forEach(([name, flagConfig]) => {
      this.setFlag(flagConfig);
    });
    
    this.logger.info(`Imported ${Object.keys(config).length} feature flags`);
  }

  private initializeDefaultFlags(): void {
    // Flags pour les agents spécialisés (Phase 2)
    this.setFlag({
      name: 'agent_documentation',
      enabled: false,
      description: 'Active l\'agent de documentation AI',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'agent_visualization',
      enabled: false,
      description: 'Active l\'agent de visualisation AI',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'agent_threat_intelligence',
      enabled: false,
      description: 'Active l\'agent d\'intelligence des menaces',
      rolloutPercentage: 0
    });

    // Flags pour les ateliers (Phase 3)
    this.setFlag({
      name: 'agent_workshop_1',
      enabled: false,
      description: 'Active l\'agent pour l\'atelier 1 (Socle de sécurité)',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'agent_workshop_2',
      enabled: false,
      description: 'Active l\'agent pour l\'atelier 2 (Sources de risque)',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'agent_workshop_3',
      enabled: false,
      description: 'Active l\'agent pour l\'atelier 3 (Scénarios stratégiques)',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'agent_workshop_4',
      enabled: false,
      description: 'Active l\'agent pour l\'atelier 4 (Scénarios opérationnels)',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'agent_workshop_5',
      enabled: false,
      description: 'Active l\'agent pour l\'atelier 5 (Traitement du risque)',
      rolloutPercentage: 0
    });

    // Flags pour l'orchestration A2A (Phase 4)
    this.setFlag({
      name: 'a2a_orchestration',
      enabled: false,
      description: 'Active l\'orchestration Agent-to-Agent',
      rolloutPercentage: 0
    });

    // Flags pour les fonctionnalités avancées
    this.setFlag({
      name: 'ai_decision_traceability',
      enabled: false,
      description: 'Active la traçabilité des décisions AI',
      rolloutPercentage: 0
    });

    this.setFlag({
      name: 'performance_monitoring',
      enabled: true,
      description: 'Active le monitoring de performance',
      rolloutPercentage: 100
    });

    this.setFlag({
      name: 'circuit_breaker',
      enabled: true,
      description: 'Active les circuit breakers',
      rolloutPercentage: 100
    });

    this.logger.info('Default feature flags initialized');
  }

  private evaluateCondition(condition: FeatureFlagCondition, context?: Record<string, any>): boolean {
    if (!context) {
      return condition.type === 'environment' || condition.type === 'time_window';
    }

    const contextValue = this.getContextValue(condition.type, context);
    
    switch (condition.operator) {
      case 'equals':
        return contextValue === condition.value;
      
      case 'contains':
        return String(contextValue).includes(String(condition.value));
      
      case 'greater_than':
        return Number(contextValue) > Number(condition.value);
      
      case 'less_than':
        return Number(contextValue) < Number(condition.value);
      
      case 'in_range':
        if (Array.isArray(condition.value) && condition.value.length === 2) {
          const num = Number(contextValue);
          return num >= condition.value[0] && num <= condition.value[1];
        }
        return false;
      
      default:
        return false;
    }
  }

  private getContextValue(type: string, context: Record<string, any>): any {
    switch (type) {
      case 'user_id':
        return context.userId || context.user_id;
      
      case 'environment':
        return process.env.NODE_ENV || 'development';
      
      case 'time_window':
        return new Date().getHours();
      
      case 'custom':
        return context;
      
      default:
        return context[type];
    }
  }

  private hashContext(flagName: string, context?: Record<string, any>): number {
    const str = flagName + JSON.stringify(context || {});
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
  }

  private recordEvaluation(evaluation: FeatureFlagEvaluation): void {
    this.evaluationHistory.push(evaluation);
    
    // Limiter la taille de l'historique
    if (this.evaluationHistory.length > this.maxHistorySize) {
      this.evaluationHistory = this.evaluationHistory.slice(-this.maxHistorySize);
    }
    
    this.emit('flagEvaluated', evaluation);
  }
}
/**
 * 🏭 AGENT FACTORY - CRÉATION ET GESTION D'AGENTS AVEC FALLBACK LEGACY
 * Factory pattern pour création d'agents avec stratégie de fallback intelligente
 * CRITICITÉ : HIGH - Infrastructure fondamentale pour l'évolution progressive
 */

import { AgentService, AgentCapabilityDetails, AgentStatus, AgentTask, AgentResult } from './AgentService';
import { DatabaseMigrationService } from '../migration/DatabaseMigrationService';
import { AgentCapability } from '../../infrastructure/agents/AgentInterface';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Import des agents spécialisés
import { ThreatModelingAgent } from './ThreatModelingAgent';
import { ScenarioGenerationAgent } from './ScenarioGenerationAgent';
import { CyberKillChainAgent } from './CyberKillChainAgent';
import { SecurityOptimizationAgent } from './SecurityOptimizationAgent';
import { ANSSIValidationAgent } from './ANSSIValidationAgent';
import { DocumentationAgent } from './DocumentationAgent';

export interface AgentConfiguration {
  id: string;
  type: AgentType;
  version: string;
  capabilities: string[];
  workshopSpecialization: number[];
  fallbackStrategy: FallbackStrategy;
  circuitBreakerConfig: CircuitBreakerConfig;
  performanceThresholds: PerformanceThresholds;
  complianceRequirements: ComplianceRequirements;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
  halfOpenMaxCalls: number;
  monitoringEnabled: boolean;
}

export interface PerformanceThresholds {
  maxResponseTime: number;
  minSuccessRate: number;
  maxErrorRate: number;
  maxConcurrentTasks: number;
}

export interface ComplianceRequirements {
  ebiosCompliant: boolean;
  anssiFriendly: boolean;
  auditTrailRequired: boolean;
  dataRetentionDays: number;
}

export type AgentType = 
  | 'threat_modeling'
  | 'scenario_generation'
  | 'cyber_kill_chain'
  | 'security_optimization'
  | 'validation'
  | 'documentation'
  | 'visualization'
  | 'generic';

export type FallbackStrategy = 
  | 'legacy_service'
  | 'simplified_logic'
  | 'manual_intervention'
  | 'template_based'
  | 'best_effort'
  | 'fail_fast';

export interface AgentCreationResult {
  success: boolean;
  agent?: AgentService;
  fallbackUsed: boolean;
  fallbackType?: FallbackStrategy;
  errors: string[];
  warnings: string[];
  performanceMetrics: {
    creationTime: number;
    initializationTime: number;
    healthCheckTime: number;
  };
}

export interface AgentHealthStatus {
  agentId: string;
  isHealthy: boolean;
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  circuitBreakerState: 'closed' | 'open' | 'half_open';
  fallbackAvailable: boolean;
  complianceStatus: {
    ebios: boolean;
    anssi: boolean;
    audit: boolean;
  };
}

export interface LegacyServiceAdapter {
  serviceName: string;
  isAvailable: () => Promise<boolean>;
  execute: (input: any, context: any) => Promise<any>;
  getCapabilities: () => string[];
  getWorkshopSupport: () => number[];
}

/**
 * Factory pour création et gestion d'agents avec fallback legacy
 */
export class AgentFactory {
  private static instance: AgentFactory;
  private agentInstances: Map<string, AgentService> = new Map();
  private agentConfigurations: Map<string, AgentConfiguration> = new Map();
  private legacyAdapters: Map<string, LegacyServiceAdapter> = new Map();
  private circuitBreakers: Map<string, any> = new Map();
  private healthStatuses: Map<string, AgentHealthStatus> = new Map();
  private migrationService: DatabaseMigrationService;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.migrationService = new DatabaseMigrationService();
    this.initializeFactory();
  }

  /**
   * Singleton pattern
   */
  static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
    }
    return AgentFactory.instance;
  }

  /**
   * Initialise la factory
   */
  private async initializeFactory(): Promise<void> {
    try {
      console.log('🏭 Initialisation Agent Factory');
      
      // Charger les configurations d'agents
      await this.loadAgentConfigurations();
      
      // Initialiser les adaptateurs legacy
      await this.initializeLegacyAdapters();
      
      // Démarrer le monitoring de santé
      this.startHealthMonitoring();
      
      console.log('✅ Agent Factory initialisée');
    } catch (error) {
      console.error('❌ Erreur initialisation Agent Factory:', error);
      throw error;
    }
  }

  /**
   * Crée un agent avec fallback automatique
   */
  async createAgent(
    type: AgentType,
    workshopId?: number,
    customConfig?: Partial<AgentConfiguration>
  ): Promise<AgentCreationResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let fallbackUsed = false;
    let fallbackType: FallbackStrategy | undefined;
    
    try {
      console.log(`🤖 Création agent type: ${type}, workshop: ${workshopId}`);
      
      // 1. Obtenir la configuration
      const config = await this.getAgentConfiguration(type, workshopId, customConfig);
      
      // 2. Vérifier si l'agent existe déjà
      const existingAgent = this.agentInstances.get(config.id);
      if (existingAgent) {
        const healthStatus = await this.checkAgentHealth(config.id);
        if (healthStatus.isHealthy) {
          console.log(`♻️ Réutilisation agent existant: ${config.id}`);
          return {
            success: true,
            agent: existingAgent,
            fallbackUsed: false,
            errors: [],
            warnings: ['Agent existant réutilisé'],
            performanceMetrics: {
              creationTime: 0,
              initializationTime: 0,
              healthCheckTime: Date.now() - startTime
            }
          };
        } else {
          warnings.push('Agent existant non sain, création d\'une nouvelle instance');
          this.agentInstances.delete(config.id);
        }
      }
      
      // 3. Tentative de création de l'agent principal
      const creationStartTime = Date.now();
      let agent: AgentService | null = null;
      
      try {
        agent = await this.createPrimaryAgent(type, config);
        console.log(`✅ Agent principal créé: ${config.id}`);
      } catch (error) {
        errors.push(`Erreur création agent principal: ${error}`);
        console.warn(`⚠️ Échec création agent principal ${type}:`, error);
      }
      
      // 4. Fallback si nécessaire
      if (!agent) {
        const fallbackResult = await this.createFallbackAgent(type, config, workshopId);
        agent = fallbackResult.agent;
        fallbackUsed = true;
        fallbackType = fallbackResult.strategy;
        
        if (fallbackResult.warnings) {
          warnings.push(...fallbackResult.warnings);
        }
        
        if (!agent) {
          errors.push('Échec création agent et fallback');
          return {
            success: false,
            fallbackUsed: true,
            fallbackType,
            errors,
            warnings,
            performanceMetrics: {
              creationTime: Date.now() - creationStartTime,
              initializationTime: 0,
              healthCheckTime: 0
            }
          };
        }
      }
      
      const creationTime = Date.now() - creationStartTime;
      
      // 5. Initialisation de l'agent
      const initStartTime = Date.now();
      try {
        await this.initializeAgent(agent, config);
      } catch (error) {
        errors.push(`Erreur initialisation agent: ${error}`);
        warnings.push('Agent créé mais initialisation partielle');
      }
      const initializationTime = Date.now() - initStartTime;
      
      // 6. Vérification de santé
      const healthStartTime = Date.now();
      const healthStatus = await this.performInitialHealthCheck(agent, config.id);
      const healthCheckTime = Date.now() - healthStartTime;
      
      if (!healthStatus.isHealthy) {
        warnings.push('Agent créé mais état de santé dégradé');
      }
      
      // 7. Enregistrement
      this.agentInstances.set(config.id, agent);
      this.agentConfigurations.set(config.id, config);
      this.healthStatuses.set(config.id, healthStatus);
      
      // 8. Logging en base
      await this.logAgentCreation(config.id, type, fallbackUsed, fallbackType);
      
      const totalTime = Date.now() - startTime;
      console.log(`🎉 Agent ${config.id} créé avec succès en ${totalTime}ms`);
      
      return {
        success: true,
        agent,
        fallbackUsed,
        fallbackType,
        errors,
        warnings,
        performanceMetrics: {
          creationTime,
          initializationTime,
          healthCheckTime
        }
      };
      
    } catch (error) {
      const totalTime = Date.now() - startTime;
      errors.push(`Erreur critique création agent: ${error}`);
      
      console.error(`❌ Erreur critique création agent ${type}:`, error);
      
      return {
        success: false,
        fallbackUsed,
        fallbackType,
        errors,
        warnings,
        performanceMetrics: {
          creationTime: totalTime,
          initializationTime: 0,
          healthCheckTime: 0
        }
      };
    }
  }

  /**
   * Crée l'agent principal selon le type
   */
  private async createPrimaryAgent(type: AgentType, config: AgentConfiguration): Promise<AgentService> {
    switch (type) {
      case 'threat_modeling':
        return new ThreatModelingAgent();
        
      case 'scenario_generation':
        return new ScenarioGenerationAgent();
        
      case 'cyber_kill_chain':
        return new CyberKillChainAgent();
        
      case 'security_optimization':
        return new SecurityOptimizationAgent();
        
      case 'validation':
        return new ANSSIValidationAgent();
        
      case 'documentation':
        return new DocumentationAgent();
        
      case 'visualization':
        // TODO: Implement VisualizationAgent that implements AgentService
        throw new Error('VisualizationAgent pas encore implémenté');
        
      case 'generic':
        // TODO: Implémenter GenericAgent
        throw new Error('GenericAgent pas encore implémenté');
        
      default:
        throw new Error(`Type d'agent non supporté: ${type}`);
    }
  }

  /**
   * Crée un agent de fallback
   */
  private async createFallbackAgent(
    type: AgentType,
    config: AgentConfiguration,
    workshopId?: number
  ): Promise<{
    agent: AgentService | null;
    strategy: FallbackStrategy;
    warnings?: string[];
  }> {
    const warnings: string[] = [];
    
    console.log(`🔄 Tentative fallback pour agent ${type}`);
    
    // Stratégie 1: Adaptateur legacy
    if (config.fallbackStrategy === 'legacy_service') {
      const legacyAdapter = this.legacyAdapters.get(type);
      if (legacyAdapter) {
        try {
          const isAvailable = await legacyAdapter.isAvailable();
          if (isAvailable) {
            const fallbackAgent = this.createLegacyAdapterAgent(legacyAdapter, config);
            warnings.push('Utilisation adaptateur legacy');
            return {
              agent: fallbackAgent,
              strategy: 'legacy_service',
              warnings
            };
          }
        } catch (error) {
          warnings.push(`Adaptateur legacy indisponible: ${error}`);
        }
      }
    }
    
    // Stratégie 2: Logique simplifiée
    if (config.fallbackStrategy === 'simplified_logic' || config.fallbackStrategy === 'best_effort') {
      try {
        const simplifiedAgent = this.createSimplifiedAgent(type, config, workshopId);
        warnings.push('Utilisation logique simplifiée');
        return {
          agent: simplifiedAgent,
          strategy: 'simplified_logic',
          warnings
        };
      } catch (error) {
        warnings.push(`Logique simplifiée échouée: ${error}`);
      }
    }
    
    // Stratégie 3: Template-based
    if (config.fallbackStrategy === 'template_based') {
      try {
        const templateAgent = this.createTemplateBasedAgent(type, config, workshopId);
        warnings.push('Utilisation templates prédéfinis');
        return {
          agent: templateAgent,
          strategy: 'template_based',
          warnings
        };
      } catch (error) {
        warnings.push(`Templates prédéfinis échoués: ${error}`);
      }
    }
    
    // Stratégie 4: Intervention manuelle
    if (config.fallbackStrategy === 'manual_intervention') {
      const manualAgent = this.createManualInterventionAgent(type, config);
      warnings.push('Intervention manuelle requise');
      return {
        agent: manualAgent,
        strategy: 'manual_intervention',
        warnings
      };
    }
    
    // Aucun fallback disponible
    warnings.push('Aucune stratégie de fallback disponible');
    return {
      agent: null,
      strategy: 'fail_fast',
      warnings
    };
  }

  /**
   * Crée un agent adaptateur legacy
   */
  private createLegacyAdapterAgent(adapter: LegacyServiceAdapter, config: AgentConfiguration): AgentService {
    return {
      id: `legacy-${config.id}`,
      name: `Legacy ${adapter.serviceName}`,
      version: '1.0.0-legacy',
      

      
      async healthCheck(): Promise<boolean> {
        try {
          return await adapter.isAvailable();
        } catch {
          return false;
        }
      },
      
      getCapabilities(): AgentCapabilityDetails[] {
        const capabilities = adapter.getCapabilities();
        return capabilities.map(cap => ({
          id: cap,
          name: cap,
          description: `${cap} capability`,
          inputTypes: ['any'],
          outputTypes: ['any'],
          criticality: 'medium' as const
        }));
      },

      getStatus() {
        return AgentStatus.ACTIVE;
      },

      async configure(config: Record<string, any>): Promise<void> {
        console.log(`Configuration legacy agent ${adapter.serviceName}:`, config);
      },

      async executeTask(task: AgentTask): Promise<AgentResult> {
        try {
          console.log(`🔄 Exécution legacy: ${adapter.serviceName}`);
          const result = await adapter.execute(task.input, task.context);

          return {
            taskId: task.id,
            success: true,
            data: {
              ...result,
              __metadata: {
                source: 'legacy_adapter',
                adapter: adapter.serviceName,
                timestamp: new Date(),
                fallback: true
              }
            },
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-legacy',
              fallbackUsed: true
            }
          };
        } catch (error) {
          console.error(`❌ Erreur adaptateur legacy ${adapter.serviceName}:`, error);
          return {
            taskId: task.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-legacy',
              fallbackUsed: true
            }
          };
        }
      },


    };
  }

  /**
   * Crée un agent avec logique simplifiée
   */
  private createSimplifiedAgent(type: AgentType, config: AgentConfiguration, workshopId?: number): AgentService {
    return {
      id: `simplified-${config.id}`,
      name: `Simplified ${type}`,
      version: '1.0.0-simplified',
      

      
      async healthCheck(): Promise<boolean> {
        return true; // Logique simplifiée toujours disponible
      },
      
      getCapabilities(): AgentCapabilityDetails[] {
        return [{
          id: `simplified_${type}`,
          name: `Simplified ${type}`,
          description: `Simplified ${type} capability`,
          inputTypes: ['any'],
          outputTypes: ['any'],
          criticality: 'medium' as const
        }];
      },

      getStatus() {
        return AgentStatus.ACTIVE;
      },

      async configure(config: Record<string, any>): Promise<void> {
        console.log(`Configuration simplified agent ${type}:`, config);
      },

      async executeTask(task: AgentTask): Promise<AgentResult> {
        console.log(`🔄 Exécution simplifiée: ${type}`);

        try {
          let result: any;

          // Logique simplifiée selon le type d'agent
          switch (type) {
            case 'threat_modeling':
              result = {
                threats: ['Threat 1', 'Threat 2'],
                actors: ['Actor 1', 'Actor 2'],
                methodology: 'simplified'
              };
              break;

            case 'scenario_generation':
              result = {
                scenarios: ['Scenario 1', 'Scenario 2'],
                methodology: 'simplified'
              };
              break;

            case 'cyber_kill_chain':
              result = {
                phases: ['reconnaissance', 'weaponization'],
                methodology: 'simplified'
              };
              break;

            case 'security_optimization':
              result = {
                recommendations: ['Recommendation 1', 'Recommendation 2'],
                methodology: 'simplified'
              };
              break;

            case 'validation':
              result = {
                isValid: true,
                score: 0.7,
                methodology: 'simplified'
              };
              break;

            default:
              result = {
                result: `Résultat simplifié pour ${type}`,
                confidence: 0.5,
                methodology: 'simplified'
              };
          }

          return {
            taskId: task.id,
            success: true,
            data: result,
            confidence: 0.5,
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-simplified',
              fallbackUsed: true
            }
          };
        } catch (error) {
          return {
            taskId: task.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-simplified',
              fallbackUsed: true
            }
          };
        }
      },


    };
  }

  /**
   * Crée un agent basé sur des templates
   */
  private createTemplateBasedAgent(type: AgentType, config: AgentConfiguration, workshopId?: number): AgentService {
    return {
      id: `template-${config.id}`,
      name: `Template ${type}`,
      version: '1.0.0-template',
      

      
      async healthCheck(): Promise<boolean> {
        return true;
      },
      
      getCapabilities(): AgentCapabilityDetails[] {
        return [{
          id: `template_${type}`,
          name: `Template ${type}`,
          description: `Template-based ${type} capability`,
          inputTypes: ['any'],
          outputTypes: ['any'],
          criticality: 'medium' as const
        }];
      },

      getStatus() {
        return AgentStatus.ACTIVE;
      },

      async configure(config: Record<string, any>): Promise<void> {
        console.log(`Configuration template agent ${type}:`, config);
      },

      async executeTask(task: AgentTask): Promise<AgentResult> {
        console.log(`🔄 Exécution template: ${type}`);

        try {
          // Charger et utiliser des templates prédéfinis
          const template = {
            id: `template_${type}`,
            content: `Template pour ${type}`,
            methodology: 'template_based'
          };

          const result = {
            ...template,
            customizations: {
              input: task.input,
              context: task.context,
              timestamp: new Date()
            }
          };

          return {
            taskId: task.id,
            success: true,
            data: result,
            confidence: 0.7,
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-template',
              fallbackUsed: true
            }
          };
        } catch (error) {
          return {
            taskId: task.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-template',
              fallbackUsed: true
            }
          };
        }
      },


    };
  }

  /**
   * Crée un agent nécessitant une intervention manuelle
   */
  private createManualInterventionAgent(type: AgentType, config: AgentConfiguration): AgentService {
    return {
      id: `manual-${config.id}`,
      name: `Manual ${type}`,
      version: '1.0.0-manual',
      

      
      async healthCheck(): Promise<boolean> {
        return true;
      },
      
      getCapabilities(): AgentCapabilityDetails[] {
        return [{
          id: `manual_${type}`,
          name: `Manual ${type}`,
          description: `Manual intervention ${type} capability`,
          inputTypes: ['any'],
          outputTypes: ['any'],
          criticality: 'high' as const
        }];
      },

      getStatus() {
        return AgentStatus.ACTIVE;
      },

      async configure(config: Record<string, any>): Promise<void> {
        console.log(`Configuration manual agent ${type}:`, config);
      },

      async executeTask(task: AgentTask): Promise<AgentResult> {
        console.log(`👤 Intervention manuelle requise: ${type}`);

        try {
          // Enregistrer la demande d'intervention
          console.log(`Manual intervention logged for ${type}:`, task.input);

          const result = {
            status: 'manual_intervention_required',
            type,
            input: task.input,
            context: task.context,
            instructions: [
              `Intervention manuelle requise pour ${type}`,
              'Veuillez traiter cette demande manuellement',
              'Contactez l\'administrateur système'
            ]
          };

          return {
            taskId: task.id,
            success: true,
            data: result,
            confidence: 1.0, // High confidence that manual intervention is needed
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-manual',
              fallbackUsed: true
            }
          };
        } catch (error) {
          return {
            taskId: task.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              processingTime: Date.now(),
              agentVersion: '1.0.0-manual',
              fallbackUsed: true
            }
          };
        }
      },


    };
  }

  /**
   * Obtient la configuration d'un agent
   */
  private async getAgentConfiguration(
    type: AgentType,
    workshopId?: number,
    customConfig?: Partial<AgentConfiguration>
  ): Promise<AgentConfiguration> {
    // Configuration par défaut
    const defaultConfig: AgentConfiguration = {
      id: `${type}-${workshopId || 'generic'}-${Date.now()}`,
      type,
      version: '1.0.0',
      capabilities: this.getDefaultCapabilities(type),
      workshopSpecialization: workshopId ? [workshopId] : [1, 2, 3, 4, 5],
      fallbackStrategy: this.getDefaultFallbackStrategy(type),
      circuitBreakerConfig: {
        failureThreshold: 5,
        timeout: 30000,
        resetTimeout: 300000,
        halfOpenMaxCalls: 3,
        monitoringEnabled: true
      },
      performanceThresholds: {
        maxResponseTime: 30000,
        minSuccessRate: 0.8,
        maxErrorRate: 0.2,
        maxConcurrentTasks: 5
      },
      complianceRequirements: {
        ebiosCompliant: true,
        anssiFriendly: true,
        auditTrailRequired: true,
        dataRetentionDays: 365
      }
    };
    
    // Fusionner avec la configuration personnalisée
    const config = {
      ...defaultConfig,
      ...customConfig
    };
    
    // Charger depuis la base si disponible
    const savedConfig = await this.loadConfigurationFromDatabase(type, workshopId);
    if (savedConfig) {
      return {
        ...config,
        ...savedConfig
      };
    }
    
    return config;
  }

  /**
   * Obtient les capacités par défaut d'un type d'agent
   */
  private getDefaultCapabilities(type: AgentType): string[] {
    const capabilityMap: Record<AgentType, string[]> = {
      threat_modeling: ['threat_identification', 'actor_analysis', 'threat_landscape'],
      scenario_generation: ['scenario_creation', 'strategic_analysis', 'risk_assessment'],
      cyber_kill_chain: ['attack_path_analysis', 'technique_mapping', 'impact_assessment'],
      security_optimization: ['control_optimization', 'cost_analysis', 'roi_calculation'],
      validation: ['compliance_check', 'quality_assessment', 'anssi_validation'],
      documentation: ['contextual_help', 'guide_generation', 'tooltip_enhancement'],
      visualization: ['chart_generation', 'report_formatting', 'dashboard_creation'],
      generic: ['basic_analysis', 'data_processing', 'simple_recommendations']
    };
    
    return capabilityMap[type] || ['basic_functionality'];
  }

  /**
   * Obtient la stratégie de fallback par défaut
   */
  private getDefaultFallbackStrategy(type: AgentType): FallbackStrategy {
    const strategyMap: Record<AgentType, FallbackStrategy> = {
      threat_modeling: 'legacy_service',
      scenario_generation: 'template_based',
      cyber_kill_chain: 'simplified_logic',
      security_optimization: 'best_effort',
      validation: 'legacy_service',
      documentation: 'template_based',
      visualization: 'simplified_logic',
      generic: 'best_effort'
    };
    
    return strategyMap[type] || 'best_effort';
  }

  /**
   * Initialise un agent
   */
  private async initializeAgent(agent: AgentService, config: AgentConfiguration): Promise<void> {
    try {
      // Configuration spécifique si l'agent le supporte
      if ('configure' in agent && typeof agent.configure === 'function') {
        await (agent as any).configure(config);
      }
      
      // Initialisation du circuit breaker
      this.initializeCircuitBreaker(config.id, config.circuitBreakerConfig);
      
      console.log(`✅ Agent ${config.id} initialisé`);
    } catch (error) {
      console.error(`❌ Erreur initialisation agent ${config.id}:`, error);
      throw error;
    }
  }

  /**
   * Effectue un contrôle de santé initial
   */
  private async performInitialHealthCheck(agent: AgentService, agentId: string): Promise<AgentHealthStatus> {
    const startTime = Date.now();
    
    try {
      const isHealthy = await agent.healthCheck();
      const responseTime = Date.now() - startTime;
      
      const healthStatus: AgentHealthStatus = {
        agentId,
        isHealthy,
        lastCheck: new Date(),
        responseTime,
        errorCount: 0,
        circuitBreakerState: 'closed',
        fallbackAvailable: this.isFallbackAvailable(agentId),
        complianceStatus: {
          ebios: true, // À implémenter
          anssi: true, // À implémenter
          audit: true  // À implémenter
        }
      };
      
      return healthStatus;
      
    } catch (error) {
      console.error(`❌ Erreur contrôle santé agent ${agentId}:`, error);
      
      return {
        agentId,
        isHealthy: false,
        lastCheck: new Date(),
        responseTime: Date.now() - startTime,
        errorCount: 1,
        circuitBreakerState: 'closed',
        fallbackAvailable: this.isFallbackAvailable(agentId),
        complianceStatus: {
          ebios: false,
          anssi: false,
          audit: false
        }
      };
    }
  }

  /**
   * Vérifie si un agent a un fallback disponible
   */
  private isFallbackAvailable(agentId: string): boolean {
    const config = this.agentConfigurations.get(agentId);
    if (!config) return false;
    
    // Vérifier les différentes stratégies de fallback
    switch (config.fallbackStrategy) {
      case 'legacy_service':
        return this.legacyAdapters.has(config.type);
      case 'simplified_logic':
      case 'template_based':
      case 'manual_intervention':
      case 'best_effort':
        return true;
      case 'fail_fast':
        return false;
      default:
        return false;
    }
  }

  /**
   * Initialise le circuit breaker pour un agent
   */
  private initializeCircuitBreaker(agentId: string, config: CircuitBreakerConfig): void {
    // Implémentation simplifiée du circuit breaker
    const circuitBreaker = {
      state: 'closed' as 'closed' | 'open' | 'half_open',
      failureCount: 0,
      lastFailureTime: null as Date | null,
      config
    };
    
    this.circuitBreakers.set(agentId, circuitBreaker);
  }

  /**
   * Charge les configurations d'agents depuis la base
   */
  private async loadAgentConfigurations(): Promise<void> {
    try {
      const q = query(collection(db, 'ai_agents'));
      const snapshot = await getDocs(q);
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.configuration) {
          this.agentConfigurations.set(data.id, data.configuration);
        }
      });
      
      console.log(`✅ ${this.agentConfigurations.size} configurations d'agents chargées`);
    } catch (error) {
      console.error('Erreur chargement configurations agents:', error);
    }
  }

  /**
   * Initialise les adaptateurs legacy
   */
  private async initializeLegacyAdapters(): Promise<void> {
    // Adaptateur pour les services de modélisation de menaces legacy
    this.legacyAdapters.set('threat_modeling', {
      serviceName: 'LegacyThreatService',
      async isAvailable(): Promise<boolean> {
        // Vérifier la disponibilité du service legacy
        return true; // Simulé
      },
      async execute(input: any, context: any): Promise<any> {
        // Appel au service legacy
        return {
          threats: ['Legacy threat 1', 'Legacy threat 2'],
          source: 'legacy_threat_service'
        };
      },
      getCapabilities(): string[] {
        return ['legacy_threat_identification'];
      },
      getWorkshopSupport(): number[] {
        return [1, 2];
      }
    });
    
    // Adaptateur pour la validation ANSSI legacy
    this.legacyAdapters.set('validation', {
      serviceName: 'LegacyValidationService',
      async isAvailable(): Promise<boolean> {
        return true; // Simulé
      },
      async execute(input: any, context: any): Promise<any> {
        return {
          isValid: true,
          complianceScore: 0.8,
          source: 'legacy_validation_service'
        };
      },
      getCapabilities(): string[] {
        return ['legacy_anssi_validation'];
      },
      getWorkshopSupport(): number[] {
        return [1, 2, 3, 4, 5];
      }
    });
    
    console.log(`✅ ${this.legacyAdapters.size} adaptateurs legacy initialisés`);
  }

  /**
   * Démarre le monitoring de santé des agents
   */
  private startHealthMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performHealthChecks();
      } catch (error) {
        console.error('Erreur monitoring santé agents:', error);
      }
    }, 60000); // Toutes les minutes
    
    console.log('✅ Monitoring santé agents démarré');
  }

  /**
   * Effectue les contrôles de santé de tous les agents
   */
  private async performHealthChecks(): Promise<void> {
    for (const [agentId, agent] of this.agentInstances) {
      try {
        const healthStatus = await this.checkAgentHealth(agentId);
        this.healthStatuses.set(agentId, healthStatus);
        
        // Mettre à jour le circuit breaker si nécessaire
        this.updateCircuitBreaker(agentId, healthStatus);
        
      } catch (error) {
        console.error(`Erreur contrôle santé agent ${agentId}:`, error);
      }
    }
  }

  /**
   * Vérifie la santé d'un agent spécifique
   */
  async checkAgentHealth(agentId: string): Promise<AgentHealthStatus> {
    const agent = this.agentInstances.get(agentId);
    if (!agent) {
      throw new Error(`Agent non trouvé: ${agentId}`);
    }
    
    const startTime = Date.now();
    
    try {
      const isHealthy = await agent.healthCheck();
      const responseTime = Date.now() - startTime;
      
      const currentStatus = this.healthStatuses.get(agentId);
      
      return {
        agentId,
        isHealthy,
        lastCheck: new Date(),
        responseTime,
        errorCount: isHealthy ? 0 : (currentStatus?.errorCount || 0) + 1,
        circuitBreakerState: this.getCircuitBreakerState(agentId),
        fallbackAvailable: this.isFallbackAvailable(agentId),
        complianceStatus: {
          ebios: true, // À implémenter
          anssi: true, // À implémenter
          audit: true  // À implémenter
        }
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const currentStatus = this.healthStatuses.get(agentId);
      
      return {
        agentId,
        isHealthy: false,
        lastCheck: new Date(),
        responseTime,
        errorCount: (currentStatus?.errorCount || 0) + 1,
        circuitBreakerState: this.getCircuitBreakerState(agentId),
        fallbackAvailable: this.isFallbackAvailable(agentId),
        complianceStatus: {
          ebios: false,
          anssi: false,
          audit: false
        }
      };
    }
  }

  /**
   * Met à jour l'état du circuit breaker
   */
  private updateCircuitBreaker(agentId: string, healthStatus: AgentHealthStatus): void {
    const circuitBreaker = this.circuitBreakers.get(agentId);
    if (!circuitBreaker) return;
    
    if (!healthStatus.isHealthy) {
      circuitBreaker.failureCount++;
      circuitBreaker.lastFailureTime = new Date();
      
      if (circuitBreaker.failureCount >= circuitBreaker.config.failureThreshold) {
        circuitBreaker.state = 'open';
        console.warn(`🔴 Circuit breaker ouvert pour agent: ${agentId}`);
      }
    } else {
      if (circuitBreaker.state === 'half_open') {
        circuitBreaker.state = 'closed';
        circuitBreaker.failureCount = 0;
        console.log(`🟢 Circuit breaker fermé pour agent: ${agentId}`);
      }
    }
  }

  /**
   * Obtient l'état du circuit breaker
   */
  private getCircuitBreakerState(agentId: string): 'closed' | 'open' | 'half_open' {
    const circuitBreaker = this.circuitBreakers.get(agentId);
    return circuitBreaker?.state || 'closed';
  }

  // Méthodes de logique simplifiée pour les fallbacks
  
  private getSimplifiedThreatModeling(input: any, context: any): any {
    return {
      threats: [
        { id: 'T001', name: 'Menace générique 1', severity: 'medium' },
        { id: 'T002', name: 'Menace générique 2', severity: 'low' }
      ],
      confidence: 0.6,
      source: 'simplified_logic'
    };
  }
  
  private getSimplifiedScenarioGeneration(input: any, context: any): any {
    return {
      scenarios: [
        { id: 'S001', description: 'Scénario simplifié 1', likelihood: 2 }, // Échelle EBIOS RM 1-4
        { id: 'S002', description: 'Scénario simplifié 2', likelihood: 1 }  // Échelle EBIOS RM 1-4
      ],
      confidence: 2, // Échelle EBIOS RM 1-4 (2 = Faible confiance)
      source: 'simplified_logic'
    };
  }
  
  private getSimplifiedCyberKillChain(input: any, context: any): any {
    return {
      attackPaths: [
        { phase: 'reconnaissance', techniques: ['T1595'] },
        { phase: 'initial_access', techniques: ['T1566'] }
      ],
      confidence: 0.4,
      source: 'simplified_logic'
    };
  }
  
  private getSimplifiedSecurityOptimization(input: any, context: any): any {
    return {
      recommendations: [
        'Mise à jour des systèmes',
        'Formation utilisateurs',
        'Surveillance renforcée'
      ],
      confidence: 0.7,
      source: 'simplified_logic'
    };
  }
  
  private getSimplifiedValidation(input: any, context: any): any {
    return {
      isValid: true,
      complianceScore: 0.6,
      issues: [],
      confidence: 0.5,
      source: 'simplified_logic'
    };
  }

  // Méthodes utilitaires
  
  private async loadTemplate(type: AgentType, workshopId?: number): Promise<any> {
    // Charger des templates prédéfinis
    const templates = {
      threat_modeling: {
        id: 'threat_template_1',
        threats: ['Template threat 1', 'Template threat 2'],
        methodology: 'Template-based'
      },
      scenario_generation: {
        id: 'scenario_template_1',
        scenarios: ['Template scenario 1', 'Template scenario 2'],
        methodology: 'Template-based'
      },
      validation: {
        id: 'validation_template',
        content: 'Template de validation',
        methodology: 'Template-based'
      },
      cyber_kill_chain: {
        id: 'cyber_kill_chain_template',
        content: 'Template cyber kill chain',
        methodology: 'Template-based'
      },
      security_optimization: {
        id: 'security_optimization_template',
        content: 'Template optimisation sécurité',
        methodology: 'Template-based'
      },
      documentation: {
        id: 'documentation_template',
        content: 'Template documentation',
        methodology: 'Template-based'
      }
    } as any;
    
    return templates[type] || { id: 'generic_template', content: 'Template générique' };
  }
  
  private applyTemplateCustomizations(template: any, input: any, context: any): any {
    return {
      customized_at: new Date(),
      input_context: context,
      modifications: 'Personnalisations appliquées'
    };
  }
  
  private getManualInterventionInstructions(type: AgentType): string[] {
    const instructions = {
      threat_modeling: [
        'Analyser manuellement les sources de menaces',
        'Identifier les acteurs pertinents',
        'Évaluer les capacités et motivations'
      ],
      scenario_generation: [
        'Créer des scénarios stratégiques',
        'Évaluer la vraisemblance',
        'Documenter les impacts'
      ],
      cyber_kill_chain: [
        'Mapper les techniques d\'attaque',
        'Analyser les chemins d\'attaque',
        'Évaluer les impacts potentiels'
      ],
      security_optimization: [
        'Analyser les mesures existantes',
        'Identifier les optimisations',
        'Calculer le ROI des améliorations'
      ],
      validation: [
        'Vérifier la conformité ANSSI',
        'Valider la cohérence EBIOS',
        'Contrôler la qualité des livrables'
      ],
      documentation: [
        'Générer la documentation',
        'Structurer les livrables',
        'Formater selon les standards'
      ]
    } as any;
    
    return instructions[type] || ['Intervention manuelle requise'];
  }
  
  private async logAgentCreation(
    agentId: string,
    type: AgentType,
    fallbackUsed: boolean,
    fallbackType?: FallbackStrategy
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'agent_performance_metrics'), {
        agent_id: agentId,
        metric_type: 'creation',
        value: 1,
        unit: 'event',
        timestamp: new Date(),
        context: {
          type,
          fallback_used: fallbackUsed,
          fallback_type: fallbackType
        },
        aggregation_period: 'real_time',
        alert_triggered: false
      });
    } catch (error) {
      console.error('Erreur logging création agent:', error);
    }
  }
  
  private async logManualInterventionRequest(type: AgentType, input: any, context: any): Promise<void> {
    try {
      await addDoc(collection(db, 'agent_tasks'), {
        type: 'manual_intervention_request',
        agent_type: type,
        input_data: input,
        context,
        requested_at: new Date(),
        status: 'pending',
        priority: 'high'
      });
    } catch (error) {
      console.error('Erreur logging intervention manuelle:', error);
    }
  }
  
  private async loadConfigurationFromDatabase(type: AgentType, workshopId?: number): Promise<AgentConfiguration | null> {
    try {
      const q = query(
        collection(db, 'ai_agents'),
        where('type', '==', type),
        workshopId ? where('workshop_specialization', 'array-contains', workshopId) : where('type', '==', type),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        return data.configuration || null;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur chargement configuration depuis base:', error);
      return null;
    }
  }

  /**
   * Obtient un agent par ID
   */
  getAgent(agentId: string): AgentService | undefined {
    return this.agentInstances.get(agentId);
  }

  /**
   * Obtient tous les agents actifs
   */
  getActiveAgents(): AgentService[] {
    return Array.from(this.agentInstances.values());
  }

  /**
   * Obtient les statistiques de la factory
   */
  getStatistics(): {
    totalAgents: number;
    healthyAgents: number;
    agentsWithFallback: number;
    circuitBreakersOpen: number;
    legacyAdaptersAvailable: number;
  } {
    const totalAgents = this.agentInstances.size;
    const healthyAgents = Array.from(this.healthStatuses.values())
      .filter(status => status.isHealthy).length;
    const agentsWithFallback = Array.from(this.healthStatuses.values())
      .filter(status => status.fallbackAvailable).length;
    const circuitBreakersOpen = Array.from(this.circuitBreakers.values())
      .filter(cb => cb.state === 'open').length;
    const legacyAdaptersAvailable = this.legacyAdapters.size;
    
    return {
      totalAgents,
      healthyAgents,
      agentsWithFallback,
      circuitBreakersOpen,
      legacyAdaptersAvailable
    };
  }

  /**
   * Arrête la factory et nettoie les ressources
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Arrêt Agent Factory');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    // Arrêter tous les agents
    for (const [agentId, agent] of this.agentInstances) {
      try {
        if ('shutdown' in agent && typeof agent.shutdown === 'function') {
          await (agent as any).shutdown();
        }
      } catch (error) {
        console.error(`Erreur arrêt agent ${agentId}:`, error);
      }
    }
    
    this.agentInstances.clear();
    this.agentConfigurations.clear();
    this.healthStatuses.clear();
    this.circuitBreakers.clear();
    
    console.log('✅ Agent Factory arrêtée');
  }
}
/**
 * 🏭 FACTORY AGENTS EBIOS RM - PATTERN AVEC FALLBACK LEGACY
 * Implémente la création d'agents avec fallback automatique vers services legacy
 * Selon recommandations audit technique Phase 1
 */

import { EBIOSAgent, AgentConfig, AgentCapability, WorkshopAgent } from './AgentInterface';
import { LegacyServiceAdapter } from './LegacyServiceAdapter';
import { DocumentationAgent } from './specialized/DocumentationAgent';
import { VisualizationAgent } from './specialized/VisualizationAgent';
// Import des agents spécialisés (certains peuvent être optionnels)
// import { ThreatIntelligenceAgent } from './specialized/ThreatIntelligenceAgent';
// import { ScenarioGenerationAgent } from './specialized/ScenarioGenerationAgent';
// import { RiskAnalysisAgent } from './specialized/RiskAnalysisAgent';
// import { MeasureOptimizationAgent } from './specialized/MeasureOptimizationAgent';
// import { WorkflowOrchestrationAgent } from './specialized/WorkflowOrchestrationAgent';
// import { ComplianceValidationAgent } from './specialized/ComplianceValidationAgent';
import { FeatureFlags } from '../monitoring/FeatureFlags';
import { CircuitBreaker } from '../resilience/CircuitBreaker';
import { Logger } from '../logging/Logger';

export enum AgentType {
  DOCUMENTATION = 'documentation',
  VISUALIZATION = 'visualization',
  THREAT_INTELLIGENCE = 'threat_intelligence',
  SCENARIO_GENERATION = 'scenario_generation',
  RISK_ANALYSIS = 'risk_analysis',
  MEASURE_OPTIMIZATION = 'measure_optimization',
  WORKFLOW_ORCHESTRATION = 'workflow_orchestration',
  COMPLIANCE_VALIDATION = 'compliance_validation',
  WORKSHOP_1 = 'workshop_1',
  WORKSHOP_2 = 'workshop_2',
  WORKSHOP_3 = 'workshop_3',
  WORKSHOP_4 = 'workshop_4',
  WORKSHOP_5 = 'workshop_5'
}

export interface AgentFactoryConfig {
  enableAgenticMode: boolean;
  fallbackToLegacy: boolean;
  circuitBreakerEnabled: boolean;
  defaultTimeout: number;
  maxRetries: number;
  featureFlags: FeatureFlags;
}

/**
 * Factory principale pour la création d'agents EBIOS RM
 * Implémente le pattern Strategy avec fallback automatique
 */
export class AgentFactory {
  private static instance: AgentFactory;
  private config: AgentFactoryConfig;
  private circuitBreakers: Map<AgentType, CircuitBreaker> = new Map();
  private agentInstances: Map<string, EBIOSAgent> = new Map();
  private logger: Logger;

  private constructor(config: AgentFactoryConfig) {
    this.config = config;
    this.logger = new Logger('AgentFactory');
    this.initializeCircuitBreakers();
  }

  public static getInstance(config?: AgentFactoryConfig): AgentFactory {
    if (!AgentFactory.instance) {
      if (!config) {
        throw new Error('AgentFactory must be initialized with config on first call');
      }
      AgentFactory.instance = new AgentFactory(config);
    }
    return AgentFactory.instance;
  }

  /**
   * Crée un agent selon le type demandé avec fallback automatique
   */
  public async createAgent(type: AgentType, config?: Partial<AgentConfig>): Promise<EBIOSAgent> {
    const agentId = this.generateAgentId(type);
    
    try {
      // Vérification des feature flags
      if (!this.shouldUseAgenticMode(type)) {
        this.logger.info(`Feature flag disabled for ${type}, using legacy adapter`);
        return this.createLegacyAdapter(type, agentId, config);
      }

      // Vérification circuit breaker
      const circuitBreaker = this.circuitBreakers.get(type);
      if (circuitBreaker && circuitBreaker.isOpen()) {
        this.logger.warn(`Circuit breaker open for ${type}, using legacy adapter`);
        return this.createLegacyAdapter(type, agentId, config);
      }

      // Création agent agentic
      const agent = await this.createAgenticAgent(type, agentId, config);
      
      // Cache de l'instance
      this.agentInstances.set(agentId, agent);
      
      this.logger.info(`Created agentic agent: ${agentId} (${type})`);
      return agent;

    } catch (error) {
      this.logger.error(`Failed to create agentic agent ${type}:`, error);
      
      // Fallback automatique vers legacy
      if (this.config.fallbackToLegacy) {
        this.logger.info(`Falling back to legacy adapter for ${type}`);
        return this.createLegacyAdapter(type, agentId, config);
      }
      
      throw error;
    }
  }

  /**
   * Crée un agent spécialisé pour un atelier EBIOS
   */
  public async createWorkshopAgent(workshopNumber: 1 | 2 | 3 | 4 | 5, config?: Partial<AgentConfig>): Promise<WorkshopAgent> {
    const type = `workshop_${workshopNumber}` as AgentType;
    const agent = await this.createAgent(type, config);
    
    if (!this.isWorkshopAgent(agent)) {
      throw new Error(`Agent ${agent.agentId} is not a WorkshopAgent`);
    }
    
    return agent as WorkshopAgent;
  }

  /**
   * Obtient un agent existant par ID
   */
  public getAgent(agentId: string): EBIOSAgent | undefined {
    return this.agentInstances.get(agentId);
  }

  /**
   * Liste tous les agents actifs
   */
  public getActiveAgents(): EBIOSAgent[] {
    return Array.from(this.agentInstances.values());
  }

  /**
   * Arrête et supprime un agent
   */
  public async destroyAgent(agentId: string): Promise<void> {
    const agent = this.agentInstances.get(agentId);
    if (agent) {
      await agent.shutdown();
      this.agentInstances.delete(agentId);
      this.logger.info(`Destroyed agent: ${agentId}`);
    }
  }

  /**
   * Arrête tous les agents
   */
  public async shutdown(): Promise<void> {
    const shutdownPromises = Array.from(this.agentInstances.values())
      .map(agent => agent.shutdown());
    
    await Promise.allSettled(shutdownPromises);
    this.agentInstances.clear();
    this.logger.info('All agents shut down');
  }

  private async createAgenticAgent(type: AgentType, agentId: string, config?: Partial<AgentConfig>): Promise<EBIOSAgent> {
    const agentConfig = this.buildAgentConfig(type, agentId, config);
    
    switch (type) {
      case AgentType.DOCUMENTATION:
        return new DocumentationAgent(agentConfig);
      
      case AgentType.VISUALIZATION:
        return new VisualizationAgent(agentConfig);
      
      // Agents spécialisés temporairement désactivés
      case AgentType.THREAT_INTELLIGENCE:
      case AgentType.SCENARIO_GENERATION:
      case AgentType.RISK_ANALYSIS:
      case AgentType.MEASURE_OPTIMIZATION:
      case AgentType.WORKFLOW_ORCHESTRATION:
      case AgentType.COMPLIANCE_VALIDATION:
        throw new Error(`Agent type ${type} not yet implemented`);
      
      case AgentType.WORKSHOP_1:
      case AgentType.WORKSHOP_2:
      case AgentType.WORKSHOP_3:
      case AgentType.WORKSHOP_4:
      case AgentType.WORKSHOP_5:
        const workshopNumber = parseInt(type.split('_')[1]) as 1 | 2 | 3 | 4 | 5;
        return this.createWorkshopSpecificAgent(workshopNumber, agentConfig);
      
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }

  private createLegacyAdapter(type: AgentType, agentId: string, config?: Partial<AgentConfig>): EBIOSAgent {
    const agentConfig = this.buildAgentConfig(type, agentId, config);
    return new LegacyServiceAdapter(type, agentConfig);
  }

  private createWorkshopSpecificAgent(workshopNumber: 1 | 2 | 3 | 4 | 5, config: AgentConfig): WorkshopAgent {
    // Import dynamique pour éviter les dépendances circulaires
    switch (workshopNumber) {
      case 1:
        const { Workshop1Agent } = require('./workshops/Workshop1Agent');
        return new Workshop1Agent(config);
      
      case 2:
        const { Workshop2Agent } = require('./workshops/Workshop2Agent');
        return new Workshop2Agent(config);
      
      case 3:
        const { Workshop3Agent } = require('./workshops/Workshop3Agent');
        return new Workshop3Agent(config);
      
      case 4:
        const { Workshop4Agent } = require('./workshops/Workshop4Agent');
        return new Workshop4Agent(config);
      
      case 5:
        const { Workshop5Agent } = require('./workshops/Workshop5Agent');
        return new Workshop5Agent(config);
      
      default:
        throw new Error(`Invalid workshop number: ${workshopNumber}`);
    }
  }

  private buildAgentConfig(type: AgentType, agentId: string, config?: Partial<AgentConfig>): AgentConfig {
    const defaultCapabilities = this.getDefaultCapabilities(type);
    
    return {
      agentId,
      capabilities: defaultCapabilities,
      timeout: this.config.defaultTimeout,
      retryCount: this.config.maxRetries,
      fallbackEnabled: this.config.fallbackToLegacy,
      circuitBreakerConfig: {
        failureThreshold: 5,
        recoveryTimeout: 60000
      },
      ...config
    };
  }

  private getDefaultCapabilities(type: AgentType): AgentCapability[] {
    const capabilityMap: Record<AgentType, AgentCapability[]> = {
      [AgentType.DOCUMENTATION]: [AgentCapability.DOCUMENTATION],
      [AgentType.VISUALIZATION]: [AgentCapability.VISUALIZATION],
      [AgentType.THREAT_INTELLIGENCE]: [AgentCapability.THREAT_INTELLIGENCE],
      [AgentType.SCENARIO_GENERATION]: [AgentCapability.SCENARIO_GENERATION],
      [AgentType.RISK_ANALYSIS]: [AgentCapability.RISK_ANALYSIS],
      [AgentType.MEASURE_OPTIMIZATION]: [AgentCapability.MEASURE_OPTIMIZATION],
      [AgentType.WORKFLOW_ORCHESTRATION]: [AgentCapability.WORKFLOW_ORCHESTRATION],
      [AgentType.COMPLIANCE_VALIDATION]: [AgentCapability.COMPLIANCE_VALIDATION],
      [AgentType.WORKSHOP_1]: [AgentCapability.RISK_ANALYSIS, AgentCapability.COMPLIANCE_VALIDATION],
      [AgentType.WORKSHOP_2]: [AgentCapability.THREAT_INTELLIGENCE, AgentCapability.RISK_ANALYSIS],
      [AgentType.WORKSHOP_3]: [AgentCapability.SCENARIO_GENERATION, AgentCapability.RISK_ANALYSIS],
      [AgentType.WORKSHOP_4]: [AgentCapability.SCENARIO_GENERATION, AgentCapability.RISK_ANALYSIS],
      [AgentType.WORKSHOP_5]: [AgentCapability.MEASURE_OPTIMIZATION, AgentCapability.COMPLIANCE_VALIDATION]
    };
    
    return capabilityMap[type] || [];
  }

  private shouldUseAgenticMode(type: AgentType): boolean {
    if (!this.config.enableAgenticMode) {
      return false;
    }
    
    return this.config.featureFlags.isEnabled(`agent_${type}`);
  }

  private generateAgentId(type: AgentType): string {
    const timestamp = Date.now();
    const random = ((Date.now() % 1000) / 1000).toString(36).substring(2, 8);
    return `${type}_${timestamp}_${random}`;
  }

  private initializeCircuitBreakers(): void {
    if (!this.config.circuitBreakerEnabled) {
      return;
    }
    
    Object.values(AgentType).forEach(type => {
      this.circuitBreakers.set(type, new CircuitBreaker({
        failureThreshold: 5,
        recoveryTimeout: 60000,
        timeout: this.config.defaultTimeout
      }));
    });
  }

  private isWorkshopAgent(agent: EBIOSAgent): agent is WorkshopAgent {
    return 'workshopNumber' in agent && 'executeWorkshop' in agent;
  }

  /**
   * Méthodes de monitoring et métriques
   */
  public getFactoryMetrics() {
    return {
      totalAgents: this.agentInstances.size,
      agentsByType: this.getAgentsByType(),
      circuitBreakerStates: this.getCircuitBreakerStates(),
      memoryUsage: process.memoryUsage()
    };
  }

  private getAgentsByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    this.agentInstances.forEach(agent => {
      const type = agent.agentId.split('_')[0];
      counts[type] = (counts[type] || 0) + 1;
    });
    
    return counts;
  }

  private getCircuitBreakerStates(): Record<string, string> {
    const states: Record<string, string> = {};
    
    this.circuitBreakers.forEach((breaker, type) => {
      states[type] = breaker.getState();
    });
    
    return states;
  }
}
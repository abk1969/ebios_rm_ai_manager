/**
 * 🤖 GESTIONNAIRE D'AGENTS A2A
 * Coordination et gestion des 5 agents experts EBIOS RM
 * Implémentation du protocole Google A2A pour experts
 */

import { 
  A2AProtocolManager, 
  A2AProtocolFactory,
  A2AError,
  A2ATaskNotFoundError,
  A2AAgentUnavailableError
} from './A2AProtocolManager';

import {
  AgentCard,
  A2AMessage,
  A2ATask,
  A2APart,
  WorkshopContext,
  EbiosExpertProfile,
  RiskScenario,
  ThreatActor,
  ComplianceAssessment
} from '../types/AgentCardTypes';

import {
  AGENT_CARDS_CONFIG
} from '../config/AgentCardsConfig';

// 🎯 TYPES D'AGENTS DISPONIBLES
export type AgentType = 
  | 'ebios_expert'
  | 'grc_expert' 
  | 'audit_expert'
  | 'threat_intel'
  | 'orchestrator';

// 📊 RÉSULTAT D'ANALYSE MULTI-AGENTS
export interface MultiAgentAnalysisResult {
  taskId: string;
  agents: AgentType[];
  results: Map<AgentType, any>;
  consensus?: any;
  confidence: number;
  executionTime: number;
  metadata: {
    workshopId: number;
    userProfile: EbiosExpertProfile;
    complexity: string;
  };
}

// 🎼 PLAN D'ORCHESTRATION
export interface OrchestrationPlan {
  id: string;
  agents: AgentType[];
  sequence: OrchestrationStep[];
  dependencies: Map<string, string[]>;
  estimatedDuration: number;
}

export interface OrchestrationStep {
  id: string;
  agent: AgentType;
  skill: string;
  inputs: any;
  dependencies: string[];
  parallel: boolean;
}

// 🤖 GESTIONNAIRE PRINCIPAL
export class A2AAgentManager {
  private protocolManager: A2AProtocolManager;
  private agentCards: Map<AgentType, AgentCard> = new Map();
  private activeTasks: Map<string, A2ATask> = new Map();
  private agentUrls: Map<AgentType, string> = new Map();

  constructor() {
    this.protocolManager = A2AProtocolFactory.create();
    this.initializeAgents();
  }

  // 🚀 INITIALISATION DES AGENTS
  private initializeAgents(): void {
    // Configuration des URLs d'agents
    this.agentUrls.set('ebios_expert', AGENT_CARDS_CONFIG.EBIOS_EXPERT_AGENT_CARD.url);
    this.agentUrls.set('grc_expert', AGENT_CARDS_CONFIG.GRC_EXPERT_AGENT_CARD.url);
    this.agentUrls.set('audit_expert', AGENT_CARDS_CONFIG.AUDIT_EXPERT_AGENT_CARD.url);
    this.agentUrls.set('threat_intel', AGENT_CARDS_CONFIG.THREAT_INTEL_AGENT_CARD.url);
    this.agentUrls.set('orchestrator', AGENT_CARDS_CONFIG.ORCHESTRATOR_AGENT_CARD.url);

    // Stockage des agent cards
    this.agentCards.set('ebios_expert', AGENT_CARDS_CONFIG.EBIOS_EXPERT_AGENT_CARD);
    this.agentCards.set('grc_expert', AGENT_CARDS_CONFIG.GRC_EXPERT_AGENT_CARD);
    this.agentCards.set('audit_expert', AGENT_CARDS_CONFIG.AUDIT_EXPERT_AGENT_CARD);
    this.agentCards.set('threat_intel', AGENT_CARDS_CONFIG.THREAT_INTEL_AGENT_CARD);
    this.agentCards.set('orchestrator', AGENT_CARDS_CONFIG.ORCHESTRATOR_AGENT_CARD);
  }

  // 🎯 ANALYSE WORKSHOP AVEC ORCHESTRATION
  async analyzeWorkshop(
    workshopId: number,
    userProfile: EbiosExpertProfile,
    context: any,
    complexity: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'expert'
  ): Promise<MultiAgentAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // 1. Planification par l'orchestrateur
      const orchestrationPlan = await this.planOrchestration(
        workshopId, 
        userProfile, 
        context, 
        complexity
      );

      // 2. Exécution coordonnée
      const results = await this.executeOrchestrationPlan(
        orchestrationPlan,
        context
      );

      // 3. Construction du consensus
      const consensus = await this.buildConsensus(results, orchestrationPlan);

      const executionTime = Date.now() - startTime;

      return {
        taskId: orchestrationPlan.id,
        agents: orchestrationPlan.agents,
        results,
        consensus,
        confidence: this.calculateConfidence(results),
        executionTime,
        metadata: {
          workshopId,
          userProfile,
          complexity
        }
      };

    } catch (error) {
      console.error('Erreur analyse workshop multi-agents:', error);
      throw new A2AError('Échec analyse workshop', -32003, { workshopId, error });
    }
  }

  // 📋 PLANIFICATION PAR L'ORCHESTRATEUR
  private async planOrchestration(
    workshopId: number,
    userProfile: EbiosExpertProfile,
    context: any,
    complexity: string
  ): Promise<OrchestrationPlan> {
    const orchestratorUrl = this.agentUrls.get('orchestrator')!;
    
    const message: A2AMessage = {
      role: 'user',
      parts: [{
        kind: 'data',
        data: {
          task: 'plan_workshop_analysis',
          workshopId,
          userProfile,
          context,
          complexity
        }
      }],
      messageId: this.generateMessageId()
    };

    const workshopContext: WorkshopContext = {
      workshopId: workshopId as 1 | 2 | 3 | 4 | 5,
      organizationType: context.organizationType || 'enterprise',
      sector: context.sector || 'generic',
      complexity: complexity as any,
      userProfile
    };

    try {
      const task = await this.protocolManager.sendMessage(
        orchestratorUrl,
        message,
        workshopContext
      );

      // Attendre la completion de la planification
      const completedTask = await this.waitForTaskCompletion(orchestratorUrl, task.id);
      
      if (!completedTask.artifacts || completedTask.artifacts.length === 0) {
        throw new Error('Aucun plan d\'orchestration généré');
      }

      const planData = completedTask.artifacts[0].parts[0];
      if (planData.kind === 'data') {
        return planData.data as OrchestrationPlan;
      }

      throw new Error('Format de plan d\'orchestration invalide');

    } catch (error) {
      console.error('Erreur planification orchestration:', error);
      throw new A2AError('Échec planification', -32004, { workshopId, error });
    }
  }

  // ⚡ EXÉCUTION DU PLAN D'ORCHESTRATION
  private async executeOrchestrationPlan(
    plan: OrchestrationPlan,
    context: any
  ): Promise<Map<AgentType, any>> {
    const results = new Map<AgentType, any>();
    const executedSteps = new Set<string>();
    const pendingSteps = [...plan.sequence];

    while (pendingSteps.length > 0) {
      // Identifier les étapes exécutables (dépendances satisfaites)
      const executableSteps = pendingSteps.filter(step => 
        step.dependencies.every(dep => executedSteps.has(dep))
      );

      if (executableSteps.length === 0) {
        throw new Error('Deadlock détecté dans le plan d\'orchestration');
      }

      // Grouper les étapes parallèles
      const parallelSteps = executableSteps.filter(step => step.parallel);
      const sequentialSteps = executableSteps.filter(step => !step.parallel);

      // Exécuter les étapes parallèles
      if (parallelSteps.length > 0) {
        const parallelPromises = parallelSteps.map(step => 
          this.executeStep(step, context, results)
        );
        
        const parallelResults = await Promise.all(parallelPromises);
        
        parallelSteps.forEach((step, index) => {
          results.set(step.agent, parallelResults[index]);
          executedSteps.add(step.id);
          const stepIndex = pendingSteps.findIndex(s => s.id === step.id);
          if (stepIndex !== -1) pendingSteps.splice(stepIndex, 1);
        });
      }

      // Exécuter les étapes séquentielles
      for (const step of sequentialSteps) {
        const result = await this.executeStep(step, context, results);
        results.set(step.agent, result);
        executedSteps.add(step.id);
        
        const stepIndex = pendingSteps.findIndex(s => s.id === step.id);
        if (stepIndex !== -1) pendingSteps.splice(stepIndex, 1);
      }
    }

    return results;
  }

  // 🎯 EXÉCUTION D'UNE ÉTAPE
  private async executeStep(
    step: OrchestrationStep,
    context: any,
    previousResults: Map<AgentType, any>
  ): Promise<any> {
    const agentUrl = this.agentUrls.get(step.agent);
    if (!agentUrl) {
      throw new A2AAgentUnavailableError(step.agent);
    }

    // Préparer les inputs avec les résultats précédents
    const enrichedInputs = {
      ...step.inputs,
      context,
      previousResults: Object.fromEntries(previousResults)
    };

    const message: A2AMessage = {
      role: 'user',
      parts: [{
        kind: 'data',
        data: {
          skill: step.skill,
          inputs: enrichedInputs
        }
      }],
      messageId: this.generateMessageId()
    };

    try {
      const task = await this.protocolManager.sendMessage(agentUrl, message);
      const completedTask = await this.waitForTaskCompletion(agentUrl, task.id);
      
      if (!completedTask.artifacts || completedTask.artifacts.length === 0) {
        throw new Error(`Aucun résultat de l'agent ${step.agent}`);
      }

      const resultData = completedTask.artifacts[0].parts[0];
      return resultData.kind === 'data' ? resultData.data : resultData;

    } catch (error) {
      console.error(`Erreur exécution étape ${step.id}:`, error);
      throw new A2AError(`Échec étape ${step.agent}`, -32005, { step, error });
    }
  }

  // 🤝 CONSTRUCTION DU CONSENSUS
  private async buildConsensus(
    results: Map<AgentType, any>,
    plan: OrchestrationPlan
  ): Promise<any> {
    const orchestratorUrl = this.agentUrls.get('orchestrator')!;
    
    const message: A2AMessage = {
      role: 'user',
      parts: [{
        kind: 'data',
        data: {
          skill: 'expert_consensus_building',
          expertOpinions: Array.from(results.entries()).map(([agent, result]) => ({
            agent,
            opinion: result
          })),
          planId: plan.id
        }
      }],
      messageId: this.generateMessageId()
    };

    try {
      const task = await this.protocolManager.sendMessage(orchestratorUrl, message);
      const completedTask = await this.waitForTaskCompletion(orchestratorUrl, task.id);
      
      if (!completedTask.artifacts || completedTask.artifacts.length === 0) {
        throw new Error('Aucun consensus généré');
      }

      const consensusData = completedTask.artifacts[0].parts[0];
      return consensusData.kind === 'data' ? consensusData.data : consensusData;

    } catch (error) {
      console.error('Erreur construction consensus:', error);
      throw new A2AError('Échec consensus', -32006, { error });
    }
  }

  // ⏱️ ATTENTE COMPLETION TÂCHE
  private async waitForTaskCompletion(
    agentUrl: string, 
    taskId: string,
    maxWaitTime: number = 300000 // 5 minutes
  ): Promise<A2ATask> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const task = await this.protocolManager.getTask(agentUrl, taskId);
        
        if (task.status.state === 'completed') {
          return task;
        }
        
        if (task.status.state === 'failed' || task.status.state === 'canceled') {
          throw new Error(`Tâche ${taskId} échouée: ${task.status.state}`);
        }
        
        // Attendre avant la prochaine vérification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        if (error instanceof A2ATaskNotFoundError) {
          throw error;
        }
        console.warn(`Erreur vérification tâche ${taskId}:`, error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    throw new Error(`Timeout atteint pour la tâche ${taskId}`);
  }

  // 📊 CALCUL DE CONFIANCE
  private calculateConfidence(results: Map<AgentType, any>): number {
    // Algorithme de calcul de confiance basé sur la cohérence des résultats
    const resultValues = Array.from(results.values());
    
    if (resultValues.length === 0) return 0;
    if (resultValues.length === 1) return 0.8;
    
    // Analyse de cohérence simplifiée
    let coherenceScore = 0;
    let comparisons = 0;
    
    for (let i = 0; i < resultValues.length; i++) {
      for (let j = i + 1; j < resultValues.length; j++) {
        const similarity = this.calculateSimilarity(resultValues[i], resultValues[j]);
        coherenceScore += similarity;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? coherenceScore / comparisons : 0.5;
  }

  // 🔍 CALCUL DE SIMILARITÉ
  private calculateSimilarity(result1: any, result2: any): number {
    // Implémentation simplifiée - à améliorer selon les types de données
    try {
      const str1 = JSON.stringify(result1);
      const str2 = JSON.stringify(result2);
      
      if (str1 === str2) return 1.0;
      
      // Calcul de distance de Levenshtein normalisée
      const maxLength = Math.max(str1.length, str2.length);
      if (maxLength === 0) return 1.0;
      
      const distance = this.levenshteinDistance(str1, str2);
      return 1 - (distance / maxLength);
      
    } catch (error) {
      return 0.5; // Valeur par défaut en cas d'erreur
    }
  }

  // 📏 DISTANCE DE LEVENSHTEIN
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // 🆔 GÉNÉRATION ID MESSAGE
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🧹 NETTOYAGE
  cleanup(): void {
    this.protocolManager.cleanup();
    this.activeTasks.clear();
  }
}

export default A2AAgentManager;

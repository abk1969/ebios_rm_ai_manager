/**
 * 🤖 AGENT SERVICE - COUCHE D'ABSTRACTION POUR AGENTS IA
 * Implémentation progressive selon audit technique
 * ZERO BREAKING CHANGE - Compatible avec services existants
 */

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  workshop?: 1 | 2 | 3 | 4 | 5;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentTask {
  id: string;
  type: string;
  input: any;
  context?: {
    missionId?: string;
    workshop?: number;
    entityType?: string;
    entityId?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeout?: number;
}

export interface AgentResult {
  taskId: string;
  success: boolean;
  data?: any;
  error?: string;
  confidence?: number; // 0-1
  suggestions?: string[];
  metadata?: {
    processingTime: number;
    agentVersion: string;
    fallbackUsed?: boolean;
  };
}

export enum AgentStatus {
  ACTIVE = 'active',
  BUSY = 'busy',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  DISABLED = 'disabled'
}

/**
 * Interface principale pour tous les agents IA
 */
export interface AgentService {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  
  // Capacités
  getCapabilities(): AgentCapability[];
  getStatus(): AgentStatus;
  
  // Exécution
  executeTask(task: AgentTask): Promise<AgentResult>;
  
  // Santé
  healthCheck(): Promise<boolean>;
  
  // Configuration
  configure(config: Record<string, any>): Promise<void>;
}

/**
 * Registre central des agents
 */
export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentService> = new Map();
  private capabilities: Map<string, AgentCapability[]> = new Map();

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Enregistre un agent dans le registre
   */
  registerAgent(agent: AgentService): void {
    this.agents.set(agent.id, agent);
    this.capabilities.set(agent.id, agent.getCapabilities());
    
    console.log(`🤖 Agent enregistré: ${agent.name} (${agent.id})`);
  }

  /**
   * Récupère un agent par son ID
   */
  getAgent(agentId: string): AgentService | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Trouve les agents capables d'exécuter une tâche
   */
  findCapableAgents(taskType: string, workshop?: number): AgentService[] {
    const capableAgents: AgentService[] = [];
    
    for (const [agentId, capabilities] of this.capabilities.entries()) {
      const hasCapability = capabilities.some(cap => 
        cap.inputTypes.includes(taskType) && 
        (!workshop || cap.workshop === workshop)
      );
      
      if (hasCapability) {
        const agent = this.agents.get(agentId);
        if (agent && agent.getStatus() === AgentStatus.ACTIVE) {
          capableAgents.push(agent);
        }
      }
    }
    
    return capableAgents;
  }

  /**
   * Liste tous les agents actifs
   */
  getActiveAgents(): AgentService[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.getStatus() === AgentStatus.ACTIVE
    );
  }

  /**
   * Statistiques du registre
   */
  getStats(): {
    totalAgents: number;
    activeAgents: number;
    capabilities: number;
    workshops: Record<number, number>;
  } {
    const activeAgents = this.getActiveAgents();
    const allCapabilities = Array.from(this.capabilities.values()).flat();
    
    const workshopCounts: Record<number, number> = {};
    allCapabilities.forEach(cap => {
      if (cap.workshop) {
        workshopCounts[cap.workshop] = (workshopCounts[cap.workshop] || 0) + 1;
      }
    });

    return {
      totalAgents: this.agents.size,
      activeAgents: activeAgents.length,
      capabilities: allCapabilities.length,
      workshops: workshopCounts
    };
  }
}

/**
 * Adaptateur pour services existants - ZERO BREAKING CHANGE
 */
export abstract class LegacyServiceAdapter implements AgentService {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly version: string;

  protected legacyService: any;

  constructor(legacyService: any) {
    this.legacyService = legacyService;
  }

  abstract getCapabilities(): AgentCapability[];
  
  getStatus(): AgentStatus {
    // Par défaut, considérer comme actif si le service legacy existe
    return this.legacyService ? AgentStatus.ACTIVE : AgentStatus.ERROR;
  }

  abstract executeTask(task: AgentTask): Promise<AgentResult>;

  async healthCheck(): Promise<boolean> {
    try {
      // Test basique de santé du service legacy
      return this.legacyService !== null && this.legacyService !== undefined;
    } catch {
      return false;
    }
  }

  async configure(config: Record<string, any>): Promise<void> {
    // Configuration par défaut - peut être surchargée
    console.log(`Configuration agent ${this.name}:`, config);
  }
}

/**
 * 🤖 INTERFACE AGENT EBIOS RM - COUCHE ABSTRACTION
 * Interface générique pour tous les agents EBIOS selon audit technique
 * Implémente le pattern Strategy avec fallback legacy
 */

export enum AgentCapability {
  DOCUMENTATION = 'documentation',
  VISUALIZATION = 'visualization',
  THREAT_INTELLIGENCE = 'threat_intelligence',
  THREAT_MODELING = 'threat_modeling',
  SCENARIO_GENERATION = 'scenario_generation',
  RISK_ANALYSIS = 'risk_analysis',
  MEASURE_OPTIMIZATION = 'measure_optimization',
  WORKFLOW_ORCHESTRATION = 'workflow_orchestration',
  COMPLIANCE_VALIDATION = 'compliance_validation',
  WORKSHOP_EXECUTION = 'workshop_execution'
}

export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline',
  INITIALIZING = 'initializing',
  READY = 'ready',
  RUNNING = 'running',
  SHUTDOWN = 'shutdown'
}

export interface AgentConfig {
  agentId: string;
  capabilities: AgentCapability[];
  timeout: number;
  retryCount: number;
  fallbackEnabled: boolean;
  circuitBreakerConfig?: {
    failureThreshold: number;
    recoveryTimeout: number;
  };
  llmConfig?: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

export interface AgentTask {
  id: string;
  taskId: string;
  type: string;
  input: any;
  payload: any;
  data?: any;
  context?: {
    missionId?: string;
    workshop?: number;
    entityType?: string;
    entityId?: string;
  };
  correlationId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeout?: number;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  taskId: string;
  agentId?: string;
  type: string;
  data: any;
  success: boolean;
  error?: string;
  executionTime: number;
  metadata?: {
    processingTime: number;
    agentVersion: string;
    fallbackUsed?: boolean;
  };
  confidence?: number;
  reasoning?: string[];
}

export interface AgentMetrics {
  agentId?: string;
  tasksCompleted: number;
  tasksFailures: number;
  averageExecutionTime: number;
  lastHeartbeat: Date;
  uptime: number;
  errorRate: number;
}

/**
 * Interface principale pour tous les agents EBIOS RM
 */
export interface EBIOSAgent {
  readonly agentId: string;
  readonly capabilities: AgentCapability[];
  readonly status: AgentStatus;
  readonly metrics: AgentMetrics;

  /**
   * Initialise l'agent avec sa configuration
   */
  initialize(config: AgentConfig): Promise<void>;

  /**
   * Exécute une tâche assignée à l'agent
   */
  execute(task: AgentTask): Promise<AgentResult>;

  /**
   * Vérifie si l'agent peut traiter un type de tâche
   */
  canHandle(taskType: string): boolean;

  /**
   * Obtient le statut actuel de l'agent
   */
  getStatus(): AgentStatus;

  /**
   * Obtient les métriques de performance
   */
  getMetrics(): AgentMetrics;

  /**
   * Arrête proprement l'agent
   */
  shutdown(): Promise<void>;

  /**
   * Heartbeat pour monitoring
   */
  heartbeat(): Promise<void>;
}

/**
 * Interface pour les agents spécialisés EBIOS
 */
export interface WorkshopAgent extends EBIOSAgent {
  readonly workshopNumber: 1 | 2 | 3 | 4 | 5;
  
  /**
   * Exécute un atelier EBIOS complet
   */
  executeWorkshop(studyId: string, context: any): Promise<AgentResult>;
  
  /**
   * Valide les prérequis pour l'atelier
   */
  validatePrerequisites(studyId: string): Promise<boolean>;
  
  /**
   * Génère les livrables de l'atelier
   */
  generateDeliverables(studyId: string, results: any): Promise<any>;
}

/**
 * Interface pour l'orchestrateur d'agents
 */
export interface AgentOrchestrator {
  /**
   * Découvre les agents disponibles
   */
  discoverAgents(): Promise<EBIOSAgent[]>;
  
  /**
   * Planifie l'exécution d'un workflow
   */
  planWorkflow(studyId: string, requirements: any): Promise<WorkflowPlan>;
  
  /**
   * Exécute un workflow avec coordination d'agents
   */
  executeWorkflow(plan: WorkflowPlan): Promise<WorkflowResult>;
  
  /**
   * Surveille l'exécution en cours
   */
  monitorExecution(workflowId: string): Promise<ExecutionStatus>;
}

export interface WorkflowPlan {
  workflowId: string;
  studyId: string;
  phases: WorkflowPhase[];
  dependencies: WorkflowDependency[];
  estimatedDuration: number;
  fallbackStrategies: FallbackStrategy[];
}

export interface WorkflowPhase {
  phaseId: string;
  agents: EBIOSAgent[];
  tasks: AgentTask[];
  parallelExecution: boolean;
  timeout: number;
}

export interface WorkflowDependency {
  fromPhase: string;
  toPhase: string;
  condition: string;
  data: any;
}

export interface FallbackStrategy {
  trigger: string;
  action: 'retry' | 'fallback_agent' | 'legacy_service' | 'manual_intervention';
  config: any;
}

export interface WorkflowResult {
  workflowId: string;
  success: boolean;
  results: Record<string, AgentResult>;
  executionTime: number;
  errors: string[];
  fallbacksUsed: string[];
}

export interface ExecutionStatus {
  workflowId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentPhase: string;
  progress: number;
  estimatedTimeRemaining: number;
  activeAgents: string[];
}
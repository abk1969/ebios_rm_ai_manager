/**
 * 🤖 TYPES AGENTS - ARCHITECTURE AGENTIC EBIOS RM
 * Types pour l'infrastructure d'agents selon audit technique
 */

// Types de base pour les agents
export interface AgentMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface AgentConfiguration {
  enabled: boolean;
  priority: number;
  timeout: number;
  retryCount: number;
  fallbackEnabled: boolean;
  circuitBreakerConfig?: {
    failureThreshold: number;
    recoveryTimeout: number;
  };
}

// Types pour les événements d'agents
export interface AgentEvent {
  id: string;
  agentId: string;
  eventType: 'task_started' | 'task_completed' | 'task_failed' | 'agent_registered' | 'agent_error';
  payload: any;
  correlationId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Types pour les workflows EBIOS
export interface EbiosWorkflowState {
  stateId: string;
  studyId: string;
  currentWorkshop: 1 | 2 | 3 | 4 | 5;
  currentStep: string;
  stateData: Record<string, any>;
  nextActions: WorkflowAction[];
  updatedAt: Date;
  completionRate: number;
}

export interface WorkflowAction {
  id: string;
  type: 'agent_task' | 'user_input' | 'validation' | 'approval';
  description: string;
  requiredRole?: string;
  estimatedDuration?: number;
  dependencies?: string[];
}

// Types pour la traçabilité des décisions
export interface DecisionLog {
  decisionId: string;
  studyId: string;
  workshopStep: string;
  decisionData: any;
  aiRecommendation?: {
    agentId: string;
    recommendation: any;
    confidence: number;
    reasoning: string[];
  };
  humanDecision: any;
  rationale: string;
  timestamp: Date;
  userId: string;
  impactAssessment?: {
    affectedEntities: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    mitigationMeasures: string[];
  };
}

// Types pour l'orchestration A2A
export interface A2AMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  messageType: 'request' | 'response' | 'notification' | 'error';
  payload: any;
  correlationId: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  ttl?: number; // Time to live en ms
}

export interface A2AOrchestrationPlan {
  planId: string;
  studyId: string;
  workshop: number;
  agents: {
    agentId: string;
    role: string;
    dependencies: string[];
    expectedOutput: string;
  }[];
  executionOrder: string[];
  fallbackStrategy: 'sequential' | 'parallel' | 'abort';
  estimatedDuration: number;
}

// Types pour le monitoring et l'observabilité
export interface AgentMetrics {
  agentId: string;
  timestamp: Date;
  metrics: {
    // Performance
    responseTime: number;
    throughput: number;
    errorRate: number;
    
    // Ressources
    cpuUsage?: number;
    memoryUsage?: number;
    
    // Métier
    taskSuccessRate: number;
    averageConfidence: number;
    fallbackUsageRate: number;
  };
}

export interface MigrationMetrics {
  timestamp: Date;
  
  // Performance
  apiResponseTime: number;
  databaseQueryTime: number;
  agentOrchestrationOverhead: number;
  
  // Fonctionnel
  ebiosWorkflowCompletionRate: number;
  dataConsistencyScore: number;
  userSatisfactionScore: number;
  
  // Technique
  agentAvailabilityRate: number;
  circuitBreakerActivations: number;
  fallbackUsageRate: number;
  
  // Conformité
  anssiComplianceScore: number;
  validationSuccessRate: number;
  auditTrailCompleteness: number;
}

// Types pour les alertes et notifications
export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  metadata?: Record<string, any>;
}

export interface RegressionAlert extends Alert {
  regressionType: 'performance' | 'functional' | 'data_consistency' | 'compliance';
  baseline: any;
  current: any;
  threshold: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  suggestedActions: string[];
}

// Historique de validation pour agents
export interface ValidationHistoryEntry {
  id: string;
  timestamp: string;
  validationType: 'workshop' | 'entity' | 'global' | 'anssi_compliance';
  workshop?: number;
  entityType?: string;
  entityId?: string;
  validationResult: {
    isValid: boolean;
    score: number; // 0-100
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
  };
  validatedBy: 'user' | 'agent' | 'system';
  validatorId?: string;
  anssiCompliance?: {
    workshop1: number;
    workshop2: number;
    workshop3: number;
    workshop4: number;
    workshop5: number;
    overall: number;
  };
}

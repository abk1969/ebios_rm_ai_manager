/**
 * 🤖 TYPES TYPESCRIPT POUR L'IA EBIOS RM
 * Définitions de types pour tous les composants IA
 */

// === TYPES DE BASE ===

export type AISuggestionType = 'suggestion' | 'warning' | 'error' | 'best-practice' | 'optimization';
export type AISuggestionPriority = 'low' | 'medium' | 'high' | 'critical';
export type AISuggestionCategory = 
  | 'business-values' 
  | 'essential-assets' 
  | 'supporting-assets' 
  | 'stakeholders'
  | 'dreaded-events' 
  | 'security-measures' 
  | 'risk-sources' 
  | 'strategic-scenarios'
  | 'coherence' 
  | 'methodology' 
  | 'compliance';

export type AIConfidenceLevel = number; // 0-1
export type AIRelevanceScore = number; // 0-100

// === INTERFACES PRINCIPALES ===

export interface AISuggestion {
  id: string;
  type: AISuggestionType;
  priority: AISuggestionPriority;
  category: AISuggestionCategory;
  title: string;
  description: string;
  actionText?: string;
  actionData?: Record<string, any>;
  confidence: AIConfidenceLevel;
  relevance: AIRelevanceScore;
  source: 'anssi' | 'iso27005' | 'ebios-rm' | 'expert-knowledge' | 'ml-model' | 'agent-based';
  context: AIContext;
  relatedData?: any;
  createdAt: string;
  appliedAt?: string;
  isApplied: boolean;
  feedback?: AISuggestionFeedback;
}

export interface AIContext {
  missionId: string;
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  currentStep?: string;
  userProfile?: AIUserProfile;
  organizationContext?: AIOrganizationContext;
  existingData?: Record<string, any>;
  crossWorkshopData?: Record<string, any>;
}

export interface AIUserProfile {
  experienceLevel: 'novice' | 'intermediate' | 'expert';
  role: 'analyst' | 'manager' | 'consultant' | 'auditor';
  preferences: {
    suggestionFrequency: 'minimal' | 'moderate' | 'comprehensive';
    detailLevel: 'basic' | 'detailed' | 'expert';
    autoApply: boolean;
  };
}

export interface AIOrganizationContext {
  sector: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  maturityLevel: 'initial' | 'developing' | 'defined' | 'managed' | 'optimizing';
  regulations: string[];
  constraints: string[];
}

export interface AISuggestionFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  applied: boolean;
  helpful: boolean;
  timestamp: string;
}

// === SUGGESTIONS CONTEXTUELLES ===

export interface ContextualSuggestion extends AISuggestion {
  contextualRelevance: AIRelevanceScore;
  missionAlignment: AIRelevanceScore;
  sectorSpecific: boolean;
  organizationSizeRelevant: boolean;
  regulatoryCompliance: string[];
  crossWorkshopImpact: string[];
  implementationPriority: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  coherenceJustification?: string;
  globalAlignment?: AIRelevanceScore;
}

// === ANALYSE ET COHÉRENCE ===

export interface AICoherenceAnalysis {
  overallScore: AIRelevanceScore;
  issues: AICoherenceIssue[];
  recommendations: AISuggestion[];
  crossWorkshopConsistency: Record<string, AIRelevanceScore>;
  methodologyCompliance: AIRelevanceScore;
}

export interface AICoherenceIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  affectedElements: string[];
  suggestedFix?: string;
  autoFixable: boolean;
}

// === ENRICHISSEMENT IA ===

export interface AIEnrichmentMetadata {
  confidence: AIConfidenceLevel;
  sources: string[];
  tags: string[];
  relatedConcepts: string[];
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  impactAssessment?: AIImpactAssessment;
  recommendations?: string[];
  lastUpdated: string;
}

export interface AIImpactAssessment {
  businessImpact: AIRelevanceScore;
  technicalImpact: AIRelevanceScore;
  complianceImpact: AIRelevanceScore;
  overallRisk: AIRelevanceScore;
  mitigationSuggestions: string[];
}

// === ORCHESTRATION IA ===

export interface AIOrchestrationContext {
  currentWorkshop: number;
  globalContext: GlobalMissionContext;
  currentData: any;
  previousWorkshopsData: Record<string, any>;
  userPreferences: AIUserProfile;
}

export interface GlobalMissionContext {
  missionId: string;
  organizationProfile: AIOrganizationContext;
  objectives: string[];
  constraints: string[];
  timeline: {
    startDate: string;
    targetDate: string;
    currentPhase: string;
  };
  stakeholders: Array<{
    role: string;
    involvement: 'low' | 'medium' | 'high';
  }>;
}

// === AGENTS IA ===

export interface AIAgent {
  id: string;
  name: string;
  type: 'analyzer' | 'recommender' | 'validator' | 'orchestrator';
  capabilities: string[];
  specialization: AISuggestionCategory[];
  status: 'active' | 'inactive' | 'error';
  lastActivity?: string;
}

export interface AIAgentResponse {
  agentId: string;
  suggestions: AISuggestion[];
  analysis?: any;
  confidence: AIConfidenceLevel;
  processingTime: number;
  metadata: Record<string, any>;
}

// === MACHINE LEARNING ===

export interface MLPrediction {
  prediction: any;
  confidence: AIConfidenceLevel;
  features: Record<string, number>;
  modelVersion: string;
  timestamp: string;
}

export interface MLSuggestion extends AISuggestion {
  mlFeatures: Record<string, number>;
  modelConfidence: AIConfidenceLevel;
  trainingData?: {
    sampleSize: number;
    accuracy: number;
    lastTrained: string;
  };
}

// === COMMUNICATION A2A ===

export interface A2AMessage {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'notification' | 'error';
  payload: any;
  timestamp: string;
  correlationId?: string;
}

export interface A2ARequest extends A2AMessage {
  method: string;
  params: Record<string, any>;
  timeout?: number;
}

export interface A2AResponse extends A2AMessage {
  success: boolean;
  result?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// === MÉTRIQUES ET MONITORING ===

export interface AIMetrics {
  suggestionAccuracy: AIRelevanceScore;
  userSatisfaction: AIRelevanceScore;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cacheHitRate: number;
  modelPerformance: Record<string, AIRelevanceScore>;
}

export interface AIHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, {
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastCheck: string;
  }>;
  metrics: AIMetrics;
  alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

// === CONFIGURATION IA ===

export interface AIConfiguration {
  enabled: boolean;
  services: {
    suggestions: boolean;
    coherenceAnalysis: boolean;
    autoEnrichment: boolean;
    mlPredictions: boolean;
    agentOrchestration: boolean;
  };
  thresholds: {
    minConfidence: AIConfidenceLevel;
    maxSuggestions: number;
    cacheTimeout: number;
  };
  fallback: {
    enabled: boolean;
    staticSuggestions: boolean;
    offlineMode: boolean;
  };
}

// === UTILITAIRES DE TYPE ===

export type AIServiceStatus = 'initializing' | 'ready' | 'processing' | 'error' | 'offline';

export interface AIServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    processingTime: number;
    source: string;
    cached: boolean;
    timestamp: string;
  };
}

// === EXPORTS GROUPÉS ===

export type {
  // Réexport des types principaux pour faciliter l'import
  AISuggestion as Suggestion,
  AIContext as Context,
  AICoherenceAnalysis as CoherenceAnalysis,
  AIEnrichmentMetadata as EnrichmentMetadata,
  AIAgent as Agent,
  AIMetrics as Metrics
};

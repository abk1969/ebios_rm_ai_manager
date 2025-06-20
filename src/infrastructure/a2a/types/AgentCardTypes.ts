/**
 * 🎯 TYPES POUR AGENT CARDS A2A
 * Configuration des cartes d'agents selon le protocole Google A2A
 * Spécialisés pour experts EBIOS/GRC/Audit
 */

// 🔗 Types de base A2A
export interface AgentCard {
  name: string;
  version: string;
  description: string;
  provider: AgentProvider;
  url: string;
  capabilities: AgentCapabilities;
  skills: AgentSkill[];
  securitySchemes: Record<string, SecurityScheme>;
  security: string[];
  supportsAuthenticatedExtendedCard?: boolean;
  extensions?: Record<string, AgentExtension>;
}

export interface AgentProvider {
  name: string;
  url?: string;
  email?: string;
  description?: string;
}

export interface AgentCapabilities {
  streaming: boolean;
  pushNotifications: boolean;
  fileUpload: boolean;
  fileDownload: boolean;
  multiTurn: boolean;
  contextManagement: boolean;
}

export interface AgentSkill {
  name: string;
  description: string;
  inputSchema?: any;
  outputSchema?: any;
  examples?: SkillExample[];
  metadata?: Record<string, any>;
}

export interface SkillExample {
  name: string;
  description: string;
  input: any;
  output: any;
}

export interface SecurityScheme {
  type: 'bearer' | 'apiKey' | 'oauth2';
  description?: string;
  bearerFormat?: string;
  in?: 'header' | 'query' | 'cookie';
  name?: string;
  flows?: OAuth2Flows;
}

export interface OAuth2Flows {
  authorizationCode?: OAuth2Flow;
  implicit?: OAuth2Flow;
  password?: OAuth2Flow;
  clientCredentials?: OAuth2Flow;
}

export interface OAuth2Flow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

export interface AgentExtension {
  version: string;
  data: any;
}

// 🎯 TYPES SPÉCIALISÉS EBIOS RM

export interface EbiosExpertProfile {
  expertiseLevel: 'senior' | 'expert' | 'master';
  specializations: EbiosSpecialization[];
  certifications: string[];
  experienceYears: number;
  sectors: string[];
}

export type EbiosSpecialization = 
  | 'risk_analysis'
  | 'threat_modeling'
  | 'compliance_assessment'
  | 'governance_framework'
  | 'audit_methodology'
  | 'threat_intelligence'
  | 'incident_response'
  | 'business_continuity';

export interface WorkshopContext {
  workshopId: 1 | 2 | 3 | 4 | 5;
  organizationType: string;
  sector: string;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  userProfile: EbiosExpertProfile;
  previousResults?: any[];
}

// 🤖 AGENT CARDS SPÉCIALISÉS

export interface EbiosExpertAgentCard extends AgentCard {
  name: 'EbiosExpertAgent';
  skills: EbiosExpertSkill[];
  extensions: {
    ebiosMethodology: {
      version: string;
      anssiCompliant: boolean;
      supportedFrameworks: string[];
    };
  };
}

export interface GrcExpertAgentCard extends AgentCard {
  name: 'GrcExpertAgent';
  skills: GrcExpertSkill[];
  extensions: {
    grcFrameworks: {
      version: string;
      supportedStandards: string[];
      riskCalculationMethods: string[];
    };
  };
}

export interface AuditExpertAgentCard extends AgentCard {
  name: 'AuditExpertAgent';
  skills: AuditExpertSkill[];
  extensions: {
    auditMethodology: {
      version: string;
      supportedStandards: string[];
      evidenceTypes: string[];
    };
  };
}

export interface ThreatIntelAgentCard extends AgentCard {
  name: 'ThreatIntelAgent';
  skills: ThreatIntelSkill[];
  extensions: {
    threatIntelligence: {
      version: string;
      dataSources: string[];
      analysisCapabilities: string[];
    };
  };
}

export interface OrchestratorAgentCard extends AgentCard {
  name: 'OrchestratorAgent';
  skills: OrchestratorSkill[];
  extensions: {
    orchestration: {
      version: string;
      managedAgents: string[];
      workflowCapabilities: string[];
    };
  };
}

// 🎯 SKILLS SPÉCIALISÉS PAR AGENT

export interface EbiosExpertSkill extends AgentSkill {
  name: 
    | 'advanced_risk_modeling'
    | 'threat_scenario_generation'
    | 'ebios_methodology_validation'
    | 'multi_sector_analysis'
    | 'compliance_gap_assessment'
    | 'security_baseline_evaluation';
}

export interface GrcExpertSkill extends AgentSkill {
  name:
    | 'governance_framework_analysis'
    | 'risk_quantification_fair'
    | 'compliance_gap_assessment'
    | 'business_impact_modeling'
    | 'kri_kpi_calculation'
    | 'board_reporting_generation';
}

export interface AuditExpertSkill extends AgentSkill {
  name:
    | 'security_controls_assessment'
    | 'audit_evidence_analysis'
    | 'compliance_validation'
    | 'remediation_planning'
    | 'audit_report_generation'
    | 'continuous_monitoring_setup';
}

export interface ThreatIntelSkill extends AgentSkill {
  name:
    | 'apt_campaign_analysis'
    | 'threat_actor_profiling'
    | 'ioc_correlation'
    | 'attack_pattern_modeling'
    | 'threat_landscape_assessment'
    | 'predictive_threat_analysis';
}

export interface OrchestratorSkill extends AgentSkill {
  name:
    | 'multi_agent_coordination'
    | 'workflow_management'
    | 'result_aggregation'
    | 'expert_consensus_building'
    | 'dynamic_content_generation'
    | 'adaptive_difficulty_adjustment';
}

// 📊 TYPES DE DONNÉES ÉCHANGÉES

export interface RiskScenario {
  id: string;
  name: string;
  description: string;
  threatSources: string[];
  vulnerabilities: string[];
  impacts: Impact[];
  likelihood: number;
  severity: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string[];
}

export interface Impact {
  type: 'financial' | 'operational' | 'reputational' | 'regulatory';
  description: string;
  quantification?: number;
  timeframe: string;
}

export interface ThreatActor {
  id: string;
  name: string;
  type: 'nation_state' | 'cybercriminal' | 'hacktivist' | 'insider' | 'terrorist';
  sophistication: 'low' | 'medium' | 'high' | 'very_high';
  motivation: string[];
  capabilities: string[];
  ttps: string[];
  targetSectors: string[];
}

export interface ComplianceAssessment {
  framework: string;
  version: string;
  controls: ControlAssessment[];
  overallScore: number;
  gaps: ComplianceGap[];
  recommendations: string[];
}

export interface ControlAssessment {
  controlId: string;
  name: string;
  status: 'implemented' | 'partially_implemented' | 'not_implemented' | 'not_applicable';
  effectiveness: number;
  evidence: string[];
  gaps: string[];
}

export interface ComplianceGap {
  controlId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  remediation: string;
}

// 🔄 TYPES DE COMMUNICATION A2A

export interface A2AMessage {
  role: 'user' | 'agent';
  parts: A2APart[];
  messageId: string;
  taskId?: string;
  contextId?: string;
  timestamp?: string;
}

export interface A2APart {
  kind: 'text' | 'file' | 'data';
  text?: string;
  file?: A2AFile;
  data?: any;
  metadata?: Record<string, any>;
}

export interface A2AFile {
  name?: string;
  mimeType: string;
  bytes?: string; // Base64 encoded
  uri?: string;
}

export interface A2ATask {
  id: string;
  contextId?: string;
  status: A2ATaskStatus;
  artifacts?: A2AArtifact[];
  history: A2AMessage[];
  kind: 'task';
  metadata?: Record<string, any>;
}

export interface A2ATaskStatus {
  state: 'submitted' | 'working' | 'input-required' | 'completed' | 'failed' | 'canceled';
  message?: A2AMessage;
  timestamp: string;
  progress?: number;
}

export interface A2AArtifact {
  artifactId: string;
  name?: string;
  parts: A2APart[];
  metadata?: Record<string, any>;
}

export default {
  AgentCard,
  EbiosExpertAgentCard,
  GrcExpertAgentCard,
  AuditExpertAgentCard,
  ThreatIntelAgentCard,
  OrchestratorAgentCard
};

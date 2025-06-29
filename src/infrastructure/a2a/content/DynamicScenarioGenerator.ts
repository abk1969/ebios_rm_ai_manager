/**
 * 🎭 GÉNÉRATEUR DE SCÉNARIOS DYNAMIQUES
 * Génération procédurale de scénarios EBIOS RM contextualisés
 * Adaptatif selon profil expert et intelligence des menaces
 */

import { 
  EbiosExpertProfile, 
  WorkshopContext,
  RiskScenario,
  ThreatActor
} from '../types/AgentCardTypes';
import { A2AAgentManager } from '../core/A2AAgentManager';

// 🎯 TYPES POUR GÉNÉRATION DYNAMIQUE
export interface ScenarioGenerationRequest {
  userProfile: EbiosExpertProfile;
  workshopContext: WorkshopContext;
  parameters: ScenarioParameters;
  constraints: GenerationConstraint[];
  objectives: ScenarioObjective[];
}

export interface ScenarioParameters {
  count: number; // Nombre de scénarios à générer
  complexity: 'expert' | 'master';
  realism: number; // 0-1 (niveau de réalisme)
  diversity: number; // 0-1 (diversité des scénarios)
  currentEvents: boolean; // Intégrer l'actualité cyber
  sectorSpecific: boolean; // Spécificités sectorielles
  geopoliticalContext: boolean; // Contexte géopolitique
  emergingThreats: boolean; // Menaces émergentes
}

export interface GenerationConstraint {
  type: 'regulatory' | 'technical' | 'organizational' | 'temporal' | 'budgetary';
  description: string;
  severity: 'soft' | 'hard';
  impact: string[];
}

export interface ScenarioObjective {
  objective: string;
  priority: number; // 1-10
  measurement: string;
  target: number;
}

export interface GeneratedScenario {
  id: string;
  metadata: ScenarioMetadata;
  narrative: ScenarioNarrative;
  technical: TechnicalDetails;
  business: BusinessContext;
  regulatory: RegulatoryContext;
  timeline: ScenarioTimeline;
  variations: ScenarioVariation[];
  assessment: ScenarioAssessment;
}

export interface ScenarioMetadata {
  title: string;
  category: string;
  complexity: number; // 1-10
  realism: number; // 0-1
  novelty: number; // 0-1
  relevance: number; // 0-1
  generationMethod: string;
  sources: string[];
  tags: string[];
  lastUpdated: Date;
}

export interface ScenarioNarrative {
  executive: string; // Résumé exécutif
  detailed: string; // Description détaillée
  context: string; // Contexte organisationnel
  trigger: string; // Événement déclencheur
  progression: ProgressionStep[];
  outcome: string; // Résultat final
  lessons: string[]; // Leçons apprises
}

export interface ProgressionStep {
  phase: string;
  duration: string;
  events: string[];
  decisions: DecisionPoint[];
  indicators: string[];
  impacts: string[];
}

export interface DecisionPoint {
  decision: string;
  options: DecisionOption[];
  consequences: string[];
  timeframe: string;
}

export interface DecisionOption {
  option: string;
  probability: number; // 0-1
  impact: string;
  cost: number;
  effectiveness: number; // 0-1
}

export interface TechnicalDetails {
  attackVectors: AttackVector[];
  vulnerabilities: ExploitedVulnerability[];
  techniques: AttackTechnique[];
  infrastructure: AttackInfrastructure;
  indicators: TechnicalIndicator[];
  forensics: ForensicEvidence[];
}

export interface AttackVector {
  vector: string;
  sophistication: number; // 1-10
  detectability: number; // 0-1
  mitigation: string[];
  prevalence: number; // 0-1
}

export interface ExploitedVulnerability {
  cve?: string;
  type: string;
  severity: number; // CVSS score
  exploitability: number; // 0-1
  impact: string;
  mitigation: string[];
}

export interface AttackTechnique {
  mitreId?: string;
  name: string;
  description: string;
  platform: string[];
  detection: DetectionMethod[];
  mitigation: MitigationMethod[];
}

export interface DetectionMethod {
  method: string;
  effectiveness: number; // 0-1
  falsePositives: number; // 0-1
  implementation: string;
}

export interface MitigationMethod {
  control: string;
  effectiveness: number; // 0-1
  cost: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
}

export interface AttackInfrastructure {
  domains: string[];
  ips: string[];
  tools: string[];
  techniques: string[];
  attribution: AttributionIndicator[];
}

export interface AttributionIndicator {
  indicator: string;
  confidence: number; // 0-1
  uniqueness: number; // 0-1
  actor: string;
}

export interface TechnicalIndicator {
  type: 'ioc' | 'behavior' | 'anomaly';
  indicator: string;
  confidence: number; // 0-1
  context: string;
  timeline: string;
}

export interface ForensicEvidence {
  type: string;
  description: string;
  location: string;
  integrity: boolean;
  relevance: number; // 0-1
}

export interface BusinessContext {
  organization: OrganizationProfile;
  stakeholders: StakeholderProfile[];
  processes: AffectedProcess[];
  assets: CriticalAsset[];
  dependencies: BusinessDependency[];
  impacts: BusinessImpact[];
}

export interface OrganizationProfile {
  name: string;
  sector: string;
  size: string;
  geography: string[];
  maturity: SecurityMaturity;
  visibility: PublicVisibility;
}

export interface SecurityMaturity {
  overall: number; // 1-5
  governance: number;
  technical: number;
  operational: number;
  awareness: number;
}

export interface PublicVisibility {
  level: 'low' | 'medium' | 'high' | 'very_high';
  factors: string[];
  risks: string[];
}

export interface StakeholderProfile {
  role: string;
  influence: number; // 1-10
  expertise: string[];
  concerns: string[];
  decisions: string[];
}

export interface AffectedProcess {
  process: string;
  criticality: number; // 1-10
  dependencies: string[];
  recovery: RecoveryProfile;
  workarounds: string[];
}

export interface RecoveryProfile {
  rto: number; // Recovery Time Objective (hours)
  rpo: number; // Recovery Point Objective (hours)
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export interface CriticalAsset {
  asset: string;
  type: 'data' | 'system' | 'process' | 'people' | 'reputation';
  value: number; // Business value
  sensitivity: 'public' | 'internal' | 'confidential' | 'secret';
  protection: ProtectionLevel;
}

export interface ProtectionLevel {
  current: number; // 1-10
  required: number; // 1-10
  gap: number;
  measures: string[];
}

export interface BusinessDependency {
  dependency: string;
  type: 'internal' | 'external' | 'partner' | 'supplier';
  criticality: number; // 1-10
  alternatives: string[];
  risks: string[];
}

export interface BusinessImpact {
  category: 'financial' | 'operational' | 'reputational' | 'regulatory' | 'strategic';
  description: string;
  quantification: ImpactQuantification;
  timeframe: string;
  cascading: CascadingEffect[];
}

export interface ImpactQuantification {
  direct: number;
  indirect: number;
  opportunity: number;
  total: number;
  confidence: number; // 0-1
}

export interface CascadingEffect {
  effect: string;
  probability: number; // 0-1
  magnitude: number;
  timeframe: string;
}

export interface RegulatoryContext {
  frameworks: ApplicableFramework[];
  requirements: RegulatoryRequirement[];
  violations: PotentialViolation[];
  consequences: RegulatoryConsequence[];
  notifications: NotificationRequirement[];
}

export interface ApplicableFramework {
  framework: string;
  scope: string[];
  mandatory: boolean;
  deadline?: Date;
  penalties: PenaltyStructure;
}

export interface PenaltyStructure {
  financial: number;
  operational: string[];
  reputational: string[];
}

export interface RegulatoryRequirement {
  requirement: string;
  framework: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  compliance: ComplianceStatus;
  evidence: string[];
}

export interface ComplianceStatus {
  current: 'compliant' | 'partial' | 'non_compliant' | 'unknown';
  target: 'compliant';
  gap: string[];
  timeline: string;
}

export interface PotentialViolation {
  violation: string;
  framework: string;
  severity: 'minor' | 'major' | 'critical';
  probability: number; // 0-1
  consequences: string[];
}

export interface RegulatoryConsequence {
  consequence: string;
  probability: number; // 0-1
  impact: string;
  mitigation: string[];
}

export interface NotificationRequirement {
  authority: string;
  timeframe: string;
  content: string[];
  consequences: string[];
}

export interface ScenarioTimeline {
  phases: TimelinePhase[];
  milestones: TimelineMilestone[];
  decision_points: TimelineDecisionPoint[];
  escalations: TimelineEscalation[];
}

export interface TimelinePhase {
  name: string;
  duration: string;
  activities: string[];
  outcomes: string[];
  risks: string[];
}

export interface TimelineMilestone {
  milestone: string;
  date: string; // Relative to scenario start
  significance: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
}

export interface TimelineDecisionPoint {
  decision: string;
  timeframe: string;
  stakeholders: string[];
  options: string[];
  consequences: string[];
}

export interface TimelineEscalation {
  trigger: string;
  level: string;
  stakeholders: string[];
  actions: string[];
  timeline: string;
}

export interface ScenarioVariation {
  name: string;
  description: string;
  changes: VariationChange[];
  probability: number; // 0-1
  impact: string;
  learning: string[];
}

export interface VariationChange {
  aspect: string;
  original: string;
  modified: string;
  rationale: string;
}

export interface ScenarioAssessment {
  quality: QualityAssessment;
  difficulty: DifficultyAssessment;
  learning: LearningAssessment;
  realism: RealismAssessment;
  relevance: RelevanceAssessment;
}

export interface QualityAssessment {
  overall: number; // 0-1
  completeness: number; // 0-1
  consistency: number; // 0-1
  accuracy: number; // 0-1
  clarity: number; // 0-1
}

export interface DifficultyAssessment {
  analytical: number; // 1-10
  technical: number; // 1-10
  strategic: number; // 1-10
  overall: number; // 1-10
  justification: string;
}

export interface LearningAssessment {
  objectives: LearningObjective[];
  skills: SkillDevelopment[];
  competencies: CompetencyMapping[];
  assessment: AssessmentMethod[];
}

export interface LearningObjective {
  objective: string;
  level: 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation';
  measurement: string;
}

export interface SkillDevelopment {
  skill: string;
  current: number; // 1-10
  target: number; // 1-10
  development: string[];
}

export interface CompetencyMapping {
  competency: string;
  framework: string;
  level: string;
  evidence: string[];
}

export interface AssessmentMethod {
  method: string;
  criteria: string[];
  rubric: AssessmentRubric[];
}

export interface AssessmentRubric {
  criterion: string;
  levels: RubricLevel[];
  weight: number; // 0-1
}

export interface RubricLevel {
  level: string;
  description: string;
  score: number;
}

export interface RealismAssessment {
  technical: number; // 0-1
  organizational: number; // 0-1
  regulatory: number; // 0-1
  temporal: number; // 0-1
  overall: number; // 0-1
  validation: ValidationSource[];
}

export interface ValidationSource {
  source: string;
  type: 'expert' | 'literature' | 'case_study' | 'simulation';
  confidence: number; // 0-1
  reference: string;
}

export interface RelevanceAssessment {
  sector: number; // 0-1
  organization: number; // 0-1
  current: number; // 0-1
  strategic: number; // 0-1
  overall: number; // 0-1
  factors: RelevanceFactor[];
}

export interface RelevanceFactor {
  factor: string;
  weight: number; // 0-1
  score: number; // 0-1
  justification: string;
}

// 🎭 GÉNÉRATEUR PRINCIPAL
export class DynamicScenarioGenerator {
  private agentManager: A2AAgentManager;
  private scenarioTemplates: Map<string, ScenarioTemplate> = new Map();
  private threatIntelligence: ThreatIntelligenceCache;
  private sectorKnowledge: SectorKnowledgeBase;

  constructor(agentManager: A2AAgentManager) {
    this.agentManager = agentManager;
    this.threatIntelligence = new ThreatIntelligenceCache();
    this.sectorKnowledge = new SectorKnowledgeBase();
    this.initializeTemplates();
  }

  // 🎯 GÉNÉRATION PRINCIPALE
  async generateScenarios(request: ScenarioGenerationRequest): Promise<GeneratedScenario[]> {
    try {
      // 1. Analyse du contexte et enrichissement
      const enrichedContext = await this.enrichContext(request);
      
      // 2. Sélection et adaptation des templates
      const templates = await this.selectTemplates(enrichedContext);
      
      // 3. Génération procédurale
      const scenarios: GeneratedScenario[] = [];
      
      for (let i = 0; i < request.parameters.count; i++) {
        const scenario = await this.generateSingleScenario(
          templates[i % templates.length],
          enrichedContext,
          i
        );
        scenarios.push(scenario);
      }
      
      // 4. Diversification et optimisation
      const diversifiedScenarios = await this.diversifyScenarios(scenarios, request.parameters);
      
      // 5. Validation et évaluation
      const validatedScenarios = await this.validateScenarios(diversifiedScenarios, request);
      
      return validatedScenarios;

    } catch (error) {
      console.error('Erreur génération scénarios:', error);
      throw new Error(`Échec génération: ${error.message}`);
    }
  }

  // 🔧 MÉTHODES PRIVÉES
  private async enrichContext(request: ScenarioGenerationRequest): Promise<EnrichedContext> {
    // Enrichissement du contexte avec intelligence des menaces
    const threatContext = await this.agentManager.analyzeWorkshop(
      request.workshopContext.workshopId,
      request.userProfile,
      {
        type: 'threat_intelligence',
        sector: request.workshopContext.sector,
        complexity: request.parameters.complexity
      }
    );

    return {
      original: request,
      threatIntelligence: threatContext.results.get('threat_intel'),
      sectorSpecifics: this.sectorKnowledge.getSectorData(request.workshopContext.sector),
      currentEvents: await this.getCurrentCyberEvents(),
      geopoliticalContext: await this.getGeopoliticalContext(),
      emergingThreats: await this.getEmergingThreats()
    };
  }

  private async selectTemplates(context: EnrichedContext): Promise<ScenarioTemplate[]> {
    // Sélection intelligente des templates selon le contexte
    const candidates = Array.from(this.scenarioTemplates.values())
      .filter(template => this.isTemplateRelevant(template, context))
      .sort((a, b) => this.calculateTemplateScore(b, context) - this.calculateTemplateScore(a, context));

    return candidates.slice(0, Math.min(5, candidates.length));
  }

  private async generateSingleScenario(
    template: ScenarioTemplate,
    context: EnrichedContext,
    index: number
  ): Promise<GeneratedScenario> {
    // Génération d'un scénario unique basé sur le template
    const scenario: GeneratedScenario = {
      id: `scenario_${Date.now()}_${index}`,
      metadata: await this.generateMetadata(template, context),
      narrative: await this.generateNarrative(template, context),
      technical: await this.generateTechnicalDetails(template, context),
      business: await this.generateBusinessContext(template, context),
      regulatory: await this.generateRegulatoryContext(template, context),
      timeline: await this.generateTimeline(template, context),
      variations: await this.generateVariations(template, context),
      assessment: await this.assessScenario(template, context)
    };

    return scenario;
  }

  private initializeTemplates(): void {
    // Initialisation des templates de base
    this.scenarioTemplates.set('ransomware_healthcare', {
      name: 'Ransomware Healthcare',
      category: 'malware',
      complexity: 8,
      sectors: ['healthcare'],
      actors: ['cybercriminal', 'nation_state'],
      techniques: ['phishing', 'lateral_movement', 'encryption']
    });

    this.scenarioTemplates.set('supply_chain_compromise', {
      name: 'Supply Chain Compromise',
      category: 'supply_chain',
      complexity: 9,
      sectors: ['finance', 'industry', 'government'],
      actors: ['nation_state', 'apt'],
      techniques: ['software_compromise', 'persistence', 'data_exfiltration']
    });
  }

  // Méthodes à implémenter selon besoins spécifiques
  private isTemplateRelevant(template: ScenarioTemplate, context: EnrichedContext): boolean { return true; }
  private calculateTemplateScore(template: ScenarioTemplate, context: EnrichedContext): number { return 0.8; }
  private async getCurrentCyberEvents(): Promise<any> { return {}; }
  private async getGeopoliticalContext(): Promise<any> { return {}; }
  private async getEmergingThreats(): Promise<any> { return {}; }
  private async generateMetadata(template: ScenarioTemplate, context: EnrichedContext): Promise<ScenarioMetadata> { return {} as ScenarioMetadata; }
  private async generateNarrative(template: ScenarioTemplate, context: EnrichedContext): Promise<ScenarioNarrative> { return {} as ScenarioNarrative; }
  private async generateTechnicalDetails(template: ScenarioTemplate, context: EnrichedContext): Promise<TechnicalDetails> { return {} as TechnicalDetails; }
  private async generateBusinessContext(template: ScenarioTemplate, context: EnrichedContext): Promise<BusinessContext> { return {} as BusinessContext; }
  private async generateRegulatoryContext(template: ScenarioTemplate, context: EnrichedContext): Promise<RegulatoryContext> { return {} as RegulatoryContext; }
  private async generateTimeline(template: ScenarioTemplate, context: EnrichedContext): Promise<ScenarioTimeline> { return {} as ScenarioTimeline; }
  private async generateVariations(template: ScenarioTemplate, context: EnrichedContext): Promise<ScenarioVariation[]> { return []; }
  private async assessScenario(template: ScenarioTemplate, context: EnrichedContext): Promise<ScenarioAssessment> { return {} as ScenarioAssessment; }
  private async diversifyScenarios(scenarios: GeneratedScenario[], parameters: ScenarioParameters): Promise<GeneratedScenario[]> { return scenarios; }
  private async validateScenarios(scenarios: GeneratedScenario[], request: ScenarioGenerationRequest): Promise<GeneratedScenario[]> { return scenarios; }
}

// 🎯 TYPES AUXILIAIRES
interface ScenarioTemplate {
  name: string;
  category: string;
  complexity: number;
  sectors: string[];
  actors: string[];
  techniques: string[];
}

interface EnrichedContext {
  original: ScenarioGenerationRequest;
  threatIntelligence: any;
  sectorSpecifics: any;
  currentEvents: any;
  geopoliticalContext: any;
  emergingThreats: any;
}

class ThreatIntelligenceCache {
  private cache: Map<string, any> = new Map();
  
  async getLatestThreats(): Promise<any[]> {
    return [];
  }
}

class SectorKnowledgeBase {
  private sectors: Map<string, any> = new Map();
  
  getSectorData(sector: string): any {
    return this.sectors.get(sector) || {};
  }
}

export default DynamicScenarioGenerator;

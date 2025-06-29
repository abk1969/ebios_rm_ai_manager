/**
 * Workshop 3 Agent - Strategic Scenarios
 * Specializes in developing strategic scenarios and attack paths
 * Part of the EBIOS RM methodology implementation
 */

import { WorkshopAgent } from './WorkshopAgent';
import { AgentTask } from '../AgentInterface';
import {
  WorkshopContext,
  WorkshopConfiguration,
  WorkshopResult,
  WorkshopStep,
  StepInput,
  StepOutput,
  ValidationResult,
  AIContribution
} from './WorkshopAgent';
import { Logger } from '../../logging/Logger';
import { MetricsCollector } from '../../monitoring/MetricsCollector';
import { CircuitBreaker } from '../../resilience/CircuitBreaker';
import { FeatureFlags } from '../../monitoring/FeatureFlags';

// Workshop 3 specific types
export interface StrategicScenario {
  id: string;
  name: string;
  description: string;
  riskSource: string;
  businessValues: string[];
  attackPaths: string[]; // 🔧 CORRECTION: IDs des chemins d'attaque (pas les objets complets)
  likelihood: LikelihoodLevel;
  impact: ImpactLevel | number; // 🔧 CORRECTION: Support des deux types (enum et numérique)
  severity: SeverityLevel;
  timeframe: TimeHorizon;
  complexity: ComplexityLevel;
  detectability: DetectabilityLevel;
  reversibility: ReversibilityLevel;
  scope: ScopeLevel;
  cascadingEffects: CascadingEffect[];
  prerequisites: string[];
  assumptions: string[];
  limitations: string[];
  confidence: number;
  lastUpdated: Date;
  status: ScenarioStatus;
  tags: string[];

  // 🔧 CORRECTION: Propriétés utilisées dans le code
  feasibility?: number;
  priority?: number;
  riskRating?: {
    likelihood: number;
    impact: number;
    overall: number;
  };
}

export interface AttackPath {
  id: string;
  name: string;
  description: string;
  scenario: string;
  steps: AttackStep[];
  techniques: MitreTechnique[];
  tactics: MitreTactic[];
  killChain: KillChainPhase[];
  difficulty: DifficultyLevel;
  stealth: StealthLevel;
  speed: SpeedLevel;
  reliability: ReliabilityLevel;
  cost: CostLevel;
  skillRequired: SkillLevel;
  toolsRequired: string[];
  prerequisites: string[];
  indicators: string[];
  countermeasures: string[];
  alternatives: string[];
  confidence: number;
  validated: boolean;
  lastTested: Date;

  // 🔧 CORRECTION: Propriétés utilisées dans le code
  feasibility?: number; // 1-4
}

export interface AttackStep {
  id: string;
  order: number;
  name: string;
  description: string;
  technique: string;
  tactic: string;
  objective: string;
  prerequisites: string[];
  tools: string[];
  duration: Duration;
  difficulty: DifficultyLevel;
  detectability: DetectabilityLevel;
  impact: StepImpact;
  success_criteria: string[];
  failure_modes: string[];
  indicators: string[];
  mitigations: string[];
  alternatives: string[];

  // 🔧 CORRECTION: Propriétés manquantes pour MITRE ATT&CK
  mitreTechniques?: MitreTechnique[];
  mitreTactics?: MitreTactic[];
  killChainPhase?: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  description: string;
  tactic: string;
  platforms: string[];
  dataSource: string[];
  detection: string[];
  mitigation: string[];
  references: string[];
}

export interface MitreTactic {
  id: string;
  name: string;
  description: string;
  techniques: string[];
}

export interface KillChainPhase {
  phase: string;
  description: string;
  techniques: string[];
  indicators: string[];
  countermeasures: string[];
}

export interface CascadingEffect {
  id: string;
  trigger: string;
  effect: string;
  probability: number;
  delay: Duration;
  magnitude: MagnitudeLevel;
  scope: string[];
  mitigation: string[];
}

export interface Duration {
  min: number;
  max: number;
  unit: TimeUnit;
  confidence: number;
}

export interface StepImpact {
  confidentiality: ImpactLevel;
  integrity: ImpactLevel;
  availability: ImpactLevel;
  business: ImpactLevel;
  reputation: ImpactLevel;
}

export enum LikelihoodLevel {
  VERY_UNLIKELY = 'very_unlikely',
  UNLIKELY = 'unlikely',
  POSSIBLE = 'possible',
  LIKELY = 'likely',
  VERY_LIKELY = 'very_likely',
  ALMOST_CERTAIN = 'almost_certain'
}

export enum ImpactLevel {
  NEGLIGIBLE = 'negligible',
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe',
  CATASTROPHIC = 'catastrophic'
}

export enum SeverityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

export enum TimeHorizon {
  IMMEDIATE = 'immediate',
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term',
  PERSISTENT = 'persistent'
}

export enum ComplexityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum DetectabilityLevel {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

export enum ReversibilityLevel {
  FULLY_REVERSIBLE = 'fully_reversible',
  MOSTLY_REVERSIBLE = 'mostly_reversible',
  PARTIALLY_REVERSIBLE = 'partially_reversible',
  BARELY_REVERSIBLE = 'barely_reversible',
  IRREVERSIBLE = 'irreversible'
}

export enum ScopeLevel {
  ISOLATED = 'isolated',
  LIMITED = 'limited',
  MODERATE = 'moderate',
  EXTENSIVE = 'extensive',
  COMPREHENSIVE = 'comprehensive'
}

export enum ScenarioStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  VALIDATED = 'validated',
  APPROVED = 'approved',
  ARCHIVED = 'archived'
}

export enum DifficultyLevel {
  TRIVIAL = 'trivial',
  EASY = 'easy',
  MODERATE = 'moderate',
  HARD = 'hard',
  VERY_HARD = 'very_hard'
}

export enum StealthLevel {
  OVERT = 'overt',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum SpeedLevel {
  VERY_SLOW = 'very_slow',
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
  VERY_FAST = 'very_fast'
}

export enum ReliabilityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum CostLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum SkillLevel {
  NOVICE = 'novice',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master'
}

export enum TimeUnit {
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months'
}

export enum MagnitudeLevel {
  MINIMAL = 'minimal',
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe'
}

export interface ScenarioAnalysis {
  scenario: StrategicScenario;
  feasibilityAssessment: FeasibilityAssessment;
  impactAnalysis: ImpactAnalysis;
  riskAssessment: RiskAssessment;
  mitigationStrategies: MitigationStrategy[];
  detectionMethods: DetectionMethod[];
  responseActions: ResponseAction[];
  lessons: string[];
  recommendations: string[];
  confidence: number;
  analysisDate: Date;
  analyst: string;
}

export interface FeasibilityAssessment {
  technical: FeasibilityLevel;
  operational: FeasibilityLevel;
  financial: FeasibilityLevel;
  temporal: FeasibilityLevel;
  overall: FeasibilityLevel;
  barriers: string[];
  enablers: string[];
  assumptions: string[];
  confidence: number;
}

export interface ImpactAnalysis {
  primary: ImpactCategory[];
  secondary: ImpactCategory[];
  cascading: CascadingEffect[];
  timeline: ImpactTimeline;
  magnitude: ImpactMagnitude;
  scope: ImpactScope;
  reversibility: ReversibilityAssessment;
  confidence: number;
}

export interface RiskAssessment {
  likelihood: LikelihoodAssessment;
  impact: ImpactAssessment;
  risk: RiskLevel;
  factors: RiskFactor[];
  mitigatingFactors: string[];
  aggravatingFactors: string[];
  uncertainty: UncertaintyLevel;
  confidence: number;
}

export interface MitigationStrategy {
  id: string;
  name: string;
  description: string;
  type: MitigationType;
  effectiveness: EffectivenessLevel;
  cost: CostLevel;
  complexity: ComplexityLevel;
  timeToImplement: Duration;
  prerequisites: string[];
  sideEffects: string[];
  coverage: string[];
  limitations: string[];
}

export interface DetectionMethod {
  id: string;
  name: string;
  description: string;
  type: DetectionType;
  coverage: string[];
  accuracy: AccuracyLevel;
  speed: SpeedLevel;
  cost: CostLevel;
  falsePositiveRate: number;
  falseNegativeRate: number;
  requirements: string[];
  limitations: string[];
}

export interface ResponseAction {
  id: string;
  name: string;
  description: string;
  type: ResponseType;
  trigger: string;
  priority: PriorityLevel;
  timeframe: Duration;
  resources: string[];
  dependencies: string[];
  success_criteria: string[];
  risks: string[];
}

export enum FeasibilityLevel {
  IMPOSSIBLE = 'impossible',
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum RiskLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

export enum UncertaintyLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum MitigationType {
  PREVENTIVE = 'preventive',
  DETECTIVE = 'detective',
  CORRECTIVE = 'corrective',
  COMPENSATING = 'compensating',
  DETERRENT = 'deterrent'
}

export enum EffectivenessLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum DetectionType {
  SIGNATURE = 'signature',
  BEHAVIORAL = 'behavioral',
  ANOMALY = 'anomaly',
  HEURISTIC = 'heuristic',
  INTELLIGENCE = 'intelligence'
}

export enum AccuracyLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum ResponseType {
  IMMEDIATE = 'immediate',
  TACTICAL = 'tactical',
  STRATEGIC = 'strategic',
  RECOVERY = 'recovery',
  COMMUNICATION = 'communication'
}

export enum PriorityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

// Additional interfaces
export interface ImpactCategory {
  category: string;
  description: string;
  magnitude: ImpactLevel;
  probability: number;
  timeframe: Duration;
}

export interface ImpactTimeline {
  immediate: ImpactLevel;
  shortTerm: ImpactLevel;
  mediumTerm: ImpactLevel;
  longTerm: ImpactLevel;
}

export interface ImpactMagnitude {
  financial: number;
  operational: ImpactLevel;
  reputational: ImpactLevel;
  regulatory: ImpactLevel;
  strategic: ImpactLevel;
}

export interface ImpactScope {
  internal: ScopeLevel;
  external: ScopeLevel;
  geographic: string[];
  stakeholders: string[];
}

export interface ReversibilityAssessment {
  technical: ReversibilityLevel;
  operational: ReversibilityLevel;
  financial: ReversibilityLevel;
  reputational: ReversibilityLevel;
  overall: ReversibilityLevel;
}

export interface LikelihoodAssessment {
  base: LikelihoodLevel;
  adjusted: LikelihoodLevel;
  factors: string[];
  confidence: number;
}

export interface ImpactAssessment {
  base: ImpactLevel;
  adjusted: ImpactLevel;
  factors: string[];
  confidence: number;
}

export interface RiskFactor {
  factor: string;
  type: 'mitigating' | 'aggravating';
  weight: number;
  confidence: number;
}

export class Workshop3Agent extends WorkshopAgent {
  private scenarios: Map<string, StrategicScenario> = new Map();
  private attackPaths: Map<string, AttackPath> = new Map();
  private analyses: Map<string, ScenarioAnalysis> = new Map();
  private mitreTechniques: Map<string, MitreTechnique> = new Map();
  private mitreTactics: Map<string, MitreTactic> = new Map();
  private scenarioCache: Map<string, any> = new Map();

  constructor(
    logger: Logger,
    metrics: MetricsCollector,
    circuitBreaker: CircuitBreaker,
    featureFlags: FeatureFlags
  ) {
    super({
      agentId: 'workshop3',
      capabilities: [],
      timeout: 300000,
      retryCount: 3,
      fallbackEnabled: true
    }, 3);

    this.initializeKnowledgeBase();
  }

  protected async executeStepImplementation(stepId: string, inputs: any): Promise<any> {
    const step = this.workshopSteps.get(stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }
    return this.executeStepLogic(step, inputs);
  }

  protected async initializeWorkshopSteps(): Promise<void> {
    const steps = this.createWorkshopSteps();
    steps.forEach(step => this.workshopSteps.set(step.id, step));
  }

  private createWorkshopSteps(): WorkshopStep[] {
    return [
      {
        id: 'scenario_identification',
        name: 'Scenario Identification',
        description: 'Identify and define strategic scenarios based on risk sources',
        order: 1,
        required: true,
        estimatedDuration: 90,
        dependencies: [],
        inputs: [{
          id: 'risk_sources',
          name: 'Sources de risque',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }, {
          id: 'business_values',
          name: 'Valeurs métier',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }],
        outputs: [{
          id: 'strategic_scenarios',
          name: 'Scénarios stratégiques',
          type: 'array',
          format: 'json',
          destination: 'next_step'
        }],
        validations: [],
        aiCapabilities: ['scenario_generation', 'risk_analysis']
      },
      {
        id: 'attack_path_modeling',
        name: 'Attack Path Modeling',
        description: 'Model detailed attack paths for each scenario',
        order: 2,
        required: true,
        estimatedDuration: 120,
        dependencies: ['scenario_identification'],
        inputs: [{
          id: 'strategic_scenarios',
          name: 'Scénarios stratégiques',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }, {
          id: 'mitre_framework',
          name: 'Framework MITRE',
          type: 'object',
          required: true,
          source: 'external',
          validation: {}
        }],
        outputs: [{
          id: 'attack_paths',
          name: 'Chemins d\'attaque',
          type: 'array',
          format: 'json',
          destination: 'next_step'
        }],
        validations: [],
        aiCapabilities: ['attack_modeling', 'mitre_mapping']
      },
      {
        id: 'feasibility_assessment',
        name: 'Feasibility Assessment',
        description: 'Assess the feasibility of each scenario and attack path',
        order: 3,
        required: true,
        estimatedDuration: 75,
        dependencies: ['attack_path_modeling'],
        inputs: [{
          id: 'attack_paths',
          name: 'Chemins d\'attaque',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }, {
          id: 'threat_intelligence',
          name: 'Intelligence des menaces',
          type: 'object',
          required: true,
          source: 'external',
          validation: {}
        }],
        outputs: [{
          id: 'feasibility_assessments',
          name: 'Évaluations de faisabilité',
          type: 'array',
          format: 'json',
          destination: 'next_step'
        }],
        validations: [],
        aiCapabilities: ['feasibility_analysis', 'threat_assessment']
      },
      {
        id: 'impact_analysis',
        name: 'Impact Analysis',
        description: 'Analyze potential impacts and cascading effects',
        order: 4,
        required: true,
        estimatedDuration: 90,
        dependencies: ['feasibility_assessment'],
        inputs: [{
          id: 'feasibility_assessments',
          name: 'Évaluations de faisabilité',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }, {
          id: 'business_context',
          name: 'Contexte métier',
          type: 'object',
          required: true,
          source: 'external',
          validation: {}
        }],
        outputs: [{
          id: 'impact_analyses',
          name: 'Analyses d\'impact',
          type: 'array',
          format: 'json',
          destination: 'next_step'
        }],
        validations: [],
        aiCapabilities: ['impact_analysis', 'business_assessment']
      },
      {
        id: 'scenario_prioritization',
        name: 'Scenario Prioritization',
        description: 'Prioritize scenarios based on risk assessment',
        order: 5,
        required: true,
        estimatedDuration: 60,
        dependencies: ['impact_analysis'],
        inputs: [{
          id: 'impact_analyses',
          name: 'Analyses d\'impact',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }, {
          id: 'risk_criteria',
          name: 'Critères de risque',
          type: 'object',
          required: true,
          source: 'external',
          validation: {}
        }],
        outputs: [{
          id: 'prioritized_scenarios',
          name: 'Scénarios priorisés',
          type: 'array',
          format: 'json',
          destination: 'next_step'
        }],
        validations: [],
        aiCapabilities: ['risk_prioritization', 'scenario_ranking']
      }
    ];
  }

  protected async initializeWorkshopSpecific(): Promise<void> {
    // Load MITRE ATT&CK framework
    await this.loadMitreFramework();
    
    // Initialize scenario templates
    this.initializeScenarioTemplates();
    
    // Load threat intelligence
    await this.loadThreatIntelligence();
  }

  protected async executeStepLogic(step: WorkshopStep, inputs: any): Promise<any> {
    const defaultContext: WorkshopContext = {
      workshopNumber: 3 as const,
      organizationId: 'default',
      projectId: 'default',
      sessionId: 'default',
      participants: [],
      previousWorkshops: [],
      configuration: {
        language: 'fr',
        methodology: 'standard' as const,
        aiRecommendations: true,
        realTimeValidation: true,
        collaborativeMode: false,
        complianceLevel: 'strict' as const,
        customRules: []
      },
      aiAssistanceLevel: 'standard' as const
    };
    switch (step.id) {
      case 'scenario_identification':
        return await this.executeScenarioIdentification(inputs, defaultContext);
      case 'attack_path_modeling':
        return await this.executeAttackPathModeling(inputs, defaultContext);
      case 'feasibility_assessment':
        return await this.executeFeasibilityAssessment(inputs, defaultContext);
      case 'impact_analysis':
        return await this.executeImpactAnalysis(inputs, defaultContext);
      case 'scenario_prioritization':
        return await this.executeScenarioPrioritization(inputs, defaultContext);
      default:
        throw new Error(`Unknown step: ${step.id}`);
    }
  }

  protected async executeWorkshopSpecificTask(task: AgentTask): Promise<any> {
    const defaultContext: WorkshopContext = {
      workshopNumber: 3 as const,
      organizationId: 'default',
      projectId: 'default',
      sessionId: 'default',
      participants: [],
      previousWorkshops: [],
      configuration: {
        language: 'fr',
        methodology: 'standard' as const,
        aiRecommendations: true,
        realTimeValidation: true,
        collaborativeMode: false,
        complianceLevel: 'strict' as const,
        customRules: []
      },
      aiAssistanceLevel: 'standard' as const
    };
    switch (task.type) {
      case 'create_scenario':
        return await this.createScenario(task.data.riskSource, task.data.businessValues, defaultContext);
      case 'model_attack_path':
        return await this.modelAttackPath(task.data.scenarioId, task.data.techniques, defaultContext);
      case 'assess_feasibility':
        return await this.assessFeasibility(task.data.scenarioId, defaultContext);
      case 'analyze_impact':
        return await this.analyzeImpact(task.data.scenarioId, defaultContext);
      case 'calculate_risk':
        return await this.calculateRisk(task.data.scenarioId, defaultContext);
      case 'suggest_mitigations':
        return await this.suggestMitigations(task.data.scenarioId, defaultContext);
      case 'validate_scenario':
        return await this.validateScenario(task.data.scenarioId, defaultContext);
      case 'export_scenarios':
        return await this.exportScenarios(task.data.format, defaultContext);
      default:
        throw new Error(`Unknown task: ${task.type}`);
    }
  }

  protected async validateMethodology(): Promise<ValidationResult[]> {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Validate EBIOS RM methodology compliance for Workshop 3
    const scenarios = Array.from(this.scenarios.values());
    const result = { scenarios } as any;
    const scenarioCount = scenarios.length;

    // Check minimum scenario requirements
    if (scenarioCount === 0) {
      issues.push('No strategic scenarios identified');
    }

    // Check attack path modeling
    const scenariosWithPaths = scenarios.filter(s => s.attackPaths && s.attackPaths.length > 0).length;
    if (scenariosWithPaths < scenarioCount * 0.8) {
      issues.push('Insufficient attack path modeling coverage');
    }

    // Check feasibility assessment
    const scenariosWithFeasibility = scenarios.filter(s => s.impact).length;
    if (scenariosWithFeasibility < scenarioCount * 0.8) {
      issues.push('Insufficient feasibility assessment coverage');
    }

    // Check impact analysis
    const scenariosWithImpact = scenarios.filter(s => s.impact).length;
    if (scenariosWithImpact < scenarioCount * 0.8) {
      issues.push('Insufficient impact analysis coverage');
    }

    if (scenarioCount < 3) {
      warnings.push(`Only ${scenarioCount} scenarios identified - consider developing more`);
    }

    return [{
      id: `methodology_validation_${Date.now()}`,
      type: 'methodology',
      status: issues.length === 0 ? 'passed' : 'warning',
      message: issues.length === 0 ? 'Méthodologie conforme' : 'Problèmes méthodologiques détectés',
      severity: issues.length === 0 ? 'low' : 'medium',
      details: JSON.stringify({
        issues,
        warnings,
        score: this.calculateMethodologyScore(scenarios)
      }),
      autoFixable: false,
      recommendations: issues.length > 0 ? ['Réviser la méthodologie EBIOS RM', 'Compléter les éléments manquants'] : []
    }];
  }

  protected async validateCompliance(): Promise<ValidationResult[]> {
    const issues: string[] = [];
    const result = {} as any;
    const warnings: string[] = [];

    // Validate ANSSI compliance for Workshop 3
    const requiredElements = [
      'scenario_definition',
      'attack_path_modeling',
      'feasibility_assessment',
      'impact_analysis',
      'risk_evaluation'
    ];

    for (const element of requiredElements) {
      if (!result.deliverables.some((d: any) => d.content.includes(element))) { // 🔧 CORRECTION: Type explicite
        issues.push(`Missing required element: ${element}`);
      }
    }

    // Check MITRE ATT&CK integration
    const scenarios = Array.from(this.scenarios.values());
    const mitreIntegration = this.assessMitreIntegration(scenarios);
    if (mitreIntegration < 0.7) {
      warnings.push('Limited MITRE ATT&CK framework integration');
    }

    return [{
      id: `compliance_validation_${Date.now()}`,
      type: 'compliance',
      status: issues.length === 0 ? 'passed' : 'failed',
      message: issues.length === 0 ? 'Conformité respectée' : 'Non-conformités détectées',
      severity: issues.length === 0 ? 'low' : 'high',
      details: JSON.stringify({
        issues,
        warnings: [],
        score: 0.8
      }),
      autoFixable: false,
      recommendations: issues.length > 0 ? ['Corriger les non-conformités', 'Réviser les exigences'] : []
    }];
  }

  protected async validateQuality(): Promise<ValidationResult[]> {
    const issues: string[] = [];
    const result = {} as any;
    const warnings: string[] = [];

    // Validate scenario quality
    const scenarios = Array.from(this.scenarios.values());
    for (const scenario of scenarios) {
      if (scenario.confidence < 0.6) {
        warnings.push(`Low confidence scenario: ${scenario.id}`);
      }

      if (scenario.attackPaths.length === 0) {
        issues.push(`No attack paths defined for scenario: ${scenario.id}`);
      }
    }

    // Check attack path completeness
    for (const [id, path] of Array.from(this.attackPaths.entries())) {
      if (path.steps.length < 3) {
        warnings.push(`Attack path ${id} has insufficient detail`);
      }
    }

    return [{
      id: `quality_validation_${Date.now()}`,
      type: 'quality',
      status: issues.length === 0 ? 'passed' : 'warning',
      message: issues.length === 0 ? 'Qualité satisfaisante' : 'Problèmes de qualité détectés',
      severity: issues.length === 0 ? 'low' : 'medium',
      details: JSON.stringify({
        issues,
        warnings,
        score: this.calculateQualityScore(scenarios)
      }),
      autoFixable: false,
      recommendations: issues.length > 0 ? ['Améliorer la qualité des données', 'Réviser les analyses'] : []
    }];
  }

  protected async validateCompleteness(): Promise<ValidationResult[]> {
    const issues: string[] = [];
    const result = {} as any;
    const warnings: string[] = [];

    // Check scenario completeness
    const totalScenarios = this.scenarios.size;
    const analyzedScenarios = this.analyses.size;
    const completeness = analyzedScenarios / totalScenarios;

    if (completeness < 0.8) {
      issues.push(`Only ${Math.round(completeness * 100)}% of scenarios analyzed`);
    } else if (completeness < 0.9) {
      warnings.push(`${Math.round(completeness * 100)}% of scenarios analyzed - consider completing remaining`);
    }

    // Check deliverable completeness
    const expectedDeliverables = 5;
    const actualDeliverables = result.deliverables.length;
    
    if (actualDeliverables < expectedDeliverables) {
      issues.push(`Missing ${expectedDeliverables - actualDeliverables} deliverables`);
    }

    return [{
      id: `completeness_validation_${Date.now()}`,
      type: 'completeness',
      status: issues.length === 0 ? 'passed' : 'warning',
      message: issues.length === 0 ? 'Analyse complète' : 'Éléments manquants détectés',
      severity: issues.length === 0 ? 'low' : 'medium',
      details: JSON.stringify({
        issues,
        warnings,
        score: completeness
      }),
      autoFixable: false,
      recommendations: issues.length > 0 ? ['Compléter les éléments manquants', 'Réviser la documentation'] : []
    }];
  }

  // Workshop 3 specific methods
  private async executeScenarioIdentification(
    input: StepInput,
    context: WorkshopContext
  ): Promise<StepOutput> {
    const riskSources = (input as any).risk_sources || [];
    const businessValues = (input as any).business_values || [];
    const scenarios: StrategicScenario[] = [];

    for (const riskSource of riskSources) {
      for (const businessValue of businessValues) {
        const scenario = await this.generateScenario(riskSource, businessValue, context);
        if (scenario) {
          this.scenarios.set(scenario.id, scenario);
          scenarios.push(scenario);
        }
      }
    }

    return {
      id: 'strategic_scenarios',
      name: 'Scénarios stratégiques',
      type: 'StrategicScenario[]',
      format: 'json',
      destination: 'next_step',
      content: scenarios,
      metadata: {
        step: 'scenario_identification',
        timestamp: new Date(),
        confidence: 0.85,
        quality: 'high'
      }
    } as any;
  }

  private async executeAttackPathModeling(
    input: StepInput,
    context: WorkshopContext
  ): Promise<StepOutput> {
    const scenarios = (input as any).strategic_scenarios || [];
    const attackPaths: AttackPath[] = [];

    for (const scenario of scenarios) {
      const paths = await this.modelAttackPathsForScenario(scenario, context);
      attackPaths.push(...paths);
      
      // Update scenario with attack paths
      const updatedScenario = { ...scenario, attackPaths: paths.map(p => p.id) };
      this.scenarios.set(scenario.id, updatedScenario);
    }

    return {
      id: 'attack_paths',
      name: 'Chemins d\'attaque',
      type: 'AttackPath[]',
      format: 'json',
      destination: 'next_step',
      content: attackPaths,
      metadata: {
        step: 'attack_path_modeling',
        timestamp: new Date(),
        confidence: 0.8,
        quality: 'high'
      }
    } as any;
  }

  private async executeFeasibilityAssessment(
    input: StepInput,
    context: WorkshopContext
  ): Promise<StepOutput> {
    const attackPaths = (input as any).attack_paths || [];
    const feasibilityAssessments: FeasibilityAssessment[] = [];

    for (const path of attackPaths) {
      const assessment = await this.assessAttackPathFeasibility(path, context);
      feasibilityAssessments.push(assessment);
    }

    return {
      id: 'feasibility_assessments',
      name: 'Évaluations de faisabilité',
      type: 'FeasibilityAssessment[]',
      format: 'json',
      destination: 'next_step',
      content: feasibilityAssessments,
      metadata: {
        step: 'feasibility_assessment',
        timestamp: new Date(),
        confidence: 0.75,
        quality: 'medium'
      }
    } as any;
  }

  private async executeImpactAnalysis(
    input: StepInput,
    context: WorkshopContext
  ): Promise<StepOutput> {
    const feasibilityAssessments = (input as any).feasibility_assessments || [];
    const impactAnalyses: ImpactAnalysis[] = [];

    for (const assessment of feasibilityAssessments) {
      const impact = await this.analyzeScenarioImpact(assessment, context);
      impactAnalyses.push(impact);
    }

    return {
      id: 'impact_analyses',
      name: 'Analyses d\'impact',
      type: 'ImpactAnalysis[]',
      format: 'json',
      destination: 'next_step',
      content: impactAnalyses,
      metadata: {
        step: 'impact_analysis',
        timestamp: new Date(),
        confidence: 0.8,
        quality: 'high'
      }
    } as any;
  }

  private async executeScenarioPrioritization(
    input: StepInput,
    context: WorkshopContext
  ): Promise<StepOutput> {
    const impactAnalyses = (input as any).data?.impact_analyses || (input as any).impact_analyses || [];
    const prioritizedScenarios = await this.prioritizeScenarios(impactAnalyses, context);

    return {
      id: 'prioritized_scenarios',
      name: 'Scénarios priorisés',
      type: 'StrategicScenario[]',
      format: 'json',
      destination: 'next_step',
      content: prioritizedScenarios,
      metadata: {
        step: 'scenario_prioritization',
        timestamp: new Date(),
        confidence: 0.85,
        quality: 'high'
      }
    } as any;
  }

  // Helper methods
  private async generateScenario(
    riskSource: any,
    businessValue: any,
    context: WorkshopContext
  ): Promise<StrategicScenario | null> {
    const scenarioId = `scenario_${riskSource.id}_${businessValue.id}`;
    
    return {
      id: scenarioId,
      name: `${riskSource.name} targeting ${businessValue.name}`,
      description: `Strategic scenario where ${riskSource.name} compromises ${businessValue.name}`,
      riskSource: riskSource.id,
      businessValues: [businessValue.id],
      attackPaths: [],
      likelihood: LikelihoodLevel.POSSIBLE,
      impact: ImpactLevel.MODERATE,
      severity: SeverityLevel.MEDIUM,
      timeframe: TimeHorizon.MEDIUM_TERM,
      complexity: ComplexityLevel.MEDIUM,
      detectability: DetectabilityLevel.MEDIUM,
      reversibility: ReversibilityLevel.PARTIALLY_REVERSIBLE,
      scope: ScopeLevel.MODERATE,
      cascadingEffects: [],
      prerequisites: [],
      assumptions: [],
      limitations: [],
      confidence: 0.7,
      lastUpdated: new Date(),
      status: ScenarioStatus.DRAFT,
      tags: []
    };
  }

  private async modelAttackPathsForScenario(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<AttackPath[]> {
    const paths: AttackPath[] = [];
    
    // Generate primary attack path
    const primaryPath = await this.generatePrimaryAttackPath(scenario, context);
    if (primaryPath) {
      this.attackPaths.set(primaryPath.id, primaryPath);
      paths.push(primaryPath);
    }
    
    // Generate alternative attack paths
    const alternativePaths = await this.generateAlternativeAttackPaths(scenario, context);
    for (const path of alternativePaths) {
      this.attackPaths.set(path.id, path);
      paths.push(path);
    }
    
    return paths;
  }

  private async generatePrimaryAttackPath(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<AttackPath | null> {
    const pathId = `path_${scenario.id}_primary`;
    
    return {
      id: pathId,
      name: `Primary attack path for ${scenario.name}`,
      description: `Most likely attack path for scenario ${scenario.name}`,
      scenario: scenario.id,
      steps: await this.generateAttackSteps(scenario, context),
      techniques: await this.selectMitreTechniques(scenario, context),
      tactics: await this.selectMitreTactics(scenario, context),
      killChain: await this.mapToKillChain(scenario, context),
      difficulty: DifficultyLevel.MODERATE,
      stealth: StealthLevel.MEDIUM,
      speed: SpeedLevel.MEDIUM,
      reliability: ReliabilityLevel.MEDIUM,
      cost: CostLevel.MEDIUM,
      skillRequired: SkillLevel.INTERMEDIATE,
      toolsRequired: ['custom_tools', 'commercial_tools'],
      prerequisites: ['network_access', 'initial_reconnaissance'],
      indicators: ['network_anomalies', 'suspicious_processes'],
      countermeasures: ['network_monitoring', 'endpoint_protection'],
      alternatives: [],
      confidence: 0.75,
      validated: false,
      lastTested: new Date()
    };
  }

  private async generateAlternativeAttackPaths(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<AttackPath[]> {
    // Generate 1-2 alternative attack paths
    return [];
  }

  private async generateAttackSteps(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<AttackStep[]> {
    return [
      {
        id: 'step_1',
        order: 1,
        name: 'Initial Access',
        description: 'Gain initial access to target environment',
        technique: 'T1566.001',
        tactic: 'TA0001',
        objective: 'Establish foothold',
        prerequisites: ['target_identification'],
        tools: ['phishing_kit'],
        duration: { min: 1, max: 24, unit: TimeUnit.HOURS, confidence: 0.7 },
        difficulty: DifficultyLevel.EASY,
        detectability: DetectabilityLevel.MEDIUM,
        impact: {
          confidentiality: ImpactLevel.MINOR,
          integrity: ImpactLevel.NEGLIGIBLE,
          availability: ImpactLevel.NEGLIGIBLE,
          business: ImpactLevel.MINOR,
          reputation: ImpactLevel.MINOR
        },
        success_criteria: ['successful_execution', 'callback_received'],
        failure_modes: ['email_blocked', 'user_awareness'],
        indicators: ['suspicious_email', 'process_execution'],
        mitigations: ['email_filtering', 'user_training'],
        alternatives: ['watering_hole', 'supply_chain']
      }
    ];
  }

  private async selectMitreTechniques(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<MitreTechnique[]> {
    // Select relevant MITRE techniques based on scenario
    return [];
  }

  private async selectMitreTactics(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<MitreTactic[]> {
    // Select relevant MITRE tactics based on scenario
    return [];
  }

  private async mapToKillChain(
    scenario: StrategicScenario,
    context: WorkshopContext
  ): Promise<KillChainPhase[]> {
    // Map attack to cyber kill chain phases
    return [];
  }

  private async assessAttackPathFeasibility(
    path: AttackPath,
    context: WorkshopContext
  ): Promise<FeasibilityAssessment> {
    return {
      technical: FeasibilityLevel.MEDIUM,
      operational: FeasibilityLevel.MEDIUM,
      financial: FeasibilityLevel.HIGH,
      temporal: FeasibilityLevel.MEDIUM,
      overall: FeasibilityLevel.MEDIUM,
      barriers: ['security_controls', 'monitoring'],
      enablers: ['complexity', 'human_factor'],
      assumptions: ['current_security_posture'],
      confidence: 0.7
    };
  }

  private async analyzeScenarioImpact(
    assessment: FeasibilityAssessment,
    context: WorkshopContext
  ): Promise<ImpactAnalysis> {
    return {
      primary: [
        {
          category: 'financial',
          description: 'Direct financial losses',
          magnitude: ImpactLevel.MODERATE,
          probability: 0.8,
          timeframe: { min: 1, max: 30, unit: TimeUnit.DAYS, confidence: 0.7 }
        }
      ],
      secondary: [],
      cascading: [],
      timeline: {
        immediate: ImpactLevel.MINOR,
        shortTerm: ImpactLevel.MODERATE,
        mediumTerm: ImpactLevel.MAJOR,
        longTerm: ImpactLevel.MODERATE
      },
      magnitude: {
        financial: 100000,
        operational: ImpactLevel.MODERATE,
        reputational: ImpactLevel.MODERATE,
        regulatory: ImpactLevel.MINOR,
        strategic: ImpactLevel.MODERATE
      },
      scope: {
        internal: ScopeLevel.MODERATE,
        external: ScopeLevel.LIMITED,
        geographic: ['local'],
        stakeholders: ['customers', 'employees']
      },
      reversibility: {
        technical: ReversibilityLevel.MOSTLY_REVERSIBLE,
        operational: ReversibilityLevel.PARTIALLY_REVERSIBLE,
        financial: ReversibilityLevel.BARELY_REVERSIBLE,
        reputational: ReversibilityLevel.PARTIALLY_REVERSIBLE,
        overall: ReversibilityLevel.PARTIALLY_REVERSIBLE
      },
      confidence: 0.75
    };
  }

  private async prioritizeScenarios(
    impactAnalyses: ImpactAnalysis[],
    context: WorkshopContext
  ): Promise<any[]> {
    // Implement scenario prioritization logic
    return [];
  }

  // Task methods
  private async createScenario(
    riskSource: any,
    businessValues: any[],
    context: WorkshopContext
  ): Promise<StrategicScenario> {
    return await this.generateScenario(riskSource, businessValues[0], context) as StrategicScenario;
  }

  private async modelAttackPath(
    scenarioId: string,
    techniques: string[],
    context: WorkshopContext
  ): Promise<AttackPath> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }
    
    return await this.generatePrimaryAttackPath(scenario, context) as AttackPath;
  }

  private async assessFeasibility(
    scenarioId: string,
    context: WorkshopContext
  ): Promise<FeasibilityAssessment> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }
    
    // Get primary attack path
    const pathId = scenario.attackPaths[0]; // pathId is a string
    const path = this.attackPaths.get(pathId);
    
    if (!path) {
      throw new Error(`Attack path not found: ${pathId}`);
    }
    
    return await this.assessAttackPathFeasibility(path, context);
  }

  private async analyzeImpact(
    scenarioId: string,
    context: WorkshopContext
  ): Promise<ImpactAnalysis> {
    const feasibility = await this.assessFeasibility(scenarioId, context);
    return await this.analyzeScenarioImpact(feasibility, context);
  }

  private async calculateRisk(
    scenarioId: string,
    context: WorkshopContext
  ): Promise<RiskAssessment> {
    return {
      likelihood: {
        base: LikelihoodLevel.POSSIBLE,
        adjusted: LikelihoodLevel.LIKELY,
        factors: ['threat_capability', 'opportunity'],
        confidence: 0.7
      },
      impact: {
        base: ImpactLevel.MODERATE,
        adjusted: ImpactLevel.MAJOR,
        factors: ['business_criticality', 'cascading_effects'],
        confidence: 0.8
      },
      risk: RiskLevel.MEDIUM,
      factors: [
        { factor: 'security_controls', type: 'mitigating', weight: 0.3, confidence: 0.8 },
        { factor: 'threat_sophistication', type: 'aggravating', weight: 0.4, confidence: 0.7 }
      ],
      mitigatingFactors: ['security_awareness', 'monitoring'],
      aggravatingFactors: ['complexity', 'connectivity'],
      uncertainty: UncertaintyLevel.MEDIUM,
      confidence: 0.75
    };
  }

  private async suggestMitigations(
    scenarioId: string,
    context: WorkshopContext
  ): Promise<MitigationStrategy[]> {
    return [
      {
        id: 'mitigation_1',
        name: 'Enhanced Email Security',
        description: 'Implement advanced email filtering and sandboxing',
        type: MitigationType.PREVENTIVE,
        effectiveness: EffectivenessLevel.HIGH,
        cost: CostLevel.MEDIUM,
        complexity: ComplexityLevel.MEDIUM,
        timeToImplement: { min: 2, max: 4, unit: TimeUnit.WEEKS, confidence: 0.8 },
        prerequisites: ['budget_approval', 'vendor_selection'],
        sideEffects: ['false_positives', 'user_friction'],
        coverage: ['initial_access', 'phishing'],
        limitations: ['zero_day_attacks', 'social_engineering']
      }
    ];
  }

  private async validateScenario(
    scenarioId: string,
    context: WorkshopContext
  ): Promise<ValidationResult> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }
    
    const issues: string[] = [];
    const warnings: string[] = [];
    
    if (scenario.attackPaths.length === 0) {
      issues.push('No attack paths defined');
    }
    
    if (scenario.confidence < 0.6) {
      warnings.push('Low confidence scenario');
    }
    
    return {
      id: `scenario_validation_${scenarioId}`,
      type: 'quality',
      status: issues.length === 0 ? 'passed' : 'warning',
      message: issues.length === 0 ? 'Scénario valide' : 'Problèmes détectés',
      details: JSON.stringify({
        isValid: issues.length === 0,
        issues,
        warnings,
        score: scenario.confidence
      }),
      severity: issues.length === 0 ? 'low' : 'medium',
      autoFixable: false,
      recommendations: issues.length > 0 ? ['Réviser le scénario', 'Compléter les informations manquantes'] : []
    };
  }

  private async exportScenarios(
    format: string,
    context: WorkshopContext
  ): Promise<any> {
    const scenarios = Array.from(this.scenarios.values());
    
    if (format === 'json') {
      return JSON.stringify(scenarios, null, 2);
    } else if (format === 'csv') {
      return this.convertScenariosToCSV(scenarios);
    }
    
    return scenarios;
  }

  private convertScenariosToCSV(scenarios: StrategicScenario[]): string {
    const headers = ['ID', 'Name', 'Risk Source', 'Likelihood', 'Impact', 'Severity', 'Confidence'];
    const rows = scenarios.map(s => [
      s.id,
      s.name,
      s.riskSource,
      s.likelihood,
      s.impact,
      s.severity,
      s.confidence.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Knowledge base initialization
  private initializeKnowledgeBase(): void {
    // Initialize MITRE ATT&CK techniques and tactics
    this.mitreTechniques.set('T1566.001', {
      id: 'T1566.001',
      name: 'Spearphishing Attachment',
      description: 'Adversaries may send spearphishing emails with a malicious attachment',
      tactic: 'TA0001',
      platforms: ['Windows', 'macOS', 'Linux'],
      dataSource: ['Email Gateway', 'File Monitoring'],
      detection: ['Email Analysis', 'File Analysis'],
      mitigation: ['User Training', 'Email Filtering'],
      references: ['https://attack.mitre.org/techniques/T1566/001/']
    });
  }

  private async loadMitreFramework(): Promise<void> {
    // Load MITRE ATT&CK framework data
    const commonTechniques = [
      {
        id: 'T1566.001',
        name: 'Spearphishing Attachment',
        description: 'Adversaries may send spearphishing emails with a malicious attachment',
        tactic: 'TA0001',
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Email Gateway', 'File Monitoring'],
        detection: ['Email Analysis', 'File Analysis'],
        mitigation: ['User Training', 'Email Filtering'],
        references: ['https://attack.mitre.org/techniques/T1566/001/']
      },
      {
        id: 'T1078',
        name: 'Valid Accounts',
        description: 'Adversaries may obtain and abuse credentials of existing accounts',
        tactic: 'TA0001',
        platforms: ['Windows', 'macOS', 'Linux', 'Cloud'],
        dataSource: ['Authentication Logs', 'Process Monitoring'],
        detection: ['Anomalous Login Patterns', 'Privilege Escalation'],
        mitigation: ['Multi-factor Authentication', 'Account Monitoring'],
        references: ['https://attack.mitre.org/techniques/T1078/']
      },
      {
        id: 'T1055',
        name: 'Process Injection',
        description: 'Adversaries may inject code into processes to evade detection',
        tactic: 'TA0005',
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Process Monitoring', 'API Monitoring'],
        detection: ['Process Hollowing', 'DLL Injection'],
        mitigation: ['Behavior Prevention', 'Privileged Account Management'],
        references: ['https://attack.mitre.org/techniques/T1055/']
      },
      {
        id: 'T1083',
        name: 'File and Directory Discovery',
        description: 'Adversaries may enumerate files and directories',
        tactic: 'TA0007',
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['File Monitoring', 'Process Monitoring'],
        detection: ['File Access Patterns', 'Command Line Analysis'],
        mitigation: ['File System Permissions', 'User Account Management'],
        references: ['https://attack.mitre.org/techniques/T1083/']
      },
      {
        id: 'T1041',
        name: 'Exfiltration Over C2 Channel',
        description: 'Adversaries may steal data by exfiltrating it over an existing C2 channel',
        tactic: 'TA0010',
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Network Traffic', 'Process Monitoring'],
        detection: ['Network Analysis', 'Data Loss Prevention'],
        mitigation: ['Data Loss Prevention', 'Network Segmentation'],
        references: ['https://attack.mitre.org/techniques/T1041/']
      }
    ];

    const commonTactics = [
      {
        id: 'TA0001',
        name: 'Initial Access',
        description: 'The adversary is trying to get into your network',
        techniques: ['T1566.001', 'T1078', 'T1190']
      },
      {
        id: 'TA0005',
        name: 'Defense Evasion',
        description: 'The adversary is trying to avoid being detected',
        techniques: ['T1055', 'T1027', 'T1070']
      },
      {
        id: 'TA0007',
        name: 'Discovery',
        description: 'The adversary is trying to figure out your environment',
        techniques: ['T1083', 'T1057', 'T1018']
      },
      {
        id: 'TA0010',
        name: 'Exfiltration',
        description: 'The adversary is trying to steal data',
        techniques: ['T1041', 'T1048', 'T1567']
      }
    ];

    // Load techniques into the map
    for (const technique of commonTechniques) {
      this.mitreTechniques.set(technique.id, technique);
    }

    // Load tactics into the map
    for (const tactic of commonTactics) {
      this.mitreTactics.set(tactic.id, tactic);
    }

    this.logger.info('MITRE ATT&CK framework loaded', {
      techniques: this.mitreTechniques.size,
      tactics: this.mitreTactics.size
    });
  }

  private initializeScenarioTemplates(): void {
    // Initialize scenario templates for common attack scenarios
    const templates = [
      {
        id: 'phishing_template',
        name: 'Phishing Attack Template',
        description: 'Template for phishing-based attack scenarios',
        techniques: ['T1566.001', 'T1078', 'T1083'],
        tactics: ['TA0001', 'TA0007'],
        killChain: ['reconnaissance', 'weaponization', 'delivery', 'exploitation'],
        estimatedDuration: { min: 1, max: 7, unit: TimeUnit.DAYS, confidence: 0.8 },
        complexity: ComplexityLevel.LOW,
        skillRequired: SkillLevel.INTERMEDIATE
      },
      {
        id: 'insider_threat_template',
        name: 'Insider Threat Template',
        description: 'Template for insider threat scenarios',
        techniques: ['T1078', 'T1083', 'T1041'],
        tactics: ['TA0001', 'TA0007', 'TA0010'],
        killChain: ['initial_access', 'discovery', 'collection', 'exfiltration'],
        estimatedDuration: { min: 7, max: 90, unit: TimeUnit.DAYS, confidence: 0.6 },
        complexity: ComplexityLevel.MEDIUM,
        skillRequired: SkillLevel.NOVICE
      },
      {
        id: 'apt_template',
        name: 'Advanced Persistent Threat Template',
        description: 'Template for APT-style attack scenarios',
        techniques: ['T1566.001', 'T1055', 'T1083', 'T1041'],
        tactics: ['TA0001', 'TA0005', 'TA0007', 'TA0010'],
        killChain: ['reconnaissance', 'initial_access', 'persistence', 'privilege_escalation', 'defense_evasion', 'discovery', 'collection', 'exfiltration'],
        estimatedDuration: { min: 30, max: 365, unit: TimeUnit.DAYS, confidence: 0.5 },
        complexity: ComplexityLevel.VERY_HIGH,
        skillRequired: SkillLevel.EXPERT
      }
    ];

    // Store templates in cache for quick access
    for (const template of templates) {
      this.scenarioCache.set(`template_${template.id}`, template);
    }

    this.logger.info('Scenario templates initialized', { count: templates.length });
  }

  private async loadThreatIntelligence(): Promise<void> {
    // Load threat intelligence data
    const threatGroups = [
      {
        id: 'APT1',
        name: 'Comment Crew',
        description: 'Chinese cyber espionage group',
        techniques: ['T1566.001', 'T1078', 'T1055'],
        targets: ['government', 'defense', 'technology'],
        sophistication: 'high',
        activity: 'active'
      },
      {
        id: 'FIN7',
        name: 'Carbanak',
        description: 'Financially motivated threat group',
        techniques: ['T1566.001', 'T1083', 'T1041'],
        targets: ['financial', 'retail', 'hospitality'],
        sophistication: 'high',
        activity: 'active'
      },
      {
        id: 'Lazarus',
        name: 'Hidden Cobra',
        description: 'North Korean state-sponsored group',
        techniques: ['T1566.001', 'T1055', 'T1041'],
        targets: ['financial', 'cryptocurrency', 'media'],
        sophistication: 'very_high',
        activity: 'active'
      }
    ];

    const currentThreats = [
      {
        id: 'ransomware_trend',
        name: 'Ransomware as a Service',
        description: 'Increasing trend of ransomware attacks',
        likelihood: LikelihoodLevel.VERY_LIKELY,
        impact: ImpactLevel.SEVERE,
        timeframe: TimeHorizon.IMMEDIATE,
        indicators: ['double_extortion', 'supply_chain_targeting']
      },
      {
        id: 'supply_chain_attacks',
        name: 'Supply Chain Compromises',
        description: 'Attacks targeting software supply chains',
        likelihood: LikelihoodLevel.LIKELY,
        impact: ImpactLevel.MAJOR,
        timeframe: TimeHorizon.SHORT_TERM,
        indicators: ['software_updates', 'third_party_libraries']
      },
      {
        id: 'cloud_misconfigurations',
        name: 'Cloud Security Misconfigurations',
        description: 'Exploitation of cloud misconfigurations',
        likelihood: LikelihoodLevel.VERY_LIKELY,
        impact: ImpactLevel.MODERATE,
        timeframe: TimeHorizon.IMMEDIATE,
        indicators: ['exposed_databases', 'weak_access_controls']
      }
    ];

    // Store threat intelligence in cache
    this.scenarioCache.set('threat_groups', threatGroups);
    this.scenarioCache.set('current_threats', currentThreats);

    this.logger.info('Threat intelligence loaded', {
      threatGroups: threatGroups.length,
      currentThreats: currentThreats.length
    });
  }

  private calculateMethodologyScore(scenarios: StrategicScenario[]): number {
    if (scenarios.length === 0) return 0;

    let totalScore = 0;
    let validScenarios = 0;

    for (const scenario of scenarios) {
      let scenarioScore = 0;
      let criteria = 0;

      // Check if scenario has proper structure (20%)
      if (scenario.attackPaths && scenario.attackPaths.length > 0) {
        scenarioScore += 0.2;
      }
      criteria++;

      // Check if attack paths have MITRE mapping (25%)
      const hasMitreMapping = scenario.attackPaths.some(pathId => {
        const path = this.attackPaths.get(pathId);
        return path && path.steps && path.steps.some(step => step.mitreTechniques && step.mitreTechniques.length > 0);
      });
      if (hasMitreMapping) {
        scenarioScore += 0.25;
      }
      criteria++;

      // Check if scenario has feasibility assessment (20%)
      if (scenario.feasibility !== undefined && scenario.feasibility > 0) {
        scenarioScore += 0.2;
      }
      criteria++;

      // Check if scenario has impact analysis (20%)
      if (scenario.impact !== undefined && typeof scenario.impact === 'number' && scenario.impact > 0) {
        scenarioScore += 0.2;
      }
      criteria++;

      // Check if scenario has risk rating (15%)
      if (scenario.riskRating && scenario.riskRating.overall !== undefined) {
        scenarioScore += 0.15;
      }
      criteria++;

      if (criteria > 0) {
        totalScore += scenarioScore;
        validScenarios++;
      }
    }

    return validScenarios > 0 ? totalScore / validScenarios : 0;
  }

  protected calculateComplianceScore(): number {
    const scenarios = Array.from(this.scenarios.values());
    if (scenarios.length === 0) return 0;

    let complianceScore = 0;
    let totalChecks = 0;

    // ANSSI EBIOS RM compliance checks
    const requiredElements = [
      'strategic_scenarios_identified',
      'attack_paths_modeled',
      'feasibility_assessed',
      'impact_analyzed',
      'risk_calculated'
    ];

    // Check if minimum number of scenarios (3-10 recommended)
    if (scenarios.length >= 3 && scenarios.length <= 10) {
      complianceScore += 0.2;
    }
    totalChecks++;

    // Check if scenarios cover different attack vectors
    const attackVectors = new Set();
    scenarios.forEach(scenario => {
      scenario.attackPaths.forEach(pathId => {
        const path = this.attackPaths.get(pathId);
        if (path && path.steps && path.steps.length > 0) {
          attackVectors.add(path.steps[0].description.toLowerCase());
        }
      });
    });
    if (attackVectors.size >= 3) {
      complianceScore += 0.2;
    }
    totalChecks++;

    // Check if scenarios have proper risk assessment
    const properlyAssessed = scenarios.filter(scenario => 
      scenario.riskRating && 
      scenario.feasibility && 
      scenario.impact
    ).length;
    if (properlyAssessed / scenarios.length >= 0.8) {
      complianceScore += 0.3;
    }
    totalChecks++;

    // Check if MITRE ATT&CK framework is used
    const mitreUsage = scenarios.filter(scenario =>
      scenario.attackPaths.some(pathId => {
        const path = this.attackPaths.get(pathId);
        return path && path.steps && path.steps.some(step => step.mitreTechniques && step.mitreTechniques.length > 0);
      })
    ).length;
    if (mitreUsage / scenarios.length >= 0.7) {
      complianceScore += 0.2;
    }
    totalChecks++;

    // Check if scenarios are prioritized
    const prioritized = scenarios.filter(scenario => 
      scenario.priority !== undefined
    ).length;
    if (prioritized / scenarios.length >= 0.9) {
      complianceScore += 0.1;
    }
    totalChecks++;

    return totalChecks > 0 ? complianceScore : 0;
  }

  private calculateQualityScore(scenarios: StrategicScenario[]): number {
    if (scenarios.length === 0) return 0;

    let totalQuality = 0;
    let validScenarios = 0;

    for (const scenario of scenarios) {
      let qualityScore = 0;
      let qualityChecks = 0;

      // Check scenario completeness (25%)
      const requiredFields = ['name', 'description', 'attackPaths', 'feasibility', 'impact'];
      const completedFields = requiredFields.filter(field => 
        scenario[field as keyof StrategicScenario] !== undefined
      ).length;
      qualityScore += (completedFields / requiredFields.length) * 0.25;
      qualityChecks++;

      // Check attack path quality (30%)
      if (scenario.attackPaths && scenario.attackPaths.length > 0) {
        let pathQuality = 0;
        for (const pathId of scenario.attackPaths) {
          const path = this.attackPaths.get(pathId);
          if (!path) continue;

          let pathScore = 0;

          // Check if path has multiple steps
          if (path.steps && path.steps.length >= 3) pathScore += 0.3;

          // Check if steps have MITRE techniques
          if (path.steps) {
            const stepsWithMitre = path.steps.filter(step =>
              step.mitreTechniques && step.mitreTechniques.length > 0
            ).length;
            if (stepsWithMitre / path.steps.length >= 0.5) pathScore += 0.4;
          }

          // Check if path has feasibility assessment
          if (path.feasibility && path.feasibility > 0) pathScore += 0.3;

          pathQuality += pathScore;
        }
        qualityScore += (pathQuality / scenario.attackPaths.length) * 0.3;
      }
      qualityChecks++;

      // Check risk assessment quality (25%)
      if (scenario.riskRating) {
        let riskQuality = 0;
        if (scenario.riskRating.likelihood !== undefined) riskQuality += 0.33;
        if (scenario.riskRating.impact !== undefined) riskQuality += 0.33;
        if (scenario.riskRating.overall !== undefined) riskQuality += 0.34;
        qualityScore += riskQuality * 0.25;
      }
      qualityChecks++;

      // Check documentation quality (20%)
      let docQuality = 0;
      if (scenario.description && scenario.description.length > 50) docQuality += 0.4;
      if (scenario.assumptions && scenario.assumptions.length > 0) docQuality += 0.3;
      // Note: limitations property not available in StrategicScenario type
      qualityScore += docQuality * 0.2;
      qualityChecks++;

      if (qualityChecks > 0) {
        totalQuality += qualityScore;
        validScenarios++;
      }
    }

    return validScenarios > 0 ? totalQuality / validScenarios : 0;
  }

  private assessMitreIntegration(scenarios: StrategicScenario[]): number {
    if (scenarios.length === 0) return 0;

    let totalIntegration = 0;
    let validScenarios = 0;

    for (const scenario of scenarios) {
      let integrationScore = 0;
      let checks = 0;

      // Check if scenario uses MITRE techniques (40%)
      const totalSteps = scenario.attackPaths.reduce((sum, pathId) => {
        const path = this.attackPaths.get(pathId);
        return sum + (path && path.steps ? path.steps.length : 0);
      }, 0);
      const stepsWithMitre = scenario.attackPaths.reduce((sum, pathId) => {
        const path = this.attackPaths.get(pathId);
        if (!path || !path.steps) return sum;
        return sum + path.steps.filter(step => step.mitreTechniques && step.mitreTechniques.length > 0).length;
      }, 0);
      
      if (totalSteps > 0) {
        integrationScore += (stepsWithMitre / totalSteps) * 0.4;
      }
      checks++;

      // Check if scenario uses MITRE tactics (30%)
      const tacticsUsed = new Set();
      scenario.attackPaths.forEach(pathId => {
        const path = this.attackPaths.get(pathId);
        if (path && path.steps) {
          path.steps.forEach(step => {
            if (step.mitreTactics) {
              step.mitreTactics.forEach(tactic => tacticsUsed.add(tactic.id));
            }
          });
        }
      });
      
      // Good coverage if using 3+ different tactics
      if (tacticsUsed.size >= 3) {
        integrationScore += 0.3;
      } else if (tacticsUsed.size >= 1) {
        integrationScore += (tacticsUsed.size / 3) * 0.3;
      }
      checks++;

      // Check if kill chain is properly mapped (30%)
      const killChainPhases = scenario.attackPaths.reduce((phases, pathId) => {
        const path = this.attackPaths.get(pathId);
        if (path && path.steps) {
          path.steps.forEach(step => {
            if (step.killChainPhase) {
              phases.add(step.killChainPhase);
            }
          });
        }
        return phases;
      }, new Set());
      
      // Good coverage if using 4+ kill chain phases
      if (killChainPhases.size >= 4) {
        integrationScore += 0.3;
      } else if (killChainPhases.size >= 1) {
        integrationScore += (killChainPhases.size / 4) * 0.3;
      }
      checks++;

      if (checks > 0) {
        totalIntegration += integrationScore;
        validScenarios++;
      }
    }

    return validScenarios > 0 ? totalIntegration / validScenarios : 0;
  }

  // 🔧 CORRECTION: Fonction dupliquée supprimée
}
import { WorkshopAgent } from './WorkshopAgent';
import { WorkshopStep, ValidationResult } from './WorkshopAgent';
import { AgentConfig, AgentCapability } from '../AgentInterface';
import { StrategicScenario } from '../../../types/ebios';
import { Logger } from '../../logging/Logger';

// Types spécifiques à l'Atelier 4
export interface AttackPath {
  id: string;
  name: string;
  description: string;
  steps: OperationalStep[];
  complexity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number;
  impact: number;
  detectability: number;
  updatedAt?: string;
}

export interface OperationalScenario {
  id: string;
  name: string;
  description: string;
  attackPaths: AttackPath[];
  riskLevel: number;
  mitigationMeasures: string[];
  updatedAt?: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  description: string;
  tactics: string[];
  platforms: string[];
  dataSource: string[];
  detection: string;
  mitigation: string;
}

export interface KillChainPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  techniques: string[];
  indicators: string[];
}
export interface OperationalRisk {
  id: string;
  name: string;
  description: string;
  strategicScenarioId: string;
  attackPaths: AttackPath[];
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskLevel: number; // calculé
  mitreMapping: MitreTechnique[];
  killChainPhases: KillChainPhase[];
  feasibility: number; // 0-1
  detectability: number; // 0-1
  exploitability: number; // 0-1
  createdAt: string;
  updatedAt: string;
}

export interface OperationalStep {
  id: string;
  name: string;
  description: string;
  order: number;
  mitreTechnique?: MitreTechnique;
  killChainPhase: KillChainPhase;
  prerequisites: string[];
  tools: string[];
  indicators: string[];
  countermeasures: string[];
  difficulty: 'low' | 'medium' | 'high' | 'critical';
  stealth: 'low' | 'medium' | 'high';
  speed: 'slow' | 'medium' | 'fast';
  reliability: 'low' | 'medium' | 'high';
}

export interface ThreatCapability {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'operational' | 'financial' | 'organizational';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mitreGroups: string[];
  techniques: string[];
  tools: string[];
}

export interface OperationalAnalysis {
  scenarioId: string;
  totalPaths: number;
  criticalPaths: number;
  averageFeasibility: number;
  averageDetectability: number;
  mitreCompliance: number;
  killChainCompleteness: number;
  riskScore: number;
  recommendations: string[];
}

/**
 * Agent spécialisé pour l'Atelier 4 EBIOS RM - Scénarios Opérationnels
 * 
 * Objectifs de l'Atelier 4 :
 * - Décliner les scénarios stratégiques en scénarios opérationnels détaillés
 * - Modéliser les chemins d'attaque avec MITRE ATT&CK
 * - Analyser la faisabilité et la détectabilité des attaques
 * - Évaluer les risques opérationnels
 * - Prioriser les scénarios selon leur criticité
 */
export class Workshop4Agent extends WorkshopAgent {

  protected async executeStepImplementation(stepId: string, inputs: any): Promise<any> {
    const step = this.workshopSteps.get(stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }
    return this.executeStepLogic(step, inputs);
  }
  private knowledgeBase: Map<string, any> = new Map();
  private mitreFramework: Map<string, MitreTechnique> = new Map();
  private threatCapabilities: Map<string, ThreatCapability> = new Map();
  private operationalScenarios: Map<string, OperationalScenario> = new Map();
  private attackPaths: Map<string, AttackPath> = new Map();
  private riskAnalysis: Map<string, OperationalAnalysis> = new Map();

  constructor(config: AgentConfig) {
    super(config, 4, [
      AgentCapability.RISK_ANALYSIS,
      AgentCapability.THREAT_MODELING,
      AgentCapability.THREAT_INTELLIGENCE,
      AgentCapability.RISK_ANALYSIS
    ]);
  }

  protected async initializeWorkshopSteps(): Promise<void> {
    const steps: WorkshopStep[] = [
      {
        id: 'operational_scenario_development',
        name: 'Développement des scénarios opérationnels',
        description: 'Décliner les scénarios stratégiques en scénarios opérationnels détaillés',
        order: 1,
        required: true,
        estimatedDuration: 120,
        dependencies: [],
        inputs: [
          {
            id: 'strategic_scenarios',
            name: 'Scénarios stratégiques',
            type: 'StrategicScenario[]',
            required: true,
            source: 'previous_step',
            validation: { minLength: 1 }
          }
        ],
        outputs: [
          {
            id: 'operational_scenarios',
            name: 'Scénarios opérationnels',
            type: 'OperationalScenario[]',
            format: 'json',
            destination: 'next_step'
          }
        ],
        validations: [
          {
            id: 'scenario_completeness',
            type: 'completeness',
            rule: 'all_strategic_scenarios_covered',
            message: 'Tous les scénarios stratégiques doivent être déclinés',
            severity: 'error'
          }
        ],
        aiCapabilities: ['scenario_generation', 'threat_modeling']
      },
      {
        id: 'attack_path_modeling',
        name: 'Modélisation des chemins d\'attaque',
        description: 'Créer des chemins d\'attaque détaillés avec techniques MITRE ATT&CK',
        order: 2,
        required: true,
        estimatedDuration: 180,
        dependencies: ['operational_scenario_development'],
        inputs: [
          {
            id: 'operational_scenarios',
            name: 'Scénarios opérationnels',
            type: 'OperationalScenario[]',
            required: true,
            source: 'previous_step',
            validation: { minLength: 1 }
          }
        ],
        outputs: [
          {
            id: 'attack_paths',
            name: 'Chemins d\'attaque',
            type: 'AttackPath[]',
            format: 'json',
            destination: 'next_step'
          }
        ],
        validations: [
          {
            id: 'mitre_compliance',
            type: 'compliance',
            rule: 'mitre_techniques_mapped',
            message: 'Les techniques MITRE ATT&CK doivent être mappées',
            severity: 'error'
          }
        ],
        aiCapabilities: ['attack_path_generation', 'mitre_mapping']
      },
      {
        id: 'feasibility_analysis',
        name: 'Analyse de faisabilité',
        description: 'Évaluer la faisabilité, détectabilité et exploitabilité des attaques',
        order: 3,
        required: true,
        estimatedDuration: 90,
        dependencies: ['attack_path_modeling'],
        inputs: [
          {
            id: 'attack_paths',
            name: 'Chemins d\'attaque',
            type: 'AttackPath[]',
            required: true,
            source: 'previous_step',
            validation: { minLength: 1 }
          }
        ],
        outputs: [
          {
            id: 'feasibility_assessment',
            name: 'Évaluation de faisabilité',
            type: 'FeasibilityAssessment[]',
            format: 'json',
            destination: 'next_step'
          }
        ],
        validations: [
          {
            id: 'probability_calculation',
            type: 'quality',
            rule: 'probabilistic_assessment_complete',
            message: 'L\'évaluation probabiliste doit être complète',
            severity: 'warning'
          }
        ],
        aiCapabilities: ['risk_assessment', 'probability_calculation']
      },
      {
        id: 'operational_risk_evaluation',
        name: 'Évaluation des risques opérationnels',
        description: 'Calculer et évaluer les risques opérationnels',
        order: 4,
        required: true,
        estimatedDuration: 60,
        dependencies: ['feasibility_analysis'],
        inputs: [
          {
            id: 'feasibility_assessment',
            name: 'Évaluation de faisabilité',
            type: 'FeasibilityAssessment[]',
            required: true,
            source: 'previous_step',
            validation: { minLength: 1 }
          }
        ],
        outputs: [
          {
            id: 'operational_risks',
            name: 'Risques opérationnels',
            type: 'OperationalRisk[]',
            format: 'json',
            destination: 'deliverable'
          }
        ],
        validations: [
          {
            id: 'risk_calculation',
            type: 'quality',
            rule: 'risk_scores_calculated',
            message: 'Les scores de risque doivent être calculés',
            severity: 'error'
          }
        ],
        aiCapabilities: ['risk_calculation', 'impact_analysis']
      },
      {
        id: 'scenario_prioritization',
        name: 'Priorisation des scénarios',
        description: 'Prioriser les scénarios opérationnels selon leur criticité',
        order: 5,
        required: true,
        estimatedDuration: 45,
        dependencies: ['operational_risk_evaluation'],
        inputs: [
          {
            id: 'operational_risks',
            name: 'Risques opérationnels',
            type: 'OperationalRisk[]',
            required: true,
            source: 'previous_step',
            validation: { minLength: 1 }
          }
        ],
        outputs: [
          {
            id: 'prioritized_scenarios',
            name: 'Scénarios priorisés',
            type: 'PrioritizedScenario[]',
            format: 'json',
            destination: 'deliverable'
          }
        ],
        validations: [
          {
            id: 'prioritization_logic',
            type: 'methodology',
            rule: 'prioritization_criteria_applied',
            message: 'Les critères de priorisation doivent être appliqués',
            severity: 'warning'
          }
        ],
        aiCapabilities: ['prioritization', 'decision_support']
      }
    ];

    steps.forEach(step => this.workshopSteps.set(step.id, step));
    this.logger.info(`Initialized ${steps.length} workshop steps for Workshop 4`);
  }

  protected async initializeWorkshopSpecific(): Promise<void> {
    this.logger.info('Initializing Workshop 4 specific components');
    
    // Chargement du framework MITRE ATT&CK
    await this.loadMitreFramework();
    
    // Initialisation des capacités de menace
    await this.initializeThreatCapabilities();
    
    // Chargement des modèles de chemins d'attaque
    await this.loadAttackPathTemplates();
    
    this.logger.info('Workshop 4 specific initialization completed');
  }

  protected async executeStepLogic(step: WorkshopStep, inputs: any): Promise<any> {
    this.logger.info(`Executing step: ${step.name}`);
    
    switch (step.id) {
      case 'operational_scenario_development':
        return await this.executeOperationalScenarioDevelopment(inputs);
      case 'attack_path_modeling':
        return await this.executeAttackPathModeling(inputs);
      case 'feasibility_analysis':
        return await this.executeFeasibilityAnalysis(inputs);
      case 'operational_risk_evaluation':
        return await this.executeOperationalRiskEvaluation(inputs);
      case 'scenario_prioritization':
        return await this.executeScenarioPrioritization(inputs);
      default:
        throw new Error(`Unknown step: ${step.id}`);
    }
  }

  // Exécution des étapes

  private async executeOperationalScenarioDevelopment(inputs: any): Promise<any> {
    const strategicScenarios: StrategicScenario[] = inputs.strategic_scenarios || [];
    const operationalScenarios: OperationalScenario[] = [];

    for (const strategicScenario of strategicScenarios) {
      const scenarios = await this.developOperationalScenarios(strategicScenario);
      operationalScenarios.push(...scenarios);
    }

    // Stockage des résultats
    operationalScenarios.forEach(scenario => {
      this.operationalScenarios.set(scenario.id, scenario);
    });

    return {
      operational_scenarios: operationalScenarios,
      metrics: {
        total_scenarios: operationalScenarios.length,
        strategic_coverage: strategicScenarios.length,
        average_complexity: this.calculateAverageComplexity(operationalScenarios)
      }
    };
  }

  private async executeAttackPathModeling(inputs: any): Promise<any> {
    const operationalScenarios: OperationalScenario[] = inputs.operational_scenarios || [];
    const attackPaths: AttackPath[] = [];

    for (const scenario of operationalScenarios) {
      const paths = await this.modelAttackPaths(scenario);
      attackPaths.push(...paths);
    }

    // Stockage des résultats
    attackPaths.forEach(path => {
      this.attackPaths.set(path.id, path);
    });

    return {
      attack_paths: attackPaths,
      metrics: {
        total_paths: attackPaths.length,
        mitre_coverage: this.calculateMitreCoverage(attackPaths),
        kill_chain_completeness: this.calculateKillChainCompleteness(attackPaths)
      }
    };
  }

  private async executeFeasibilityAnalysis(inputs: any): Promise<any> {
    const attackPaths: AttackPath[] = inputs.attack_paths || [];
    const feasibilityAssessments = [];

    for (const path of attackPaths) {
      const assessment = await this.analyzeFeasibility(path);
      feasibilityAssessments.push(assessment);
    }

    return {
      feasibility_assessment: feasibilityAssessments,
      metrics: {
        average_feasibility: this.calculateAverageFeasibility(feasibilityAssessments),
        high_risk_paths: feasibilityAssessments.filter(a => a.riskLevel >= 4).length,
        detection_probability: this.calculateAverageDetection(feasibilityAssessments)
      }
    };
  }

  private async executeOperationalRiskEvaluation(inputs: any): Promise<any> {
    const feasibilityAssessments = inputs.feasibility_assessment || [];
    const operationalRisks: OperationalRisk[] = [];

    for (const assessment of feasibilityAssessments) {
      const risk = await this.evaluateOperationalRisk(assessment);
      operationalRisks.push(risk);
    }

    // Stockage des analyses
    const analysis = this.generateRiskAnalysis(operationalRisks);
    this.riskAnalysis.set('workshop4_analysis', analysis);

    return {
      operational_risks: operationalRisks,
      risk_analysis: analysis,
      metrics: {
        total_risks: operationalRisks.length,
        critical_risks: operationalRisks.filter(r => r.riskLevel >= 4).length,
        average_risk_score: operationalRisks.reduce((sum, r) => sum + r.riskLevel, 0) / operationalRisks.length
      }
    };
  }

  private async executeScenarioPrioritization(inputs: any): Promise<any> {
    const operationalRisks: OperationalRisk[] = inputs.operational_risks || [];
    
    const prioritizedScenarios = await this.prioritizeScenarios(operationalRisks);
    
    return {
      prioritized_scenarios: prioritizedScenarios,
      metrics: {
        total_scenarios: prioritizedScenarios.length,
        high_priority: prioritizedScenarios.filter(s => s.priority === 'high').length,
        medium_priority: prioritizedScenarios.filter(s => s.priority === 'medium').length,
        low_priority: prioritizedScenarios.filter(s => s.priority === 'low').length
      }
    };
  }

  // Méthodes de développement des scénarios

  private async developOperationalScenarios(strategicScenario: StrategicScenario): Promise<OperationalScenario[]> {
    const scenarios: OperationalScenario[] = [];
    
    // Génération de scénarios opérationnels basés sur le scénario stratégique
    const baseScenario: OperationalScenario = {
      id: `op_${strategicScenario.id}_${Date.now()}`,
      name: `Scénario opérationnel - ${strategicScenario.name}`,
      description: `Déclinaison opérationnelle de: ${strategicScenario.description}`,
      // strategicScenarioId: strategicScenario.id,
      attackPaths: [],
      riskLevel: 3,
      mitigationMeasures: [],
      // threatActors: this.identifyThreatActors(strategicScenario),
      // targetAssets: strategicScenario.businessValues || [],
      // attackVectors: this.identifyAttackVectors(strategicScenario),
      // prerequisites: this.identifyPrerequisites(strategicScenario),
      // objectives: this.identifyAttackObjectives(strategicScenario),
      // complexity: this.assessComplexity(strategicScenario),
      // stealth: this.assessStealth(strategicScenario),
      // speed: this.assessSpeed(strategicScenario),
      // createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    scenarios.push(baseScenario);
    
    // Génération de variantes si nécessaire
    const variants = await this.generateScenarioVariants(baseScenario, strategicScenario);
    scenarios.push(...variants);
    
    return scenarios;
  }

  private async modelAttackPaths(scenario: OperationalScenario): Promise<AttackPath[]> {
    const paths: AttackPath[] = [];
    
    // Génération du chemin d'attaque principal
    const primaryPath = await this.generatePrimaryAttackPath(scenario);
    paths.push(primaryPath);
    
    // Génération de chemins alternatifs
    const alternativePaths = await this.generateAlternativeAttackPaths(scenario);
    paths.push(...alternativePaths);
    
    return paths;
  }

  private async generatePrimaryAttackPath(scenario: OperationalScenario): Promise<AttackPath> {
    const steps = await this.generateAttackSteps(scenario);
    
    return {
      id: `path_${scenario.id}_primary`,
      name: `Chemin principal - ${scenario.name}`,
      description: `Chemin d'attaque principal pour ${scenario.description}`,
      // scenarioId: scenario.id,
      steps,
      likelihood: 3,
      impact: 3,
      // techniques: this.extractMitreTechniques(steps),
      // tactics: this.extractMitreTactics(steps),
      // killChainPhases: this.mapToKillChain(steps),
      // feasibility: 0,
      detectability: 0,
      complexity: 'medium',
      // prerequisites: scenario.prerequisites || [],
      // tools: this.identifyRequiredTools(steps),
      // indicators: this.identifyIndicators(steps),
      // countermeasures: [],
      // createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async generateAlternativeAttackPaths(scenario: OperationalScenario): Promise<AttackPath[]> {
    const alternativePaths: AttackPath[] = [];
    
    // Génération de 2-3 chemins alternatifs selon la complexité
    const pathCount = 2;
    
    for (let i = 0; i < pathCount; i++) {
      const steps = await this.generateAlternativeSteps(scenario, i);
      
      const path: AttackPath = {
        id: `path_${scenario.id}_alt_${i + 1}`,
        name: `Chemin alternatif ${i + 1} - ${scenario.name}`,
        description: `Chemin d'attaque alternatif pour ${scenario.description}`,
        // scenarioId: scenario.id,
        steps,
        likelihood: 3,
        impact: 3,
        // techniques: this.extractMitreTechniques(steps),
        // tactics: this.extractMitreTactics(steps),
        // killChainPhases: this.mapToKillChain(steps),
        // feasibility: 0,
        detectability: 0,
        complexity: 'medium',
        // prerequisites: scenario.prerequisites || [],
        // tools: this.identifyRequiredTools(steps),
        // indicators: this.identifyIndicators(steps),
        // countermeasures: [],
        // createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      alternativePaths.push(path);
    }
    
    return alternativePaths;
  }

  private async generateAttackSteps(scenario: OperationalScenario): Promise<OperationalStep[]> {
    const steps: OperationalStep[] = [];
    
    // Étapes basées sur la Cyber Kill Chain
    const killChainPhases: string[] = [
      'reconnaissance',
      'weaponization',
      'delivery',
      'exploitation',
      'installation',
      'command_control',
      'actions_objectives'
    ];
    
    for (let i = 0; i < killChainPhases.length; i++) {
      const phase = killChainPhases[i];
      const technique = this.selectMitreTechnique(phase as any, scenario);
      
      const step: OperationalStep = {
        id: `step_${scenario.id}_${i + 1}`,
        name: this.getPhaseStepName(phase as any),
        description: this.getPhaseStepDescription(phase as any, scenario),
        order: i + 1,
        mitreTechnique: technique,
        killChainPhase: phase as any,
        prerequisites: i === 0 ? [] : [`step_${scenario.id}_${i}`],
        tools: this.getPhaseTools(phase as any),
        indicators: this.getPhaseIndicators(phase as any),
        countermeasures: this.getPhaseCountermeasures(phase as any),
        difficulty: this.assessStepDifficulty(phase as any, scenario),
        stealth: this.assessStepStealth(phase as any, scenario),
        speed: this.assessStepSpeed(phase as any, scenario),
        reliability: this.assessStepReliability(phase as any, scenario)
      };
      
      steps.push(step);
    }
    
    return steps;
  }

  private async analyzeFeasibility(path: AttackPath): Promise<any> {
    const feasibility = this.calculatePathFeasibility(path);
    const detectability = this.calculatePathDetectability(path);
    const exploitability = this.calculatePathExploitability(path);
    
    const riskLevel = this.calculateRiskLevel(feasibility, detectability, exploitability);
    
    return {
      pathId: path.id,
      feasibility,
      detectability,
      exploitability,
      riskLevel,
      criticalSteps: this.identifyCriticalSteps(path),
      vulnerabilities: this.identifyVulnerabilities(path),
      mitigations: this.suggestMitigations(path)
    };
  }

  private async evaluateOperationalRisk(assessment: any): Promise<OperationalRisk> {
    const path = this.attackPaths.get(assessment.pathId);
    if (!path) {
      throw new Error(`Attack path not found: ${assessment.pathId}`);
    }
    
    const scenario = this.operationalScenarios.get(path.id);
    if (!scenario) {
      throw new Error(`Operational scenario not found: ${path.id}`);
    }
    
    return {
      id: `risk_${path.id}`,
      name: `Risque opérationnel - ${path.name}`,
      description: `Risque associé au chemin d'attaque: ${path.description}`,
      strategicScenarioId: scenario?.id || 'unknown',
      attackPaths: [path],
      likelihood: Math.round(assessment.feasibility * 5),
      impact: Math.round(assessment.exploitability * 5),
      riskLevel: assessment.riskLevel,
      mitreMapping: [],
      killChainPhases: [],
      feasibility: assessment.feasibility,
      detectability: assessment.detectability,
      exploitability: assessment.exploitability,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async prioritizeScenarios(risks: OperationalRisk[]): Promise<any[]> {
    // Tri par niveau de risque et impact
    const sortedRisks = risks.sort((a, b) => {
      const scoreA = a.riskLevel * a.impact * (1 - a.detectability);
      const scoreB = b.riskLevel * b.impact * (1 - b.detectability);
      return scoreB - scoreA;
    });
    
    return sortedRisks.map((risk, index) => ({
      ...risk,
      priority: index < risks.length * 0.3 ? 'high' : 
                index < risks.length * 0.7 ? 'medium' : 'low',
      rank: index + 1,
      priorityScore: risk.riskLevel * risk.impact * (1 - risk.detectability)
    }));
  }

  // Méthodes de validation

  protected async validateMethodology(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const operationalScenarios = Array.from(this.operationalScenarios.values());
    const attackPaths = Array.from(this.attackPaths.values());
    
    // Validation de la couverture des scénarios stratégiques
    const strategicCoverage = this.validateStrategicCoverage(operationalScenarios);
    if (strategicCoverage < 0.8) {
      results.push({
        id: 'strategic_coverage',
        type: 'methodology',
        status: 'warning',
        message: 'Couverture incomplète des scénarios stratégiques',
        details: `Seulement ${Math.round(strategicCoverage * 100)}% des scénarios stratégiques sont couverts`,
        severity: 'medium',
        autoFixable: false,
        recommendations: ['Développer des scénarios opérationnels pour tous les scénarios stratégiques']
      });
    }
    
    // Validation de la modélisation des chemins d'attaque
    const pathModeling = this.validateAttackPathModeling(attackPaths);
    if (pathModeling < 0.7) {
      results.push({
        id: 'attack_path_modeling',
        type: 'methodology',
        status: 'failed',
        message: 'Modélisation des chemins d\'attaque insuffisante',
        details: `Qualité de modélisation: ${Math.round(pathModeling * 100)}%`,
        severity: 'high',
        autoFixable: true,
        recommendations: ['Améliorer la modélisation des chemins d\'attaque', 'Ajouter plus d\'étapes détaillées']
      });
    }
    
    return results;
  }

  protected async validateCompliance(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const attackPaths = Array.from(this.attackPaths.values());
    
    // Validation MITRE ATT&CK
    const mitreCompliance = this.calculateMitreCoverage(attackPaths);
    if (mitreCompliance < 0.8) {
      results.push({
        id: 'mitre_compliance',
        type: 'compliance',
        status: 'failed',
        message: 'Conformité MITRE ATT&CK insuffisante',
        details: `Couverture MITRE: ${Math.round(mitreCompliance * 100)}%`,
        severity: 'critical',
        autoFixable: true,
        recommendations: ['Mapper toutes les techniques MITRE ATT&CK', 'Compléter les tactiques manquantes']
      });
    }
    
    // Validation Kill Chain
    const killChainCompleteness = this.calculateKillChainCompleteness(attackPaths);
    if (killChainCompleteness < 0.7) {
      results.push({
        id: 'kill_chain_completeness',
        type: 'compliance',
        status: 'warning',
        message: 'Kill chains incomplètes',
        details: `Complétude des kill chains: ${Math.round(killChainCompleteness * 100)}%`,
        severity: 'medium',
        autoFixable: true,
        recommendations: ['Compléter toutes les phases de la kill chain', 'Vérifier la séquence des étapes']
      });
    }
    
    return results;
  }

  protected async validateQuality(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const operationalRisks = Array.from(this.riskAnalysis.values());
    
    // Validation de l'évaluation probabiliste
    const probabilisticAssessment = this.validateProbabilisticAssessment();
    if (probabilisticAssessment < 0.9) {
      results.push({
        id: 'probabilistic_assessment',
        type: 'quality',
        status: 'warning',
        message: 'Évaluation probabiliste incomplète',
        details: `Complétude de l\'évaluation: ${Math.round(probabilisticAssessment * 100)}%`,
        severity: 'medium',
        autoFixable: false,
        recommendations: ['Compléter l\'évaluation de faisabilité', 'Améliorer l\'analyse de détectabilité']
      });
    }
    
    return results;
  }

  protected async validateCompleteness(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Vérification des livrables
    const deliverables = Array.from(this.deliverables.values());
    const requiredDeliverables = ['operational_scenarios', 'attack_paths', 'risk_analysis', 'prioritized_scenarios'];
    
    for (const required of requiredDeliverables) {
      const deliverable = deliverables.find(d => d.type === required);
      if (!deliverable) {
        results.push({
          id: `missing_${required}`,
          type: 'completeness',
          status: 'failed',
          message: `Livrable manquant: ${required}`,
          details: `Le livrable ${required} n'a pas été généré`,
          severity: 'critical',
          autoFixable: false,
          recommendations: [`Générer le livrable ${required}`]
        });
      }
    }
    
    return results;
  }

  // Méthodes utilitaires

  private async loadMitreFramework(): Promise<void> {
    // Chargement des techniques MITRE ATT&CK courantes
    const techniques: MitreTechnique[] = [
      {
        id: 'T1566',
        name: 'Phishing',
        description: 'Adversaries may send phishing messages to gain access to victim systems',
        tactics: ['initial-access'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Email Gateway', 'Network Traffic'],
        detection: 'Monitor email gateways for suspicious attachments',
        mitigation: 'User awareness training and email filtering'
      },
      {
        id: 'T1059',
        name: 'Command and Scripting Interpreter',
        description: 'Adversaries may abuse command and script interpreters to execute commands',
        tactics: ['execution'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Process', 'Command'],
        detection: 'Monitor command line execution and process creation',
        mitigation: 'Application whitelisting and script blocking'
      },
      {
        id: 'T1055',
        name: 'Process Injection',
        description: 'Adversaries may inject code into processes to evade process-based defenses',
        tactics: ['defense-evasion'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Process', 'API'],
        detection: 'Monitor process injection and memory modifications',
        mitigation: 'Endpoint protection and behavior monitoring'
      },
      {
        id: 'T1071',
        name: 'Application Layer Protocol',
        description: 'Adversaries may communicate using application layer protocols',
        tactics: ['command-and-control'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Network Traffic', 'Netflow'],
        detection: 'Monitor network traffic for C2 communications',
        mitigation: 'Network segmentation and traffic filtering'
      },
      {
        id: 'T1005',
        name: 'Data from Local System',
        description: 'Adversaries may search local system sources to find files of interest',
        tactics: ['collection'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['File', 'Process'],
        detection: 'Monitor file access and data collection activities',
        mitigation: 'Data loss prevention and access controls'
      }
    ];
    
    techniques.forEach(technique => {
      this.mitreFramework.set(technique.id, technique);
    });
    
    this.logger.info(`Loaded ${techniques.length} MITRE ATT&CK techniques`);
  }

  private async initializeThreatCapabilities(): Promise<void> {
    const capabilities: ThreatCapability[] = [
      {
        id: 'advanced_persistent_threat',
        name: 'Advanced Persistent Threat',
        description: 'Capacités avancées de persistance et d\'évasion',
        category: 'technical',
        level: 'expert',
        mitreGroups: ['APT1', 'APT28', 'APT29'],
        techniques: ['T1566', 'T1055', 'T1071'],
        tools: ['Cobalt Strike', 'Metasploit', 'Custom malware']
      },
      {
        id: 'cybercriminal_group',
        name: 'Cybercriminal Group',
        description: 'Groupe cybercriminel organisé',
        category: 'operational',
        level: 'advanced',
        mitreGroups: ['FIN7', 'Carbanak'],
        techniques: ['T1566', 'T1059'],
        tools: ['Banking trojans', 'RATs', 'Exploit kits']
      },
      {
        id: 'insider_threat',
        name: 'Insider Threat',
        description: 'Menace interne malveillante',
        category: 'organizational',
        level: 'intermediate',
        mitreGroups: [],
        techniques: ['T1005', 'T1041'],
        tools: ['Legitimate tools', 'USB devices']
      }
    ];
    
    capabilities.forEach(capability => {
      this.threatCapabilities.set(capability.id, capability);
    });
    
    this.logger.info(`Initialized ${capabilities.length} threat capabilities`);
  }

  private async loadAttackPathTemplates(): Promise<void> {
    // Chargement des modèles de chemins d'attaque
    this.knowledgeBase.set('attack_path_templates', {
      phishing_campaign: {
        phases: ['reconnaissance', 'weaponization', 'delivery', 'exploitation'],
        techniques: ['T1566', 'T1059', 'T1055'],
        complexity: 'medium'
      },
      insider_attack: {
        phases: ['initial_access', 'collection', 'exfiltration'],
        techniques: ['T1078', 'T1005', 'T1041'],
        complexity: 'low'
      },
      apt_campaign: {
        phases: ['reconnaissance', 'weaponization', 'delivery', 'exploitation', 'installation', 'command_control', 'actions_objectives'],
        techniques: ['T1566', 'T1055', 'T1071', 'T1005'],
        complexity: 'high'
      }
    });
    
    this.logger.info('Attack path templates loaded');
  }

  // Méthodes de calcul et d'analyse

  private calculateAverageComplexity(scenarios: OperationalScenario[]): number {
    const complexityMap = { low: 1, medium: 2, high: 3 };
    const total = scenarios.reduce((sum, s) => sum + complexityMap['medium'], 0);
    return total / scenarios.length;
  }

  private calculateMitreCoverage(paths: AttackPath[]): number {
    const totalTechniques = paths.reduce((sum, p) => sum + 0, 0);
    const expectedTechniques = paths.length * 3; // Minimum 3 techniques par chemin
    return Math.min(totalTechniques / expectedTechniques, 1);
  }

  private calculateKillChainCompleteness(paths: AttackPath[]): number {
    const completeChains = paths.filter(p => (p.steps?.length || 0) >= 5).length;
    return completeChains / paths.length;
  }

  private calculateAverageFeasibility(assessments: any[]): number {
    const total = assessments.reduce((sum, a) => sum + a.feasibility, 0);
    return total / assessments.length;
  }

  private calculateAverageDetection(assessments: any[]): number {
    const total = assessments.reduce((sum, a) => sum + a.detectability, 0);
    return total / assessments.length;
  }

  private generateRiskAnalysis(risks: OperationalRisk[]): OperationalAnalysis {
    return {
      scenarioId: 'workshop4_global',
      totalPaths: risks.reduce((sum, r) => sum + r.attackPaths.length, 0),
      criticalPaths: risks.filter(r => r.riskLevel >= 4).length,
      averageFeasibility: risks.reduce((sum, r) => sum + r.feasibility, 0) / risks.length,
      averageDetectability: risks.reduce((sum, r) => sum + r.detectability, 0) / risks.length,
      mitreCompliance: this.calculateMitreCoverage(risks.flatMap(r => r.attackPaths)),
      killChainCompleteness: this.calculateKillChainCompleteness(risks.flatMap(r => r.attackPaths)),
      riskScore: risks.reduce((sum, r) => sum + r.riskLevel, 0) / risks.length,
      recommendations: this.generateRecommendations(risks)
    };
  }

  private generateRecommendations(risks: OperationalRisk[]): string[] {
    const recommendations: string[] = [];
    
    const highRisks = risks.filter(r => r.riskLevel >= 4);
    if (highRisks.length > 0) {
      recommendations.push(`Prioriser le traitement de ${highRisks.length} risques critiques`);
    }
    
    const lowDetection = risks.filter(r => r.detectability < 0.3);
    if (lowDetection.length > 0) {
      recommendations.push(`Améliorer la détection pour ${lowDetection.length} scénarios`);
    }
    
    return recommendations;
  }

  // Méthodes d'identification et d'évaluation

  private identifyThreatActors(scenario: StrategicScenario): string[] {
    // Logique d'identification des acteurs de menace
    return scenario.riskSourceId ? [scenario.riskSourceId] : ['Cybercriminel', 'Groupe APT'];
  }

  private identifyAttackVectors(scenario: StrategicScenario): string[] {
    // Logique d'identification des vecteurs d'attaque
    return ['Email', 'Web', 'Network', 'Physical'];
  }

  private identifyPrerequisites(scenario: StrategicScenario): string[] {
    // Logique d'identification des prérequis
    return ['Network access', 'Valid credentials'];
  }

  private identifyAttackObjectives(scenario: StrategicScenario): string[] {
    // Logique d'identification des objectifs
    return ['Data theft', 'System compromise', 'Service disruption'];
  }

  private assessComplexity(scenario: StrategicScenario): 'low' | 'medium' | 'high' {
    // Logique d'évaluation de la complexité
    const level = typeof scenario.riskLevel === 'number' ? scenario.riskLevel : 2;
    return level >= 4 ? 'high' : level >= 3 ? 'medium' : 'low';
  }

  private assessStealth(scenario: StrategicScenario): 'low' | 'medium' | 'high' {
    // Logique d'évaluation de la furtivité
    return 'medium';
  }

  private assessSpeed(scenario: StrategicScenario): 'slow' | 'medium' | 'fast' {
    // Logique d'évaluation de la vitesse
    return 'medium';
  }

  private async generateScenarioVariants(baseScenario: OperationalScenario, strategicScenario: StrategicScenario): Promise<OperationalScenario[]> {
    // Génération de variantes du scénario
    return [];
  }

  private async generateAlternativeSteps(scenario: OperationalScenario, variant: number): Promise<OperationalStep[]> {
    // Génération d'étapes alternatives
    return this.generateAttackSteps(scenario);
  }

  private extractMitreTechniques(steps: OperationalStep[]): MitreTechnique[] {
    return steps
      .map(step => step.mitreTechnique)
      .filter(technique => technique !== undefined) as MitreTechnique[];
  }

  private extractMitreTactics(steps: OperationalStep[]): string[] {
    return Array.from(new Set(steps
      .map(step => step.mitreTechnique?.tactics?.[0])
      .filter(tactic => tactic !== undefined) as string[]));
  }

  private mapToKillChain(steps: OperationalStep[]): KillChainPhase[] {
    return Array.from(new Set(steps.map(step => step.killChainPhase)));
  }

  private identifyRequiredTools(steps: OperationalStep[]): string[] {
    return Array.from(new Set(steps.flatMap(step => step.tools)));
  }

  private identifyIndicators(steps: OperationalStep[]): string[] {
    return Array.from(new Set(steps.flatMap(step => step.indicators)));
  }

  private selectMitreTechnique(phase: KillChainPhase, scenario: OperationalScenario): MitreTechnique | undefined {
    // Sélection d'une technique MITRE appropriée pour la phase
    const techniques = Array.from(this.mitreFramework.values());
    return techniques.find(t => true); // Simplified for now
  }

  private getPhaseStepName(phase: any): string {
    const names: Record<string, string> = {
      reconnaissance: 'Reconnaissance',
      weaponization: 'Armement',
      delivery: 'Livraison',
      exploitation: 'Exploitation',
      installation: 'Installation',
      command_control: 'Commande et contrôle',
      actions_objectives: 'Actions sur objectifs'
    };
    return names[phase] || phase.toString();
  }

  private getPhaseStepDescription(phase: any, scenario: OperationalScenario): string {
    const descriptions: Record<string, string> = {
      reconnaissance: 'Collecte d\'informations sur la cible',
      weaponization: 'Préparation de l\'exploit',
      delivery: 'Transmission de l\'exploit vers la cible',
      exploitation: 'Exploitation de la vulnérabilité',
      installation: 'Installation de l\'accès persistant',
      command_control: 'Établissement du canal de communication',
      actions_objectives: 'Exécution des objectifs de l\'attaque'
    };
    return descriptions[phase] || `Étape ${phase} du scénario ${scenario.name}`;
  }

  private getPhaseTools(phase: any): string[] {
    const tools: Record<string, string[]> = {
      reconnaissance: ['Nmap', 'Shodan', 'OSINT tools'],
      weaponization: ['Metasploit', 'Custom exploits'],
      delivery: ['Email', 'USB', 'Web'],
      exploitation: ['Exploit kits', 'Buffer overflow'],
      installation: ['Backdoors', 'RATs'],
      command_control: ['C2 frameworks', 'DNS tunneling'],
      actions_objectives: ['Data exfiltration tools', 'Ransomware']
    };
    return tools[phase] || [];
  }

  private getPhaseIndicators(phase: any): string[] {
    const indicators: Record<string, string[]> = {
      reconnaissance: ['Port scans', 'DNS queries'],
      weaponization: ['Malware creation'],
      delivery: ['Suspicious emails', 'File downloads'],
      exploitation: ['Process injection', 'Memory corruption'],
      installation: ['File creation', 'Registry changes'],
      command_control: ['Network connections', 'DNS requests'],
      actions_objectives: ['Data access', 'File encryption']
    };
    return indicators[phase] || [];
  }

  private getPhaseCountermeasures(phase: any): string[] {
    const countermeasures: Record<string, string[]> = {
      reconnaissance: ['Network monitoring', 'Honeypots'],
      weaponization: ['Threat intelligence'],
      delivery: ['Email filtering', 'Web filtering'],
      exploitation: ['Patch management', 'ASLR'],
      installation: ['Endpoint protection', 'Application whitelisting'],
      command_control: ['Network segmentation', 'DNS monitoring'],
      actions_objectives: ['Data loss prevention', 'Backup systems']
    };
    return countermeasures[phase] || [];
  }

  private assessStepDifficulty(phase: any, scenario: OperationalScenario): 'low' | 'medium' | 'high' | 'critical' {
    // Logique d'évaluation de la difficulté par phase
    const difficultyMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      reconnaissance: 'low',
      weaponization: 'medium',
      delivery: 'medium',
      exploitation: 'high',
      installation: 'high',
      command_control: 'medium',
      actions_objectives: 'medium'
    };
    return difficultyMap[phase];
  }

  private assessStepStealth(phase: KillChainPhase, scenario: OperationalScenario): 'low' | 'medium' | 'high' {
    // Logique d'évaluation de la furtivité par phase
    return 'medium';
  }

  private assessStepSpeed(phase: KillChainPhase, scenario: OperationalScenario): 'slow' | 'medium' | 'fast' {
    // Logique d'évaluation de la vitesse par phase
    return 'medium';
  }

  private assessStepReliability(phase: KillChainPhase, scenario: OperationalScenario): 'low' | 'medium' | 'high' {
    // Logique d'évaluation de la fiabilité par phase
    return 'medium';
  }

  private calculatePathFeasibility(path: AttackPath): number {
    // Calcul de la faisabilité basé sur la complexité et les prérequis
    const complexityScore = path.complexity === 'low' ? 0.8 : path.complexity === 'medium' ? 0.6 : 0.4;
    const prerequisiteScore = Math.max(0.2, 1 - (0) * 0.1);
    return (complexityScore + prerequisiteScore) / 2;
  }

  private calculatePathDetectability(path: AttackPath): number {
    // Calcul de la détectabilité basé sur les indicateurs
    const indicatorCount = 0;
    return Math.min(0.9, indicatorCount * 0.1 + 0.1);
  }

  private calculatePathExploitability(path: AttackPath): number {
    // Calcul de l'exploitabilité basé sur les techniques MITRE
    const techniqueCount = 0;
    return Math.min(0.9, techniqueCount * 0.15 + 0.1);
  }

  private calculateRiskLevel(feasibility: number, detectability: number, exploitability: number): number {
    // Calcul du niveau de risque
    const riskScore = feasibility * exploitability * (1 - detectability);
    return Math.round(riskScore * 5);
  }

  private identifyCriticalSteps(path: AttackPath): string[] {
    // Identification des étapes critiques
    return path.steps?.filter(step => step.difficulty === 'critical' || step.difficulty === 'high')
      .map(step => step.id) || [];
  }

  private identifyVulnerabilities(path: AttackPath): string[] {
    // Identification des vulnérabilités exploitées
    return ['CVE-2023-1234', 'Weak authentication', 'Unpatched systems'];
  }

  private suggestMitigations(path: AttackPath): string[] {
    // Suggestions de mitigations
    return path.steps?.flatMap(step => step.countermeasures) || [];
  }

  private validateStrategicCoverage(scenarios: OperationalScenario[]): number {
    // Validation de la couverture des scénarios stratégiques
    const strategicIds = new Set(scenarios.map(s => s.id));
    // Supposons qu'il y a 5 scénarios stratégiques en moyenne
    return Math.min(1, strategicIds.size / 5);
  }

  private validateAttackPathModeling(paths: AttackPath[]): number {
    // Validation de la qualité de modélisation
    const qualityScores = paths.map(path => {
      let score = 0;
      if (path.steps && path.steps.length >= 3) score += 0.3;
      // if (path.techniques && path.techniques.length >= 2) score += 0.3;
      if (path.steps && path.steps.length >= 4) score += 0.4;
      return score;
    });
    
    return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  }

  private validateProbabilisticAssessment(): number {
    // Validation de l'évaluation probabiliste
    const paths = Array.from(this.attackPaths.values());
    const assessedPaths = paths.filter(p => p.steps && p.steps.length > 0);
    return assessedPaths.length / paths.length;
  }
}
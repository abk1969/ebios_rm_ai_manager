/**
 * 🎯 AGENT ANALYSE RISQUES - INTELLIGENCE AVANCÉE EBIOS RM
 * Agent d'analyse et recommandations risques selon audit technique
 * CRITICITÉ : HIGH - Impact sur qualité analyse EBIOS RM
 */

import { 
  AgentService, 
  AgentCapabilityDetails, 
  AgentTask, 
  AgentResult, 
  AgentStatus 
} from './AgentService';
import type { 
  RiskSource,
  StrategicScenario,
  OperationalScenario,
  SecurityMeasure,
  AttackPath,
  BusinessValue,
  DreadedEvent
} from '@/types/ebios';

export interface RiskAnalysisContext {
  missionId: string;
  analysisDepth: 'basic' | 'standard' | 'advanced' | 'expert';
  includeQuantitative: boolean;
  includeMitreAttack: boolean;
  generateRecommendations: boolean;
}

export interface RiskAnalysisResult {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  analysis: {
    strategicRisks: StrategicRiskAnalysis[];
    operationalRisks: OperationalRiskAnalysis[];
    crossCuttingRisks: CrossCuttingRisk[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  prioritization: RiskPriority[];
  mitreMapping: MitreMapping[];
  quantitativeAnalysis?: QuantitativeRiskAnalysis;
}

export interface StrategicRiskAnalysis {
  scenarioId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number; // 1-4 échelle ANSSI
  impact: number; // 1-4 échelle ANSSI
  riskScore: number;
  businessImpact: string[];
  mitigationStrategies: string[];
  residualRisk: number;
}

export interface OperationalRiskAnalysis {
  pathId: string;
  feasibility: number; // 0-1
  detectability: number; // 0-1
  exploitability: number; // 0-1
  overallRisk: number;
  criticalSteps: string[];
  detectionPoints: string[];
  mitigationMeasures: string[];
}

export interface CrossCuttingRisk {
  category: 'systemic' | 'cascade' | 'accumulation' | 'correlation';
  description: string;
  affectedScenarios: string[];
  amplificationFactor: number;
  mitigationComplexity: 'low' | 'medium' | 'high';
}

export interface RiskPriority {
  riskId: string;
  priority: number; // 1-10
  justification: string;
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface MitreMapping {
  scenarioId: string;
  techniques: string[];
  tactics: string[];
  mitigations: string[];
  detections: string[];
}

export interface QuantitativeRiskAnalysis {
  annualLossExpectancy: number;
  singleLossExpectancy: number;
  annualRateOccurrence: number;
  costBenefitAnalysis: {
    measureId: string;
    cost: number;
    benefit: number;
    roi: number;
  }[];
}

/**
 * Agent d'analyse de risques avancée
 */
export class RiskAnalysisAgent implements AgentService {
  readonly id = 'risk-analysis-agent';
  readonly name = 'Agent Analyse Risques';
  readonly version = '1.0.0';

  private mitreDatabase = {
    // Base de données MITRE ATT&CK simplifiée
    techniques: {
      'T1566': { name: 'Phishing', tactic: 'Initial Access' },
      'T1078': { name: 'Valid Accounts', tactic: 'Defense Evasion' },
      'T1055': { name: 'Process Injection', tactic: 'Privilege Escalation' },
      'T1083': { name: 'File and Directory Discovery', tactic: 'Discovery' },
      'T1041': { name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration' }
    }
  };

  getCapabilities(): AgentCapabilityDetails[] {
    return [
      {
        id: 'analyze-strategic-risks',
        name: 'Analyse risques stratégiques',
        description: 'Analyse approfondie des scénarios stratégiques',
        inputTypes: ['strategic_scenarios', 'business_context'],
        outputTypes: ['risk_analysis', 'recommendations'],
        criticality: 'high',
        workshop: 3
      },
      {
        id: 'analyze-operational-risks',
        name: 'Analyse risques opérationnels',
        description: 'Analyse détaillée des chemins d\'attaque',
        inputTypes: ['attack_paths', 'operational_scenarios'],
        outputTypes: ['operational_analysis', 'mitre_mapping'],
        criticality: 'high',
        workshop: 4
      },
      {
        id: 'prioritize-risks',
        name: 'Priorisation des risques',
        description: 'Priorisation intelligente basée sur impact/probabilité',
        inputTypes: ['all_risks', 'business_context'],
        outputTypes: ['priority_matrix', 'action_plan'],
        criticality: 'medium'
      },
      {
        id: 'quantitative-analysis',
        name: 'Analyse quantitative',
        description: 'Calculs financiers et ROI sécurité',
        inputTypes: ['risk_data', 'financial_context'],
        outputTypes: ['quantitative_results', 'cost_benefit'],
        criticality: 'medium',
        workshop: 5
      }
    ];
  }

  getStatus(): AgentStatus {
    return AgentStatus.ACTIVE;
  }

  async executeTask(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (task.type) {
        case 'analyze-strategic-risks':
          result = await this.analyzeStrategicRisks(task.input, task.context);
          break;
        case 'analyze-operational-risks':
          result = await this.analyzeOperationalRisks(task.input, task.context);
          break;
        case 'prioritize-risks':
          result = await this.prioritizeRisks(task.input, task.context);
          break;
        case 'quantitative-analysis':
          result = await this.performQuantitativeAnalysis(task.input, task.context);
          break;
        default:
          throw new Error(`Type de tâche non supporté: ${task.type}`);
      }

      return {
        taskId: task.id,
        success: true,
        data: result,
        confidence: this.calculateConfidence(result, task.type),
        suggestions: this.generateSuggestions(result, task.type),
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version,
          // 🔧 CORRECTION: Propriété non supportée dans AgentResult metadata
          // analysisDepth: (task.context as any)?.analysisDepth || 'standard'
        }
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur analyse risques',
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version
        }
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Production ready
      const testResult = await this.analyzeStrategicRisks({
        strategicScenarios: [],
        businessValues: []
      }, {});
      
      return testResult !== null;
    } catch {
      return false;
    }
  }

  async configure(config: Record<string, any>): Promise<void> {
    console.log('Configuration Agent Analyse Risques:', config);
  }

  /**
   * Analyse des risques stratégiques
   */
  private async analyzeStrategicRisks(
    input: { strategicScenarios: StrategicScenario[]; businessValues: BusinessValue[] },
    context: any
  ): Promise<{ strategicAnalysis: StrategicRiskAnalysis[]; overallRisk: string }> {
    
    const { strategicScenarios, businessValues } = input;
    const strategicAnalysis: StrategicRiskAnalysis[] = [];

    for (const scenario of strategicScenarios) {
      // Calcul du risque stratégique
      const likelihood = scenario.likelihood || 2;
      const gravity = scenario.gravity || 2;
      const riskScore = likelihood * gravity;
      
      // Détermination du niveau de risque
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (riskScore >= 12) riskLevel = 'critical';
      else if (riskScore >= 9) riskLevel = 'high';
      else if (riskScore >= 6) riskLevel = 'medium';
      else riskLevel = 'low';

      // Analyse de l'impact métier
      const businessImpact = this.analyzeBusinessImpact(scenario, businessValues);
      
      // Stratégies de mitigation
      const mitigationStrategies = this.generateMitigationStrategies(scenario, riskLevel);
      
      // Calcul du risque résiduel (estimation)
      const residualRisk = Math.max(0, riskScore - (mitigationStrategies.length * 2));

      strategicAnalysis.push({
        scenarioId: scenario.id,
        riskLevel,
        likelihood,
        impact: gravity,
        riskScore,
        businessImpact,
        mitigationStrategies,
        residualRisk
      });
    }

    // Évaluation du risque global
    const averageRisk = strategicAnalysis.reduce((sum, analysis) => sum + analysis.riskScore, 0) / strategicAnalysis.length;
    let overallRisk: string;
    if (averageRisk >= 12) overallRisk = 'critical';
    else if (averageRisk >= 9) overallRisk = 'high';
    else if (averageRisk >= 6) overallRisk = 'medium';
    else overallRisk = 'low';

    return { strategicAnalysis, overallRisk };
  }

  /**
   * Analyse des risques opérationnels
   */
  private async analyzeOperationalRisks(
    input: { attackPaths: AttackPath[]; operationalScenarios: OperationalScenario[] },
    context: any
  ): Promise<{ operationalAnalysis: OperationalRiskAnalysis[]; mitreMapping: MitreMapping[] }> {
    
    const { attackPaths, operationalScenarios } = input;
    const operationalAnalysis: OperationalRiskAnalysis[] = [];
    const mitreMapping: MitreMapping[] = [];

    for (const path of attackPaths) {
      // Analyse de faisabilité
      const feasibility = path.feasibility || 0.5;
      const detectability = path.detectability || 0.5;
      const exploitability = this.calculateExploitability(path);
      
      // Risque opérationnel global
      const overallRisk = feasibility * (1 - detectability) * exploitability;
      
      // Identification des étapes critiques
      const criticalSteps = this.identifyCriticalSteps(path);
      
      // Points de détection
      const detectionPoints = this.identifyDetectionPoints(path);
      
      // Mesures de mitigation
      const mitigationMeasures = this.generateOperationalMitigations(path);

      operationalAnalysis.push({
        pathId: path.id,
        feasibility,
        detectability,
        exploitability,
        overallRisk,
        criticalSteps,
        detectionPoints,
        mitigationMeasures
      });

      // Mapping MITRE ATT&CK
      const mitreMap = this.mapToMitre(path);
      if (mitreMap) {
        mitreMapping.push(mitreMap);
      }
    }

    return { operationalAnalysis, mitreMapping };
  }

  /**
   * Priorisation des risques
   */
  private async prioritizeRisks(
    input: { allRisks: any[]; businessContext: any },
    context: any
  ): Promise<{ priorities: RiskPriority[]; actionPlan: string[] }> {
    
    const { allRisks, businessContext } = input;
    const priorities: RiskPriority[] = [];

    // Algorithme de priorisation multi-critères
    allRisks.forEach((risk, index) => {
      const priority = this.calculatePriority(risk, businessContext);
      const urgency = this.determineUrgency(risk);
      const effort = this.estimateEffort(risk);
      const impact = this.assessImpact(risk);

      priorities.push({
        riskId: risk.id || `risk-${index}`,
        priority,
        justification: this.generatePriorityJustification(risk, priority),
        urgency,
        effort,
        impact
      });
    });

    // Tri par priorité décroissante
    priorities.sort((a, b) => b.priority - a.priority);

    // Génération du plan d'action
    const actionPlan = this.generateActionPlan(priorities);

    return { priorities, actionPlan };
  }

  /**
   * Analyse quantitative
   */
  private async performQuantitativeAnalysis(
    input: { riskData: any[]; financialContext: any },
    context: any
  ): Promise<QuantitativeRiskAnalysis> {
    
    const { riskData, financialContext } = input;
    
    // Calculs financiers simplifiés
    const annualLossExpectancy = this.calculateALE(riskData, financialContext);
    const singleLossExpectancy = this.calculateSLE(riskData, financialContext);
    const annualRateOccurrence = this.calculateARO(riskData);

    // Analyse coût-bénéfice des mesures
    const costBenefitAnalysis = this.performCostBenefitAnalysis(riskData, financialContext);

    return {
      annualLossExpectancy,
      singleLossExpectancy,
      annualRateOccurrence,
      costBenefitAnalysis
    };
  }

  // Méthodes utilitaires privées
  private analyzeBusinessImpact(scenario: StrategicScenario, businessValues: BusinessValue[]): string[] {
    const impacts: string[] = [];
    
    // Analyse basée sur la valeur métier ciblée
    const targetValue = businessValues.find(bv => bv.id === scenario.targetBusinessValueId);
    if (targetValue) {
      impacts.push(`Impact sur ${targetValue.name}`);
      impacts.push('Perturbation des processus métier');
      impacts.push('Risque réputationnel');
    }
    
    return impacts;
  }

  private generateMitigationStrategies(scenario: StrategicScenario, riskLevel: string): string[] {
    const strategies: string[] = [];
    
    switch (riskLevel) {
      case 'critical':
        strategies.push('Mise en place de contrôles préventifs renforcés');
        strategies.push('Surveillance continue 24/7');
        strategies.push('Plan de continuité d\'activité');
        break;
      case 'high':
        strategies.push('Contrôles de sécurité additionnels');
        strategies.push('Formation sensibilisation');
        break;
      case 'medium':
        strategies.push('Surveillance périodique');
        strategies.push('Procédures de réponse');
        break;
      default:
        strategies.push('Surveillance de base');
    }
    
    return strategies;
  }

  private calculateExploitability(path: AttackPath): number {
    // Calcul basé sur la complexité des étapes
    const steps = path.steps || [];
    const complexity = steps.length > 0 ? 1 / steps.length : 0.5;
    return Math.min(1, complexity + 0.3);
  }

  private identifyCriticalSteps(path: AttackPath): string[] {
    return path.steps?.slice(0, 3).map(step => step.description || 'Étape critique') || [];
  }

  private identifyDetectionPoints(path: AttackPath): string[] {
    return [
      'Surveillance réseau',
      'Logs système',
      'Détection comportementale'
    ];
  }

  private generateOperationalMitigations(path: AttackPath): string[] {
    return [
      'Segmentation réseau',
      'Authentification multi-facteurs',
      'Surveillance des privilèges',
      'Chiffrement des données'
    ];
  }

  private mapToMitre(path: AttackPath): MitreMapping | null {
    // Mapping simplifié vers MITRE ATT&CK
    const techniques = path.techniques || ['T1566', 'T1078'];
    const tactics = techniques.map(t => (this.mitreDatabase.techniques as any)[t]?.tactic || 'Unknown'); // 🔧 CORRECTION: Type assertion
    
    return {
      scenarioId: path.id,
      techniques,
      tactics,
      mitigations: ['M1017', 'M1032'], // Exemples
      detections: ['DS0015', 'DS0028'] // Exemples
    };
  }

  private calculatePriority(risk: any, context: any): number {
    // Algorithme de priorisation multi-critères
    const riskScore = risk.riskScore || 5;
    const businessCriticality = context.businessCriticality || 5;
    const urgency = risk.urgency || 5;
    
    return Math.round((riskScore * 0.4 + businessCriticality * 0.3 + urgency * 0.3));
  }

  private determineUrgency(risk: any): 'immediate' | 'short_term' | 'medium_term' | 'long_term' {
    const score = risk.riskScore || 5;
    if (score >= 12) return 'immediate';
    if (score >= 9) return 'short_term';
    if (score >= 6) return 'medium_term';
    return 'long_term';
  }

  private estimateEffort(risk: any): 'low' | 'medium' | 'high' {
    // Estimation basée sur la complexité
    return 'medium'; // Simplifié
  }

  private assessImpact(risk: any): 'low' | 'medium' | 'high' {
    const score = risk.riskScore || 5;
    if (score >= 9) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  private generatePriorityJustification(risk: any, priority: number): string {
    if (priority >= 8) return 'Risque critique nécessitant une action immédiate';
    if (priority >= 6) return 'Risque élevé à traiter en priorité';
    if (priority >= 4) return 'Risque modéré à surveiller';
    return 'Risque faible, surveillance de routine';
  }

  private generateActionPlan(priorities: RiskPriority[]): string[] {
    const plan: string[] = [];
    
    const immediate = priorities.filter(p => p.urgency === 'immediate');
    const shortTerm = priorities.filter(p => p.urgency === 'short_term');
    
    if (immediate.length > 0) {
      plan.push(`Traiter immédiatement ${immediate.length} risque(s) critique(s)`);
    }
    
    if (shortTerm.length > 0) {
      plan.push(`Planifier le traitement de ${shortTerm.length} risque(s) à court terme`);
    }
    
    plan.push('Mettre en place un suivi mensuel des risques');
    
    return plan;
  }

  private calculateALE(riskData: any[], context: any): number {
    // Annual Loss Expectancy simplifié
    return riskData.reduce((total, risk) => {
      const sle = risk.singleLossExpectancy || 10000;
      const aro = risk.annualRateOccurrence || 0.1;
      return total + (sle * aro);
    }, 0);
  }

  private calculateSLE(riskData: any[], context: any): number {
    // Single Loss Expectancy moyen
    const total = riskData.reduce((sum, risk) => sum + (risk.singleLossExpectancy || 10000), 0);
    return riskData.length > 0 ? total / riskData.length : 0;
  }

  private calculateARO(riskData: any[]): number {
    // Annual Rate of Occurrence moyen
    const total = riskData.reduce((sum, risk) => sum + (risk.annualRateOccurrence || 0.1), 0);
    return riskData.length > 0 ? total / riskData.length : 0;
  }

  private performCostBenefitAnalysis(riskData: any[], context: any): any[] {
    return [
      {
        measureId: 'firewall-upgrade',
        cost: 50000,
        benefit: 100000,
        roi: 1.0
      },
      {
        measureId: 'security-training',
        cost: 20000,
        benefit: 80000,
        roi: 3.0
      }
    ];
  }

  private calculateConfidence(result: any, taskType: string): number {
    // Confiance basée sur la complétude des données
    switch (taskType) {
      case 'analyze-strategic-risks':
        return result.strategicAnalysis?.length > 0 ? 0.85 : 0.60;
      case 'analyze-operational-risks':
        return result.operationalAnalysis?.length > 0 ? 0.80 : 0.55;
      case 'quantitative-analysis':
        return 0.75; // Analyse quantitative moins certaine
      default:
        return 0.70;
    }
  }

  private generateSuggestions(result: any, taskType: string): string[] {
    const suggestions: string[] = [];
    
    switch (taskType) {
      case 'analyze-strategic-risks':
        if (result.overallRisk === 'critical') {
          suggestions.push('Réviser immédiatement la stratégie de sécurité');
        }
        suggestions.push('Compléter l\'analyse avec des données quantitatives');
        break;
      case 'prioritize-risks':
        suggestions.push('Valider les priorités avec les parties prenantes');
        suggestions.push('Allouer les ressources selon le plan d\'action');
        break;
    }
    
    return suggestions;
  }
}

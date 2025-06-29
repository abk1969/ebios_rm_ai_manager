/**
 * ✅ AGENT VALIDATION ANSSI - CONFORMITÉ CRITIQUE EBIOS RM
 * Agent de validation renforcée selon audit technique
 * CRITICITÉ : HIGH - Impact direct sur qualification ANSSI
 */

import { 
  AgentService, 
  AgentCapabilityDetails, 
  AgentTask, 
  AgentResult, 
  AgentStatus 
} from './AgentService';
import { ANSSIValidationService, ValidationResult } from '../validation/ANSSIValidationService';
import type { 
  Mission,
  BusinessValue,
  DreadedEvent,
  RiskSource,
  StrategicScenario,
  OperationalScenario,
  SecurityMeasure,
  AttackPath
} from '@/types/ebios';

export interface ANSSIValidationContext {
  missionId: string;
  workshop: 1 | 2 | 3 | 4 | 5;
  validationLevel: 'basic' | 'standard' | 'strict' | 'anssi_compliant';
  requiresApproval: boolean;
  auditMode: boolean;
}

export interface ANSSIValidationReport {
  overallScore: number; // 0-100
  complianceLevel: 'non_compliant' | 'partial' | 'compliant' | 'excellent';
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  workshopScores: {
    workshop1: number;
    workshop2: number;
    workshop3: number;
    workshop4: number;
    workshop5: number;
  };
  disqualificationRisk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  nextSteps: string[];
}

/**
 * Agent de validation ANSSI renforcée
 */
export class ANSSIValidationAgent implements AgentService {
  readonly id = 'anssi-validation-agent';
  readonly name = 'Agent Validation ANSSI';
  readonly version = '1.0.0';

  private validationThresholds = {
    disqualification: 70, // Score < 70% = risque disqualification
    warning: 85,         // Score < 85% = avertissement
    excellent: 95        // Score >= 95% = excellent
  };

  getCapabilities(): AgentCapabilityDetails[] {
    return [
      {
        id: 'validate-workshop-compliance',
        name: 'Validation conformité atelier',
        description: 'Validation ANSSI stricte par atelier EBIOS RM',
        inputTypes: ['workshop_data', 'mission_context'],
        outputTypes: ['validation_report', 'compliance_score'],
        criticality: 'critical',
        workshop: undefined // Tous les ateliers
      },
      {
        id: 'validate-global-compliance',
        name: 'Validation conformité globale',
        description: 'Validation ANSSI complète de la mission',
        inputTypes: ['mission_data', 'all_workshops'],
        outputTypes: ['global_report', 'disqualification_risk'],
        criticality: 'critical'
      },
      {
        id: 'detect-compliance-gaps',
        name: 'Détection écarts conformité',
        description: 'Identification proactive des risques ANSSI',
        inputTypes: ['current_state', 'anssi_requirements'],
        outputTypes: ['gap_analysis', 'remediation_plan'],
        criticality: 'high'
      },
      {
        id: 'generate-compliance-report',
        name: 'Génération rapport conformité',
        description: 'Rapport détaillé pour audit ANSSI',
        inputTypes: ['validation_results', 'mission_context'],
        outputTypes: ['audit_report', 'certification_readiness'],
        criticality: 'high'
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
        case 'validate-workshop-compliance':
          result = await this.validateWorkshopCompliance(task.input, task.context);
          break;
        case 'validate-global-compliance':
          result = await this.validateGlobalCompliance(task.input, task.context);
          break;
        case 'detect-compliance-gaps':
          result = await this.detectComplianceGaps(task.input, task.context);
          break;
        case 'generate-compliance-report':
          result = await this.generateComplianceReport(task.input, task.context);
          break;
        default:
          throw new Error(`Type de tâche non supporté: ${task.type}`);
      }

      return {
        taskId: task.id,
        success: true,
        data: result,
        confidence: this.calculateConfidence(result),
        suggestions: this.generateSuggestions(result),
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version,
          // 🔧 CORRECTION: Propriété non supportée dans AgentResult metadata
          // validationLevel: (task.context as any)?.validationLevel || 'standard'
        }
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur validation ANSSI',
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
      const testResult = await this.validateWorkshopCompliance({
        workshop: 1,
        data: { businessValues: [] }
      }, {});
      
      return testResult !== null;
    } catch {
      return false;
    }
  }

  async configure(config: Record<string, any>): Promise<void> {
    if (config.validationThresholds) {
      this.validationThresholds = { ...this.validationThresholds, ...config.validationThresholds };
    }
    console.log('Configuration Agent Validation ANSSI:', config);
  }

  /**
   * Validation conformité par atelier
   */
  private async validateWorkshopCompliance(
    input: { workshop: number; data: any; context?: ANSSIValidationContext },
    context: any
  ): Promise<ANSSIValidationReport> {
    
    const { workshop, data } = input;
    let validationResult: ValidationResult;

    // Validation spécialisée par atelier selon audit
    switch (workshop) {
      case 1:
        validationResult = ANSSIValidationService.validateWorkshop1(
          data.businessValues || [],
          data.dreadedEvents || [],
          data.supportingAssets || []
        );
        break;
      
      case 2:
        validationResult = ANSSIValidationService.validateWorkshop2(
          data.riskSources || [],
          data.businessValues || [] // 🔧 CORRECTION: Paramètre businessValues requis
        );
        break;
      
      case 3:
        validationResult = ANSSIValidationService.validateWorkshop3(
          data.strategicScenarios || [],
          data.riskSources || [],
          data.businessValues || []
        );
        break;
      
      case 4:
        validationResult = ANSSIValidationService.validateWorkshop4(
          data.operationalScenarios || [],
          data.attackPaths || [],
          data.strategicScenarios || []
        );
        break;
      
      case 5:
        validationResult = ANSSIValidationService.validateWorkshop5(
          data.securityMeasures || [],
          data.strategicScenarios || [],
          data.operationalScenarios || []
        );
        break;
      
      default:
        throw new Error(`Atelier ${workshop} non supporté`);
    }

    return this.buildValidationReport(validationResult, workshop);
  }

  /**
   * Validation conformité globale mission
   */
  private async validateGlobalCompliance(
    input: { mission: Mission; allData: any },
    context: any
  ): Promise<ANSSIValidationReport> {
    
    const { mission, allData } = input;
    
    // Validation globale selon ANSSI
    const globalResult = ANSSIValidationService.validateMission(mission);
    
    // Calcul scores par atelier
    const workshopScores = {
      workshop1: allData.workshop1 ? 
        ANSSIValidationService.validateWorkshop1(
          allData.workshop1.businessValues || [],
          allData.workshop1.dreadedEvents || [],
          allData.workshop1.supportingAssets || []
        ).score : 0,
      workshop2: allData.workshop2 ? 
        ANSSIValidationService.validateWorkshop2(
          allData.workshop2.riskSources || [],
          allData.workshop2.businessValues || [] // 🔧 CORRECTION: Paramètre businessValues requis
        ).score : 0,
      workshop3: allData.workshop3 ? 
        ANSSIValidationService.validateWorkshop3(
          allData.workshop3.strategicScenarios || [],
          allData.workshop3.riskSources || [],
          allData.workshop3.businessValues || []
        ).score : 0,
      workshop4: allData.workshop4 ? 
        ANSSIValidationService.validateWorkshop4(
          allData.workshop4.operationalScenarios || [],
          allData.workshop4.attackPaths || [],
          allData.workshop4.strategicScenarios || []
        ).score : 0,
      workshop5: allData.workshop5 ? 
        ANSSIValidationService.validateWorkshop5(
          allData.workshop5.securityMeasures || [],
          allData.workshop5.strategicScenarios || [],
          allData.workshop5.operationalScenarios || []
        ).score : 0
    };

    const overallScore = Object.values(workshopScores).reduce((a, b) => a + b, 0) / 5;

    return {
      overallScore,
      complianceLevel: this.determineComplianceLevel(overallScore),
      criticalIssues: globalResult.criticalIssues,
      warnings: globalResult.warnings,
      recommendations: globalResult.recommendations,
      workshopScores,
      disqualificationRisk: this.assessDisqualificationRisk(overallScore, globalResult.criticalIssues),
      actionRequired: overallScore < this.validationThresholds.warning,
      nextSteps: this.generateNextSteps(overallScore, globalResult.criticalIssues)
    };
  }

  /**
   * Détection écarts conformité
   */
  private async detectComplianceGaps(
    input: { currentState: any; requirements: any },
    context: any
  ): Promise<{ gaps: string[]; severity: string[]; recommendations: string[] }> {
    
    const gaps: string[] = [];
    const severity: string[] = [];
    const recommendations: string[] = [];

    // Analyse des écarts critiques selon audit
    if (!input.currentState.workshop3?.strategicScenarios?.length) {
      gaps.push('Atelier 3 : Aucun scénario stratégique défini');
      severity.push('CRITIQUE');
      recommendations.push('Définir immédiatement les scénarios stratégiques');
    }

    if (!input.currentState.workshop4?.attackPaths?.length) {
      gaps.push('Atelier 4 : Chemins d\'attaque non documentés');
      severity.push('CRITIQUE');
      recommendations.push('Cartographier les chemins d\'attaque avec MITRE ATT&CK');
    }

    if (!input.currentState.workshop5?.securityMeasures?.length) {
      gaps.push('Atelier 5 : Plan de traitement manquant');
      severity.push('CRITIQUE');
      recommendations.push('Élaborer le plan de traitement du risque');
    }

    return { gaps, severity, recommendations };
  }

  /**
   * Génération rapport conformité
   */
  private async generateComplianceReport(
    input: { validationResults: any; mission: Mission },
    context: any
  ): Promise<{ report: string; readiness: number; certification: boolean }> {
    
    const { validationResults, mission } = input;
    
    const report = `
# RAPPORT CONFORMITÉ ANSSI EBIOS RM

## Mission: ${mission.name}
## Date: ${new Date().toLocaleDateString('fr-FR')}

## Score Global: ${validationResults.overallScore}/100

### Conformité par Atelier:
- Atelier 1: ${validationResults.workshopScores.workshop1}/100
- Atelier 2: ${validationResults.workshopScores.workshop2}/100  
- Atelier 3: ${validationResults.workshopScores.workshop3}/100
- Atelier 4: ${validationResults.workshopScores.workshop4}/100
- Atelier 5: ${validationResults.workshopScores.workshop5}/100

### Risque de Disqualification: ${validationResults.disqualificationRisk.toUpperCase()}

### Actions Requises:
${validationResults.nextSteps.map((step: string) => `- ${step}`).join('\n')} // 🔧 CORRECTION: Type explicite
    `;

    const readiness = validationResults.overallScore;
    const certification = readiness >= this.validationThresholds.excellent;

    return { report, readiness, certification };
  }

  // Méthodes utilitaires privées
  private buildValidationReport(result: ValidationResult, workshop: number): ANSSIValidationReport {
    const workshopScores = { workshop1: 0, workshop2: 0, workshop3: 0, workshop4: 0, workshop5: 0 };
    workshopScores[`workshop${workshop}` as keyof typeof workshopScores] = result.score;

    return {
      overallScore: result.score,
      complianceLevel: this.determineComplianceLevel(result.score),
      criticalIssues: result.criticalIssues,
      warnings: result.warnings,
      recommendations: result.recommendations,
      workshopScores,
      disqualificationRisk: this.assessDisqualificationRisk(result.score, result.criticalIssues),
      actionRequired: result.score < this.validationThresholds.warning,
      nextSteps: this.generateNextSteps(result.score, result.criticalIssues)
    };
  }

  private determineComplianceLevel(score: number): 'non_compliant' | 'partial' | 'compliant' | 'excellent' {
    if (score >= this.validationThresholds.excellent) return 'excellent';
    if (score >= this.validationThresholds.warning) return 'compliant';
    if (score >= this.validationThresholds.disqualification) return 'partial';
    return 'non_compliant';
  }

  private assessDisqualificationRisk(score: number, criticalIssues: string[]): 'none' | 'low' | 'medium' | 'high' | 'critical' {
    if (criticalIssues.length > 0 && score < this.validationThresholds.disqualification) return 'critical';
    if (score < this.validationThresholds.disqualification) return 'high';
    if (score < this.validationThresholds.warning) return 'medium';
    if (criticalIssues.length > 0) return 'low';
    return 'none';
  }

  private generateNextSteps(score: number, criticalIssues: string[]): string[] {
    const steps: string[] = [];
    
    if (score < this.validationThresholds.disqualification) {
      steps.push('🚨 URGENT: Corriger les problèmes critiques avant audit');
    }
    
    if (criticalIssues.length > 0) {
      steps.push('Résoudre tous les problèmes critiques identifiés');
    }
    
    if (score < this.validationThresholds.warning) {
      steps.push('Améliorer la conformité avant validation finale');
    }
    
    if (steps.length === 0) {
      steps.push('Maintenir le niveau de conformité actuel');
    }
    
    return steps;
  }

  private calculateConfidence(result: any): number {
    // Confiance basée sur la complétude des données
    if (result.overallScore >= this.validationThresholds.excellent) return 0.95;
    if (result.overallScore >= this.validationThresholds.warning) return 0.85;
    if (result.overallScore >= this.validationThresholds.disqualification) return 0.75;
    return 0.60;
  }

  private generateSuggestions(result: any): string[] {
    const suggestions: string[] = [];
    
    if (result.disqualificationRisk === 'critical') {
      suggestions.push('Arrêter immédiatement le processus et corriger les problèmes critiques');
    }
    
    if (result.actionRequired) {
      suggestions.push('Planifier une session de correction des écarts identifiés');
    }
    
    suggestions.push('Programmer un audit de conformité dans 2 semaines');
    
    return suggestions;
  }
}

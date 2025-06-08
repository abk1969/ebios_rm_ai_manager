/**
 * Service de vérification de cohérence EBIOS RM
 * Vérifie la conformité avec la méthode ANSSI et la cohérence inter-ateliers
 */

import { 
  Mission,
  BusinessValue, 
  RiskSource, 
  DreadedEvent,
  SupportingAsset,
  Stakeholder,
  StrategicScenario,
  OperationalScenario,
  SecurityMeasure,
  AttackPath
} from '@/types/ebios';

interface CoherenceIssue {
  severity: 'error' | 'warning' | 'info';
  workshop: number;
  field: string;
  message: string;
  suggestion?: string;
}

interface WorkshopStatus {
  workshop: number;
  completionRate: number;
  isValid: boolean;
  issues: CoherenceIssue[];
}

interface GlobalCoherence {
  overallScore: number; // 0-1
  isCompliant: boolean;
  workshopStatuses: WorkshopStatus[];
  criticalIssues: CoherenceIssue[];
  recommendations: string[];
}

// 🆕 Export du type pour AICoherenceIndicator
export interface CoherenceCheckResult {
  overallScore: number;
  isCompliant: boolean;
  workshopScores?: Record<number, number>;
  criticalIssues: Array<{
    type: 'missing' | 'invalid' | 'inconsistent' | 'incomplete';
    severity: 'critical' | 'major' | 'minor';
    workshop: number;
    entity: string;
    message: string;
    field?: string;
  }>;
  recommendations: string[];
  suggestedActions?: Array<{
    action: string;
    target: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class EbiosCoherenceService {
  /**
   * Vérifie la cohérence d'une entité spécifique
   */
  async checkEntityCoherence(
    entityType: string,
    entityId: string,
    data: any
  ): Promise<CoherenceCheckResult> {
    // Simulation pour l'instant
    const score = Math.random() * 0.4 + 0.6; // Entre 0.6 et 1
    
    return {
      overallScore: score,
      isCompliant: score >= 0.8,
      criticalIssues: [],
      recommendations: ["Compléter les champs manquants", "Vérifier la cohérence avec les autres entités"],
      suggestedActions: []
    };
  }

  /**
   * Vérifie la cohérence d'un atelier spécifique
   */
  async checkWorkshopCoherence(
    workshop: 1 | 2 | 3 | 4 | 5,
    missionId: string,
    data: any
  ): Promise<CoherenceCheckResult> {
    // Pour l'instant, on utilise la logique existante pour un atelier spécifique
    let workshopStatus: WorkshopStatus;
    
    switch (workshop) {
      case 1:
        workshopStatus = this.checkWorkshop1(data);
        break;
      case 2:
        workshopStatus = this.checkWorkshop2(data);
        break;
      case 3:
        workshopStatus = this.checkWorkshop3(data);
        break;
      case 4:
        workshopStatus = this.checkWorkshop4(data);
        break;
      case 5:
        workshopStatus = this.checkWorkshop5(data);
        break;
    }
    
    const criticalIssues = workshopStatus.issues
      .filter(issue => issue.severity === 'error')
      .map(issue => ({
        type: 'missing' as const,
        severity: 'critical' as const,
        workshop: workshop,
        entity: issue.field,
        message: issue.message,
        field: issue.field
      }));
    
    return {
      overallScore: workshopStatus.completionRate,
      isCompliant: workshopStatus.isValid,
      workshopScores: { [workshop]: workshopStatus.completionRate },
      criticalIssues,
      recommendations: workshopStatus.issues
        .filter(i => i.suggestion)
        .map(i => i.suggestion!),
      suggestedActions: []
    };
  }

  /**
   * Vérifie la cohérence globale d'une mission EBIOS RM
   */
  async checkMissionCoherence(missionId: string, data: {
    mission: Mission;
    businessValues: BusinessValue[];
    supportingAssets: SupportingAsset[];
    dreadedEvents: DreadedEvent[];
    riskSources: RiskSource[];
    stakeholders: Stakeholder[];
    strategicScenarios: StrategicScenario[];
    operationalScenarios: OperationalScenario[];
    securityMeasures: SecurityMeasure[];
    attackPaths: AttackPath[];
  }): Promise<CoherenceCheckResult> {
    
    const workshopStatuses: WorkshopStatus[] = [];
    const allIssues: CoherenceIssue[] = [];

    // Vérifier chaque atelier
    const workshop1Status = this.checkWorkshop1(data);
    const workshop2Status = this.checkWorkshop2(data);
    const workshop3Status = this.checkWorkshop3(data);
    const workshop4Status = this.checkWorkshop4(data);
    const workshop5Status = this.checkWorkshop5(data);

    workshopStatuses.push(workshop1Status, workshop2Status, workshop3Status, workshop4Status, workshop5Status);
    allIssues.push(
      ...workshop1Status.issues,
      ...workshop2Status.issues,
      ...workshop3Status.issues,
      ...workshop4Status.issues,
      ...workshop5Status.issues
    );

    // Vérifier la cohérence inter-ateliers
    const interWorkshopIssues = this.checkInterWorkshopCoherence(data);
    allIssues.push(...interWorkshopIssues);

    // Calculer le score global
    const overallScore = this.calculateOverallScore(workshopStatuses);
    const criticalIssues = allIssues.filter(issue => issue.severity === 'error');
    const isCompliant = criticalIssues.length === 0 && overallScore >= 0.8;

    // Générer des recommandations
    const recommendations = this.generateRecommendations(allIssues, workshopStatuses);

    // Calculer les scores par atelier
    const workshopScores: Record<number, number> = {};
    workshopStatuses.forEach(ws => {
      workshopScores[ws.workshop] = ws.completionRate;
    });

    // Convertir les issues critiques au format attendu
    const formattedCriticalIssues = criticalIssues.map(issue => ({
      type: 'missing' as const,
      severity: issue.severity === 'error' ? 'critical' as const : 'major' as const,
      workshop: issue.workshop,
      entity: issue.field,
      message: issue.message,
      field: issue.field
    }));

    return {
      overallScore,
      isCompliant,
      workshopScores,
      criticalIssues: formattedCriticalIssues,
      recommendations,
      suggestedActions: []
    };
  }

  /**
   * Atelier 1 : Cadrage et socle de sécurité
   */
  private checkWorkshop1(data: any): WorkshopStatus {
    const issues: CoherenceIssue[] = [];
    let completionRate = 0;
    let completedItems = 0;
    const totalItems = 5;

    // 1. Mission définie
    if (data.mission) {
      completedItems++;
    } else {
      issues.push({
        severity: 'error',
        workshop: 1,
        field: 'mission',
        message: 'Aucune mission définie',
        suggestion: 'Définissez la mission et le périmètre de l\'analyse EBIOS RM'
      });
    }

    // 2. Valeurs métier
    if (data.businessValues && data.businessValues.length > 0) {
      completedItems++;
      
      // Vérifier que chaque valeur a une nature (pour Access)
      data.businessValues.forEach((bv: BusinessValue) => {
        if (!bv.category && !bv.natureValeurMetier) {
          issues.push({
            severity: 'warning',
            workshop: 1,
            field: 'businessValue.category',
            message: `Valeur métier "${bv.name}" sans catégorie ni nature`,
            suggestion: 'Définissez la catégorie (primary/support/management) ou la nature (PROCESSUS/INFORMATION)'
          });
        }
      });
    } else {
      issues.push({
        severity: 'error',
        workshop: 1,
        field: 'businessValues',
        message: 'Aucune valeur métier identifiée',
        suggestion: 'Identifiez au moins une valeur métier essentielle'
      });
    }

    // 3. Biens supports
    if (data.supportingAssets && data.supportingAssets.length > 0) {
      completedItems++;
      
      // Vérifier les liens avec les valeurs métier
      const orphanAssets = data.supportingAssets.filter((sa: SupportingAsset) =>
        !data.businessValues?.some((bv: BusinessValue) => bv.id === sa.businessValueId)
      );
      
      if (orphanAssets.length > 0) {
        issues.push({
          severity: 'error',
          workshop: 1,
          field: 'supportingAssets',
          message: `${orphanAssets.length} bien(s) support(s) sans valeur métier associée`,
          suggestion: 'Associez chaque bien support à une valeur métier'
        });
      }
    } else {
      issues.push({
        severity: 'warning',
        workshop: 1,
        field: 'supportingAssets',
        message: 'Aucun bien support identifié',
        suggestion: 'Identifiez les biens supports pour chaque valeur métier'
      });
    }

    // 4. Événements redoutés
    if (data.dreadedEvents && data.dreadedEvents.length > 0) {
      completedItems++;
      
      // Vérifier la complétude
      data.dreadedEvents.forEach((de: DreadedEvent) => {
        if (!de.gravity) {
          issues.push({
            severity: 'error',
            workshop: 1,
            field: 'dreadedEvent.gravity',
            message: `Événement redouté "${de.name}" sans gravité définie`,
            suggestion: 'Évaluez la gravité de 1 (négligeable) à 4 (critique)'
          });
        }
        
        if (!de.consequences && !de.impactsList?.length) {
          issues.push({
            severity: 'warning',
            workshop: 1,
            field: 'dreadedEvent.consequences',
            message: `Événement redouté "${de.name}" sans impacts définis`,
            suggestion: 'Décrivez les impacts potentiels'
          });
        }
      });
    } else {
      issues.push({
        severity: 'error',
        workshop: 1,
        field: 'dreadedEvents',
        message: 'Aucun événement redouté identifié',
        suggestion: 'Identifiez les événements redoutés pour chaque valeur métier'
      });
    }

    // 5. Socle de sécurité (optionnel mais recommandé)
    // TODO: Vérifier si un socle de sécurité est défini

    completionRate = completedItems / totalItems;
    const isValid = issues.filter(i => i.severity === 'error').length === 0;

    return {
      workshop: 1,
      completionRate,
      isValid,
      issues
    };
  }

  /**
   * Atelier 2 : Sources de risque
   */
  private checkWorkshop2(data: any): WorkshopStatus {
    const issues: CoherenceIssue[] = [];
    let completionRate = 0;
    let completedItems = 0;
    const totalItems = 3;

    // 1. Sources de risque identifiées
    if (data.riskSources && data.riskSources.length > 0) {
      completedItems++;
      
      data.riskSources.forEach((rs: RiskSource) => {
        // Vérifier la catégorie
        if (!rs.category && !rs.categoryAuto) {
          issues.push({
            severity: 'error',
            workshop: 2,
            field: 'riskSource.category',
            message: `Source de risque "${rs.name}" sans catégorie`,
            suggestion: 'Définissez ou laissez l\'IA déduire la catégorie'
          });
        }
        
        // Vérifier l'évaluation
        if (!rs.motivation || !rs.resources || !rs.expertise) {
          issues.push({
            severity: 'warning',
            workshop: 2,
            field: 'riskSource.evaluation',
            message: `Source de risque "${rs.name}" incomplètement évaluée`,
            suggestion: 'Évaluez motivation, ressources et expertise'
          });
        }
      });
    } else {
      issues.push({
        severity: 'error',
        workshop: 2,
        field: 'riskSources',
        message: 'Aucune source de risque identifiée',
        suggestion: 'Identifiez au moins une source de risque pertinente'
      });
    }

    // 2. Objectifs visés
    const hasObjectives = data.riskSources?.some((rs: RiskSource) =>
      rs.objectives && rs.objectives.length > 0
    );
    
    if (hasObjectives) {
      completedItems++;
    } else {
      issues.push({
        severity: 'error',
        workshop: 2,
        field: 'objectives',
        message: 'Aucun objectif visé défini',
        suggestion: 'Définissez les objectifs pour chaque source de risque retenue'
      });
    }

    // 3. Pertinence évaluée
    const allEvaluated = data.riskSources?.every((rs: RiskSource) =>
      rs.pertinence !== undefined
    );
    
    if (allEvaluated) {
      completedItems++;
    } else {
      issues.push({
        severity: 'warning',
        workshop: 2,
        field: 'pertinence',
        message: 'Certaines sources de risque sans pertinence évaluée',
        suggestion: 'Évaluez la pertinence de chaque source'
      });
    }

    completionRate = completedItems / totalItems;
    const isValid = issues.filter(i => i.severity === 'error').length === 0;

    return {
      workshop: 2,
      completionRate,
      isValid,
      issues
    };
  }

  /**
   * Atelier 3 : Scénarios stratégiques
   */
  private checkWorkshop3(data: any): WorkshopStatus {
    const issues: CoherenceIssue[] = [];
    let completionRate = 0;
    let completedItems = 0;
    const totalItems = 4;

    // 1. Parties prenantes
    if (data.stakeholders && data.stakeholders.length > 0) {
      completedItems++;
      
      // Vérifier l'évaluation de l'exposition
      data.stakeholders.forEach((s: Stakeholder) => {
        if (!s.exposureLevel || !s.cyberReliability) {
          issues.push({
            severity: 'warning',
            workshop: 3,
            field: 'stakeholder.evaluation',
            message: `Partie prenante "${s.name}" incomplètement évaluée`,
            suggestion: 'Évaluez l\'exposition et la fiabilité cyber'
          });
        }
      });
    } else {
      issues.push({
        severity: 'error',
        workshop: 3,
        field: 'stakeholders',
        message: 'Aucune partie prenante identifiée',
        suggestion: 'Cartographiez l\'écosystème (clients, fournisseurs, partenaires...)'
      });
    }

    // 2. Chemins d'attaque
    if (data.attackPaths && data.attackPaths.length > 0) {
      completedItems++;
      
      // Vérifier les attaques directes vs indirectes
      const directAttacks = data.attackPaths.filter((ap: AttackPath) => 
        ap.isDirect || !ap.stakeholderId
      );
      
      const indirectAttacks = data.attackPaths.filter((ap: AttackPath) => 
        !ap.isDirect && ap.stakeholderId
      );
      
      if (directAttacks.length === 0 && indirectAttacks.length === 0) {
        issues.push({
          severity: 'error',
          workshop: 3,
          field: 'attackPaths.type',
          message: 'Chemins d\'attaque mal typés (directs vs via écosystème)',
          suggestion: 'Distinguez les attaques directes des attaques via l\'écosystème'
        });
      }
    } else {
      issues.push({
        severity: 'error',
        workshop: 3,
        field: 'attackPaths',
        message: 'Aucun chemin d\'attaque défini',
        suggestion: 'Identifiez les chemins d\'attaque possibles'
      });
    }

    // 3. Scénarios stratégiques
    if (data.strategicScenarios && data.strategicScenarios.length > 0) {
      completedItems++;
      
      // Vérifier la complétude
      data.strategicScenarios.forEach((ss: StrategicScenario) => {
        if (!ss.likelihood || !ss.gravity) {
          issues.push({
            severity: 'error',
            workshop: 3,
            field: 'strategicScenario.evaluation',
            message: `Scénario "${ss.name}" sans évaluation complète`,
            suggestion: 'Évaluez vraisemblance et gravité'
          });
        }
      });
    } else {
      issues.push({
        severity: 'warning',
        workshop: 3,
        field: 'strategicScenarios',
        message: 'Aucun scénario stratégique formalisé',
        suggestion: 'Formalisez les scénarios stratégiques'
      });
    }

    // 4. Cohérence des liens
    const hasCoherentLinks = this.checkStrategicLinks(data);
    if (hasCoherentLinks) {
      completedItems++;
    }

    completionRate = completedItems / totalItems;
    const isValid = issues.filter(i => i.severity === 'error').length === 0;

    return {
      workshop: 3,
      completionRate,
      isValid,
      issues
    };
  }

  /**
   * Atelier 4 : Scénarios opérationnels
   */
  private checkWorkshop4(data: any): WorkshopStatus {
    const issues: CoherenceIssue[] = [];
    let completionRate = 0;
    let completedItems = 0;
    const totalItems = 3;

    // 1. Actions élémentaires détaillées
    const pathsWithActions = data.attackPaths?.filter((ap: AttackPath) =>
      ap.actions && ap.actions.length > 0
    ) || [];
    
    if (pathsWithActions.length > 0) {
      completedItems++;
      
      // Vérifier le séquencement
      pathsWithActions.forEach((ap: AttackPath) => {
        const hasSequence = ap.actions.every((a: any) => a.sequence !== undefined);
        if (!hasSequence) {
          issues.push({
            severity: 'warning',
            workshop: 4,
            field: 'attackPath.sequence',
            message: `Chemin "${ap.name}" avec actions non séquencées`,
            suggestion: 'Ordonnez les actions dans l\'ordre chronologique'
          });
        }
      });
    } else {
      issues.push({
        severity: 'error',
        workshop: 4,
        field: 'attackActions',
        message: 'Aucune action élémentaire détaillée',
        suggestion: 'Détaillez les actions pour chaque chemin d\'attaque'
      });
    }

    // 2. Scénarios opérationnels
    if (data.operationalScenarios && data.operationalScenarios.length > 0) {
      completedItems++;
      
      // Vérifier l'évaluation technique
      data.operationalScenarios.forEach((os: OperationalScenario) => {
        if (!os.difficulty || !os.detectability) {
          issues.push({
            severity: 'warning',
            workshop: 4,
            field: 'operationalScenario.technical',
            message: `Scénario "${os.name}" sans évaluation technique`,
            suggestion: 'Évaluez difficulté et détectabilité'
          });
        }
      });
    } else {
      issues.push({
        severity: 'warning',
        workshop: 4,
        field: 'operationalScenarios',
        message: 'Aucun scénario opérationnel formalisé',
        suggestion: 'Détaillez les modes opératoires'
      });
    }

    // 3. Vraisemblance technique
    const hasLikelihoodAssessment = data.operationalScenarios?.some((os: OperationalScenario) =>
      os.difficulty !== undefined
    );
    
    if (hasLikelihoodAssessment) {
      completedItems++;
    }

    completionRate = completedItems / totalItems;
    const isValid = issues.filter(i => i.severity === 'error').length === 0;

    return {
      workshop: 4,
      completionRate,
      isValid,
      issues
    };
  }

  /**
   * Atelier 5 : Traitement du risque
   */
  private checkWorkshop5(data: any): WorkshopStatus {
    const issues: CoherenceIssue[] = [];
    let completionRate = 0;
    let completedItems = 0;
    const totalItems = 4;

    // 1. Mesures de sécurité définies
    if (data.securityMeasures && data.securityMeasures.length > 0) {
      completedItems++;
      
      // Vérifier la complétude (ISO optionnel en mode Access)
      data.securityMeasures.forEach((sm: SecurityMeasure) => {
        if (!sm.controlType) {
          issues.push({
            severity: 'error',
            workshop: 5,
            field: 'securityMeasure.type',
            message: `Mesure "${sm.name}" sans type de contrôle`,
            suggestion: 'Définissez le type (preventive, detective, corrective, directive)'
          });
        }
        
        if (!sm.effectiveness) {
          issues.push({
            severity: 'warning',
            workshop: 5,
            field: 'securityMeasure.effectiveness',
            message: `Mesure "${sm.name}" sans efficacité évaluée`,
            suggestion: 'Évaluez l\'efficacité attendue'
          });
        }
      });
    } else {
      issues.push({
        severity: 'error',
        workshop: 5,
        field: 'securityMeasures',
        message: 'Aucune mesure de sécurité définie',
        suggestion: 'Définissez un plan de traitement du risque'
      });
    }

    // 2. Couverture des scénarios
    const scenariosWithMeasures = this.checkScenarioCoverage(data);
    if (scenariosWithMeasures.uncovered === 0) {
      completedItems++;
    } else {
      issues.push({
        severity: 'warning',
        workshop: 5,
        field: 'coverage',
        message: `${scenariosWithMeasures.uncovered} scénario(s) sans mesures`,
        suggestion: 'Assurez-vous que chaque scénario a des mesures associées'
      });
    }

    // 3. Plan de mise en œuvre
    const hasPlan = data.securityMeasures?.every((sm: SecurityMeasure) =>
      sm.dueDate && sm.responsibleParty && sm.status
    );
    
    if (hasPlan) {
      completedItems++;
    } else {
      issues.push({
        severity: 'warning',
        workshop: 5,
        field: 'implementationPlan',
        message: 'Plan de mise en œuvre incomplet',
        suggestion: 'Définissez échéances et responsables pour chaque mesure'
      });
    }

    // 4. Risque résiduel évalué
    const hasResidualRisk = data.securityMeasures?.some((sm: SecurityMeasure) =>
      sm.implementation?.residualRisk !== undefined
    );
    
    if (hasResidualRisk) {
      completedItems++;
    }

    completionRate = completedItems / totalItems;
    const isValid = issues.filter(i => i.severity === 'error').length === 0;

    return {
      workshop: 5,
      completionRate,
      isValid,
      issues
    };
  }

  /**
   * Vérifie la cohérence entre les ateliers
   */
  private checkInterWorkshopCoherence(data: any): CoherenceIssue[] {
    const issues: CoherenceIssue[] = [];

    // 1. Vérifier que chaque événement redouté a au moins un scénario
    data.dreadedEvents.forEach((de: DreadedEvent) => {
      const hasScenario = data.strategicScenarios.some((ss: StrategicScenario) => 
        ss.dreadedEventId === de.id
      );
      
      if (!hasScenario) {
        issues.push({
          severity: 'warning',
          workshop: 3,
          field: 'dreadedEvent.scenario',
          message: `Événement redouté "${de.name}" sans scénario associé`,
          suggestion: 'Créez au moins un scénario pour chaque événement redouté'
        });
      }
    });

    // 2. Vérifier que chaque source de risque retenue a des chemins d'attaque
    const retainedSources = data.riskSources.filter((rs: RiskSource) => 
      rs.pertinence && rs.pertinence >= 2
    );
    
    retainedSources.forEach((rs: RiskSource) => {
      const hasPaths = data.attackPaths.some((ap: AttackPath) => 
        ap.sourceRisqueNom === rs.name || 
        data.strategicScenarios.some((ss: StrategicScenario) => 
          ss.riskSourceId === rs.id
        )
      );
      
      if (!hasPaths) {
        issues.push({
          severity: 'warning',
          workshop: 3,
          field: 'riskSource.paths',
          message: `Source de risque "${rs.name}" retenue sans chemins d'attaque`,
          suggestion: 'Définissez les chemins d\'attaque possibles'
        });
      }
    });

    // 3. Vérifier la traçabilité complète
    // TODO: Implémenter une vérification de traçabilité bout en bout

    return issues;
  }

  /**
   * Vérifie les liens stratégiques
   */
  private checkStrategicLinks(data: any): boolean {
    // Vérifier que les scénarios sont liés aux bons éléments
    let allLinksValid = true;
    
    data.strategicScenarios.forEach((ss: StrategicScenario) => {
      // Vérifier lien avec source de risque
      const hasValidSource = data.riskSources.some((rs: RiskSource) => 
        rs.id === ss.riskSourceId
      );
      
      // Vérifier lien avec valeur métier
      const hasValidTarget = data.businessValues.some((bv: BusinessValue) => 
        bv.id === ss.targetBusinessValueId
      );
      
      if (!hasValidSource || !hasValidTarget) {
        allLinksValid = false;
      }
    });
    
    return allLinksValid;
  }

  /**
   * Vérifie la couverture des scénarios
   */
  private checkScenarioCoverage(data: any): { total: number; covered: number; uncovered: number } {
    const allScenarios = [
      ...data.strategicScenarios,
      ...data.operationalScenarios
    ];
    
    let covered = 0;
    
    allScenarios.forEach((scenario: any) => {
      const hasMeasures = data.securityMeasures.some((sm: SecurityMeasure) => 
        sm.targetScenarios?.includes(scenario.id)
      );
      
      if (hasMeasures) {
        covered++;
      }
    });
    
    return {
      total: allScenarios.length,
      covered,
      uncovered: allScenarios.length - covered
    };
  }

  /**
   * Calcule le score global
   */
  private calculateOverallScore(workshopStatuses: WorkshopStatus[]): number {
    const weights = [0.25, 0.20, 0.20, 0.15, 0.20]; // Poids par atelier
    let weightedSum = 0;
    
    workshopStatuses.forEach((status, index) => {
      const workshopScore = status.completionRate * (status.isValid ? 1 : 0.5);
      weightedSum += workshopScore * weights[index];
    });
    
    return Math.min(weightedSum, 1);
  }

  /**
   * Génère des recommandations
   */
  private generateRecommendations(issues: CoherenceIssue[], statuses: WorkshopStatus[]): string[] {
    const recommendations: string[] = [];
    
    // Recommandations par criticité
    const criticalCount = issues.filter(i => i.severity === 'error').length;
    if (criticalCount > 0) {
      recommendations.push(`Corrigez les ${criticalCount} erreurs critiques en priorité`);
    }
    
    // Recommandations par atelier
    statuses.forEach(status => {
      if (status.completionRate < 0.5) {
        recommendations.push(`Complétez l'atelier ${status.workshop} (actuellement à ${Math.round(status.completionRate * 100)}%)`);
      }
    });
    
    // Recommandations spécifiques
    if (!statuses[0].isValid) {
      recommendations.push("Finalisez le cadrage et l'identification des valeurs métier");
    }
    
    if (!statuses[4].isValid) {
      recommendations.push("Définissez un plan de traitement du risque complet");
    }
    
    return recommendations;
  }
}

// Export singleton
export const ebiosCoherenceService = new EbiosCoherenceService(); 
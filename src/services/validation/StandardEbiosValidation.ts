/**
 * 🔧 SERVICE DE VALIDATION STANDARDISÉ EBIOS RM v1.5
 * Harmonise les critères de validation entre tous les workshops
 * Assure la conformité ANSSI et la cohérence méthodologique
 */

import type { 
  BusinessValue, 
  DreadedEvent, 
  SupportingAsset, 
  RiskSource, 
  StrategicScenario,
  SecurityMeasure,
  WorkshopValidation 
} from '@/types/ebios';

export interface StandardValidationResult {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  isComplete: boolean;
  completionPercentage: number;
  requiredCriteriaMet: number;
  totalRequiredCriteria: number;
  validationResults: WorkshopValidation[];
  anssiCompliance: {
    score: number; // 0-100
    level: 'non-conforme' | 'partiellement-conforme' | 'conforme' | 'excellent';
    gaps: string[];
  };
  interWorkshopLinks: {
    missingLinks: string[];
    brokenTraceability: string[];
  };
  recommendations: string[];
}

export class StandardEbiosValidation {
  
  /**
   * 🎯 CRITÈRES STANDARDISÉS PAR WORKSHOP
   */
  private static readonly STANDARD_CRITERIA = {
    1: [
      { criterion: 'Valeurs métier identifiées (min. 2)', required: true, weight: 20 },
      { criterion: 'Actifs supports cartographiés', required: true, weight: 20 },
      { criterion: 'Événements redoutés définis', required: true, weight: 20 },
      { criterion: 'Socle de sécurité évalué', required: false, weight: 15 },
      { criterion: 'Parties prenantes identifiées', required: false, weight: 10 },
      { criterion: 'Échelles ANSSI appliquées', required: true, weight: 15 }
    ],
    2: [
      { criterion: 'Sources de risque catégorisées (min. 3)', required: true, weight: 25 },
      { criterion: 'Objectifs visés définis', required: true, weight: 25 },
      { criterion: 'Modes opératoires analysés', required: true, weight: 20 },
      { criterion: 'Pertinence évaluée (échelle ANSSI)', required: true, weight: 20 },
      { criterion: 'Techniques MITRE référencées', required: false, weight: 10 }
    ],
    3: [
      { criterion: 'Scénarios stratégiques construits', required: true, weight: 25 },
      { criterion: 'Matrice de risque appliquée', required: true, weight: 25 },
      { criterion: 'Vraisemblance évaluée', required: true, weight: 20 },
      { criterion: 'Gravité évaluée', required: true, weight: 20 },
      { criterion: 'Priorisation des risques', required: false, weight: 10 }
    ],
    4: [
      { criterion: 'Chemins d\'attaque détaillés', required: true, weight: 30 },
      { criterion: 'Techniques MITRE documentées', required: true, weight: 25 },
      { criterion: 'Faisabilité évaluée', required: true, weight: 20 },
      { criterion: 'Étapes d\'attaque définies', required: true, weight: 15 },
      { criterion: 'Actifs supports impliqués', required: false, weight: 10 }
    ],
    5: [
      { criterion: 'Mesures de sécurité définies', required: true, weight: 25 },
      { criterion: 'Couverture des scénarios critiques', required: true, weight: 25 },
      { criterion: 'Risque résiduel évalué', required: true, weight: 20 },
      { criterion: 'Plan d\'implémentation', required: true, weight: 20 },
      { criterion: 'Validation et cohérence', required: false, weight: 10 }
    ]
  };

  /**
   * 🔍 VALIDATION WORKSHOP 1
   */
  static validateWorkshop1(
    businessValues: BusinessValue[],
    supportingAssets: SupportingAsset[],
    dreadedEvents: DreadedEvent[]
  ): StandardValidationResult {
    const criteria = this.STANDARD_CRITERIA[1];
    const validationResults: WorkshopValidation[] = [];
    let totalScore = 0;

    criteria.forEach(criterion => {
      let met = false;
      let evidence = '';

      switch (criterion.criterion) {
        case 'Valeurs métier identifiées (min. 2)':
          met = businessValues.length >= 2;
          evidence = `${businessValues.length} valeur(s) métier identifiée(s)`;
          break;
        case 'Actifs supports cartographiés':
          met = supportingAssets.length > 0;
          evidence = `${supportingAssets.length} actif(s) support(s) cartographié(s)`;
          break;
        case 'Événements redoutés définis':
          met = dreadedEvents.length > 0;
          evidence = `${dreadedEvents.length} événement(s) redouté(s) défini(s)`;
          break;
        case 'Socle de sécurité évalué':
          met = supportingAssets.some(sa => sa.securityControls && sa.securityControls.length > 0);
          evidence = met ? 'Contrôles de sécurité documentés' : 'Aucun contrôle documenté';
          break;
        case 'Parties prenantes identifiées':
          const valuesWithStakeholders = businessValues.filter(bv => bv.stakeholders && bv.stakeholders.length > 0);
          met = valuesWithStakeholders.length > 0;
          evidence = `${valuesWithStakeholders.length}/${businessValues.length} valeurs avec parties prenantes`;
          break;
        case 'Échelles ANSSI appliquées':
          const validScales = businessValues.filter(bv => bv.priority >= 1 && bv.priority <= 4);
          met = validScales.length === businessValues.length && businessValues.length > 0;
          evidence = `${validScales.length}/${businessValues.length} valeurs avec échelle ANSSI valide`;
          break;
      }

      if (met) {
        totalScore += criterion.weight;
      }

      validationResults.push({
        criterion: criterion.criterion,
        required: criterion.required,
        met,
        evidence
      });
    });

    return this.buildValidationResult(1, validationResults, totalScore, businessValues, dreadedEvents);
  }

  /**
   * 🔍 VALIDATION WORKSHOP 2
   */
  static validateWorkshop2(
    riskSources: RiskSource[],
    businessValues: BusinessValue[]
  ): StandardValidationResult {
    const criteria = this.STANDARD_CRITERIA[2];
    const validationResults: WorkshopValidation[] = [];
    let totalScore = 0;

    criteria.forEach(criterion => {
      let met = false;
      let evidence = '';

      switch (criterion.criterion) {
        case 'Sources de risque catégorisées (min. 3)':
          met = riskSources.length >= 3;
          evidence = `${riskSources.length} source(s) de risque identifiée(s)`;
          break;
        case 'Objectifs visés définis':
          const sourcesWithObjectives = riskSources.filter(rs => rs.objectives && rs.objectives.length > 0);
          met = sourcesWithObjectives.length === riskSources.length && riskSources.length > 0;
          evidence = `${sourcesWithObjectives.length}/${riskSources.length} sources avec objectifs`;
          break;
        case 'Modes opératoires analysés':
          const sourcesWithModes = riskSources.filter(rs => rs.operationalModes && rs.operationalModes.length > 0);
          met = sourcesWithModes.length > 0;
          evidence = `${sourcesWithModes.length}/${riskSources.length} sources avec modes opératoires`;
          break;
        case 'Pertinence évaluée (échelle ANSSI)':
          const sourcesWithPertinence = riskSources.filter(rs => rs.pertinence >= 1 && rs.pertinence <= 4);
          met = sourcesWithPertinence.length === riskSources.length && riskSources.length > 0;
          evidence = `${sourcesWithPertinence.length}/${riskSources.length} sources avec pertinence évaluée`;
          break;
        case 'Techniques MITRE référencées':
          const sourcesWithTechniques = riskSources.filter(rs => 
            rs.operationalModes?.some(om => om.techniques && om.techniques.length > 0)
          );
          met = sourcesWithTechniques.length > 0;
          evidence = `${sourcesWithTechniques.length} source(s) avec techniques MITRE`;
          break;
      }

      if (met) {
        totalScore += criterion.weight;
      }

      validationResults.push({
        criterion: criterion.criterion,
        required: criterion.required,
        met,
        evidence
      });
    });

    return this.buildValidationResult(2, validationResults, totalScore, riskSources);
  }

  /**
   * 🏗️ CONSTRUCTION DU RÉSULTAT DE VALIDATION
   */
  private static buildValidationResult(
    workshopNumber: 1 | 2 | 3 | 4 | 5,
    validationResults: WorkshopValidation[],
    totalScore: number,
    ...data: any[]
  ): StandardValidationResult {
    const requiredCriteria = validationResults.filter(r => r.required);
    const metRequiredCriteria = requiredCriteria.filter(r => r.met);
    const isComplete = metRequiredCriteria.length === requiredCriteria.length;
    const completionPercentage = Math.round((validationResults.filter(r => r.met).length / validationResults.length) * 100);

    // Détermination du niveau de conformité ANSSI
    let complianceLevel: 'non-conforme' | 'partiellement-conforme' | 'conforme' | 'excellent';
    if (totalScore >= 90) complianceLevel = 'excellent';
    else if (totalScore >= 75) complianceLevel = 'conforme';
    else if (totalScore >= 50) complianceLevel = 'partiellement-conforme';
    else complianceLevel = 'non-conforme';

    const gaps = validationResults
      .filter(r => r.required && !r.met)
      .map(r => r.criterion);

    return {
      workshopNumber,
      isComplete,
      completionPercentage,
      requiredCriteriaMet: metRequiredCriteria.length,
      totalRequiredCriteria: requiredCriteria.length,
      validationResults,
      anssiCompliance: {
        score: totalScore,
        level: complianceLevel,
        gaps
      },
      interWorkshopLinks: {
        missingLinks: [], // À implémenter
        brokenTraceability: [] // À implémenter
      },
      recommendations: this.generateRecommendations(workshopNumber, validationResults, totalScore)
    };
  }

  /**
   * 💡 GÉNÉRATION DE RECOMMANDATIONS
   */
  private static generateRecommendations(
    workshopNumber: number,
    validationResults: WorkshopValidation[],
    score: number
  ): string[] {
    const recommendations: string[] = [];
    const unmetRequired = validationResults.filter(r => r.required && !r.met);

    if (unmetRequired.length > 0) {
      recommendations.push(`Compléter les ${unmetRequired.length} critère(s) obligatoire(s) manquant(s)`);
    }

    if (score < 75) {
      recommendations.push('Améliorer la documentation pour atteindre la conformité ANSSI');
    }

    // Recommandations spécifiques par workshop
    switch (workshopNumber) {
      case 1:
        if (score < 80) {
          recommendations.push('Enrichir la cartographie des actifs supports et leurs vulnérabilités');
        }
        break;
      case 2:
        if (score < 80) {
          recommendations.push('Associer des techniques MITRE ATT&CK aux modes opératoires');
        }
        break;
    }

    return recommendations;
  }
}

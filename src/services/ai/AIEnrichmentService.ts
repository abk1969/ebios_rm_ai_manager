import type { 
  BusinessValue, 
  DreadedEvent, 
  RiskSource, 
  AttackPath, 
  SecurityMeasure,
  SupportingAsset 
} from '@/types/ebios';

/**
 * Service d'enrichissement IA pour toutes les entités EBIOS
 * Appelé automatiquement lors de la création/mise à jour
 */
export class AIEnrichmentService {
  /**
   * Enrichit une valeur métier avec des métadonnées IA
   */
  static enrichBusinessValue(businessValue: Partial<BusinessValue>): Partial<BusinessValue> {
    return {
      ...businessValue,
      aiMetadata: {
        autoCompleted: false,
        suggestedCategory: businessValue.category,
        coherenceScore: this.calculateCoherence(businessValue.name, businessValue.description),
        relatedValues: [],
        impactAnalysis: {
          criticalityScore: this.calculateCriticalityScore(businessValue),
          dependencies: [],
          riskExposure: this.calculateRiskExposure(businessValue)
        },
        recommendations: this.generateRecommendations('businessValue', businessValue)
      }
    };
  }

  /**
   * Enrichit un événement redouté avec des analyses IA
   */
  static enrichDreadedEvent(dreadedEvent: Partial<DreadedEvent>): Partial<DreadedEvent> {
    return {
      ...dreadedEvent,
      aiAnalysis: {
        impactSeverity: dreadedEvent.gravity || 2, // Échelle EBIOS RM 1-4 directe
        cascadingEffects: this.analyzeCascadingEffects(dreadedEvent),
        mitigationSuggestions: this.generateMitigationSuggestions(dreadedEvent),
        relatedEvents: [],
        probabilityAssessment: {
          likelihood: this.assessLikelihood(dreadedEvent),
          confidence: 3, // Échelle EBIOS RM 1-4 (3 = Élevée)
          factors: this.identifyRiskFactors(dreadedEvent)
        }
      }
    };
  }

  /**
   * Enrichit une source de risque avec un profil de menace IA
   */
  static enrichRiskSource(riskSource: Partial<RiskSource>): Partial<RiskSource> {
    return {
      ...riskSource,
      aiProfile: {
        threatLevel: this.calculateThreatLevel(riskSource),
        predictedActions: this.predictThreatActions(riskSource),
        historicalPatterns: {
          frequency: this.estimateAttackFrequency(riskSource),
          commonTargets: this.identifyCommonTargets(riskSource.category),
          preferredMethods: this.getPreferredMethods(riskSource.category)
        },
        motivationAnalysis: {
          primaryDrivers: this.analyzePrimaryMotivations(riskSource),
          secondaryFactors: this.analyzeSecondaryFactors(riskSource),
          triggerEvents: this.identifyTriggerEvents(riskSource)
        },
        recommendedDefenses: this.recommendDefenses(riskSource)
      }
    };
  }

  /**
   * Enrichit un chemin d'attaque avec des analyses de complexité
   */
  static enrichAttackPath(attackPath: Partial<AttackPath>): Partial<AttackPath> {
    return {
      ...attackPath,
      aiMetadata: {
        pathComplexity: this.calculatePathComplexity(attackPath),
        successLikelihood: (attackPath.successProbability || 2) * 0.25,
        detectionDifficulty: this.assessDetectionDifficulty(attackPath),
        suggestedCountermeasures: this.suggestCountermeasures(attackPath),
        attackVectorAnalysis: {
          entryPoints: this.identifyEntryPoints(attackPath),
          criticalSteps: this.identifyCriticalSteps(attackPath),
          timeEstimate: this.estimateAttackDuration(attackPath)
        }
      }
    };
  }

  /**
   * Enrichit une mesure de sécurité avec des suggestions ISO
   */
  static enrichSecurityMeasure(measure: Partial<SecurityMeasure>): Partial<SecurityMeasure> {
    const isoSuggestion = this.suggestISOControl(measure.name, measure.description);
    
    return {
      ...measure,
      isoCategory: measure.isoCategory || isoSuggestion?.category,
      isoControl: measure.isoControl || isoSuggestion?.control,
      aiMetadata: {
        autoCompleted: false,
        suggestedISO: isoSuggestion,
        coherenceScore: this.calculateMeasureCoherence(measure),
        relatedMeasures: [],
        effectivenessAnalysis: {
          predictedEffectiveness: this.predictEffectiveness(measure),
          riskReductionFactor: this.calculateRiskReduction(measure),
          recommendations: this.generateMeasureRecommendations(measure)
        }
      }
    };
  }

  /**
   * Enrichit un bien support avec des suggestions de vulnérabilités
   */
  static enrichSupportingAsset(asset: Partial<SupportingAsset>): Partial<SupportingAsset> {
    return {
      ...asset,
      aiSuggestions: {
        vulnerabilities: this.suggestVulnerabilities(asset),
        dependencies: this.detectDependencies(asset),
        riskLevel: this.calculateAssetRisk(asset),
        protectionMeasures: this.suggestProtectionMeasures(asset),
        criticalityAssessment: {
          businessImpact: this.assessBusinessImpact(asset),
          technicalCriticality: this.assessTechnicalCriticality(asset),
          overallScore: this.calculateOverallCriticality(asset)
        }
      }
    };
  }

  // Méthodes privées d'analyse

  private static calculateCoherence(name?: string, description?: string): number {
    if (!name || !description) return 0;
    const nameLength = name.length;
    const descLength = description.length;
    const hasKeywords = this.checkEBIOSKeywords(name + ' ' + description);
    return Math.min((nameLength * 5 + descLength + (hasKeywords ? 50 : 0)) / 300, 1);
  }

  private static calculateCriticalityScore(value: Partial<BusinessValue>): number {
    const priorityScore = (value.priority || 2) * 0.25;
    const criticalityMap = { essential: 4, important: 3, useful: 2 }; // Échelle EBIOS RM 1-4
    const criticalityScore = criticalityMap[value.criticalityLevel || 'useful'];
    return (priorityScore + criticalityScore) / 2;
  }

  private static calculateRiskExposure(value: Partial<BusinessValue>): number {
    // Simulation basée sur la catégorie et la priorité
    const categoryRisk = { primary: 4, support: 3, management: 2, essential: 4 }; // Échelle EBIOS RM 1-4
    const baseRisk = categoryRisk[value.category || 'support'] || 0.6;
    return baseRisk * ((value.priority || 2) * 0.25);
  }

  private static generateRecommendations(type: string, entity: any): string[] {
    const recommendations = [];
    
    if (type === 'businessValue') {
      if (!entity.supportingAssets?.length) {
        recommendations.push("Identifier les biens supports associés");
      }
      if (!entity.dreadedEvents?.length) {
        recommendations.push("Définir les événements redoutés potentiels");
      }
      if (entity.priority >= 3) {
        recommendations.push("Évaluer l'impact financier en cas de compromission");
      }
    }
    
    return recommendations;
  }

  private static analyzeCascadingEffects(event: Partial<DreadedEvent>): string[] {
    const effects = [];
    
    if (event.impactType === 'availability') {
      effects.push("Interruption des processus métier");
      effects.push("Perte de productivité");
    }
    if (event.impactType === 'confidentiality') {
      effects.push("Atteinte à la réputation");
      effects.push("Sanctions réglementaires potentielles");
    }
    if (event.impactType === 'integrity') {
      effects.push("Décisions basées sur des données erronées");
      effects.push("Non-conformité réglementaire");
    }
    
    return effects;
  }

  private static calculateThreatLevel(source: Partial<RiskSource>): number {
    const pertinence = (source.pertinence || 2) * 0.25;
    const expertiseMap = { limited: 1, moderate: 2, high: 3, expert: 4 }; // Échelle EBIOS RM 1-4
    const expertise = typeof source.expertise === 'string' ? expertiseMap[source.expertise] || 2 : (source.expertise || 2);
    const resourceMap = { limited: 1, moderate: 2, high: 3, unlimited: 4 }; // Échelle EBIOS RM 1-4
    const resources = typeof source.resources === 'string' ? resourceMap[source.resources as keyof typeof resourceMap] || 2 : 2;
    const motivation = (source.motivation || 2) * 0.25;
    
    return (pertinence + expertise + resources + motivation) / 4;
  }

  private static suggestISOControl(name?: string, description?: string): any {
    // Analyse du nom et de la description pour suggérer un contrôle ISO 27001
    const text = `${name} ${description}`.toLowerCase();
    
    if (text.includes('access') || text.includes('accès')) {
      return { category: 'A.9', control: 'A.9.1.1', confidence: 0.85 };
    }
    if (text.includes('backup') || text.includes('sauvegarde')) {
      return { category: 'A.12', control: 'A.12.3.1', confidence: 0.9 };
    }
    if (text.includes('encrypt') || text.includes('chiffr')) {
      return { category: 'A.10', control: 'A.10.1.1', confidence: 0.88 };
    }
    
    return { category: 'A.18', control: 'A.18.1.1', confidence: 0.6 };
  }

  private static checkEBIOSKeywords(text: string): boolean {
    const keywords = ['valeur métier', 'bien support', 'événement redouté', 
                     'source de risque', 'scénario', 'mesure de sécurité'];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  // Autres méthodes d'analyse...
  private static generateMitigationSuggestions(event: Partial<DreadedEvent>): string[] {
    return ["Mettre en place une surveillance", "Développer un plan de réponse"];
  }

  private static assessLikelihood(event: Partial<DreadedEvent>): number {
    return 0.6; // Simplification
  }

  private static identifyRiskFactors(event: Partial<DreadedEvent>): string[] {
    return ["Exposition externe", "Attractivité de la cible"];
  }

  private static predictThreatActions(source: Partial<RiskSource>): string[] {
    const actions = [];
    if (source.category === 'cybercriminal') {
      actions.push("Ransomware", "Vol de données", "Fraude");
    }
    return actions;
  }

  private static estimateAttackFrequency(source: Partial<RiskSource>): number {
    return 0.3; // Simplification
  }

  private static identifyCommonTargets(category?: string): string[] {
    if (category === 'cybercriminal') return ["Données financières", "Données personnelles"];
    if (category === 'state') return ["Propriété intellectuelle", "Infrastructure critique"];
    return ["Données sensibles"];
  }

  private static getPreferredMethods(category?: string): string[] {
    if (category === 'cybercriminal') return ["Phishing", "Ransomware"];
    if (category === 'insider') return ["Abus de privilèges", "Vol de données"];
    return ["Exploitation de vulnérabilités"];
  }

  private static analyzePrimaryMotivations(source: Partial<RiskSource>): string[] {
    if (source.category === 'cybercriminal') return ["Gain financier"];
    if (source.category === 'activist') return ["Idéologique", "Médiatique"];
    return ["Variable"];
  }

  private static analyzeSecondaryFactors(source: Partial<RiskSource>): string[] {
    return ["Opportunité", "Facilité d'accès"];
  }

  private static identifyTriggerEvents(source: Partial<RiskSource>): string[] {
    return ["Crise économique", "Événement médiatique"];
  }

  private static recommendDefenses(source: Partial<RiskSource>): string[] {
    return ["Sensibilisation", "Segmentation réseau", "Monitoring"];
  }

  private static calculatePathComplexity(path: Partial<AttackPath>): number {
    return (path.difficulty || 2) * 0.25;
  }

  private static assessDetectionDifficulty(path: Partial<AttackPath>): number {
    return 0.6; // Simplification
  }

  private static suggestCountermeasures(path: Partial<AttackPath>): string[] {
    return ["Surveillance des logs", "Analyse comportementale"];
  }

  private static identifyEntryPoints(path: Partial<AttackPath>): string[] {
    return ["Email", "Web", "USB"];
  }

  private static identifyCriticalSteps(path: Partial<AttackPath>): number[] {
    return [2, 4, 6]; // Étapes critiques simplifiées
  }

  private static estimateAttackDuration(path: Partial<AttackPath>): string {
    return "2-4 heures";
  }

  private static calculateMeasureCoherence(measure: Partial<SecurityMeasure>): number {
    return 0.8; // Simplification
  }

  private static predictEffectiveness(measure: Partial<SecurityMeasure>): number {
    return (measure.effectiveness || 3) * 0.25;
  }

  private static calculateRiskReduction(measure: Partial<SecurityMeasure>): number {
    return 0.7; // Simplification
  }

  private static generateMeasureRecommendations(measure: Partial<SecurityMeasure>): string[] {
    return ["Définir des KPI", "Planifier des tests réguliers"];
  }

  private static suggestVulnerabilities(asset: Partial<SupportingAsset>): string[] {
    if (asset.type === 'software') return ["CVE non patchés", "Configuration faible"];
    if (asset.type === 'hardware') return ["Firmware obsolète", "Accès physique"];
    return ["Vulnérabilités génériques"];
  }

  private static detectDependencies(asset: Partial<SupportingAsset>): string[] {
    return ["Infrastructure réseau", "Alimentation électrique"];
  }

  private static calculateAssetRisk(asset: Partial<SupportingAsset>): number {
    return 0.6; // Simplification
  }

  private static suggestProtectionMeasures(asset: Partial<SupportingAsset>): string[] {
    return ["Chiffrement", "Contrôle d'accès", "Surveillance"];
  }

  private static assessBusinessImpact(asset: Partial<SupportingAsset>): number {
    return 0.7; // Simplification
  }

  private static assessTechnicalCriticality(asset: Partial<SupportingAsset>): number {
    return 0.6; // Simplification
  }

  private static calculateOverallCriticality(asset: Partial<SupportingAsset>): number {
    return 0.65; // Simplification
  }
} 
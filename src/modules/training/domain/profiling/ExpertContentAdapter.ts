/**
 * 🎯 ADAPTATEUR DE CONTENU EXPERT
 * Système d'adaptation dynamique du contenu selon le profil expert
 * Génération contextuelle pour professionnels EBIOS/GRC/Audit
 */

import { 
  EbiosExpertProfile, 
  EbiosSpecialization,
  WorkshopContext 
} from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { ExpertPerformanceMetrics } from './ExpertPerformanceMetrics';

// 🎯 TYPES D'ADAPTATION
export interface ContentAdaptationConfig {
  userProfile: EbiosExpertProfile;
  performanceMetrics: ExpertPerformanceMetrics;
  workshopContext: WorkshopContext;
  adaptationLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' | 'master';
  focusAreas: EbiosSpecialization[];
  avoidanceAreas: string[];
}

export interface AdaptedContent {
  scenarios: ExpertScenario[];
  exercises: AdaptedExercise[];
  references: ContextualReference[];
  complexity: ComplexityProfile;
  estimatedDuration: number;
  learningObjectives: string[];
  prerequisites: string[];
}

export interface ExpertScenario {
  id: string;
  title: string;
  description: string;
  sector: string;
  organizationType: string;
  complexity: number; // 1-10
  realWorldBasis: boolean;
  stakeholders: Stakeholder[];
  constraints: Constraint[];
  context: ScenarioContext;
  expectedOutcomes: string[];
}

export interface AdaptedExercise {
  id: string;
  type: 'risk_modeling' | 'threat_analysis' | 'compliance_audit' | 'governance_design' | 'quantitative_analysis';
  title: string;
  description: string;
  difficulty: number; // 1-10
  estimatedTime: number; // minutes
  requiredSkills: EbiosSpecialization[];
  adaptationReason: string;
  successCriteria: SuccessCriteria;
  hints: ContextualHint[];
  tools: RequiredTool[];
}

export interface ContextualReference {
  type: 'regulation' | 'standard' | 'methodology' | 'case_study' | 'best_practice';
  title: string;
  source: string;
  relevance: number; // 0-1
  sector: string;
  lastUpdated: Date;
  url?: string;
  summary: string;
}

export interface ComplexityProfile {
  analytical: number; // 1-10
  methodological: number;
  technical: number;
  regulatory: number;
  strategic: number;
  overall: number;
}

// 🏢 TYPES CONTEXTUELS
export interface Stakeholder {
  role: string;
  influence: number; // 1-10
  expertise: string[];
  concerns: string[];
}

export interface Constraint {
  type: 'regulatory' | 'technical' | 'budgetary' | 'temporal' | 'organizational';
  description: string;
  severity: number; // 1-10
  impact: string[];
}

export interface ScenarioContext {
  geographicScope: string;
  regulatoryFramework: string[];
  industrySpecifics: string[];
  threatLandscape: string[];
  businessCriticality: number; // 1-10
}

export interface SuccessCriteria {
  quantitative: QuantitativeCriteria[];
  qualitative: QualitativeCriteria[];
  timeConstraints: TimeConstraint[];
  methodologyCompliance: MethodologyRequirement[];
}

export interface QuantitativeCriteria {
  metric: string;
  target: number;
  tolerance: number;
  weight: number; // 0-1
}

export interface QualitativeCriteria {
  aspect: string;
  description: string;
  evaluationMethod: string;
  weight: number; // 0-1
}

export interface TimeConstraint {
  phase: string;
  maxDuration: number; // minutes
  penalty: number; // score reduction
}

export interface MethodologyRequirement {
  framework: string;
  compliance: number; // 0-1
  mandatory: boolean;
}

export interface ContextualHint {
  trigger: string; // Condition d'affichage
  content: string;
  type: 'methodology' | 'regulatory' | 'technical' | 'strategic';
  relevance: number; // 0-1
}

export interface RequiredTool {
  name: string;
  type: 'calculation' | 'modeling' | 'analysis' | 'documentation';
  description: string;
  optional: boolean;
}

// 🎯 ADAPTATEUR PRINCIPAL
export class ExpertContentAdapter {
  
  // 🚀 ADAPTATION PRINCIPALE
  static adaptContent(config: ContentAdaptationConfig): AdaptedContent {
    const scenarios = this.generateAdaptedScenarios(config);
    const exercises = this.generateAdaptedExercises(config);
    const references = this.selectContextualReferences(config);
    const complexity = this.calculateComplexityProfile(config);
    const estimatedDuration = this.estimateDuration(exercises);
    const learningObjectives = this.defineLearningObjectives(config);
    const prerequisites = this.identifyPrerequisites(config);

    return {
      scenarios,
      exercises,
      references,
      complexity,
      estimatedDuration,
      learningObjectives,
      prerequisites
    };
  }

  // 🎭 GÉNÉRATION SCÉNARIOS ADAPTÉS
  private static generateAdaptedScenarios(config: ContentAdaptationConfig): ExpertScenario[] {
    const scenarios: ExpertScenario[] = [];
    
    // Sélection secteur selon profil
    const preferredSectors = this.selectPreferredSectors(config.userProfile);
    
    preferredSectors.forEach(sector => {
      const scenario = this.createSectorSpecificScenario(sector, config);
      scenarios.push(scenario);
    });

    // Ajout scénarios multi-secteurs pour experts avancés
    if (config.adaptationLevel === 'expert' || config.adaptationLevel === 'master') {
      scenarios.push(this.createMultiSectorScenario(config));
    }

    return scenarios;
  }

  // 🎯 CRÉATION SCÉNARIO SECTORIEL
  private static createSectorSpecificScenario(
    sector: string, 
    config: ContentAdaptationConfig
  ): ExpertScenario {
    const sectorTemplates = this.getSectorTemplates();
    const template = sectorTemplates[sector] || sectorTemplates['generic'];
    
    const complexity = this.calculateScenarioComplexity(config);
    
    return {
      id: `scenario_${sector}_${Date.now()}`,
      title: `${template.title} - Niveau ${config.adaptationLevel}`,
      description: this.adaptDescription(template.description, config),
      sector,
      organizationType: template.organizationType,
      complexity,
      realWorldBasis: true,
      stakeholders: this.adaptStakeholders(template.stakeholders, config),
      constraints: this.adaptConstraints(template.constraints, config),
      context: this.buildScenarioContext(sector, config),
      expectedOutcomes: this.defineExpectedOutcomes(config)
    };
  }

  // 🏭 TEMPLATES SECTORIELS
  private static getSectorTemplates(): Record<string, any> {
    return {
      healthcare: {
        title: 'Écosystème de santé interconnecté',
        description: 'CHU régional avec réseau de partenaires et plateformes numériques',
        organizationType: 'public_health',
        stakeholders: [
          { role: 'RSSI', influence: 9, expertise: ['cybersecurity', 'compliance'], concerns: ['data_protection', 'continuity'] },
          { role: 'DPO', influence: 8, expertise: ['gdpr', 'health_data'], concerns: ['privacy', 'consent'] },
          { role: 'Medical Director', influence: 10, expertise: ['clinical', 'operations'], concerns: ['patient_safety', 'quality'] }
        ],
        constraints: [
          { type: 'regulatory', description: 'Conformité HDS obligatoire', severity: 10, impact: ['certification', 'operations'] },
          { type: 'technical', description: 'Interopérabilité FHIR', severity: 7, impact: ['integration', 'data_exchange'] }
        ]
      },
      finance: {
        title: 'Écosystème fintech et services bancaires',
        description: 'Néobanque avec partenaires financiers et API tierces',
        organizationType: 'financial_services',
        stakeholders: [
          { role: 'CRO', influence: 10, expertise: ['risk_management', 'regulation'], concerns: ['compliance', 'reputation'] },
          { role: 'CISO', influence: 9, expertise: ['cybersecurity', 'fraud'], concerns: ['threats', 'resilience'] },
          { role: 'Compliance Officer', influence: 8, expertise: ['regulation', 'audit'], concerns: ['sanctions', 'reporting'] }
        ],
        constraints: [
          { type: 'regulatory', description: 'Conformité PCI DSS et DORA', severity: 10, impact: ['operations', 'licensing'] },
          { type: 'technical', description: 'API security et fraud detection', severity: 8, impact: ['transactions', 'trust'] }
        ]
      },
      industry: {
        title: 'Industrie 4.0 et OIV',
        description: 'Site industriel critique avec systèmes cyber-physiques',
        organizationType: 'critical_infrastructure',
        stakeholders: [
          { role: 'Plant Manager', influence: 10, expertise: ['operations', 'safety'], concerns: ['production', 'incidents'] },
          { role: 'OT Security Manager', influence: 9, expertise: ['industrial_security', 'scada'], concerns: ['availability', 'safety'] },
          { role: 'IT/OT Architect', influence: 8, expertise: ['integration', 'architecture'], concerns: ['convergence', 'security'] }
        ],
        constraints: [
          { type: 'regulatory', description: 'Directive NIS2 et sécurité OIV', severity: 10, impact: ['operations', 'reporting'] },
          { type: 'technical', description: 'Convergence IT/OT sécurisée', severity: 9, impact: ['integration', 'isolation'] }
        ]
      },
      generic: {
        title: 'Organisation complexe multi-sites',
        description: 'Entreprise avec écosystème de partenaires',
        organizationType: 'enterprise',
        stakeholders: [
          { role: 'CISO', influence: 9, expertise: ['cybersecurity'], concerns: ['threats', 'compliance'] },
          { role: 'Risk Manager', influence: 8, expertise: ['risk_management'], concerns: ['exposure', 'mitigation'] }
        ],
        constraints: [
          { type: 'regulatory', description: 'Conformité multi-référentiels', severity: 7, impact: ['compliance'] }
        ]
      }
    };
  }

  // 🎯 GÉNÉRATION EXERCICES ADAPTÉS
  private static generateAdaptedExercises(config: ContentAdaptationConfig): AdaptedExercise[] {
    const exercises: AdaptedExercise[] = [];
    
    // Exercices selon spécialisations
    config.focusAreas.forEach(specialization => {
      const exercise = this.createSpecializationExercise(specialization, config);
      exercises.push(exercise);
    });

    // Exercices transversaux pour experts
    if (config.adaptationLevel === 'expert' || config.adaptationLevel === 'master') {
      exercises.push(this.createIntegratedExercise(config));
    }

    return exercises;
  }

  // 🎯 CRÉATION EXERCICE SPÉCIALISÉ
  private static createSpecializationExercise(
    specialization: EbiosSpecialization,
    config: ContentAdaptationConfig
  ): AdaptedExercise {
    const exerciseTemplates = this.getExerciseTemplates();
    const template = exerciseTemplates[specialization];
    
    const difficulty = this.calculateExerciseDifficulty(config, specialization);
    
    return {
      id: `exercise_${specialization}_${Date.now()}`,
      type: template.type,
      title: `${template.title} - ${config.workshopContext.sector}`,
      description: this.adaptExerciseDescription(template.description, config),
      difficulty,
      estimatedTime: this.calculateEstimatedTime(difficulty, config.userProfile.experienceYears),
      requiredSkills: [specialization],
      adaptationReason: `Adapté pour expertise ${specialization} niveau ${config.adaptationLevel}`,
      successCriteria: this.buildSuccessCriteria(specialization, config),
      hints: this.generateContextualHints(specialization, config),
      tools: this.selectRequiredTools(specialization, config)
    };
  }

  // 🛠️ TEMPLATES D'EXERCICES
  private static getExerciseTemplates(): Record<EbiosSpecialization, any> {
    return {
      risk_analysis: {
        type: 'risk_modeling',
        title: 'Modélisation de risques complexes',
        description: 'Analyse multi-dimensionnelle avec dépendances'
      },
      threat_modeling: {
        type: 'threat_analysis',
        title: 'Modélisation de menaces sophistiquées',
        description: 'Analyse TTPs et kill chains avancées'
      },
      compliance_assessment: {
        type: 'compliance_audit',
        title: 'Évaluation de conformité multi-référentiels',
        description: 'Audit croisé avec analyse de gaps'
      },
      governance_framework: {
        type: 'governance_design',
        title: 'Conception de framework de gouvernance',
        description: 'Architecture organisationnelle et processus'
      },
      audit_methodology: {
        type: 'compliance_audit',
        title: 'Méthodologie d\'audit avancée',
        description: 'Approche risk-based avec échantillonnage'
      },
      threat_intelligence: {
        type: 'threat_analysis',
        title: 'Intelligence des menaces contextualisée',
        description: 'Analyse prédictive et attribution'
      },
      incident_response: {
        type: 'risk_modeling',
        title: 'Gestion de crise cyber',
        description: 'Coordination et communication de crise'
      },
      business_continuity: {
        type: 'risk_modeling',
        title: 'Continuité d\'activité cyber-résiliente',
        description: 'Plans de continuité et récupération'
      }
    };
  }

  // 📚 SÉLECTION RÉFÉRENCES CONTEXTUELLES
  private static selectContextualReferences(config: ContentAdaptationConfig): ContextualReference[] {
    const references: ContextualReference[] = [];
    
    // Références réglementaires selon secteur
    const regulatoryRefs = this.getRegulatoryReferences(config.workshopContext.sector);
    references.push(...regulatoryRefs);
    
    // Standards techniques selon spécialisations
    config.focusAreas.forEach(specialization => {
      const techRefs = this.getTechnicalReferences(specialization);
      references.push(...techRefs);
    });
    
    // Cas d'études selon niveau
    if (config.adaptationLevel === 'expert' || config.adaptationLevel === 'master') {
      const caseStudies = this.getCaseStudies(config.workshopContext.sector);
      references.push(...caseStudies);
    }
    
    return references.sort((a, b) => b.relevance - a.relevance);
  }

  // 📊 CALCUL PROFIL COMPLEXITÉ
  private static calculateComplexityProfile(config: ContentAdaptationConfig): ComplexityProfile {
    const baseComplexity = this.getBaseComplexity(config.adaptationLevel);
    const experienceMultiplier = Math.min(1.5, 1 + (config.userProfile.experienceYears - 5) * 0.05);
    
    return {
      analytical: Math.round(baseComplexity.analytical * experienceMultiplier),
      methodological: Math.round(baseComplexity.methodological * experienceMultiplier),
      technical: Math.round(baseComplexity.technical * experienceMultiplier),
      regulatory: Math.round(baseComplexity.regulatory * experienceMultiplier),
      strategic: Math.round(baseComplexity.strategic * experienceMultiplier),
      overall: Math.round(baseComplexity.overall * experienceMultiplier)
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  private static selectPreferredSectors(profile: EbiosExpertProfile): string[] {
    return profile.sectors.length > 0 ? profile.sectors : ['generic'];
  }

  private static calculateScenarioComplexity(config: ContentAdaptationConfig): number {
    const levelComplexity = {
      'basic': 3,
      'intermediate': 5,
      'advanced': 7,
      'expert': 8,
      'master': 10
    };
    return levelComplexity[config.adaptationLevel];
  }

  private static calculateExerciseDifficulty(
    config: ContentAdaptationConfig, 
    specialization: EbiosSpecialization
  ): number {
    const baseLevel = {
      'basic': 3,
      'intermediate': 5,
      'advanced': 7,
      'expert': 8,
      'master': 10
    }[config.adaptationLevel];

    // Ajustement selon performance dans la spécialisation
    const performanceInSpecialization = config.performanceMetrics.categoryMetrics.get(specialization);
    const adjustment = performanceInSpecialization ? 
      (performanceInSpecialization.averageScore - 70) / 10 : 0;

    return Math.max(1, Math.min(10, baseLevel + adjustment));
  }

  private static calculateEstimatedTime(difficulty: number, experience: number): number {
    const baseTime = difficulty * 10; // 10 min par point de difficulté
    const experienceReduction = Math.min(0.5, experience * 0.05); // Max 50% réduction
    return Math.round(baseTime * (1 - experienceReduction));
  }

  private static getBaseComplexity(level: string): ComplexityProfile {
    const profiles = {
      'basic': { analytical: 3, methodological: 3, technical: 2, regulatory: 3, strategic: 2, overall: 3 },
      'intermediate': { analytical: 5, methodological: 5, technical: 4, regulatory: 5, strategic: 4, overall: 5 },
      'advanced': { analytical: 7, methodological: 7, technical: 6, regulatory: 7, strategic: 6, overall: 7 },
      'expert': { analytical: 8, methodological: 8, technical: 8, regulatory: 8, strategic: 7, overall: 8 },
      'master': { analytical: 10, methodological: 10, technical: 9, regulatory: 10, strategic: 9, overall: 10 }
    };
    return profiles[level] || profiles['intermediate'];
  }

  // Méthodes à implémenter selon besoins spécifiques
  private static adaptDescription(description: string, config: ContentAdaptationConfig): string { return description; }
  private static adaptStakeholders(stakeholders: any[], config: ContentAdaptationConfig): Stakeholder[] { return stakeholders; }
  private static adaptConstraints(constraints: any[], config: ContentAdaptationConfig): Constraint[] { return constraints; }
  private static buildScenarioContext(sector: string, config: ContentAdaptationConfig): ScenarioContext {
    return {
      geographicScope: 'France/Europe',
      regulatoryFramework: ['GDPR', 'NIS2'],
      industrySpecifics: [sector],
      threatLandscape: ['APT', 'Ransomware', 'Insider'],
      businessCriticality: 8
    };
  }
  private static defineExpectedOutcomes(config: ContentAdaptationConfig): string[] { return []; }
  private static adaptExerciseDescription(description: string, config: ContentAdaptationConfig): string { return description; }
  private static buildSuccessCriteria(specialization: EbiosSpecialization, config: ContentAdaptationConfig): SuccessCriteria {
    return { quantitative: [], qualitative: [], timeConstraints: [], methodologyCompliance: [] };
  }
  private static generateContextualHints(specialization: EbiosSpecialization, config: ContentAdaptationConfig): ContextualHint[] { return []; }
  private static selectRequiredTools(specialization: EbiosSpecialization, config: ContentAdaptationConfig): RequiredTool[] { return []; }
  private static createMultiSectorScenario(config: ContentAdaptationConfig): ExpertScenario { return {} as ExpertScenario; }
  private static createIntegratedExercise(config: ContentAdaptationConfig): AdaptedExercise { return {} as AdaptedExercise; }
  private static getRegulatoryReferences(sector: string): ContextualReference[] { return []; }
  private static getTechnicalReferences(specialization: EbiosSpecialization): ContextualReference[] { return []; }
  private static getCaseStudies(sector: string): ContextualReference[] { return []; }
  private static estimateDuration(exercises: AdaptedExercise[]): number { return 120; }
  private static defineLearningObjectives(config: ContentAdaptationConfig): string[] { return []; }
  private static identifyPrerequisites(config: ContentAdaptationConfig): string[] { return []; }
}

export default ExpertContentAdapter;

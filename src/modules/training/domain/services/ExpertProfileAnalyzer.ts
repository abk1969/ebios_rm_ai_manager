/**
 * 🔍 ANALYSEUR DE PROFIL EXPERT INTELLIGENT
 * Analyse avancée des compétences et adaptation du parcours
 * POINT 1 - Agent Orchestrateur Workshop 1 Intelligent
 */

import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { ExpertiseLevel } from './AdaptiveContentService';

// 🎯 TYPES POUR L'ANALYSE DE PROFIL

export interface ProfileAnalysisResult {
  expertiseLevel: ExpertiseLevel;
  learningPath: LearningPath;
  recommendations: ProfileRecommendation[];
  adaptationStrategy: AdaptationStrategy;
  competencyGaps: CompetencyGap[];
  strengths: ProfileStrength[];
}

export interface LearningPath {
  pathId: string;
  pathName: string;
  estimatedDuration: number; // en minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: LearningModule[];
  prerequisites: string[];
  outcomes: string[];
}

export interface LearningModule {
  moduleId: string;
  name: string;
  type: 'theory' | 'practice' | 'assessment' | 'case_study';
  duration: number;
  priority: 'high' | 'medium' | 'low';
  adaptations: ModuleAdaptation[];
}

export interface ModuleAdaptation {
  type: 'content_depth' | 'example_complexity' | 'interaction_style' | 'assessment_level';
  value: string;
  reason: string;
}

export interface ProfileRecommendation {
  id: string;
  type: 'skill_development' | 'knowledge_gap' | 'experience_enhancement' | 'certification';
  priority: 'critical' | 'important' | 'beneficial';
  title: string;
  description: string;
  actionItems: string[];
  estimatedImpact: number; // 1-10
}

export interface AdaptationStrategy {
  primaryApproach: 'accelerated' | 'standard' | 'reinforced' | 'customized';
  focusAreas: string[];
  skipRecommendations: string[];
  enhancementAreas: string[];
  interactionPreferences: InteractionPreferences;
}

export interface InteractionPreferences {
  preferredStyle: 'autonomous' | 'guided' | 'collaborative';
  feedbackFrequency: 'immediate' | 'periodic' | 'on_demand';
  challengeLevel: number; // 1-10
  practicalFocus: boolean;
}

export interface CompetencyGap {
  competency: string;
  currentLevel: number; // 1-10
  targetLevel: number; // 1-10
  gap: number;
  priority: 'high' | 'medium' | 'low';
  developmentActions: string[];
}

export interface ProfileStrength {
  area: string;
  level: number; // 1-10
  evidence: string[];
  leverageOpportunities: string[];
}

// 🔍 ANALYSEUR PRINCIPAL

export class ExpertProfileAnalyzer {
  private static instance: ExpertProfileAnalyzer;
  private analysisCache: Map<string, ProfileAnalysisResult> = new Map();

  private constructor() {}

  public static getInstance(): ExpertProfileAnalyzer {
    if (!ExpertProfileAnalyzer.instance) {
      ExpertProfileAnalyzer.instance = new ExpertProfileAnalyzer();
    }
    return ExpertProfileAnalyzer.instance;
  }

  // 🎯 ANALYSE COMPLÈTE DU PROFIL

  public async analyzeProfile(profile: EbiosExpertProfile): Promise<ProfileAnalysisResult> {
    const cacheKey = this.generateCacheKey(profile);
    
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey)!;
    }

    const result = await this.performCompleteAnalysis(profile);
    this.analysisCache.set(cacheKey, result);
    
    return result;
  }

  private generateCacheKey(profile: EbiosExpertProfile): string {
    return `${profile.id}_${profile.experience?.ebiosYears}_${profile.certifications?.join(',')}_${profile.specializations?.join(',')}`;
  }

  private async performCompleteAnalysis(profile: EbiosExpertProfile): Promise<ProfileAnalysisResult> {
    // 1. Analyse du niveau d'expertise
    const expertiseLevel = await this.analyzeExpertiseLevel(profile);
    
    // 2. Définition du parcours d'apprentissage
    const learningPath = await this.defineLearningPath(profile, expertiseLevel);
    
    // 3. Génération des recommandations
    const recommendations = await this.generateRecommendations(profile, expertiseLevel);
    
    // 4. Stratégie d'adaptation
    const adaptationStrategy = await this.defineAdaptationStrategy(profile, expertiseLevel);
    
    // 5. Analyse des lacunes de compétences
    const competencyGaps = await this.analyzeCompetencyGaps(profile);
    
    // 6. Identification des forces
    const strengths = await this.identifyStrengths(profile);

    return {
      expertiseLevel,
      learningPath,
      recommendations,
      adaptationStrategy,
      competencyGaps,
      strengths
    };
  }

  // 📊 ANALYSE DU NIVEAU D'EXPERTISE

  private async analyzeExpertiseLevel(profile: EbiosExpertProfile): Promise<ExpertiseLevel> {
    let score = 0;
    const specializations: string[] = [];
    const weakAreas: string[] = [];
    const strengths: string[] = [];

    // Analyse de l'expérience EBIOS RM (40 points max)
    const ebiosYears = profile.experience?.ebiosYears || 0;
    if (ebiosYears >= 15) {
      score += 40;
      strengths.push('experience_exceptionnelle');
    } else if (ebiosYears >= 10) {
      score += 35;
      strengths.push('experience_senior');
    } else if (ebiosYears >= 5) {
      score += 25;
      strengths.push('experience_confirmee');
    } else if (ebiosYears >= 2) {
      score += 15;
    } else {
      score += 5;
      weakAreas.push('experience_limitee');
    }

    // Analyse des certifications (25 points max)
    const certifications = profile.certifications || [];
    const certificationScore = this.evaluateCertifications(certifications);
    score += certificationScore.score;
    strengths.push(...certificationScore.strengths);
    weakAreas.push(...certificationScore.weakAreas);

    // Analyse des spécialisations (20 points max)
    const profileSpecializations = profile.specializations || [];
    const specializationScore = this.evaluateSpecializations(profileSpecializations);
    score += specializationScore.score;
    specializations.push(...profileSpecializations);
    strengths.push(...specializationScore.strengths);

    // Analyse du secteur (10 points max)
    const sectorScore = this.evaluateSectorExperience(profile.sector);
    score += sectorScore.score;
    if (sectorScore.isHighRisk) {
      strengths.push('secteur_critique');
    }

    // Analyse de l'expérience totale (5 points max)
    const totalYears = profile.experience?.totalYears || 0;
    if (totalYears >= 15) score += 5;
    else if (totalYears >= 10) score += 4;
    else if (totalYears >= 5) score += 3;
    else score += 1;

    // Détermination du niveau
    let level: ExpertiseLevel['level'];
    if (score >= 90) level = 'master';
    else if (score >= 75) level = 'expert';
    else if (score >= 60) level = 'senior';
    else if (score >= 40) level = 'intermediate';
    else level = 'junior';

    return {
      level,
      score,
      confidence: this.calculateConfidence(profile, score),
      specializations,
      weakAreas: weakAreas.filter((area, index, self) => self.indexOf(area) === index),
      strengths: strengths.filter((strength, index, self) => self.indexOf(strength) === index)
    };
  }

  private evaluateCertifications(certifications: string[]): {
    score: number;
    strengths: string[];
    weakAreas: string[];
  } {
    let score = 0;
    const strengths: string[] = [];
    const weakAreas: string[] = [];

    const certificationValues = {
      'CISSP': 8,
      'CISM': 7,
      'ANSSI': 10,
      'ISO27001LA': 6,
      'CISA': 6,
      'CRISC': 5,
      'EBIOS': 8
    };

    for (const cert of certifications) {
      for (const [certName, value] of Object.entries(certificationValues)) {
        if (cert.toUpperCase().includes(certName)) {
          score += value;
          if (value >= 8) {
            strengths.push(`certification_${certName.toLowerCase()}`);
          }
        }
      }
    }

    if (score === 0) {
      weakAreas.push('certifications_manquantes');
    }

    return { score: Math.min(score, 25), strengths, weakAreas };
  }

  private evaluateSpecializations(specializations: string[]): {
    score: number;
    strengths: string[];
  } {
    let score = 0;
    const strengths: string[] = [];

    const specializationValues = {
      'risk_management': 8,
      'threat_intelligence': 6,
      'security_audit': 5,
      'compliance': 4,
      'incident_response': 5,
      'business_continuity': 4
    };

    for (const spec of specializations) {
      if (specializationValues[spec]) {
        score += specializationValues[spec];
        if (specializationValues[spec] >= 6) {
          strengths.push(`specialisation_${spec}`);
        }
      }
    }

    return { score: Math.min(score, 20), strengths };
  }

  private evaluateSectorExperience(sector?: string): {
    score: number;
    isHighRisk: boolean;
  } {
    const highRiskSectors = {
      'santé': 10,
      'finance': 9,
      'énergie': 9,
      'transport': 8,
      'défense': 10,
      'télécoms': 7
    };

    const sectorLower = sector?.toLowerCase() || '';
    for (const [sectorName, value] of Object.entries(highRiskSectors)) {
      if (sectorLower.includes(sectorName)) {
        return { score: value, isHighRisk: true };
      }
    }

    return { score: 3, isHighRisk: false };
  }

  private calculateConfidence(profile: EbiosExpertProfile, score: number): number {
    let confidence = 0.7; // Base confidence

    // Augmente la confiance si on a des données complètes
    if (profile.experience?.ebiosYears) confidence += 0.1;
    if (profile.certifications?.length) confidence += 0.1;
    if (profile.specializations?.length) confidence += 0.05;
    if (profile.sector) confidence += 0.05;

    // Ajuste selon le score
    if (score >= 80) confidence += 0.1;
    else if (score <= 30) confidence -= 0.1;

    return Math.min(confidence, 1.0);
  }

  // 🛤️ DÉFINITION DU PARCOURS D'APPRENTISSAGE

  private async defineLearningPath(
    profile: EbiosExpertProfile,
    expertise: ExpertiseLevel
  ): Promise<LearningPath> {
    
    const pathId = `ebios_workshop1_${expertise.level}_${Date.now()}`;
    
    switch (expertise.level) {
      case 'master':
        return this.createMasterPath(pathId, profile);
      case 'expert':
        return this.createExpertPath(pathId, profile);
      case 'senior':
        return this.createSeniorPath(pathId, profile);
      case 'intermediate':
        return this.createIntermediatePath(pathId, profile);
      default:
        return this.createJuniorPath(pathId, profile);
    }
  }

  private createMasterPath(pathId: string, profile: EbiosExpertProfile): LearningPath {
    return {
      pathId,
      pathName: 'Parcours Maître EBIOS RM - Workshop 1',
      estimatedDuration: 90, // Réduit car expertise élevée
      difficulty: 'expert',
      modules: [
        {
          moduleId: 'w1_advanced_scoping',
          name: 'Cadrage avancé et enjeux stratégiques',
          type: 'case_study',
          duration: 30,
          priority: 'high',
          adaptations: [
            {
              type: 'content_depth',
              value: 'expert_level',
              reason: 'Profil maître nécessite des défis complexes'
            },
            {
              type: 'interaction_style',
              value: 'autonomous',
              reason: 'Autonomie complète pour exploration'
            }
          ]
        },
        {
          moduleId: 'w1_complex_dependencies',
          name: 'Analyse complexe des interdépendances',
          type: 'practice',
          duration: 40,
          priority: 'high',
          adaptations: [
            {
              type: 'example_complexity',
              value: 'multi_sector_cases',
              reason: 'Exemples multi-sectoriels pour expertise'
            }
          ]
        },
        {
          moduleId: 'w1_strategic_validation',
          name: 'Validation stratégique et handover',
          type: 'assessment',
          duration: 20,
          priority: 'medium',
          adaptations: [
            {
              type: 'assessment_level',
              value: 'peer_review',
              reason: 'Évaluation par les pairs pour niveau maître'
            }
          ]
        }
      ],
      prerequisites: [],
      outcomes: [
        'Maîtrise experte du cadrage EBIOS RM',
        'Capacité d\'adaptation multi-sectorielle',
        'Leadership méthodologique'
      ]
    };
  }

  private createExpertPath(pathId: string, profile: EbiosExpertProfile): LearningPath {
    return {
      pathId,
      pathName: 'Parcours Expert EBIOS RM - Workshop 1',
      estimatedDuration: 120,
      difficulty: 'expert',
      modules: [
        {
          moduleId: 'w1_expert_scoping',
          name: 'Cadrage expert et contexte sectoriel',
          type: 'theory',
          duration: 35,
          priority: 'high',
          adaptations: [
            {
              type: 'content_depth',
              value: 'advanced',
              reason: 'Niveau expert nécessite approfondissement'
            }
          ]
        },
        {
          moduleId: 'w1_advanced_assets',
          name: 'Identification avancée des biens',
          type: 'practice',
          duration: 45,
          priority: 'high',
          adaptations: [
            {
              type: 'example_complexity',
              value: 'sector_specific',
              reason: 'Exemples spécialisés selon secteur'
            }
          ]
        },
        {
          moduleId: 'w1_expert_validation',
          name: 'Validation experte et optimisation',
          type: 'assessment',
          duration: 40,
          priority: 'high',
          adaptations: [
            {
              type: 'assessment_level',
              value: 'advanced_scenarios',
              reason: 'Scénarios complexes pour validation'
            }
          ]
        }
      ],
      prerequisites: ['experience_ebios_5ans'],
      outcomes: [
        'Expertise confirmée en cadrage EBIOS RM',
        'Spécialisation sectorielle renforcée',
        'Capacité de mentoring'
      ]
    };
  }

  private createSeniorPath(pathId: string, profile: EbiosExpertProfile): LearningPath {
    return {
      pathId,
      pathName: 'Parcours Senior EBIOS RM - Workshop 1',
      estimatedDuration: 150,
      difficulty: 'advanced',
      modules: [
        {
          moduleId: 'w1_senior_foundation',
          name: 'Fondations méthodologiques avancées',
          type: 'theory',
          duration: 40,
          priority: 'high',
          adaptations: [
            {
              type: 'content_depth',
              value: 'standard_plus',
              reason: 'Approfondissement pour niveau senior'
            }
          ]
        },
        {
          moduleId: 'w1_practical_application',
          name: 'Application pratique guidée',
          type: 'practice',
          duration: 60,
          priority: 'high',
          adaptations: [
            {
              type: 'interaction_style',
              value: 'collaborative',
              reason: 'Collaboration pour renforcement'
            }
          ]
        },
        {
          moduleId: 'w1_senior_assessment',
          name: 'Évaluation et consolidation',
          type: 'assessment',
          duration: 50,
          priority: 'high',
          adaptations: [
            {
              type: 'assessment_level',
              value: 'comprehensive',
              reason: 'Évaluation complète pour validation'
            }
          ]
        }
      ],
      prerequisites: ['experience_ebios_2ans'],
      outcomes: [
        'Maîtrise solide du Workshop 1',
        'Autonomie dans l\'application',
        'Préparation au niveau expert'
      ]
    };
  }

  private createIntermediatePath(pathId: string, profile: EbiosExpertProfile): LearningPath {
    return {
      pathId,
      pathName: 'Parcours Intermédiaire EBIOS RM - Workshop 1',
      estimatedDuration: 180,
      difficulty: 'intermediate',
      modules: [
        {
          moduleId: 'w1_intermediate_intro',
          name: 'Introduction méthodologique renforcée',
          type: 'theory',
          duration: 50,
          priority: 'high',
          adaptations: [
            {
              type: 'content_depth',
              value: 'standard',
              reason: 'Niveau standard avec renforcements'
            }
          ]
        },
        {
          moduleId: 'w1_guided_practice',
          name: 'Pratique guidée étape par étape',
          type: 'practice',
          duration: 80,
          priority: 'high',
          adaptations: [
            {
              type: 'interaction_style',
              value: 'guided',
              reason: 'Guidance nécessaire pour progression'
            }
          ]
        },
        {
          moduleId: 'w1_intermediate_validation',
          name: 'Validation progressive',
          type: 'assessment',
          duration: 50,
          priority: 'high',
          adaptations: [
            {
              type: 'assessment_level',
              value: 'progressive',
              reason: 'Validation par étapes pour confiance'
            }
          ]
        }
      ],
      prerequisites: ['formation_ebios_base'],
      outcomes: [
        'Compréhension solide des concepts',
        'Application guidée réussie',
        'Préparation au niveau senior'
      ]
    };
  }

  private createJuniorPath(pathId: string, profile: EbiosExpertProfile): LearningPath {
    return {
      pathId,
      pathName: 'Parcours Débutant EBIOS RM - Workshop 1',
      estimatedDuration: 240,
      difficulty: 'beginner',
      modules: [
        {
          moduleId: 'w1_foundations',
          name: 'Fondations EBIOS RM complètes',
          type: 'theory',
          duration: 80,
          priority: 'high',
          adaptations: [
            {
              type: 'content_depth',
              value: 'detailed',
              reason: 'Explications détaillées nécessaires'
            }
          ]
        },
        {
          moduleId: 'w1_step_by_step',
          name: 'Application étape par étape',
          type: 'practice',
          duration: 100,
          priority: 'high',
          adaptations: [
            {
              type: 'interaction_style',
              value: 'guided',
              reason: 'Guidance complète requise'
            }
          ]
        },
        {
          moduleId: 'w1_basic_validation',
          name: 'Validation de base',
          type: 'assessment',
          duration: 60,
          priority: 'high',
          adaptations: [
            {
              type: 'assessment_level',
              value: 'basic_understanding',
              reason: 'Validation de la compréhension de base'
            }
          ]
        }
      ],
      prerequisites: ['aucun'],
      outcomes: [
        'Compréhension des concepts de base',
        'Première application réussie',
        'Fondations pour progression'
      ]
    };
  }
}

export default ExpertProfileAnalyzer;

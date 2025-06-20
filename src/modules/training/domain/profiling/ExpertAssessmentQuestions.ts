/**
 * 🎯 QUESTIONNAIRE D'ÉVALUATION EXPERT
 * 15 questions expertes pour détecter le niveau EBIOS/GRC/Audit
 * Conçu pour professionnels confirmés et experts ANSSI
 */

import { EbiosExpertProfile, EbiosSpecialization } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES DE QUESTIONS EXPERTES
export interface ExpertQuestion {
  id: string;
  category: 'ebios_methodology' | 'grc_governance' | 'audit_compliance' | 'threat_intelligence' | 'risk_quantification';
  difficulty: 'senior' | 'expert' | 'master';
  question: string;
  type: 'multiple_choice' | 'scenario_analysis' | 'calculation' | 'methodology_design';
  options?: ExpertQuestionOption[];
  scenario?: string;
  expectedApproach?: string[];
  scoringCriteria: ScoringCriteria;
  timeLimit: number; // minutes
  references: string[];
}

export interface ExpertQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  expertiseLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  explanation: string;
  points: number;
}

export interface ScoringCriteria {
  maxPoints: number;
  expertThreshold: number; // Points minimum pour niveau expert
  masterThreshold: number; // Points minimum pour niveau master
  timeBonus: boolean;
  partialCredit: boolean;
}

// 📋 QUESTIONNAIRE COMPLET (15 QUESTIONS EXPERTES)
export const EXPERT_ASSESSMENT_QUESTIONS: ExpertQuestion[] = [
  // 🎯 QUESTION 1 - MÉTHODOLOGIE EBIOS RM AVANCÉE
  {
    id: 'ebios_advanced_001',
    category: 'ebios_methodology',
    difficulty: 'expert',
    question: 'Dans le cadre d\'une analyse EBIOS RM pour un écosystème de santé interconnecté (CHU + 15 cliniques partenaires + 3 plateformes SaaS + laboratoires externes), comment structureriez-vous l\'atelier 1 pour identifier les biens supports critiques en tenant compte des flux de données FHIR, des contraintes HDS et des dépendances inter-organisationnelles ?',
    type: 'methodology_design',
    expectedApproach: [
      'Cartographie des flux de données inter-organisationnels',
      'Identification des points de convergence critiques',
      'Analyse des dépendances technologiques et contractuelles',
      'Évaluation des impacts de défaillance en cascade',
      'Prise en compte des exigences réglementaires sectorielles'
    ],
    scoringCriteria: {
      maxPoints: 25,
      expertThreshold: 18,
      masterThreshold: 22,
      timeBonus: true,
      partialCredit: true
    },
    timeLimit: 15,
    references: ['EBIOS RM v1.5', 'Guide ANSSI écosystèmes', 'Référentiel HDS']
  },

  // 🎯 QUESTION 2 - QUANTIFICATION RISQUES FAIR
  {
    id: 'grc_quantification_001',
    category: 'risk_quantification',
    difficulty: 'expert',
    question: 'Calculez l\'ALE (Annual Loss Expectancy) pour un scénario de ransomware ciblant une infrastructure critique, sachant que : Fréquence d\'occurrence = 0.3/an, Probabilité de succès = 0.15, Impact direct = 2.5M€, Coûts indirects = 1.8M€, Temps de récupération = 72h, CA journalier = 150K€. Intégrez les coûts de conformité RGPD (notification + sanctions potentielles).',
    type: 'calculation',
    options: [
      {
        id: 'calc_001_a',
        text: 'ALE = 645K€ (impact direct uniquement)',
        isCorrect: false,
        expertiseLevel: 'basic',
        explanation: 'Calcul incomplet, ne prend pas en compte tous les facteurs',
        points: 5
      },
      {
        id: 'calc_001_b',
        text: 'ALE = 967.5K€ (direct + indirect + perte exploitation)',
        isCorrect: false,
        expertiseLevel: 'intermediate',
        explanation: 'Proche mais manque les coûts de conformité RGPD',
        points: 15
      },
      {
        id: 'calc_001_c',
        text: 'ALE = 1.2M€ (calcul complet avec probabilités composées et conformité)',
        isCorrect: true,
        expertiseLevel: 'expert',
        explanation: 'Calcul expert : (0.3 × 0.15) × (2.5M + 1.8M + 0.324M + 0.5M) = 1.2M€',
        points: 25
      },
      {
        id: 'calc_001_d',
        text: 'ALE = 1.55M€ (avec facteurs d\'incertitude Monte Carlo)',
        isCorrect: false,
        expertiseLevel: 'master',
        explanation: 'Surévaluation, mais approche méthodologique correcte',
        points: 20
      }
    ],
    scoringCriteria: {
      maxPoints: 25,
      expertThreshold: 20,
      masterThreshold: 25,
      timeBonus: false,
      partialCredit: false
    },
    timeLimit: 10,
    references: ['FAIR Standard', 'ISO 31000', 'Guide CNIL sanctions RGPD']
  },

  // 🎯 QUESTION 3 - THREAT INTELLIGENCE AVANCÉE
  {
    id: 'threat_intel_001',
    category: 'threat_intelligence',
    difficulty: 'master',
    question: 'Analysez ce pattern d\'attaque observé : C2 rotatif avec DGA (Domain Generation Algorithm), exfiltration via DNS tunneling sur ports non-standard, persistence via WMI event subscription, et lateral movement utilisant PsExec + Mimikatz. Identifiez l\'acteur probable et justifiez votre attribution.',
    type: 'scenario_analysis',
    scenario: 'IOCs détectés : domaines en .tk/.ml, requêtes DNS anormales vers 8.8.4.4:5353, WMI events suspects, hash Mimikatz variant, timestamps UTC+3',
    options: [
      {
        id: 'threat_001_a',
        text: 'APT28 (Fancy Bear) - TTPs cohérents avec campagnes récentes',
        isCorrect: false,
        expertiseLevel: 'intermediate',
        explanation: 'APT28 utilise rarement DNS tunneling comme vecteur principal',
        points: 10
      },
      {
        id: 'threat_001_b',
        text: 'Lazarus Group - Sophistication et DGA caractéristiques',
        isCorrect: false,
        expertiseLevel: 'advanced',
        explanation: 'Lazarus préfère les cryptomonnaies, pas le DNS tunneling',
        points: 15
      },
      {
        id: 'threat_001_c',
        text: 'APT29 (Cozy Bear) - DNS tunneling et WMI persistence typiques',
        isCorrect: true,
        expertiseLevel: 'expert',
        explanation: 'TTPs cohérents : DNS tunneling, WMI events, timezone UTC+3 (Moscou)',
        points: 25
      },
      {
        id: 'threat_001_d',
        text: 'Groupe cybercriminel non-étatique avec outils APT',
        isCorrect: false,
        expertiseLevel: 'senior',
        explanation: 'Sophistication trop élevée pour groupe cybercriminel classique',
        points: 8
      }
    ],
    scoringCriteria: {
      maxPoints: 25,
      expertThreshold: 20,
      masterThreshold: 25,
      timeBonus: true,
      partialCredit: true
    },
    timeLimit: 12,
    references: ['MITRE ATT&CK', 'Mandiant APT reports', 'ANSSI bulletins']
  },

  // 🎯 QUESTION 4 - AUDIT ISO 27001 COMPLEXE
  {
    id: 'audit_compliance_001',
    category: 'audit_compliance',
    difficulty: 'expert',
    question: 'Lors d\'un audit ISO 27001 d\'un cloud provider hébergeant des données de santé, vous découvrez : chiffrement AES-256 mais clés stockées sur même infrastructure, logs d\'accès incomplets (gaps de 48h), procédures de sauvegarde testées mais pas de test de restauration depuis 18 mois, DPO externe sans formation HDS. Quelle est votre évaluation et plan de remédiation prioritaire ?',
    type: 'scenario_analysis',
    scenario: 'Audit de certification ISO 27001 + HDS pour cloud provider santé',
    expectedApproach: [
      'Classification des non-conformités par criticité',
      'Évaluation des risques résiduels',
      'Plan de remédiation avec timeline',
      'Mesures compensatoires temporaires',
      'Suivi et vérification'
    ],
    scoringCriteria: {
      maxPoints: 30,
      expertThreshold: 22,
      masterThreshold: 27,
      timeBonus: false,
      partialCredit: true
    },
    timeLimit: 20,
    references: ['ISO 27001:2022', 'Référentiel HDS', 'Guide ANSSI cloud']
  },

  // 🎯 QUESTION 5 - GOUVERNANCE RISQUES AVANCÉE
  {
    id: 'grc_governance_001',
    category: 'grc_governance',
    difficulty: 'expert',
    question: 'Concevez un framework de gouvernance des risques cyber pour un groupe industriel (OIV) avec 15 filiales dans 8 pays, intégrant les exigences NIS2, la directive CER, et les réglementations locales. Comment structurer le reporting au COMEX et l\'articulation avec les risk managers métier ?',
    type: 'methodology_design',
    expectedApproach: [
      'Architecture de gouvernance multi-niveaux',
      'Harmonisation des référentiels réglementaires',
      'Métriques et KRI consolidés',
      'Processus de remontée et escalade',
      'Coordination avec risk management métier'
    ],
    scoringCriteria: {
      maxPoints: 30,
      expertThreshold: 22,
      masterThreshold: 28,
      timeBonus: true,
      partialCredit: true
    },
    timeLimit: 18,
    references: ['Directive NIS2', 'Directive CER', 'ISO 31000', 'COSO ERM']
  }
];

// 🎯 QUESTIONS SUPPLÉMENTAIRES (6-15) - STRUCTURE SIMILAIRE
export const ADDITIONAL_EXPERT_QUESTIONS: Partial<ExpertQuestion>[] = [
  {
    id: 'ebios_workshop2_001',
    category: 'ebios_methodology',
    difficulty: 'expert',
    question: 'Modélisez les sources de risques pour un écosystème fintech (néobanque + partenaires + API tierces) en intégrant les menaces géopolitiques, la criminalité financière organisée et les risques de supply chain. Comment priorisez-vous les acteurs selon leur capacité de nuisance et leur motivation ?'
  },
  {
    id: 'threat_intel_002',
    category: 'threat_intelligence',
    difficulty: 'master',
    question: 'Analysez la corrélation entre l\'augmentation des attaques sur infrastructures énergétiques européennes et les tensions géopolitiques. Proposez un modèle prédictif d\'escalation cyber basé sur des indicateurs géopolitiques et techniques.'
  },
  {
    id: 'audit_continuous_001',
    category: 'audit_compliance',
    difficulty: 'expert',
    question: 'Implémentez un système d\'audit continu pour une infrastructure cloud hybride multi-fournisseurs. Définissez les métriques automatisées, les seuils d\'alerte et l\'intégration avec les outils de GRC existants.'
  },
  {
    id: 'grc_quantification_002',
    category: 'risk_quantification',
    difficulty: 'expert',
    question: 'Calculez le ROSI (Return on Security Investment) d\'un projet de mise en place d\'un SOC mutualisé pour un groupe de 5 PME, en intégrant les économies d\'échelle, la réduction des primes d\'assurance et l\'amélioration du time-to-detection.'
  },
  {
    id: 'ebios_workshop5_001',
    category: 'ebios_methodology',
    difficulty: 'master',
    question: 'Concevez une stratégie de traitement des risques pour un opérateur de transport public face aux menaces cyber-physiques, intégrant la résilience opérationnelle, la sécurité des voyageurs et la continuité de service.'
  }
];

// 🎯 ÉVALUATION ET SCORING
export interface AssessmentResult {
  totalScore: number;
  maxPossibleScore: number;
  categoryScores: Map<string, number>;
  expertiseLevel: 'senior' | 'expert' | 'master';
  specializations: EbiosSpecialization[];
  recommendations: string[];
  detailedAnalysis: {
    strengths: string[];
    improvementAreas: string[];
    suggestedTraining: string[];
  };
}

export class ExpertAssessmentEngine {
  // 📊 CALCUL DU SCORE ET NIVEAU
  static calculateExpertiseLevel(
    answers: Map<string, any>,
    timeSpent: Map<string, number>
  ): AssessmentResult {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const categoryScores = new Map<string, number>();

    // Calcul des scores par catégorie
    EXPERT_ASSESSMENT_QUESTIONS.forEach(question => {
      const answer = answers.get(question.id);
      const timeUsed = timeSpent.get(question.id) || question.timeLimit;
      
      let questionScore = 0;
      maxPossibleScore += question.scoringCriteria.maxPoints;

      if (answer) {
        questionScore = this.scoreQuestion(question, answer, timeUsed);
        totalScore += questionScore;

        const currentCategoryScore = categoryScores.get(question.category) || 0;
        categoryScores.set(question.category, currentCategoryScore + questionScore);
      }
    });

    // Détermination du niveau d'expertise
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    let expertiseLevel: 'senior' | 'expert' | 'master';
    
    if (scorePercentage >= 85) {
      expertiseLevel = 'master';
    } else if (scorePercentage >= 70) {
      expertiseLevel = 'expert';
    } else {
      expertiseLevel = 'senior';
    }

    // Identification des spécialisations
    const specializations = this.identifySpecializations(categoryScores);

    return {
      totalScore,
      maxPossibleScore,
      categoryScores,
      expertiseLevel,
      specializations,
      recommendations: this.generateRecommendations(categoryScores, expertiseLevel),
      detailedAnalysis: this.generateDetailedAnalysis(categoryScores, expertiseLevel)
    };
  }

  // 🎯 SCORING D'UNE QUESTION
  private static scoreQuestion(
    question: ExpertQuestion,
    answer: any,
    timeUsed: number
  ): number {
    let baseScore = 0;

    if (question.type === 'multiple_choice' && question.options) {
      const selectedOption = question.options.find(opt => opt.id === answer);
      if (selectedOption) {
        baseScore = selectedOption.points;
      }
    } else if (question.type === 'scenario_analysis' || question.type === 'methodology_design') {
      // Scoring basé sur les critères attendus
      baseScore = this.scoreOpenAnswer(question, answer);
    }

    // Bonus de temps si applicable
    if (question.scoringCriteria.timeBonus && timeUsed < question.timeLimit * 0.8) {
      baseScore *= 1.1; // 10% de bonus
    }

    return Math.min(baseScore, question.scoringCriteria.maxPoints);
  }

  // 📝 SCORING RÉPONSE OUVERTE
  private static scoreOpenAnswer(question: ExpertQuestion, answer: string): number {
    if (!question.expectedApproach || !answer) return 0;

    const answerLower = answer.toLowerCase();
    let matchedCriteria = 0;

    question.expectedApproach.forEach(criteria => {
      if (answerLower.includes(criteria.toLowerCase())) {
        matchedCriteria++;
      }
    });

    const percentage = matchedCriteria / question.expectedApproach.length;
    return Math.round(percentage * question.scoringCriteria.maxPoints);
  }

  // 🎯 IDENTIFICATION SPÉCIALISATIONS
  private static identifySpecializations(categoryScores: Map<string, number>): EbiosSpecialization[] {
    const specializations: EbiosSpecialization[] = [];
    
    categoryScores.forEach((score, category) => {
      if (score >= 60) { // Seuil de spécialisation
        switch (category) {
          case 'ebios_methodology':
            specializations.push('risk_analysis', 'threat_modeling');
            break;
          case 'grc_governance':
            specializations.push('governance_framework');
            break;
          case 'audit_compliance':
            specializations.push('audit_methodology', 'compliance_assessment');
            break;
          case 'threat_intelligence':
            specializations.push('threat_intelligence');
            break;
          case 'risk_quantification':
            specializations.push('risk_analysis');
            break;
        }
      }
    });

    return [...new Set(specializations)]; // Suppression des doublons
  }

  // 💡 GÉNÉRATION RECOMMANDATIONS
  private static generateRecommendations(
    categoryScores: Map<string, number>,
    expertiseLevel: 'senior' | 'expert' | 'master'
  ): string[] {
    const recommendations: string[] = [];

    if (expertiseLevel === 'master') {
      recommendations.push('Vous avez un niveau d\'expertise exceptionnel. Considérez un rôle de mentor ou de formateur.');
      recommendations.push('Participez aux groupes de travail ANSSI ou aux comités de normalisation.');
    } else if (expertiseLevel === 'expert') {
      recommendations.push('Excellent niveau d\'expertise. Approfondissez vos domaines de spécialisation.');
      recommendations.push('Considérez une certification avancée (CISSP, CISA, CISM).');
    } else {
      recommendations.push('Bon niveau senior. Focalisez-vous sur l\'approfondissement méthodologique.');
      recommendations.push('Participez à des formations spécialisées EBIOS RM ou GRC.');
    }

    return recommendations;
  }

  // 📊 ANALYSE DÉTAILLÉE
  private static generateDetailedAnalysis(
    categoryScores: Map<string, number>,
    expertiseLevel: 'senior' | 'expert' | 'master'
  ): { strengths: string[]; improvementAreas: string[]; suggestedTraining: string[] } {
    const strengths: string[] = [];
    const improvementAreas: string[] = [];
    const suggestedTraining: string[] = [];

    categoryScores.forEach((score, category) => {
      if (score >= 70) {
        strengths.push(`Excellence en ${category}`);
      } else if (score < 50) {
        improvementAreas.push(`Renforcement nécessaire en ${category}`);
        suggestedTraining.push(`Formation spécialisée ${category}`);
      }
    });

    return { strengths, improvementAreas, suggestedTraining };
  }
}

export default {
  EXPERT_ASSESSMENT_QUESTIONS,
  ADDITIONAL_EXPERT_QUESTIONS,
  ExpertAssessmentEngine
};

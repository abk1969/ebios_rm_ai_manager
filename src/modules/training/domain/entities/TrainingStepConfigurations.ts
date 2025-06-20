/**
 * 📚 CONFIGURATIONS DES ÉTAPES DE FORMATION
 * Définition complète de chaque étape du parcours linéaire EBIOS RM
 * Conforme aux exigences ANSSI
 */

import { 
  TrainingStep, 
  StepConfiguration, 
  ContentSection, 
  Exercise, 
  Assessment, 
  Question,
  ValidationCriterion,
  UnlockCondition,
  ScoringCriterion
} from './LinearTrainingPath';

// 🎯 CONFIGURATION ÉTAPE 1 : ONBOARDING
export const ONBOARDING_CONFIG: StepConfiguration = {
  id: TrainingStep.ONBOARDING,
  name: "Accueil & Onboarding",
  description: "Introduction à EBIOS RM et orientation de l'apprenant",
  estimatedDuration: 5,
  minimumScore: 80,
  prerequisites: [],
  unlockConditions: [],
  content: {
    title: "Bienvenue dans la formation EBIOS RM",
    subtitle: "Votre parcours vers l'expertise en gestion des risques cyber",
    sections: [
      {
        id: "welcome",
        title: "Présentation personnalisée",
        type: "interactive",
        content: {
          type: "welcome_screen",
          personalization: true,
          duration: 2
        },
        duration: 2,
        mandatory: true,
        order: 1
      },
      {
        id: "ebios_intro",
        title: "Qu'est-ce qu'EBIOS RM ?",
        type: "video",
        content: {
          videoId: "ebios_intro_2min",
          transcript: true,
          subtitles: ["fr", "en"]
        },
        duration: 2,
        mandatory: true,
        order: 2
      },
      {
        id: "objectives",
        title: "Vos objectifs de formation",
        type: "interactive",
        content: {
          objectives: [
            "Maîtriser la méthodologie EBIOS RM v1.5",
            "Réaliser une analyse complète des risques",
            "Produire les 7 livrables ANSSI obligatoires",
            "Obtenir votre certification EBIOS RM"
          ],
          interactive: true
        },
        duration: 1,
        mandatory: true,
        order: 3
      }
    ],
    resources: [
      {
        id: "ebios_guide",
        title: "Guide ANSSI EBIOS RM v1.5",
        type: "document",
        url: "/resources/ebios-rm-guide-anssi.pdf",
        downloadable: true,
        category: "reference"
      }
    ],
    exercises: [],
    assessments: [
      {
        id: "level_test",
        title: "Test de niveau initial",
        type: "quiz",
        timeLimit: 5,
        passingScore: 60,
        maxAttempts: 1,
        randomizeQuestions: false,
        questions: [
          {
            id: "q1",
            text: "EBIOS RM signifie :",
            type: "single_choice",
            options: [
              "Expression des Besoins et Identification des Objectifs de Sécurité - Risk Manager",
              "Évaluation des Biens et Identification des Objectifs de Sécurité - Risk Management",
              "Expression des Besoins et Identification des Objectifs de Sécurité - Risk Management"
            ],
            correctAnswer: "Expression des Besoins et Identification des Objectifs de Sécurité - Risk Manager",
            explanation: "EBIOS RM est la méthode française de gestion des risques cyber développée par l'ANSSI.",
            points: 2,
            difficulty: "easy",
            category: "concepts"
          }
          // 4 autres questions seront ajoutées
        ]
      }
    ]
  },
  validation: {
    type: "automatic",
    criteria: [
      {
        id: "completion",
        name: "Complétion des sections",
        description: "Toutes les sections obligatoires doivent être complétées",
        type: "completion",
        threshold: 100,
        mandatory: true,
        anssiRequired: false
      },
      {
        id: "level_test_score",
        name: "Score test de niveau",
        description: "Score minimum au test de niveau initial",
        type: "score",
        threshold: 60,
        mandatory: true,
        anssiRequired: false
      }
    ],
    minimumScore: 80,
    requiredDeliverables: [],
    anssiCompliance: false
  }
};

// 🎯 CONFIGURATION ÉTAPE 2 : DISCOVERY
export const DISCOVERY_CONFIG: StepConfiguration = {
  id: TrainingStep.DISCOVERY,
  name: "Module Découverte",
  description: "Maîtrise des concepts fondamentaux EBIOS RM",
  estimatedDuration: 15,
  minimumScore: 75,
  prerequisites: [TrainingStep.ONBOARDING],
  unlockConditions: [
    {
      type: "step_completed",
      targetStep: TrainingStep.ONBOARDING,
      minimumScore: 80
    }
  ],
  content: {
    title: "Fondamentaux EBIOS RM",
    subtitle: "Méthodologie ANSSI et cas d'usage CHU",
    sections: [
      {
        id: "methodology",
        title: "Méthodologie ANSSI détaillée",
        type: "interactive",
        content: {
          type: "methodology_explorer",
          workshops: [1, 2, 3, 4, 5],
          interactive_diagram: true
        },
        duration: 5,
        mandatory: true,
        order: 1
      },
      {
        id: "chu_context",
        title: "Contexte CHU Métropolitain",
        type: "interactive",
        content: {
          type: "case_study_intro",
          organization: "CHU Métropolitain",
          sector: "healthcare",
          real_data: true
        },
        duration: 5,
        mandatory: true,
        order: 2
      },
      {
        id: "vocabulary",
        title: "Vocabulaire EBIOS RM",
        type: "interactive",
        content: {
          type: "glossary_interactive",
          terms: 25,
          examples: true,
          quiz_mode: true
        },
        duration: 3,
        mandatory: true,
        order: 3
      }
    ],
    resources: [
      {
        id: "chu_profile",
        title: "Profil complet CHU Métropolitain",
        type: "document",
        content: "Données détaillées de l'organisation étudiée",
        downloadable: true,
        category: "case_study"
      }
    ],
    exercises: [
      {
        id: "workshop_mapping",
        title: "Cartographie des ateliers",
        description: "Associer chaque livrable à son atelier",
        type: "guided",
        difficulty: "easy",
        estimatedTime: 5,
        instructions: [
          "Glissez chaque livrable vers l'atelier correspondant",
          "Vérifiez la logique méthodologique",
          "Validez votre compréhension"
        ],
        expectedDeliverables: ["mapping_complete"],
        scoringCriteria: [
          {
            id: "accuracy",
            name: "Précision du mapping",
            description: "Pourcentage de bonnes associations",
            maxPoints: 10,
            weight: 1.0,
            anssiRequired: true
          }
        ]
      }
    ],
    assessments: [
      {
        id: "discovery_quiz",
        title: "Quiz de validation découverte",
        type: "quiz",
        timeLimit: 10,
        passingScore: 75,
        maxAttempts: 2,
        randomizeQuestions: true,
        questions: [
          {
            id: "q1",
            text: "Combien d'ateliers compose la méthodologie EBIOS RM ?",
            type: "single_choice",
            options: ["3", "4", "5", "6"],
            correctAnswer: "5",
            explanation: "EBIOS RM comprend exactement 5 ateliers selon la méthodologie ANSSI.",
            points: 2,
            difficulty: "easy",
            category: "methodology"
          }
          // 9 autres questions seront ajoutées
        ]
      }
    ]
  },
  validation: {
    type: "automatic",
    criteria: [
      {
        id: "quiz_score",
        name: "Score quiz découverte",
        description: "Score minimum au quiz de validation",
        type: "score",
        threshold: 75,
        mandatory: true,
        anssiRequired: true
      },
      {
        id: "exercise_completion",
        name: "Exercices complétés",
        description: "Tous les exercices doivent être réalisés",
        type: "completion",
        threshold: 100,
        mandatory: true,
        anssiRequired: true
      }
    ],
    minimumScore: 75,
    requiredDeliverables: ["mapping_complete"],
    anssiCompliance: true
  }
};

// 🎯 CONFIGURATION ÉTAPE 3 : WORKSHOPS (sera étendue)
export const WORKSHOPS_CONFIG: StepConfiguration = {
  id: TrainingStep.WORKSHOPS,
  name: "Ateliers EBIOS RM",
  description: "Maîtrise pratique des 5 ateliers EBIOS RM",
  estimatedDuration: 120,
  minimumScore: 70,
  prerequisites: [TrainingStep.DISCOVERY],
  unlockConditions: [
    {
      type: "step_completed",
      targetStep: TrainingStep.DISCOVERY,
      minimumScore: 75
    }
  ],
  content: {
    title: "Les 5 Ateliers EBIOS RM",
    subtitle: "Formation pratique complète avec cas réel CHU",
    sections: [], // Sera rempli avec les 5 ateliers
    resources: [],
    exercises: [],
    assessments: []
  },
  validation: {
    type: "hybrid",
    criteria: [
      {
        id: "all_workshops_completed",
        name: "Tous les ateliers validés",
        description: "Les 5 ateliers doivent être complétés avec succès",
        type: "completion",
        threshold: 100,
        mandatory: true,
        anssiRequired: true
      },
      {
        id: "minimum_workshop_scores",
        name: "Scores minimums par atelier",
        description: "Score minimum 70% par atelier",
        type: "score",
        threshold: 70,
        mandatory: true,
        anssiRequired: true
      }
    ],
    minimumScore: 70,
    requiredDeliverables: [
      "business_values",
      "supporting_assets", 
      "dreaded_events",
      "risk_sources",
      "strategic_scenarios",
      "operational_scenarios",
      "treatment_measures"
    ],
    anssiCompliance: true
  }
};

// 🎯 FACTORY POUR CRÉER LES CONFIGURATIONS
export class TrainingStepConfigurationFactory {
  private static configurations: Map<TrainingStep, StepConfiguration> = new Map([
    [TrainingStep.ONBOARDING, ONBOARDING_CONFIG],
    [TrainingStep.DISCOVERY, DISCOVERY_CONFIG],
    [TrainingStep.WORKSHOPS, WORKSHOPS_CONFIG]
    // CERTIFICATION et RESOURCES seront ajoutées
  ]);

  static getConfiguration(step: TrainingStep): StepConfiguration | null {
    return this.configurations.get(step) || null;
  }

  static getAllConfigurations(): StepConfiguration[] {
    return Array.from(this.configurations.values());
  }

  static getEstimatedTotalDuration(): number {
    return Array.from(this.configurations.values())
      .reduce((total, config) => total + config.estimatedDuration, 0);
  }

  static validateConfigurationIntegrity(): boolean {
    // Vérification de la cohérence des configurations
    const configs = this.getAllConfigurations();
    
    for (const config of configs) {
      // Vérifier que les prérequis existent
      for (const prereq of config.prerequisites) {
        if (!this.configurations.has(prereq)) {
          console.error(`Prérequis manquant: ${prereq} pour ${config.name}`);
          return false;
        }
      }
    }
    
    return true;
  }
}

// 🎯 EXPORT DES CONFIGURATIONS
export const TRAINING_STEP_CONFIGURATIONS = {
  ONBOARDING: ONBOARDING_CONFIG,
  DISCOVERY: DISCOVERY_CONFIG,
  WORKSHOPS: WORKSHOPS_CONFIG,
  factory: TrainingStepConfigurationFactory
};

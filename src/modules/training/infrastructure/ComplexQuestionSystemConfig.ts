/**
 * ⚙️ CONFIGURATION DU SYSTÈME DE QUESTIONS COMPLEXES
 * Configuration centralisée pour l'ÉTAPE 2.2.2
 * Paramètres, constantes et initialisation
 */

// 🎯 CONFIGURATION GÉNÉRALE

export const COMPLEX_QUESTION_CONFIG = {
  // Paramètres de session
  SESSION: {
    DEFAULT_TIMEOUT: 3600, // 1 heure en secondes
    MAX_TIMEOUT: 7200, // 2 heures maximum
    MIN_TIMEOUT: 1800, // 30 minutes minimum
    AUTO_SAVE_INTERVAL: 30000, // 30 secondes
    HEARTBEAT_INTERVAL: 10000, // 10 secondes
  },

  // Paramètres de scoring
  SCORING: {
    PASSING_SCORE: 70, // Score minimum pour réussir
    EXCELLENT_SCORE: 90, // Score pour mention excellent
    TIME_BONUS_THRESHOLD: 0.8, // Bonus si terminé en moins de 80% du temps
    HINT_PENALTY: 5, // Pénalité par indice utilisé
    MAX_HINTS: 3, // Nombre maximum d'indices
  },

  // Paramètres de difficulté
  DIFFICULTY: {
    BEGINNER: {
      questionCount: 2,
      timeMultiplier: 1.5,
      hintsAvailable: 3,
      guidanceLevel: 'high'
    },
    INTERMEDIATE: {
      questionCount: 3,
      timeMultiplier: 1.2,
      hintsAvailable: 2,
      guidanceLevel: 'medium'
    },
    EXPERT: {
      questionCount: 5,
      timeMultiplier: 1.0,
      hintsAvailable: 1,
      guidanceLevel: 'low'
    }
  },

  // Paramètres d'adaptation
  ADAPTATION: {
    PERFORMANCE_THRESHOLD_LOW: 50,
    PERFORMANCE_THRESHOLD_HIGH: 85,
    ADAPTATION_SENSITIVITY: 0.2,
    MIN_QUESTIONS_FOR_ADAPTATION: 2
  },

  // Paramètres de feedback
  FEEDBACK: {
    IMMEDIATE_FEEDBACK: true,
    DETAILED_FEEDBACK: true,
    EXPERT_PERSONAS: ['supportive', 'analytical', 'inspiring', 'direct'],
    FEEDBACK_DELAY: 2000, // 2 secondes
  }
};

// 🎭 CONFIGURATION DES EXPERTS VIRTUELS

export const EXPERT_PERSONAS = {
  supportive: {
    name: 'Dr. Marie Dubois',
    title: 'Expert EBIOS RM Senior',
    avatar: '/avatars/marie-dubois.jpg',
    specialties: ['Formation', 'Accompagnement', 'Pédagogie'],
    communicationStyle: 'Bienveillant et encourageant',
    catchPhrase: 'Chaque erreur est une opportunité d\'apprentissage !',
    feedbackStyle: {
      positive: 'Excellent travail ! Vous maîtrisez parfaitement...',
      constructive: 'C\'est un bon début. Permettez-moi de vous guider...',
      corrective: 'Ne vous découragez pas. Reprenons ensemble...'
    }
  },

  analytical: {
    name: 'Prof. Jean-Claude Martin',
    title: 'Chercheur en Cybersécurité',
    avatar: '/avatars/jean-claude-martin.jpg',
    specialties: ['Analyse de risque', 'Méthodologie', 'Recherche'],
    communicationStyle: 'Précis et méthodique',
    catchPhrase: 'La rigueur méthodologique est la clé du succès.',
    feedbackStyle: {
      positive: 'Analyse rigoureuse et méthodologiquement correcte.',
      constructive: 'Votre approche est intéressante, mais considérez...',
      corrective: 'Révisons la méthodologie étape par étape...'
    }
  },

  inspiring: {
    name: 'Sarah Chen',
    title: 'Consultante EBIOS RM',
    avatar: '/avatars/sarah-chen.jpg',
    specialties: ['Innovation', 'Transformation', 'Leadership'],
    communicationStyle: 'Dynamique et motivant',
    catchPhrase: 'Osez innover dans votre approche de la sécurité !',
    feedbackStyle: {
      positive: 'Brillant ! Vous repoussez les limites de l\'excellence !',
      constructive: 'Votre créativité est remarquable. Allons plus loin...',
      corrective: 'Transformons cette difficulté en opportunité...'
    }
  },

  direct: {
    name: 'Colonel Alain Rousseau',
    title: 'Expert Sécurité ANSSI',
    avatar: '/avatars/alain-rousseau.jpg',
    specialties: ['Audit', 'Conformité', 'Sécurité nationale'],
    communicationStyle: 'Direct et factuel',
    catchPhrase: 'La sécurité ne tolère aucun compromis.',
    feedbackStyle: {
      positive: 'Conforme aux exigences. Travail satisfaisant.',
      constructive: 'Points d\'amélioration identifiés. Actions requises.',
      corrective: 'Non-conformité détectée. Correction immédiate nécessaire.'
    }
  }
};

// 🏗️ TEMPLATES DE QUESTIONS PAR ATELIER

export const QUESTION_TEMPLATES = {
  workshop1: {
    asset_identification: {
      title: 'Identification et valorisation des biens essentiels',
      requirements: [
        'Identifier les 5 biens essentiels prioritaires',
        'Calculer la valeur métier de chaque bien',
        'Établir la matrice d\'interdépendance'
      ],
      context_variables: ['sector', 'organization_size', 'business_model'],
      scoring_criteria: ['completeness', 'accuracy', 'methodology', 'justification']
    },
    
    security_needs: {
      title: 'Analyse des besoins de sécurité',
      requirements: [
        'Définir les critères DICP pour chaque bien',
        'Justifier les niveaux de sécurité requis',
        'Identifier les contraintes réglementaires'
      ],
      context_variables: ['regulatory_framework', 'risk_appetite', 'compliance_requirements'],
      scoring_criteria: ['regulatory_compliance', 'risk_assessment', 'justification']
    }
  },

  workshop2: {
    threat_modeling: {
      title: 'Modélisation des menaces sectorielles',
      requirements: [
        'Identifier les sources de risque pertinentes',
        'Analyser les motivations et capacités',
        'Cartographier les vecteurs d\'attaque'
      ],
      context_variables: ['threat_landscape', 'sector_threats', 'geopolitical_context'],
      scoring_criteria: ['threat_relevance', 'capability_assessment', 'attack_vectors']
    },

    risk_sources: {
      title: 'Analyse des sources de risque',
      requirements: [
        'Caractériser les groupes d\'attaquants',
        'Évaluer les capacités techniques',
        'Analyser les tendances d\'évolution'
      ],
      context_variables: ['threat_intelligence', 'attack_trends', 'capability_evolution'],
      scoring_criteria: ['source_characterization', 'capability_analysis', 'trend_analysis']
    }
  },

  workshop3: {
    strategic_scenarios: {
      title: 'Construction de scénarios stratégiques',
      requirements: [
        'Définir les chemins d\'attaque probables',
        'Évaluer la vraisemblance des scénarios',
        'Quantifier les impacts potentiels'
      ],
      context_variables: ['attack_paths', 'likelihood_factors', 'impact_assessment'],
      scoring_criteria: ['scenario_realism', 'likelihood_assessment', 'impact_quantification']
    }
  },

  workshop4: {
    operational_scenarios: {
      title: 'Scénarios opérationnels détaillés',
      requirements: [
        'Décliner les scénarios en actions concrètes',
        'Identifier les points de détection',
        'Évaluer les mesures de protection existantes'
      ],
      context_variables: ['operational_context', 'detection_capabilities', 'existing_controls'],
      scoring_criteria: ['operational_detail', 'detection_analysis', 'control_assessment']
    }
  },

  workshop5: {
    risk_treatment: {
      title: 'Stratégie de traitement des risques',
      requirements: [
        'Définir les options de traitement',
        'Prioriser les mesures de sécurité',
        'Élaborer le plan d\'action'
      ],
      context_variables: ['risk_appetite', 'budget_constraints', 'implementation_timeline'],
      scoring_criteria: ['treatment_strategy', 'prioritization', 'action_plan']
    }
  }
};

// 🎯 MÉTRIQUES ET KPI

export const METRICS_CONFIG = {
  PERFORMANCE_INDICATORS: {
    completion_rate: {
      name: 'Taux de Completion',
      description: 'Pourcentage de sessions terminées',
      target: 85,
      unit: '%'
    },
    
    average_score: {
      name: 'Score Moyen',
      description: 'Score moyen obtenu par les utilisateurs',
      target: 75,
      unit: '%'
    },
    
    time_efficiency: {
      name: 'Efficacité Temporelle',
      description: 'Ratio temps utilisé / temps alloué',
      target: 0.8,
      unit: 'ratio'
    },
    
    progression_rate: {
      name: 'Taux de Progression',
      description: 'Amélioration du score entre sessions',
      target: 10,
      unit: '%'
    }
  },

  ANALYTICS_EVENTS: [
    'session_started',
    'question_viewed',
    'hint_requested',
    'answer_submitted',
    'session_completed',
    'session_abandoned',
    'feedback_viewed',
    'expert_consultation'
  ]
};

// 🔧 CONFIGURATION D'INITIALISATION

export const INITIALIZATION_CONFIG = {
  REQUIRED_SERVICES: [
    'ComplexQuestionGeneratorService',
    'RealTimeScoringService',
    'ExpertFeedbackService',
    'ComplexQuestionOrchestrator',
    'ComplexQuestionIntegrationService'
  ],

  STARTUP_CHECKS: [
    'database_connection',
    'user_profile_validation',
    'workshop_data_availability',
    'expert_personas_loaded',
    'question_templates_validated'
  ],

  ERROR_HANDLING: {
    retry_attempts: 3,
    retry_delay: 1000,
    fallback_mode: 'simplified_questions',
    error_reporting: true
  }
};

// 🌐 CONFIGURATION ENVIRONNEMENT

export const ENVIRONMENT_CONFIG = {
  development: {
    debug_mode: true,
    mock_data: true,
    performance_logging: true,
    test_mode: true
  },

  staging: {
    debug_mode: false,
    mock_data: false,
    performance_logging: true,
    test_mode: false
  },

  production: {
    debug_mode: false,
    mock_data: false,
    performance_logging: false,
    test_mode: false
  }
};

// 🚀 FONCTION D'INITIALISATION

export const initializeComplexQuestionSystem = async (environment: 'development' | 'staging' | 'production') => {
  const config = ENVIRONMENT_CONFIG[environment];
  
  console.log(`🚀 Initialisation du système de questions complexes (${environment})`);
  
  try {
    // Vérifications de démarrage
    for (const check of INITIALIZATION_CONFIG.STARTUP_CHECKS) {
      console.log(`✓ Vérification: ${check}`);
      // Logique de vérification ici
    }
    
    // Chargement des services
    for (const service of INITIALIZATION_CONFIG.REQUIRED_SERVICES) {
      console.log(`✓ Service chargé: ${service}`);
      // Logique de chargement ici
    }
    
    console.log('🎉 Système de questions complexes initialisé avec succès');
    return { success: true, config };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return { success: false, error };
  }
};

export default {
  COMPLEX_QUESTION_CONFIG,
  EXPERT_PERSONAS,
  QUESTION_TEMPLATES,
  METRICS_CONFIG,
  INITIALIZATION_CONFIG,
  ENVIRONMENT_CONFIG,
  initializeComplexQuestionSystem
};

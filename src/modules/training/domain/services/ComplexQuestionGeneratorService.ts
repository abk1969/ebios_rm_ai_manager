/**
 * 🧠 SERVICE DE GÉNÉRATION DE QUESTIONS COMPLEXES EN TEMPS RÉEL
 * Génération dynamique et adaptative de questions EBIOS RM expertes
 * Spécialisé pour le secteur santé avec IA contextuelle
 */

import { 
  EbiosExpertProfile, 
  WorkshopContext,
  AgentResponseData 
} from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR QUESTIONS COMPLEXES
export interface ComplexQuestion {
  id: string;
  workshopId: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  category: QuestionCategory;
  title: string;
  description: string;
  context: QuestionContext;
  requirements: QuestionRequirement[];
  scoring: ScoringCriteria;
  timeLimit: number; // minutes
  hints: QuestionHint[];
  expertFeedback: ExpertFeedback;
  adaptiveElements: AdaptiveElement[];
  realTimeValidation: ValidationRule[];
  metadata: QuestionMetadata;
}

export type QuestionType = 
  | 'scenario_analysis' 
  | 'threat_modeling' 
  | 'risk_calculation' 
  | 'decision_matrix'
  | 'multi_stakeholder_simulation'
  | 'crisis_management'
  | 'regulatory_compliance'
  | 'technical_assessment';

export type DifficultyLevel = 'intermediate' | 'advanced' | 'expert' | 'master';

export type QuestionCategory = 
  | 'asset_identification'
  | 'risk_sources' 
  | 'strategic_scenarios'
  | 'operational_scenarios'
  | 'risk_treatment';

export interface QuestionContext {
  organizationType: string;
  sector: string;
  specificContext: Record<string, any>;
  stakeholders: Stakeholder[];
  constraints: Constraint[];
  currentThreatLandscape: ThreatIntelligence[];
}

export interface QuestionRequirement {
  id: string;
  type: 'analysis' | 'calculation' | 'justification' | 'recommendation';
  description: string;
  expectedFormat: string;
  validationCriteria: string[];
  weight: number; // 0-1
}

export interface ScoringCriteria {
  totalPoints: number;
  breakdown: ScoreBreakdown[];
  bonusPoints: BonusPoint[];
  penaltyRules: PenaltyRule[];
  expertReview: boolean;
}

export interface ScoreBreakdown {
  criterion: string;
  points: number;
  description: string;
  evaluationMethod: 'automatic' | 'ai_assisted' | 'expert_review';
}

export interface QuestionHint {
  level: number; // 1-3
  content: string;
  pointDeduction: number;
  unlockCondition?: string;
}

export interface ExpertFeedback {
  immediate: string[];
  detailed: string[];
  improvementSuggestions: string[];
  expertInsights: string[];
  anssiReferences: string[];
}

export interface AdaptiveElement {
  trigger: string;
  modification: string;
  impact: string;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface QuestionMetadata {
  createdAt: Date;
  generatedBy: 'ai' | 'expert' | 'hybrid';
  version: string;
  tags: string[];
  anssiCompliance: boolean;
  lastUpdated: Date;
  usageStats: UsageStats;
}

export interface UsageStats {
  timesUsed: number;
  averageScore: number;
  averageTime: number;
  successRate: number;
  feedbackRating: number;
}

// 🎯 INTERFACES SUPPORT
export interface Stakeholder {
  role: string;
  level: string;
  interests: string[];
  constraints: string[];
}

export interface Constraint {
  type: string;
  description: string;
  impact: string;
  workaround?: string;
}

export interface ThreatIntelligence {
  source: string;
  threat: string;
  relevance: number;
  confidence: number;
  lastUpdated: Date;
}

export interface BonusPoint {
  condition: string;
  points: number;
  description: string;
}

export interface PenaltyRule {
  condition: string;
  penalty: number;
  description: string;
}

// 🎯 PARAMÈTRES DE GÉNÉRATION
export interface QuestionGenerationRequest {
  workshopId: number;
  userProfile: EbiosExpertProfile;
  context: WorkshopContext;
  difficulty: DifficultyLevel;
  count: number;
  focusAreas?: string[];
  excludeTopics?: string[];
  timeConstraint?: number;
  adaptToUserLevel?: boolean;
}

export interface QuestionGenerationResponse {
  questions: ComplexQuestion[];
  metadata: GenerationMetadata;
  recommendations: string[];
  nextSteps: string[];
}

export interface GenerationMetadata {
  generationTime: number;
  aiModel: string;
  confidence: number;
  adaptations: string[];
  sources: string[];
}

/**
 * 🎯 SERVICE PRINCIPAL DE GÉNÉRATION DE QUESTIONS COMPLEXES
 */
export class ComplexQuestionGeneratorService {
  private static instance: ComplexQuestionGeneratorService;
  private questionTemplates: Map<string, ComplexQuestion[]> = new Map();
  private generationHistory: QuestionGenerationResponse[] = [];
  private adaptiveRules: Map<string, AdaptiveElement[]> = new Map();

  private constructor() {
    this.initializeTemplates();
    this.initializeAdaptiveRules();
  }

  public static getInstance(): ComplexQuestionGeneratorService {
    if (!ComplexQuestionGeneratorService.instance) {
      ComplexQuestionGeneratorService.instance = new ComplexQuestionGeneratorService();
    }
    return ComplexQuestionGeneratorService.instance;
  }

  /**
   * 🎯 GÉNÉRATION PRINCIPALE DE QUESTIONS COMPLEXES
   */
  async generateComplexQuestions(request: QuestionGenerationRequest): Promise<QuestionGenerationResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`🧠 Génération de ${request.count} questions complexes pour Workshop ${request.workshopId}`);
      
      // 1. Analyse du contexte et adaptation
      const adaptedContext = await this.analyzeAndAdaptContext(request);
      
      // 2. Sélection des templates appropriés
      const selectedTemplates = await this.selectQuestionTemplates(request, adaptedContext);
      
      // 3. Génération des questions avec IA
      const generatedQuestions = await this.generateQuestionsWithAI(
        selectedTemplates, 
        request, 
        adaptedContext
      );
      
      // 4. Application des règles adaptatives
      const adaptedQuestions = await this.applyAdaptiveRules(generatedQuestions, request);
      
      // 5. Validation et scoring
      const validatedQuestions = await this.validateAndScore(adaptedQuestions);
      
      // 6. Génération des métadonnées
      const metadata = this.generateMetadata(startTime, request, validatedQuestions);
      
      const response: QuestionGenerationResponse = {
        questions: validatedQuestions,
        metadata,
        recommendations: this.generateRecommendations(validatedQuestions, request),
        nextSteps: this.generateNextSteps(validatedQuestions, request)
      };
      
      // Sauvegarder dans l'historique
      this.generationHistory.push(response);
      
      console.log(`✅ ${validatedQuestions.length} questions complexes générées avec succès`);
      return response;
      
    } catch (error) {
      console.error('❌ Erreur génération questions complexes:', error);
      throw new Error(`Échec génération questions: ${error.message}`);
    }
  }

  /**
   * 🔍 ANALYSE ET ADAPTATION DU CONTEXTE
   */
  private async analyzeAndAdaptContext(request: QuestionGenerationRequest): Promise<any> {
    // Analyse du profil utilisateur et adaptation du niveau
    const userLevel = this.analyzeUserLevel(request.userProfile);
    
    // Analyse du contexte workshop
    const workshopSpecifics = this.getWorkshopSpecifics(request.workshopId);
    
    // Analyse du secteur (santé)
    const sectorContext = this.getSectorContext(request.context.sector);
    
    return {
      userLevel,
      workshopSpecifics,
      sectorContext,
      adaptations: this.calculateAdaptations(request)
    };
  }

  /**
   * 📋 SÉLECTION DES TEMPLATES DE QUESTIONS
   */
  private async selectQuestionTemplates(
    request: QuestionGenerationRequest, 
    context: any
  ): Promise<ComplexQuestion[]> {
    const workshopKey = `workshop_${request.workshopId}`;
    const availableTemplates = this.questionTemplates.get(workshopKey) || [];
    
    // Filtrage par difficulté
    const filteredByDifficulty = availableTemplates.filter(
      template => template.difficulty === request.difficulty
    );
    
    // Filtrage par focus areas
    const filteredByFocus = request.focusAreas ? 
      filteredByDifficulty.filter(template => 
        request.focusAreas!.some(area => template.metadata.tags.includes(area))
      ) : filteredByDifficulty;
    
    // Sélection intelligente basée sur le contexte
    return this.intelligentSelection(filteredByFocus, request, context);
  }

  /**
   * 🤖 GÉNÉRATION AVEC IA
   */
  private async generateQuestionsWithAI(
    templates: ComplexQuestion[],
    request: QuestionGenerationRequest,
    context: any
  ): Promise<ComplexQuestion[]> {
    const generatedQuestions: ComplexQuestion[] = [];
    
    for (let i = 0; i < request.count && i < templates.length; i++) {
      const template = templates[i];
      const aiEnhancedQuestion = await this.enhanceQuestionWithAI(template, request, context);
      generatedQuestions.push(aiEnhancedQuestion);
    }
    
    return generatedQuestions;
  }

  /**
   * 🎯 INITIALISATION DES TEMPLATES
   */
  private initializeTemplates(): void {
    console.log('🔧 Initialisation des templates de questions complexes...');

    // 🏥 TEMPLATES WORKSHOP 1 - BIENS ESSENTIELS
    this.questionTemplates.set('workshop_1', [
      {
        id: 'w1_complex_asset_analysis',
        workshopId: 1,
        type: 'scenario_analysis',
        difficulty: 'expert',
        category: 'asset_identification',
        title: 'Analyse Complexe des Biens Essentiels CHU',
        description: 'Analysez l\'interdépendance des biens essentiels dans un scénario de crise multi-sites',
        context: {
          organizationType: 'CHU Métropolitain',
          sector: 'santé',
          specificContext: {
            sites: 3,
            bedCount: 1200,
            specialties: ['Urgences', 'Réanimation', 'Chirurgie', 'Oncologie'],
            criticalSystems: ['SIH', 'PACS', 'Laboratoires', 'Pharmacie']
          },
          stakeholders: [
            { role: 'Directeur Médical', level: 'stratégique', interests: ['Continuité soins'], constraints: ['Budget', 'Réglementation'] },
            { role: 'RSSI', level: 'opérationnel', interests: ['Sécurité'], constraints: ['Ressources', 'Expertise'] },
            { role: 'DSI', level: 'technique', interests: ['Disponibilité'], constraints: ['Legacy', 'Maintenance'] }
          ],
          constraints: [
            { type: 'réglementaire', description: 'Conformité HDS', impact: 'Certification obligatoire', workaround: 'Audit externe' },
            { type: 'opérationnel', description: 'Continuité 24h/24', impact: 'Aucune interruption tolérée' }
          ],
          currentThreatLandscape: [
            { source: 'ANSSI', threat: 'Ransomware hospitalier', relevance: 5, confidence: 0.9, lastUpdated: new Date() }
          ]
        },
        requirements: [
          {
            id: 'req_1',
            type: 'analysis',
            description: 'Identifier les 5 biens essentiels critiques et leurs interdépendances',
            expectedFormat: 'Matrice d\'interdépendance avec justifications',
            validationCriteria: ['Exhaustivité', 'Pertinence', 'Justification méthodologique'],
            weight: 0.3
          },
          {
            id: 'req_2',
            type: 'calculation',
            description: 'Calculer l\'impact financier d\'une indisponibilité de 24h par bien',
            expectedFormat: 'Tableau avec calculs détaillés',
            validationCriteria: ['Précision calculs', 'Sources fiables', 'Méthodologie claire'],
            weight: 0.25
          },
          {
            id: 'req_3',
            type: 'recommendation',
            description: 'Proposer une stratégie de priorisation pour la protection',
            expectedFormat: 'Plan d\'action hiérarchisé',
            validationCriteria: ['Faisabilité', 'Efficacité', 'Conformité EBIOS RM'],
            weight: 0.45
          }
        ],
        scoring: {
          totalPoints: 100,
          breakdown: [
            { criterion: 'Analyse interdépendances', points: 30, description: 'Qualité de l\'analyse des liens entre biens', evaluationMethod: 'ai_assisted' },
            { criterion: 'Calculs financiers', points: 25, description: 'Précision et réalisme des estimations', evaluationMethod: 'automatic' },
            { criterion: 'Stratégie protection', points: 45, description: 'Pertinence et faisabilité des recommandations', evaluationMethod: 'expert_review' }
          ],
          bonusPoints: [
            { condition: 'Innovation méthodologique', points: 10, description: 'Approche créative et pertinente' },
            { condition: 'Références externes', points: 5, description: 'Utilisation de sources expertes' }
          ],
          penaltyRules: [
            { condition: 'Non-conformité EBIOS RM', penalty: 20, description: 'Écart méthodologique majeur' },
            { condition: 'Calculs erronés', penalty: 15, description: 'Erreurs dans les estimations' }
          ],
          expertReview: true
        },
        timeLimit: 45,
        hints: [
          { level: 1, content: 'Pensez aux flux de données entre systèmes', pointDeduction: 2, unlockCondition: 'Après 15 minutes' },
          { level: 2, content: 'Considérez l\'impact en cascade des pannes', pointDeduction: 5, unlockCondition: 'Après 25 minutes' },
          { level: 3, content: 'Référez-vous au guide ANSSI sur les infrastructures critiques', pointDeduction: 8, unlockCondition: 'Après 35 minutes' }
        ],
        expertFeedback: {
          immediate: ['Vérifiez la cohérence de votre analyse', 'Justifiez vos priorités'],
          detailed: ['Approfondissez l\'analyse des interdépendances techniques', 'Intégrez les contraintes réglementaires'],
          improvementSuggestions: ['Utilisez des métriques quantitatives', 'Consultez les retours d\'expérience sectoriels'],
          expertInsights: ['Les CHU ont des spécificités uniques en termes de criticité', 'L\'approche par processus métier est essentielle'],
          anssiReferences: ['Guide EBIOS RM v1.5', 'Référentiel sécurité des systèmes d\'information de santé']
        },
        adaptiveElements: [
          { trigger: 'Score faible interdépendances', modification: 'Ajouter exemples concrets', impact: 'Amélioration compréhension' },
          { trigger: 'Expertise technique élevée', modification: 'Questions techniques approfondies', impact: 'Défi adapté au niveau' }
        ],
        realTimeValidation: [
          { field: 'interdependencies', rule: 'minimum_5_assets', message: 'Au moins 5 biens essentiels requis', severity: 'error' },
          { field: 'financial_impact', rule: 'realistic_values', message: 'Vérifiez le réalisme des montants', severity: 'warning' },
          { field: 'methodology', rule: 'ebios_compliance', message: 'Respectez la méthodologie EBIOS RM', severity: 'error' }
        ],
        metadata: {
          createdAt: new Date(),
          generatedBy: 'hybrid',
          version: '1.0',
          tags: ['biens_essentiels', 'interdépendances', 'CHU', 'analyse_complexe'],
          anssiCompliance: true,
          lastUpdated: new Date(),
          usageStats: {
            timesUsed: 0,
            averageScore: 0,
            averageTime: 0,
            successRate: 0,
            feedbackRating: 0
          }
        }
      }
    ]);

    // 🎯 TEMPLATES WORKSHOP 2 - SOURCES DE RISQUE
    this.questionTemplates.set('workshop_2', [
      {
        id: 'w2_complex_threat_analysis',
        workshopId: 2,
        type: 'threat_modeling',
        difficulty: 'expert',
        category: 'risk_sources',
        title: 'Modélisation Avancée des Menaces Secteur Santé',
        description: 'Analysez et modélisez les sources de risque dans un contexte de threat intelligence temps réel',
        context: {
          organizationType: 'CHU Métropolitain',
          sector: 'santé',
          specificContext: {
            threatLandscape2024: ['LockBit 4.0', 'APT40 santé', 'Insider threats'],
            recentIncidents: ['CHU Rouen 2019', 'Hôpitaux irlandais 2021', 'Medibank 2022'],
            geopoliticalContext: 'Tensions cyber internationales',
            regulatoryPressure: 'NIS2, RGPD renforcé'
          },
          stakeholders: [
            { role: 'Threat Intelligence Analyst', level: 'expert', interests: ['Détection précoce'], constraints: ['Sources limitées'] },
            { role: 'CISO', level: 'stratégique', interests: ['Risque global'], constraints: ['Budget', 'Ressources'] }
          ],
          constraints: [
            { type: 'temporel', description: 'Évolution rapide des menaces', impact: 'Obsolescence rapide des analyses' },
            { type: 'informationnel', description: 'Sources threat intelligence limitées', impact: 'Analyse incomplète' }
          ],
          currentThreatLandscape: [
            { source: 'CERT Santé', threat: 'Campagne ransomware ciblée', relevance: 5, confidence: 0.85, lastUpdated: new Date() },
            { source: 'ANSSI', threat: 'APT recherche médicale', relevance: 4, confidence: 0.75, lastUpdated: new Date() }
          ]
        },
        requirements: [
          {
            id: 'req_threat_profiling',
            type: 'analysis',
            description: 'Profiler 3 sources de risque prioritaires avec motivations, capacités et modes opératoires',
            expectedFormat: 'Fiches de profilage détaillées avec IOC',
            validationCriteria: ['Précision technique', 'Sources fiables', 'Actualité des informations'],
            weight: 0.4
          },
          {
            id: 'req_attack_scenarios',
            type: 'analysis',
            description: 'Modéliser 2 scénarios d\'attaque réalistes avec kill chain complète',
            expectedFormat: 'Diagrammes de kill chain avec techniques MITRE ATT&CK',
            validationCriteria: ['Réalisme technique', 'Cohérence séquentielle', 'Mapping MITRE'],
            weight: 0.35
          },
          {
            id: 'req_detection_strategy',
            type: 'recommendation',
            description: 'Proposer une stratégie de détection et de réponse adaptée',
            expectedFormat: 'Plan de détection avec indicateurs et procédures',
            validationCriteria: ['Faisabilité technique', 'Efficacité détection', 'Temps de réponse'],
            weight: 0.25
          }
        ],
        scoring: {
          totalPoints: 120,
          breakdown: [
            { criterion: 'Profilage sources', points: 48, description: 'Qualité et précision du profilage des menaces', evaluationMethod: 'ai_assisted' },
            { criterion: 'Modélisation attaques', points: 42, description: 'Réalisme et cohérence des scénarios', evaluationMethod: 'expert_review' },
            { criterion: 'Stratégie détection', points: 30, description: 'Pertinence et faisabilité des mesures', evaluationMethod: 'ai_assisted' }
          ],
          bonusPoints: [
            { condition: 'Utilisation MITRE ATT&CK', points: 15, description: 'Mapping précis des techniques' },
            { condition: 'IOC techniques valides', points: 10, description: 'Indicateurs de compromission réalistes' },
            { condition: 'Threat intelligence récente', points: 8, description: 'Sources actualisées 2024' }
          ],
          penaltyRules: [
            { condition: 'Informations obsolètes', penalty: 15, description: 'Utilisation de données périmées' },
            { condition: 'Scénarios irréalistes', penalty: 20, description: 'Manque de cohérence technique' }
          ],
          expertReview: true
        },
        timeLimit: 50,
        hints: [
          { level: 1, content: 'Consultez les derniers rapports CERT Santé', pointDeduction: 3, unlockCondition: 'Après 15 minutes' },
          { level: 2, content: 'Utilisez le framework MITRE ATT&CK for Healthcare', pointDeduction: 6, unlockCondition: 'Après 25 minutes' },
          { level: 3, content: 'Analysez les TTPs spécifiques au secteur santé', pointDeduction: 10, unlockCondition: 'Après 35 minutes' }
        ],
        expertFeedback: {
          immediate: ['Vérifiez l\'actualité de vos sources', 'Justifiez le niveau de menace attribué'],
          detailed: ['Approfondissez l\'analyse des motivations', 'Détaillez les capacités techniques requises'],
          improvementSuggestions: ['Intégrez des IOC techniques précis', 'Référencez des incidents récents similaires'],
          expertInsights: ['Le secteur santé a des spécificités de menaces uniques', 'La pression temporelle influence les motivations des attaquants'],
          anssiReferences: ['Guide menaces ANSSI 2024', 'Panorama de la cybermenace ANSSI']
        },
        adaptiveElements: [
          { trigger: 'Expertise threat intelligence élevée', modification: 'Questions techniques approfondies', impact: 'Défi adapté' },
          { trigger: 'Manque de sources récentes', modification: 'Guidance vers ressources actuelles', impact: 'Amélioration qualité' }
        ],
        realTimeValidation: [
          { field: 'threat_sources', rule: 'minimum_3_sources', message: 'Au moins 3 sources de risque requises', severity: 'error' },
          { field: 'mitre_mapping', rule: 'valid_techniques', message: 'Vérifiez la validité des techniques MITRE', severity: 'warning' },
          { field: 'ioc_format', rule: 'technical_validity', message: 'Format des IOC non conforme', severity: 'error' }
        ],
        metadata: {
          createdAt: new Date(),
          generatedBy: 'ai',
          version: '1.0',
          tags: ['sources_risque', 'threat_modeling', 'santé', 'threat_intelligence'],
          anssiCompliance: true,
          lastUpdated: new Date(),
          usageStats: {
            timesUsed: 0,
            averageScore: 0,
            averageTime: 0,
            successRate: 0,
            feedbackRating: 0
          }
        }
      }
    ]);
  }

  /**
   * ⚙️ INITIALISATION DES RÈGLES ADAPTATIVES
   */
  private initializeAdaptiveRules(): void {
    console.log('🔧 Initialisation des règles adaptatives...');

    // 🎯 RÈGLES ADAPTATIVES PAR NIVEAU D'EXPERTISE
    this.adaptiveRules.set('expertise_level', [
      {
        trigger: 'user_level_beginner',
        modification: 'add_detailed_guidance',
        impact: 'Ajout de guidance détaillée et d\'exemples'
      },
      {
        trigger: 'user_level_expert',
        modification: 'increase_complexity',
        impact: 'Augmentation de la complexité technique'
      },
      {
        trigger: 'user_level_master',
        modification: 'add_edge_cases',
        impact: 'Ajout de cas limites et de défis avancés'
      }
    ]);

    // 🎯 RÈGLES ADAPTATIVES PAR PERFORMANCE
    this.adaptiveRules.set('performance_based', [
      {
        trigger: 'low_score_pattern',
        modification: 'provide_additional_hints',
        impact: 'Indices supplémentaires et guidance renforcée'
      },
      {
        trigger: 'high_score_pattern',
        modification: 'increase_difficulty',
        impact: 'Questions plus complexes et défis additionnels'
      },
      {
        trigger: 'time_pressure',
        modification: 'simplify_requirements',
        impact: 'Simplification des exigences sous contrainte temporelle'
      }
    ]);

    // 🎯 RÈGLES ADAPTATIVES PAR CONTEXTE
    this.adaptiveRules.set('context_based', [
      {
        trigger: 'healthcare_sector',
        modification: 'add_medical_specifics',
        impact: 'Ajout de spécificités médicales et réglementaires'
      },
      {
        trigger: 'critical_infrastructure',
        modification: 'emphasize_continuity',
        impact: 'Accent sur la continuité de service'
      },
      {
        trigger: 'recent_incidents',
        modification: 'integrate_current_threats',
        impact: 'Intégration des menaces actuelles'
      }
    ]);
  }

  /**
   * 🔍 ANALYSE DU NIVEAU UTILISATEUR
   */
  private analyzeUserLevel(profile: EbiosExpertProfile): string {
    const { experience, specializations, certifications } = profile;

    let score = 0;

    // Analyse de l'expérience
    if (experience.ebiosYears >= 10) score += 3;
    else if (experience.ebiosYears >= 5) score += 2;
    else if (experience.ebiosYears >= 2) score += 1;

    // Analyse des spécialisations
    if (specializations.includes('threat_intelligence')) score += 2;
    if (specializations.includes('risk_management')) score += 2;
    if (specializations.includes('healthcare_security')) score += 1;

    // Analyse des certifications
    if (certifications.includes('CISSP')) score += 1;
    if (certifications.includes('CISM')) score += 1;
    if (certifications.includes('ANSSI')) score += 2;

    if (score >= 8) return 'master';
    if (score >= 6) return 'expert';
    if (score >= 4) return 'advanced';
    return 'intermediate';
  }

  /**
   * 🎯 SPÉCIFICITÉS PAR WORKSHOP
   */
  private getWorkshopSpecifics(workshopId: number): any {
    const specifics = {
      1: {
        focus: 'asset_identification',
        complexity: 'structural_analysis',
        keySkills: ['business_analysis', 'risk_assessment', 'stakeholder_management'],
        timeFactors: ['urgency_analysis', 'dependency_mapping'],
        deliverables: ['asset_inventory', 'criticality_matrix', 'protection_strategy']
      },
      2: {
        focus: 'threat_analysis',
        complexity: 'threat_modeling',
        keySkills: ['threat_intelligence', 'attack_analysis', 'behavioral_analysis'],
        timeFactors: ['threat_evolution', 'intelligence_freshness'],
        deliverables: ['threat_profiles', 'attack_scenarios', 'detection_strategy']
      },
      3: {
        focus: 'strategic_scenarios',
        complexity: 'scenario_construction',
        keySkills: ['scenario_planning', 'impact_analysis', 'strategic_thinking'],
        timeFactors: ['scenario_evolution', 'strategic_planning'],
        deliverables: ['strategic_scenarios', 'impact_assessment', 'mitigation_priorities']
      },
      4: {
        focus: 'operational_scenarios',
        complexity: 'technical_analysis',
        keySkills: ['technical_analysis', 'operational_planning', 'incident_response'],
        timeFactors: ['operational_tempo', 'technical_evolution'],
        deliverables: ['operational_scenarios', 'technical_controls', 'response_procedures']
      },
      5: {
        focus: 'risk_treatment',
        complexity: 'decision_analysis',
        keySkills: ['decision_making', 'cost_analysis', 'governance'],
        timeFactors: ['implementation_timeline', 'budget_cycles'],
        deliverables: ['treatment_plan', 'investment_strategy', 'governance_framework']
      }
    };

    return specifics[workshopId] || specifics[1];
  }

  /**
   * 🏥 CONTEXTE SECTORIEL
   */
  private getSectorContext(sector: string): any {
    const contexts = {
      'santé': {
        regulations: ['HDS', 'RGPD', 'NIS2', 'Certification HAS'],
        threats: ['Ransomware hospitalier', 'Vol données patients', 'Sabotage équipements'],
        stakeholders: ['Patients', 'Personnel soignant', 'Autorités santé', 'Fournisseurs'],
        constraints: ['Continuité 24h/24', 'Vies humaines', 'Confidentialité médicale'],
        specifics: {
          criticalAssets: ['SIH', 'PACS', 'Laboratoires', 'Urgences'],
          rto: '< 4 heures',
          rpo: '< 1 heure',
          complianceLevel: 'maximum'
        }
      },
      'finance': {
        regulations: ['PCI-DSS', 'RGPD', 'ACPR', 'MiFID'],
        threats: ['Fraude financière', 'Vol données bancaires', 'Manipulation marchés'],
        stakeholders: ['Clients', 'Régulateurs', 'Partenaires', 'Investisseurs'],
        constraints: ['Intégrité transactions', 'Confidentialité', 'Disponibilité'],
        specifics: {
          criticalAssets: ['Core Banking', 'Trading Systems', 'Customer Data'],
          rto: '< 2 heures',
          rpo: '< 30 minutes',
          complianceLevel: 'maximum'
        }
      }
    };

    return contexts[sector] || contexts['santé'];
  }

  /**
   * 🔄 CALCUL DES ADAPTATIONS
   */
  private calculateAdaptations(request: QuestionGenerationRequest): string[] {
    const adaptations: string[] = [];

    // Adaptation par niveau utilisateur
    const userLevel = this.analyzeUserLevel(request.userProfile);
    if (userLevel === 'master') {
      adaptations.push('complexity_increase');
      adaptations.push('edge_cases_included');
    } else if (userLevel === 'intermediate') {
      adaptations.push('guidance_enhanced');
      adaptations.push('examples_added');
    }

    // Adaptation par contrainte temporelle
    if (request.timeConstraint && request.timeConstraint < 30) {
      adaptations.push('simplified_requirements');
      adaptations.push('focused_scope');
    }

    // Adaptation par secteur
    if (request.context.sector === 'santé') {
      adaptations.push('healthcare_specifics');
      adaptations.push('regulatory_focus');
    }

    return adaptations;
  }

  /**
   * 🎯 SÉLECTION INTELLIGENTE
   */
  private intelligentSelection(
    templates: ComplexQuestion[],
    request: QuestionGenerationRequest,
    context: any
  ): ComplexQuestion[] {
    // Scoring des templates basé sur le contexte
    const scoredTemplates = templates.map(template => ({
      template,
      score: this.calculateTemplateScore(template, request, context)
    }));

    // Tri par score décroissant
    scoredTemplates.sort((a, b) => b.score - a.score);

    // Sélection des meilleurs templates
    const selected = scoredTemplates
      .slice(0, request.count)
      .map(item => item.template);

    console.log(`🎯 ${selected.length} templates sélectionnés intelligemment`);
    return selected;
  }

  /**
   * 📊 CALCUL DU SCORE DE TEMPLATE
   */
  private calculateTemplateScore(
    template: ComplexQuestion,
    request: QuestionGenerationRequest,
    context: any
  ): number {
    let score = 0;

    // Score basé sur la difficulté demandée
    if (template.difficulty === request.difficulty) score += 10;

    // Score basé sur les focus areas
    if (request.focusAreas) {
      const matchingTags = template.metadata.tags.filter(tag =>
        request.focusAreas!.includes(tag)
      ).length;
      score += matchingTags * 5;
    }

    // Score basé sur l'usage historique
    if (template.metadata.usageStats.successRate > 0.8) score += 5;
    if (template.metadata.usageStats.feedbackRating > 4) score += 3;

    // Score basé sur l'actualité
    const daysSinceUpdate = (Date.now() - template.metadata.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) score += 3;

    return score;
  }
}

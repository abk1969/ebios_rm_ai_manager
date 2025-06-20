/**
 * 🤖 AGENT FORMATEUR IA - INSTRUCTEUR PRINCIPAL
 * Agent IA spécialisé dans l'instruction et l'accompagnement pédagogique
 * Pattern Strategy + Command pour flexibilité maximale
 */

import { TrainingSession, SectorType, DifficultyLevel, WorkshopType } from '../../domain/entities/TrainingSession';
import { Learner, LearnerRole } from '../../domain/entities/Learner';
import { TrainingEventBus, TrainingEventFactory, TrainingEventType } from '../events/TrainingEventBus';

// 🎯 INTERFACES AGENT
export interface TrainingInstruction {
  id: string;
  type: InstructionType;
  content: string;
  context: InstructionContext;
  personalization: PersonalizationData;
  interactionStyle: InteractionStyle;
  expectedResponse?: string;
  followUpQuestions?: string[];
  resources?: InstructionResource[];
  timestamp: Date;
}

export enum InstructionType {
  WELCOME = 'welcome',
  EXPLANATION = 'explanation',
  GUIDANCE = 'guidance',
  QUESTION = 'question',
  FEEDBACK = 'feedback',
  ENCOURAGEMENT = 'encouragement',
  CORRECTION = 'correction',
  SUMMARY = 'summary',
  TRANSITION = 'transition',
  ASSESSMENT = 'assessment'
}

export interface InstructionContext {
  sessionId: string;
  learnerId: string;
  currentWorkshop: WorkshopType;
  currentStep: number;
  previousInteractions: string[];
  learnerProgress: {
    completionPercentage: number;
    currentScore: number;
    strugglingAreas: string[];
    strengths: string[];
  };
  timeContext: {
    sessionDuration: number;
    stepDuration: number;
    timeOfDay: string;
  };
}

export interface PersonalizationData {
  learnerName: string;
  sector: SectorType;
  role: LearnerRole;
  experienceLevel: DifficultyLevel;
  learningStyle: string;
  preferredPace: string;
  culturalContext: string;
  organizationContext: string;
}

export enum InteractionStyle {
  SOCRATIC = 'socratic', // Questions pour faire découvrir
  DIRECTIVE = 'directive', // Instructions claires et directes
  COLLABORATIVE = 'collaborative', // Travail en partenariat
  EXPLORATORY = 'exploratory', // Encouragement à explorer
  SUPPORTIVE = 'supportive', // Soutien et encouragement
  CHALLENGING = 'challenging' // Défis et stimulation
}

export interface InstructionResource {
  type: 'document' | 'example' | 'template' | 'reference' | 'tool';
  title: string;
  description: string;
  url?: string;
  content?: string;
  relevanceScore: number;
}

export interface LearnerResponse {
  content: string;
  timestamp: Date;
  confidence: number;
  completeness: number;
  accuracy: number;
  context: string;
}

export interface InstructionFeedback {
  instructionId: string;
  responseQuality: number; // 0-100
  learnerEngagement: number; // 0-100
  conceptUnderstanding: number; // 0-100
  nextInstructionSuggestion: InstructionType;
  adaptationRecommendations: string[];
}

/**
 * 🎯 AGENT FORMATEUR PRINCIPAL
 */
export class TrainingInstructorAgent {
  private conversationHistory: Map<string, TrainingInstruction[]> = new Map();
  private learnerProfiles: Map<string, PersonalizationData> = new Map();
  private adaptationStrategies: Map<string, AdaptationStrategy> = new Map();

  constructor(
    private readonly eventBus: TrainingEventBus,
    private readonly aiService: AIService,
    private readonly contentService: ContentService
  ) {
    this.initializeAdaptationStrategies();
  }

  // 🎯 GÉNÉRATION D'INSTRUCTIONS PERSONNALISÉES
  async generateInstruction(
    session: TrainingSession,
    learner: Learner,
    context: Partial<InstructionContext>,
    requestedType?: InstructionType
  ): Promise<TrainingInstruction> {
    
    // 1. Construire le contexte complet
    const fullContext = await this.buildInstructionContext(session, learner, context);
    
    // 2. Déterminer le type d'instruction optimal
    const instructionType = requestedType || await this.determineOptimalInstructionType(fullContext);
    
    // 3. Récupérer les données de personnalisation
    const personalization = await this.getPersonalizationData(learner);
    
    // 4. Déterminer le style d'interaction
    const interactionStyle = await this.determineInteractionStyle(learner, fullContext);
    
    // 5. Générer le contenu de l'instruction
    const content = await this.generateInstructionContent(
      instructionType,
      fullContext,
      personalization,
      interactionStyle
    );
    
    // 6. Enrichir avec des ressources
    const resources = await this.getRelevantResources(fullContext, instructionType);
    
    // 7. Créer l'instruction
    const instruction: TrainingInstruction = {
      id: this.generateInstructionId(),
      type: instructionType,
      content,
      context: fullContext,
      personalization,
      interactionStyle,
      resources,
      timestamp: new Date()
    };

    // 8. Ajouter à l'historique
    this.addToConversationHistory(session.id.value, instruction);
    
    // 9. Émettre événement
    await this.emitInstructionEvent(instruction);
    
    return instruction;
  }

  // 🎯 TRAITEMENT DES RÉPONSES APPRENANTS
  async processLearnerResponse(
    sessionId: string,
    instructionId: string,
    response: LearnerResponse
  ): Promise<InstructionFeedback> {
    
    // 1. Analyser la qualité de la réponse
    const responseAnalysis = await this.analyzeLearnerResponse(response, instructionId);
    
    // 2. Évaluer l'engagement et la compréhension
    const engagementMetrics = await this.evaluateEngagement(response, sessionId);
    
    // 3. Déterminer les adaptations nécessaires
    const adaptations = await this.determineAdaptations(responseAnalysis, sessionId);
    
    // 4. Suggérer la prochaine instruction
    const nextInstructionType = await this.suggestNextInstruction(responseAnalysis, sessionId);
    
    const feedback: InstructionFeedback = {
      instructionId,
      responseQuality: responseAnalysis.quality,
      learnerEngagement: engagementMetrics.engagement,
      conceptUnderstanding: responseAnalysis.understanding,
      nextInstructionSuggestion: nextInstructionType,
      adaptationRecommendations: adaptations
    };

    // 5. Émettre événement de feedback
    await this.emitFeedbackEvent(feedback, sessionId);
    
    return feedback;
  }

  // 🎯 ADAPTATION DYNAMIQUE
  async adaptInstructionStrategy(
    sessionId: string,
    adaptationTrigger: AdaptationTrigger
  ): Promise<AdaptationResult> {
    
    const currentStrategy = this.adaptationStrategies.get(sessionId);
    const newStrategy = await this.calculateNewStrategy(currentStrategy, adaptationTrigger);
    
    this.adaptationStrategies.set(sessionId, newStrategy);
    
    return {
      previousStrategy: currentStrategy,
      newStrategy,
      adaptationReason: adaptationTrigger.reason,
      expectedImpact: newStrategy.expectedImpact
    };
  }

  // 🛠️ MÉTHODES PRIVÉES

  private async buildInstructionContext(
    session: TrainingSession,
    learner: Learner,
    partialContext: Partial<InstructionContext>
  ): Promise<InstructionContext> {
    
    const history = this.conversationHistory.get(session.id.value) || [];
    const previousInteractions = history.slice(-5).map(i => i.content);
    
    return {
      sessionId: session.id.value,
      learnerId: learner.id.value,
      currentWorkshop: session.progress.currentWorkshop,
      currentStep: session.progress.currentStep,
      previousInteractions,
      learnerProgress: {
        completionPercentage: session.completionPercentage,
        currentScore: 0, // À calculer depuis les évaluations
        strugglingAreas: [], // À analyser depuis l'historique
        strengths: [] // À analyser depuis l'historique
      },
      timeContext: {
        sessionDuration: session.progress.timeSpent,
        stepDuration: 0, // À calculer
        timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon'
      },
      ...partialContext
    };
  }

  private async determineOptimalInstructionType(context: InstructionContext): Promise<InstructionType> {
    // Logique de détermination basée sur le contexte
    if (context.currentStep === 1) {
      return InstructionType.WELCOME;
    }
    
    if (context.learnerProgress.completionPercentage < 20) {
      return InstructionType.GUIDANCE;
    }
    
    if (context.learnerProgress.strugglingAreas.length > 0) {
      return InstructionType.EXPLANATION;
    }
    
    if (context.timeContext.stepDuration > 30) { // Plus de 30 minutes sur une étape
      return InstructionType.ENCOURAGEMENT;
    }
    
    return InstructionType.QUESTION;
  }

  private async getPersonalizationData(learner: Learner): Promise<PersonalizationData> {
    const cached = this.learnerProfiles.get(learner.id.value);
    if (cached) return cached;
    
    const personalization: PersonalizationData = {
      learnerName: learner.name,
      sector: learner.sector,
      role: learner.role,
      experienceLevel: learner.experienceLevel,
      learningStyle: learner.preferences.interactionStyle,
      preferredPace: learner.preferences.pace,
      culturalContext: learner.preferences.language,
      organizationContext: learner.organization
    };
    
    this.learnerProfiles.set(learner.id.value, personalization);
    return personalization;
  }

  private async determineInteractionStyle(
    learner: Learner,
    context: InstructionContext
  ): Promise<InteractionStyle> {
    
    // Adaptation basée sur le profil et le contexte
    if (learner.experienceLevel === DifficultyLevel.BEGINNER) {
      return InteractionStyle.DIRECTIVE;
    }
    
    if (learner.experienceLevel === DifficultyLevel.EXPERT) {
      return InteractionStyle.COLLABORATIVE;
    }
    
    if (context.learnerProgress.strugglingAreas.length > 2) {
      return InteractionStyle.SUPPORTIVE;
    }
    
    if (context.learnerProgress.completionPercentage > 80) {
      return InteractionStyle.CHALLENGING;
    }
    
    return InteractionStyle.SOCRATIC;
  }

  private async generateInstructionContent(
    type: InstructionType,
    context: InstructionContext,
    personalization: PersonalizationData,
    style: InteractionStyle
  ): Promise<string> {
    
    // Construction du prompt pour l'IA
    const prompt = this.buildAIPrompt(type, context, personalization, style);
    
    // Appel au service IA
    const aiResponse = await this.aiService.generateInstruction(prompt);
    
    // Post-traitement et personnalisation
    return this.personalizeContent(aiResponse, personalization);
  }

  private buildAIPrompt(
    type: InstructionType,
    context: InstructionContext,
    personalization: PersonalizationData,
    style: InteractionStyle
  ): string {
    
    return `
Tu es un formateur expert en EBIOS RM, spécialisé dans l'accompagnement pédagogique personnalisé.

CONTEXTE DE FORMATION:
- Apprenant: ${personalization.learnerName} (${personalization.role})
- Secteur: ${personalization.sector}
- Niveau: ${personalization.experienceLevel}
- Atelier actuel: ${context.currentWorkshop}
- Étape: ${context.currentStep}
- Progression: ${context.learnerProgress.completionPercentage}%

STYLE D'INTERACTION REQUIS: ${style}
TYPE D'INSTRUCTION: ${type}

HISTORIQUE RÉCENT:
${context.previousInteractions.join('\n')}

CONSIGNES:
1. Adapte ton langage au niveau ${personalization.experienceLevel}
2. Utilise des exemples du secteur ${personalization.sector}
3. Maintiens un style ${style}
4. Sois concis mais complet
5. Encourage l'interaction

Génère une instruction pédagogique appropriée:
    `;
  }

  private personalizeContent(content: string, personalization: PersonalizationData): string {
    // Personnalisation basique - à enrichir
    return content
      .replace(/\[LEARNER_NAME\]/g, personalization.learnerName)
      .replace(/\[SECTOR\]/g, personalization.sector)
      .replace(/\[ORGANIZATION\]/g, personalization.organizationContext);
  }

  private async getRelevantResources(
    context: InstructionContext,
    type: InstructionType
  ): Promise<InstructionResource[]> {
    // Récupération des ressources pertinentes
    return await this.contentService.getResourcesForContext(
      context.currentWorkshop,
      context.currentStep,
      type
    );
  }

  private addToConversationHistory(sessionId: string, instruction: TrainingInstruction): void {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    
    const history = this.conversationHistory.get(sessionId)!;
    history.push(instruction);
    
    // Limiter l'historique à 50 instructions
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }

  private generateInstructionId(): string {
    return `instr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async emitInstructionEvent(instruction: TrainingInstruction): Promise<void> {
    const event = TrainingEventFactory.createSessionEvent(
      TrainingEventType.AI_SUGGESTION_GENERATED,
      instruction.context.sessionId,
      instruction.context.learnerId,
      {
        instructionId: instruction.id,
        type: instruction.type,
        interactionStyle: instruction.interactionStyle,
        hasResources: instruction.resources && instruction.resources.length > 0
      },
      {
        source: 'TrainingInstructorAgent'
      }
    );
    
    await this.eventBus.emit(event);
  }

  private async emitFeedbackEvent(feedback: InstructionFeedback, sessionId: string): Promise<void> {
    const event = TrainingEventFactory.createSessionEvent(
      TrainingEventType.AI_FEEDBACK_PROVIDED,
      sessionId,
      '', // userId sera rempli par le contexte
      feedback,
      {
        source: 'TrainingInstructorAgent'
      }
    );
    
    await this.eventBus.emit(event);
  }

  private initializeAdaptationStrategies(): void {
    // Initialisation des stratégies d'adaptation
    // À implémenter selon les besoins spécifiques
  }

  // Méthodes à implémenter
  private async analyzeLearnerResponse(response: LearnerResponse, instructionId: string): Promise<any> {
    // Analyse IA de la réponse
    return { quality: 80, understanding: 75 };
  }

  private async evaluateEngagement(response: LearnerResponse, sessionId: string): Promise<any> {
    // Évaluation de l'engagement
    return { engagement: 85 };
  }

  private async determineAdaptations(analysis: any, sessionId: string): Promise<string[]> {
    // Détermination des adaptations
    return [];
  }

  private async suggestNextInstruction(analysis: any, sessionId: string): Promise<InstructionType> {
    // Suggestion de la prochaine instruction
    return InstructionType.QUESTION;
  }

  private async calculateNewStrategy(current: any, trigger: AdaptationTrigger): Promise<AdaptationStrategy> {
    // Calcul de la nouvelle stratégie
    return {} as AdaptationStrategy;
  }
}

// 🎯 INTERFACES SUPPLÉMENTAIRES
interface AIService {
  generateInstruction(prompt: string): Promise<string>;
}

interface ContentService {
  getResourcesForContext(workshop: WorkshopType, step: number, type: InstructionType): Promise<InstructionResource[]>;
}

interface AdaptationTrigger {
  reason: string;
  severity: 'low' | 'medium' | 'high';
  data: any;
}

interface AdaptationStrategy {
  id: string;
  name: string;
  parameters: Record<string, any>;
  expectedImpact: string;
}

interface AdaptationResult {
  previousStrategy?: AdaptationStrategy;
  newStrategy: AdaptationStrategy;
  adaptationReason: string;
  expectedImpact: string;
}

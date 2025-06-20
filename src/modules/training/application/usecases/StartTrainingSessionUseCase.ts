/**
 * 🎯 CAS D'USAGE - DÉMARRER SESSION DE FORMATION
 * Use Case selon Clean Architecture - Application Layer
 * Orchestration de la logique métier pour démarrer une formation
 */

import { TrainingSession, TrainingSessionId, LearnerId, TrainingConfiguration, SectorType, DifficultyLevel, WorkshopType } from '../../domain/entities/TrainingSession';
import { Learner } from '../../domain/entities/Learner';
import { TrainingSessionRepository, LearnerRepository, ContentRepository } from '../../domain/repositories/TrainingRepository';
import { TrainingEventBus, TrainingEventFactory, TrainingEventType } from '../../infrastructure/events/TrainingEventBus';

// 🎯 COMMANDE D'ENTRÉE
export interface StartTrainingSessionCommand {
  learnerId: string;
  workshopSequence: number[];
  sectorCustomization?: SectorType;
  difficultyOverride?: DifficultyLevel;
  learningObjectives?: string[];
  estimatedDuration?: number;
  prerequisites?: string[];
  organizationId?: string;
  metadata?: Record<string, any>;
}

// 🎯 RÉSULTAT DE SORTIE
export interface StartTrainingSessionResult {
  success: boolean;
  sessionId?: string;
  session?: TrainingSession;
  errors?: string[];
  warnings?: string[];
  recommendations?: string[];
  estimatedCompletionTime?: Date;
  nextSteps?: string[];
}

// 🎯 ERREURS MÉTIER
export class TrainingSessionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'TrainingSessionError';
  }
}

export enum TrainingSessionErrorCode {
  LEARNER_NOT_FOUND = 'LEARNER_NOT_FOUND',
  LEARNER_INACTIVE = 'LEARNER_INACTIVE',
  INVALID_WORKSHOP_SEQUENCE = 'INVALID_WORKSHOP_SEQUENCE',
  PREREQUISITES_NOT_MET = 'PREREQUISITES_NOT_MET',
  ACTIVE_SESSION_EXISTS = 'ACTIVE_SESSION_EXISTS',
  CONTENT_NOT_AVAILABLE = 'CONTENT_NOT_AVAILABLE',
  CONFIGURATION_INVALID = 'CONFIGURATION_INVALID'
}

/**
 * 🎯 CAS D'USAGE PRINCIPAL
 */
export class StartTrainingSessionUseCase {
  constructor(
    private readonly sessionRepository: TrainingSessionRepository,
    private readonly learnerRepository: LearnerRepository,
    private readonly contentRepository: ContentRepository,
    private readonly eventBus: TrainingEventBus
  ) {}

  async execute(command: StartTrainingSessionCommand): Promise<StartTrainingSessionResult> {
    try {
      // 1. 🔍 VALIDATION ET RÉCUPÉRATION DU LEARNER
      const learner = await this.validateAndGetLearner(command.learnerId);
      
      // 2. 🔍 VÉRIFICATION DES SESSIONS ACTIVES
      await this.checkActiveSession(learner.id);
      
      // 3. 🎯 VALIDATION DE LA SÉQUENCE D'ATELIERS
      const validatedWorkshops = await this.validateWorkshopSequence(command.workshopSequence);
      
      // 4. 🎨 CRÉATION DE LA CONFIGURATION
      const configuration = await this.createTrainingConfiguration(command, learner);
      
      // 5. 📚 VÉRIFICATION DE LA DISPONIBILITÉ DU CONTENU
      await this.validateContentAvailability(configuration);
      
      // 6. 🎓 CRÉATION DE LA SESSION
      const session = await this.createTrainingSession(learner.id, configuration);
      
      // 7. 💾 PERSISTANCE
      await this.sessionRepository.save(session);
      
      // 8. 📡 ÉMISSION D'ÉVÉNEMENTS
      await this.emitSessionCreatedEvent(session, learner);
      
      // 9. 🎯 GÉNÉRATION DES RECOMMANDATIONS
      const recommendations = await this.generateRecommendations(session, learner);
      
      return {
        success: true,
        sessionId: session.id.value,
        session,
        recommendations,
        estimatedCompletionTime: this.calculateEstimatedCompletion(session),
        nextSteps: this.generateNextSteps(session)
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  // 🔍 VALIDATION DU LEARNER
  private async validateAndGetLearner(learnerId: string): Promise<Learner> {
    const learner = await this.learnerRepository.findById({ value: learnerId });
    
    if (!learner) {
      throw new TrainingSessionError(
        'Learner not found',
        TrainingSessionErrorCode.LEARNER_NOT_FOUND,
        { learnerId }
      );
    }

    if (!learner.isActive) {
      throw new TrainingSessionError(
        'Learner account is inactive',
        TrainingSessionErrorCode.LEARNER_INACTIVE,
        { learnerId }
      );
    }

    return learner;
  }

  // 🔍 VÉRIFICATION DES SESSIONS ACTIVES
  private async checkActiveSession(learnerId: LearnerId): Promise<void> {
    const activeSessions = await this.sessionRepository.findByLearnerId(learnerId);
    const hasActiveSession = activeSessions.some(session => session.isActive);

    if (hasActiveSession) {
      throw new TrainingSessionError(
        'Learner already has an active training session',
        TrainingSessionErrorCode.ACTIVE_SESSION_EXISTS,
        { learnerId: learnerId.value }
      );
    }
  }

  // 🎯 VALIDATION DE LA SÉQUENCE D'ATELIERS
  private async validateWorkshopSequence(workshopSequence: number[]): Promise<WorkshopType[]> {
    if (!workshopSequence || workshopSequence.length === 0) {
      throw new TrainingSessionError(
        'Workshop sequence cannot be empty',
        TrainingSessionErrorCode.INVALID_WORKSHOP_SEQUENCE
      );
    }

    const validWorkshops = [1, 2, 3, 4, 5];
    const invalidWorkshops = workshopSequence.filter(w => !validWorkshops.includes(w));

    if (invalidWorkshops.length > 0) {
      throw new TrainingSessionError(
        'Invalid workshop numbers in sequence',
        TrainingSessionErrorCode.INVALID_WORKSHOP_SEQUENCE,
        { invalidWorkshops }
      );
    }

    // Vérifier l'ordre logique (optionnel mais recommandé)
    const sortedSequence = [...workshopSequence].sort();
    if (sortedSequence[0] !== 1) {
      console.warn('Workshop sequence does not start with Workshop 1 - this may affect learning progression');
    }

    return workshopSequence as WorkshopType[];
  }

  // 🎨 CRÉATION DE LA CONFIGURATION
  private async createTrainingConfiguration(
    command: StartTrainingSessionCommand,
    learner: Learner
  ): Promise<TrainingConfiguration> {
    const sectorCustomization = command.sectorCustomization || learner.sector;
    const difficultyLevel = command.difficultyOverride || learner.recommendedDifficulty;
    
    // Calcul de la durée estimée basée sur la séquence et le niveau
    const baseDurationPerWorkshop = this.getBaseDurationPerWorkshop(difficultyLevel);
    const estimatedDuration = command.estimatedDuration || 
      (command.workshopSequence.length * baseDurationPerWorkshop);

    // Génération des objectifs d'apprentissage si non fournis
    const learningObjectives = command.learningObjectives || 
      await this.generateDefaultLearningObjectives(command.workshopSequence, sectorCustomization);

    // Génération des prérequis
    const prerequisites = command.prerequisites || 
      await this.generatePrerequisites(command.workshopSequence, difficultyLevel);

    // Critères d'évaluation basés sur le secteur et le niveau
    const assessmentCriteria = await this.generateAssessmentCriteria(
      command.workshopSequence,
      sectorCustomization,
      difficultyLevel
    );

    return {
      workshopSequence: command.workshopSequence as WorkshopType[],
      sectorCustomization,
      difficultyLevel,
      estimatedDuration,
      prerequisites,
      learningObjectives,
      assessmentCriteria
    };
  }

  // 📚 VALIDATION DE LA DISPONIBILITÉ DU CONTENU
  private async validateContentAvailability(configuration: TrainingConfiguration): Promise<void> {
    for (const workshopId of configuration.workshopSequence) {
      try {
        const content = await this.contentRepository.getWorkshopContent(
          workshopId,
          configuration.sectorCustomization,
          configuration.difficultyLevel
        );
        
        if (!content || !content.steps || content.steps.length === 0) {
          throw new TrainingSessionError(
            `Content not available for workshop ${workshopId}`,
            TrainingSessionErrorCode.CONTENT_NOT_AVAILABLE,
            { workshopId, sector: configuration.sectorCustomization, difficulty: configuration.difficultyLevel }
          );
        }
      } catch (error) {
        throw new TrainingSessionError(
          `Failed to validate content availability for workshop ${workshopId}`,
          TrainingSessionErrorCode.CONTENT_NOT_AVAILABLE,
          { workshopId, originalError: error.message }
        );
      }
    }
  }

  // 🎓 CRÉATION DE LA SESSION
  private async createTrainingSession(
    learnerId: LearnerId,
    configuration: TrainingConfiguration
  ): Promise<TrainingSession> {
    const sessionId: TrainingSessionId = {
      value: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return TrainingSession.create(sessionId, learnerId, configuration);
  }

  // 📡 ÉMISSION D'ÉVÉNEMENTS
  private async emitSessionCreatedEvent(session: TrainingSession, learner: Learner): Promise<void> {
    const event = TrainingEventFactory.createSessionEvent(
      TrainingEventType.SESSION_CREATED,
      session.id.value,
      learner.id.value,
      {
        sessionId: session.id.value,
        learnerId: learner.id.value,
        configuration: session.configuration,
        learnerProfile: {
          name: learner.name,
          organization: learner.organization,
          sector: learner.sector,
          experienceLevel: learner.experienceLevel
        }
      },
      {
        organizationId: learner.organization,
        source: 'StartTrainingSessionUseCase'
      }
    );

    await this.eventBus.emit(event);
  }

  // 🎯 GÉNÉRATION DES RECOMMANDATIONS
  private async generateRecommendations(session: TrainingSession, learner: Learner): Promise<string[]> {
    const recommendations: string[] = [];

    // Recommandations basées sur le profil de l'apprenant
    if (learner.skills.ebiosMethodology < 30) {
      recommendations.push('Nous recommandons de commencer par les ressources préparatoires EBIOS RM');
    }

    if (learner.experienceLevel === DifficultyLevel.BEGINNER) {
      recommendations.push('Prenez votre temps pour assimiler chaque concept avant de passer à l\'étape suivante');
    }

    // Recommandations basées sur la configuration
    if (session.configuration.workshopSequence.length > 3) {
      recommendations.push('Cette formation est intensive. Planifiez des pauses régulières pour optimiser l\'apprentissage');
    }

    if (session.configuration.sectorCustomization !== SectorType.GENERIC) {
      recommendations.push(`Les exemples seront adaptés au secteur ${session.configuration.sectorCustomization}`);
    }

    return recommendations;
  }

  // 🛠️ MÉTHODES UTILITAIRES
  private getBaseDurationPerWorkshop(difficulty: DifficultyLevel): number {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER: return 8; // 8 heures par atelier
      case DifficultyLevel.INTERMEDIATE: return 6;
      case DifficultyLevel.ADVANCED: return 5;
      case DifficultyLevel.EXPERT: return 4;
      default: return 6;
    }
  }

  private async generateDefaultLearningObjectives(
    workshopSequence: number[],
    sector: SectorType
  ): Promise<string[]> {
    const objectives: string[] = [];
    
    workshopSequence.forEach(workshopId => {
      switch (workshopId) {
        case 1:
          objectives.push('Maîtriser le cadrage et le socle de sécurité EBIOS RM');
          break;
        case 2:
          objectives.push('Identifier et analyser les sources de risques');
          break;
        case 3:
          objectives.push('Construire des scénarios stratégiques pertinents');
          break;
        case 4:
          objectives.push('Développer des scénarios opérationnels détaillés');
          break;
        case 5:
          objectives.push('Définir un plan de traitement des risques efficace');
          break;
      }
    });

    if (sector !== SectorType.GENERIC) {
      objectives.push(`Appliquer la méthodologie EBIOS RM au contexte spécifique du secteur ${sector}`);
    }

    return objectives;
  }

  private async generatePrerequisites(
    workshopSequence: number[],
    difficulty: DifficultyLevel
  ): Promise<string[]> {
    const prerequisites: string[] = [];

    if (difficulty === DifficultyLevel.BEGINNER) {
      prerequisites.push('Notions de base en cybersécurité');
      prerequisites.push('Compréhension des enjeux de sécurité informatique');
    } else {
      prerequisites.push('Expérience en gestion des risques cybersécurité');
      prerequisites.push('Connaissance des référentiels de sécurité (ISO 27001, NIST, etc.)');
    }

    if (workshopSequence.includes(4) || workshopSequence.includes(5)) {
      prerequisites.push('Compréhension des architectures techniques');
    }

    return prerequisites;
  }

  private async generateAssessmentCriteria(
    workshopSequence: number[],
    sector: SectorType,
    difficulty: DifficultyLevel
  ): Promise<any[]> {
    // Implémentation simplifiée - à développer selon les besoins
    return [
      {
        id: 'methodology_understanding',
        name: 'Compréhension méthodologique',
        description: 'Maîtrise des concepts EBIOS RM',
        weight: 0.4,
        minimumScore: 70,
        evaluationType: 'ai_assisted'
      },
      {
        id: 'practical_application',
        name: 'Application pratique',
        description: 'Capacité à appliquer la méthode',
        weight: 0.4,
        minimumScore: 75,
        evaluationType: 'ai_assisted'
      },
      {
        id: 'sector_adaptation',
        name: 'Adaptation sectorielle',
        description: 'Adaptation au contexte métier',
        weight: 0.2,
        minimumScore: 65,
        evaluationType: 'automatic'
      }
    ];
  }

  private calculateEstimatedCompletion(session: TrainingSession): Date {
    const estimatedHours = session.configuration.estimatedDuration;
    const hoursPerDay = 2; // Estimation de 2h de formation par jour
    const daysToComplete = Math.ceil(estimatedHours / hoursPerDay);
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToComplete);
    
    return completionDate;
  }

  private generateNextSteps(session: TrainingSession): string[] {
    return [
      'Consultez le plan de formation personnalisé',
      'Commencez par l\'atelier 1 : Cadrage et Socle de Sécurité',
      'Préparez vos documents organisationnels pour les exercices pratiques',
      'Planifiez vos sessions de formation selon votre rythme'
    ];
  }

  private handleError(error: any): StartTrainingSessionResult {
    if (error instanceof TrainingSessionError) {
      return {
        success: false,
        errors: [error.message]
      };
    }

    console.error('Unexpected error in StartTrainingSessionUseCase:', error);
    return {
      success: false,
      errors: ['An unexpected error occurred while starting the training session']
    };
  }
}

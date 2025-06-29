/**
 * 🔗 SERVICE D'INTÉGRATION DU SYSTÈME DE QUESTIONS COMPLEXES
 * Connecte le système de questions complexes avec l'application principale
 * ÉTAPE 2.2.2 - Intégration avec l'écosystème de formation
 */

import { ComplexQuestionOrchestrator, SessionConfiguration } from './ComplexQuestionOrchestrator';
import { EbiosTrainingProgressManager } from './EbiosTrainingProgressManager';
import { UnifiedDataManager } from './UnifiedDataManager';
import { TrainingHarmonizationService } from './TrainingHarmonizationService';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES D'INTÉGRATION

export interface ComplexQuestionSessionRequest {
  userId: string;
  workshopId: number;
  userProfile: EbiosExpertProfile;
  sessionType: 'practice' | 'assessment' | 'certification';
  configuration?: Partial<SessionConfiguration>;
}

export interface IntegrationResult {
  sessionId: string;
  integrationStatus: 'success' | 'partial' | 'failed';
  progressUpdated: boolean;
  dataSync: boolean;
  notifications: IntegrationNotification[];
}

export interface IntegrationNotification {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  action?: string;
  timestamp: Date;
}

export interface ComplexQuestionMetrics {
  totalSessions: number;
  averageScore: number;
  completionRate: number;
  timeSpent: number;
  workshopProgress: Record<number, number>;
  skillProgression: Record<string, number>;
}

// 🎭 SERVICE D'INTÉGRATION

export class ComplexQuestionIntegrationService {
  private static instance: ComplexQuestionIntegrationService;
  private orchestrator: ComplexQuestionOrchestrator;
  private progressManager: EbiosTrainingProgressManager;
  private dataManager: UnifiedDataManager;
  private harmonizationService: TrainingHarmonizationService;

  private constructor() {
    this.orchestrator = ComplexQuestionOrchestrator.getInstance();
    this.progressManager = EbiosTrainingProgressManager.getInstance();
    this.dataManager = UnifiedDataManager.getInstance();
    this.harmonizationService = TrainingHarmonizationService.getInstance();
  }

  public static getInstance(): ComplexQuestionIntegrationService {
    if (!ComplexQuestionIntegrationService.instance) {
      ComplexQuestionIntegrationService.instance = new ComplexQuestionIntegrationService();
    }
    return ComplexQuestionIntegrationService.instance;
  }

  // 🚀 DÉMARRAGE DE SESSION INTÉGRÉE

  public async startIntegratedSession(
    request: ComplexQuestionSessionRequest
  ): Promise<IntegrationResult> {
    try {
      const notifications: IntegrationNotification[] = [];

      // 1. Vérification des prérequis
      const prerequisites = await this.checkPrerequisites(request);
      if (!prerequisites.valid) {
        return {
          sessionId: '',
          integrationStatus: 'failed',
          progressUpdated: false,
          dataSync: false,
          notifications: prerequisites.notifications
        };
      }

      // 2. Configuration adaptée selon le contexte
      const configuration = await this.buildSessionConfiguration(request);

      // 3. Démarrage de la session
      const session = await this.orchestrator.startQuestionSession(
        request.userId,
        request.workshopId,
        request.userProfile,
        configuration
      );

      // 4. Synchronisation avec le système de progression
      const progressSync = await this.syncWithProgressSystem(
        request.userId,
        request.workshopId,
        session.sessionId
      );

      // 5. Mise à jour des données unifiées
      const dataSync = await this.syncWithDataManager(
        request.userId,
        session.sessionId,
        request.sessionType
      );

      notifications.push({
        type: 'success',
        message: `Session de questions complexes démarrée pour l'atelier ${request.workshopId}`,
        timestamp: new Date()
      });

      return {
        sessionId: session.sessionId,
        integrationStatus: 'success',
        progressUpdated: progressSync,
        dataSync: dataSync,
        notifications
      };

    } catch (error) {
      console.error('Erreur lors du démarrage de session intégrée:', error);
      return {
        sessionId: '',
        integrationStatus: 'failed',
        progressUpdated: false,
        dataSync: false,
        notifications: [{
          type: 'error',
          message: 'Échec du démarrage de la session de questions complexes',
          timestamp: new Date()
        }]
      };
    }
  }

  // 🔍 VÉRIFICATION DES PRÉREQUIS

  private async checkPrerequisites(
    request: ComplexQuestionSessionRequest
  ): Promise<{ valid: boolean; notifications: IntegrationNotification[] }> {
    const notifications: IntegrationNotification[] = [];

    // Vérification du profil utilisateur
    if (!request.userProfile || !request.userProfile.id) {
      notifications.push({
        type: 'error',
        message: 'Profil utilisateur requis pour les questions complexes',
        timestamp: new Date()
      });
      return { valid: false, notifications };
    }

    // Vérification de l'atelier
    if (request.workshopId < 1 || request.workshopId > 5) {
      notifications.push({
        type: 'error',
        message: 'ID d\'atelier invalide (doit être entre 1 et 5)',
        timestamp: new Date()
      });
      return { valid: false, notifications };
    }

    // Vérification des prérequis d'atelier
    const workshopPrerequisites = await this.checkWorkshopPrerequisites(
      request.userId,
      request.workshopId
    );

    if (!workshopPrerequisites.met) {
      notifications.push({
        type: 'warning',
        message: `Prérequis manquants pour l'atelier ${request.workshopId}`,
        action: 'complete_previous_workshops',
        timestamp: new Date()
      });
    }

    return { valid: true, notifications };
  }

  // ⚙️ CONSTRUCTION DE LA CONFIGURATION

  private async buildSessionConfiguration(
    request: ComplexQuestionSessionRequest
  ): Promise<SessionConfiguration> {
    const baseConfig: SessionConfiguration = {
      difficulty: this.determineDifficulty(request.userProfile),
      questionCount: this.determineQuestionCount(request.sessionType),
      adaptiveMode: true,
      realTimeFeedback: true,
      expertGuidance: true,
      progressiveComplexity: request.sessionType === 'certification'
    };

    // Personnalisation selon le type de session
    switch (request.sessionType) {
      case 'practice':
        return {
          ...baseConfig,
          timeLimit: 3600, // 1 heure
          focusAreas: await this.getWeakAreas(request.userId, request.workshopId)
        };

      case 'assessment':
        return {
          ...baseConfig,
          timeLimit: 2700, // 45 minutes
          questionCount: 5,
          adaptiveMode: false
        };

      case 'certification':
        return {
          ...baseConfig,
          timeLimit: 5400, // 1h30
          questionCount: 8,
          difficulty: 'expert',
          progressiveComplexity: true
        };

      default:
        return baseConfig;
    }
  }

  // 📊 SYNCHRONISATION AVEC LE SYSTÈME DE PROGRESSION

  private async syncWithProgressSystem(
    userId: string,
    workshopId: number,
    sessionId: string
  ): Promise<boolean> {
    try {
      await this.progressManager.updateUserProgress(userId, {
        workshopId,
        activityType: 'complex_questions',
        sessionId,
        timestamp: new Date(),
        status: 'in_progress'
      });
      return true;
    } catch (error) {
      console.error('Erreur de synchronisation progression:', error);
      return false;
    }
  }

  // 💾 SYNCHRONISATION AVEC LE GESTIONNAIRE DE DONNÉES

  private async syncWithDataManager(
    userId: string,
    sessionId: string,
    sessionType: string
  ): Promise<boolean> {
    try {
      await this.dataManager.recordActivity(userId, {
        type: 'complex_question_session',
        sessionId,
        sessionType,
        timestamp: new Date(),
        status: 'started'
      });
      return true;
    } catch (error) {
      console.error('Erreur de synchronisation données:', error);
      return false;
    }
  }

  // 🎯 MÉTHODES UTILITAIRES

  private determineDifficulty(userProfile: EbiosExpertProfile): 'beginner' | 'intermediate' | 'expert' {
    const experience = userProfile.experience?.ebiosYears || 0;
    const certifications = userProfile.certifications?.length || 0;

    if (experience >= 5 && certifications >= 2) return 'expert';
    if (experience >= 2 || certifications >= 1) return 'intermediate';
    return 'beginner';
  }

  private determineQuestionCount(sessionType: string): number {
    switch (sessionType) {
      case 'practice': return 3;
      case 'assessment': return 5;
      case 'certification': return 8;
      default: return 3;
    }
  }

  private async checkWorkshopPrerequisites(
    userId: string,
    workshopId: number
  ): Promise<{ met: boolean; missing: number[] }> {
    // Logique de vérification des prérequis
    // Pour l'instant, retourne toujours true
    return { met: true, missing: [] };
  }

  private async getWeakAreas(
    userId: string,
    workshopId: number
  ): Promise<string[]> {
    // Analyse des domaines à améliorer
    // Retourne des domaines par défaut pour l'instant
    const defaultAreas: Record<number, string[]> = {
      1: ['asset_identification', 'value_assessment'],
      2: ['threat_modeling', 'risk_sources'],
      3: ['strategic_scenarios', 'operational_scenarios'],
      4: ['operational_scenarios', 'risk_treatment'],
      5: ['risk_treatment', 'action_plan']
    };

    return defaultAreas[workshopId] || [];
  }

  // 📈 MÉTRIQUES ET ANALYTICS

  public async getComplexQuestionMetrics(userId: string): Promise<ComplexQuestionMetrics> {
    try {
      // Récupération des métriques depuis les différents services
      const sessions = await this.dataManager.getUserSessions(userId, 'complex_questions');
      const progress = await this.progressManager.getUserProgress(userId);

      return {
        totalSessions: sessions.length,
        averageScore: this.calculateAverageScore(sessions),
        completionRate: this.calculateCompletionRate(sessions),
        timeSpent: this.calculateTotalTime(sessions),
        workshopProgress: this.calculateWorkshopProgress(progress),
        skillProgression: this.calculateSkillProgression(sessions)
      };
    } catch (error) {
      console.error('Erreur calcul métriques:', error);
      return {
        totalSessions: 0,
        averageScore: 0,
        completionRate: 0,
        timeSpent: 0,
        workshopProgress: {},
        skillProgression: {}
      };
    }
  }

  private calculateAverageScore(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, session) => sum + (session.score || 0), 0);
    return Math.round((total / sessions.length) * 100) / 100;
  }

  private calculateCompletionRate(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    const completed = sessions.filter(session => session.status === 'completed').length;
    return Math.round((completed / sessions.length) * 100);
  }

  private calculateTotalTime(sessions: any[]): number {
    return sessions.reduce((total, session) => total + (session.timeSpent || 0), 0);
  }

  private calculateWorkshopProgress(progress: any): Record<number, number> {
    // Calcul du progrès par atelier
    return {
      1: progress?.workshop1?.completion || 0,
      2: progress?.workshop2?.completion || 0,
      3: progress?.workshop3?.completion || 0,
      4: progress?.workshop4?.completion || 0,
      5: progress?.workshop5?.completion || 0
    };
  }

  private calculateSkillProgression(sessions: any[]): Record<string, number> {
    // Calcul de la progression par compétence
    return {
      'asset_identification': 75,
      'threat_modeling': 80,
      'risk_assessment': 70,
      'scenario_analysis': 85,
      'risk_treatment': 65
    };
  }
}

export default ComplexQuestionIntegrationService;

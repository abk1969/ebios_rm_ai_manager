/**
 * 🔗 INTÉGRATION NOTIFICATIONS EBIOS RM
 * Service d'intégration pour connecter automatiquement les événements aux notifications
 */

import { ebiosNotificationGenerator } from './EbiosNotificationGenerator';

// 🎯 TYPES D'ÉVÉNEMENTS EBIOS RM
export interface EbiosWorkshopEvent {
  type: 'workshop_completed' | 'workshop_validation_error' | 'workshop_started';
  workshopId: number;
  missionId: string;
  userId: string;
  data: {
    score?: number;
    nextWorkshop?: number;
    errorMessage?: string;
    stepId?: string;
    stepName?: string;
  };
  timestamp: string;
}

export interface EbiosReportEvent {
  type: 'report_generated' | 'report_generation_error' | 'report_shared';
  reportId: string;
  missionId: string;
  userId: string;
  data: {
    reportName: string;
    downloadUrl?: string;
    viewUrl?: string;
    errorMessage?: string;
    sharedBy?: string;
    pageCount?: number;
  };
  timestamp: string;
}

export interface EbiosMissionEvent {
  type: 'mission_validation_required' | 'mission_completed' | 'data_inconsistency_detected';
  missionId: string;
  userId: string;
  data: {
    missionName: string;
    location?: string;
    workshopId?: number;
    severity?: 'low' | 'medium' | 'high';
  };
  timestamp: string;
}

export interface EbiosCollaborationEvent {
  type: 'comment_added' | 'team_invitation' | 'review_requested';
  missionId: string;
  userId: string;
  data: {
    authorName?: string;
    authorId?: string;
    location?: string;
    missionName?: string;
    commentId?: string;
    inviterName?: string;
    requesterName?: string;
  };
  timestamp: string;
}

export interface EbiosAchievementEvent {
  type: 'first_workshop_completed' | 'perfect_score_achieved' | 'expert_level_reached';
  userId: string;
  data: {
    workshopId?: number;
    missionId?: string;
    score?: number;
    level?: string;
  };
  timestamp: string;
}

export type EbiosEvent = 
  | EbiosWorkshopEvent 
  | EbiosReportEvent 
  | EbiosMissionEvent 
  | EbiosCollaborationEvent 
  | EbiosAchievementEvent;

/**
 * 🔗 SERVICE D'INTÉGRATION PRINCIPAL
 */
export class EbiosNotificationIntegration {
  private static instance: EbiosNotificationIntegration | null = null;
  private eventListeners: Map<string, (event: EbiosEvent) => void> = new Map();

  public static getInstance(): EbiosNotificationIntegration {
    if (!EbiosNotificationIntegration.instance) {
      EbiosNotificationIntegration.instance = new EbiosNotificationIntegration();
    }
    return EbiosNotificationIntegration.instance;
  }

  // 🚀 INITIALISATION
  public initialize(): void {
    console.log('🔗 Initialisation EbiosNotificationIntegration...');
    
    // Écouter les événements du système EBIOS RM
    this.setupEventListeners();
    
    console.log('✅ EbiosNotificationIntegration initialisé');
  }

  // 📡 TRAITEMENT DES ÉVÉNEMENTS
  public async handleEvent(event: EbiosEvent): Promise<void> {
    try {
      console.log(`🔗 Traitement événement EBIOS: ${event.type}`, event);

      switch (event.type) {
        // 🎓 ÉVÉNEMENTS FORMATION
        case 'workshop_completed':
          await this.handleWorkshopCompleted(event as EbiosWorkshopEvent);
          break;
        
        case 'workshop_validation_error':
          await this.handleWorkshopValidationError(event as EbiosWorkshopEvent);
          break;

        // 📊 ÉVÉNEMENTS RAPPORTS
        case 'report_generated':
          await this.handleReportGenerated(event as EbiosReportEvent);
          break;
        
        case 'report_generation_error':
          await this.handleReportGenerationError(event as EbiosReportEvent);
          break;

        // 🎯 ÉVÉNEMENTS MISSION
        case 'mission_validation_required':
          await this.handleMissionValidationRequired(event as EbiosMissionEvent);
          break;
        
        case 'data_inconsistency_detected':
          await this.handleDataInconsistencyDetected(event as EbiosMissionEvent);
          break;

        // 👥 ÉVÉNEMENTS COLLABORATION
        case 'comment_added':
          await this.handleCommentAdded(event as EbiosCollaborationEvent);
          break;

        // 🏆 ÉVÉNEMENTS ACHIEVEMENTS
        case 'first_workshop_completed':
          await this.handleFirstWorkshopCompleted(event as EbiosAchievementEvent);
          break;
        
        case 'perfect_score_achieved':
          await this.handlePerfectScoreAchieved(event as EbiosAchievementEvent);
          break;

        default:
          console.warn(`⚠️ Type d'événement non géré: ${event.type}`);
      }

      // Notifier les listeners
      this.notifyEventListeners(event);

    } catch (error) {
      console.error(`❌ Erreur traitement événement ${event.type}:`, error);
    }
  }

  // 🎓 GESTIONNAIRES D'ÉVÉNEMENTS FORMATION
  private async handleWorkshopCompleted(event: EbiosWorkshopEvent): Promise<void> {
    const { workshopId, missionId, data } = event;
    const { score = 0, nextWorkshop } = data;

    await ebiosNotificationGenerator.notifyWorkshopCompleted(
      workshopId,
      score,
      missionId,
      nextWorkshop
    );

    // Vérifier si c'est le premier atelier
    if (workshopId === 1) {
      await this.handleEvent({
        type: 'first_workshop_completed',
        userId: event.userId,
        data: { workshopId, missionId },
        timestamp: event.timestamp
      } as EbiosAchievementEvent);
    }

    // Vérifier si c'est un score parfait
    if (score === 100) {
      await this.handleEvent({
        type: 'perfect_score_achieved',
        userId: event.userId,
        data: { workshopId, missionId, score },
        timestamp: event.timestamp
      } as EbiosAchievementEvent);
    }
  }

  private async handleWorkshopValidationError(event: EbiosWorkshopEvent): Promise<void> {
    const { workshopId, missionId, data } = event;
    const { errorMessage = 'Erreur de validation', stepId = 'unknown', stepName } = data;

    await ebiosNotificationGenerator.notifyWorkshopValidationError(
      workshopId,
      stepId,
      errorMessage,
      missionId,
      stepName
    );
  }

  // 📊 GESTIONNAIRES D'ÉVÉNEMENTS RAPPORTS
  private async handleReportGenerated(event: EbiosReportEvent): Promise<void> {
    const { reportId, missionId, data } = event;
    const { 
      reportName, 
      downloadUrl = `/api/reports/${reportId}/download`, 
      viewUrl = `/reports/${reportId}`,
      pageCount 
    } = data;

    await ebiosNotificationGenerator.notifyReportGenerated(
      reportName,
      reportId,
      missionId,
      downloadUrl,
      viewUrl,
      pageCount
    );
  }

  private async handleReportGenerationError(event: EbiosReportEvent): Promise<void> {
    const { reportId, missionId, data } = event;
    const { 
      reportName, 
      errorMessage = 'Erreur inconnue',
    } = data;

    await ebiosNotificationGenerator.notifyReportGenerationError(
      reportName,
      reportId,
      missionId,
      errorMessage,
      `/reports/${reportId}/retry`
    );
  }

  // 🎯 GESTIONNAIRES D'ÉVÉNEMENTS MISSION
  private async handleMissionValidationRequired(event: EbiosMissionEvent): Promise<void> {
    const { missionId, data } = event;
    const { missionName } = data;

    await ebiosNotificationGenerator.notifyMissionValidationRequired(
      missionName,
      missionId
    );
  }

  private async handleDataInconsistencyDetected(event: EbiosMissionEvent): Promise<void> {
    const { missionId, data } = event;
    const { missionName, location = 'Données', workshopId } = data;

    await ebiosNotificationGenerator.notifyDataInconsistency(
      missionName,
      missionId,
      location,
      workshopId
    );
  }

  // 👥 GESTIONNAIRES D'ÉVÉNEMENTS COLLABORATION
  private async handleCommentAdded(event: EbiosCollaborationEvent): Promise<void> {
    const { missionId, data } = event;
    const { 
      authorName = 'Utilisateur', 
      authorId = 'unknown',
      location = 'Mission',
      missionName = 'Mission',
      commentId = 'unknown'
    } = data;

    await ebiosNotificationGenerator.notifyNewComment(
      authorName,
      authorId,
      location,
      missionName,
      missionId,
      commentId
    );
  }

  // 🏆 GESTIONNAIRES D'ÉVÉNEMENTS ACHIEVEMENTS
  private async handleFirstWorkshopCompleted(event: EbiosAchievementEvent): Promise<void> {
    const { data } = event;
    const { workshopId = 1 } = data;

    await ebiosNotificationGenerator.notifyFirstWorkshopCompleted(workshopId);
  }

  private async handlePerfectScoreAchieved(event: EbiosAchievementEvent): Promise<void> {
    const { data } = event;
    const { workshopId = 1, missionId = 'unknown' } = data;

    await ebiosNotificationGenerator.notifyPerfectScore(workshopId, missionId);
  }

  // 🔧 MÉTHODES UTILITAIRES
  private setupEventListeners(): void {
    // Ici on pourrait s'abonner aux événements du système EBIOS RM
    // Par exemple, écouter les événements WebSocket, les changements d'état, etc.
    
    // Exemple d'intégration avec le système de synchronisation existant
    if (typeof window !== 'undefined') {
      window.addEventListener('ebios-event', (event: any) => {
        this.handleEvent(event.detail);
      });
    }
  }

  private notifyEventListeners(event: EbiosEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('❌ Erreur listener événement:', error);
      }
    });
  }

  // 📡 API PUBLIQUE POUR L'INTÉGRATION
  public addEventListener(id: string, listener: (event: EbiosEvent) => void): void {
    this.eventListeners.set(id, listener);
  }

  public removeEventListener(id: string): void {
    this.eventListeners.delete(id);
  }

  // 🚀 MÉTHODES POUR ÉMETTRE DES ÉVÉNEMENTS (à utiliser depuis l'application)
  public emitWorkshopCompleted(
    workshopId: number, 
    missionId: string, 
    userId: string, 
    score: number, 
    nextWorkshop?: number
  ): void {
    this.handleEvent({
      type: 'workshop_completed',
      workshopId,
      missionId,
      userId,
      data: { score, nextWorkshop },
      timestamp: new Date().toISOString()
    });
  }

  public emitWorkshopValidationError(
    workshopId: number,
    missionId: string,
    userId: string,
    stepId: string,
    errorMessage: string,
    stepName?: string
  ): void {
    this.handleEvent({
      type: 'workshop_validation_error',
      workshopId,
      missionId,
      userId,
      data: { stepId, errorMessage, stepName },
      timestamp: new Date().toISOString()
    });
  }

  public emitReportGenerated(
    reportId: string,
    missionId: string,
    userId: string,
    reportName: string,
    downloadUrl: string,
    viewUrl: string,
    pageCount?: number
  ): void {
    this.handleEvent({
      type: 'report_generated',
      reportId,
      missionId,
      userId,
      data: { reportName, downloadUrl, viewUrl, pageCount },
      timestamp: new Date().toISOString()
    });
  }

  public emitMissionValidationRequired(
    missionId: string,
    userId: string,
    missionName: string
  ): void {
    this.handleEvent({
      type: 'mission_validation_required',
      missionId,
      userId,
      data: { missionName },
      timestamp: new Date().toISOString()
    });
  }

  public emitDataInconsistency(
    missionId: string,
    userId: string,
    missionName: string,
    location: string,
    workshopId?: number,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): void {
    this.handleEvent({
      type: 'data_inconsistency_detected',
      missionId,
      userId,
      data: { missionName, location, workshopId, severity },
      timestamp: new Date().toISOString()
    });
  }

  public emitCommentAdded(
    missionId: string,
    userId: string,
    authorName: string,
    authorId: string,
    location: string,
    missionName: string,
    commentId: string
  ): void {
    this.handleEvent({
      type: 'comment_added',
      missionId,
      userId,
      data: { authorName, authorId, location, missionName, commentId },
      timestamp: new Date().toISOString()
    });
  }
}

// 🎯 INSTANCE GLOBALE
export const ebiosNotificationIntegration = EbiosNotificationIntegration.getInstance();

export default EbiosNotificationIntegration;

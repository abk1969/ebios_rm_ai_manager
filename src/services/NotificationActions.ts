/**
 * ⚡ SERVICE D'ACTIONS POUR NOTIFICATIONS
 * Gestion des actions rapides et contextuelles dans les notifications
 */

import type { NotificationAction, NotificationContext } from '../types/notifications';
import { notificationNavigation } from './NotificationNavigation';
import { notificationAnalytics } from './NotificationAnalytics';

// 🎯 TYPES POUR LES ACTIONS
export interface ActionResult {
  success: boolean;
  message?: string;
  data?: any;
  redirectUrl?: string;
  requiresConfirmation?: boolean;
}

export interface ActionContext {
  notificationId: string;
  userId: string;
  sessionId?: string;
  notificationContext: NotificationContext;
  metadata?: Record<string, any>;
}

export interface ActionHandler {
  id: string;
  name: string;
  description: string;
  handler: (context: ActionContext) => Promise<ActionResult>;
  requiresAuth?: boolean;
  requiresConfirmation?: boolean;
  icon?: string;
  category: 'navigation' | 'data' | 'communication' | 'system';
}

/**
 * ⚡ SERVICE D'ACTIONS PRINCIPAL
 */
export class NotificationActions {
  private static instance: NotificationActions | null = null;
  private actionHandlers = new Map<string, ActionHandler>();
  private actionHistory: Array<{
    actionId: string;
    notificationId: string;
    userId: string;
    timestamp: string;
    result: ActionResult;
  }> = [];

  public static getInstance(): NotificationActions {
    if (!NotificationActions.instance) {
      NotificationActions.instance = new NotificationActions();
    }
    return NotificationActions.instance;
  }

  // 🚀 INITIALISATION
  public initialize(): void {
    console.log('⚡ Initialisation NotificationActions...');
    this.registerDefaultActions();
    console.log('✅ NotificationActions initialisé');
  }

  // 📋 ENREGISTREMENT DES ACTIONS PAR DÉFAUT
  private registerDefaultActions(): void {
    // Actions de navigation
    this.registerAction({
      id: 'navigate_to_workshop',
      name: 'Aller à l\'atelier',
      description: 'Naviguer vers l\'atelier spécifié',
      category: 'navigation',
      icon: '🎯',
      handler: async (context) => this.handleNavigateToWorkshop(context)
    });

    this.registerAction({
      id: 'navigate_to_mission',
      name: 'Voir la mission',
      description: 'Ouvrir la page de la mission',
      category: 'navigation',
      icon: '📋',
      handler: async (context) => this.handleNavigateToMission(context)
    });

    this.registerAction({
      id: 'navigate_to_results',
      name: 'Voir les résultats',
      description: 'Afficher les résultats détaillés',
      category: 'navigation',
      icon: '📊',
      handler: async (context) => this.handleNavigateToResults(context)
    });

    // Actions de données
    this.registerAction({
      id: 'download_report',
      name: 'Télécharger',
      description: 'Télécharger le rapport PDF',
      category: 'data',
      icon: '⬇️',
      handler: async (context) => this.handleDownloadReport(context)
    });

    this.registerAction({
      id: 'share_report',
      name: 'Partager',
      description: 'Partager le rapport avec l\'équipe',
      category: 'data',
      icon: '📤',
      handler: async (context) => this.handleShareReport(context)
    });

    this.registerAction({
      id: 'fix_validation_error',
      name: 'Corriger',
      description: 'Corriger l\'erreur de validation',
      category: 'data',
      icon: '🔧',
      handler: async (context) => this.handleFixValidationError(context)
    });

    // Actions de communication
    this.registerAction({
      id: 'reply_to_comment',
      name: 'Répondre',
      description: 'Répondre au commentaire',
      category: 'communication',
      icon: '↩️',
      handler: async (context) => this.handleReplyToComment(context)
    });

    this.registerAction({
      id: 'accept_invitation',
      name: 'Accepter',
      description: 'Accepter l\'invitation à l\'équipe',
      category: 'communication',
      icon: '✅',
      requiresConfirmation: true,
      handler: async (context) => this.handleAcceptInvitation(context)
    });

    this.registerAction({
      id: 'decline_invitation',
      name: 'Décliner',
      description: 'Décliner l\'invitation à l\'équipe',
      category: 'communication',
      icon: '❌',
      requiresConfirmation: true,
      handler: async (context) => this.handleDeclineInvitation(context)
    });

    // Actions système
    this.registerAction({
      id: 'retry_sync',
      name: 'Réessayer',
      description: 'Relancer la synchronisation',
      category: 'system',
      icon: '🔄',
      handler: async (context) => this.handleRetrySync(context)
    });

    this.registerAction({
      id: 'dismiss_notification',
      name: 'Ignorer',
      description: 'Marquer la notification comme ignorée',
      category: 'system',
      icon: '🚫',
      handler: async (context) => this.handleDismissNotification(context)
    });

    this.registerAction({
      id: 'schedule_later',
      name: 'Plus tard',
      description: 'Reporter cette action à plus tard',
      category: 'system',
      icon: '⏰',
      handler: async (context) => this.handleScheduleLater(context)
    });
  }

  // 📝 ENREGISTRER UNE ACTION
  public registerAction(action: ActionHandler): void {
    this.actionHandlers.set(action.id, action);
  }

  // ⚡ EXÉCUTER UNE ACTION
  public async executeAction(
    actionId: string,
    context: ActionContext
  ): Promise<ActionResult> {
    try {
      console.log(`⚡ Exécution action: ${actionId}`, context);

      const handler = this.actionHandlers.get(actionId);
      if (!handler) {
        return {
          success: false,
          message: `Action non trouvée: ${actionId}`
        };
      }

      // Vérifier l'authentification si requise
      if (handler.requiresAuth && !context.userId) {
        return {
          success: false,
          message: 'Authentification requise'
        };
      }

      // Exécuter l'action
      const result = await handler.handler(context);

      // Enregistrer dans l'historique
      this.actionHistory.push({
        actionId,
        notificationId: context.notificationId,
        userId: context.userId,
        timestamp: new Date().toISOString(),
        result
      });

      // Tracker l'analytics
      notificationAnalytics.trackActionPerformed(
        context.notificationId,
        actionId,
        context.userId
      );

      console.log(`✅ Action exécutée avec succès: ${actionId}`, result);
      return result;

    } catch (error) {
      console.error(`❌ Erreur exécution action ${actionId}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  // 🎯 GESTIONNAIRES D'ACTIONS SPÉCIFIQUES

  // Navigation vers atelier
  private async handleNavigateToWorkshop(context: ActionContext): Promise<ActionResult> {
    const { workshopId, missionId } = context.notificationContext;
    
    if (!workshopId || !missionId) {
      return {
        success: false,
        message: 'Informations d\'atelier manquantes'
      };
    }

    const success = await notificationNavigation.navigateToNotification(
      context.notificationId,
      context.notificationContext,
      true
    );

    return {
      success,
      message: success ? 'Navigation vers l\'atelier' : 'Erreur de navigation',
      redirectUrl: success ? `/missions/${missionId}/workshops/${workshopId}` : undefined
    };
  }

  // Navigation vers mission
  private async handleNavigateToMission(context: ActionContext): Promise<ActionResult> {
    const { missionId } = context.notificationContext;
    
    if (!missionId) {
      return {
        success: false,
        message: 'ID de mission manquant'
      };
    }

    const success = await notificationNavigation.navigateToNotification(
      context.notificationId,
      { ...context.notificationContext, metadata: { action: 'view' } },
      true
    );

    return {
      success,
      message: success ? 'Navigation vers la mission' : 'Erreur de navigation',
      redirectUrl: success ? `/missions/${missionId}` : undefined
    };
  }

  // Navigation vers résultats
  private async handleNavigateToResults(context: ActionContext): Promise<ActionResult> {
    const { workshopId, missionId } = context.notificationContext;
    
    if (!workshopId || !missionId) {
      return {
        success: false,
        message: 'Informations de résultats manquantes'
      };
    }

    const success = await notificationNavigation.navigateToNotification(
      context.notificationId,
      { ...context.notificationContext, metadata: { showResults: true } },
      true
    );

    return {
      success,
      message: success ? 'Navigation vers les résultats' : 'Erreur de navigation',
      redirectUrl: success ? `/missions/${missionId}/workshops/${workshopId}/results` : undefined
    };
  }

  // Téléchargement de rapport
  private async handleDownloadReport(context: ActionContext): Promise<ActionResult> {
    const { reportId } = context.notificationContext;
    
    if (!reportId) {
      return {
        success: false,
        message: 'ID de rapport manquant'
      };
    }

    try {
      // Simuler le téléchargement
      const downloadUrl = `/api/reports/${reportId}/download`;
      
      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `rapport_${reportId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return {
        success: true,
        message: 'Téléchargement du rapport démarré'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du téléchargement'
      };
    }
  }

  // Partage de rapport
  private async handleShareReport(context: ActionContext): Promise<ActionResult> {
    const { reportId, missionId } = context.notificationContext;
    
    if (!reportId) {
      return {
        success: false,
        message: 'ID de rapport manquant'
      };
    }

    const success = await notificationNavigation.navigateToNotification(
      context.notificationId,
      { ...context.notificationContext, metadata: { action: 'share' } },
      true
    );

    return {
      success,
      message: success ? 'Ouverture interface de partage' : 'Erreur ouverture partage',
      redirectUrl: success ? `/reports/${reportId}/share` : undefined
    };
  }

  // Correction d'erreur de validation
  private async handleFixValidationError(context: ActionContext): Promise<ActionResult> {
    const { workshopId, missionId, stepId } = context.notificationContext;
    
    if (!workshopId || !missionId) {
      return {
        success: false,
        message: 'Informations d\'erreur manquantes'
      };
    }

    const success = await notificationNavigation.navigateToNotification(
      context.notificationId,
      { 
        ...context.notificationContext, 
        metadata: { showValidation: true, autoFocus: stepId }
      },
      true
    );

    return {
      success,
      message: success ? 'Navigation vers la correction' : 'Erreur de navigation',
      redirectUrl: success ? `/missions/${missionId}/workshops/${workshopId}?step=${stepId}` : undefined
    };
  }

  // Réponse à commentaire
  private async handleReplyToComment(context: ActionContext): Promise<ActionResult> {
    const { missionId } = context.notificationContext;
    const commentId = context.metadata?.commentId;
    
    if (!missionId || !commentId) {
      return {
        success: false,
        message: 'Informations de commentaire manquantes'
      };
    }

    const success = await notificationNavigation.navigateToNotification(
      context.notificationId,
      { 
        ...context.notificationContext, 
        metadata: { showComments: true, replyTo: commentId }
      },
      true
    );

    return {
      success,
      message: success ? 'Ouverture interface de réponse' : 'Erreur ouverture réponse',
      redirectUrl: success ? `/missions/${missionId}/comments#reply-${commentId}` : undefined
    };
  }

  // Accepter invitation
  private async handleAcceptInvitation(context: ActionContext): Promise<ActionResult> {
    const { missionId } = context.notificationContext;
    const invitationId = context.metadata?.invitationId;
    
    if (!missionId || !invitationId) {
      return {
        success: false,
        message: 'Informations d\'invitation manquantes'
      };
    }

    try {
      // Simuler l'acceptation de l'invitation
      // Dans un vrai système, cela ferait un appel API
      console.log(`Acceptation invitation ${invitationId} pour mission ${missionId}`);

      return {
        success: true,
        message: 'Invitation acceptée avec succès',
        redirectUrl: `/missions/${missionId}/team`
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de l\'acceptation'
      };
    }
  }

  // Décliner invitation
  private async handleDeclineInvitation(context: ActionContext): Promise<ActionResult> {
    const invitationId = context.metadata?.invitationId;
    
    if (!invitationId) {
      return {
        success: false,
        message: 'ID d\'invitation manquant'
      };
    }

    try {
      // Simuler le déclin de l'invitation
      console.log(`Déclin invitation ${invitationId}`);

      return {
        success: true,
        message: 'Invitation déclinée'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du déclin'
      };
    }
  }

  // Retry synchronisation
  private async handleRetrySync(context: ActionContext): Promise<ActionResult> {
    try {
      // Simuler le retry de synchronisation
      console.log('Retry synchronisation...');

      // Dans un vrai système, cela relancerait le service de sync
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Synchronisation relancée'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du retry'
      };
    }
  }

  // Ignorer notification
  private async handleDismissNotification(context: ActionContext): Promise<ActionResult> {
    try {
      // Marquer la notification comme ignorée
      // Dans un vrai système, cela mettrait à jour le statut
      console.log(`Notification ${context.notificationId} ignorée`);

      return {
        success: true,
        message: 'Notification ignorée'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de l\'ignore'
      };
    }
  }

  // Reporter à plus tard
  private async handleScheduleLater(context: ActionContext): Promise<ActionResult> {
    try {
      // Programmer un rappel pour plus tard
      const { notificationScheduler } = await import('./NotificationScheduler');
      
      const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h plus tard
      
      const scheduledId = notificationScheduler.scheduleNotification(
        'reminder_scheduled_action',
        context.userId,
        futureTime,
        {
          type: 'scheduled_reminder',
          source: 'user_action',
          userId: context.userId,
          data: {
            originalNotificationId: context.notificationId,
            originalAction: 'schedule_later'
          },
          timestamp: new Date().toISOString()
        }
      );

      return {
        success: true,
        message: 'Rappel programmé dans 2 heures'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la programmation'
      };
    }
  }

  // 📊 API PUBLIQUE
  public getActionHandlers(): Map<string, ActionHandler> {
    return new Map(this.actionHandlers);
  }

  public getActionHistory(userId?: string): typeof this.actionHistory {
    if (userId) {
      return this.actionHistory.filter(entry => entry.userId === userId);
    }
    return [...this.actionHistory];
  }

  public clearActionHistory(): void {
    this.actionHistory = [];
  }

  // 🎯 GÉNÉRER DES ACTIONS CONTEXTUELLES
  public generateContextualActions(
    notificationContext: NotificationContext,
    userRole?: string
  ): NotificationAction[] {
    const actions: NotificationAction[] = [];

    // Actions basées sur le contexte
    if (notificationContext.workshopId && notificationContext.missionId) {
      actions.push({
        id: 'navigate_to_workshop',
        label: 'Aller à l\'atelier',
        type: 'primary',
        icon: '🎯'
      });

      if (notificationContext.stepId) {
        actions.push({
          id: 'fix_validation_error',
          label: 'Corriger',
          type: 'primary',
          icon: '🔧'
        });
      }

      actions.push({
        id: 'navigate_to_results',
        label: 'Voir résultats',
        type: 'secondary',
        icon: '📊'
      });
    }

    if (notificationContext.reportId) {
      actions.push({
        id: 'download_report',
        label: 'Télécharger',
        type: 'primary',
        icon: '⬇️'
      });

      actions.push({
        id: 'share_report',
        label: 'Partager',
        type: 'secondary',
        icon: '📤'
      });
    }

    if (notificationContext.missionId) {
      actions.push({
        id: 'navigate_to_mission',
        label: 'Voir mission',
        type: 'secondary',
        icon: '📋'
      });
    }

    // Actions système toujours disponibles
    actions.push({
      id: 'schedule_later',
      label: 'Plus tard',
      type: 'secondary',
      icon: '⏰'
    });

    return actions;
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationActions = NotificationActions.getInstance();

export default NotificationActions;

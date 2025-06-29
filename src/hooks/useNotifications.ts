/**
 * 🔔 HOOK PERSONNALISÉ POUR LES NOTIFICATIONS
 * Interface simplifiée pour utiliser les notifications
 */

import { useCallback } from 'react';
import { useNotifications as useNotificationContext } from '../contexts/NotificationContext';
import type {
  EbiosNotification,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationAction,
  NotificationContext as NotifContext
} from '../types/notifications';

// 🎯 INTERFACE SIMPLIFIÉE POUR CRÉER DES NOTIFICATIONS
interface CreateNotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  description?: string;
  icon?: string;
  actions?: NotificationAction[];
  context?: Partial<NotifContext>;
  deepLink?: string;
  persistent?: boolean;
  sound?: boolean;
  tags?: string[];
}

// 🎯 HOOK PRINCIPAL
export const useNotifications = () => {
  const notificationContext = useNotificationContext();

  // 🚀 CRÉER UNE NOTIFICATION SIMPLIFIÉE
  const notify = useCallback(async (options: CreateNotificationOptions): Promise<string> => {
    const notification: Omit<EbiosNotification, 'id' | 'createdAt' | 'status'> = {
      type: options.type || 'info',
      category: options.category || 'system',
      priority: options.priority || 'medium',
      title: options.title,
      message: options.message,
      description: options.description,
      icon: options.icon,
      actions: options.actions || [],
      context: options.context || {},
      deepLink: options.deepLink,
      source: 'user_action',
      tags: options.tags || [],
      persistent: options.persistent,
      sound: options.sound
    };

    return await notificationContext.createNotification(notification);
  }, [notificationContext]);

  // 🎯 NOTIFICATIONS SPÉCIALISÉES EBIOS RM

  // ✅ NOTIFICATION DE SUCCÈS
  const notifySuccess = useCallback(async (
    title: string, 
    message: string, 
    options?: Partial<CreateNotificationOptions>
  ): Promise<string> => {
    return await notify({
      title,
      message,
      type: 'success',
      icon: '✅',
      sound: true,
      ...options
    });
  }, [notify]);

  // ❌ NOTIFICATION D'ERREUR
  const notifyError = useCallback(async (
    title: string, 
    message: string, 
    options?: Partial<CreateNotificationOptions>
  ): Promise<string> => {
    return await notify({
      title,
      message,
      type: 'error',
      priority: 'high',
      icon: '❌',
      sound: true,
      persistent: true,
      ...options
    });
  }, [notify]);

  // ⚠️ NOTIFICATION D'AVERTISSEMENT
  const notifyWarning = useCallback(async (
    title: string, 
    message: string, 
    options?: Partial<CreateNotificationOptions>
  ): Promise<string> => {
    return await notify({
      title,
      message,
      type: 'warning',
      priority: 'medium',
      icon: '⚠️',
      sound: true,
      ...options
    });
  }, [notify]);

  // ℹ️ NOTIFICATION D'INFORMATION
  const notifyInfo = useCallback(async (
    title: string, 
    message: string, 
    options?: Partial<CreateNotificationOptions>
  ): Promise<string> => {
    return await notify({
      title,
      message,
      type: 'info',
      icon: 'ℹ️',
      ...options
    });
  }, [notify]);

  // 🎯 NOTIFICATION D'ACTION REQUISE
  const notifyAction = useCallback(async (
    title: string, 
    message: string, 
    actions: NotificationAction[],
    options?: Partial<CreateNotificationOptions>
  ): Promise<string> => {
    return await notify({
      title,
      message,
      type: 'action',
      priority: 'high',
      icon: '🎯',
      actions,
      persistent: true,
      sound: true,
      ...options
    });
  }, [notify]);

  // 🏆 NOTIFICATION D'ACHIEVEMENT
  const notifyAchievement = useCallback(async (
    title: string, 
    message: string, 
    options?: Partial<CreateNotificationOptions>
  ): Promise<string> => {
    return await notify({
      title,
      message,
      type: 'achievement',
      category: 'formation',
      priority: 'medium',
      icon: '🏆',
      sound: true,
      ...options
    });
  }, [notify]);

  // 🎓 NOTIFICATIONS SPÉCIFIQUES FORMATION
  const notifyFormation = {
    // Atelier terminé
    workshopCompleted: useCallback(async (
      workshopId: number, 
      score: number, 
      nextWorkshop?: number
    ): Promise<string> => {
      const actions: NotificationAction[] = [];
      
      if (nextWorkshop) {
        actions.push({
          id: 'start_next',
          label: `Commencer Atelier ${nextWorkshop}`,
          type: 'primary',
          icon: '▶️',
          url: `/formation/workshop/${nextWorkshop}`
        });
      }

      actions.push({
        id: 'view_results',
        label: 'Voir les résultats',
        type: 'secondary',
        icon: '📊',
        url: `/formation/workshop/${workshopId}/results`
      });

      return await notify({
        title: `🎉 Atelier ${workshopId} terminé !`,
        message: `Félicitations ! Score obtenu : ${score}/100`,
        type: 'achievement',
        category: 'workshop',
        priority: 'medium',
        actions,
        context: { workshopId },
        sound: true,
        tags: ['workshop', 'completion', `workshop-${workshopId}`]
      });
    }, [notify]),

    // Erreur de validation
    validationError: useCallback(async (
      workshopId: number, 
      stepId: string, 
      errorMessage: string
    ): Promise<string> => {
      return await notify({
        title: `⚠️ Erreur Atelier ${workshopId}`,
        message: errorMessage,
        type: 'error',
        category: 'validation',
        priority: 'high',
        actions: [{
          id: 'fix_error',
          label: 'Corriger maintenant',
          type: 'primary',
          icon: '🔧',
          url: `/formation/workshop/${workshopId}?step=${stepId}`
        }],
        context: { workshopId, stepId },
        deepLink: `/formation/workshop/${workshopId}?step=${stepId}`,
        persistent: true,
        sound: true,
        tags: ['workshop', 'error', 'validation', `workshop-${workshopId}`]
      });
    }, [notify]),

    // Nouveau module disponible
    newModuleAvailable: useCallback(async (
      moduleName: string, 
      moduleUrl: string
    ): Promise<string> => {
      return await notify({
        title: '🆕 Nouveau module disponible',
        message: `Le module "${moduleName}" est maintenant accessible`,
        type: 'update',
        category: 'formation',
        priority: 'medium',
        actions: [{
          id: 'start_module',
          label: 'Commencer maintenant',
          type: 'primary',
          icon: '🚀',
          url: moduleUrl
        }],
        deepLink: moduleUrl,
        sound: true,
        tags: ['formation', 'new-module', 'update']
      });
    }, [notify]),

    // Rappel d'inactivité
    inactivityReminder: useCallback(async (
      lastActivity: string, 
      resumeUrl: string
    ): Promise<string> => {
      return await notify({
        title: '⏰ Reprenez votre formation',
        message: 'Vous n\'avez pas progressé depuis quelques jours',
        type: 'reminder',
        category: 'formation',
        priority: 'low',
        actions: [{
          id: 'resume_training',
          label: 'Reprendre la formation',
          type: 'primary',
          icon: '▶️',
          url: resumeUrl
        }],
        deepLink: resumeUrl,
        tags: ['formation', 'reminder', 'inactivity']
      });
    }, [notify])
  };

  // 📊 NOTIFICATIONS RAPPORTS
  const notifyReport = {
    // Rapport généré
    generated: useCallback(async (
      reportName: string, 
      downloadUrl: string, 
      viewUrl: string
    ): Promise<string> => {
      return await notify({
        title: '📊 Rapport généré',
        message: `Le rapport "${reportName}" est prêt`,
        type: 'success',
        category: 'report',
        priority: 'medium',
        actions: [
          {
            id: 'download_report',
            label: 'Télécharger PDF',
            type: 'primary',
            icon: '⬇️',
            url: downloadUrl
          },
          {
            id: 'view_report',
            label: 'Voir en ligne',
            type: 'secondary',
            icon: '👁️',
            url: viewUrl
          }
        ],
        deepLink: viewUrl,
        sound: true,
        tags: ['report', 'generated', 'download']
      });
    }, [notify]),

    // Erreur génération
    generationError: useCallback(async (
      reportName: string, 
      errorMessage: string, 
      retryUrl: string
    ): Promise<string> => {
      return await notify({
        title: '❌ Erreur génération rapport',
        message: `Impossible de générer "${reportName}": ${errorMessage}`,
        type: 'error',
        category: 'report',
        priority: 'high',
        actions: [{
          id: 'retry_generation',
          label: 'Réessayer',
          type: 'primary',
          icon: '🔄',
          url: retryUrl
        }],
        persistent: true,
        sound: true,
        tags: ['report', 'error', 'generation']
      });
    }, [notify])
  };

  // 🔄 NOTIFICATIONS SYNCHRONISATION
  const notifySync = {
    // Sync réussie
    success: useCallback(async (itemsCount: number): Promise<string> => {
      return await notify({
        title: '✅ Synchronisation réussie',
        message: `${itemsCount} éléments synchronisés`,
        type: 'success',
        category: 'sync',
        priority: 'low',
        icon: '🔄',
        tags: ['sync', 'success']
      });
    }, [notify]),

    // Sync échouée
    failed: useCallback(async (
      errorMessage: string, 
      retryAction?: () => void
    ): Promise<string> => {
      const actions: NotificationAction[] = [];
      
      if (retryAction) {
        actions.push({
          id: 'retry_sync',
          label: 'Réessayer',
          type: 'primary',
          icon: '🔄',
          onClick: retryAction
        });
      }

      return await notify({
        title: '❌ Échec synchronisation',
        message: errorMessage,
        type: 'error',
        category: 'sync',
        priority: 'medium',
        actions,
        persistent: true,
        sound: true,
        tags: ['sync', 'error', 'failed']
      });
    }, [notify])
  };

  return {
    // Contexte complet
    ...notificationContext,
    
    // Méthodes simplifiées
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyAction,
    notifyAchievement,
    
    // Notifications spécialisées
    notifyFormation,
    notifyReport,
    notifySync
  };
};

export default useNotifications;

// 🔗 HOOK POUR NAVIGATION ET ACTIONS (OPTIMISÉ AVEC MANAGER)
export const useNotificationNavigation = () => {
  return {
    // Navigation avec gestion d'erreurs robuste
    navigateToNotification: async (notificationId: string, context: NotificationContext, preserveState = true) => {
      const { notificationManager } = await import('../services/NotificationManager');
      return await notificationManager.navigateToNotification(notificationId, context, preserveState);
    },

    generateDeepLink: async (linkId: string, context: NotificationContext, additionalParams?: Record<string, string>) => {
      const { notificationErrorHandler } = await import('../services/NotificationErrorHandler');
      return await notificationErrorHandler.safeExecute(
        async () => {
          const { notificationNavigation } = await import('../services/NotificationNavigation');
          return notificationNavigation.generateDeepLink(linkId, context, additionalParams);
        },
        {
          operation: 'generateDeepLink',
          service: 'notificationNavigation',
          timestamp: new Date().toISOString(),
          metadata: { linkId, context, additionalParams }
        },
        null // fallback value
      );
    },

    generateBreadcrumbs: async (context: NotificationContext) => {
      const { notificationErrorHandler } = await import('../services/NotificationErrorHandler');
      return await notificationErrorHandler.safeExecute(
        async () => {
          const { notificationNavigation } = await import('../services/NotificationNavigation');
          return notificationNavigation.generateBreadcrumbs(context);
        },
        {
          operation: 'generateBreadcrumbs',
          service: 'notificationNavigation',
          timestamp: new Date().toISOString(),
          metadata: { context }
        },
        [] // fallback empty breadcrumbs
      );
    },

    restoreState: async (notificationId: string) => {
      const { notificationErrorHandler } = await import('../services/NotificationErrorHandler');
      return await notificationErrorHandler.safeExecute(
        async () => {
          const { notificationNavigation } = await import('../services/NotificationNavigation');
          return await notificationNavigation.restoreState(notificationId);
        },
        {
          operation: 'restoreState',
          service: 'notificationNavigation',
          timestamp: new Date().toISOString(),
          metadata: { notificationId }
        },
        false // fallback
      );
    },

    // Actions avec manager centralisé
    executeAction: async (actionId: string, context: any) => {
      const { notificationManager } = await import('../services/NotificationManager');
      return await notificationManager.executeAction(actionId, context);
    },

    generateContextualActions: async (context: NotificationContext, userRole?: string) => {
      const { notificationErrorHandler } = await import('../services/NotificationErrorHandler');
      return await notificationErrorHandler.safeExecute(
        async () => {
          const { notificationActions } = await import('../services/NotificationActions');
          return notificationActions.generateContextualActions(context, userRole);
        },
        {
          operation: 'generateContextualActions',
          service: 'notificationActions',
          timestamp: new Date().toISOString(),
          metadata: { context, userRole }
        },
        [] // fallback empty actions
      );
    },

    getActionHandlers: async () => {
      const { notificationErrorHandler } = await import('../services/NotificationErrorHandler');
      return await notificationErrorHandler.safeExecute(
        async () => {
          const { notificationActions } = await import('../services/NotificationActions');
          return notificationActions.getActionHandlers();
        },
        {
          operation: 'getActionHandlers',
          service: 'notificationActions',
          timestamp: new Date().toISOString()
        },
        new Map() // fallback empty map
      );
    },

    // Initialisation centralisée
    initialize: async () => {
      const { notificationManager } = await import('../services/NotificationManager');
      await notificationManager.initialize();
    }
  };
};

// 🤖 HOOK POUR GÉNÉRATEURS INTELLIGENTS (OPTIMISÉ AVEC MANAGER)
export const useIntelligentNotifications = () => {
  const baseNotifications = useNotifications();

  return {
    ...baseNotifications,

    // Traitement automatique d'événements avec gestion d'erreurs
    processEvent: async (eventType: string, eventData: Record<string, any>, userId: string) => {
      const { notificationManager } = await import('../services/NotificationManager');

      const event = {
        type: eventType,
        source: 'user_action',
        userId,
        data: eventData,
        timestamp: new Date().toISOString()
      };

      const context = {
        userId,
        userLevel: eventData.userLevel || 'beginner'
      };

      return await notificationManager.processEvent(event, context);
    },

    // Planification de notifications avec fallbacks
    scheduleNotification: async (
      ruleId: string,
      userId: string,
      triggerTime: Date,
      eventData: Record<string, any>
    ) => {
      const { notificationManager } = await import('../services/NotificationManager');

      const event = {
        type: 'scheduled_event',
        source: 'user_schedule',
        userId,
        data: eventData,
        timestamp: new Date().toISOString()
      };

      return await notificationManager.scheduleNotification(ruleId, userId, triggerTime, event);
    },

    // Analytics et métriques
    getAnalytics: async () => {
      const { notificationAnalytics } = await import('../services/NotificationAnalytics');
      return {
        globalMetrics: notificationAnalytics.calculateGlobalMetrics(),
        recommendations: notificationAnalytics.getOptimizationRecommendations()
      };
    },

    getUserMetrics: async (userId: string) => {
      const { notificationAnalytics } = await import('../services/NotificationAnalytics');
      return notificationAnalytics.calculateUserMetrics(userId);
    },

    // Contrôle du planificateur
    startScheduler: async () => {
      const { notificationScheduler } = await import('../services/NotificationScheduler');
      notificationScheduler.start();
    },

    stopScheduler: async () => {
      const { notificationScheduler } = await import('../services/NotificationScheduler');
      notificationScheduler.stop();
    },

    getSchedulerStats: async () => {
      const { notificationScheduler } = await import('../services/NotificationScheduler');
      return notificationScheduler.getSchedulerStats();
    }
  };
};

// 🎯 HOOK SPÉCIALISÉ EBIOS RM
export const useEbiosNotifications = () => {
  const baseNotifications = useNotifications();

  return {
    ...baseNotifications,

    // Raccourcis pour les notifications EBIOS RM courantes
    notifyWorkshopCompleted: async (workshopId: number, score: number, missionId: string, nextWorkshop?: number) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');
      return await ebiosNotificationGenerator.notifyWorkshopCompleted(workshopId, score, missionId, nextWorkshop);
    },

    notifyValidationError: async (workshopId: number, stepId: string, errorMessage: string, missionId: string) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');
      return await ebiosNotificationGenerator.notifyWorkshopValidationError(workshopId, stepId, errorMessage, missionId);
    },

    notifyReportReady: async (reportName: string, reportId: string, missionId: string, downloadUrl: string, viewUrl: string) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');
      return await ebiosNotificationGenerator.notifyReportGenerated(reportName, reportId, missionId, downloadUrl, viewUrl);
    },

    notifyMissionValidation: async (missionName: string, missionId: string) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');
      return await ebiosNotificationGenerator.notifyMissionValidationRequired(missionName, missionId);
    },

    notifyDataInconsistency: async (missionName: string, missionId: string, location: string, workshopId?: number) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');
      return await ebiosNotificationGenerator.notifyDataInconsistency(missionName, missionId, location, workshopId);
    },

    notifyNewComment: async (authorName: string, authorId: string, location: string, missionName: string, missionId: string, commentId: string) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');
      return await ebiosNotificationGenerator.notifyNewComment(authorName, authorId, location, missionName, missionId, commentId);
    },

    notifyAchievement: async (type: 'first_workshop' | 'perfect_score' | 'expert_level', data: Record<string, any>) => {
      const { ebiosNotificationGenerator } = await import('../services/EbiosNotificationGenerator');

      switch (type) {
        case 'first_workshop':
          return await ebiosNotificationGenerator.notifyFirstWorkshopCompleted(data.workshopId);
        case 'perfect_score':
          return await ebiosNotificationGenerator.notifyPerfectScore(data.workshopId, data.missionId);
        default:
          throw new Error(`Achievement type ${type} not implemented`);
      }
    }
  };
};

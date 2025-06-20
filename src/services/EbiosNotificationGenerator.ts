/**
 * 🎯 GÉNÉRATEUR DE NOTIFICATIONS EBIOS RM
 * Service pour créer automatiquement des notifications contextuelles
 */

import { notificationService } from './NotificationService';
import { ALL_TEMPLATES } from './NotificationTemplates';
import { 
  Notification, 
  NotificationAction, 
  NotificationContext 
} from '../types/notifications';

// 🎯 INTERFACE POUR LES DONNÉES D'ÉVÉNEMENTS
interface EbiosEvent {
  type: string;
  data: Record<string, any>;
  context: NotificationContext;
  userId?: string;
  timestamp?: string;
}

/**
 * 🎯 GÉNÉRATEUR PRINCIPAL
 */
export class EbiosNotificationGenerator {
  private static instance: EbiosNotificationGenerator | null = null;

  public static getInstance(): EbiosNotificationGenerator {
    if (!EbiosNotificationGenerator.instance) {
      EbiosNotificationGenerator.instance = new EbiosNotificationGenerator();
    }
    return EbiosNotificationGenerator.instance;
  }

  // 🎓 NOTIFICATIONS DE FORMATION
  public async notifyWorkshopCompleted(
    workshopId: number,
    score: number,
    missionId: string,
    nextWorkshop?: number
  ): Promise<string> {
    const template = ALL_TEMPLATES.WORKSHOP_COMPLETED;
    
    const actions: NotificationAction[] = [
      {
        id: 'view_results',
        label: 'Voir les résultats',
        type: 'secondary',
        icon: '📊',
        url: `/missions/${missionId}/workshops/${workshopId}/results`
      }
    ];

    if (nextWorkshop) {
      actions.unshift({
        id: 'start_next',
        label: `Commencer Atelier ${nextWorkshop}`,
        type: 'primary',
        icon: '▶️',
        url: `/missions/${missionId}/workshops/${nextWorkshop}`
      });
    }

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: this.processTemplate(template.titleTemplate, { workshopId }),
      message: this.processTemplate(template.messageTemplate, { 
        score, 
        nextWorkshop,
        hasNext: !!nextWorkshop 
      }),
      description: this.processTemplate(template.descriptionTemplate || '', { 
        workshopId, 
        score, 
        nextWorkshop 
      }),
      icon: template.icon,
      actions,
      context: { workshopId, missionId },
      deepLink: `/missions/${missionId}/workshops/${workshopId}/results`,
      source: 'ebios_workshop_system',
      tags: [...template.tags, `workshop-${workshopId}`, `mission-${missionId}`],
      sound: true
    });
  }

  public async notifyWorkshopValidationError(
    workshopId: number,
    stepId: string,
    errorMessage: string,
    missionId: string,
    stepName?: string
  ): Promise<string> {
    const template = ALL_TEMPLATES.WORKSHOP_VALIDATION_ERROR;

    const actions: NotificationAction[] = [
      {
        id: 'fix_error',
        label: 'Corriger maintenant',
        type: 'primary',
        icon: '🔧',
        url: `/missions/${missionId}/workshops/${workshopId}?step=${stepId}`
      },
      {
        id: 'view_help',
        label: 'Aide ANSSI',
        type: 'secondary',
        icon: '📚',
        url: `/help/workshop-${workshopId}#${stepId}`
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: this.processTemplate(template.titleTemplate, { workshopId }),
      message: errorMessage,
      description: this.processTemplate(template.descriptionTemplate || '', { 
        workshopId, 
        stepName: stepName || stepId 
      }),
      icon: template.icon,
      actions,
      context: { workshopId, stepId, missionId },
      deepLink: `/missions/${missionId}/workshops/${workshopId}?step=${stepId}`,
      source: 'ebios_validation_system',
      tags: [...template.tags, `workshop-${workshopId}`, `step-${stepId}`],
      persistent: true,
      sound: true
    });
  }

  public async notifyNewModuleAvailable(
    moduleName: string,
    moduleId: string,
    moduleUrl: string
  ): Promise<string> {
    const template = ALL_TEMPLATES.NEW_MODULE_AVAILABLE;

    const actions: NotificationAction[] = [
      {
        id: 'start_module',
        label: 'Commencer maintenant',
        type: 'primary',
        icon: '🚀',
        url: moduleUrl
      },
      {
        id: 'learn_more',
        label: 'En savoir plus',
        type: 'secondary',
        icon: 'ℹ️',
        url: `/modules/${moduleId}/info`
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { moduleName }),
      description: this.processTemplate(template.descriptionTemplate || '', { moduleName }),
      icon: template.icon,
      actions,
      context: { moduleId },
      deepLink: moduleUrl,
      source: 'ebios_content_system',
      tags: [...template.tags, `module-${moduleId}`],
      sound: true
    });
  }

  // 📊 NOTIFICATIONS DE RAPPORTS
  public async notifyReportGenerated(
    reportName: string,
    reportId: string,
    missionId: string,
    downloadUrl: string,
    viewUrl: string,
    pageCount?: number
  ): Promise<string> {
    const template = ALL_TEMPLATES.REPORT_GENERATED;

    const actions: NotificationAction[] = [
      {
        id: 'download_pdf',
        label: 'Télécharger PDF',
        type: 'primary',
        icon: '⬇️',
        url: downloadUrl,
        external: true
      },
      {
        id: 'view_online',
        label: 'Voir en ligne',
        type: 'secondary',
        icon: '👁️',
        url: viewUrl
      },
      {
        id: 'share_report',
        label: 'Partager',
        type: 'secondary',
        icon: '📤',
        url: `/reports/${reportId}/share`
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { reportName }),
      description: this.processTemplate(template.descriptionTemplate || '', { 
        reportName, 
        pageCount: pageCount || 'plusieurs' 
      }),
      icon: template.icon,
      actions,
      context: { reportId, missionId },
      deepLink: viewUrl,
      source: 'ebios_report_system',
      tags: [...template.tags, `report-${reportId}`, `mission-${missionId}`],
      sound: true
    });
  }

  public async notifyReportGenerationError(
    reportName: string,
    reportId: string,
    missionId: string,
    errorMessage: string,
    retryUrl: string
  ): Promise<string> {
    const template = ALL_TEMPLATES.REPORT_GENERATION_ERROR;

    const actions: NotificationAction[] = [
      {
        id: 'retry_generation',
        label: 'Réessayer',
        type: 'primary',
        icon: '🔄',
        url: retryUrl
      },
      {
        id: 'check_data',
        label: 'Vérifier les données',
        type: 'secondary',
        icon: '🔍',
        url: `/missions/${missionId}/validation`
      },
      {
        id: 'contact_support',
        label: 'Support technique',
        type: 'secondary',
        icon: '🆘',
        url: '/support?issue=report-generation'
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { reportName, errorMessage }),
      description: this.processTemplate(template.descriptionTemplate || '', { reportName }),
      icon: template.icon,
      actions,
      context: { reportId, missionId },
      deepLink: retryUrl,
      source: 'ebios_report_system',
      tags: [...template.tags, `report-${reportId}`, `mission-${missionId}`],
      persistent: true,
      sound: true
    });
  }

  // ⚠️ NOTIFICATIONS DE VALIDATION
  public async notifyMissionValidationRequired(
    missionName: string,
    missionId: string
  ): Promise<string> {
    const template = ALL_TEMPLATES.MISSION_VALIDATION_REQUIRED;

    const actions: NotificationAction[] = [
      {
        id: 'validate_mission',
        label: 'Valider maintenant',
        type: 'primary',
        icon: '✅',
        url: `/missions/${missionId}/validate`
      },
      {
        id: 'review_mission',
        label: 'Réviser la mission',
        type: 'secondary',
        icon: '🔍',
        url: `/missions/${missionId}/review`
      },
      {
        id: 'schedule_validation',
        label: 'Planifier plus tard',
        type: 'secondary',
        icon: '📅',
        url: `/missions/${missionId}/schedule`
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { missionName }),
      description: this.processTemplate(template.descriptionTemplate || '', { missionName }),
      icon: template.icon,
      actions,
      context: { missionId },
      deepLink: `/missions/${missionId}/validate`,
      source: 'ebios_validation_system',
      tags: [...template.tags, `mission-${missionId}`],
      persistent: true,
      sound: true
    });
  }

  public async notifyDataInconsistency(
    missionName: string,
    missionId: string,
    location: string,
    workshopId?: number
  ): Promise<string> {
    const template = ALL_TEMPLATES.DATA_INCONSISTENCY_DETECTED;

    const actions: NotificationAction[] = [
      {
        id: 'fix_inconsistency',
        label: 'Corriger maintenant',
        type: 'primary',
        icon: '🔧',
        url: workshopId 
          ? `/missions/${missionId}/workshops/${workshopId}` 
          : `/missions/${missionId}/review`
      },
      {
        id: 'view_details',
        label: 'Voir les détails',
        type: 'secondary',
        icon: '🔍',
        url: `/missions/${missionId}/inconsistencies`
      },
      {
        id: 'ignore_warning',
        label: 'Ignorer',
        type: 'secondary',
        icon: '❌',
        onClick: async () => {
          // Marquer comme ignoré
          console.log('Inconsistency ignored');
        }
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { location, missionName }),
      description: this.processTemplate(template.descriptionTemplate || '', { location }),
      icon: template.icon,
      actions,
      context: { missionId, workshopId },
      deepLink: workshopId 
        ? `/missions/${missionId}/workshops/${workshopId}` 
        : `/missions/${missionId}/review`,
      source: 'ebios_ai_system',
      tags: [...template.tags, `mission-${missionId}`, 'ai-detected'],
      persistent: true,
      sound: true
    });
  }

  // 👥 NOTIFICATIONS DE COLLABORATION
  public async notifyNewComment(
    authorName: string,
    authorId: string,
    location: string,
    missionName: string,
    missionId: string,
    commentId: string
  ): Promise<string> {
    const template = ALL_TEMPLATES.NEW_COMMENT;

    const actions: NotificationAction[] = [
      {
        id: 'view_comment',
        label: 'Voir le commentaire',
        type: 'primary',
        icon: '👁️',
        url: `/missions/${missionId}/comments#comment-${commentId}`
      },
      {
        id: 'reply_comment',
        label: 'Répondre',
        type: 'secondary',
        icon: '↩️',
        url: `/missions/${missionId}/comments#reply-${commentId}`
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { authorName, location }),
      description: this.processTemplate(template.descriptionTemplate || '', { 
        authorName, 
        location, 
        missionName 
      }),
      icon: template.icon,
      actions,
      context: { missionId, userId: authorId },
      deepLink: `/missions/${missionId}/comments#comment-${commentId}`,
      source: 'ebios_collaboration_system',
      tags: [...template.tags, `mission-${missionId}`, `author-${authorId}`]
    });
  }

  // 🏆 NOTIFICATIONS D'ACHIEVEMENTS
  public async notifyFirstWorkshopCompleted(workshopId: number): Promise<string> {
    const template = ALL_TEMPLATES.FIRST_WORKSHOP_COMPLETED;

    const actions: NotificationAction[] = [
      {
        id: 'continue_learning',
        label: 'Continuer l\'apprentissage',
        type: 'primary',
        icon: '📚',
        url: '/formation'
      },
      {
        id: 'share_achievement',
        label: 'Partager',
        type: 'secondary',
        icon: '📤',
        url: '/achievements/share/first-workshop'
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: template.messageTemplate,
      description: template.descriptionTemplate,
      icon: template.icon,
      actions,
      context: { workshopId },
      deepLink: '/formation',
      source: 'ebios_achievement_system',
      tags: [...template.tags, `workshop-${workshopId}`],
      sound: true
    });
  }

  public async notifyPerfectScore(workshopId: number, missionId: string): Promise<string> {
    const template = ALL_TEMPLATES.PERFECT_SCORE;

    const actions: NotificationAction[] = [
      {
        id: 'view_analysis',
        label: 'Voir l\'analyse',
        type: 'primary',
        icon: '📊',
        url: `/missions/${missionId}/workshops/${workshopId}/analysis`
      },
      {
        id: 'share_score',
        label: 'Partager',
        type: 'secondary',
        icon: '📤',
        url: `/achievements/share/perfect-score/${workshopId}`
      }
    ];

    return await notificationService.createNotification({
      type: template.type,
      category: template.category,
      priority: template.priority,
      title: template.titleTemplate,
      message: this.processTemplate(template.messageTemplate, { workshopId }),
      description: this.processTemplate(template.descriptionTemplate || '', { workshopId }),
      icon: template.icon,
      actions,
      context: { workshopId, missionId },
      deepLink: `/missions/${missionId}/workshops/${workshopId}/analysis`,
      source: 'ebios_achievement_system',
      tags: [...template.tags, `workshop-${workshopId}`, `mission-${missionId}`],
      sound: true
    });
  }

  // 🔧 UTILITAIRES
  private processTemplate(template: string, data: Record<string, any>): string {
    let result = template;
    
    // Remplacements simples
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });

    // Gestion des conditions simples
    result = result.replace(/{{#(\w+)}}(.*?){{\/\1}}/g, (match, condition, content) => {
      return data[condition] ? content : '';
    });

    // Gestion des pluriels
    result = result.replace(/{{#plural}}(.*?){{\/plural}}/g, (match, content) => {
      // Chercher un nombre dans les données pour déterminer le pluriel
      const numbers = Object.values(data).filter(v => typeof v === 'number');
      const shouldPlural = numbers.some(n => n > 1);
      return shouldPlural ? content : '';
    });

    return result;
  }
}

// 🎯 INSTANCE GLOBALE
export const ebiosNotificationGenerator = EbiosNotificationGenerator.getInstance();

export default EbiosNotificationGenerator;

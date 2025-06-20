/**
 * 🤖 RÈGLES MÉTIER POUR NOTIFICATIONS INTELLIGENTES
 * Système de règles pour générer automatiquement des notifications contextuelles
 */

import { 
  NotificationRule, 
  NotificationTemplate, 
  NotificationPriority,
  NotificationCategory 
} from '../types/notifications';
import { ALL_TEMPLATES } from './NotificationTemplates';

// 🎯 TYPES D'ÉVÉNEMENTS DÉCLENCHEURS
export interface TriggerEvent {
  type: string;
  source: string;
  userId: string;
  sessionId?: string;
  missionId?: string;
  workshopId?: number;
  data: Record<string, any>;
  timestamp: string;
}

// 🎯 CONDITIONS DE DÉCLENCHEMENT
export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists' | 'in_range';
  value: any;
  optional?: boolean;
}

// 🎯 RÈGLES DE FORMATION EBIOS RM
export const FORMATION_RULES: NotificationRule[] = [
  {
    id: 'workshop_completion_celebration',
    name: 'Célébration Fin d\'Atelier',
    description: 'Félicite l\'utilisateur à la fin d\'un atelier avec suggestions',
    enabled: true,
    trigger: {
      event: 'workshop_completed',
      conditions: {
        score: { operator: 'greater_than', value: 0 }
      }
    },
    template: ALL_TEMPLATES.WORKSHOP_COMPLETED,
    cooldown: 0, // Pas de cooldown pour les célébrations
    maxPerDay: 10,
    targetUsers: [] // Tous les utilisateurs
  },

  {
    id: 'validation_error_immediate',
    name: 'Erreur de Validation Immédiate',
    description: 'Alerte immédiate en cas d\'erreur de validation critique',
    enabled: true,
    trigger: {
      event: 'validation_error',
      conditions: {
        severity: { operator: 'in', value: ['high', 'critical'] }
      }
    },
    template: ALL_TEMPLATES.WORKSHOP_VALIDATION_ERROR,
    cooldown: 300000, // 5 minutes entre erreurs similaires
    maxPerDay: 20,
    targetUsers: []
  },

  {
    id: 'inactivity_reminder_progressive',
    name: 'Rappel d\'Inactivité Progressif',
    description: 'Rappels progressifs selon la durée d\'inactivité',
    enabled: true,
    trigger: {
      event: 'user_inactive',
      conditions: {
        days_inactive: { operator: 'greater_than', value: 3 }
      }
    },
    template: ALL_TEMPLATES.INACTIVITY_REMINDER,
    cooldown: 86400000, // 24h entre rappels
    maxPerDay: 1,
    targetUsers: []
  },

  {
    id: 'perfect_score_achievement',
    name: 'Achievement Score Parfait',
    description: 'Récompense pour un score parfait',
    enabled: true,
    trigger: {
      event: 'workshop_completed',
      conditions: {
        score: { operator: 'equals', value: 100 }
      }
    },
    template: ALL_TEMPLATES.PERFECT_SCORE,
    cooldown: 0,
    maxPerDay: 5,
    targetUsers: []
  },

  {
    id: 'first_workshop_milestone',
    name: 'Milestone Premier Atelier',
    description: 'Célébration du premier atelier terminé',
    enabled: true,
    trigger: {
      event: 'workshop_completed',
      conditions: {
        workshop_id: { operator: 'equals', value: 1 },
        user_workshop_count: { operator: 'equals', value: 1 }
      }
    },
    template: ALL_TEMPLATES.FIRST_WORKSHOP_COMPLETED,
    cooldown: 0,
    maxPerDay: 1,
    targetUsers: []
  }
];

// 🎯 RÈGLES DE VALIDATION ET QUALITÉ
export const VALIDATION_RULES: NotificationRule[] = [
  {
    id: 'mission_validation_required',
    name: 'Validation Mission Requise',
    description: 'Demande validation quand mission complète',
    enabled: true,
    trigger: {
      event: 'mission_completed',
      conditions: {
        all_workshops_completed: { operator: 'equals', value: true },
        validation_status: { operator: 'equals', value: 'pending' }
      }
    },
    template: ALL_TEMPLATES.MISSION_VALIDATION_REQUIRED,
    cooldown: 3600000, // 1h entre demandes
    maxPerDay: 3,
    targetUsers: []
  },

  {
    id: 'ai_inconsistency_detection',
    name: 'Détection IA d\'Incohérences',
    description: 'Alerte quand l\'IA détecte des incohérences',
    enabled: true,
    trigger: {
      event: 'ai_analysis_completed',
      conditions: {
        inconsistencies_found: { operator: 'greater_than', value: 0 },
        confidence_level: { operator: 'greater_than', value: 0.8 }
      }
    },
    template: ALL_TEMPLATES.DATA_INCONSISTENCY_DETECTED,
    cooldown: 1800000, // 30min entre alertes similaires
    maxPerDay: 10,
    targetUsers: []
  },

  {
    id: 'compliance_check_failure',
    name: 'Échec Vérification Conformité',
    description: 'Alerte urgente pour non-conformité ANSSI',
    enabled: true,
    trigger: {
      event: 'compliance_check_completed',
      conditions: {
        compliance_status: { operator: 'equals', value: 'failed' },
        standard: { operator: 'contains', value: 'ANSSI' }
      }
    },
    template: ALL_TEMPLATES.COMPLIANCE_CHECK_FAILED,
    cooldown: 0, // Pas de cooldown pour conformité
    maxPerDay: 50,
    targetUsers: []
  }
];

// 🎯 RÈGLES DE RAPPORTS
export const REPORT_RULES: NotificationRule[] = [
  {
    id: 'report_generation_success',
    name: 'Rapport Généré avec Succès',
    description: 'Notification quand rapport prêt au téléchargement',
    enabled: true,
    trigger: {
      event: 'report_generated',
      conditions: {
        status: { operator: 'equals', value: 'success' },
        file_size: { operator: 'greater_than', value: 0 }
      }
    },
    template: ALL_TEMPLATES.REPORT_GENERATED,
    cooldown: 0,
    maxPerDay: 20,
    targetUsers: []
  },

  {
    id: 'report_generation_failure',
    name: 'Échec Génération Rapport',
    description: 'Alerte en cas d\'échec de génération',
    enabled: true,
    trigger: {
      event: 'report_generation_failed',
      conditions: {
        retry_count: { operator: 'less_than', value: 3 }
      }
    },
    template: ALL_TEMPLATES.REPORT_GENERATION_ERROR,
    cooldown: 600000, // 10min entre tentatives
    maxPerDay: 10,
    targetUsers: []
  },

  {
    id: 'report_shared_notification',
    name: 'Rapport Partagé',
    description: 'Notification quand rapport partagé avec utilisateur',
    enabled: true,
    trigger: {
      event: 'report_shared',
      conditions: {
        target_user_id: { operator: 'exists', value: true }
      }
    },
    template: ALL_TEMPLATES.REPORT_SHARED,
    cooldown: 0,
    maxPerDay: 30,
    targetUsers: []
  }
];

// 🎯 RÈGLES DE COLLABORATION
export const COLLABORATION_RULES: NotificationRule[] = [
  {
    id: 'new_comment_notification',
    name: 'Nouveau Commentaire',
    description: 'Notification pour nouveaux commentaires',
    enabled: true,
    trigger: {
      event: 'comment_added',
      conditions: {
        target_user_id: { operator: 'exists', value: true },
        comment_length: { operator: 'greater_than', value: 10 }
      }
    },
    template: ALL_TEMPLATES.NEW_COMMENT,
    cooldown: 300000, // 5min entre commentaires
    maxPerDay: 50,
    targetUsers: []
  },

  {
    id: 'team_invitation_notification',
    name: 'Invitation Équipe',
    description: 'Notification d\'invitation à rejoindre une équipe',
    enabled: true,
    trigger: {
      event: 'team_invitation_sent',
      conditions: {
        invitee_user_id: { operator: 'exists', value: true }
      }
    },
    template: ALL_TEMPLATES.TEAM_INVITATION,
    cooldown: 0,
    maxPerDay: 10,
    targetUsers: []
  },

  {
    id: 'review_request_notification',
    name: 'Demande de Révision',
    description: 'Notification de demande d\'avis expert',
    enabled: true,
    trigger: {
      event: 'review_requested',
      conditions: {
        reviewer_user_id: { operator: 'exists', value: true },
        urgency_level: { operator: 'in', value: ['medium', 'high', 'urgent'] }
      }
    },
    template: ALL_TEMPLATES.REVIEW_REQUEST,
    cooldown: 1800000, // 30min entre demandes
    maxPerDay: 15,
    targetUsers: []
  }
];

// 🎯 RÈGLES DE SYNCHRONISATION
export const SYNC_RULES: NotificationRule[] = [
  {
    id: 'sync_success_summary',
    name: 'Résumé Sync Réussie',
    description: 'Notification de succès avec résumé',
    enabled: true,
    trigger: {
      event: 'sync_completed',
      conditions: {
        status: { operator: 'equals', value: 'success' },
        items_synced: { operator: 'greater_than', value: 5 }
      }
    },
    template: ALL_TEMPLATES.SYNC_SUCCESS,
    cooldown: 3600000, // 1h entre résumés
    maxPerDay: 5,
    targetUsers: []
  },

  {
    id: 'sync_failure_alert',
    name: 'Alerte Échec Sync',
    description: 'Alerte en cas d\'échec de synchronisation',
    enabled: true,
    trigger: {
      event: 'sync_failed',
      conditions: {
        consecutive_failures: { operator: 'greater_than', value: 2 }
      }
    },
    template: ALL_TEMPLATES.SYNC_FAILED,
    cooldown: 1800000, // 30min entre alertes
    maxPerDay: 10,
    targetUsers: []
  },

  {
    id: 'sync_conflict_resolution',
    name: 'Résolution Conflit Sync',
    description: 'Notification de conflit nécessitant intervention',
    enabled: true,
    trigger: {
      event: 'sync_conflict_detected',
      conditions: {
        auto_resolution_failed: { operator: 'equals', value: true }
      }
    },
    template: ALL_TEMPLATES.SYNC_CONFLICT,
    cooldown: 0, // Pas de cooldown pour conflits
    maxPerDay: 20,
    targetUsers: []
  }
];

// 🎯 RÈGLES CONTEXTUELLES AVANCÉES
export const CONTEXTUAL_RULES: NotificationRule[] = [
  {
    id: 'weekend_reminder',
    name: 'Rappel Weekend',
    description: 'Rappel doux pour continuer la formation le weekend',
    enabled: true,
    trigger: {
      event: 'time_based_check',
      conditions: {
        day_of_week: { operator: 'in', value: ['saturday', 'sunday'] },
        user_active_weekends: { operator: 'equals', value: true },
        last_activity_days: { operator: 'greater_than', value: 2 }
      }
    },
    template: ALL_TEMPLATES.INACTIVITY_REMINDER,
    cooldown: 172800000, // 48h entre rappels weekend
    maxPerDay: 1,
    targetUsers: []
  },

  {
    id: 'deadline_approaching',
    name: 'Échéance Approche',
    description: 'Alerte quand échéance de mission approche',
    enabled: true,
    trigger: {
      event: 'deadline_check',
      conditions: {
        days_until_deadline: { operator: 'in_range', value: [1, 7] },
        mission_completion: { operator: 'less_than', value: 80 }
      }
    },
    template: ALL_TEMPLATES.MISSION_VALIDATION_REQUIRED,
    cooldown: 86400000, // 24h entre rappels d'échéance
    maxPerDay: 2,
    targetUsers: []
  },

  {
    id: 'expert_recommendation',
    name: 'Recommandation Expert',
    description: 'Suggestion de contenu basée sur le niveau',
    enabled: true,
    trigger: {
      event: 'user_level_updated',
      conditions: {
        new_level: { operator: 'in', value: ['intermediate', 'advanced', 'expert'] },
        completion_rate: { operator: 'greater_than', value: 75 }
      }
    },
    template: ALL_TEMPLATES.NEW_MODULE_AVAILABLE,
    cooldown: 604800000, // 7 jours entre recommandations
    maxPerDay: 1,
    targetUsers: []
  }
];

// 🎯 EXPORT GLOBAL DES RÈGLES
export const ALL_NOTIFICATION_RULES = [
  ...FORMATION_RULES,
  ...VALIDATION_RULES,
  ...REPORT_RULES,
  ...COLLABORATION_RULES,
  ...SYNC_RULES,
  ...CONTEXTUAL_RULES
];

// 🎯 UTILITAIRES POUR LES RÈGLES
export class NotificationRuleUtils {
  
  // Vérifier si une condition est remplie
  static checkCondition(condition: TriggerCondition, eventData: any): boolean {
    const fieldValue = this.getNestedValue(eventData, condition.field);
    
    if (fieldValue === undefined && !condition.optional) {
      return false;
    }
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'in_range':
        const [min, max] = condition.value;
        const numValue = Number(fieldValue);
        return numValue >= min && numValue <= max;
      default:
        return false;
    }
  }
  
  // Récupérer une valeur imbriquée dans un objet
  static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  // Vérifier si toutes les conditions d'une règle sont remplies
  static checkRuleConditions(rule: NotificationRule, event: TriggerEvent): boolean {
    const conditions = rule.trigger.conditions;
    
    return Object.entries(conditions).every(([field, condition]) => {
      return this.checkCondition({ field, ...condition }, event.data);
    });
  }
  
  // Filtrer les règles applicables pour un événement
  static getApplicableRules(event: TriggerEvent, rules: NotificationRule[] = ALL_NOTIFICATION_RULES): NotificationRule[] {
    return rules.filter(rule => {
      // Vérifier si la règle est activée
      if (!rule.enabled) return false;
      
      // Vérifier si l'événement correspond
      if (rule.trigger.event !== event.type) return false;
      
      // Vérifier les conditions
      return this.checkRuleConditions(rule, event);
    });
  }
  
  // Calculer la priorité d'une notification basée sur le contexte
  static calculatePriority(rule: NotificationRule, event: TriggerEvent): NotificationPriority {
    const basePriority = rule.template.priority;
    
    // Augmenter la priorité selon certains critères
    if (event.data.urgency_level === 'urgent') return 'urgent';
    if (event.data.severity === 'critical') return 'urgent';
    if (event.data.compliance_issue === true) return 'urgent';
    
    // Diminuer la priorité pour certains cas
    if (event.data.user_preference_low_priority === true) return 'low';
    
    return basePriority;
  }
}

export default ALL_NOTIFICATION_RULES;

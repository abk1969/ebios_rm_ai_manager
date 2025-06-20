/**
 * 🎯 TEMPLATES DE NOTIFICATIONS EBIOS RM
 * Templates prédéfinis pour les notifications contextuelles
 */

import { 
  NotificationTemplate, 
  NotificationCategory, 
  NotificationType, 
  NotificationPriority 
} from '../types/notifications';

// 🎓 TEMPLATES FORMATION
export const FORMATION_TEMPLATES: Record<string, NotificationTemplate> = {
  WORKSHOP_COMPLETED: {
    id: 'workshop_completed',
    name: 'Atelier Terminé',
    category: 'formation',
    type: 'achievement',
    priority: 'medium',
    titleTemplate: '🎉 Atelier {{workshopId}} terminé !',
    messageTemplate: 'Félicitations ! Score obtenu : {{score}}/100{{#nextWorkshop}} - Prêt pour l\'Atelier {{nextWorkshop}} ?{{/nextWorkshop}}',
    descriptionTemplate: 'Vous avez terminé l\'atelier {{workshopId}} avec un score de {{score}}/100. {{#nextWorkshop}}L\'atelier {{nextWorkshop}} est maintenant disponible.{{/nextWorkshop}}',
    icon: '🎉',
    actions: [
      {
        id: 'view_results',
        label: 'Voir les résultats',
        type: 'secondary',
        icon: '📊'
      },
      {
        id: 'start_next',
        label: 'Atelier suivant',
        type: 'primary',
        icon: '▶️'
      }
    ],
    contextFields: ['workshopId', 'missionId'],
    tags: ['workshop', 'completion', 'achievement']
  },

  WORKSHOP_VALIDATION_ERROR: {
    id: 'workshop_validation_error',
    name: 'Erreur de Validation Atelier',
    category: 'validation',
    type: 'error',
    priority: 'high',
    titleTemplate: '⚠️ Erreur Atelier {{workshopId}}',
    messageTemplate: '{{errorMessage}}',
    descriptionTemplate: 'Une erreur de validation a été détectée dans l\'atelier {{workshopId}} à l\'étape "{{stepName}}". Correction requise pour continuer.',
    icon: '⚠️',
    actions: [
      {
        id: 'fix_error',
        label: 'Corriger maintenant',
        type: 'primary',
        icon: '🔧'
      },
      {
        id: 'view_help',
        label: 'Aide ANSSI',
        type: 'secondary',
        icon: '📚'
      }
    ],
    contextFields: ['workshopId', 'stepId', 'missionId'],
    tags: ['workshop', 'error', 'validation']
  },

  NEW_MODULE_AVAILABLE: {
    id: 'new_module_available',
    name: 'Nouveau Module Disponible',
    category: 'formation',
    type: 'update',
    priority: 'medium',
    titleTemplate: '🆕 Nouveau module disponible',
    messageTemplate: 'Le module "{{moduleName}}" est maintenant accessible',
    descriptionTemplate: 'Un nouveau module de formation EBIOS RM est disponible : {{moduleName}}. Enrichissez vos connaissances avec ce contenu exclusif.',
    icon: '🆕',
    actions: [
      {
        id: 'start_module',
        label: 'Commencer maintenant',
        type: 'primary',
        icon: '🚀'
      },
      {
        id: 'learn_more',
        label: 'En savoir plus',
        type: 'secondary',
        icon: 'ℹ️'
      }
    ],
    contextFields: ['moduleId'],
    tags: ['formation', 'new-module', 'update']
  },

  INACTIVITY_REMINDER: {
    id: 'inactivity_reminder',
    name: 'Rappel d\'Inactivité',
    category: 'formation',
    type: 'reminder',
    priority: 'low',
    titleTemplate: '⏰ Reprenez votre formation',
    messageTemplate: 'Vous n\'avez pas progressé depuis {{daysSince}} jour{{#plural}}s{{/plural}}',
    descriptionTemplate: 'Votre dernière activité de formation remonte au {{lastActivity}}. Continuez votre apprentissage EBIOS RM pour maintenir votre progression.',
    icon: '⏰',
    actions: [
      {
        id: 'resume_training',
        label: 'Reprendre la formation',
        type: 'primary',
        icon: '▶️'
      },
      {
        id: 'view_progress',
        label: 'Voir ma progression',
        type: 'secondary',
        icon: '📊'
      }
    ],
    contextFields: ['sessionId'],
    tags: ['formation', 'reminder', 'inactivity']
  }
};

// 📊 TEMPLATES RAPPORTS
export const REPORT_TEMPLATES: Record<string, NotificationTemplate> = {
  REPORT_GENERATED: {
    id: 'report_generated',
    name: 'Rapport Généré',
    category: 'report',
    type: 'success',
    priority: 'medium',
    titleTemplate: '📊 Rapport généré',
    messageTemplate: 'Le rapport "{{reportName}}" est prêt',
    descriptionTemplate: 'Votre rapport EBIOS RM "{{reportName}}" a été généré avec succès. Il contient {{pageCount}} pages et est disponible au téléchargement.',
    icon: '📊',
    actions: [
      {
        id: 'download_pdf',
        label: 'Télécharger PDF',
        type: 'primary',
        icon: '⬇️'
      },
      {
        id: 'view_online',
        label: 'Voir en ligne',
        type: 'secondary',
        icon: '👁️'
      },
      {
        id: 'share_report',
        label: 'Partager',
        type: 'secondary',
        icon: '📤'
      }
    ],
    contextFields: ['reportId', 'missionId'],
    tags: ['report', 'generated', 'download']
  },

  REPORT_GENERATION_ERROR: {
    id: 'report_generation_error',
    name: 'Erreur Génération Rapport',
    category: 'report',
    type: 'error',
    priority: 'high',
    titleTemplate: '❌ Erreur génération rapport',
    messageTemplate: 'Impossible de générer "{{reportName}}" : {{errorMessage}}',
    descriptionTemplate: 'La génération du rapport "{{reportName}}" a échoué. Vérifiez que toutes les données requises sont complètes et réessayez.',
    icon: '❌',
    actions: [
      {
        id: 'retry_generation',
        label: 'Réessayer',
        type: 'primary',
        icon: '🔄'
      },
      {
        id: 'check_data',
        label: 'Vérifier les données',
        type: 'secondary',
        icon: '🔍'
      },
      {
        id: 'contact_support',
        label: 'Support technique',
        type: 'secondary',
        icon: '🆘'
      }
    ],
    contextFields: ['reportId', 'missionId'],
    tags: ['report', 'error', 'generation']
  },

  REPORT_SHARED: {
    id: 'report_shared',
    name: 'Rapport Partagé',
    category: 'collaboration',
    type: 'info',
    priority: 'medium',
    titleTemplate: '📤 Rapport partagé',
    messageTemplate: '{{sharedBy}} a partagé le rapport "{{reportName}}" avec vous',
    descriptionTemplate: '{{sharedBy}} vous a donné accès au rapport "{{reportName}}" de la mission {{missionName}}. Vous pouvez maintenant le consulter et le commenter.',
    icon: '📤',
    actions: [
      {
        id: 'view_report',
        label: 'Voir le rapport',
        type: 'primary',
        icon: '👁️'
      },
      {
        id: 'add_comment',
        label: 'Commenter',
        type: 'secondary',
        icon: '💬'
      }
    ],
    contextFields: ['reportId', 'missionId', 'userId'],
    tags: ['report', 'shared', 'collaboration']
  }
};

// ⚠️ TEMPLATES ALERTES ET VALIDATION
export const VALIDATION_TEMPLATES: Record<string, NotificationTemplate> = {
  MISSION_VALIDATION_REQUIRED: {
    id: 'mission_validation_required',
    name: 'Validation Mission Requise',
    category: 'validation',
    type: 'action',
    priority: 'high',
    titleTemplate: '🎯 Validation requise',
    messageTemplate: 'La mission "{{missionName}}" nécessite une validation avant publication',
    descriptionTemplate: 'Votre mission "{{missionName}}" est complète mais nécessite une validation finale avant d\'être publiée. Vérifiez tous les ateliers et validez.',
    icon: '🎯',
    actions: [
      {
        id: 'validate_mission',
        label: 'Valider maintenant',
        type: 'primary',
        icon: '✅'
      },
      {
        id: 'review_mission',
        label: 'Réviser la mission',
        type: 'secondary',
        icon: '🔍'
      },
      {
        id: 'schedule_validation',
        label: 'Planifier plus tard',
        type: 'secondary',
        icon: '📅'
      }
    ],
    contextFields: ['missionId'],
    tags: ['mission', 'validation', 'action-required']
  },

  DATA_INCONSISTENCY_DETECTED: {
    id: 'data_inconsistency_detected',
    name: 'Incohérence Détectée',
    category: 'validation',
    type: 'warning',
    priority: 'high',
    titleTemplate: '⚠️ Incohérence détectée',
    messageTemplate: 'Données incohérentes dans {{location}} de la mission "{{missionName}}"',
    descriptionTemplate: 'L\'IA a détecté des incohérences dans {{location}}. Ces incohérences peuvent affecter la qualité de votre analyse EBIOS RM.',
    icon: '⚠️',
    actions: [
      {
        id: 'fix_inconsistency',
        label: 'Corriger maintenant',
        type: 'primary',
        icon: '🔧'
      },
      {
        id: 'view_details',
        label: 'Voir les détails',
        type: 'secondary',
        icon: '🔍'
      },
      {
        id: 'ignore_warning',
        label: 'Ignorer',
        type: 'secondary',
        icon: '❌'
      }
    ],
    contextFields: ['missionId', 'workshopId'],
    tags: ['validation', 'inconsistency', 'ai-detected']
  },

  COMPLIANCE_CHECK_FAILED: {
    id: 'compliance_check_failed',
    name: 'Vérification Conformité Échouée',
    category: 'security',
    type: 'error',
    priority: 'urgent',
    titleTemplate: '🛡️ Non-conformité ANSSI détectée',
    messageTemplate: 'La mission "{{missionName}}" ne respecte pas les exigences {{standard}}',
    descriptionTemplate: 'Votre mission ne respecte pas les exigences {{standard}}. Une correction immédiate est requise pour maintenir la conformité ANSSI.',
    icon: '🛡️',
    actions: [
      {
        id: 'fix_compliance',
        label: 'Corriger immédiatement',
        type: 'primary',
        icon: '🚨'
      },
      {
        id: 'view_requirements',
        label: 'Voir les exigences',
        type: 'secondary',
        icon: '📋'
      },
      {
        id: 'contact_expert',
        label: 'Contacter un expert',
        type: 'secondary',
        icon: '👨‍💼'
      }
    ],
    contextFields: ['missionId'],
    tags: ['security', 'compliance', 'anssi', 'urgent']
  }
};

// 🔄 TEMPLATES SYNCHRONISATION
export const SYNC_TEMPLATES: Record<string, NotificationTemplate> = {
  SYNC_SUCCESS: {
    id: 'sync_success',
    name: 'Synchronisation Réussie',
    category: 'sync',
    type: 'success',
    priority: 'low',
    titleTemplate: '✅ Synchronisation réussie',
    messageTemplate: '{{itemsCount}} élément{{#plural}}s{{/plural}} synchronisé{{#plural}}s{{/plural}}',
    descriptionTemplate: 'Vos données ont été synchronisées avec succès. {{itemsCount}} élément(s) mis à jour.',
    icon: '✅',
    actions: [],
    contextFields: [],
    tags: ['sync', 'success']
  },

  SYNC_FAILED: {
    id: 'sync_failed',
    name: 'Échec Synchronisation',
    category: 'sync',
    type: 'error',
    priority: 'medium',
    titleTemplate: '❌ Échec synchronisation',
    messageTemplate: '{{errorMessage}}',
    descriptionTemplate: 'La synchronisation a échoué : {{errorMessage}}. Vos données locales sont conservées.',
    icon: '❌',
    actions: [
      {
        id: 'retry_sync',
        label: 'Réessayer',
        type: 'primary',
        icon: '🔄'
      },
      {
        id: 'work_offline',
        label: 'Continuer hors ligne',
        type: 'secondary',
        icon: '📱'
      }
    ],
    contextFields: [],
    tags: ['sync', 'error', 'failed']
  },

  SYNC_CONFLICT: {
    id: 'sync_conflict',
    name: 'Conflit de Synchronisation',
    category: 'sync',
    type: 'warning',
    priority: 'high',
    titleTemplate: '⚠️ Conflit de données',
    messageTemplate: 'Conflit détecté dans {{location}}',
    descriptionTemplate: 'Des modifications conflictuelles ont été détectées. Choisissez quelle version conserver.',
    icon: '⚠️',
    actions: [
      {
        id: 'resolve_conflict',
        label: 'Résoudre le conflit',
        type: 'primary',
        icon: '🔧'
      },
      {
        id: 'keep_local',
        label: 'Garder local',
        type: 'secondary',
        icon: '💻'
      },
      {
        id: 'keep_remote',
        label: 'Garder distant',
        type: 'secondary',
        icon: '☁️'
      }
    ],
    contextFields: ['missionId'],
    tags: ['sync', 'conflict', 'resolution-required']
  }
};

// 👥 TEMPLATES COLLABORATION
export const COLLABORATION_TEMPLATES: Record<string, NotificationTemplate> = {
  NEW_COMMENT: {
    id: 'new_comment',
    name: 'Nouveau Commentaire',
    category: 'collaboration',
    type: 'info',
    priority: 'medium',
    titleTemplate: '💬 Nouveau commentaire',
    messageTemplate: '{{authorName}} a commenté {{location}}',
    descriptionTemplate: '{{authorName}} a ajouté un commentaire sur {{location}} dans la mission "{{missionName}}".',
    icon: '💬',
    actions: [
      {
        id: 'view_comment',
        label: 'Voir le commentaire',
        type: 'primary',
        icon: '👁️'
      },
      {
        id: 'reply_comment',
        label: 'Répondre',
        type: 'secondary',
        icon: '↩️'
      }
    ],
    contextFields: ['missionId', 'userId'],
    tags: ['collaboration', 'comment', 'discussion']
  },

  TEAM_INVITATION: {
    id: 'team_invitation',
    name: 'Invitation Équipe',
    category: 'collaboration',
    type: 'action',
    priority: 'high',
    titleTemplate: '👥 Invitation à rejoindre une équipe',
    messageTemplate: '{{inviterName}} vous invite à rejoindre la mission "{{missionName}}"',
    descriptionTemplate: '{{inviterName}} vous a invité à collaborer sur la mission "{{missionName}}". Acceptez l\'invitation pour commencer à travailler ensemble.',
    icon: '👥',
    actions: [
      {
        id: 'accept_invitation',
        label: 'Accepter',
        type: 'primary',
        icon: '✅'
      },
      {
        id: 'decline_invitation',
        label: 'Décliner',
        type: 'secondary',
        icon: '❌'
      },
      {
        id: 'view_mission',
        label: 'Voir la mission',
        type: 'secondary',
        icon: '👁️'
      }
    ],
    contextFields: ['missionId', 'userId'],
    tags: ['collaboration', 'invitation', 'team']
  },

  REVIEW_REQUEST: {
    id: 'review_request',
    name: 'Demande de Révision',
    category: 'collaboration',
    type: 'action',
    priority: 'high',
    titleTemplate: '🔍 Demande de révision',
    messageTemplate: '{{requesterName}} demande une révision de {{location}}',
    descriptionTemplate: '{{requesterName}} a demandé votre avis d\'expert sur {{location}} dans la mission "{{missionName}}".',
    icon: '🔍',
    actions: [
      {
        id: 'start_review',
        label: 'Commencer la révision',
        type: 'primary',
        icon: '🔍'
      },
      {
        id: 'schedule_review',
        label: 'Planifier plus tard',
        type: 'secondary',
        icon: '📅'
      },
      {
        id: 'delegate_review',
        label: 'Déléguer',
        type: 'secondary',
        icon: '👤'
      }
    ],
    contextFields: ['missionId', 'userId'],
    tags: ['collaboration', 'review', 'expert-opinion']
  }
};

// 🏆 TEMPLATES ACHIEVEMENTS
export const ACHIEVEMENT_TEMPLATES: Record<string, NotificationTemplate> = {
  FIRST_WORKSHOP_COMPLETED: {
    id: 'first_workshop_completed',
    name: 'Premier Atelier Terminé',
    category: 'formation',
    type: 'achievement',
    priority: 'medium',
    titleTemplate: '🏆 Premier atelier terminé !',
    messageTemplate: 'Félicitations ! Vous avez terminé votre premier atelier EBIOS RM',
    descriptionTemplate: 'Bravo ! Vous venez de franchir une étape importante dans votre apprentissage d\'EBIOS RM. Continuez sur cette lancée !',
    icon: '🏆',
    actions: [
      {
        id: 'continue_learning',
        label: 'Continuer l\'apprentissage',
        type: 'primary',
        icon: '📚'
      },
      {
        id: 'share_achievement',
        label: 'Partager',
        type: 'secondary',
        icon: '📤'
      }
    ],
    contextFields: ['workshopId'],
    tags: ['achievement', 'first-time', 'milestone']
  },

  EXPERT_LEVEL_REACHED: {
    id: 'expert_level_reached',
    name: 'Niveau Expert Atteint',
    category: 'formation',
    type: 'achievement',
    priority: 'high',
    titleTemplate: '🎓 Niveau Expert atteint !',
    messageTemplate: 'Vous êtes maintenant un expert EBIOS RM certifié',
    descriptionTemplate: 'Félicitations ! Vous avez atteint le niveau expert en EBIOS RM. Votre expertise est maintenant reconnue.',
    icon: '🎓',
    actions: [
      {
        id: 'download_certificate',
        label: 'Télécharger le certificat',
        type: 'primary',
        icon: '📜'
      },
      {
        id: 'become_mentor',
        label: 'Devenir mentor',
        type: 'secondary',
        icon: '👨‍🏫'
      },
      {
        id: 'share_success',
        label: 'Partager le succès',
        type: 'secondary',
        icon: '🎉'
      }
    ],
    contextFields: ['userId'],
    tags: ['achievement', 'expert', 'certification']
  },

  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Score Parfait',
    category: 'formation',
    type: 'achievement',
    priority: 'medium',
    titleTemplate: '💯 Score parfait !',
    messageTemplate: '100/100 à l\'atelier {{workshopId}} - Performance exceptionnelle !',
    descriptionTemplate: 'Incroyable ! Vous avez obtenu un score parfait de 100/100 à l\'atelier {{workshopId}}. Votre maîtrise d\'EBIOS RM est remarquable.',
    icon: '💯',
    actions: [
      {
        id: 'view_analysis',
        label: 'Voir l\'analyse',
        type: 'primary',
        icon: '📊'
      },
      {
        id: 'share_score',
        label: 'Partager',
        type: 'secondary',
        icon: '📤'
      }
    ],
    contextFields: ['workshopId'],
    tags: ['achievement', 'perfect-score', 'excellence']
  }
};

// 🎯 EXPORT GLOBAL DES TEMPLATES
export const ALL_TEMPLATES = {
  ...FORMATION_TEMPLATES,
  ...REPORT_TEMPLATES,
  ...VALIDATION_TEMPLATES,
  ...SYNC_TEMPLATES,
  ...COLLABORATION_TEMPLATES,
  ...ACHIEVEMENT_TEMPLATES
};

export default ALL_TEMPLATES;

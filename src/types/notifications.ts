/**
 * 🔔 TYPES POUR LE SYSTÈME DE NOTIFICATIONS EBIOS RM
 *
 * @fileoverview Définitions TypeScript complètes pour le système de notifications
 * spécialisé dans la méthodologie EBIOS Risk Manager (EBIOS RM).
 *
 * @version 1.0.0
 * @author Équipe EBIOS RM
 * @since 2024
 *
 * @description
 * Ce fichier contient tous les types nécessaires pour gérer un système de notifications
 * robuste et spécialisé pour les applications EBIOS RM. Il inclut :
 * - Types de base pour les notifications
 * - Interfaces pour les actions et contextes
 * - Configuration et paramètres
 * - Règles de génération automatique
 * - Utilitaires et constantes
 *
 * @example
 * ```typescript
 * import { EbiosNotification, NotificationCategory } from './notifications';
 *
 * const notification: EbiosNotification = {
 *   id: 'notif_123',
 *   type: 'success',
 *   category: 'workshop',
 *   priority: 'medium',
 *   status: 'unread',
 *   title: 'Atelier terminé',
 *   message: 'Félicitations pour la completion de l\'atelier 1',
 *   actions: [],
 *   context: { workshopId: 1, missionId: 'mission_abc' },
 *   createdAt: '2024-01-01T10:00:00Z',
 *   source: 'ebios_system',
 *   tags: ['workshop', 'completion']
 * };
 * ```
 */

// 🎯 TYPES DE NOTIFICATIONS
/**
 * Types de notifications disponibles dans le système EBIOS RM
 *
 * @description Chaque type correspond à un usage spécifique :
 * - `info` : Informations générales, conseils, guides
 * - `success` : Confirmations de succès, completions d'actions
 * - `warning` : Avertissements nécessitant attention
 * - `error` : Erreurs nécessitant une action corrective
 * - `action` : Actions requises de l'utilisateur
 * - `achievement` : Badges, milestones, récompenses
 * - `reminder` : Rappels, relances, échéances
 * - `update` : Mises à jour, nouveau contenu disponible
 */
export type NotificationType =
  | 'info'           // Information générale
  | 'success'        // Succès, completion
  | 'warning'        // Avertissement, attention requise
  | 'error'          // Erreur, action corrective nécessaire
  | 'action'         // Action requise de l'utilisateur
  | 'achievement'    // Badge, milestone atteint
  | 'reminder'       // Rappel, relance
  | 'update';        // Mise à jour, nouveau contenu

// 🎯 CATÉGORIES EBIOS RM
/**
 * Catégories spécialisées pour les notifications EBIOS RM
 *
 * @description Chaque catégorie correspond à un domaine fonctionnel :
 * - `formation` : Modules de formation, progression pédagogique
 * - `workshop` : Ateliers EBIOS RM spécifiques (1 à 5)
 * - `validation` : Erreurs de validation, corrections nécessaires
 * - `report` : Rapports, exports, documents générés
 * - `sync` : Synchronisation, sauvegarde, persistance
 * - `collaboration` : Partage, commentaires, travail d'équipe
 * - `system` : Système, maintenance, mises à jour
 * - `security` : Sécurité, conformité ANSSI, alertes critiques
 */
export type NotificationCategory =
  | 'formation'      // Modules de formation, progression
  | 'workshop'       // Ateliers EBIOS RM spécifiques
  | 'validation'     // Erreurs de validation, corrections
  | 'report'         // Rapports, exports, documents
  | 'sync'           // Synchronisation, sauvegarde
  | 'collaboration'  // Partage, commentaires, équipe
  | 'system'         // Système, maintenance, updates
  | 'security';      // Sécurité, conformité ANSSI

// 🎯 PRIORITÉS
/**
 * Niveaux de priorité pour les notifications
 *
 * @description Détermine l'urgence et le comportement de la notification :
 * - `low` : Information non urgente, peut être ignorée temporairement
 * - `medium` : Information importante, attention recommandée
 * - `high` : Action recommandée rapidement, notification persistante
 * - `urgent` : Action immédiate requise, notification critique avec son
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// 🎯 STATUTS
/**
 * États possibles d'une notification
 *
 * @description Cycle de vie d'une notification :
 * - `unread` : Nouvelle notification non lue
 * - `read` : Notification lue par l'utilisateur
 * - `archived` : Notification archivée mais conservée
 * - `dismissed` : Notification ignorée/supprimée
 */
export type NotificationStatus = 'unread' | 'read' | 'archived' | 'dismissed';

// 🎯 ACTIONS DISPONIBLES
/**
 * Interface pour les actions disponibles dans une notification
 *
 * @description Définit les boutons d'action que l'utilisateur peut déclencher
 * directement depuis la notification. Supporte la navigation, les callbacks
 * et les actions externes.
 *
 * @example
 * ```typescript
 * const action: NotificationAction = {
 *   id: 'view_workshop',
 *   label: 'Voir l\'atelier',
 *   type: 'primary',
 *   icon: '🎯',
 *   url: '/workshops/1'
 * };
 * ```
 */
export interface NotificationAction {
  /** Identifiant unique de l'action */
  id: string;
  /** Texte affiché sur le bouton */
  label: string;
  /** Style visuel du bouton */
  type: 'primary' | 'secondary' | 'danger';
  /** Icône optionnelle (emoji ou classe CSS) */
  icon?: string;
  /** URL de navigation (alternative à onClick) */
  url?: string;
  /** Callback à exécuter (alternative à url) */
  onClick?: () => void | Promise<void>;
  /** Indique si l'URL s'ouvre dans un nouvel onglet */
  external?: boolean;
}

// 🎯 CONTEXTE DE NAVIGATION
export interface NotificationContext {
  module?: string;           // Module concerné (formation, workshop, etc.)
  workshopId?: number;       // ID de l'atelier spécifique
  stepId?: string;          // Étape spécifique dans un atelier
  missionId?: string;       // ID de la mission
  reportId?: string;        // ID du rapport
  userId?: string;          // Utilisateur concerné
  sessionId?: string;       // Session de formation
  errorCode?: string;       // Code d'erreur spécifique
  metadata?: Record<string, any>; // Données additionnelles
}

// 🎯 STRUCTURE PRINCIPALE D'UNE NOTIFICATION
export interface EbiosNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  
  // Contenu
  title: string;
  message: string;
  description?: string;
  icon?: string;
  image?: string;
  
  // Actions
  actions: NotificationAction[];
  primaryAction?: NotificationAction;
  
  // Navigation et contexte
  context: NotificationContext;
  deepLink?: string;        // Lien direct vers l'écran concerné
  
  // Métadonnées
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  source: string;           // Source de la notification
  tags: string[];           // Tags pour filtrage
  
  // Personnalisation
  persistent?: boolean;     // Ne pas supprimer automatiquement
  sound?: boolean;          // Jouer un son
  vibrate?: boolean;        // Vibration (mobile)
}

// 🎯 PARAMÈTRES DE NOTIFICATION
export interface NotificationSettings {
  enabled: boolean;
  categories: {
    [K in NotificationCategory]: {
      enabled: boolean;
      priority: NotificationPriority;
      sound: boolean;
      desktop: boolean;
      email: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;    // Format HH:mm
    end: string;      // Format HH:mm
  };
  frequency: {
    immediate: boolean;
    digest: boolean;
    digestFrequency: 'hourly' | 'daily' | 'weekly';
  };
  maxNotifications: number;
  autoArchiveAfterDays: number;
}

// 🎯 FILTRES POUR LES NOTIFICATIONS
export interface NotificationFilters {
  types?: NotificationType[];
  categories?: NotificationCategory[];
  priorities?: NotificationPriority[];
  statuses?: NotificationStatus[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  tags?: string[];
}

// 🎯 STATISTIQUES DES NOTIFICATIONS
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  recentActivity: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

// 🎯 ÉVÉNEMENTS DU SYSTÈME DE NOTIFICATIONS
export interface NotificationEvent {
  type: 'created' | 'read' | 'dismissed' | 'archived' | 'clicked' | 'action_performed';
  notificationId: string;
  actionId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// 🎯 TEMPLATE POUR CRÉER DES NOTIFICATIONS
export interface NotificationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  type: NotificationType;
  priority: NotificationPriority;
  titleTemplate: string;
  messageTemplate: string;
  descriptionTemplate?: string;
  icon?: string;
  actions: Omit<NotificationAction, 'onClick'>[];
  contextFields: (keyof NotificationContext)[];
  tags: string[];
}

// 🎯 RÈGLES DE GÉNÉRATION AUTOMATIQUE
export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    event: string;
    conditions: Record<string, any>;
  };
  template: NotificationTemplate;
  cooldown?: number;        // Délai minimum entre notifications similaires (ms)
  maxPerDay?: number;       // Limite par jour
  targetUsers?: string[];   // Utilisateurs ciblés (vide = tous)
}

// 🎯 CONFIGURATION DU SERVICE
export interface NotificationServiceConfig {
  maxStoredNotifications: number;
  defaultExpirationDays: number;
  enablePersistence: boolean;
  enableRealTime: boolean;
  enableDesktopNotifications: boolean;
  enableSounds: boolean;
  soundUrls: Record<NotificationType, string>;
  retryAttempts: number;
  retryDelay: number;
}

// 🎯 ÉTAT DU SERVICE
export interface NotificationServiceState {
  notifications: EbiosNotification[];
  settings: NotificationSettings;
  stats: NotificationStats;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  permission: NotificationPermission;
}

// 🎯 EXPORTS UTILITAIRES
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  categories: {
    formation: { enabled: true, priority: 'medium', sound: true, desktop: true, email: false },
    workshop: { enabled: true, priority: 'high', sound: true, desktop: true, email: false },
    validation: { enabled: true, priority: 'high', sound: true, desktop: true, email: true },
    report: { enabled: true, priority: 'medium', sound: false, desktop: true, email: true },
    sync: { enabled: true, priority: 'low', sound: false, desktop: false, email: false },
    collaboration: { enabled: true, priority: 'medium', sound: true, desktop: true, email: true },
    system: { enabled: true, priority: 'low', sound: false, desktop: true, email: false },
    security: { enabled: true, priority: 'urgent', sound: true, desktop: true, email: true }
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  frequency: {
    immediate: true,
    digest: false,
    digestFrequency: 'daily'
  },
  maxNotifications: 100,
  autoArchiveAfterDays: 30
};

export const NOTIFICATION_ICONS: Record<NotificationCategory, string> = {
  formation: '🎓',
  workshop: '🔧',
  validation: '⚠️',
  report: '📊',
  sync: '🔄',
  collaboration: '👥',
  system: '⚙️',
  security: '🛡️'
};

export const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-orange-600 bg-orange-100',
  urgent: 'text-red-600 bg-red-100'
};

// 🎯 ALIAS POUR COMPATIBILITÉ
export type Notification = EbiosNotification;
